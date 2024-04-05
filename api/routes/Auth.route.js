import express from "express";
import { google, signIn, signOut, signup, } from "../controllers/Auth.controller.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/signIn", signIn);
router.post("/google", google);
router.get("/signout",signOut)
export default router;
