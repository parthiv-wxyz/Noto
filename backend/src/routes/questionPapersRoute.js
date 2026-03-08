import express from "express";
import {
  uploadQP,
  getQPDwldUrl,
  getQuestionPapers,
} from "../controllers/questionPapersController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadQP);
router.get("/:id/download", authMiddleware, getQPDwldUrl);
router.get("/", authMiddleware, getQuestionPapers);

export default router;
