import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied" 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired" 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token" 
    });
  }
};

export default adminAuth;