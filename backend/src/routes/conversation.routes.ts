import { Router } from "express";

import {
	getConversations,
	getConversationMessages,
	updateConversation,
	deleteConversation,
} from "../controllers/conversation.controller";

const router = Router();

router.get("/", getConversations);
router.get("/:id/messages", getConversationMessages);
router.patch("/:id", updateConversation);
router.delete("/:id", deleteConversation);

export default router;
