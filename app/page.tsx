import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";

interface RoleEntry {
  href: string;
  title: string;
  english: string;
  description: string;
  icon: IconName;
}

interface PrincipleEntry {
  title: string;
  description: string;
  icon: IconName;
}

const principleEntries: PrincipleEntry[] = [
  {
    title: "「情報検索ツール」にしない",
    description:
      "ホーム画面の中心に検索ボックスやチャット欄を置きません。今知っておくべきこと・今使うと便利な機能をシステム側から提示します。",
    icon: "sparkles",
  },
  {
    title: "聞いていないのに、必要なことを教えてくれる",
    description:
      "車種・納車時期・設定状況・機能利用状況・習熟度などの文脈から、ユーザーが質問する前に次に知るとよい情報を提示します。",
    icon: "bell",
  },
  {
    title: "知らなければ検索すらできない情報を届ける",
    description:
      "OTAで追加・変更された機能や、利用状況に合ったアップグレードサービスなど、存在を知らない情報をシステム側から通知・提案します。",
    icon: "gift",
  },
  {
    title: "困りごとは「回答」ではなく「解決」まで支援する",
    description:
      "状況確認→原因候補→最適な案内→解決確認という流れで、未解決なら有人サポートへシームレスに引き継ぎます。",
    icon: "check-circle",
  },
];

const architectureLayers: {
  title: string;
  english: string;
  description: string;
  icon: IconName;
}[] = [
  {
    title: "Information Foundation",
    english: "情報基盤",
    description:
      "オーナーズマニュアル・FAQ・商品情報・OTA情報・アップグレードサービス・問い合わせ事例を、AIが利用しやすい形に整理します。",
    icon: "book",
  },
  {
    title: "AI Concierge Core",
    english: "AIコンシェルジュコア",
    description:
      "Context Understanding・Recommendation・Troubleshooting・Next Best Question・Guidance Generation・Support Handoverを担う共通エンジンです。",
    icon: "sparkles",
  },
  {
    title: "Owner / Agent UI",
    english: "2つのUI",
    description:
      "同じエンジンを、エンドユーザー向けコンシェルジュとコールセンター向け支援の双方で活用します。違いは主にインターフェースと表示情報です。",
    icon: "chat",
  },
  {
    title: "CX Intelligence",
    english: "改善サイクル",
    description:
      "ユーザー・コールセンターで得られた利用・解決ログを、情報改善・サービス改善につなげ、情報基盤へフィードバックします。",
    icon: "chart-bar",
  },
];

const roleEntries: RoleEntry[] = [
  {
    href: "/owner",
    title: "Owner Concierge",
    english: "エンドユーザー向け",
    description:
      "車両オーナー向けのホーム画面から、プロアクティブな情報提供と困りごと解決フローを体験します。",
    icon: "car",
  },
  {
    href: "/agent",
    title: "Agent Assist",
    english: "コールセンター向け",
    description:
      "Ownerと同じTroubleshooting Engineを使い、次に聞く質問・原因候補・根拠をオペレーター視点で確認します。",
    icon: "headset",
  },
  {
    href: "/manufacturer/insights",
    title: "CX Intelligence",
    english: "メーカー向け",
    description:
      "利用・解決ログから得られる改善インサイトを確認し、情報基盤のKAIZENループを体験します。",
    icon: "chart-bar",
  },
  {
    href: "/studio",
    title: "VoC Knowledge Platform",
    english: "LEXUS NX / 育つナレッジ基盤",
    description:
      "公式情報だけでは得られないExperience Knowledgeを収集・構造化し、AI回答・Expert Communityへの質問・承認までの循環を体験します。",
    icon: "book",
  },
];

export default function DemoEntryPage() {
  return (
    <div className="text-text">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-white"
        style={{
          background: "linear-gradient(135deg, #102a43 0%, #1e1453 55%, #2d1b69 100%)",
        }}
      >
        {/* 装飾：右上の光彩 */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-96 w-96 opacity-20"
          style={{
            background: "radial-gradient(circle at top right, #2f80ed, transparent 70%)",
          }}
        />
        {/* 装飾：左下の光彩 */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 opacity-15"
          style={{
            background: "radial-gradient(circle at bottom left, #7c3aed, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            コンシェルジュAPP（デジOM）
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Search から Fit へ。
            <br />
            回答から解決へ。
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            ユーザー・車両・利用状況を理解し、必要な情報や次の行動を最適な形で届ける、次世代の顧客接点デモです。
          </p>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Scroll</span>
          <IconGlyph name="chevron-right" size={18} className="animate-bounce rotate-90" />
        </div>
      </section>

      {/* ── About This Product ───────────────────────────── */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-secondary">
            About This Product
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold leading-snug text-text sm:text-3xl">
            「デジタル取扱説明書」ではなく、
            <br />
            次にすべきことを支援する顧客体験基盤
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-secondary sm:text-base">
            従来の「オーナーズマニュアルをAIチャットで検索するアプリ」ではありません。ユーザー・車両・利用状況を理解し、
            必要な情報や次の行動を最適な形で届ける次世代の顧客接点を、同じ情報基盤・AIロジックで
            エンドユーザー向けコンシェルジュとコールセンター向け支援の両方に展開します。
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {principleEntries.map((principle) => (
              <Card key={principle.title} className="h-full border-slate-100 shadow-sm">
                <CardBody className="flex h-full flex-col gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <IconGlyph name={principle.icon} size={20} />
                  </span>
                  <p className="text-base font-bold text-text">{principle.title}</p>
                  <p className="flex-1 text-sm leading-relaxed text-secondary">
                    {principle.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── System Overview ──────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-secondary">
            System Overview
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold text-text sm:text-3xl">
            3層のシステム構成
          </h2>

          <div className="mt-10 flex flex-col items-center gap-2">
            {architectureLayers.map((layer, index) => (
              <div key={layer.title} className="w-full">
                <Card className="border-slate-100 shadow-sm">
                  <CardBody className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <IconGlyph name={layer.icon} size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                        {layer.english}
                      </p>
                      <p className="text-base font-bold text-text">{layer.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-secondary">
                        {layer.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
                {index < architectureLayers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <IconGlyph name="chevron-right" size={18} className="rotate-90 text-secondary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-secondary">
            Owner UIとAgent UIは同じTroubleshooting / Guidance Engineを利用します。違いは主にインターフェースと表示情報です。
          </p>
        </div>
      </section>

      {/* ── Try the Demo ─────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 py-20 text-white"
        style={{
          background: "linear-gradient(135deg, #102a43 0%, #1e1453 55%, #2d1b69 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-20"
          style={{
            background: "radial-gradient(circle at top right, #2f80ed, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/60">
            Try the Demo
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
            体験したいScene（役割）を選択してください
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roleEntries.map((entry) => (
              <Link key={entry.href} href={entry.href} className="group">
                <Card className="h-full border-white/10 bg-white/10 text-white backdrop-blur-sm transition-all group-hover:-translate-y-1 group-hover:bg-white/15 group-hover:shadow-xl">
                  <CardBody className="flex h-full flex-col gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
                      <IconGlyph name={entry.icon} size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        {entry.english}
                      </p>
                      <p className="text-lg font-bold text-white">{entry.title}</p>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-white/70">
                      {entry.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/90">
                      体験する
                      <IconGlyph name="arrow-right" size={16} />
                    </span>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-white/40">
            本デモはショールーム向けのモックです。表示されるデータはすべてデモ用の固定データであり、実際の車両・顧客情報とは連動していません。
          </p>
        </div>
      </section>
    </div>
  );
}
