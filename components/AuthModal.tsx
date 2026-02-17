import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, ArrowRight, Check } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login } = useApp();
  const [step, setStep] = useState<'email' | 'verify' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 1000);
  };

  const handleVerify = () => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          setStep('username');
      }, 800);
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    login(email, username);
    onClose();
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
                {step === 'verify' && "Check your inbox for the magic link."}
                {step === 'username' && "Choose how you appear to others."}
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
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                    {loading ? "Sending..." : <>Continue <ArrowRight size={16} /></>}
                </button>
            </form>
        )}

        {step === 'verify' && (
             <div className="space-y-6">
                 <div className="bg-green-50 text-green-800 p-3 text-sm rounded-md flex items-center gap-2">
                    <Mail size={16} /> Link sent to {email}
                 </div>
                 <button 
                    onClick={handleVerify} // In real app, this happens via email click
                    disabled={loading}
                    className="w-full border border-black text-black py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    {loading ? "Verifying..." : "Simulate 'Click Link'"}
                </button>
             </div>
        )}

        {step === 'username' && (
             <form onSubmit={handleFinalize} className="space-y-6">
                <div>
                    <input 
                        type="text" 
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Display Name"
                        className="w-full bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-colors text-gray-900 placeholder-gray-400 font-serif"
                        autoFocus
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-black text-white py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                    Finish Setup <Check size={16} />
                </button>
            </form>
        )}

      </div>
    </div>
  );
};