import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ping } from "../controllers/pingController.js";

const router = express.Router();

router.get("/", authMiddleware, ping);

export default router;
