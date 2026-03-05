import express from "express";
import {
  uploadUpdate,
  getUpdateDwldUrl,
} from "../controllers/updatesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadUpdate);
router.get("/:id/download", authMiddleware, getUpdateDwldUrl);

export default router;
