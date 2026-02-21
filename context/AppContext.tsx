import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Comment } from '../types';
import { supabase } from '../lib/supabase-client';

interface AppContextType {
  user: User | null;
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  showUsernameModal: boolean;
  login: (email: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  createPost: (title: string, description: string, imageFile: File | null) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<Comment>;
  upvotePost: (postId: string) => Promise<void>;
  hasVoted: (postId: string) => boolean;
  fetchPosts: () => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  onUsernameSubmit: (username: string) => Promise<void>;
  onUsernameCancel: () => Promise<void>;
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [pendingAuthToken, setPendingAuthToken] = useState<string | null>(null);

  // Listen to Supabase auth state changes
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthStateChange(session.access_token);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await handleAuthStateChange(session.access_token);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

  // Handle auth state changes and sync user profile
  const handleAuthStateChange = async (token: string) => {
    setAccessToken(token);
    
    // Check if user needs to set username (first time sign in)
    const needsUsername = localStorage.getItem('needs_username') === 'true';

    if (needsUsername) {
      // Show username modal instead of native prompt
      setPendingAuthToken(token);
      setShowUsernameModal(true);
      setLoading(false);
      localStorage.removeItem('needs_username');
      return;
    }

    try {
      // Sync user profile with our custom users table
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: null }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        const error = await response.json();
        if (error.error === 'Username is required for new users') {
          // New user needs to set username
          setPendingAuthToken(token);
          setShowUsernameModal(true);
        }
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle username submission from modal
  const handleUsernameSubmit = async (username: string) => {
    if (!pendingAuthToken) {
      throw new Error('No auth token available');
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pendingAuthToken}`,
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setAccessToken(pendingAuthToken);
        setShowUsernameModal(false);
        setPendingAuthToken(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to set username');
      }
    } catch (error) {
      console.error('Error setting username:', error);
      throw error;
    }
  };

  // Handle username modal cancel
  const handleUsernameCancel = async () => {
    await supabase.auth.signOut();
    setShowUsernameModal(false);
    setPendingAuthToken(null);
    setAccessToken(null);
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/posts`);

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Send magic link using Supabase Auth
  const login = async (email: string, username?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // If username is provided, store it for later use
      if (username) {
        localStorage.setItem('pending_username', username);
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Error sending magic link:', error);
        return { success: false, error: error.message || 'Failed to send magic link' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending magic link:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const createPost = async (title: string, description: string, imageFile: File | null) => {
    if (!user || !accessToken) return;

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE}/api/posts/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        const fetched: Comment[] = data.comments || [];
        setComments(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const incoming = fetched.filter(c => !existingIds.has(c.id));
          return [...prev, ...incoming];
        });
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async (postId: string, content: string): Promise<Comment> => {
    if (!user || !accessToken) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE}/api/comments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ postId, content }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data.comment]);
        
        // Update comment count on post
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
        ));
        return data.comment;
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
      showUsernameModal,
      login, 
      logout, 
      createPost, 
      addComment, 
      upvotePost,
      hasVoted,
      fetchPosts,
      fetchComments,
      onUsernameSubmit: handleUsernameSubmit,
      onUsernameCancel: handleUsernameCancel
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
