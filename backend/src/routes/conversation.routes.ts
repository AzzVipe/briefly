import { Router } from "express";

import {
  getConversations,
  getConversationMessages,
  deleteConversation,
} from "../controllers/conversation.controller";

const router = Router();

router.get("/", getConversations);

router.get(
  "/:id/messages",
  getConversationMessages
);

router.delete(
  "/:id",
  deleteConversation
);

export default router;