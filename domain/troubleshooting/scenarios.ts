import type {
  CauseCandidate,
  SimilarCaseComment,
  TroubleshootingScenario,
} from "@/types";

/**
 * 診断結果画面に表示する、Webの口コミ・SNS投稿を模したデモ用のダミーコメント。
 * 実在の投稿ではなく、デモ演出のために作成した架空のコメントである。
 */
const RIGHT_REAR_COMMENTS: SimilarCaseComment[] = [
  {
    author: "@NX_owner_haru",
    source: "X（旧Twitter）／デモ用ダミー",
    text: "右後ろのドアだけ開かなくなって焦った…メカニカルキーでカバー外して手動リリースハンドル引いたら普通に開いた。",
  },
  {
    author: "みかんどらいぶ",
    source: "口コミサイト／デモ用ダミー",
    text: "納車1ヶ月、右後席だけドアが開かず。ディーラーに電話する前にマニュアルを見たら手動リリースハンドルの記載があり、その通りにしたら解決しました。",
  },
  {
    author: "yuta_nx",
    source: "掲示板／デモ用ダミー",
    text: "同じ症状でした。ロックの問題かと思ったら違った。カードでカバーを浮かせてキーを回すの、最初は難しかったけど2回目からは余裕でした。",
  },
];

const LEFT_REAR_COMMENTS: SimilarCaseComment[] = [
  {
    author: "@lexus_nx_life",
    source: "X（旧Twitter）／デモ用ダミー",
    text: "左後ろのドアが急に開かなくなった。子供を乗せてる時じゃなくて良かった…手動リリースハンドルで無事解決。",
  },
  {
    author: "そらまめ",
    source: "口コミサイト／デモ用ダミー",
    text: "左後席だけ開かず焦りましたが、マニュアルの手動リリースハンドルのページの通りにやったら1分もかからず開きました。",
  },
  {
    author: "nx_owner_2026",
    source: "掲示板／デモ用ダミー",
    text: "これロックの不具合じゃなくてe-Latchスイッチの反応不良らしい。手動ハンドルで開けられるので覚えておくと安心。",
  },
];

const BOTH_REAR_COMMENTS: SimilarCaseComment[] = [
  {
    author: "@ev_family_car",
    source: "X（旧Twitter）／デモ用ダミー",
    text: "両方の後席ドアが開かなくなって驚いたけど、バッテリーが少し弱ってたのが原因だったみたい。手動リリースハンドルで開けて事なきを得た。",
  },
  {
    author: "くるまとくらし",
    source: "口コミサイト／デモ用ダミー",
    text: "後席ドア両方とも開かず。ロックの故障を疑ったけど、実際はスイッチの反応不良と補機バッテリーの電圧低下が重なっていたようです。",
  },
  {
    author: "taka_nx450",
    source: "掲示板／デモ用ダミー",
    text: "両側同時に開かないのは初めてで焦りました。手動リリースハンドルの手順、事前に知っておいて良かったです。",
  },
];

/**
 * 「後席のドアが開かない」シナリオ（Hero Use Case）。
 * 出典: docs/output/detailed_requirements_specification.md 4.2 状況確認・トラブルシューティング
 * ガイダンス本文は公式オーナーズマニュアル
 * 「ドア開スイッチでドアを開けることができない」（手動リリースハンドルの操作）に基づく。
 */
const rearDoorNotOpenScenario: TroubleshootingScenario = {
  code: "rear_door_not_open",
  title: "後席のドアが開かない",
  version: 2,
  status: "approved",
  matchKeywords: [
    "ドア",
    "後席",
    "後ろ",
    "開かない",
    "開けられない",
    "車外",
    "外から",
    "e-latch",
    "eラッチ",
    "開スイッチ",
    "手動リリース",
  ],
  fallbackSampleIssues: [
    "後ろのドアが開かない",
    "エンジンがかからない",
    "Bluetoothがつながらない",
  ],
  // 状況確認はドア位置の1問のみに絞り、素早く診断へ進める。
  questions: [
    {
      code: "door_position",
      prompt: "どのドアが開かない？",
      sequence: 1,
      options: [
        { code: "left_rear", label: "左後席" },
        { code: "right_rear", label: "右後席" },
        { code: "both_rear", label: "両方" },
      ],
    },
  ],
  evaluateCauses(answers: Record<string, string>): CauseCandidate[] {
    const doorPosition = answers.door_position;

    if (doorPosition === "left_rear" || doorPosition === "right_rear") {
      const doorLabel = doorPosition === "left_rear" ? "左後席" : "右後席";
      return [
        {
          code: doorPosition === "left_rear" ? "elatch_switch_left" : "elatch_switch_right",
          label: `${doorLabel}側のドア開スイッチまたは施錠状態が原因`,
          priority: 1,
          confidenceLabel: "high",
          similarCaseCount: doorPosition === "left_rear" ? 24 : 27,
          evidenceIds: ["ks-manual-door-open-switch", "ks-manual-smart-entry"],
          similarComments:
            doorPosition === "left_rear" ? LEFT_REAR_COMMENTS : RIGHT_REAR_COMMENTS,
        },
      ];
    }

    // 「両方」、または未回答（一般的な手順をスキップして見る場合）
    return [
      {
        code: "elatch_switch_both",
        label: "両側のドア開スイッチまたは施錠状態が原因",
        priority: 1,
        confidenceLabel: doorPosition === "both_rear" ? "high" : "medium",
        similarCaseCount: 9,
        evidenceIds: ["ks-manual-door-open-switch", "ks-manual-smart-entry"],
        similarComments: BOTH_REAR_COMMENTS,
      },
      {
        code: "battery_voltage_low",
        label: "補機バッテリー電圧の低下（ロック解除状態が続いた場合に発生することがあります）",
        priority: 2,
        confidenceLabel: "low",
        similarCaseCount: 4,
        evidenceIds: ["ks-manual-manual-release"],
      },
    ];
  },
  // community track（オーナー体験談・動画等）を提示してよいシナリオかどうか。
  // ドア開閉は安全上のクリティカルな事象ではないため許可する。
  communityTrackAllowed: true,
  guidances: {
    check_door_switch_and_lock_official: {
      code: "check_door_switch_and_lock_official",
      title: "外から後席ドアが開かない場合の対処法",
      track: "official",
      estimatedSeconds: 45,
      approvalStatus: "approved",
      sourceIds: ["ks-manual-door-open-switch", "ks-manual-smart-entry"],
      steps: [
        {
          id: "step-1",
          title: "ドアハンドル裏側の「ドア開スイッチ」を確認します",
          body: "レクサスNXには、電子制御でドアを開閉するe-Latchシステムが採用されています。従来の車のようにドアハンドル自体を手前に引っ張るのではなく、ドアハンドル裏面（内側）にある「ドア開スイッチ（ボタン）」を確実に押し込むことで電動でドアが開く仕組みになっています。ドアハンドルを単に手前に引いているだけではドアは開きませんので、裏側のスイッチを指でしっかり押し込んでいるか確認してください。",
          icon: "switch",
          imageUrl: "/images/door-open-switch-handle.jpg",
        },
        {
          id: "step-2",
          title: "車両がロック（施錠）されていないか確認します",
          body: "スマートエントリー＆スタートシステム（キーを携帯して近づくだけでドアを解錠できる機能）の車外アンテナは、前席（運転席・助手席）のドアハンドルとバックドアにのみ搭載されています。そのため、キーを持った状態であっても、後席ドアのそばに立ってスイッチを押すだけではロックが解除されず、ドアは開きません。",
          icon: "shield-check",
        },
        {
          id: "step-3",
          title: "前席のドアハンドルまたは電子キーで解錠します",
          body: "電子キーを携帯した状態で、前席（運転席または助手席）のドアハンドルを握って、先に車両全体のロックを解除してください。または、電子キーの「解錠ボタン」を押してロックを解除してください。",
          icon: "door",
          warning:
            "スマートエントリーの設定が初期状態の「運転席のみ解錠」になっている場合、運転席ドアハンドルを握っただけでは後席のロックが解除されません。その場合は、助手席側のドアハンドルを握って全席を解錠するか、電子キーの解錠ボタンを使用してください。",
        },
      ],
    },
    check_manual_release_community: {
      code: "check_manual_release_community",
      title: "手動リリースハンドルの操作手順（メカニカルキー使用）",
      track: "community",
      estimatedSeconds: 60,
      approvalStatus: "approved",
      sourceIds: ["ks-manual-manual-release", "ks-faq-manual-release"],
      disclaimer:
        "こちらは工具（メカニカルキー）を使ってご自身で解決する、より踏み込んだ対処法です。まずは「安心・確実タイプ」の内容をお試しいただき、それでも解決しない場合にご利用ください。",
      steps: [
        {
          id: "step-1",
          title: "ドアハンドルのスリット部にカードを差し込みます",
          body: "対象のドアハンドルのスリット部にプラスチック製のカードなどを挿し込み、カバーを浮かせます。カバーに過度な負荷をかけないようご注意ください。",
          icon: "search",
          imageUrl: "/images/release-handle-step-cover.png",
        },
        {
          id: "step-2",
          title: "カバーを取りはずします",
          body: "カバー後方を押しながら取りはずすと、メカニカルキーシリンダーが現れます。",
          icon: "switch",
          imageUrl: "/images/release-handle-step-insert-card.png",
        },
        {
          id: "step-3",
          title: "メカニカルキーでロック解除側にまわします",
          body: "メカニカルキーを挿し込み、ロック解除側にまわすと、手動リリースハンドルの作動が有効になります。メカニカルキーは挿し込み方向に指定のある片溝キーです。挿し込めないときはキー溝面の向きを変えてください。",
          icon: "shield-check",
          imageUrl: "/images/release-handle-step-turn-key.png",
        },
        {
          id: "step-4",
          title: "手動リリースハンドルを手前に引いてドアを開けます",
          body: "作動が有効になった状態で、ドア内側にある手動リリースハンドルを手前に引くとドアが開きます。",
          icon: "door",
          warning:
            "有効にする操作を行わずに手動リリースハンドルを強い力で操作すると、破損・変形のおそれがあります。",
          imageUrl: "/images/release-handle-step-pull.png",
        },
      ],
    },
  },
};

export const troubleshootingScenarios: TroubleshootingScenario[] = [
  rearDoorNotOpenScenario,
];
