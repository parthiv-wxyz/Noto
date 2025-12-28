import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireSuperAdmin } from "../middlewares/requireSuperAdmin.js";
import {
  promoteToAdmin,
  demoteToUser,
} from "./adminController.js";

const router = express.Router();

router.post(
  "/users/:userId/promote",
  authMiddleware,
  requireSuperAdmin,
  promoteToAdmin
);

router.post(
  "/users/:userId/demote",
  authMiddleware,
  requireSuperAdmin,
  demoteToUser
);

export default router;
