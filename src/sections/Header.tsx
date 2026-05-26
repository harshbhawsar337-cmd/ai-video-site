import { useScrollHeader } from '@/hooks/useScrollHeader';
import { ExternalLink } from 'lucide-react';

export default function Header() {
  const scrolled = useScrollHeader(50);

  const navItems = [
    { label: 'Home', active: true },
    { label: 'Assets', active: false },
    { label: 'Tools', active: false, badge: 'Beta' },
    { label: 'Hub', active: false, external: true },
  ];

  const createItems = [
    { label: 'Video', active: true },
    { label: 'Image', active: false },
    { label: 'Audio', active: false, external: true },
  ];

  return (
    <header
      className="sticky top-0 z-10 h-16 flex items-center justify-between px-6 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(250, 250, 247, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E8E8F0' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-dark-text tracking-tight">AI Video</span>
      </div>

      {/* Main Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="relative px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ color: item.active ? '#7C5CFC' : '#4A4A5A' }}
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

      {/* Create Navigation */}
      <nav className="hidden lg:flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: '#F5F5F0' }}>
        {createItems.map((item) => (
          <button
            key={item.label}
            className="px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-1"
            style={{
              backgroundColor: item.active ? '#7C5CFC' : 'transparent',
              color: item.active ? '#FFFFFF' : '#4A4A5A',
            }}
          >
            {item.label}
            {item.external && <ExternalLink size={12} />}
          </button>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button className="hidden sm:flex flex-col items-center leading-none">
          <span className="text-[11px] font-medium" style={{ color: '#7C5CFC' }}>From</span>
          <span className="text-sm font-medium" style={{ color: '#7C5CFC' }}>$9.99/mo</span>
        </button>
        <button
          className="px-5 py-2 rounded-full text-sm font-medium transition-colors"
          style={{ border: '1px solid #E8E8F0', color: '#1A1A2E' }}
        >
          Log In
        </button>
      </div>
    </header>
  );
}
