# 「困りごとを相談する」機能 改修案

## 0. サマリー

現状の「困りごとを相談する」フローには、以下2つの課題がある。

| # | 課題 | 影響 |
|---|---|---|
| 1 | 症状入力後、状況確認の質問（どこから／どのドアか）が必須で、回答するまで何も情報が得られない | 「早く教えてほしい」ユーザーにとって回り道に感じる |
| 2 | 診断後に出てくる案内が、取扱説明書に載っている基本操作（スマートキーのボタンを押す・ハンドルを引く等）に限定される | 「もう知っている」「もっと実践的なコツが欲しい」ユーザーには物足りない |

これに対し、以下2つの改修を提案する。

1. **状況確認フローの軽量化**：質問を1画面に統合し、「状況を選ばず、とりあえず一般的な案内を見る」スキップ導線も用意する。
2. **デュアルソース提示**：診断結果に対して、
   - **公式情報タイプ**（オーナーズマニュアル・FAQ・サポート事例＝正確性・安全性重視）
   - **実践情報タイプ**（Web記事・YouTube動画等＝分かりやすさ・裏ワザ・体験談重視）

   の2種類の案内を並べて提示し、ユーザーが自分の好みに合う方を選べるようにする。

---

## 1. 現状の実装整理

### 1.1 画面遷移（現状）

```text
U05 困りごと入力 (/owner/support/new)
  ↓ issueText送信
U06 状況確認 (/owner/support/[caseId]/clarify)
  ↓ Q1「どこから開けようとしていますか？」
  ↓ Q2「どのドアですか？」
U07 診断結果 (/owner/support/[caseId]/diagnosis)
  ↓ 原因候補を表示（1候補の案内のみへ誘導）
U08 解決方法 (/owner/support/[caseId]/guidance)
  ↓ 3ステップの案内（公式情報ベースのみ）
U09 解決確認 (/owner/support/[caseId]/resolution)
```

### 1.2 該当コード

- `domain/troubleshooting/scenarios.ts` … シナリオ定義（質問・原因候補・ガイダンス本文）
- `domain/troubleshooting/engine.ts` … 質問進行・診断ロジック（`CAUSE_TO_GUIDANCE` で原因→ガイダンスを1:1マッピング）
- `app/owner/support/[caseId]/clarify/page.tsx` … 質問を1問ずつ表示
- `app/owner/support/[caseId]/diagnosis/page.tsx` … 原因候補表示
- `app/owner/support/[caseId]/guidance/page.tsx` … `GuidanceStepper` で3ステップ表示
- `components/troubleshooting/GuidanceStepper.tsx` … 単一のガイダンスを1つずつ表示するUI

### 1.3 課題の裏付け

- `CAUSE_TO_GUIDANCE`（`engine.ts` L14-21）が原因コード→ガイダンスコードを**1対1**でマッピングしているため、常に1種類の案内しか出せない構造になっている。
- `Guidance`型（`types/index.ts`）に「情報源の種類」を表すフィールドがなく、`sourceIds`はすべて`owners_manual`/`faq`系の`KnowledgeSource`のみを参照している。
- `clarify`ページは`QuestionStep`を**1問ずつ**遷移させる作りのため、2問でも「回答→送信→待機→次の質問」を2往復する必要がある。

---

## 2. 改修方針①：状況確認フローの軽量化

### 2.1 やること

1. **質問を1画面に統合**：`opening_from` と `door_position` を1つのフォーム画面にまとめ、送信を1回にする（現状2回のAPI往復 → 1回）。
2. **「回答せず一般的な案内を見る」導線を追加**：状況確認画面に「今すぐ一般的な確認手順を見る」というセカンダリボタンを設置し、質問をスキップしても最頻出の原因（例：後席なら「チャイルドプロテクター」）の案内へ進めるようにする。
3. **質問文に「なぜ聞くのか」を一言添える**（Agent UIの「なぜ確認する？」表現をOwner UIにも一部転用）。
   - 例：「どこから開けようとしていますか？（車内・車外で原因の切り分け方が変わります）」

### 2.2 画面イメージ（統合後）

```text
状況を確認します

Q1. どこから開けようとしていますか？
[車内から] [車外から] [どちらからも]

Q2. どのドアですか？
[左後席] [右後席] [両方]

[この内容で診断する]
--------------------------------
▼ 質問に回答せず、まず一般的な確認手順を見る
```

### 2.3 実装への影響

- `TroubleshootingScenario.questions` はそのまま利用可能（表示のみ1画面に集約）。
- `clarify/page.tsx` を1問ずつのステッパーから、複数`QuestionStep`を縦に並べたフォームへ変更。
- `POST /api/v1/support-cases/{caseId}/answers` を複数回呼ぶ現状の設計から、**まとめて送信する新エンドポイント**（例：`answers/batch`）または既存APIをクライアント側でPromise.allする方式に変更。

---

## 3. 改修方針②：デュアルソース提示（本題）

### 3.1 コンセプト

同じ原因候補に対して、性質の異なる2種類の案内を並列に提示する。

| タイプ | ラベル案 | 情報源 | トーン | 想定ユーザー |
|---|---|---|---|---|
| A | **安心・確実タイプ**（公式） | オーナーズマニュアル／メーカーFAQ／正規サポート事例 | 断定的・安全注意を明記 | 正確さ・安全性を重視する層、初めてのEV/PHEVオーナー |
| B | **実践・時短タイプ**（コミュニティ） | Web記事／YouTube解説動画／オーナーコミュニティの体験談 | 口語的・コツや裏ワザ中心 | すでに基本を知っていて、効率的な使いこなしを求める層 |

診断結果画面またはガイダンス画面に**タブ／トグル**を設け、ユーザーが好きな方を選べるようにする。両方確認することも可能。

### 3.2 画面イメージ

```text
U08 解決方法

「ドアロック設定の確認手順」

[ 🛡 安心・確実タイプ ]  [ 🎥 実践・時短タイプ ]   ← タブ切替
─────────────────────────────
（安心・確実タイプ選択時）
出典：オーナーズマニュアル / メーカーFAQ

STEP 1  スマートキーを携帯しているか確認します
STEP 2  ドアハンドルを「軽く」引きます
STEP 3  スマートキーのボタンで直接解錠します

─────────────────────────────
（実践・時短タイプ選択時）
出典：オーナー体験談 / 解説動画（外部サイト）

💡 「実は多くのオーナーが最初つまずくポイントです」
▶ 動画で見る：「NX e-Latchの開け方、3秒でわかる」(2:14)
📝 コミュニティ投稿：「濡れた手だと反応が悪いので手袋を外すと解決した」
📝 コミュニティ投稿：「キーを胸ポケットに入れてると反応早い」
```

### 3.3 データモデル拡張案

`types/index.ts` に以下を追加する。

```typescript
// 追加：情報源の系統を区別
export type KnowledgeSourceType =
  | "owners_manual"
  | "faq"
  | "support_case"
  | "product_info"
  | "community_tip"   // 追加：SNS・コミュニティ投稿
  | "video";           // 追加：YouTube等の解説動画

export interface KnowledgeSource {
  id: string;
  type: KnowledgeSourceType;
  title: string;
  version?: string;
  url?: string;            // 追加：外部リンク（動画・記事）
  durationSeconds?: number; // 追加：動画の場合の再生時間
  publisher?: string;       // 追加：投稿者・チャンネル名（表示の透明性確保）
}

// 追加：ガイダンスに系統タグを付与
export type GuidanceTrack = "official" | "community";

export interface Guidance {
  code: string;
  title: string;
  estimatedSeconds: number;
  steps: GuidanceStep[];
  approvalStatus: ApprovalStatus;
  sourceIds: string[];
  track: GuidanceTrack;       // 追加：official or community
  disclaimer?: string;        // 追加：community track用の注意書き
}
```

`domain/troubleshooting/engine.ts` の`CAUSE_TO_GUIDANCE`を1:1から1:2（official/community）に変更する。

```typescript
const CAUSE_TO_GUIDANCE: Record<string, { official: string; community: string }> = {
  door_lock_setting: {
    official: "check_door_lock_official",
    community: "check_door_lock_community",
  },
  right_rear_not_unlocked: {
    official: "check_outside_right_rear_door_official",
    community: "check_outside_right_rear_door_community",
  },
  // ...
};
```

`evaluateDiagnosis`の戻り値`DiagnosisResult`にも`guidanceOfficial` / `guidanceCommunity`の両方を含める形に変更する。

### 3.4 モックコンテンツ例（「ドアロック設定の確認手順」の場合）

#### 安心・確実タイプ（`check_door_lock_official`）※既存内容を流用

```text
出典：オーナーズマニュアル / メーカーFAQ

STEP 1 スマートキーを携帯しているか確認します
STEP 2 ドアハンドルを「軽く」引きます
STEP 3 スマートキーのボタンで直接解錠して再度試します
```

#### 実践・時短タイプ（`check_door_lock_community`）※新規モック

```text
出典：オーナー体験談 / 解説動画（デモ用の架空コンテンツ）

STEP 1 「反応が悪いときは手をグーパーしてから触る」
  多くのオーナーが「静電気っぽい感触で反応が鈍い」と感じるタイミングがあるとの声があります。
  一度手のひらでハンドル全体を軽く触れてから引くと反応しやすくなった、という報告があります。

STEP 2 「キーは体の前面（胸・腰）に近い位置に」
  カバンの底やリュックの奥に入れていると認識が遅れることがあります。
  ポケットや、体に近いカバンの外ポケットに入れておくとスムーズという投稿が多く見られます。

STEP 3 「YouTubeで動きを予習しておく」
  ▶ 動画「【納車後最初に見る】NX450h+ e-Latchドアの開け方」(2:14) - ○○チャンネル
  実際の手の動きを確認できるので、初めての方はイメージがつかみやすいです。

⚠ この情報はオーナー体験談・外部動画をもとにした参考情報です。
  正式な仕様・安全に関する内容は必ず「安心・確実タイプ」またはオーナーズマニュアルをご確認ください。
```

> **重要**：コミュニティ系情報には必ず `disclaimer` を表示し、「参考情報であり公式見解ではない」ことを明示する。安全に関わる内容（警告灯、ブレーキ、発火の可能性がある事象など）では、コミュニティタイプを非表示にし、公式タイプのみ提示するガード条件を設ける（`scenario`側に `communityTrackAllowed: boolean` フラグを追加）。

### 3.5 UI仕様

- `components/troubleshooting/GuidanceStepper.tsx` を拡張し、`track`に応じて見た目を変える。
  - 安心・確実タイプ：既存の落ち着いたプライマリカラー、`shield-check`アイコンをタブに表示
  - 実践・時短タイプ：アクセントカラー（例：オレンジ系）、`sparkles`または新規`video`アイコン
- タブ切り替えは`useState`で管理し、選択したタブは`resolution`登録時に`guidanceCode`と共に`track`も記録する（どちらが実際に解決に役立ったかを`CX Intelligence`で分析可能にするため）。
- 動画コンテンツはモックのため実再生はせず、既存の`DemoActionButton`パターン（「デモでは実際の動画は再生されません」というトースト）を踏襲する。

### 3.6 Agent Assist / CX Intelligence への波及

- Agent UIの`Recommended Guidance`（A05）にも同様に2タブを表示し、オペレーターが顧客の温度感に応じて案内を選べるようにする。
- `CX Intelligence`（M02 Insight）に「どちらのトラックがより解決率が高いか」という新しいインサイト軸を追加できる。
  - 例：「安心・確実タイプよりも、実践・時短タイプを見たユーザーの方が解決率が12pt高い」→ 情報改善のインサイトとして提示可能。

---

## 4. 実装タスク一覧

| No | タスク | 対象ファイル | 優先度 |
|---|---|---|---|
| 1 | `KnowledgeSourceType`に`community_tip`/`video`を追加、`KnowledgeSource`に`url`/`durationSeconds`/`publisher`を追加 | `types/index.ts` | 高 |
| 2 | `Guidance`に`track`/`disclaimer`を追加 | `types/index.ts` | 高 |
| 3 | `check_door_lock`等の既存ガイダンスを`*_official`にリネームし、対になる`*_community`を新規作成 | `domain/troubleshooting/scenarios.ts` | 高 |
| 4 | `CAUSE_TO_GUIDANCE`を`{official, community}`のペア構造に変更、`evaluateDiagnosis`の戻り値を拡張 | `domain/troubleshooting/engine.ts` | 高 |
| 5 | `DiagnosisResult`型に`guidanceOfficial`/`guidanceCommunity`を追加、API（`answers`ルート）のレスポンスに反映 | `types/index.ts`, `app/api/v1/support-cases/**` | 高 |
| 6 | `GuidanceStepper`にタブ切り替えUIを追加（`track`ごとに配色・アイコン変更） | `components/troubleshooting/GuidanceStepper.tsx` | 中 |
| 7 | `guidance/page.tsx`で両トラックを取得し、タブで切り替え表示 | `app/owner/support/[caseId]/guidance/page.tsx` | 中 |
| 8 | `resolution`登録時に選択した`track`も送信・記録 | `app/owner/support/[caseId]/resolution/page.tsx`, `app/api/.../resolution/route.ts` | 中 |
| 9 | `clarify`ページを1画面統合＋「一般的な案内を見る」スキップ導線に変更 | `app/owner/support/[caseId]/clarify/page.tsx` | 中 |
| 10 | 安全性ガード（`communityTrackAllowed`）の実装 | `domain/troubleshooting/scenarios.ts`, `engine.ts` | 中 |
| 11 | Agent Assist（A05）にも2タブ表示を反映 | `app/agent/cases/[caseId]/page.tsx` | 低 |
| 12 | CX Intelligenceにトラック別解決率インサイトを追加（モック文言） | `lib/mock-data.ts`（`demoCxInsights`） | 低 |

---

## 5. リスク・留意点

1. **正確性の誤認リスク**：コミュニティ・動画情報を公式情報と誤認されないよう、色・アイコン・注意書きで明確に区別する。
2. **著作権・引用の適切性**：本番実装時は実在するYouTube動画・記事を無断で要約しない。埋め込みリンク＋出典明記、またはメーカー監修済みの二次コンテンツに限定する運用ルールが必要（モックでは架空チャンネル名で仮置き）。
3. **安全領域の線引き**：警告灯・発煙・異音など安全に直結する事象は、コミュニティタイプを提示しない（公式タイプのみ）というガードを必ず入れる。
4. **情報の鮮度管理**：コミュニティ情報は陳腐化しやすいため、`KnowledgeSource`に`lastVerifiedAt`のような鮮度管理フィールドを将来追加することも検討する。

---

## 6. 期待効果

- 状況確認の往復回数を削減し、体験のテンポを改善。
- 「知りたいレベル」に応じた情報を選べることで、以下の両立を実現：
  - 安全・正確性を最優先するユーザーの信頼獲得
  - 効率・実践性を求めるユーザーの満足度向上
- 将来のPoCにおいて「情報源の多層化（公式×コミュニティ）」というCMCならではの提案軸を打ち出せる。
