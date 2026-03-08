import express from "express";
import cors from "cors";

import materialsRoute from "./routes/materialsRoute.js";
import questionPapersRoute from "./routes/questionPapersRoute.js";
import pingRoute from "./routes/pingRoute.js";
import updatesRoute from "./routes/updatesRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import adminRoute from "./routes/adminRoute.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRoute);
app.use("/ping", pingRoute);
app.use("/api/material", materialsRoute);
app.use("/updates", updatesRoute);
app.use("/api/questionpapers", questionPapersRoute);
app.use("/api/upload", uploadRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
