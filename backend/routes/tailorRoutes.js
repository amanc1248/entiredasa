import express from "express";
import {
  loginTailor,
  registerTailor,
  tailorCustomers,
  tailorOrders,
  tailorSales,
} from "../controllers/tailorControllers.js";
const router = express.Router();

router.route("/registerTailor").post(registerTailor);
router.route("/loginTailor").post(loginTailor);
router.route("/tailorSales/:id").get(tailorSales);
router.route("/tailorOrders/:id").get(tailorOrders);
router.route("/tailorCustomers/:id").get(tailorCustomers);

export default router;
