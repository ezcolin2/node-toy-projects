import multer from "multer";
import redis from "redis";
import express from "express";
import { uploadImage, getImage } from "../controllers/image.js";
import redisClient from "../utils/redis/index.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/", upload.single("image"), uploadImage);
router.get("/:id", getImage);
export default router;
