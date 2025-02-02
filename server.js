
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require("./config/mongoose-connection");
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./routes/home');
const authRouter = require('./routes/authRoutes');
const postRoutes = require("./routes/postRoutes");


app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
app.use(cors()); 

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 

const PORT = process.env.PORT || 8000; 
connectDB()
app.use('/', router);
app.use("/api", authRouter);
app.use("/api/posts", postRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

