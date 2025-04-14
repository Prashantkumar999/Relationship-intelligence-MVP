const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// db connection 
connectDB();

//routes 
// app.use("/api/ai",require("./routes/aiRoutes"))
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API Running")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})