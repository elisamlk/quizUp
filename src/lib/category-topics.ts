import {
  geographyTopics,
  getGeographyTopic,
} from "@/lib/geography-topics";

import {
  sportTopics,
  getSportTopic,
} from "@/lib/sport-topics";

import {
  seriesTvTopics,
  getSeriesTvTopic,
} from "@/lib/series-tv-topics";

import {
  historyTopics,
  getHistoryTopic,
} from "@/lib/history-topics";

import {
  cinemaTopics,
  getCinemaTopic,
} from "@/lib/cinema-topics";

import {
  scienceTopics,
  getScienceTopic,
} from "@/lib/science-topics";

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
  "serie-tv": seriesTvTopics,
  histoire: historyTopics,
  cinema: cinemaTopics,
  sciences: scienceTopics,
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

  if (categorySlug === "serie-tv") {
    return getSeriesTvTopic(topicSlug);
  }

  if (categorySlug === "histoire") {
    return getHistoryTopic(topicSlug);
  }

  if (categorySlug === "cinema") {
    return getCinemaTopic(topicSlug);
  }

  if (categorySlug === "sciences") {
    return getScienceTopic(topicSlug);
  }

  return undefined;
}