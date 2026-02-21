import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createChat, deleteChat, getChats } from "../controllers/chat.controller.js";


const router = Router()

router.use(protect);
router.route("/create").get(createChat);
router.route("/get").get(getChats);
router.route("/delete").post(deleteChat);

export default router