const router=require('express').Router();
const isAuthenticated=require('../middleware/authMiddleware');
const {getAddExpensePage,addExpense,getExpensesPage,getEditExpensePage,updateExpense,deleteExpense}=require('../controllers/expenseController');

router.get('/',isAuthenticated,getExpensesPage);
router.get('/add',isAuthenticated,getAddExpensePage);
router.post('/add',isAuthenticated,addExpense);
router.get('/edit/:id',isAuthenticated,getEditExpensePage);
router.post('/edit/:id',isAuthenticated,updateExpense);
router.get('/delete/:id',isAuthenticated,deleteExpense);
module.exports=router;
