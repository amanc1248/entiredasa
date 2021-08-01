import express from "express";
import {
  loginTailor,
  registerTailor,
  tailorCustomers,
  tailorOrders,
  tailorSales,
  updateTailorProfile,
} from "../controllers/tailorControllers.js";
const router = express.Router();

router.route("/registerTailor").post(registerTailor);
router.route("/loginTailor").post(loginTailor);
router.route("/tailorSales/:id").get(tailorSales);
router.route("/tailorOrders/:id").get(tailorOrders);
router.route("/tailorCustomers/:id").get(tailorCustomers);
router.route("/updateTailorProfile").put(updateTailorProfile);

export default router;
