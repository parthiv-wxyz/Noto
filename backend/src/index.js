import express from "express";
import cors from "cors";

import materialsRoute from "./routes/materialsRoute.js";
import questionPapersRoute from "./routes/questionPapersRoute.js";
import pingRoute from "./routes/pingRoute.js";
import updatesRoute from "./routes/updatesRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import adminRoute from "./routes/adminRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRoute);
app.use("/ping", pingRoute);
app.use("/material", materialsRoute);
app.use("/updates", updatesRoute);
app.use("/questionpapers", questionPapersRoute);
app.use("/upload", uploadRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
