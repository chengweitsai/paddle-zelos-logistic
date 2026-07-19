import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from '../firebase';
import { LogIn, LogOut, Shield, User as UserIcon } from 'lucide-react';

interface AuthButtonProps {
  onAuthChange: (user: User | null, token: string | null) => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ onAuthChange }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Listen to Firebase Auth state on mount
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        onAuthChange(currentUser, token);
      },
      () => {
        setUser(null);
        onAuthChange(null, null);
      }
    );
    return () => unsubscribe();
  }, [onAuthChange]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        onAuthChange(result.user, result.accessToken);
      }
    } catch (err) {
      console.error('Google Sign In Error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      onAuthChange(null, null);
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };

  if (user) {
    return (
      <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl w-full">
        <div className="flex items-center gap-2.5">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-10 h-10 rounded-full border border-slate-200"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <UserIcon size={20} />
            </div>
          )}
          <div className="text-left">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Shield size={12} className="text-[#06C755]" /> 
              系統連線中
            </div>
            <div className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[150px]">
              {user.displayName || '隊員'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          id="btn-logout"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-500 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <LogOut size={13} />
          登出
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      id="btn-login-google"
      disabled={isLoggingIn}
      className="gsi-material-button w-full flex items-center justify-center cursor-pointer transition-all active:scale-[0.98]"
      style={{
        backgroundColor: '#white',
        border: '1px solid #dadce0',
        borderRadius: '16px',
        boxSizing: 'border-box',
        color: '#3c4043',
        fontFamily: '"Google Sans",arial,sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        height: '46px',
        letterSpacing: '0.25px',
        padding: '0 12px',
        position: 'relative',
        textAlign: 'center',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
        width: '100%',
        boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)'
      }}
    >
      <div className="gsi-material-button-content-wrapper flex items-center justify-center gap-3">
        <div className="gsi-material-button-icon flex items-center">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '20px', height: '20px' }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span className="gsi-material-button-contents text-sm font-semibold text-slate-700">
          {isLoggingIn ? '連結 Google 帳戶中...' : '連結 Google 查詢個人試算表'}
        </span>
      </div>
    </button>
  );
};
