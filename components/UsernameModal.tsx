import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface UsernameModalProps {
  onSubmit: (username: string) => Promise<void>;
  onCancel: () => Promise<void>;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ onSubmit, onCancel }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUsername = (value: string): string | null => {
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (value.length > 50) {
      return 'Username must be less than 50 characters';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    if (/^[_-]|[_-]$/.test(value)) {
      return 'Username cannot start or end with special characters';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(username);
    } catch (err: any) {
      setError(err.message || 'Failed to set username. Please try again.');
      setLoading(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-lg border border-gray-100 p-8 relative">
        <button 
          onClick={onCancel} 
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
          disabled={loading}
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-medium mb-2">Welcome to Stanza</h2>
          <p className="text-sm text-gray-500">
            Choose a username to complete your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs text-gray-600 font-medium block mb-2">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => handleUsernameChange(e.target.value)}
              placeholder="your_username"
              className="w-full bg-transparent border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-gray-400 transition-colors text-gray-900 placeholder-gray-400 font-sans"
              autoFocus
              disabled={loading}
              maxLength={50}
            />
            <p className="text-xs text-gray-400 mt-2">
              3-50 characters, letters, numbers, _ and - only
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-800 p-3 text-sm rounded-md flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" /> 
              <span>{error}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || username.length < 3}
            className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Setting up your account..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};
