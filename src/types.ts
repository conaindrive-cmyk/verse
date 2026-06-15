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
