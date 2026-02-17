import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Comment } from '../types';

interface AppContextType {
  user: User | null;
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  login: (email: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  createPost: (title: string, description: string, imageFile: File | null) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  upvotePost: (postId: string) => Promise<void>;
  hasVoted: (postId: string) => boolean;
  fetchPosts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE = '';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [deviceId] = useState(getDeviceId());
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Check for magic link token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      handleMagicLinkVerification(token);
    }
  }, []);

  // Fetch posts on mount and periodically
  useEffect(() => {
    fetchPosts();
    
    // Refresh posts every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Restore votes from local storage
  useEffect(() => {
    const storedVotes = localStorage.getItem(`votes_${deviceId}`);
    if (storedVotes) {
      setUserVotes(new Set(JSON.parse(storedVotes)));
    }
  }, [deviceId]);

  // Check existing session
  const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle magic link verification
  const handleMagicLinkVerification = async (token: string) => {
    try {
      // Check if username is needed (new user)
      const username = prompt('Please enter your username:');
      
      if (!username) {
        alert('Username is required');
        return;
      }

      const response = await fetch(`${API_BASE}/api/auth/verify-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, username }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        alert(data.error || 'Failed to verify magic link');
      }
    } catch (error) {
      console.error('Error verifying magic link:', error);
      alert('Failed to verify magic link');
    }
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/posts`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Send magic link
  const login = async (email: string, username?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/send-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to send magic link' };
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const createPost = async (title: string, description: string, imageFile: File | null) => {
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE}/api/posts/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prev => [data.post, ...prev]);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE}/api/comments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId, content }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data.comment]);
        
        // Update comment count on post
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
        ));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create comment');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  };

  const upvotePost = async (postId: string) => {
    if (userVotes.has(postId)) return;

    try {
      const response = await fetch(`${API_BASE}/api/votes/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId, deviceId }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, votes: data.votes } : p
        ));

        const newVotes = new Set(userVotes);
        newVotes.add(postId);
        setUserVotes(newVotes);
        localStorage.setItem(`votes_${deviceId}`, JSON.stringify(Array.from(newVotes)));
      } else {
        const error = await response.json();
        console.error('Failed to upvote:', error.error);
      }
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const hasVoted = (postId: string) => userVotes.has(postId);

  return (
    <AppContext.Provider value={{ 
      user, 
      posts, 
      comments, 
      loading,
      login, 
      logout, 
      createPost, 
      addComment, 
      upvotePost,
      hasVoted,
      fetchPosts
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
