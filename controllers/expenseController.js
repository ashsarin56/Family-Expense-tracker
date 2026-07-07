const Expense=require('../models/Expense');
const Category=require('../models/Category');

async function getAddExpensePage(req,res){
    try{
        const familyId=req.session.user.family_id;
        if(!familyId)return res.redirect('/family/create');
        const categories=await Category.getCategoriesByFamily(familyId);
        res.render('addExpense',{categories,user:req.session.user});
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function addExpense(req,res){
    try{
        const {amount,description,categoryId}=req.body;
        const userId=req.session.user.id;
        const familyId=req.session.user.family_id;
        if(!amount || !description || !categoryId)throw new Error("All fields are required");
        if(!familyId)return res.redirect('/family/create');
        await Expense.createExpense(parseFloat(amount),description.trim(),categoryId,userId,familyId);
        console.log(`Expense added:${description} - ${amount}`);
        res.redirect('/expenses');
    }
    catch(e){
        console.log(`Error in adding expense:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function getExpensesPage(req,res){
    try{
        const familyId=req.session.user.family_id;
        if(!familyId)return res.redirect('/family/create');
        const expenses=await Expense.getExpensesByFamily(familyId);
        res.render('expenses',{expenses,user:req.session.user});
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function getEditExpensePage(req,res){
    try{
        const {id}=req.params;
        const familyId=req.session.user.family_id;
        const expense=await Expense.getExpenseById(id);
        const categories=await Category.getCategoriesByFamily(familyId);
        res.render('editExpense',{expense,categories,user:req.session.user});
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function updateExpense(req,res){
    try{
        const {id}=req.params;
        const {amount,description,categoryId}=req.body;
        if(!amount || !description || !categoryId)throw new Error("All fields are required");
        await Expense.updateExpense(id,parseFloat(amount),description.trim(),categoryId);
        console.log(`Expense updated:${id}`);
        res.redirect('/expenses');
    }
    catch(e){
        console.log(`Error in updating expense:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function deleteExpense(req,res){
    try{
        const {id}=req.params;
        await Expense.deleteExpense(id);
        console.log(`Expense deleted:${id}`);
        res.redirect('/expenses');
    }
    catch(e){
        console.log(`Error in deleting expense:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
module.exports={getAddExpensePage,addExpense,getExpensesPage,getEditExpensePage,updateExpense,deleteExpense};
