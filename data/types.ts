export type ContentType = 'music' | 'story' | 'film' | 'collection' | 'archive';
export type ContentLanguage = 'en' | 'fr' | 'es';
export type UserRole = 'viewer' | 'creator' | 'moderator' | 'admin';
export type UserIntent = 'explore' | 'create' | 'contribute';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  duration: string;
  creator: string;
  releaseDate: string;
  language: ContentLanguage[];
  mediaSource: string;
  audioSrc?: string;
  tags: string[];
  featured?: boolean;
  institutional?: boolean;
  new?: boolean;
  trending?: boolean;
}

export interface UserProgress {
  contentId: string;
  contentType: ContentType;
  startedAt: string;
  lastAccessedAt: string;
  progressPercentage: number;
  currentChapterId?: string;
  currentChapterIndex?: number;
  totalChapters?: number;
  playbackPosition?: number;
  completed: boolean;
  completedAt?: string;
}

export interface UserBookmark {
  contentId: string;
  contentType: ContentType;
  savedAt: string;
  notes?: string;
}
