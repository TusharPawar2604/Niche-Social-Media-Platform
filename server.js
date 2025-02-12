const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require("./config/mongoose-connection");
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');
const upload = require("./config/multer");

const router = require('./routes/home');
const authRouter = require('./routes/authRoutes');
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");
const fs = require('fs');

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
app.use(cors()); 

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 

// Serve uploaded files statically

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const PORT = process.env.PORT; 
connectDB()
app.use('/', router);
app.use("/api", authRouter);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
