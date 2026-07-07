const db=require('../config/db.js');
const Family={
    async createFamily(name,inviteCode,createdBy){
        const [result]=await db.query("insert into families (name,invite_code,created_by) values(?,?,?)",[name,inviteCode,createdBy]);
        await db.query('update users set family_id=? where id=?',[result.insertId,createdBy]);
        return result;
    },
    async findByInviteCode(inviteCode){
        const [result]=await db.query("select * from families where invite_code=?",[inviteCode]);
        if(result.length==0)throw new Error("Family not found!");
        return result[0];
    },
    async joinFamily(userId,familyId){
        const [result]=await db.query("update users set family_id=? where id=?",[familyId,userId]);
        return result;
    },
    async getFamilyMembers(familyId){
        const [result]=await db.query("select id,name,email,role from users where family_id=?",[familyId]);
        return result;
    },
    async getFamilyById(familyId){
        const [result]=await db.query("select * from families where id=?",[familyId]);
        if(result.length==0)throw new Error("Family not found!");
        return result[0];
    }
}
module.exports=Family;