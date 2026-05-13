import { prisma } from "../config/prisma";


export async function createConversation() {
  return prisma.conversation.create({
    data: {
      title: "New Conversation",
    },
  });
}

export async function saveMessage(
  conversationId: string,
  role: string,
  content: string
) {
  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}

export async function getConversationMessages(
  conversationId: string
) {
  return prisma.message.findMany({
    where: {
      conversationId,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}