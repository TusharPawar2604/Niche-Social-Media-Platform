
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.authMiddleware = async (req, res, next) => {
  let token = req.header("Authorization");

  // Token check karna
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    // Ensure "Bearer " hata ke sirf token le
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};



