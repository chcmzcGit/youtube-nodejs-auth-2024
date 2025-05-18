const isAdminUser = (req, res, next) => {
  const { role } = req.userInfo;
  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
module.exports = isAdminUser;
