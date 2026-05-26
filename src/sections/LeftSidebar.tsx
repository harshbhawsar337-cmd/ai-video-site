import { useState } from 'react';
import {
  Home,
  FolderOpen,
  Wrench,
  Globe,
  Video,
  Image,
  Headphones,
  MoreHorizontal,
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { icon: <Home size={22} />, label: 'Home' },
  { icon: <FolderOpen size={22} />, label: 'Assets' },
  { icon: <Wrench size={22} />, label: 'Tools', badge: 'Beta', badgeColor: '#7C5CFC' },
  { icon: <Globe size={22} />, label: 'Hub' },
  { icon: <Video size={22} />, label: 'Video', badge: 'SD2', badgeColor: '#F3EFFF' },
  { icon: <Image size={22} />, label: 'Image', badge: 'Image2', badgeColor: '#F5E642' },
  { icon: <Headphones size={22} />, label: 'Audio' },
];

export default function LeftSidebar() {
  const [activeItem, setActiveItem] = useState('Home');

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-20 flex flex-col items-center pt-20 pb-4 hidden md:flex"
      style={{
        width: 72,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E8E8F0',
      }}
    >
      {/* Nav Items */}
      <nav className="flex flex-col items-center gap-1 w-full flex-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className="relative flex flex-col items-center justify-center w-full py-3 transition-colors rounded-xl"
              style={{
                borderLeft: isActive ? '3px solid #7C5CFC' : '3px solid transparent',
                color: isActive ? '#7C5CFC' : '#8A8A9A',
                backgroundColor: isActive ? '#F3EFFF' : 'transparent',
              }}
            >
              {item.badge && (
                <span
                  className="absolute top-1 right-2 px-1 py-0 rounded text-[8px] font-bold"
                  style={{
                    backgroundColor: item.badgeColor,
                    color: item.badgeColor === '#F5E642' ? '#1A1A2E' : item.badgeColor === '#F3EFFF' ? '#7C5CFC' : '#FFFFFF',
                  }}
                >
                  {item.badge}
                </span>
              )}
              {item.icon}
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-2 w-full px-2">
        <div className="text-center">
          <span className="text-[9px]" style={{ color: '#8A8A9A' }}>From</span>
          <div className="text-[11px] font-semibold" style={{ color: '#7C5CFC' }}>$9.99/mo</div>
        </div>
        <button className="text-xs font-medium px-3 py-1.5 rounded-full w-full" style={{ border: '1px solid #E8E8F0' }}>
          Log In
        </button>
        <span className="text-[10px]" style={{ color: '#8A8A9A' }}>API</span>
        <button style={{ color: '#8A8A9A' }}>
          <MoreHorizontal size={18} />
        </button>
      </div>
    </aside>
  );
}
