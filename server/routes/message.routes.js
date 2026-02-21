import { Router } from 'express';

import { protect } from "../middlewares/auth.middleware.js";
import { } from "../controllers/chat.controller.js"
import { imageMessageController, textMessageController } from '../controllers/message.controller.js';
const router = Router();

router.use(protect);

router.route('/text').post(textMessageController);
router.route("/image").post(imageMessageController);

export default router