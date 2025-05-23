import express from "express";
import { queryDomain } from "../controllers/analytics.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/domain", verifyToken, queryDomain);

export default router;