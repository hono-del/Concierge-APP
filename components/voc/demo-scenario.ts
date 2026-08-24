export interface DemoStep {
  step: number;
  title: string;
  description: string;
  href: string;
}

/**
 * デモ導線（要件 #27）：Collect → Structure → Ask → Compare → Ask Expert → Answer → Review → Accept → Reward
 */
export const demoSteps: DemoStep[] = [
  {
    step: 1,
    title: "Collect VoC",
    description: "Source Managementで「Collect」を押し、VoCを収集します。",
    href: "/studio/sources",
  },
  {
    step: 2,
    title: "Structure Knowledge",
    description: "収集したVoCを開き、「Structure with AI」でナレッジ化します。",
    href: "/studio",
  },
  {
    step: 3,
    title: "Ask Trouble",
    description: "Customer Chatで「後席のドアが外から開かない。急いでいる。」と相談します。",
    href: "/chat",
  },
  {
    step: 4,
    title: "Compare Official vs VoC",
    description: "Knowledge Modeトグルで Official Only と Official + VoC の回答を比較します。",
    href: "/chat",
  },
  {
    step: 5,
    title: "Ask Expert",
    description: "確信度の低い質問を送り、Expert Communityへの質問生成を体験します。",
    href: "/chat",
  },
  {
    step: 6,
    title: "Answer",
    description: "Expert Communityで有識者役として回答を投稿します。",
    href: "/community",
  },
  {
    step: 7,
    title: "Review",
    description: "Knowledge Studioの承認待ち回答を確認します。",
    href: "/studio/review",
  },
  {
    step: 8,
    title: "Accept Knowledge",
    description: "「Knowledgeに採用」を押し、新しいKnowledgeを作成します。",
    href: "/studio/review",
  },
  {
    step: 9,
    title: "Reward",
    description: "Contributorへポイントが付与される様子を確認します。",
    href: "/community",
  },
];
