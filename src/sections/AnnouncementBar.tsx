import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import gsap from 'gsap';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 6);
  targetDate.setHours(targetDate.getHours() + 5);
  targetDate.setMinutes(targetDate.getMinutes() + 27);

  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const handleDismiss = () => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        y: -48,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setVisible(false),
      });
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      className="relative w-full h-12 flex items-center justify-center gap-3 px-16"
      style={{ backgroundColor: '#F5E642' }}
    >
      <span className="text-sm font-medium text-dark-text hidden md:inline">
        AI Video 2.0 Price Drop: Universal Reference Mode — 65% OFF! 720P from just $0.07/sec.
      </span>
      <span className="text-sm font-medium text-dark-text md:hidden">
        65% OFF — Limited Time!
      </span>

      <div
        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold text-dark-text font-mono"
        style={{ border: '1px solid rgba(0,0,0,0.2)' }}
      >
        <span>{days}d</span>
        <span>:</span>
        <span>{hours}h</span>
        <span>:</span>
        <span>{minutes}m</span>
        <span>:</span>
        <span>{seconds}s</span>
      </div>

      <button
        className="px-4 py-1.5 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: '#1A1A2E' }}
      >
        Get the Deal
      </button>

      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-60 transition-opacity"
      >
        <X size={18} className="text-dark-text" />
      </button>
    </div>
  );
}
