import { Request, Response } from "express";

import { prisma } from "../config/prisma";

export async function getConversations(
  _req: Request,
  res: Response
) {
  try {
    const conversations =
      await prisma.conversation.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(conversations);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
}

export async function getConversationMessages(
  req: Request,
  res: Response
) {
  try {
    const id = req.params.id as string;

    const messages =
      await prisma.message.findMany({
        where: {
          conversationId: id,
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    return res.json(messages);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
}

export async function deleteConversation(
  req: Request,
  res: Response
) {
  try {
    const id = req.params.id as string;

    await prisma.conversation.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Conversation deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete conversation",
    });
  }
}