const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser =  async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if user already exists with same email or username
      const existingUser = await User.findOne({ 
        $or: [
          { email },
          { username }
        ]
      });
      
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ message: "Email already in use" });
        }
        if (existingUser.username === username) {
          return res.status(400).json({ message: "Username already taken. Please try a different username." });
        }
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Save user
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  


exports.loginUser = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        res.cookie("token", token);
        res.json({ token, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.logoutUser = (req, res) => {
    // Clear the token from the client-side (in cookies or headers)
    try {
        res.clearCookie("token");  // If you're using cookies
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
  };