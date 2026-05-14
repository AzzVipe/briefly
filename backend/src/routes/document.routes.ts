import { Router } from "express";

import { upload } from "../middleware/upload.middleware";

import {
	uploadDocument,
	getDocuments,
	deleteDocument,
	attachDocumentToConversation,
	getConversationDocuments,
} from "../controllers/document.controller";

const router = Router();

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.delete("/:id", deleteDocument);
router.post("/conversations/:id", attachDocumentToConversation);
router.get("/conversations/:id", getConversationDocuments);

export default router;
