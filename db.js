const {Pool}=require("pg");
const bcrypt=require("bcryptjs");
const pool=new Pool({connectionString:process.env.DATABASE_URL});
async function initDb(){
await pool.query(`
CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,name TEXT DEFAULT 'Admin',role TEXT DEFAULT 'admin',created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS orders(id SERIAL PRIMARY KEY,order_number TEXT,customer_name TEXT,customer_email TEXT,status TEXT DEFAULT 'pending',financial_status TEXT,fulfillment_status TEXT,total NUMERIC(14,2) DEFAULT 0,currency TEXT DEFAULT 'PKR',raw JSONB,order_date TIMESTAMPTZ,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY,title TEXT NOT NULL,sku TEXT,quantity INTEGER DEFAULT 0,price NUMERIC(14,2) DEFAULT 0,raw JSONB,updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS customers(id SERIAL PRIMARY KEY,name TEXT,email TEXT,phone TEXT,orders_count INTEGER DEFAULT 0,total_spent NUMERIC(14,2) DEFAULT 0,raw JSONB,updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS expenses(id SERIAL PRIMARY KEY,title TEXT NOT NULL,category TEXT,amount NUMERIC(14,2) NOT NULL,note TEXT,spent_at DATE DEFAULT CURRENT_DATE,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS khata(id SERIAL PRIMARY KEY,type TEXT NOT NULL CHECK(type IN('receivable','payable')),person TEXT NOT NULL,amount NUMERIC(14,2) NOT NULL,paid NUMERIC(14,2) DEFAULT 0,due_date DATE,description TEXT,notes TEXT,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS production(id SERIAL PRIMARY KEY,article TEXT NOT NULL,qty INTEGER DEFAULT 1,fabric NUMERIC(14,2) DEFAULT 0,stitching NUMERIC(14,2) DEFAULT 0,embroidery NUMERIC(14,2) DEFAULT 0,printing NUMERIC(14,2) DEFAULT 0,packaging NUMERIC(14,2) DEFAULT 0,other_cost NUMERIC(14,2) DEFAULT 0,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS payments(id SERIAL PRIMARY KEY,vendor TEXT NOT NULL,amount NUMERIC(14,2) NOT NULL,method TEXT,note TEXT,paid_at DATE DEFAULT CURRENT_DATE,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS invoices(id SERIAL PRIMARY KEY,invoice_no TEXT UNIQUE NOT NULL,customer_name TEXT,customer_phone TEXT,items JSONB NOT NULL,total NUMERIC(14,2) DEFAULT 0,status TEXT DEFAULT 'unpaid',created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY DEFAULT 1,brand_name TEXT DEFAULT 'Nura',currency TEXT DEFAULT 'PKR',delivery_fee NUMERIC(14,2) DEFAULT 250,free_delivery_above NUMERIC(14,2) DEFAULT 5000);
`);
if(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD){
const r=await pool.query("SELECT id FROM users WHERE email=$1",[process.env.ADMIN_EMAIL]);
if(!r.rowCount){const h=await bcrypt.hash(process.env.ADMIN_PASSWORD,12);await pool.query("INSERT INTO users(email,password_hash) VALUES($1,$2)",[process.env.ADMIN_EMAIL,h]);}
}
}
module.exports={pool,initDb};