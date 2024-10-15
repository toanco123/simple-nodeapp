import { Router } from "express";
import bodyParser from "body-parser";
import { loginCustomer, registerCustomer, refreshAccessToken, logoutCustomer } from "../controllers/customersController.js";
const router = Router();

router.use(bodyParser.json());

router.post("/register",registerCustomer)
router.post("/login",loginCustomer)
router.post("/logout", logoutCustomer)
router.post("/refresh-token", refreshAccessToken)

export default router;