import express from "express";
import dotenv from "dotenv";
import dbconnect from "./config/dbconnect.js";
import authRoutes from "./routes/auth.js"

dotenv.config();
dbconnect();

const app = express();
const port = process.env.PORT;

app.use(express.json());


app.use("/api/auth/", authRoutes);

app.get('/',(req,res) =>{
  res.send("Backend is running!!");
})

app.listen(port , () =>{
  console.log("Server running on the port "+ port);
})