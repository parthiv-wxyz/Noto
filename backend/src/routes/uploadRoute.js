import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadMaterial } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/material", authMiddleware, uploadMaterial);

export default router;
