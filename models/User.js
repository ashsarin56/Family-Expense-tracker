const db=require('../config/db.js');
const bcrypt=require('bcryptjs');
const User={
    async createUser(name,email,password,role){
        const normalizedEmail=email.trim().toLowerCase();
        const passwordHash=await bcrypt.hash(password,10);
        const [user]=await db.query("select * from users where email=?",[normalizedEmail]);
        // console.log(user);
        if(user.length>0){
            throw new Error("User already exists");
        }
        const [result]=await db.query("insert into users (name,email,password,role) values (?,?,?,?)",[name,normalizedEmail,passwordHash,role.trim().toUpperCase()]);
        return result;
    },
    async findByEmail(email){
        const normalizedEmail=email.trim().toLowerCase();
        const [results]=await db.query('select * from users where email=?',[normalizedEmail]);
        if(results.length==0){
            throw new Error("User not found!");
        }
        console.log("User retrieved successfully");
        return results[0];
    },
    async getFamilyId(userId){
    const [result]=await db.query('select family_id from users where id=?',[userId]);
    if(result[0]==null)return -1;
    return result[0];
}
}
module.exports=User;