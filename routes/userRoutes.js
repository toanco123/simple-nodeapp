import { Router } from "express";
import bodyParser from "body-parser";
const router = Router();
import {
  getAllUser,
  createUser,
  getUserId,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
router.use(bodyParser.json());

router.get("/", getAllUser);
router.post("/", createUser);
router.get("/:id", getUserId);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
