const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/authMiddleware");


const { profileController , completeProfile } = require("../controllers/profileController");
const upload = require("../config/multer");


router.post("/complete-profile", upload.single('profilePic') ,  completeProfile);
router.get("/user/:id", authMiddleware, profileController)

module.exports = router;