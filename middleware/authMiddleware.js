const session=require('express-session');
const User=require('../models/User');

function isAuthenticated(req,res,next){
    try{
        if(req.session.user)next();
        else throw new Error("User not authenticated");
    }
    catch(e){
        console.log(`Error in authentication : ${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
module.exports=isAuthenticated;