/**
 * デモ用Source初期データ（3件）
 * 出典: docs/input/voc_knowledge_system_overview_requirements.md #4.1
 */

export interface SeedSource {
  id: string;
  name: string;
  url: string;
  sourceType: "qa" | "video" | "blog";
  vehicleModel: string;
}

export const seedSources: SeedSource[] = [
  {
    id: "src-minkara",
    name: "みんカラ NX Q&A",
    url: "https://minkara.carview.co.jp/car/lexus/nx/qa/?ci=3",
    sourceType: "qa",
    vehicleModel: "NX",
  },
  {
    id: "src-cskreview",
    name: "CSK REVIEW CHANNEL",
    url: "https://cskreview.com/nxfuguai/",
    sourceType: "video",
    vehicleModel: "NX",
  },
  {
    id: "src-testdrive",
    name: "試乗マニアのドライブジャーナル",
    url: "https://bicyclenet.jp/lexus-nx-issues-checklist/",
    sourceType: "blog",
    vehicleModel: "NX",
  },
];
