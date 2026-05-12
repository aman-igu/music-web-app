require('dotenv').config();
const app=require('./src/app');

const connectDB = require('./src/db/db');
connectDB();
console.log("Connected to MongoDB");

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})