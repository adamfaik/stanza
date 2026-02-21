import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Image as ImageIcon, X } from 'lucide-react';

interface CreatePostProps {
  onClose: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onClose }) => {
  const { createPost } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    createPost(title, description, image);
    onClose();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  // Auto-resize title textarea
  const adjustTitleHeight = () => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [description]);

  useEffect(() => {
    adjustTitleHeight();
  }, [title]);

  return (
    <div className="fixed inset-0 z-50 bg-paper overflow-y-auto animate-fade-in">
      <div className="max-w-[700px] mx-auto min-h-screen flex flex-col p-6 md:p-12">
        
        {/* Header / Nav */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-paper/95 backdrop-blur-sm py-4 z-20">
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-black transition-colors font-serif text-lg"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-4">
            <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`transition-colors ${image ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                title="Add cover image"
            >
                <ImageIcon size={24} strokeWidth={1.5} />
            </button>

            <button 
                onClick={handleSubmit}
                disabled={!title || !description}
                className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed font-sans tracking-wide shadow-sm"
            >
                Publish
            </button>
          </div>
        </div>

        {/* Writing Area */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8 pb-20 text-left">
          
          <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageSelect}
          />

          {image && (
                <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden group shadow-sm">
                    <img 
                        src={URL.createObjectURL(image)} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                    />
                    <button 
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute top-4 right-4 bg-white text-black rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

          {/* Title Section */}
          <div className="relative group">
            <textarea 
              ref={titleTextareaRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a title..."
              className="w-full bg-transparent text-5xl md:text-6xl font-serif font-bold outline-none resize-none placeholder-gray-400 text-zinc-900 transition-colors tracking-tight overflow-hidden"
              autoFocus
              rows={1}
            />
          </div>

          {/* Body Section */}
          <div className="relative flex-1">
            <textarea 
              ref={textareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Start writing..."
              className="w-full bg-transparent font-serif text-xl leading-relaxed outline-none resize-none placeholder-gray-400 text-zinc-800 min-h-[50vh]"
            />
          </div>
        </form>
      </div>
    </div>
  );
};