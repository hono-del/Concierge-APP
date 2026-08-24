# VoCベースナレッジ構築モック — システム概要・機能要件

## 1. 目的

本モックは、LEXUS NXを題材に、取扱説明書・FAQなどの公式情報だけでは解決しにくいユーザーの困りごとに対して、Web上のQ&A、オーナー投稿、専門家・販売店・有識者の知見などの「VoC / Experience Knowledge」を収集・構造化し、AIチャットから活用できるナレッジ基盤を表現する。

単なるWeb検索やRAGではなく、

**Collect → Understand → Answer → Ask → Validate → Learn → Reward**

という循環を作り、公式情報だけでは拾えない「実際に役立つ知恵」を継続的に蓄積することを目指す。

---

## 2. 背景課題

現状のAIチャットでは、参照ナレッジが取扱説明書、FAQなどの公式情報に偏りやすい。

その結果、ユーザーが具体的な困りごとを相談しても、

- 一般的な確認事項
- 取扱説明書に書かれている標準操作
- 「改善しない場合は販売店へ相談してください」

といった回答になりやすい。

しかし実際には、Webサイト、Q&A、YouTube、オーナーコミュニティ、販売店スタッフ、車に詳しいユーザーの中に、

- 同じ症状を経験した人の解決方法
- 症状を早く切り分けるコツ
- 特定条件でのみ起きる現象
- 公式情報には書かれていない確認ポイント
- 実際に試して有効だった対応

などの有益な知識が存在する。

これらを「検索して終わる情報」ではなく、AIが安全に再利用できるナレッジへ変換する。

---

## 3. コンセプト

### Official Knowledge + Experience Knowledge

```text
公式情報
Owner's Manual / FAQ / Service Information
            +
VoC / Experience Knowledge
Q&A / Blog / Video / Owner Experience / Expert Answer
            ↓
      Knowledge Studio
            ↓
構造化・意味付与・信頼度評価
            ↓
      AI Knowledge Base
            ↓
         Chat
            ↓
       解決できない
            ↓
  Expert Communityへ質問
            ↓
       有識者が回答
            ↓
       編集者が承認
            ↓
   新しいKnowledgeとして蓄積
```

---

## 4. 本モックで伝えたい価値

### 4.1 ユーザー価値

「正しい一般論」ではなく、

**“今の自分の症状なら、まず何を試すべきか”**

が分かる。

### 4.2 メーカー / CS価値

ユーザーが実際に困っていること、公式情報だけでは解決できないことを発見し、ナレッジとして蓄積できる。

### 4.3 CMC価値

CMCが保有・制作する公式情報に加え、VoCを収集・構造化・品質管理することで、

**AIが使えるCustomer Experience Knowledge Base**

を構築できる。

---

## 5. デモ対象

### Vehicle

LEXUS NX

モック内では、必要に応じて以下の情報をサンプルデータとして保持する。

- NX350h
- NX450h+
- 年式
- グレード
- 装備
- ソフトウェアバージョン

---

## 6. デモシナリオ全体

### STEP 1：VoCを収集する

編集画面から、VoC収集対象のURLを登録する。

デモ対象例：

- みんカラ：LEXUS NX トラブル・故障 Q&A
- CSK REVIEW CHANNEL：新型NX不具合・改善要望まとめ
- 試乗マニアのドライブジャーナル：NXオーナーの不満・トラブル情報

#### デモ用URL

```text
https://minkara.carview.co.jp/car/lexus/nx/qa/?ci=3
https://cskreview.com/nxfuguai/
https://bicyclenet.jp/lexus-nx-issues-checklist/
```

### STEP 2：AIがVoCをナレッジ化する

取得した文章をそのままRAGに投入しない。

AIが以下の単位へ分解・構造化する。

```text
Raw VoC
↓
Issue
↓
Symptom
↓
Condition
↓
Possible Cause
↓
Check Point
↓
Resolution / Tip
↓
Evidence / Source
↓
Trust / Safety
```

### STEP 3：ユーザーがChatで困りごとを相談する

例：

```text
後席ドアが外から開かない。
急いでいるので、まず何を確認すればいい？
```

AIは公式情報とVoCナレッジを横断して回答する。

回答では、

- 最初に試すこと
- 症状との一致理由
- 類似事例
- 公式情報
- VoC由来のTips
- 信頼度
- 出典

を必要に応じて表示する。

### STEP 4：ナレッジで解決できない質問

例：

```text
特定の条件でだけe-Latchが反応しない。
再現条件もよく分からない。
```

AIが既存ナレッジでは十分な回答ができないと判断する。

画面：

```text
現在のナレッジだけでは
信頼できる解決方法を特定できませんでした。

詳しい人に聞いてみますか？

[Expert Communityに質問する]
```

### STEP 5：Expert Communityへ質問

AIが、ユーザーとの会話を整理して質問文を自動生成する。

例：

```text
LEXUS NXで、左後席ドアが車外から開かない症状について
経験のある方はいませんか？

Vehicle:
NX450h+

Symptom:
・左後席のみ
・車外から開かない
・他のドアは正常

Already Checked:
・ドアロック
・スマートキー

知りたいこと:
・類似症状の原因
・現場で有効だった確認方法
・一時的な対処方法
```

モックでは外部SNSへ実投稿せず、アプリ内の「Expert Community」へ投稿する。

### STEP 6：有識者が回答する

Expert Community画面で、有識者役のユーザーが回答を投稿する。

### STEP 7：編集者が回答をレビューする

Knowledge Studioの編集画面に「承認待ち回答」として表示する。

編集者は、

- 元の質問
- 回答
- 投稿者プロフィール
- 類似ナレッジ
- 公式情報との整合
- AIによる構造化結果
- Risk / Confidence

を確認する。

操作：

```text
[Knowledgeに採用]
[修正して採用]
[採用しない]
```

### STEP 8：Knowledgeへ追加

採用された回答はAIによって構造化され、`Expert Verified VoC`としてKnowledge Baseへ追加される。

### STEP 9：Contributorへポイント付与

回答がKnowledgeへ採用された場合、回答者へポイントを付与する。

```text
Knowledge Accepted!

+100 Knowledge Points
```

---

## 7. 画面構成

### 7.1 Knowledge Studio / 編集画面

#### K01 Dashboard

表示：

- Total Knowledge
- Official Knowledge
- VoC Knowledge
- Expert Knowledge
- Pending Review
- New Sources
- 最近追加されたKnowledge
- トピック別件数

#### K02 Source Management

項目：

- Source Name
- URL
- Source Type
- Vehicle
- Status
- Last Collected
- Items Found
- Collectボタン

Source Type：

```text
Community
Blog
Q&A
Video
Dealer
Expert
Official
```

#### K03 Collection Result

項目：

- Title
- Source
- URL
- Published Date
- Collected Date
- Raw Text
- Status

Status：

```text
New
Processing
Structured
Duplicate
Rejected
```

#### K04 AI Structuring

Raw VoCとAI構造化結果を左右で比較する。

#### K05 Knowledge Detail

1件のKnowledgeを詳細表示。

#### K06 Pending Expert Answers

Expert Communityから届いた回答の承認画面。

---

## 8. Chat画面

### C01 Chat Home

例：

```text
NXについて困っていることはありますか？
```

Quick Question：

- ドアが開かない
- Bluetoothがつながらない
- 警告灯が消えない
- バッテリーが上がった
- 異音がする

### C02 Answer

推奨構成：

```text
まず試してほしいこと
↓
なぜこれをおすすめするか
↓
同じ症状の事例
↓
解決Tips
↓
公式情報
↓
Source / Confidence
```

Source Badge：

```text
LEXUS公式
Owner Experience
Expert Answer
Dealer Knowledge
Community
```

---

## 9. Knowledge Schema

```typescript
type KnowledgeItem = {
  id: string;
  vehicle: {
    maker: string;
    model: string;
    generation?: string;
    modelYear?: string;
    grade?: string;
    powertrain?: string;
  };
  category:
    | "door"
    | "battery"
    | "infotainment"
    | "warning"
    | "noise"
    | "charging"
    | "adas"
    | "other";
  issueTitle: string;
  symptom: string[];
  conditions: {
    weather?: string[];
    temperature?: string;
    vehicleState?: string[];
    frequency?: string;
    timing?: string;
  };
  possibleCauses: {
    label: string;
    confidence: number;
  }[];
  checks: {
    order: number;
    action: string;
    reason?: string;
  }[];
  resolutions: {
    action: string;
    outcome?: string;
    evidenceCount?: number;
  }[];
  tips: string[];
  source: {
    type:
      | "official"
      | "community"
      | "blog"
      | "video"
      | "dealer"
      | "expert";
    title: string;
    url?: string;
    author?: string;
    publishedAt?: string;
  };
  provenance: {
    rawTextId: string;
    collectedAt: string;
  };
  trust: {
    score: number;
    reason: string[];
    officialCorroboration: boolean;
    multipleSourceSupport: boolean;
  };
  safety: {
    level: "low" | "medium" | "high";
    requiresOfficialConfirmation: boolean;
    notes?: string[];
  };
  status:
    | "draft"
    | "review"
    | "approved"
    | "rejected";
};
```

---

## 10. AI構造化要件

AIはVoCから以下を抽出する。

### Required

- Vehicle
- Issue
- Symptom
- Condition
- Possible Cause
- Resolution
- Tip
- Source
- Confidence

### Optional

- Model Year
- Grade
- Temperature
- Weather
- Frequency
- Dealer Comment
- Cost
- Part Name
- Software Version

不明な情報を推測して埋めない。`unknown` または `null` とする。

---

## 11. Trust / Quality設計

Web情報は公式情報と同じ信頼度として扱わない。

### Trust Score例

```text
Official                       100
Dealer verified                 90
Multiple independent reports    80
Expert accepted                 75
Single owner experience         60
Unverified community post       40
```

AI回答では「公式情報」「経験情報」「推定」を区別する。

---

## 12. Safety Gate

以下はVoCのTipsをそのまま推奨しない。

- ブレーキ
- ステアリング
- 高電圧
- PHEV / EV高電圧系
- エアバッグ
- 火災
- 燃料
- 車両下への潜り込み
- 分解整備
- 法規・保証に影響する改造

該当する場合は `Safety Critical` として公式情報や専門スタッフ確認を優先する。

---

## 13. Chat Retrieval Logic

検索優先順位：

```text
1. Vehicle / Generation Match
2. Symptom Match
3. Condition Match
4. Safety
5. Trust
6. Resolution Evidence
7. Recency
```

「同じ症状で実際に解決したKnowledge」を単純なキーワード一致より優先する。

---

## 14. Unknown Detection

以下の場合はKnowledge不足と判断する。

- 類似Knowledgeがない
- 類似度が低い
- 信頼できるResolutionがない
- Sourceが1件のみでTrustが低い
- Safety Criticalで公式根拠がない

無理に回答を生成せずExpert Communityへつなぐ。

---

## 15. Expert Community

### E01 Feed

質問一覧を表示。

### E02 Question Detail

質問詳細と回答欄。

### E03 Contributor Profile

表示：

- Name
- Expertise
- Owned Vehicle
- Knowledge Points
- Accepted Answers
- Helpful Rate
- Badge

Badge例：

```text
NX Owner
Dealer Staff
Mechanic
EV Expert
Top Contributor
```

---

## 16. Gamification

目的は投稿数ではなく、**「役に立つKnowledgeを増やすこと」**。

ポイント例：

```text
回答投稿                 +10
Knowledge採用            +100
別ソースで再現確認        +50
高評価Knowledge          +30
誤情報 / 不適切回答       0
```

---

## 17. Scraping / Collection要件

### 基本方針

本モックではWeb取得の技術そのものよりKnowledge化体験を優先する。

#### Mode A：Live Collection

公開ページから取得可能な範囲でHTMLを取得し、本文を抽出する。

#### Mode B：Demo Snapshot

取得制限、サイト変更、ネットワーク制限などがある場合、事前に保存したサンプルデータを読み込む。

デモでは必ずMode Bでも全画面が動作すること。

### 取得時の制約

- robots.txt、利用規約、アクセス制限を尊重する
- ログインが必要な領域へ侵入しない
- CAPTCHA等を回避しない
- アクセス制御を迂回しない
- 高頻度クロールをしない
- 記事本文の大量再配布をしない
- Knowledgeには原文全文ではなく、必要な事実・要約・出典を保持する
- YouTubeは字幕・説明文等、利用可能なデータのみ対象とする
- 本番利用時は各情報源の利用条件・権利処理を別途確認する

---

## 18. Source Adapter設計

```typescript
interface SourceAdapter {
  canHandle(url: string): boolean;
  collect(url: string): Promise<RawSourceItem[]>;
}
```

Adapter例：

```text
GenericWebAdapter
MinkaraAdapter
BlogAdapter
YouTubeAdapter
DemoSnapshotAdapter
```

---

## 19. デモ用サンプルVoC

以下を事前データとして用意する。

```text
・後席ドアが外から開かない
・e-Latchが反応しない
・CarPlayが切断される
・12Vバッテリーが上がる
・足回りから異音がする
・ナビ / ディスプレイがフリーズする
```

---

## 20. 技術構成案

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
SQLite + Prisma
```

AIは以下で切り替える。

```text
AI_MODE=mock
AI_MODE=api
```

Mockモードでは事前定義JSONを返す。

---

## 21. UIデザイン

### Knowledge Studio

- Professional
- Clean
- Information-rich
- Source / Trust / Statusが一目で分かる
- Raw → Structuredの変換が視覚的に理解できる

### Chat

- ユーザー中心
- 長文回答を避ける
- 「まず試すこと」を最上部
- Source Badgeを表示
- Experience Knowledgeが役立っていることを自然に見せる

### Community

- Reddit / Stack Overflow / 自動車コミュニティの中間
- ExpertiseとContributionが分かる
- Knowledgeとして採用された回答を強く評価

---

## 22. デモの山場

### ① Official Only

```text
一般的な確認事項しか出ない
```

### ② VoC Knowledge Enabled

```text
同じNXで同じ症状を経験した人の知見から、
まず試すべきことが分かる
```

### ③ Unknown

```text
Knowledgeが足りないので無理に答えない
```

### ④ Ask Community

```text
詳しい人へ質問を自動生成
```

### ⑤ Learn

```text
回答が承認されるとKnowledgeになる
```

### ⑥ Reward

```text
役立つKnowledgeを提供した人へポイント
```

---

## 23. 一言で表現すると

> **VoCベースナレッジ構築は、公式情報だけでは拾えない“実際に役立った経験知”を収集・構造化・検証し、AIの回答力として再利用しながら、足りない知識を人から補完して継続的に育てるCustomer Experience Knowledge Platformである。**
