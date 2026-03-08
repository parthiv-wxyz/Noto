import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { requireSuperAdmin } from "../middlewares/requireSuperAdmin.js";
import {
  softDeleteMaterial,
  restoreMaterial,
  getMaterials,
} from "../controllers/materialsController.js";
import { getDownloadUrl } from "../controllers/materialsController.js";

const router = express.Router();

router.patch("/:id/delete", authMiddleware, requireAdmin, softDeleteMaterial);

router.patch(
  "/:id/restore",
  authMiddleware,
  requireSuperAdmin,
  restoreMaterial,
);

router.get("/:id/download", authMiddleware, getDownloadUrl);

router.get("/", authMiddleware, getMaterials);
export default router;
