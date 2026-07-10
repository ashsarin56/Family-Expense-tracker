const Expense=require('../models/Expense');
const {GoogleGenAI}=require('@google/genai');
const dotenv=require('dotenv');
dotenv.config();

const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
const models=["gemini-3.1-flash-lite","gemini-2.5-flash-lite","gemini-3.5-flash","gemini-3-flash","gemini-2.5-flash"];
let currentModelIndex=0;

// cache: key = "familyId-month-year", value = {insight, expenseCount}
const insightCache={};

async function getNewModel(prompt){
    for(let i=0;i<models.length;i++){
        const modelIndex=(currentModelIndex+i)%models.length;
        const modelName=models[modelIndex];
        try{
            console.log(`trying model: ${modelName}`);
            const response=await ai.models.generateContent({model:modelName,contents:prompt});
            currentModelIndex=modelIndex;
            return response.text;
        }
        catch(e){
            const errorMsg=e.message.toLowerCase();
            if(errorMsg.includes('quota')&&errorMsg.includes('exceeded')){
                console.log(`model ${modelName} quota exceeded, switching to next model...`);
                continue;
            }
            throw e;
        }
    }
    throw new Error("all AI models exhausted try again later.");
}

async function getInsightsPage(req,res){
    try{
        const familyId=req.session.user.family_id;
        if(!familyId)return res.redirect('/family/create');
        const now=new Date();
        const month=req.query.month||now.getMonth()+1;
        const year=req.query.year||now.getFullYear();
        const summary=await Expense.getMonthlySummary(familyId,month,year);
        const userWise=await Expense.getUserWiseSpending(familyId,month,year);
        const expenses=await Expense.getExpensesByMonth(familyId,month,year);
        const totalSpent=summary.reduce((acc,item)=>acc+parseFloat(item.total),0);
        res.render('insights',{summary,userWise,expenses,totalSpent,month,year,user:req.session.user,aiInsight:null});
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function getAIInsight(req,res){
    try{
        const familyId=req.session.user.family_id;
        if(!familyId)return res.redirect('/family/create');
        const now=new Date();
        const month=req.query.month||now.getMonth()+1;
        const year=req.query.year||now.getFullYear();
        const summary=await Expense.getMonthlySummary(familyId,month,year);
        const userWise=await Expense.getUserWiseSpending(familyId,month,year);
        const expenses=await Expense.getExpensesByMonth(familyId,month,year);
        const totalSpent=summary.reduce((acc,item)=>acc+parseFloat(item.total),0);
        let aiInsight="No data available for AI analysis.";
        if(summary.length>0){
            const cacheKey=`${familyId}-${month}-${year}`;
            const cached=insightCache[cacheKey];
            if(cached&&cached.expenseCount===expenses.length){
                console.log(`serving cached insight for ${cacheKey}`);
                aiInsight=cached.insight;
            }
            else{
                const prompt=`You are a family finance advisor. Analyze this family's monthly expense data and give practical, friendly advice in 4-5 bullet points.
            Monthly Summary (Category wise):
            ${summary.map(s=>`- ${s.category_name}: ₹${s.total} (${s.count} transactions)`).join('\n')}
            Member wise spending:
            ${userWise.map(u=>`- ${u.user_name}: ₹${u.total} (${u.count} transactions)`).join('\n')}
            Total spent this month: ₹${totalSpent}
            Give short, actionable tips. Mention specific categories if spending seems high. Keep it under 150 words.`;
                aiInsight=await getNewModel(prompt);
                insightCache[cacheKey]={insight:aiInsight,expenseCount:expenses.length};
                console.log(`cached insight for ${cacheKey}`);
            }
        }
        res.render('insights',{summary,userWise,expenses,totalSpent,month,year,user:req.session.user,aiInsight});
    }
    catch(e){
        console.log(`Error in AI insight:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
module.exports={getInsightsPage,getAIInsight};
