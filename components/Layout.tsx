import React from 'react';
import { useApp } from '../context/AppContext';
import { User, LogOut, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onOpenAuth: () => void;
  onOpenCreate: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onOpenAuth, onOpenCreate }) => {
  const { user, logout } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center bg-white selection:bg-zinc-100 selection:text-zinc-900">
      {/* Header */}
      <header className="w-full max-w-2xl px-4 py-8 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-30">
        <h1 
            className="text-2xl font-serif font-bold italic tracking-tight cursor-pointer"
            onClick={() => window.location.hash = ''}
        >
            Stanza.
        </h1>

        <div className="flex items-center gap-4">
          {user ? (
            <>
               <button 
                onClick={onOpenCreate}
                className="hidden sm:flex items-center gap-2 text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors shadow-sm font-sans"
               >
                 <Plus size={16} /> New Post
               </button>
               
               {/* Profile Avatar Only - Simplified */}
               <div className="group relative">
                  <button className="focus:outline-none block">
                    <div className="w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500 border border-zinc-200 hover:border-zinc-400 transition-all">
                        <span className="font-sans text-xs font-medium">{user.username[0].toUpperCase()}</span>
                    </div>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden hidden group-hover:block py-1 z-50">
                     <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-xs font-medium text-gray-900 truncate font-sans">{user.username}</p>
                     </div>
                     <button onClick={logout} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 flex items-center gap-2 transition-colors font-sans">
                        <LogOut size={12} /> Log Out
                     </button>
                  </div>
               </div>
            </>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors font-sans"
            >
              Log in
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl px-4 flex-1 pb-24">
        {children}
      </main>

      {/* Mobile Floating Action Button */}
      {user && (
         <button 
            onClick={onOpenCreate}
            className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center z-40 hover:scale-105 transition-transform"
         >
             <Plus size={24} />
         </button>
      )}
    </div>
  );
};