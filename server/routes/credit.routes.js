import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {getPlans,purchasePlan} from "../controllers/credit.controller.js"

const router = Router();


router.route('/plans').get(getPlans);
router.route("/purchase").post(protect, purchasePlan);

export default router;