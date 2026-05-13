import { Router } from "express";

import {
  askQuestion,
  streamQuestion,
} from "../controllers/chat.controller";

const router = Router();

router.post("/", askQuestion);
router.post("/stream", streamQuestion);

export default router;