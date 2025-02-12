const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// exports.registerUser =  async (req, res) => {
//   console.log(req.body);
//     try {
//       const { username, email, password } = req.body;
//       console.log(username, email, password);
      
  
//       // Check if user already exists with same email or username
//       const existingUser = await User.findOne({ 
//         $or: [
//           { email },
//           { username }
//         ]
//       });
      
//       if (existingUser) {
//         if (existingUser.email === email) {
//           return res.status(400).json({ message: "Email already in use" });
//         }
//         if (existingUser.username === username) {
//           return res.status(400).json({ message: "Username already taken. Please try a different username." });
//         }
//       }

//       // Hash password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
  
//       // Save user
//       const newUser = new User({ username, email, password: hashedPassword });
//       await newUser.save();

//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      
//       res.cookie("token", token);
//       res.json({ token, user: newUser });
  
//      if(!error){
//        res.status(201).json({ message: "User registered successfully" });
//      }

//     } catch (error) {
//       console.error("Registration Error:", error);
//       res.status(500).json({ message: "Server Error" });
//     }
//   };
  

 // Ensure correct model import

exports.registerUser = async (req, res) => {
  console.log("Registration Request Body:", req.body);
  try {
    const { username, email, password } = req.body;
    console.log("Received Data:", username, email, password);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already in use" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
      },
    });

  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
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