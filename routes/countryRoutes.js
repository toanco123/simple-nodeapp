import { Router } from "express";
import bodyParser from "body-parser";
import { getCountries, getPaginationCountries, getPaginationContinentsCountriesStates1, updateCountries, deleteCountries, updateMultipleCountries, deleteMultipleCountries } from "../controllers/countriesController.js";
const router = Router();

router.use(bodyParser.json());

router.get("/getAll",getCountries)
router.get("/",getPaginationCountries)
router.put("/",updateMultipleCountries)
router.put("/:id",updateCountries)
router.delete("/",deleteMultipleCountries)
router.delete("/:id",deleteCountries)
router.get("/relationship",getPaginationContinentsCountriesStates1)

export default router;