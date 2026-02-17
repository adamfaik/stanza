export interface User {
  id: string;
  username: string; // "Display Name"
  email: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface Post {
  id: string;
  title: string;
  description: string; // Rich text (simplified to string for this demo)
  imageUrl?: string;
  authorId: string;
  authorName: string; // Storing denormalized for simplicity
  createdAt: number; // Timestamp
  expiresAt: number; // Timestamp
  votes: number;
  commentCount: number;
}

export enum SortOption {
  TOP = 'TOP',
  UNDISCOVERED = 'UNDISCOVERED',
  JUST_ADDED = 'JUST_ADDED',
  LAST_CALL = 'LAST_CALL',
}