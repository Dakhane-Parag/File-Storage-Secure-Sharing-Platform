import express from "express";
import dotenv from "dotenv";
import dbconnect from "./config/dbconnect.js";
import authRoutes from "./routes/auth.js";
import authmiddleware from "./middlewares/authmiddleware.js";
import fileRoutes from "./routes/fileRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

dotenv.config();
dbconnect();

const app = express();
const port = process.env.PORT;

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Backend is running!!");
});

app.get("/api/protected", authmiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

app.use("/api/auth/", authRoutes);

app.use("/api/files/", fileRoutes);

app.use("/api/share/",shareRoutes);

app.listen(port, () => {
  console.log("Server running on the port " + port);
});
