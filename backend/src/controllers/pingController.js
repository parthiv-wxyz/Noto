export function ping(req, res) {
  res.json({
    status: "ok",
    user_id: req.user.id,
    role: req.userRole
  });
}
