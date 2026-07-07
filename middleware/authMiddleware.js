const session=require('express-session');
const User=require('../models/User');

function isAuthenticated(req,res,next){
        if(req.session.user){
            return next();
        }
        res.redirect('/auth/login');
}
module.exports=isAuthenticated;