const router=require('express').Router();
const isAuthenticated=require('../middleware/authMiddleware');
const {getCreateFamilyPage,createFamily,getJoinFamilyPage,joinFamily,getFamilyPage}=require('../controllers/FamilyController');

router.get('/create',isAuthenticated,getCreateFamilyPage);
router.post('/create',isAuthenticated,createFamily);
router.get('/join',isAuthenticated,getJoinFamilyPage);
router.post('/join',isAuthenticated,joinFamily);
router.get('/',isAuthenticated,getFamilyPage);
module.exports=router;
