import {
  geographyTopics,
  getGeographyTopic,
} from "@/lib/geography-topics";

import {
  sportTopics,
  getSportTopic,
} from "@/lib/sport-topics";

export type CategoryTopic = {
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  image?: string;
};

export const categoryTopics: Record<
  string,
  CategoryTopic[]
> = {
  geographie: geographyTopics,
  sport: sportTopics,
};

export function getTopicsForCategory(
  categorySlug: string,
): CategoryTopic[] {
  return categoryTopics[categorySlug] ?? [];
}

export function getCategoryTopic(
  categorySlug: string,
  topicSlug: string,
): CategoryTopic | undefined {
  if (categorySlug === "geographie") {
    return getGeographyTopic(topicSlug);
  }

  if (categorySlug === "sport") {
    return getSportTopic(topicSlug);
  }

  return undefined;
}