import { Router } from "express";
import bodyParser from "body-parser";
import { getCountries, getPaginationCountries, getPaginationContinentsCountriesStates1 } from "../controllers/countriesController.js";
const router = Router();

router.use(bodyParser.json());

router.get("/getAll",getCountries)
router.get("/",getPaginationCountries)
router.get("/relationship",getPaginationContinentsCountriesStates1)

export default router;