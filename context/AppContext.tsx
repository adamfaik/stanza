import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Comment } from '../types';
import { MOCK_POSTS } from '../constants';

interface AppContextType {
  user: User | null;
  posts: Post[];
  comments: Comment[];
  login: (email: string, username: string) => void;
  logout: () => void;
  createPost: (title: string, description: string, imageFile: File | null) => void;
  addComment: (postId: string, content: string) => void;
  upvotePost: (postId: string) => void;
  hasVoted: (postId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate a random ID for the browser "fingerprint"
const DEVICE_ID_KEY = 'stanza_device_id';
const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [deviceId] = useState(getDeviceId());

  // Check for expired posts every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPosts(currentPosts => currentPosts.filter(p => p.expiresAt > now));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Restore votes from local storage
  useEffect(() => {
    const storedVotes = localStorage.getItem(`votes_${deviceId}`);
    if (storedVotes) {
      setUserVotes(new Set(JSON.parse(storedVotes)));
    }
  }, [deviceId]);

  const login = (email: string, username: string) => {
    // Simulating Magic Link flow success
    const newUser: User = {
      id: Math.random().toString(36).substring(2),
      email,
      username
    };
    setUser(newUser);
  };

  const logout = () => setUser(null);

  const createPost = (title: string, description: string, imageFile: File | null) => {
    if (!user) return; // Should be guarded by UI

    const processPost = (imageUrl?: string) => {
        const now = Date.now();
        const newPost: Post = {
          id: Math.random().toString(36).substring(2),
          title,
          description,
          imageUrl,
          authorId: user.id,
          authorName: user.username,
          createdAt: now,
          expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
          votes: 0,
          commentCount: 0
        };
        setPosts(prev => [newPost, ...prev]);
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
            processPost(reader.result as string);
        };
        reader.readAsDataURL(imageFile);
    } else {
        processPost();
    }
  };

  const addComment = (postId: string, content: string) => {
    if (!user) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2),
      postId,
      authorId: user.id,
      authorName: user.username,
      content,
      createdAt: Date.now()
    };
    setComments(prev => [...prev, newComment]);
    
    // Update comment count on post
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
    ));
  };

  const upvotePost = (postId: string) => {
    if (userVotes.has(postId)) return;

    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, votes: p.votes + 1 } : p
    ));

    const newVotes = new Set(userVotes);
    newVotes.add(postId);
    setUserVotes(newVotes);
    localStorage.setItem(`votes_${deviceId}`, JSON.stringify(Array.from(newVotes)));
  };

  const hasVoted = (postId: string) => userVotes.has(postId);

  return (
    <AppContext.Provider value={{ 
      user, 
      posts, 
      comments, 
      login, 
      logout, 
      createPost, 
      addComment, 
      upvotePost,
      hasVoted 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
