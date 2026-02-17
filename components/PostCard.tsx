import React from 'react';
import { Post } from '../types';
import { formatTimeLeft } from '../utils/time';
import { useApp } from '../context/AppContext';
import { Triangle, MessageSquare, Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const { upvotePost, hasVoted } = useApp();
  const voted = hasVoted(post.id);

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    upvotePost(post.id);
  };

  const timeLeft = formatTimeLeft(post.expiresAt);
  // Highlight if less than 3 hours left
  const isUrgent = timeLeft.includes('m left') || (timeLeft.includes('h left') && parseInt(timeLeft) < 3);

  return (
    <article 
      onClick={onClick}
      className="group relative border-b border-gray-100 py-8 px-4 sm:px-0 cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          {/* Meta header - Sans Serif for Data */}
          <div className="flex items-center gap-3 text-xs font-medium font-sans text-gray-400 uppercase tracking-wider">
            <span>{post.authorName}</span>
            <span>•</span>
            <span className={`flex items-center gap-1 transition-colors ${isUrgent ? 'text-orange-700 font-bold' : ''}`}>
              <Clock size={12} />
              {timeLeft}
            </span>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-serif font-medium text-zinc-900 leading-tight group-hover:text-zinc-700 transition-colors">
            {post.title}
          </h2>
          {/* Excerpt - Serif for Story, lighter grey, looser leading for texture */}
          <p className="text-gray-600 font-serif leading-loose line-clamp-3 text-sm sm:text-base">
            {post.description}
          </p>
        </div>

        {/* Thumbnail if exists */}
        {post.imageUrl && (
          <div className="hidden sm:block w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
            <img src={post.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-6">
        <button 
          onClick={handleVote}
          className={`flex items-center gap-1.5 text-sm transition-all duration-200 font-sans ${voted ? 'text-zinc-900 font-semibold' : 'text-gray-400 hover:text-zinc-900'}`}
        >
          <Triangle 
            size={16} 
            className={`transition-all ${voted ? 'fill-black stroke-black' : 'fill-current'}`} 
          />
          {post.votes}
        </button>
        
        <div className="flex items-center gap-1.5 text-sm text-gray-400 font-sans">
          <MessageSquare size={16} />
          {post.commentCount}
        </div>
      </div>
    </article>
  );
};