import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization; // Expect "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach user ID to request
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
