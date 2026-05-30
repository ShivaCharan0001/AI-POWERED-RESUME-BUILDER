import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT Verification Error :", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default protect;
