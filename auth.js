const jwt=require("jsonwebtoken"),bcrypt=require("bcryptjs");
const {pool}=require("./db");
async function login(email,password){
const r=await pool.query("SELECT * FROM users WHERE email=$1",[email]); if(!r.rowCount)return null;
const u=r.rows[0]; if(!(await bcrypt.compare(password,u.password_hash)))return null;
return {token:jwt.sign({id:u.id,email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:"7d"}),user:{id:u.id,email:u.email,name:u.name,role:u.role}};
}
function auth(req,res,next){const h=req.headers.authorization||"";try{if(!h.startsWith("Bearer "))throw 0;req.user=jwt.verify(h.slice(7),process.env.JWT_SECRET);next()}catch(e){res.status(401).json({error:"Session expired. Please login again."})}}
module.exports={login,auth};