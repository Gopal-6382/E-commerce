import express from "express";
import { loginUser, registerUser, adminLogin } from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLogin);

// Protected admin route example
router.get("/admin/dashboard", adminAuth, (req, res) => {
  res.json({ 
    success: true, 
    message: "Welcome to admin dashboard",
    user: req.user
  });
});

export default router;