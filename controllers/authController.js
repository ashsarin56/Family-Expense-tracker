const User=require("../models/User");
const bcrypt=require("bcryptjs");
function getRegisterPage(req,res){
    try{
        res.render('register',{error:null});
    }
    catch(e){
        console.log(`Error occurred : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}

async function registerUser(req,res){
    try{
        const {name,email,password,role}=req.body;
        if(!name || !email || !password || !role){
            return res.render('register',{error:"All fields are required"});
        }
        const user=await User.createUser(name,email,password,role);
        console.log(`User created successfully:`);
        res.redirect('/auth/login');
    }
    catch(e){
        console.log(`Error in user creation : ${e.message}`);
        if(e.message==="User already exists"){
            return res.render('register',{error:"An account with this email already exists"});
        }
        res.render('register',{error:"Something went wrong. Please try again."});
    }
}
async function getLoginPage(req,res){
    try{
        res.render('login',{error:null});
    }
    catch(e){
        console.log(`Error occurred : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function loginUser(req,res){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.render('login',{error:"All fields are required"});
        }
        const user=await User.findByEmail(email);
        const isCorrect=await bcrypt.compare(password,user.password);
        if(isCorrect){
            console.log(`User logged in successfully`);
            req.session.user={ id: user.id, name: user.name, email: user.email, role: user.role, family_id: user.family_id };
            req.session.save(()=>res.redirect('/dashboard'));
        }
        else{
            return res.render('login',{error:"Invalid email or password"});
        }
    }
    catch(e){
        console.log(`Error in user login : ${e.message}`);
        if(e.message==="User not found!"){
            return res.render('login',{error:"Invalid email or password"});
        }
        res.render('login',{error:"Something went wrong. Please try again."});
    }
}
async function logout(req,res){
    try{
        req.session.destroy(()=>{
            console.log(`User logged out successfully`);
            res.redirect('/');
        });
    }
    catch(e){
        console.log(`Error in user logout : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
module.exports={getRegisterPage,registerUser,getLoginPage,loginUser,logout}