import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { PostCard } from './components/PostCard';
import { PostDetail } from './components/PostDetail';
import { CreatePost } from './components/CreatePost';
import { AuthModal } from './components/AuthModal';
import { Post, SortOption } from './types';
import { ChevronDown } from 'lucide-react';

const StanzaApp: React.FC = () => {
  const { posts } = useApp();
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const { user } = useApp();

  // Sorting state
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.TOP);
  const [isSortOpen, setSortOpen] = useState(false);

  const handleCreateRequest = () => {
    if (!user) {
        setAuthOpen(true);
    } else {
        setCreateOpen(true);
    }
  };

  const getSortedPosts = () => {
    const sorted = [...posts];
    switch (sortBy) {
      case SortOption.TOP:
        return sorted.sort((a, b) => b.votes - a.votes);
      case SortOption.UNDISCOVERED:
        return sorted.sort((a, b) => a.votes - b.votes);
      case SortOption.JUST_ADDED:
        // Newest first (created most recently)
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case SortOption.LAST_CALL:
        // Expiring soonest first (smallest expiresAt timestamp)
        return sorted.sort((a, b) => a.expiresAt - b.expiresAt);
      default:
        return sorted;
    }
  };

  const sortedPosts = getSortedPosts();

  const sortOptions = [
    { value: SortOption.TOP, label: 'Top' },
    { value: SortOption.UNDISCOVERED, label: 'Undiscovered' },
    { value: SortOption.JUST_ADDED, label: 'Just Added' },
    { value: SortOption.LAST_CALL, label: 'Last Call' },
  ];

  return (
    <Layout 
      onOpenAuth={() => setAuthOpen(true)}
      onOpenCreate={handleCreateRequest}
    >
      {activePost ? (
        <PostDetail 
          post={activePost} 
          onBack={() => setActivePost(null)}
          onLoginRequest={() => setAuthOpen(true)}
        />
      ) : (
        <div className="space-y-2">
            <div className="py-4 border-b border-gray-100 mb-4 flex justify-end items-center relative z-20">
                <span className="text-xs text-zinc-400 font-sans mr-2">Sorted by</span>
                <div className="relative">
                    <button 
                        onClick={() => setSortOpen(!isSortOpen)}
                        className="flex items-center gap-1 text-xs font-medium font-sans text-zinc-900 hover:text-zinc-600 transition-colors uppercase tracking-wide"
                    >
                        {sortOptions.find(o => o.value === sortBy)?.label}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isSortOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden z-20 py-1">
                                {sortOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortBy(option.value);
                                            setSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs font-sans hover:bg-gray-50 transition-colors ${sortBy === option.value ? 'font-bold text-black' : 'text-gray-600'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {sortedPosts.length > 0 ? (
                sortedPosts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onClick={() => setActivePost(post)} 
                    />
                ))
            ) : (
                <div className="py-20 text-center text-gray-400 font-serif">
                    <p>Silence in the library.</p>
                    <p className="text-sm mt-2">Be the first to start a conversation.</p>
                </div>
            )}
        </div>
      )}

      {isAuthOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {isCreateOpen && <CreatePost onClose={() => setCreateOpen(false)} />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <StanzaApp />
    </AppProvider>
  );
};

export default App;