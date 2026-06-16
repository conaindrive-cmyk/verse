/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum NewsCategory {
  HOME = "Home",
  LATEST = "Latest News",
  PAKISTAN = "Pakistan",
  WORLD = "World",
  BUSINESS = "Business",
  TECHNOLOGY = "Technology",
  SPORTS = "Sports",
}

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string;
  content: string; // Dynamic markdown/paragraphs
  imageUrl: string;
  publishedAt: string;
  readTime: string;
  isBreaking?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  viewCount: number;
  videoUrl?: string | null;
  author: string;
  commentsCount?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface VideoReport {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  category: string;
  thumbnailUrl: string;
  views: string;
  publishedAt: string;
}

export function cleanImageUrl(url: string | undefined): string {
  if (!url) return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";
  const cleaned = url.trim();
  
  if (cleaned.includes("cricket_biometrics_sensor_match_1781548024893.jpg")) {
    return "/images/cricket_biometrics_sensor_match_1781548024893.jpg";
  }
  if (cleaned.includes("pak_us_iran_peace_1781546826718.jpg")) {
    return "/images/pak_us_iran_peace_1781546826718.jpg";
  }
  
  if (cleaned.startsWith("/src/assets/images/")) {
    return cleaned.replace("/src/assets/images/", "/images/");
  }
  if (cleaned.startsWith("src/assets/images/")) {
    return "/" + cleaned.replace("src/assets/images/", "images/");
  }
  if (cleaned.startsWith("/assets/images/")) {
    return cleaned.replace("/assets/images/", "/images/");
  }
  if (cleaned.startsWith("assets/images/")) {
    return "/" + cleaned.replace("assets/images/", "images/");
  }
  return cleaned;
}

