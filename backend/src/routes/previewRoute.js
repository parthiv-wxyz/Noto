//preview and download for other file types
import express from "express";
import { viewFile } from "../controllers/previewController.js";
import { downloadFile } from "../controllers/downloadController.js";

const router = express.Router();

router.get("/files/:id/view", viewFile);
router.get("/files/:id/download", downloadFile);

export default router;