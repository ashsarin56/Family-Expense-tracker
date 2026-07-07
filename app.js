const express=require('express');
const dotenv=require('dotenv');
const colors=require('colors');
const path=require('path');
const session=require('express-session');
const authRoutes=require('./routes/authRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');
const familyRoutes=require('./routes/FamilyRoutes');
const categoryRoutes=require('./routes/categoryRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const insightsRoutes=require('./routes/insightsRoutes');

const app=express();
dotenv.config();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const PORT=process.env.PORT || 3000;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24
    }
}));
app.use('/auth',authRoutes);
app.use('/dashboard',dashboardRoutes);
app.use('/family',familyRoutes);
app.use('/categories',categoryRoutes);
app.use('/expenses',expenseRoutes);
app.use('/insights',insightsRoutes);

app.get('/',(req,res)=>{
    res.render('landing');
})

app.listen(PORT,()=>{
    console.log(`server is running on PORT: ${PORT}`.green.bold);
})
