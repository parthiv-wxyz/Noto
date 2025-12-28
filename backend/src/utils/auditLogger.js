export async function logAudit({
  supabase,
  actorId,
  actorRole,
  action,
  tableName,
  recordId
}) {
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: actorId,
    actor_role: actorRole,
    action,
    table_name: tableName,
    record_id: recordId
  });

  if (error) {
    console.error("Audit log failed:", error.message);
  }
}
