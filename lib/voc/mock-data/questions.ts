/**
 * デモ用Expert Question初期データ（3件、うちPending Answer 2件）
 * 出典: docs/input/voc_knowledge_system_overview_requirements.md #15, #24
 */

export interface SeedAnswer {
  id: string;
  contributorId: string;
  answerText: string;
  status: "pending" | "accepted";
  /** acceptedの場合、生成済みKnowledgeItemのid（knowledge.tsのfromExpertAnswer経由で紐付け） */
  linkedKnowledgeId?: string;
}

export interface SeedQuestion {
  id: string;
  title: string;
  vehicleModel: string;
  symptoms: string[];
  conditions: string[];
  alreadyChecked: string[];
  questionText: string;
  tags: string[];
  rewardPoints: number;
  status: "open" | "answered" | "resolved";
  answers: SeedAnswer[];
}

export const seedQuestions: SeedQuestion[] = [
  {
    id: "q-noise-lowspeed",
    title: "低速時に足回りからコトコト音がする方いますか？",
    vehicleModel: "NX350h",
    symptoms: ["低速走行時にコトコト音", "段差通過後に発生しやすい"],
    conditions: ["低速走行時", "段差通過後"],
    alreadyChecked: ["タイヤ空気圧", "室内の異物"],
    questionText:
      "新車から2,000km程度のNX350hです。低速走行時、特に段差を超えた後にコトコトと音がします。同じ症状を経験した方はいますか？",
    tags: ["noise", "足回り", "NX350h"],
    rewardPoints: 50,
    status: "answered",
    answers: [
      {
        id: "ans-noise-1",
        contributorId: "c-msato",
        answerText:
          "整備の現場でよく見る症状です。ロアアームブッシュが初期馴染みするまでの微小な遊びで、1,000〜3,000km程度で自然に音が減ることが多いです。改善しない場合は増し締め・ブッシュ点検を依頼してください。",
        status: "accepted",
        linkedKnowledgeId: "k-noise-expert",
      },
    ],
  },
  {
    id: "q-battery-drain",
    title: "短距離走行が多いと12Vバッテリーが上がりやすい？",
    vehicleModel: "NX450h+",
    symptoms: ["12Vバッテリー上がり", "短距離走行中心"],
    conditions: ["短距離走行が多い", "週2回程度の利用"],
    alreadyChecked: ["ライト消灯確認", "ドア閉め忘れ確認"],
    questionText:
      "通勤で毎日3km程度しか乗らないのですが、12Vバッテリーが上がりやすい気がします。同じような使い方をしている方で対策している方はいますか？",
    tags: ["battery", "12V", "短距離"],
    rewardPoints: 50,
    status: "open",
    answers: [
      {
        id: "ans-battery-1",
        contributorId: "c-ryamada",
        answerText:
          "短距離走行が多い場合、充電が追いつかず徐々に消耗するケースが多いです。週末に30分程度のまとまった走行を挟むと改善する例が多いです。半年に1回程度、点検時にバッテリー状態を診断してもらうのもおすすめです。",
        status: "pending",
      },
    ],
  },
  {
    id: "q-infotainment-lag",
    title: "OTA更新後にナビの動作が重くなった？",
    vehicleModel: "NX",
    symptoms: ["ナビ操作の反応が遅い", "OTA更新後に発生"],
    conditions: ["OTA更新後"],
    alreadyChecked: ["再起動", "初期化はしていない"],
    questionText:
      "直近のOTA更新後、ナビの地図スクロールが少し重くなった気がします。同様の変化を感じた方はいますか？",
    tags: ["infotainment", "OTA", "navi"],
    rewardPoints: 40,
    status: "open",
    answers: [
      {
        id: "ans-infotainment-1",
        contributorId: "c-ksuzuki",
        answerText:
          "私の車両でも似た印象があります。更新直後はキャッシュの再構築が走るため一時的に重くなることがあり、数日〜1週間ほどで元に戻るケースを確認しています。改善しない場合はディーラーでの再インストールが有効です。",
        status: "pending",
      },
    ],
  },
];
