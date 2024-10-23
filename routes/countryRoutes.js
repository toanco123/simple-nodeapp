import { Router } from "express";
import bodyParser from "body-parser";
import { getCountries, getPaginationCountries } from "../controllers/countriesController.js";
const router = Router();

router.use(bodyParser.json());

router.get("/getAll",getCountries)
router.get("/",getPaginationCountries)

export default router;