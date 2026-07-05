const router=require('express').Router();
const {getDashboard}=require('../controllers/dashboardController');
const isAuthenticated=require('../middleware/authMiddleware');

router.get('/',isAuthenticated,getDashboard);
module.exports=router;