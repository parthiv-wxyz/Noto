export function requireAdmin(req, res, next) {
  if (req.userRole !== "admin" && req.userRole !== "super_admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
