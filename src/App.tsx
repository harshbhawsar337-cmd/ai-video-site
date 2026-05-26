import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import AnnouncementBar from '@/sections/AnnouncementBar';
import Header from '@/sections/Header';
import LeftSidebar from '@/sections/LeftSidebar';
import HeroSection from '@/sections/HeroSection';
import FeatureCarousel from '@/sections/FeatureCarousel';
import MasonryGallery from '@/sections/MasonryGallery';
import SignupPromo from '@/sections/SignupPromo';

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from('.announcement-bar', {
        y: -48,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
        .from(
          '.main-header',
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          0.1
        )
        .from(
          '.left-sidebar',
          {
            x: -72,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          0.2
        )
        .from(
          '.hero-section',
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.3
        )
        .from(
          '.feature-carousel',
          {
            opacity: 0,
            x: 50,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.5
        )
        .from(
          '.masonry-gallery',
          {
            opacity: 0,
            y: 30,
            duration: 0.4,
            ease: 'power2.out',
          },
          0.7
        );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }}>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <AnnouncementBar />
      </div>

      {/* Header */}
      <div className="main-header">
        <Header />
      </div>

      {/* Left Sidebar */}
      <div className="left-sidebar">
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <main className="md:ml-[72px] pb-16">
        {/* Hero / Prompt Area */}
        <div className="hero-section">
          <HeroSection />
        </div>

        {/* Feature Carousel */}
        <div className="feature-carousel">
          <FeatureCarousel />
        </div>

        {/* Category Tabs + Masonry Gallery */}
        <div className="masonry-gallery">
          <MasonryGallery />
        </div>
      </main>

      {/* Floating Sign-up Promo */}
      <SignupPromo />
    </div>
  );
}

export default App;
