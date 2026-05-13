import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes";
import documentRoutes from "./routes/document.routes";
import conversationRoutes from "./routes/conversation.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "RAG Backend Running",
  });
});


app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);
app.use(
  "/api/conversations",
  conversationRoutes
);

export default app;