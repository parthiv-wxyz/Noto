export const downloadFile = async (req, res) => {
  const file = await getFileFromDB(req.params.id);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file.original_name}"`
  );
  res.setHeader("Content-Type", "application/octet-stream");

  res.send(file.buffer);
};
