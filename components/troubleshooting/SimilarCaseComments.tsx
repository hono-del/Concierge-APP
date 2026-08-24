import { IconGlyph } from "@/components/ui/IconGlyph";
import type { SimilarCaseComment } from "@/types";

interface SimilarCaseCommentsProps {
  comments: SimilarCaseComment[];
}

/**
 * 診断結果画面で「同じ症状の事例」に添える、Web上の声を模したデモ用ダミーコメント一覧。
 * 実際の投稿ではないため、その旨を明示するラベルを必ず併記する。
 */
export function SimilarCaseComments({ comments }: SimilarCaseCommentsProps) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
        <IconGlyph name="chat" size={14} />
        同じ症状に関するWeb上の声（イメージ・デモ用ダミー）
      </p>
      <div className="flex flex-col gap-2">
        {comments.map((comment) => (
          <div
            key={`${comment.author}-${comment.text}`}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-secondary">
                {comment.author.slice(0, 1)}
              </span>
              <span className="text-xs font-semibold text-text">{comment.author}</span>
              <span className="text-xs text-secondary/70">・{comment.source}</span>
            </div>
            <p className="mt-1.5 text-sm text-text">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
