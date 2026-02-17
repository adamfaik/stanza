import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, user } = useApp();
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already logged in from magic link, close modal
  React.useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await login(email);
      
      if (result.success) {
        setStep('sent');
      } else {
        setError(result.error || 'Failed to send magic link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-lg border border-gray-100 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-medium mb-2">Stanza</h2>
          <p className="text-sm text-gray-500">
            {step === 'email' && "Enter your email to sign in."}
            {step === 'sent' && "Check your inbox for the magic link."}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-colors text-gray-900 placeholder-gray-400 font-serif"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-800 p-3 text-sm rounded-md flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : <>Continue <ArrowRight size={16} /></>}
            </button>
          </form>
        )}

        {step === 'sent' && (
          <div className="space-y-6">
            <div className="bg-green-50 text-green-800 p-4 text-sm rounded-md flex items-start gap-3">
              <Mail size={18} className="flex-shrink-0 mt-0.5" /> 
              <div>
                <p className="font-medium mb-1">Magic link sent!</p>
                <p className="text-green-700">
                  We've sent an email to <strong>{email}</strong>. Click the link in the email to sign in.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">
                The link will expire in 15 minutes.
              </p>
              <button 
                onClick={() => {
                  setStep('email');
                  setEmail('');
                  setError(null);
                }}
                className="text-sm text-gray-600 hover:text-black transition-colors underline"
              >
                Use a different email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
