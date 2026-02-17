import { Post } from './types';

// Helper to create dates relative to now
const now = Date.now();
const hour = 60 * 60 * 1000;

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Unbearable Lightness of Being: Is Sabina the true hero?',
    description: "I've always struggled with Tomas, but on this third re-read, I'm finding Sabina's rejection of kitsch to be the moral center of the novel. Does anyone else feel like her betrayal is actually an act of supreme loyalty to herself?",
    authorId: 'user_1',
    authorName: 'Elena R.',
    createdAt: now - (5 * hour),
    expiresAt: now - (5 * hour) + (24 * hour),
    votes: 42,
    commentCount: 5
  },
  {
    id: '2',
    title: 'Just finished "The Road" and I need to talk about the ending.',
    description: "The ambiguity of the boy's future is haunting me. Is the 'fire' real, or just a metaphor we tell ourselves to survive? That final paragraph about the trout feels like a eulogy for the world.",
    authorId: 'user_2',
    authorName: 'Marcus',
    createdAt: now - (20 * hour), // Almost expired
    expiresAt: now - (20 * hour) + (24 * hour),
    votes: 128,
    commentCount: 23
  },
  {
    id: '3',
    title: 'Why do we hate "The Catcher in the Rye" as adults?',
    description: "Holden used to be my icon. Now he just seems exhausting. Is this growth, or have I just become one of the phonies?",
    authorId: 'user_3',
    authorName: 'SalingerFan88',
    createdAt: now - (1 * hour),
    expiresAt: now - (1 * hour) + (24 * hour),
    votes: 15,
    commentCount: 2
  }
];
