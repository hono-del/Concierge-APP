# API仕様書

| 項目 | 内容 |
|---|---|
| 文書名 | コンシェルジュAPP（デジOM）API仕様書 |
| 版 | 0.1 |
| 作成日 | 2026-08-10 |
| 出典 | `docs/output/detailed_requirements_specification.md` 8. インテグレーション要件 |

## 1. 設計原則

- **RESTful設計:** リソース（`support-cases`等）を名詞のパスで表現し、操作はHTTPメソッド（GET/POST）で表現する。
- **バージョニング:** すべてのエンドポイントは`/api/v1`配下に置き、破壊的変更時は`/api/v2`として追加する。
- **ステートレス:** サーバー側はケースIDに紐づく状態をデータストア（fixtureまたはSupabase）で管理し、リクエスト間でセッション状態を保持しない。
- **一貫したレスポンス形式:** 成功時は対象リソースまたは処理結果のJSONを返し、エラー時は統一エラーオブジェクトを返す。
- **冪等性:** 状態変更を伴うPOSTは、可能な限り冪等キーまたは自然キー（`case_id` + `question_code`など）により重複実行の影響を抑える。
- **決定論性:** 同一の入力（回答の組合せ）に対しては常に同一の`nextQuestion`・`diagnosis`を返す（モックの再現性要件）。
- **フォールバック:** 外部AI・外部APIを利用する場合も、障害時は固定シナリオ相当のレスポンスへフォールバックし、5xxでデモを停止させない。

## 2. 共通仕様

| 項目 | 内容 |
|---|---|
| Base URL | `/api/v1` |
| Content-Type | `application/json`（リクエスト・レスポンス共通） |
| 文字コード | UTF-8 |
| タイムアウト | 外部サービス呼び出しは3秒以内を目安とする（仮定） |

### エラーレスポンス形式

すべてのエラーは以下の形式で返却する。

```json
{
  "error": {
    "code": "SCENARIO_NOT_FOUND",
    "message": "対象シナリオが見つかりません。",
    "requestId": "req_01..."
  }
}
```

| HTTPステータス | 用途 |
|---|---|
| 400 Bad Request | リクエスト形式・必須項目の不備 |
| 404 Not Found | 指定されたケース・シナリオ・質問が存在しない |
| 409 Conflict | 既に完了・確定済みのケースへの不整合な操作 |
| 500 Internal Server Error | サーバー内部エラー（フォールバック処理が優先される） |

## 3. 認証・認可

| 環境 | 方式 | 説明 |
|---|---|---|
| モックMVP | 認証不要 | ショールームデモではデモユーザー固定のため、認証層は実装しない |
| PoC以降 | Bearer JWT（Supabase Auth想定） | `Authorization: Bearer <token>`ヘッダーでアクセストークンを送信する。トークンはSupabase AuthまたはOIDC準拠のIdPが発行する |
| ロール分離（PoC以降） | RBAC | `owner` / `agent` / `manufacturer`ロールに応じ、Route Handler内でアクセス可能なリソースを制限する。Supabase採用時はRLSポリシーでも二重に制御する |
| APIキー（将来・外部連携） | サーバー間連携用 | LLM Gateway、CRM/CTIなど外部サービスとのサーバー間通信にのみ使用し、クライアントには公開しない |

モックMVPの間は認可チェックを実装しないが、Route Handlerの実装はPoC以降の認証ミドルウェア挿入を想定し、ハンドラ関数を認証ミドルウェアでラップできる構造にする。

## 4. エンドポイント一覧

| # | メソッド | パス | 概要 |
|---|---|---|---|
| 1 | POST | `/api/v1/support-cases` | 困りごとケースを新規作成し、最初の質問を返す |
| 2 | POST | `/api/v1/support-cases/{caseId}/answers` | 質問への回答を登録し、次の質問または診断結果を返す |
| 3 | POST | `/api/v1/support-cases/{caseId}/resolution` | 解決確認・対応結果を登録する |
| 4 | GET | `/api/v1/support-cases/{caseId}/handover` | Support Handover用のケース要約を取得する |
| 5 | GET | `/api/v1/support-cases/{caseId}` | ケース詳細（Agent Assist用）を取得する |
| 6 | GET | `/api/v1/vehicles/{vehicleId}/recommendations` | 車両に紐づく推薦（For You / Upgrade）一覧を取得する |
| 7 | GET | `/api/v1/vehicles/{vehicleId}/ota-updates` | 車両に紐づくOTA更新（What's New）一覧を取得する |
| 8 | GET | `/api/v1/insights/cx-dashboard` | CX Intelligence向け集計データを取得する |

以降、主要4エンドポイント（#1〜#4）の詳細を記述する。#5〜#8はモックMVPでは同様の設計原則でGET専用のRoute Handlerとして実装し、詳細はPoC移行時に別途拡張する。

### 4.1 ケース作成

**`POST /api/v1/support-cases`**

困りごと入力（U05 Ask / Issue Input）を受け付け、意図・症状を識別してケースを作成し、最初の質問を返す。

**リクエスト**

```json
{
  "userId": "0d145c23-42a5-4dce-90bb-f0248715d737",
  "vehicleId": "f69d8d26-9a30-490a-8534-3554ec11c27c",
  "issueText": "後ろのドアが開かない"
}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| userId | string(uuid) | Yes | `users.id` |
| vehicleId | string(uuid) | Yes | `vehicles.id` |
| issueText | string | Yes | ユーザーが入力した困りごと文言 |

**レスポンス（`201 Created`）**

```json
{
  "id": "b143d269-9d4f-4bc8-b900-33238678a593",
  "issueCode": "rear_door_not_open",
  "status": "in_progress",
  "nextQuestion": {
    "code": "opening_from",
    "prompt": "どこから開けようとしていますか？",
    "options": [
      { "code": "inside", "label": "車内から" },
      { "code": "outside", "label": "車外から" },
      { "code": "both", "label": "どちらからも" }
    ]
  }
}
```

**エラー例**

- `400 Bad Request`: `issueText`が空、または`userId`/`vehicleId`が不正な形式。
- `404 Not Found`: 対応するシナリオが存在しない入力（`SCENARIO_NOT_FOUND`）。この場合UIはサンプル質問への誘導を表示する（要件 4.2.3 代替・例外系）。

### 4.2 質問への回答

**`POST /api/v1/support-cases/{caseId}/answers`**

状況確認（U06 Clarification）で1問ずつ回答を登録し、次の質問または診断結果を返す。

**パスパラメータ**

| 名前 | 型 | 説明 |
|---|---|---|
| caseId | string(uuid) | `support_cases.id` |

**リクエスト**

```json
{
  "questionCode": "opening_from",
  "optionCode": "inside"
}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| questionCode | string | Yes | 回答対象の質問コード |
| optionCode | string | Yes（選択式の場合） | 選択した選択肢コード |
| answerText | string | No | 自由記述回答（選択式以外を許容する場合） |

**レスポンス（`200 OK`、次の質問がある場合）**

```json
{
  "caseId": "b143d269-9d4f-4bc8-b900-33238678a593",
  "nextQuestion": {
    "code": "door_position",
    "prompt": "どのドアですか？",
    "options": [
      { "code": "left_rear", "label": "左後席" },
      { "code": "right_rear", "label": "右後席" },
      { "code": "both_rear", "label": "両方" }
    ]
  },
  "diagnosis": null
}
```

**レスポンス（`200 OK`、質問完了・診断確定の場合）**

```json
{
  "caseId": "b143d269-9d4f-4bc8-b900-33238678a593",
  "nextQuestion": null,
  "diagnosis": {
    "causes": [
      { "code": "child_protector", "label": "チャイルドプロテクターの設定", "priority": 1, "confidenceLabel": "high" }
    ],
    "guidance": {
      "code": "check_child_protector",
      "title": "チャイルドプロテクター確認手順"
    }
  }
}
```

**挙動補足:** 「戻る」操作で既存回答を変更した場合、同一エンドポイントへ同じ`questionCode`で再送信し、サーバー側はUPSERTにより回答を更新し、以降の質問・診断結果を再評価する（`case_answers`の一意制約 `(case_id, question_code)` に対応）。

**エラー例**

- `400 Bad Request`: `questionCode`が現在のケースの想定質問と一致しない、または`optionCode`が未選択。
- `404 Not Found`: 指定`caseId`のケースが存在しない。
- `409 Conflict`: すでに`solved`/`not_solved`/`escalated`で確定済みのケースへの回答登録。

### 4.3 解決結果登録

**`POST /api/v1/support-cases/{caseId}/resolution`**

解決確認（U09 Resolution Check）の結果を記録し、Support Handoverの可否を返す。

**リクエスト**

```json
{
  "outcome": "not_solved",
  "channel": "owner",
  "guidanceCode": "check_child_protector"
}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| outcome | string | Yes | `solved` \| `not_solved` \| `need_info` |
| channel | string | Yes | `owner` \| `call_center` \| `dealer` |
| guidanceCode | string | No | 提示した案内のコード（解決率の分析に利用） |

**レスポンス（`200 OK`）**

```json
{
  "caseId": "b143d269-9d4f-4bc8-b900-33238678a593",
  "status": "not_solved",
  "handoverAvailable": true
}
```

**エラー例**

- `400 Bad Request`: `outcome`が許可された値以外。
- `409 Conflict`: 既に最終状態（`solved`/`escalated`）へ遷移済みのケースへの再登録。

### 4.4 引き継ぎ要約取得

**`GET /api/v1/support-cases/{caseId}/handover`**

Support Handover（U10）およびAgent Customer Case（A02）で表示するケース要約を取得する。

**レスポンス（`200 OK`）**

```json
{
  "caseId": "b143d269-9d4f-4bc8-b900-33238678a593",
  "vehicle": { "model": "bZ4X", "modelYear": 2026 },
  "issue": "後席ドアが開かない",
  "conditions": ["車内から開かない", "左後席"],
  "checkedItems": ["チャイルドプロテクター", "ドアロック状態"],
  "guidance": "チャイルドプロテクター確認手順",
  "result": "未解決"
}
```

**エラー例**

- `404 Not Found`: 指定`caseId`が存在しない。UIは再試行またはデモ初期化を提示する（要件 4.3.3 例外系）。

## 5. 非同期・障害時の要件

- 外部サービス（LLM Gateway、Supabase等）呼び出しにはタイムアウトを設定し、超過時は固定シナリオ相当のレスポンスへフォールバックする。
- 解決結果登録などの状態変更操作は冪等キー（例: `caseId` + `outcome`のバージョン）により、二重送信時の重複イベント登録を防ぐ。
- APIログには自由入力全文や個人情報を無条件に記録しない。デバッグに必要な最小限の情報（`caseId`、`questionCode`等）のみを記録する。
- モックMVPでは全エンドポイントがFixture Repositoryに対して同期的に応答し、外部ネットワーク呼び出しを行わないことで、デモ中のAPI起因の障害リスクを排除する。

## 6. 今後の拡張候補（PoC以降）

| 拡張 | 内容 |
|---|---|
| 認証必須化 | すべてのエンドポイントにBearer JWT検証を追加 |
| Webhook | CRM/CTIからのケース状態更新通知を受け取るエンドポイントの追加 |
| ページネーション | `/api/v1/insights/cx-dashboard`等の一覧系エンドポイントへのカーソルベースページネーション導入 |
| レート制限 | 外部公開時のAPI Gateway／Vercel Edge Middlewareによるレート制限 |
| スキーマ検証の共有 | Zod等によるリクエスト/レスポンススキーマをフロントエンドと共有し、型安全性を高める |
