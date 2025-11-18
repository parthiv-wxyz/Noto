import express from "express";
import materialsRoute from "./routes/materialsRoute";
import updatesRoute from "./routes/updatesRoute";
import questionPapersRoute from "./routes/questionPapersRoute";
import pingRoute from './routes/pingRoute.js'
import uploadRoute from "./routes/uploadRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/materials", materialsRoute);
app.use("/updates", updatesRoute);
app.use("/question-papers", questionPapersRoute);
app.use("/ping", pingRoute);
app.use("/upload", uploadRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;