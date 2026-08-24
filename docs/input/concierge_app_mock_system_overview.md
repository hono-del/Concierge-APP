# コンシェルジュAPP（デジOM）モックシステム概要

## 1. 本ドキュメントの目的

本ドキュメントは、ショールームでの顧客デモに向けてCursorで開発する「コンシェルジュAPP（デジOM）」モックのシステム概要を定義する。

今回のモックは、従来の「オーナーズマニュアルをAIチャットで検索するアプリ」ではなく、ユーザー・車両・利用状況を理解し、必要な情報や次の行動を最適な形で届ける**次世代の顧客接点**を表現することを目的とする。

また、同じ情報基盤・AIロジックを、エンドユーザー向けコンシェルジュとコールセンター向け支援の双方で活用できる構成とし、将来的なPoCにつながる体験をデモする。

---

## 2. デモで伝えたいメッセージ

### Main Concept

**Search から Fit へ。回答から解決へ。**

ユーザーが必要な情報を探すのではなく、システムが「誰が・どの車で・今どのような状況か」を理解し、必要な情報・行動・サービスを最適な形で届ける。

### 顧客に持ち帰ってほしい印象

1. CMCは「AIチャット」を作るだけではなく、**AI × 情報を活用した新しい顧客接点**を設計できる。
2. 取説・FAQ・商品情報・問い合わせ事例などの情報を、AIが利用しやすい形に整理すること自体が重要である。
3. 同じ情報基盤を、ユーザーの自己解決だけでなく、**コールセンター支援にも展開できる**。
4. ユーザー・コールセンターで得られた体験ログを、情報改善・サービス改善につなげられる。
5. まず1つのユースケースからPoCを開始できる。

---

## 3. システム全体像

```text
┌─────────────────────────────────────────────┐
│                Information Foundation       │
│                                             │
│  Owner's Manual / FAQ / Product Info        │
│  OTA Info / Upgrade Services / Support Case │
│  Vehicle Info / User Context / Resolution   │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│             AI Concierge Core               │
│                                             │
│ ・Context Understanding                     │
│ ・Recommendation                            │
│ ・Troubleshooting                           │
│ ・Next Best Question                        │
│ ・Guidance Generation                       │
│ ・Support Handover                          │
│ ・Feedback / Learning                       │
└──────────────┬────────────────┬─────────────┘
               │                │
               ▼                ▼
┌──────────────────────┐  ┌──────────────────────┐
│ Owner Concierge UI   │  │ Agent Assist UI      │
│                      │  │                      │
│ エンドユーザー向け   │  │ コールセンター向け   │
└──────────────────────┘  └──────────────────────┘
               │                │
               └────────┬───────┘
                        ▼
              ┌──────────────────┐
              │ CX Intelligence  │
              │ 利用・解決ログ   │
              │ 改善インサイト   │
              └──────────────────┘
```

---

## 4. 基本思想

### 4.1 「情報検索ツール」にしない

ホーム画面の中心に検索ボックスやチャット欄を置かない。

システム側から、

- 今知っておくべきこと
- 今使うと便利な機能
- 車両や利用状況の変化
- おすすめのサービス
- 困ったときの次の行動

を提示する。

チャットは「数ある接点の1つ」として位置づける。

### 4.2 「聞いていないのに、自分に必要なことを教えてくれる」

コンシェルジュAPPの重要な体験として残す。

ユーザーから質問がなくても、車種・納車時期・設定状況・機能利用状況・習熟度などの文脈から、次に知るとよい情報を提示する。

例：

- 納車後に設定しておくと便利な機能
- 以前の車両から操作方法が変わった機能
- まだ利用していない便利機能
- 車両状態に応じた注意事項

### 4.3 「知らなければ検索すらできない情報を届ける」

ユーザーは存在を知らない情報については検索できない。

そのため、以下のような情報をシステム側から通知・提案する。

- OTAで追加・変更された機能
- 新しく使えるようになったサービス
- ユーザーの使い方に合う未利用機能
- 車両状態や時期に応じたメンテナンス情報
- 利用状況に合ったアップグレードサービス

### 4.4 困りごとは「回答」ではなく「解決」まで支援する

ユーザーから質問を受けたら、すぐに長文回答を返すのではなく、以下の流れで解決を支援する。

```text
困りごと
  ↓
状況確認
  ↓
必要な追加質問
  ↓
原因候補
  ↓
最適な案内
  ↓
解決確認
  ↓
未解決なら有人サポートへ引き継ぎ
```

### 4.5 User UIとAgent UIは同じエンジンを利用する

エンドユーザー向けコンシェルジュとコールセンター向け支援は、基本的に別々の機能として作らない。

両者は同じ、**Troubleshooting / Guidance Engine** を利用する。

違いは主にインターフェースと表示情報である。

| 項目 | Owner Concierge | Agent Assist |
|---|---|---|
| 利用者 | 車両オーナー | コールセンター担当者 |
| 表現 | 分かりやすい・短い | 詳細・業務向け |
| 質問 | ユーザーに直接質問 | オペレーターが顧客へ聞く質問を提示 |
| 原因候補 | 必要最低限 | 複数候補・優先順位付き |
| 根拠情報 | 必要に応じて表示 | 常時確認可能 |
| 案内 | ユーザー向け手順 | 回答トーク・確認事項 |
| 結果 | 解決 / 未解決 | 解決結果・対応履歴 |
| エスカレーション | CS / Dealerへ | Dealer / Technical Supportへ |

---

## 5. Scene 1：聞いていないのに、自分に必要なことを教えてくれる

### 目的

「検索するデジタル取説」との違いを最初に感じてもらう。

### Home画面例

```text
Good afternoon

MY CAR
bZ4X
Vehicle Status: All Good

FOR YOU

[おすすめ]
納車後に設定しておくと便利です
「充電スケジュールを設定する」

[おすすめ]
以前のお車と操作方法が変わっています
「ドアロック設定を確認する」

[おすすめ]
まだ利用していない便利機能があります
「運転支援設定を見る」
```

### デモ上のポイント

ユーザーから何も質問していない状態で、以下の情報からおすすめが出るように見せる。

- 車種
- 納車時期
- 設定状況
- 機能利用状況
- ユーザーの習熟度
- 過去車両・利用履歴

モックでは実データ連携は行わず、事前に準備したデモデータを使用する。

---

## 6. Scene 2：知らなければ検索すらできない情報を届ける

### 6.1 OTA / 新機能通知

ホーム画面に以下のカードを表示する。

```text
WHAT'S NEW

Your vehicle has been updated

昨夜、ソフトウェアアップデートが完了しました。

あなたに関係する変更：2件

・充電機能が改善されました
・運転支援機能の操作方法が変更されました
```

「See what's changed」を押すと、ユーザーに関係する変更だけを表示する。

#### 情報提示形式

ユーザーに応じて、

- 短文
- 画像
- 3ステップガイド
- 30秒動画風UI

などを使い分ける。

### 6.2 Upgrade Recommendation

OTA通知とは別に、サービスレコメンドを表示する。

#### Homeカード例

```text
RECOMMENDED FOR YOU

あなたにおすすめの
アップグレードサービスがあります

「Advanced Parking Assist」

最近、狭い駐車場での利用が多いため、
この機能がおすすめです。

[詳しく見る]
```

#### 詳細画面例

```text
Advanced Parking Assist

あなたにおすすめする理由

✓ 狭い駐車場を利用する機会が多い
✓ 駐車支援機能をよく利用している
✓ 現在のお車で追加可能

できること
・駐車操作をサポート
・車庫入れ時の負担を軽減

[体験を見る]
[サービスについて相談]
```

#### デモ上のメッセージ

取扱情報を「困った時に参照するもの」から、**顧客の利用体験やサービス利用を広げる情報資産**へ拡張する。

---

## 7. Scene 3：困りごと解決

### Hero Use Case

**「後席のドアが開かない」**

今回の顧客が実際に経験した困りごとをモチーフにする。

### 7.1 困りごと入力

ユーザーが以下を入力する。

```text
後ろのドアが開かない
```

※音声入力ボタンをUI上に配置してもよい。

### 7.2 AIによる状況確認

いきなり回答を表示せず、原因切り分けに必要な質問を行う。

#### Question 1

```text
状況を確認します。

どこから開けようとしていますか？

[車内から]
[車外から]
[どちらからも]
```

#### Question 2

```text
どのドアですか？

[左後席]
[右後席]
[両方]
```

必要に応じて追加質問を表示する。

### 7.3 Diagnosis

回答内容をもとに、原因候補を表示する。

デモ例：

```text
考えられる原因があります

チャイルドプロテクターの設定が
影響している可能性があります。
```

※実際の製品仕様・正式な案内内容は、モック開発時に使用する車両のオーナーズマニュアルに合わせて確定する。

### 7.4 Visual Guidance

長文ではなく、視覚的な案内を表示する。

```text
30秒で確認できます

STEP 1
後席ドアを開けます

STEP 2
ドア側面のスイッチを確認します

STEP 3
スイッチ位置を変更します
```

画面上では、

- 車両イラスト
- ドア位置ハイライト
- 操作箇所拡大
- ステップ表示

などを使用する。

### 7.5 Resolution Check

案内後に必ず結果を確認する。

```text
解決しましたか？

[はい、開きました]
[まだ開きません]
```

「回答を表示したか」ではなく、**「ユーザーが解決できたか」**をシステムの成果として扱う。

---

## 8. Scene 4：コールセンターへの引き継ぎ

ユーザーが「まだ開きません」を選んだ場合、有人サポートへつなぐ。

```text
まだ解決していないようです。

サポートスタッフに相談しますか？

[相談する]
[あとで]
```

### 8.1 Support Handover

ユーザーが入力・確認した内容を自動整理する。

```text
SUPPORT SUMMARY

Vehicle
bZ4X

Issue
後席ドアが開かない

Condition
・車内から開かない
・左後席

Already Checked
✓ チャイルドプロテクター
✓ ドアロック状態

Guidance
チャイルドプロテクター確認手順

Result
未解決
```

この情報をコールセンター側へ引き継ぐ。

ユーザーは最初から説明し直す必要がない。

---

## 9. Scene 5：Agent Assist

### 9.1 基本コンセプト

コールセンター側でも、Owner Conciergeと同じTroubleshooting Engineを利用する。

違いは、**「AIがユーザーへ直接質問する」か「AIがオペレーターへ次に聞く質問を提示する」か**である。

### 9.2 Agent画面構成

#### Customer / Vehicle Information

```text
Customer
Demo User

Vehicle
bZ4X

Issue
後席ドアが開かない
```

#### Conversation Summary

ユーザー側ですでに確認した内容を表示する。

#### Next Best Question

```text
NEXT BEST QUESTION

「車外からはドアを開けることができますか？」

なぜ確認する？
→ 原因候補を切り分けるため
```

#### Possible Causes

```text
POSSIBLE CAUSES

1. Child Protector Setting
2. Door Lock Setting
3. Smart Entry Condition
4. Mechanical Issue
```

#### Recommended Guidance

ユーザーへ案内する内容を表示する。

#### Evidence

```text
SOURCE

Owner's Manual
FAQ
Past Support Case
```

---

## 10. AIと人間の役割分担

コールセンター向けデモでは、AIによる人員代替ではなく、人とAIの役割分担を表現する。

### AIが担う

- 情報検索
- 問い合わせ内容整理
- 状況切り分け
- 次の確認事項提示
- 原因候補提示
- 回答案提示
- 過去事例検索
- 対応履歴整理

### 人が担う

- 顧客への共感
- 不安・感情の理解
- 例外判断
- 複雑な状況判断
- 顧客との関係づくり

---

## 11. Scene 6：CX Intelligence

ユーザー向け・コールセンター向けで得られたログをメーカー側の改善へつなぐ画面。

### Dashboard例

```text
CUSTOMER EXPERIENCE INSIGHTS

後席ドアが開かない
126 cases

Self Resolved
74%

Call Center
18%

Dealer
8%
```

### Insight例

```text
AI INSIGHT

「チャイルドプロテクター」という
用語を理解できないユーザーが多いようです。

画像を利用した案内では、
文章のみの案内より解決率が高くなっています。
```

### Improvement例

```text
RECOMMENDED ACTION

・FAQ表現を変更する
・Owner's Manualの説明を改善する
・画像ガイドを標準化する
```

---

## 12. 情報基盤

### 12.1 情報ソース

#### Product Knowledge

- Owner's Manual
- Navigation Manual
- FAQ
- Product Information
- Feature Guide

#### Vehicle / Digital Information

- Vehicle Information
- Vehicle Status
- OTA Update Information
- Available Features
- Upgrade Service Catalog

#### Customer Support Knowledge

- Inquiry Cases
- Troubleshooting Cases
- Resolution Cases
- Dealer / Call Center Knowledge

#### Context Data

- User Profile
- Vehicle Profile
- Usage History
- Feature Usage
- Past Inquiry
- Current Situation

---

## 13. 共通AIロジック

### 13.1 Context Understanding

```text
誰が
×
どの車で
×
いつ
×
どのような状態で
×
何をしたい / 困っている
```

を整理する。

### 13.2 Proactive Recommendation

ユーザーから質問がなくても、必要な情報を提示する。

例：

- 納車後おすすめ設定
- 未利用機能
- OTA変更
- メンテナンス
- Upgrade Service

### 13.3 Intent Recognition

入力された内容を分類する。

例：

- How to use
- Troubleshooting
- Warning
- Setting
- Maintenance
- Upgrade
- Support

### 13.4 Next Best Question

問題解決に必要な確認事項を1問ずつ提示する。

### 13.5 Troubleshooting

```text
Symptom
↓
Observation
↓
Possible Cause
↓
Check
↓
Action
↓
Outcome
```

の流れで問題解決を支援する。

### 13.6 Guidance Generation

情報の提示形式を状況に応じて変更する。

- Short Answer
- Step-by-Step
- Image
- Animation / Video Style
- Warning
- Checklist

### 13.7 Support Handover

ユーザーとのやり取りを要約し、コールセンターや販売店へ引き継ぐ。

### 13.8 Resolution / Feedback

案内後に、

- Solved
- Not Solved
- Need More Information
- Escalated

を記録する。

---

## 14. 画面一覧

### Owner Concierge

| ID | 画面 | 主な目的 |
|---|---|---|
| U01 | Home | プロアクティブな情報提供 |
| U02 | For You | ユーザー別おすすめ |
| U03 | What's New | OTA / 新機能 |
| U04 | Upgrade Recommendation | サービスレコメンド |
| U05 | Ask / Issue Input | 困りごと入力 |
| U06 | Clarification | 状況確認 |
| U07 | Diagnosis | 原因候補 |
| U08 | Visual Guidance | 解決案内 |
| U09 | Resolution Check | 解決確認 |
| U10 | Support Handover | CS連携 |

### Agent Assist

| ID | 画面 | 主な目的 |
|---|---|---|
| A01 | Agent Dashboard | 問い合わせ一覧 |
| A02 | Customer Case | 顧客・車両・問い合わせ表示 |
| A03 | AI Assist | Next Best Question |
| A04 | Knowledge / Cause | 原因候補・根拠 |
| A05 | Recommended Guidance | 回答案 |
| A06 | Resolution | 対応結果 |

### Manufacturer

| ID | 画面 | 主な目的 |
|---|---|---|
| M01 | CX Dashboard | 利用・問い合わせ可視化 |
| M02 | Insight | 問題傾向・改善点 |
| M03 | Knowledge Improvement | 情報改善提案 |

---

## 15. 推奨デモ画面遷移

```text
U01 Home
 │
 ├─→ U02 For You
 │     「聞いていないのに必要な情報」
 │
 ├─→ U03 What's New
 │     「知らなければ検索できない情報」
 │
 ├─→ U04 Upgrade Recommendation
 │     「おすすめアップグレード」
 │
 └─→ U05 Issue Input
       「後席のドアが開かない」
           ↓
       U06 Clarification
           ↓
       U07 Diagnosis
           ↓
       U08 Visual Guidance
           ↓
       U09 Resolution Check
           │
           ├─ Solved → Home
           │
           └─ Not Solved
                  ↓
             U10 Support Handover
                  ↓
             A02 Customer Case
                  ↓
             A03 AI Assist
                  ↓
             A05 Recommended Guidance
                  ↓
             A06 Resolution
                  ↓
             M01 CX Dashboard
                  ↓
             M02 Insight
```

---

## 16. デモ時間配分

10〜15分を想定する。

| 時間 | 内容 |
|---|---|
| 0:00–1:00 | コンセプト説明 |
| 1:00–2:30 | Home / For You |
| 2:30–4:00 | OTA / What's New |
| 4:00–5:00 | Upgrade Recommendation |
| 5:00–9:00 | 「後席ドアが開かない」解決体験 |
| 9:00–11:30 | Call Center Agent Assist |
| 11:30–13:00 | CX Intelligence |
| 13:00–15:00 | 情報基盤・PoC説明 |

---

## 17. モック開発方針

### 17.1 今回実装するもの

今回の目的は技術検証ではなく、**顧客に将来体験を理解してもらうこと**である。

そのため、以下を優先する。

- UI / UXの完成度
- 画面遷移
- ストーリー
- 情報の見せ方
- AIが考えているように感じられる演出
- Owner UIとAgent UIの共通性

### 17.2 実データ連携は必須ではない

以下はモックデータでよい。

- Vehicle Status
- OTA
- User Profile
- Usage Log
- Recommendation
- CX Dashboard
- Call Center Case

### 17.3 AI機能

#### Option A：完全モック

事前定義されたシナリオに沿って遷移する。

メリット：

- デモが安定する
- 開発が早い
- AI回答の揺らぎがない

今回のショールームデモでは第一候補。

#### Option B：一部AI連携

困りごと入力のみLLMに接続し、その他は固定シナリオとする。

ただし、デモ安定性を優先する。

---

## 18. 推奨UI構成

### Owner UI

スマートフォンサイズを基本とする。

デザイン方向：

- 車両コンシェルジュ
- プレミアム
- シンプル
- 検索アプリ感をなくす
- カードベース
- 大きな余白
- 状況・次の行動を優先

Homeの優先順位：

```text
1. Current Vehicle Status
2. For You
3. What's New
4. Recommended Services
5. Need Help?
6. Ask anything
```

検索入力は最上部に置かない。

### Agent UI

PC画面を基本とする。

推奨レイアウト：

```text
┌──────────────────┬────────────────────────┐
│ Customer / Case  │ AI Assistant           │
│                  │                        │
│ Vehicle          │ Next Best Question     │
│ Issue            │ Possible Causes        │
│ History          │ Recommended Guidance   │
│ Checked Items    │ Evidence               │
│                  │                        │
└──────────────────┴────────────────────────┘
```

Owner UIと同じ情報・ロジックを使用していることが視覚的に分かるようにする。

---

## 19. モック用データモデル例

```typescript
type User = {
  id: string;
  name: string;
  experienceLevel: "new" | "experienced";
  previousVehicle?: string;
};

type Vehicle = {
  id: string;
  model: string;
  modelYear: number;
  status: "normal" | "attention" | "warning";
  enabledFeatures: string[];
  availableUpgrades: string[];
};

type Recommendation = {
  id: string;
  type: "onboarding" | "feature" | "ota" | "upgrade";
  title: string;
  reason: string;
  priority: number;
};

type SupportCase = {
  id: string;
  issue: string;
  symptom: string;
  answers: Record<string, string>;
  checkedItems: string[];
  possibleCauses: string[];
  guidance: string[];
  result: "solved" | "not_solved" | "escalated";
};

type KnowledgeSource = {
  id: string;
  type: "owners_manual" | "faq" | "support_case" | "product_info";
  title: string;
  content: string;
};
```

---

## 20. Cursor開発時のコンポーネント構成イメージ

```text
src/
├─ app/
│  ├─ owner/
│  │  ├─ home/
│  │  ├─ whats-new/
│  │  ├─ upgrade/
│  │  └─ support/
│  │
│  ├─ agent/
│  │  ├─ dashboard/
│  │  └─ case/
│  │
│  └─ manufacturer/
│     └─ insights/
│
├─ components/
│  ├─ vehicle/
│  ├─ recommendation/
│  ├─ troubleshooting/
│  ├─ guidance/
│  ├─ support/
│  └─ common/
│
├─ lib/
│  ├─ mock-data.ts
│  ├─ troubleshooting-engine.ts
│  ├─ recommendation-engine.ts
│  └─ context-engine.ts
│
└─ types/
   └─ index.ts
```

特に重要なのは、`troubleshooting-engine.ts` をOwner UIとAgent UIで共用する構造にすることである。

---

## 21. PoCへのつなぎ

デモ終了時には、システムそのものの導入提案ではなく、まず1つの困りごとから検証する提案につなげる。

### One Customer Issue PoC

例：**「ドアが開かない」**

### Owner

ユーザーが自己解決できるか。

### Call Center

オペレーターの回答・切り分けを支援できるか。

### Manufacturer

問い合わせから情報不足・改善ポイントを発見できるか。

これらを一気通貫で検証する。

### 将来的な対象ユースケース

- ドアが開かない
- エンジンがかからない
- Bluetoothがつながらない
- 警告灯
- 車両設定が分からない
- OTA後の変更
- 新機能の使い方
- アップグレードサービス提案

---

## 22. 最終的に表現したい世界観

```text
              ┌───────────────┐
              │ Information   │
              │ Foundation    │
              └───────┬───────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
     Owner App    Call Center    Dealer
         │            │            │
         └────────────┼────────────┘
                      │
                      ▼
                Experience Log
                      │
                      ▼
                 CX Insight
                      │
                      ▼
             Information KAIZEN
                      │
                      └──────────→ Foundation
```

**情報を作る → 届ける → 解決する → 体験を得る → 改善する** という循環をCMCが支える。

---

## 23. 一言で表現すると

> **コンシェルジュAPPは「デジタル取扱説明書」ではなく、製品情報・ユーザー文脈・AIを組み合わせ、ユーザーとカスタマーサポート双方の“次にすべきこと”を支援する顧客体験基盤である。**
