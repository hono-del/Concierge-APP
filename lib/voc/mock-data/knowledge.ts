import type {
  KnowledgeCategory,
  KnowledgeCause,
  KnowledgeCheck,
  KnowledgeConditions,
  KnowledgeResolution,
  KnowledgeSafety,
  KnowledgeSourceRef,
  KnowledgeStatus,
  KnowledgeTrust,
  KnowledgeVehicle,
} from "../types";

/**
 * デモ用Structured Knowledge初期データ（13件・要件最低10件）
 * Official / Owner Experience(community) / Community(blog,video) / Expert を混在させ、
 * Trust / Safetyの違いをデモで示せるようにする。
 */
export interface SeedKnowledge {
  id: string;
  rawVocId?: string;
  vehicle: KnowledgeVehicle;
  category: KnowledgeCategory;
  issueTitle: string;
  symptom: string[];
  conditions: KnowledgeConditions;
  possibleCauses: KnowledgeCause[];
  checks: KnowledgeCheck[];
  resolutions: KnowledgeResolution[];
  tips: string[];
  source: KnowledgeSourceRef;
  trust: KnowledgeTrust;
  safety: KnowledgeSafety;
  status: KnowledgeStatus;
  /** 過去にExpert Communityで承認された回答から生成されたKnowledgeであることを示す（seed専用フラグ） */
  fromExpertAnswer?: { questionId: string; contributorId: string };
}

const nx: KnowledgeVehicle = { maker: "LEXUS", model: "NX" };
const nx450: KnowledgeVehicle = { maker: "LEXUS", model: "NX", powertrain: "NX450h+" };
const nx350: KnowledgeVehicle = { maker: "LEXUS", model: "NX", powertrain: "NX350h" };

export const seedKnowledge: SeedKnowledge[] = [
  // ── Door ─────────────────────────────────────────────
  {
    id: "k-door-official",
    vehicle: nx,
    category: "door",
    issueTitle: "後席ドアが車外から開かない場合の基本確認",
    symptom: ["後席ドアが車外から開かない"],
    conditions: {},
    possibleCauses: [
      { label: "チャイルドプロテクター（内側ロック）が有効になっている", confidence: 0.6 },
      { label: "スマートキーの電池残量低下", confidence: 0.3 },
    ],
    checks: [
      { order: 1, action: "後席ドア内側のチャイルドプロテクターレバーの位置を確認する", reason: "有効時は仕様上、車外から開閉できません" },
      { order: 2, action: "スマートキーの電池残量を確認する" },
    ],
    resolutions: [{ action: "チャイルドプロテクターを解除する", outcome: "車外から開閉可能になる" }],
    tips: [],
    source: { type: "official", title: "オーナーズマニュアル：ドアの開閉について" },
    trust: { score: 100, reason: ["公式情報"], officialCorroboration: true, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },
  {
    id: "k-door-outside-voc",
    rawVocId: "raw-door-01",
    vehicle: nx450,
    category: "door",
    issueTitle: "後席左ドアのみ車外から開かないことがある",
    symptom: ["後席左ドアのみ車外から開かない", "車内からは正常に開く", "他のドアは正常"],
    conditions: { vehicleState: ["施錠状態"], frequency: "時々" },
    possibleCauses: [
      { label: "e-Latchセンサーの感度不足（個体差により片側で発生しやすい）", confidence: 0.5 },
      { label: "チャイルドプロテクターの誤操作", confidence: 0.2 },
    ],
    checks: [
      { order: 1, action: "該当ドアのチャイルドプロテクターが未使用であることを確認する" },
      { order: 2, action: "e-Latchセンサー表面を拭いてから、しっかり押し直す" },
    ],
    resolutions: [{ action: "センサーを拭いて中央を2秒押す", outcome: "解決", evidenceCount: 1 }],
    tips: ["急いでいる時はスマートキーのボタンでの解錠が確実"],
    source: { type: "community", title: "みんカラ NX Q&A", url: "https://minkara.carview.co.jp/car/lexus/nx/qa/?ci=3&q=1023", author: "NXオーナー" },
    trust: { score: 60, reason: ["1件のオーナー体験談"], officialCorroboration: false, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },
  {
    id: "k-elatch-response-voc",
    rawVocId: "raw-elatch-01",
    vehicle: nx,
    category: "door",
    issueTitle: "e-Latch（後席外側開閉センサー）が反応しないことがある",
    symptom: ["後席のe-Latchを押しても反応しない", "他のドアは正常"],
    conditions: { vehicleState: ["停車中"], frequency: "時々" },
    possibleCauses: [
      { label: "e-Latchセンサー表面の汚れ・水滴による感度低下", confidence: 0.7 },
      { label: "タッチ位置のズレ（センサー中央から外れている）", confidence: 0.4 },
    ],
    checks: [
      { order: 1, action: "センサー表面を乾いた布で軽く拭く" },
      { order: 2, action: "指の腹でセンサー中央をしっかり2秒押す", reason: "複数のオーナーが浅いタッチでは反応しにくいと報告しています" },
    ],
    resolutions: [{ action: "センサーを拭いてから中央を2秒押す", outcome: "再現時に解決", evidenceCount: 1 }],
    tips: ["濡れた手や手袋をしている場合は反応が悪くなりやすい"],
    source: { type: "community", title: "みんカラ NX Q&A", url: "https://minkara.carview.co.jp/car/lexus/nx/qa/?ci=3&q=1109", author: "NXオーナー" },
    trust: { score: 60, reason: ["1件のオーナー体験談"], officialCorroboration: false, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },
  {
    id: "k-elatch-response-voc2",
    rawVocId: "raw-elatch-02",
    vehicle: nx,
    category: "door",
    issueTitle: "手袋使用時にe-Latchの反応が悪くなる",
    symptom: ["手袋をしているとe-Latchが反応しにくい"],
    conditions: { weather: ["冬季"], vehicleState: ["手袋使用時"] },
    possibleCauses: [{ label: "手袋がタッチセンサーの静電容量検知を妨げる", confidence: 0.6 }],
    checks: [{ order: 1, action: "手袋を外して素手でセンサーに触れてみる" }],
    resolutions: [{ action: "素手でタッチ、またはタッチ位置を変える", outcome: "複数オーナーで改善報告あり", evidenceCount: 3 }],
    tips: ["厚手の手袋のときはスマートキーのボタンでの解錠が確実"],
    source: { type: "blog", title: "試乗マニアのドライブジャーナル", url: "https://bicyclenet.jp/lexus-nx-issues-checklist/#elatch-glove", author: "試乗マニア編集部" },
    trust: { score: 80, reason: ["3件の類似報告（編集部まとめ）"], officialCorroboration: false, multipleSourceSupport: true },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },

  // ── Battery ──────────────────────────────────────────
  {
    id: "k-battery-official",
    vehicle: nx,
    category: "battery",
    issueTitle: "12Vバッテリー上がり時の基本対応",
    symptom: ["スマートキーで解錠できない", "警告メッセージが表示される"],
    conditions: {},
    possibleCauses: [{ label: "12Vバッテリーの電圧低下", confidence: 0.6 }],
    checks: [
      { order: 1, action: "オーナーズマニュアルで非常用電源端子（ジャンプスタート端子）の位置を確認する" },
      { order: 2, action: "ブースターケーブルで救援するか、ロードサービス・ディーラーへ連絡する" },
    ],
    resolutions: [{ action: "救援後、ディーラーでの点検を推奨", outcome: undefined }],
    tips: [],
    source: { type: "official", title: "オーナーズマニュアル：12Vバッテリーについて" },
    trust: { score: 100, reason: ["公式情報"], officialCorroboration: true, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },
  {
    id: "k-battery-voc",
    rawVocId: "raw-battery-01",
    vehicle: nx450,
    category: "battery",
    issueTitle: "長期間駐車で12Vバッテリーが上がりやすい",
    symptom: ["1週間程度の駐車後にスマートキーで解錠できない", "12Vバッテリー上がりの表示"],
    conditions: { vehicleState: ["長期駐車"], frequency: "1週間以上駐車時" },
    possibleCauses: [{ label: "待機電力による12Vバッテリーの緩やかな消耗", confidence: 0.6 }],
    checks: [
      { order: 1, action: "1週間以上乗らない予定がある場合は、事前に10分程度走行しておく" },
      { order: 2, action: "緊急解錠の方法（メカニカルキー等）を確認しておく" },
    ],
    resolutions: [{ action: "ブースターケーブルまたはディーラーでの救援", outcome: "復旧", evidenceCount: 1 }],
    tips: ["長期駐車前は補助バッテリー用のトリクル充電器の使用も有効という声がある"],
    source: { type: "community", title: "みんカラ NX Q&A", url: "https://minkara.carview.co.jp/car/lexus/nx/qa/?ci=3&q=1157", author: "NXオーナー" },
    trust: { score: 60, reason: ["1件のオーナー体験談"], officialCorroboration: false, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },

  // ── Infotainment ─────────────────────────────────────
  {
    id: "k-carplay-official",
    vehicle: nx,
    category: "infotainment",
    issueTitle: "Apple CarPlay接続不良時の基本確認",
    symptom: ["CarPlayが接続できない、または切断される"],
    conditions: {},
    possibleCauses: [{ label: "ケーブル・ポートの接触不良", confidence: 0.4 }],
    checks: [
      { order: 1, action: "純正または適合するUSBケーブルを使用しているか確認する" },
      { order: 2, action: "インフォテインメントのソフトウェアバージョンを確認する" },
    ],
    resolutions: [{ action: "ソフトウェア更新・ケーブル交換", outcome: undefined }],
    tips: [],
    source: { type: "official", title: "オーナーズマニュアル：Apple CarPlayについて" },
    trust: { score: 100, reason: ["公式情報"], officialCorroboration: true, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },
  {
    id: "k-carplay-voc",
    rawVocId: "raw-carplay-01",
    vehicle: nx,
    category: "infotainment",
    issueTitle: "走行中にApple CarPlayの接続が頻繁に切れる",
    symptom: ["高速走行中にCarPlayが切断される", "数分おきに再接続が必要"],
    conditions: { vehicleState: ["高速走行中"], frequency: "数分おき" },
    possibleCauses: [
      { label: "ソフトウェアバージョンが古い", confidence: 0.5 },
      { label: "USBケーブル・ポートの接触不良", confidence: 0.4 },
    ],
    checks: [
      { order: 1, action: "インフォテインメントのソフトウェアバージョンを確認し、最新化する" },
      { order: 2, action: "別のUSBポート・ケーブルで再接続を試す" },
    ],
    resolutions: [{ action: "ソフトウェア更新後に改善", outcome: "改善報告あり", evidenceCount: 1 }],
    tips: ["Wireless CarPlay対応の場合、無線接続に切り替えると安定するという報告がある"],
    source: { type: "video", title: "CSK REVIEW CHANNEL", url: "https://cskreview.com/nxfuguai/#carplay", author: "CSKレビュー編集部" },
    trust: { score: 60, reason: ["1件の動画レビュー報告"], officialCorroboration: false, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },
  {
    id: "k-navi-freeze-voc",
    rawVocId: "raw-navifreeze-01",
    vehicle: nx,
    category: "infotainment",
    issueTitle: "ナビ / ディスプレイが時々フリーズする",
    symptom: ["ナビ操作中に画面が数秒〜数十秒応答しなくなる", "再起動すると復帰する"],
    conditions: { frequency: "時々", timing: "特定操作の直後" },
    possibleCauses: [{ label: "インフォテインメントシステムの一時的な処理負荷", confidence: 0.5 }],
    checks: [
      { order: 1, action: "電源を切り数分待機してから再起動する" },
      { order: 2, action: "ソフトウェアバージョンを確認する" },
    ],
    resolutions: [{ action: "再起動で復帰", outcome: "一時的に解決", evidenceCount: 1 }],
    tips: ["フリーズが頻発する場合は発生状況を控えておくとディーラーでの確認がスムーズ"],
    source: { type: "video", title: "CSK REVIEW CHANNEL", url: "https://cskreview.com/nxfuguai/#navifreeze", author: "CSKレビュー編集部" },
    trust: { score: 60, reason: ["1件の動画レビュー報告"], officialCorroboration: false, multipleSourceSupport: false },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },

  // ── Warning ──────────────────────────────────────────
  {
    id: "k-warning-official",
    vehicle: nx,
    category: "warning",
    issueTitle: "警告灯が点灯したまま消えない場合の基本確認",
    symptom: ["メーター内の警告灯が点灯したまま消えない"],
    conditions: {},
    possibleCauses: [
      { label: "タイヤ空気圧の低下", confidence: 0.4 },
      { label: "一時的なセンサー誤検知", confidence: 0.3 },
    ],
    checks: [
      { order: 1, action: "警告灯の種類（色・アイコン）を確認する" },
      { order: 2, action: "タイヤ空気圧を確認する" },
      { order: 3, action: "改善しない場合は販売店に連絡する" },
    ],
    resolutions: [{ action: "空気圧調整後に消灯", outcome: "改善" }],
    tips: [],
    source: { type: "official", title: "オーナーズマニュアル：警告灯について" },
    trust: { score: 100, reason: ["公式情報"], officialCorroboration: true, multipleSourceSupport: false },
    safety: {
      level: "medium",
      requiresOfficialConfirmation: true,
      notes: ["警告灯の種類によっては安全に関わるため、点灯が続く場合は公式情報の確認を優先します"],
    },
    status: "approved",
  },

  // ── Noise ────────────────────────────────────────────
  {
    id: "k-brake-noise-official",
    vehicle: nx,
    category: "noise",
    issueTitle: "ブレーキ付近から異音がする場合の対応",
    symptom: ["ブレーキ操作時にキーキー音・こすれる音がする"],
    conditions: {},
    possibleCauses: [{ label: "ブレーキパッドの摩耗", confidence: 0.5 }],
    checks: [
      {
        order: 1,
        action: "直ちに販売店・正規ディーラーへ連絡し点検を受ける",
        reason: "ブレーキは安全に直結する装置のため、経験談のみでの判断は行いません",
      },
    ],
    resolutions: [{ action: "ディーラーでの点検・部品交換", outcome: undefined }],
    tips: [],
    source: { type: "official", title: "オーナーズマニュアル：ブレーキについて" },
    trust: { score: 100, reason: ["公式情報"], officialCorroboration: true, multipleSourceSupport: false },
    safety: {
      level: "high",
      requiresOfficialConfirmation: true,
      notes: ["ブレーキ関連は安全に直結するため、Experience Knowledgeのみでは案内しません"],
    },
    status: "approved",
  },
  {
    id: "k-noise-voc",
    rawVocId: "raw-noise-01",
    vehicle: nx350,
    category: "noise",
    issueTitle: "低速走行時に足回りからコトコト音がする",
    symptom: ["段差通過後、低速走行中にコトコト音がする", "速度を上げると聞こえなくなる"],
    conditions: { vehicleState: ["低速走行時", "段差通過後"], frequency: "時々" },
    possibleCauses: [
      { label: "サスペンションブッシュ類の初期馴染みによる微小な遊び", confidence: 0.5 },
      { label: "足回り部品の締結部の緩み", confidence: 0.3 },
    ],
    checks: [
      { order: 1, action: "音が出る速度・状況（段差直後か常時か）を記録する" },
      { order: 2, action: "次回点検時に増し締め確認を依頼する" },
    ],
    resolutions: [{ action: "ディーラーでの増し締め確認", outcome: "複数オーナーで改善報告", evidenceCount: 3 }],
    tips: ["試乗した複数のNXオーナーから同様の報告があり、症状自体は珍しくない可能性がある"],
    source: { type: "blog", title: "試乗マニアのドライブジャーナル", url: "https://bicyclenet.jp/lexus-nx-issues-checklist/#noise", author: "試乗マニア編集部" },
    trust: { score: 80, reason: ["3件の類似報告（編集部まとめ）"], officialCorroboration: false, multipleSourceSupport: true },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
  },
  {
    id: "k-noise-expert",
    vehicle: nx350,
    category: "noise",
    issueTitle: "低速時のコトコト音はロアアームブッシュの初期馴染みが多い（メカニック経験）",
    symptom: ["低速走行時にコトコト音", "段差通過後に発生しやすい"],
    conditions: { vehicleState: ["低速走行時", "段差通過後"], frequency: "新車から3,000km程度" },
    possibleCauses: [{ label: "ロアアームブッシュの初期馴染み", confidence: 0.7 }],
    checks: [
      { order: 1, action: "1,000〜3,000km程度で音が自然に減るか経過を確認する" },
      { order: 2, action: "改善しない場合は増し締め・ブッシュ点検を依頼する" },
    ],
    resolutions: [{ action: "初期馴染み期間の経過観察後、必要に応じて増し締め", outcome: "多くのケースで自然改善", evidenceCount: 5 }],
    tips: ["新車から3,000km程度は経過観察で問題ないケースが多いというのが整備現場での一般的な見解"],
    source: { type: "expert", title: "Expert Community回答（M.Sato / Mechanic）", author: "M.Sato" },
    trust: { score: 75, reason: ["Expert Communityで承認された回答", "整備現場での経験に基づく"], officialCorroboration: false, multipleSourceSupport: true },
    safety: { level: "low", requiresOfficialConfirmation: false },
    status: "approved",
    fromExpertAnswer: { questionId: "q-noise-lowspeed", contributorId: "c-msato" },
  },
];
