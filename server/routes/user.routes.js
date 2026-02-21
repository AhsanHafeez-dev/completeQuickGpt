import { Router } from "express";
import { getPublishedImages, getUser, loginUser, registerUser } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/data").get(protect, getUser);
router.route("/published-images").get(getPublishedImages);

export default router