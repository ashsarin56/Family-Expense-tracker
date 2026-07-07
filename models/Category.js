const db=require('../config/db.js');
const Category={
    async createCategory(name,familyId){
        const [existing]=await db.query("select * from categories where name=? and family_id=?",[name,familyId]);
        if(existing.length>0)throw new Error("Category already exists");
        const [result]=await db.query("insert into categories (name,family_id) values(?,?)",[name,familyId]);
        return result;
    },
    async getCategoriesByFamily(familyId){
        const [result]=await db.query("select * from categories where family_id=? order by name",[familyId]);
        return result;
    },
    async getCategoryById(id){
        const [result]=await db.query("select * from categories where id=?",[id]);
        if(result.length==0)throw new Error("Category not found!");
        return result[0];
    },
    async deleteCategory(id){
        const [result]=await db.query("delete from categories where id=?",[id]);
        return result;
    }
}
module.exports=Category;
