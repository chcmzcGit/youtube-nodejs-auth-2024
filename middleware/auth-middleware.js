const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // req.user = decoded;
    console.log(decoded);
    req.userInfo = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
module.exports = authMiddleware;
