export async function getDashboardStats(req, res) {
  const supabase = req.supabase;
  const role = req.userRole;
  const userId = req.user.id;

  try {
    if (role === "user") {
      const { count: uploadCount } = await supabase
        .from("materials")
        .select("*", { count: "exact", head: true })
        .eq("uploader", userId)
        .is("deleted_at", null);

      const { count: downloadCount } = await supabase
        .from("audit_logs")
        .select("*", { count: "exact", head: true })
        .eq("actor_id", userId)
        .eq("action", "DOWNLOAD");

      return res.json({ uploadCount, downloadCount });
    }

    if (role === "admin") {
      const { count: totalMaterials } = await supabase
        .from("materials")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: uploadsToday } = await supabase
        .from("materials")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());

      const { count: deletedCount } = await supabase
        .from("materials")
        .select("*", { count: "exact", head: true })
        .not("deleted_at", "is", null);

      return res.json({ totalMaterials, uploadsToday, deletedCount });
    }

    if (role === "super_admin") {
      const { count: totalMaterials } = await supabase
        .from("materials")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: uploadsToday } = await supabase
        .from("materials")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());

      const { count: deletedCount } = await supabase
        .from("materials")
        .select("*", { count: "exact", head: true })
        .not("deleted_at", "is", null);

      const { count: totalUsers } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true });

      const { count: auditCount } = await supabase
        .from("audit_logs")
        .select("*", { count: "exact", head: true });

      return res.json({
        totalMaterials,
        uploadsToday,
        deletedCount,
        totalUsers,
        auditCount,
      });
    }

    return res.status(403).json({ message: "Unknown role" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}