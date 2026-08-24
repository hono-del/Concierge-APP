import type { Recommendation, RecommendationType } from "@/types";

/**
 * Recommendation Engine
 * 車両・ユーザー文脈に基づく推薦の並び替え・絞り込みを行う（決定論的）。
 */

export function sortByPriority(
  recommendations: Recommendation[]
): Recommendation[] {
  return [...recommendations].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.id.localeCompare(b.id);
  });
}

export function filterByType(
  recommendations: Recommendation[],
  type: RecommendationType
): Recommendation[] {
  return sortByPriority(
    recommendations.filter((recommendation) => recommendation.type === type)
  );
}

export function getTopRecommendations(
  recommendations: Recommendation[],
  count: number
): Recommendation[] {
  return sortByPriority(recommendations).slice(0, count);
}
