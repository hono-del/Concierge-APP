import type { ChatAnswer, ChatContext, ChatQuickReplyOption } from "@/lib/voc/types";

export type ChatMessage =
  | { id: string; role: "user"; kind: "text"; text: string }
  | { id: string; role: "assistant"; kind: "thinking"; text: string }
  | { id: string; role: "assistant"; kind: "intro"; lines: string[] }
  | {
      id: string;
      role: "assistant";
      kind: "question";
      text: string;
      options: ChatQuickReplyOption[];
      answered?: string;
    }
  | { id: string; role: "assistant"; kind: "answer"; answer: ChatAnswer }
  | { id: string; role: "assistant"; kind: "unknown"; reason: string; askedExpert?: boolean };

export type { ChatContext };
