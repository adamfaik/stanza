import React, { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import { useApp } from '../context/AppContext';
import { formatTimeLeft, formatRelativeTime } from '../utils/time';
import { ArrowLeft, Triangle } from 'lucide-react';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onLoginRequest: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onLoginRequest }) => {
  const { comments, addComment, fetchComments, user, upvotePost, hasVoted } = useApp();
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    fetchComments(post.id).finally(() => setLoadingComments(false));
  }, [post.id]);

  const postComments = comments.filter(c => c.postId === post.id);
  const voted = hasVoted(post.id);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const text = commentText;
    setCommentText('');
    try {
      await addComment(post.id, text);
    } catch {
      setCommentText(text);
    }
  };

  return (
    <div className="animate-fade-in pb-20 max-w-[700px] mx-auto">
      {/* Nav */}
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium font-sans"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main Post */}
      <article>
        <div className="flex items-center gap-3 text-sm text-zinc-400 mb-6 font-sans">
           <span className="font-medium text-zinc-900">{post.authorName}</span>
           <span>•</span>
           <span>{formatTimeLeft(post.expiresAt)}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 leading-[1.15] mb-8 tracking-tight">
          {post.title}
        </h1>

        {post.imageUrl && (
          <div className="mb-10 rounded-sm overflow-hidden bg-gray-50 max-h-[600px]">
            <img src={post.imageUrl} alt="Post attachment" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg prose-zinc font-serif text-zinc-800 leading-relaxed mb-8 whitespace-pre-wrap">
          {post.description}
        </div>

        {/* Minimalist Upvote */}
        <div className="flex items-center gap-6 mt-8">
           <button 
             onClick={() => upvotePost(post.id)}
             className={`flex items-center gap-2 transition-colors group ${
               voted ? 'text-black' : 'text-gray-300 hover:text-black'
             }`}
             title="Upvote this discussion"
           >
             <Triangle 
               size={20} 
               className={`transition-all ${voted ? 'fill-black stroke-black' : 'fill-current'}`} 
             />
             <span className={`font-sans text-lg ${voted ? 'font-semibold' : 'font-medium'}`}>{post.votes}</span>
           </button>
        </div>
      </article>

      {/* The Fold / Divider */}
      <div className="w-full border-t border-gray-200 my-12"></div>

      {/* Discussion Section */}
      <section>
        <h3 className="font-sans font-semibold text-zinc-900 mb-8 text-lg">Discussion</h3>

        {/* Comment Input */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-16 flex flex-col">
               <textarea
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 placeholder="Share your perspective..."
                 className="w-full bg-transparent p-0 font-serif text-lg outline-none resize-none min-h-[100px] placeholder-gray-400 text-zinc-900 leading-relaxed mb-4"
               />
               <div className="flex justify-end">
                 <button 
                   type="submit"
                   disabled={!commentText.trim()}
                   className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors font-sans shadow-sm"
                 >
                   Comment
                 </button>
               </div>
          </form>
        ) : (
          <div 
            onClick={onLoginRequest}
            className="mb-16 p-8 bg-gray-50 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <p className="text-zinc-600 font-serif text-lg">Log in to join the conversation.</p>
          </div>
        )}

        {/* List */}
        <div className="space-y-12">
          {loadingComments ? (
            <div className="text-center py-8">
              <p className="text-gray-300 font-serif italic text-lg">Loading...</p>
            </div>
          ) : postComments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 font-serif italic text-lg">The room is silent.</p>
            </div>
          ) : (
            postComments.map(comment => (
              <div key={comment.id} className="group">
                  <div className="flex items-baseline gap-3 mb-3 font-sans">
                      <span className="font-bold text-sm text-black">{comment.authorName}</span>
                      <span className="text-xs text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-zinc-800 font-serif text-lg leading-relaxed">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};