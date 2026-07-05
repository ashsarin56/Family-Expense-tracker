const User=require('../models/User');

function getDashboard(req,res){
    try{
        res.render('dashboard');
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
module.exports={getDashboard};