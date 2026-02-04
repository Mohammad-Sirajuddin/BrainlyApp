import { Router } from "express";
import { signin, signup } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addContent,
  deleteContent,
  getAllContent,
  getSharedContent,
  shareContent,
} from "../controllers/ContentController.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/content", authMiddleware, addContent);
router.post("/share",authMiddleware,shareContent)
router.get("/content", authMiddleware, getAllContent);
router.get("/shared/:shareToken",getSharedContent);
router.delete("/content/:id", authMiddleware, deleteContent);

export default router;
