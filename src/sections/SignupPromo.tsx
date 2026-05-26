import { useState, useEffect, useRef } from 'react';
import { X, Gem } from 'lucide-react';
import gsap from 'gsap';

export default function SignupPromo() {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('promoDismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visible && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [visible]);

  const handleDismiss = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setVisible(false);
          sessionStorage.setItem('promoDismissed', 'true');
        },
      });
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={cardRef}
      className="fixed z-50 p-5 rounded-2xl"
      style={{
        bottom: 24,
        left: 88,
        width: 280,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E8F0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 transition-colors"
        style={{ color: '#8A8A9A' }}
      >
        <X size={18} />
      </button>

      {/* Heading */}
      <h3 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>
        Sign Up for Perks
      </h3>

      {/* Description */}
      <p className="text-[13px] mt-2 leading-relaxed" style={{ color: '#4A4A5A' }}>
        New users get free credits to start creating with AI video.
      </p>

      {/* CTA Button */}
      <button
        className="w-full mt-4 py-3 rounded-2xl text-sm font-medium text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: '#7C5CFC' }}
      >
        Sign Up Now
      </button>

      {/* Bonus Badge */}
      <div
        className="flex items-center justify-center gap-1.5 mt-3 py-1.5 px-3 rounded-xl text-xs font-medium mx-auto w-fit"
        style={{ backgroundColor: '#F3EFFF', color: '#7C5CFC' }}
      >
        <Gem size={12} />
        <span>Get 200 credits</span>
      </div>
    </div>
  );
}

