import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Unified AI Space Now Live',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Tools Tab is Live: Light Studio is Ready',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Creator Partnership Program',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
  },
  {
    id: 4,
    title: '$1000 Relighting Challenge',
    image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&h=400&fit=crop',
  },
];

export default function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(goNext, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, goNext]);

  return (
    <section
      className="max-w-[800px] mx-auto px-4 md:px-0 mt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        {/* Slides Track */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-400 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="w-full shrink-0 relative"
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-2xl">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7) 100%)' }}
                  />
                  {/* Logo mark */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-white">AI Video</span>
                  </div>
                  {/* Title */}
                  <h3 className="absolute bottom-4 left-4 right-4 text-white font-semibold text-lg leading-snug">
                    {slide.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:shadow-md"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #E8E8F0' }}
        >
          <ChevronLeft size={18} style={{ color: '#4A4A5A' }} />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:shadow-md"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #E8E8F0' }}
        >
          <ChevronRight size={18} style={{ color: '#4A4A5A' }} />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              backgroundColor: index === activeIndex ? '#1A1A2E' : '#D1D1D6',
            }}
          />
        ))}
      </div>
    </section>
  );
}
