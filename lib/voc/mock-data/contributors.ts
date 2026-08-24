import type { ContributorBadge } from "../types";

export interface SeedContributor {
  id: string;
  name: string;
  badge: ContributorBadge;
  vehicleModel?: string;
  knowledgeLevel: number;
  points: number;
  acceptedAnswers: number;
  helpfulRate: number;
}

/** デモ用Contributor初期データ（4名） */
export const seedContributors: SeedContributor[] = [
  {
    id: "c-tkato",
    name: "T.Kato",
    badge: "NX Owner",
    vehicleModel: "NX450h+",
    knowledgeLevel: 4,
    points: 1280,
    acceptedAnswers: 6,
    helpfulRate: 92,
  },
  {
    id: "c-msato",
    name: "M.Sato",
    badge: "Mechanic",
    knowledgeLevel: 3,
    points: 860,
    acceptedAnswers: 4,
    helpfulRate: 88,
  },
  {
    id: "c-ryamada",
    name: "R.Yamada",
    badge: "Dealer Staff",
    knowledgeLevel: 5,
    points: 2100,
    acceptedAnswers: 9,
    helpfulRate: 96,
  },
  {
    id: "c-ksuzuki",
    name: "K.Suzuki",
    badge: "EV Expert",
    vehicleModel: "NX450h+",
    knowledgeLevel: 2,
    points: 340,
    acceptedAnswers: 1,
    helpfulRate: 75,
  },
];
