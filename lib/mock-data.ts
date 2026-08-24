import type {
  CxImprovementAction,
  CxInsight,
  CxIssueSummary,
  KnowledgeSource,
  OtaUpdate,
  Recommendation,
  User,
  Vehicle,
} from "@/types";

/**
 * ショールームデモ用の固定モックデータ。
 * 出典: docs/output/detailed_requirements_specification.md 1.5, docs/design/database-design.md
 */

export const DEMO_USER_ID = "0d145c23-42a5-4dce-90bb-f0248715d737";
export const DEMO_VEHICLE_ID = "f69d8d26-9a30-490a-8534-3554ec11c27c";

export const demoUser: User = {
  id: DEMO_USER_ID,
  displayName: "YANAGI",
  experienceLevel: "new",
  previousVehicle: "ガソリン車（SUV）",
};

export const demoVehicle: Vehicle = {
  id: DEMO_VEHICLE_ID,
  userId: DEMO_USER_ID,
  model: "NX",
  modelYear: 2025,
  region: "日本",
  status: "normal",
  enabledFeatures: ["運転支援", "急速充電", "スマートエントリー"],
  availableUpgrades: ["Advanced Parking Assist"],
  imageEmoji: "🚗",
  imageUrl: "/images/NX_blue.png",
  ownershipMonths: 1,
  nextMaintenanceDate: "2027年1月",
};

export const demoRecommendations: Recommendation[] = [
  {
    id: "rec-onboarding-charge",
    vehicleId: DEMO_VEHICLE_ID,
    type: "onboarding",
    title: "充電スケジュールを設定する",
    reason: "納車後に設定しておくと便利です",
    priority: 1,
    href: "/owner/for-you/charge-schedule",
    reasons: ["納車から1か月以内のオーナー向けにおすすめしています", "夜間の電気料金が安いプランと組み合わせやすくなります"],
  },
  {
    id: "rec-feature-doorlock",
    vehicleId: DEMO_VEHICLE_ID,
    type: "feature",
    title: "ドア開スイッチ＋降車アシストを確認する",
    reason: "従来の機械式ドアハンドルとは操作感が大きく異なります",
    priority: 2,
    href: "/owner/for-you/door-assist",
    reasons: ["毎回使う機能で「ドアが開かない」と誤認しやすい操作変更があります", "接近車両を検知した場合、ドア開放を抑制する場合があります"],
  },
  {
    id: "rec-feature-driving-assist",
    vehicleId: DEMO_VEHICLE_ID,
    type: "feature",
    title: "運転支援設定を見る",
    reason: "まだ利用していない便利機能があります",
    priority: 3,
    href: "/owner/for-you/driving-assist",
    reasons: ["納車後、運転支援機能をまだ有効化されていません", "高速道路利用が多いオーナー様に高く評価されています"],
  },
  {
    id: "rec-upgrade-parking",
    vehicleId: DEMO_VEHICLE_ID,
    type: "upgrade",
    title: "Advanced Parking Assist",
    reason: "最近、狭い駐車場での利用が多いため、この機能がおすすめです",
    priority: 4,
    href: "/owner/upgrade",
    reasons: [
      "狭い駐車場を利用する機会が多い",
      "駐車支援機能をよく利用している",
      "現在のお車で追加可能",
    ],
    benefits: ["駐車操作をサポート", "車庫入れ時の負担を軽減"],
  },
];

/** ランダム表示用アップグレードサービス一覧 */
export const upgradeServices: Recommendation[] = [
  {
    id: "upgrade-body-color",
    vehicleId: DEMO_VEHICLE_ID,
    type: "upgrade",
    title: "ボディカラーオンデマンド変更",
    reason: "外装色を気分やシーンに合わせて変えられるサービスです",
    detailedDescription:
      "スマートフォンのアプリから外装色の変更を申請するだけで、愛車のボディカラーをいつでも変更できるサービスです。気分や季節、服装に合わせて色を変えることで、毎日のドライブがより楽しくなります。専用コーティング技術により、変更後の耐久性も十分に確保されています。",
    priority: 1,
    href: "/owner/upgrade/upgrade-body-color",
    imageUrl: "/images/upgrade/S-2.png",
    benefits: [
      "スマホから簡単に色変更を申請できる",
      "季節・TPO・服装に合わせた外装を楽しめる",
      "自分らしさと所有満足度が高まる",
    ],
  },
  {
    id: "upgrade-history-navi",
    vehicleId: DEMO_VEHICLE_ID,
    type: "upgrade",
    title: "地域限定・歴史ナビマップ",
    reason: "いつものドライブに冒険と発見が加わります",
    detailedDescription:
      "お住まいの地域や旅先の古地図・歴史情報を現在のナビ画面に重ねて表示するサービスです。AR技術により、実際に走りながらその場所の歴史や文化をリアルタイムに体感できます。普段何気なく通っている道が、歴史をめぐる特別な旅に変わります。",
    priority: 1,
    href: "/owner/upgrade/upgrade-history-navi",
    imageUrl: "/images/upgrade/S-20.jpg",
    benefits: [
      "古地図・歴史情報をナビに重ねて表示できる",
      "AR表示でその場で歴史情報を体感できる",
      "いつもの道が歴史をめぐる小さな旅に変わる",
    ],
  },
  {
    id: "upgrade-outing-navi",
    vehicleId: DEMO_VEHICLE_ID,
    type: "upgrade",
    title: "お出かけスポット・周辺環境提案ナビ",
    reason: "会話の流れから家族に合う寄り道先をクルマが提案します",
    detailedDescription:
      "車内での会話や走行状況をAIが分析し、家族全員が楽しめる最適な寄り道先をリアルタイムに提案するサービスです。「どこか寄っていこうか」という会話から自動的に候補スポットを表示し、周辺の混雑状況や営業情報も合わせて確認できます。",
    priority: 1,
    href: "/owner/upgrade/upgrade-outing-navi",
    imageUrl: "/images/upgrade/S-21.jpg",
    benefits: [
      "家族の会話から最適な目的地を自動提案できる",
      "移動の判断負荷を減らしながら楽しさが増す",
      "周辺環境・混雑状況を踏まえた寄り道提案ができる",
    ],
  },
  {
    id: "upgrade-floor-cleaning",
    vehicleId: DEMO_VEHICLE_ID,
    type: "upgrade",
    title: "モビリティフロアクリーニングプラン",
    reason: "食べこぼしやペットの毛を自動清掃するプランです",
    detailedDescription:
      "食べこぼし、ペットの毛、アウトドア後の砂泥汚れなどを自動で清掃するロボット清掃サービスです。専用の清掃ロボットが車内フロアを隅々まできれいにするため、手間をかけずにいつでも清潔な車内環境を維持できます。家族やペットとの外出がもっと気軽になります。",
    priority: 1,
    href: "/owner/upgrade/upgrade-floor-cleaning",
    imageUrl: "/images/upgrade/S-31.jpg",
    benefits: [
      "食べこぼし・ペットの毛・アウトドア汚れを自動清掃できる",
      "手間をかけず、いつでも清潔な車内を維持できる",
      "ファミリー・ペット連れのお出かけがもっと気軽になる",
    ],
  },
];

export const demoOtaUpdate: OtaUpdate = {
  id: "ota-2026-08-10",
  vehicleId: DEMO_VEHICLE_ID,
  version: "3.2.0",
  summary: "昨夜、ソフトウェアアップデートが完了しました。",
  appliedAt: "2026-08-10T02:00:00+09:00",
  changes: [
    {
      id: "ota-change-charging",
      title: "充電機能が改善されました",
      description:
        "充電スケジュール設定時に、目標充電量を10%単位で細かく指定できるようになりました。",
      presentation: "short",
    },
    {
      id: "ota-change-driving-assist",
      title: "運転支援機能の操作方法が変更されました",
      description:
        "レーンキープの有効・無効切り替えが、ステアリングスイッチの長押しに変更されました。",
      presentation: "steps",
    },
  ],
};

export const demoKnowledgeSources: KnowledgeSource[] = [
  {
    id: "ks-manual-door-open-switch",
    type: "owners_manual",
    title: "オーナーズマニュアル：ドアの開閉（ドア開スイッチ／e-Latch）",
    version: "NX450h+ 取扱説明書",
  },
  {
    id: "ks-manual-smart-entry",
    type: "owners_manual",
    title: "オーナーズマニュアル：スマートエントリー＆スタートシステム",
    version: "NX450h+ 取扱説明書",
  },
  {
    id: "ks-manual-manual-release",
    type: "owners_manual",
    title: "オーナーズマニュアル：ドア開スイッチでドアを開けることができない（手動リリースハンドルの操作）",
    version: "NX450h+ 取扱説明書",
    url: "https://manual.lexus.jp/nx/2303/phev/ja_JP/contents/bzs1646011135758.php",
  },
  {
    id: "ks-faq-manual-release",
    type: "faq",
    title: "FAQ：ドア開スイッチが反応しないときの対処法",
  },
];

export function getKnowledgeSourcesByIds(ids: string[]): KnowledgeSource[] {
  return ids
    .map((id) => demoKnowledgeSources.find((source) => source.id === id))
    .filter((source): source is KnowledgeSource => Boolean(source));
}

export const demoCxIssueSummary: CxIssueSummary = {
  issueCode: "rear_door_not_open",
  issueTitle: "後席ドアが開かない",
  totalCases: 126,
  selfResolvedRate: 0.74,
  callCenterRate: 0.18,
  dealerRate: 0.08,
};

export const demoCxInsights: CxInsight[] = [
  {
    id: "insight-terminology",
    title: "用語理解のギャップ",
    description:
      "「チャイルドプロテクター」という用語を理解できないユーザーが多いようです。",
  },
  {
    id: "insight-image-guide",
    title: "画像案内の効果",
    description:
      "画像を利用した案内では、文章のみの案内より解決率が高くなっています。",
  },
  {
    id: "insight-track-comparison",
    title: "情報タイプ別の解決率の違い",
    description:
      "「安心・確実タイプ（公式情報）」に加えて「実践・時短タイプ（オーナー体験談・動画）」も確認したユーザーの方が、解決率が高い傾向にあります。",
  },
];

export const demoCxImprovementActions: CxImprovementAction[] = [
  {
    id: "action-faq",
    title: "FAQ表現を変更する",
    description: "専門用語を避け、平易な言葉と図解を追加する。",
  },
  {
    id: "action-manual",
    title: "Owner's Manualの説明を改善する",
    description: "スイッチ位置を示す図を追加し、手順を3ステップに整理する。",
  },
  {
    id: "action-image-guide",
    title: "画像ガイドを標準化する",
    description: "主要な困りごとカテゴリすべてに画像ガイドを用意する。",
  },
];

export function getUpgradeServiceById(id: string) {
  return upgradeServices.find((service) => service.id === id);
}
