# Briefly — AI RAG Chat Frontend

A polished, production-ready frontend for an AI RAG (Retrieval-Augmented
Generation) platform. Built with Nuxt 4, Nuxt UI v3, and Tailwind CSS v4.

## Stack

- **Nuxt 4** with compatibility version 4
- **Nuxt UI v3** component library
- **Tailwind CSS v4** for utility styling
- **TypeScript** with strict mode
- **Vue 3** Composition API with `<script setup>`
- **@vueuse/core** for utilities
- **marked** for markdown rendering

## Features

- 💬 **Streaming chat** — Real-time token streaming via ReadableStream
- 📄 **Document upload** — Drag & drop PDF upload with progress
- 📚 **Source citations** — Collapsible source panels per response
- 🗂️ **Conversation history** — Searchable sidebar conversations
- ✨ **Smooth UX** — Fade/slide animations, auto-scroll, skeleton states
- 📱 **Responsive** — Collapsible sidebar, mobile-compatible layout
- 🎨 **Design system** — Full CSS variable token system

## Project Structure

```
components/
  chat/
    ChatSidebar.vue       - Left sidebar with conversations & docs
    ConversationList.vue  - Conversation list wrapper
    ConversationItem.vue  - Single conversation row
    ChatMessage.vue       - User/assistant message bubble
    ChatInput.vue         - Textarea with send button
    ChatSources.vue       - Collapsible source citations
  documents/
    UploadDropzone.vue    - Drag & drop PDF uploader
    DocumentCard.vue      - Single document card
    DocumentList.vue      - Documents grid/list
  shared/
    AppHeader.vue         - Top navigation header
    EmptyState.vue        - Empty state placeholder
    MarkdownRenderer.vue  - Marked-based markdown
    LoadingState.vue      - Dot loading indicator

composables/
  useChat.ts             - Chat state + streaming logic
  useConversations.ts    - Conversation list management
  useDocuments.ts        - Document upload & management

pages/
  index.vue              - Main chat interface
  documents.vue          - Document management page

types/
  index.ts               - All TypeScript interfaces

assets/css/
  main.css               - CSS variables + global styles
```

## Setup

```bash
# Install dependencies
npm install

# Copy env
cp .env.example .env

# Run dev server
npm run dev
```

## API Configuration

Set the backend URL in `.env`:

```env
NUXT_PUBLIC_API_BASE=http://localhost:5000/api
```

## API Endpoints Used

| Method | Path                | Description                      |
| ------ | ------------------- | -------------------------------- |
| POST   | `/documents/upload` | Upload PDF (multipart/form-data) |
| POST   | `/chat`             | Non-streaming chat               |
| POST   | `/chat/stream`      | Streaming chat (ReadableStream)  |

## Design Tokens

All colors and spacing use CSS variables defined in `assets/css/main.css`. The
palette is clean neutral light — no gradients or glassmorphism.
