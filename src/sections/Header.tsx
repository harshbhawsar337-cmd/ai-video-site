import { useState } from 'react';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { ExternalLink, X } from 'lucide-react';

export default function Header() {
  const scrolled = useScrollHeader(50);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [activeNav, setActiveNav] = useState('Home');
  const [activeCreate, setActiveCreate] = useState('Image');

  const navItems = [
    { label: 'Home' },
    { label: 'Assets' },
    { label: 'Tools', badge: 'Beta' },
    { label: 'Hub', external: true },
  ];

  const createItems = [
    { label: 'Video' },
    { label: 'Image' },
    { label: 'Audio', external: true },
  ];

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      alert('Email aur Password dono bharo!');
      return;
    }
    const name = loginForm.email.split('@')[0];
    setUserName(name);
    setLoggedIn(true);
    setShowLoginModal(false);
    setLoginForm({ email: '', password: '' });
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName('');
  };

  return (
    <>
      <header
        className="sticky top-0 z-10 h-16 flex items-center justify-between px-6 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(250, 250, 247, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #E8E8F0' : '1px solid transparent',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-dark-text tracking-tight">AI Video</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className="relative px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-purple-light"
              style={{ color: activeNav === item.label ? '#7C5CFC' : '#4A4A5A' }}
            >
              <span className="flex items-center gap-1">
                {item.label}
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white" style={{ backgroundColor: '#7C5CFC' }}>
                    {item.badge}
                  </span>
                )}
                {item.external && <ExternalLink size={12} />}
              </span>
            </button>
          ))}
        </nav>

        <nav className="hidden lg:flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: '#F5F5F0' }}>
          {createItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveCreate(item.label)}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-1"
              style={{
                backgroundColor: activeCreate === item.label ? '#7C5CFC' : 'transparent',
                color: activeCreate === item.label ? '#FFFFFF' : '#4A4A5A',
              }}
            >
              {item.label}
              {item.external && <ExternalLink size={12} />}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex flex-col items-center leading-none">
            <span className="text-[11px] font-medium" style={{ color: '#7C5CFC' }}>From</span>
            <span className="text-sm font-medium" style={{ color: '#7C5CFC' }}>$9.99/mo</span>
          </button>

          {loggedIn ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#7C5CFC' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-red-50"
                style={{ border: '1px solid #E8E8F0', color: '#EF4444' }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:bg-purple-light"
              style={{ border: '1px solid #E8E8F0', color: '#1A1A2E' }}
            >
              Log In
            </button>
          )}
        </div>
      </header>

      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
        >
          <div className="relative rounded-2xl p-8 w-full max-w-sm mx-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E8F0', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: '#8A8A9A' }}
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold" style={{ color: '#1A1A2E' }}>Welcome back</h2>
              <p className="text-sm mt-1" style={{ color: '#8A8A9A' }}>AI Video mein login karo</p>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: '#4A4A5A' }}>Email</label>
                <input
                  type="email"
                  placeholder="aapka@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid #E8E8F0', color: '#1A1A2E' }}
                  onFocus={(e) => e.target.style.borderColor = '#7C5CFC'}
                  onBlur={(e) => e.target.style.borderColor = '#E8E8F0'}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: '#4A4A5A' }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid #E8E8F0', color: '#1A1A2E' }}
                  onFocus={(e) => e.target.style.borderColor = '#7C5CFC'}
                  onBlur={(e) => e.target.style.borderColor = '#E8E8F0'}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] mt-1"
                style={{ backgroundColor: '#7C5CFC' }}
              >
                Log In
              </button>

              <p className="text-center text-xs" style={{ color: '#8A8A9A' }}>
                Account nahi hai?{' '}
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="font-medium hover:underline"
                  style={{ color: '#7C5CFC' }}
                >
                  Sign Up karo
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
