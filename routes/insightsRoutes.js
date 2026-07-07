const router=require('express').Router();
const isAuthenticated=require('../middleware/authMiddleware');
const {getInsightsPage,getAIInsight}=require('../controllers/insightsController');

router.get('/',isAuthenticated,getInsightsPage);
router.get('/ai',isAuthenticated,getAIInsight);
module.exports=router;
