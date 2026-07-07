const Category=require('../models/Category');

async function getCategoriesPage(req,res){
    try{
        const familyId=req.session.user.family_id;
        if(!familyId)return res.redirect('/family/create');
        const categories=await Category.getCategoriesByFamily(familyId);
        res.render('categories',{categories,user:req.session.user});
    }
    catch(e){
        console.log(`Error:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function createCategory(req,res){
    try{
        const {name}=req.body;
        const familyId=req.session.user.family_id;
        if(!name)throw new Error("Category name is required");
        if(!familyId)return res.redirect('/family/create');
        await Category.createCategory(name.trim(),familyId);
        console.log(`Category created:${name}`);
        res.redirect('/categories');
    }
    catch(e){
        console.log(`Error in creating category:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
async function deleteCategory(req,res){
    try{
        const {id}=req.params;
        await Category.deleteCategory(id);
        console.log(`Category deleted:${id}`);
        res.redirect('/categories');
    }
    catch(e){
        console.log(`Error in deleting category:${e.message}`);
        res.status(500).send('Internal Server Error');
    }
}
module.exports={getCategoriesPage,createCategory,deleteCategory};
