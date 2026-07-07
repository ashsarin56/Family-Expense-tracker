const db=require('../config/db.js');
const Expense={
    async createExpense(amount,description,categoryId,userId,familyId){
        const [result]=await db.query("insert into expenses (amount,description,category_id,user_id,family_id) values(?,?,?,?,?)",[amount,description,categoryId,userId,familyId]);
        return result;
    },
    async getExpensesByFamily(familyId){
        const [result]=await db.query(`
            select e.id,e.amount,e.description,e.created_at,
            u.name as user_name,c.name as category_name
            from expenses e
            join users u on e.user_id=u.id
            join categories c on e.category_id=c.id
            where e.family_id=?
            order by e.created_at desc`,[familyId]);
        return result;
    },
    async getExpenseById(id){
        const [result]=await db.query("select * from expenses where id=?",[id]);
        if(result.length==0)throw new Error("Expense not found!");
        return result[0];
    },
    async updateExpense(id,amount,description,categoryId){
        const [result]=await db.query("update expenses set amount=?,description=?,category_id=? where id=?",[amount,description,categoryId,id]);
        return result;
    },
    async deleteExpense(id){
        const [result]=await db.query("delete from expenses where id=?",[id]);
        return result;
    },
    async getExpensesByMonth(familyId,month,year){
        const [result]=await db.query(`
            select e.id,e.amount,e.description,e.created_at,
            u.name as user_name,c.name as category_name
            from expenses e
            join users u on e.user_id=u.id
            join categories c on e.category_id=c.id
            where e.family_id=? and month(e.created_at)=? and year(e.created_at)=?
            order by e.created_at desc`,[familyId,month,year]);
        return result;
    },
    async getMonthlySummary(familyId,month,year){
        const [result]=await db.query(`
            select c.name as category_name,
            sum(e.amount) as total,count(e.id) as count
            from expenses e
            join categories c on e.category_id=c.id
            where e.family_id=? and month(e.created_at)=? and year(e.created_at)=?
            group by c.name order by total desc`,[familyId,month,year]);
        return result;
    },
    async getUserWiseSpending(familyId,month,year){
        const [result]=await db.query(`
            select u.name as user_name,
            sum(e.amount) as total,count(e.id) as count
            from expenses e
            join users u on e.user_id=u.id
            where e.family_id=? and month(e.created_at)=? and year(e.created_at)=?
            group by u.name order by total desc`,[familyId,month,year]);
        return result;
    }
}
module.exports=Expense;
