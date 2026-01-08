export const viewFile = async (req, res) => {
  const file = await getFileFromDB(req.params.id);

  res.setHeader("Content-Type", file.mime_type);

  res.send(file.buffer);
};
