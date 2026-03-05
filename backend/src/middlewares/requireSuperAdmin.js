export function requireSuperAdmin(req, res, next) {
  if (req.userRole !== "super_admin") {
    return res.status(403).json({ message: "Super admin only" });
  }
  next();
}
