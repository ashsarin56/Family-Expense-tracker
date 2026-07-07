const User=require("../models/User");
const bcrypt=require("bcryptjs");
function getRegisterPage(req,res){
    try{
        res.render('register');
    }
    catch(e){
        console.log(`Error occurred : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}

async function registerUser(req,res){
    try{
        const {name,email,password,role}=req.body;
        if(!name || !email || !password || !role)throw new Error("All fields are required");
        const user=await User.createUser(name,email,password,role);
        console.log(`User created successfully:`);
        res.redirect('/auth/login');
    }
    catch(e){
        console.log(`Error in user creation : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function getLoginPage(req,res){
    try{
        res.render('login');
    }
    catch(e){
        console.log(`Error occurred : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function loginUser(req,res){
    try{
        const {email,password}=req.body;
        if(!email || !password)throw new Error("All fields are required");
        const user=await User.findByEmail(email);
        const isCorrect=await bcrypt.compare(password,user.password);
        if(isCorrect){
            console.log(`User logged in successfully`);
            req.session.user={ id: user.id, name: user.name, email: user.email, role: user.role, family_id: user.family_id };
            res.redirect('/dashboard');
        }
        else{
            throw new Error("Invalid credentials");
        }
    }
    catch(e){
        console.log(`Error in user login : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function logout(req,res){
    try{
        req.session.destroy();
        console.log(`User logged out successfully`);
        res.redirect('/');
    }
    catch(e){
        console.log(`Error in user logout : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
module.exports={getRegisterPage,registerUser,getLoginPage,loginUser,logout}