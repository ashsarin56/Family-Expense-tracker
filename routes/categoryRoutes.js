const router=require('express').Router();
const isAuthenticated=require('../middleware/authMiddleware');
const {getCategoriesPage,createCategory,deleteCategory}=require('../controllers/categoryController');

router.get('/',isAuthenticated,getCategoriesPage);
router.post('/',isAuthenticated,createCategory);
router.get('/delete/:id',isAuthenticated,deleteCategory);
module.exports=router;
