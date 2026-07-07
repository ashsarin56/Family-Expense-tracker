const Family=require('../models/Family');
const User=require('../models/User');
const crypto=require('crypto');

async function getCreateFamilyPage(req,res){
    try{
        const familyId=req.session.user.family_id;
        if(familyId)res.redirect('/family');
        else res.render('createfamily');
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function createFamily(req,res){
    try{
        const {name}=req.body;
        if(!name)throw new Error("Family name is required");
        const inviteCode=crypto.randomBytes(4).toString('hex');
        const result=await Family.createFamily(name,inviteCode,req.session.user.id);
        req.session.user.family_id=result.insertId;
        res.redirect('/family');
    }
    catch(e){
        console.log(`Error in creating family:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function getJoinFamilyPage(req,res){
    try{
        const familyId=req.session.user.family_id;
        if(familyId)res.redirect('/family');
        else res.render('joinFamily');
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function joinFamily(req,res){
    try{
        const {inviteCode}=req.body;
        if(!inviteCode)throw new Error("Invite code is required");
        const family=await Family.findByInviteCode(inviteCode);
        await Family.joinFamily(req.session.user.id,family.id);
        req.session.user.family_id=family.id;
        res.redirect('/family');
    }
    catch(e){
        console.log(`Error in joining family:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function getFamilyPage(req,res){
    try{
        const familyId=req.session.user.family_id;
        if(!familyId)return res.redirect('/family/create');
        const family=await Family.getFamilyById(familyId);
        const members=await Family.getFamilyMembers(familyId);
        res.render('family',{family,members,user:req.session.user});
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
module.exports={getCreateFamilyPage,createFamily,getJoinFamilyPage,joinFamily,getFamilyPage};