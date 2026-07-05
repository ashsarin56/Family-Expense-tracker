const router=require('express').Router();
const {getRegisterPage,registerUser,getLoginPage,loginUser,logout}=require('../controllers/authController');
const isAuthenticated=require('../middleware/authMiddleware');

router.get('/register',getRegisterPage);
router.post('/register',registerUser);
router.get('/login',getLoginPage);
router.post('/login',loginUser);
router.get('/logout',isAuthenticated,logout);
module.exports=router;