"use client";

import { Check, Loader2, Pencil, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/voc/ui/badge";
import { Button } from "@/components/voc/ui/button";
import { Input } from "@/components/voc/ui/input";
import { updateKnowledge } from "@/lib/voc/actions/studio-actions";
import { KNOWLEDGE_STATUS_LABELS } from "@/lib/voc/labels";
import type { KnowledgeItem, KnowledgeStatus } from "@/lib/voc/types";

const STATUS_OPTIONS: KnowledgeStatus[] = ["draft", "review", "approved", "rejected"];

export function KnowledgeEditor({ knowledge }: { knowledge: KnowledgeItem }) {
  const router = useRouter();
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(knowledge.issueTitle);
  const [tips, setTips] = useState(knowledge.tips);
  const [newTip, setNewTip] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(partial: Parameters<typeof updateKnowledge>[1]) {
    setSaving(true);
    try {
      await updateKnowledge(knowledge.id, partial);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleTitleSave() {
    setEditingTitle(false);
    if (title !== knowledge.issueTitle) await save({ issueTitle: title });
  }

  async function handleAddTip() {
    if (!newTip.trim()) return;
    const next = [...tips, newTip.trim()];
    setTips(next);
    setNewTip("");
    await save({ tips: next });
  }

  async function handleRemoveTip(index: number) {
    const next = tips.filter((_, i) => i !== index);
    setTips(next);
    await save({ tips: next });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        {editingTitle ? (
          <div className="flex flex-1 items-center gap-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg font-bold" />
            <Button size="icon" variant="ghost" onClick={handleTitleSave}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            <button
              onClick={() => setEditingTitle(true)}
              className="text-slate-300 hover:text-slate-500"
              aria-label="編集"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {saving && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      </div>

      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase text-slate-400">Status</p>
        <div className="flex gap-1.5">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => save({ status })}
              disabled={saving}
            >
              <Badge
                variant={
                  status === knowledge.status
                    ? status === "approved"
                      ? "success"
                      : status === "rejected"
                        ? "danger"
                        : "default"
                    : "outline"
                }
                className="cursor-pointer"
              >
                {KNOWLEDGE_STATUS_LABELS[status]}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase text-slate-400">Tips（編集可能）</p>
        <ul className="space-y-1">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
              <span>・{tip}</span>
              <button onClick={() => handleRemoveTip(i)} className="text-slate-300 hover:text-red-500">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          {tips.length === 0 && <li className="text-xs text-slate-400">Tipsはまだありません</li>}
        </ul>
        <div className="mt-2 flex items-center gap-2">
          <Input
            placeholder="Tipsを追加…"
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTip()}
            className="h-8 text-xs"
          />
          <Button size="sm" variant="outline" onClick={handleAddTip}>
            <Plus className="h-3.5 w-3.5" />
            追加
          </Button>
        </div>
      </div>
    </div>
  );
}
