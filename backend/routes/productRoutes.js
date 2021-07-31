import express from "express";
import { getAllProducts } from "../controllers/productControllers.js";
const router = express.Router();

router.route("/getAllProducts").get(getAllProducts);
router.route("/:id").get(getAllProducts);
export default router;
