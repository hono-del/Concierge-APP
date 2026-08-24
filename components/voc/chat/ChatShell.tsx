"use client";

import { Send } from "lucide-react";
import { useRef, useState } from "react";
import {
  draftExpertQuestion,
  postChatMessage,
  postQuickQuestion,
  postQuickReply,
} from "@/lib/voc/actions/chat-actions";
import { AI_CHAT_THINKING_MESSAGES } from "@/lib/voc/ai/mode";
import { DEFAULT_CHAT_CONTEXT } from "@/lib/voc/types";
import type { ExpertQuestionDraftInput } from "@/lib/voc/actions/chat-actions";
import type { KnowledgeCategory } from "@/lib/voc/types";
import { AnswerCard } from "./AnswerCard";
import type { ChatContext, ChatMessage } from "./chat-types";
import { KnowledgeModeToggle } from "./KnowledgeModeToggle";
import { quickQuestions } from "./QuickQuestions";
import { ThinkingBubble } from "./ThinkingBubble";
import { UnknownCard } from "./UnknownCard";
import { AskExpertDialog } from "./AskExpertDialog";
import { Button } from "@/components/voc/ui/button";
import { Input } from "@/components/voc/ui/input";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `m-${idCounter}`;
}

function randomThinkingText(): string {
  const idx = Math.floor(Math.random() * AI_CHAT_THINKING_MESSAGES.length);
  return AI_CHAT_THINKING_MESSAGES[idx] ?? AI_CHAT_THINKING_MESSAGES[0];
}

const QUESTION_TO_CATEGORY: Record<string, KnowledgeCategory> = {
  後席ドアが開かない: "door",
  Bluetoothがつながらない: "infotainment",
  警告灯が消えない: "warning",
  バッテリーが上がった: "battery",
  異音がする: "noise",
};

export function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [context, setContext] = useState<ChatContext>(DEFAULT_CHAT_CONTEXT);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [askExpertOpen, setAskExpertOpen] = useState(false);
  const [expertDraft, setExpertDraft] = useState<ExpertQuestionDraftInput | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function withThinking<T>(run: () => Promise<T>): Promise<T> {
    const thinkingId = nextId();
    setMessages((prev) => [...prev, { id: thinkingId, role: "assistant", kind: "thinking", text: randomThinkingText() }]);
    scrollToBottom();
    const [result] = await Promise.all([run(), new Promise((r) => setTimeout(r, 700))]);
    setMessages((prev) => prev.filter((m) => m.id !== thinkingId));
    return result;
  }

  function applyTurnResult(result: Awaited<ReturnType<typeof postChatMessage>>) {
    setContext(result.context);
    if (result.kind === "intro") {
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", kind: "intro", lines: result.lines }]);
    } else if (result.kind === "question") {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", kind: "question", text: result.text, options: result.options },
      ]);
    } else if (result.kind === "answer") {
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", kind: "answer", answer: result.answer }]);
    } else {
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", kind: "unknown", reason: result.reason }]);
    }
    scrollToBottom();
  }

  async function handleSend(text: string) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setInput("");
    setMessages((prev) => [...prev, { id: nextId(), role: "user", kind: "text", text }]);
    scrollToBottom();
    try {
      const result = await withThinking(() => postChatMessage(text, context));
      applyTurnResult(result);
    } finally {
      setBusy(false);
    }
  }

  async function handleQuickQuestion(label: string) {
    if (busy) return;
    const category = QUESTION_TO_CATEGORY[label];
    if (!category) return;
    if (category === "door") {
      await handleSend("後席のドアが外から開かない。急いでいる。");
      return;
    }
    setBusy(true);
    setMessages((prev) => [...prev, { id: nextId(), role: "user", kind: "text", text: label }]);
    scrollToBottom();
    try {
      const result = await withThinking(() => postQuickQuestion(category, context));
      applyTurnResult(result);
    } finally {
      setBusy(false);
    }
  }

  async function handleQuickReply(messageId: string, option: { label: string; value: string }) {
    if (busy) return;
    setBusy(true);
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId && m.kind === "question" ? { ...m, answered: option.value } : m))
    );
    setMessages((prev) => [...prev, { id: nextId(), role: "user", kind: "text", text: option.label }]);
    scrollToBottom();
    try {
      const result = await withThinking(() => postQuickReply(option.value, context));
      applyTurnResult(result);
    } finally {
      setBusy(false);
    }
  }

  async function handleAskExpert(unknownMessageId: string) {
    const draft = await draftExpertQuestion(context);
    setExpertDraft(draft);
    setAskExpertOpen(true);
    setMessages((prev) =>
      prev.map((m) => (m.id === unknownMessageId && m.kind === "unknown" ? { ...m, askedExpert: true } : m))
    );
  }

  function handleModeChange(mode: ChatContext["knowledgeMode"]) {
    setContext((prev) => ({ ...prev, knowledgeMode: mode }));
  }

  function handlePosted(questionId: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "assistant",
        kind: "intro",
        lines: [
          "Expert Communityへ質問を投稿しました。",
          "有識者からの回答があると、Knowledge Studioで承認後にKnowledgeへ追加されます。",
        ],
      },
    ]);
    scrollToBottom();
    void questionId;
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div>
          <p className="text-base font-bold text-slate-900">NX Support</p>
          <p className="text-xs text-slate-500">Your NX450h+</p>
        </div>
        <KnowledgeModeToggle mode={context.knowledgeMode} onChange={handleModeChange} />
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 0 && (
          <div className="mx-auto max-w-md pt-10 text-center">
            <p className="text-sm text-slate-500">NXについて困っていることはありますか？</p>
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {quickQuestions.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleQuickQuestion(q.label)}
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  <q.icon className="h-4 w-4 shrink-0 text-slate-400" />
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          if (m.role === "user") {
            return (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-md rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">{m.text}</div>
              </div>
            );
          }
          if (m.kind === "thinking") return <ThinkingBubble key={m.id} text={m.text} />;
          if (m.kind === "intro") {
            return (
              <div key={m.id} className="max-w-md space-y-1 rounded-lg bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm">
                {m.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            );
          }
          if (m.kind === "question") {
            return (
              <div key={m.id} className="max-w-md space-y-2">
                <div className="rounded-lg bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm">{m.text}</div>
                <div className="flex flex-wrap gap-2">
                  {m.options.map((opt) => (
                    <button
                      key={opt.value}
                      disabled={Boolean(m.answered) || busy}
                      onClick={() => handleQuickReply(m.id, opt)}
                      className={
                        m.answered === opt.value
                          ? "rounded-md border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                          : "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-500 disabled:opacity-40"
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          if (m.kind === "answer") return <AnswerCard key={m.id} answer={m.answer} />;
          if (m.kind === "unknown") {
            return (
              <UnknownCard
                key={m.id}
                reason={m.reason}
                askedExpert={m.askedExpert}
                onAskExpert={() => handleAskExpert(m.id)}
              />
            );
          }
          return null;
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-6"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="困っていることを入力してください"
          disabled={busy}
        />
        <Button type="submit" size="icon" disabled={busy || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <AskExpertDialog
        open={askExpertOpen}
        draft={expertDraft}
        onOpenChange={setAskExpertOpen}
        onPosted={handlePosted}
      />
    </div>
  );
}
