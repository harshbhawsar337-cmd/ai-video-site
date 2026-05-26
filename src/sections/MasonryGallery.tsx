import { useState, useRef, useEffect } from 'react';
import { Heart, Flame } from 'lucide-react';
import Masonry from 'react-masonry-css';
import { categories, galleryCards, type Category } from '@/data/galleryData';
import gsap from 'gsap';

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2,
};

function GalleryCard({
  image,
  likes,
  hasHot,
  duration,
  title,
}: {
  image: string;
  likes: number;
  hasHot: boolean;
  duration?: string;
  title: string;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const formatLikes = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  };

  return (
    <div className="relative rounded-xl overflow-hidden cursor-pointer group mb-4" style={{ breakInside: 'avoid' }}>
      {/* Image */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-auto object-cover transition-transform duration-400 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none rounded-b-xl"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 100%)' }}
      />

      {/* HOT badge */}
      {hasHot && (
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ backgroundColor: '#EF4444' }}
        >
          <Flame size={12} className="text-white" />
          <span className="text-[10px] font-semibold text-white">HOT</span>
        </div>
      )}

      {/* Duration badge */}
      {duration && (
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[11px] font-medium text-white"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          {duration}
        </div>
      )}

      {/* Creator watermark */}
      <div className="absolute bottom-3 left-3 text-[10px] font-medium tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
        AI Video
      </div>

      {/* Like button + count */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        <span className="text-xs font-medium text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          {formatLikes(likeCount)}
        </span>
        <button
          onClick={handleLike}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${liked ? 'animate-like-bounce' : ''}`}
          style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
        >
          <Heart
            size={14}
            className={liked ? 'text-red-500 fill-red-500' : 'text-[#4A4A5A]'}
          />
        </button>
      </div>

      {/* Hover lift effect */}
      <div className="absolute inset-0 rounded-xl transition-all duration-300 group-hover:shadow-card-hover-darker pointer-events-none" />
    </div>
  );
}

export default function MasonryGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>('Recommended');
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const filteredCards = activeCategory === 'Recommended'
    ? galleryCards
    : galleryCards.filter((card) => card.categories.includes(activeCategory));

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.gallery-card-wrapper');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, [activeCategory]);

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-6 mt-8">
      {/* Category Tabs */}
      <div className="relative overflow-x-auto pb-4" style={{ borderBottom: '1px solid #E8E8F0' }}>
        <div className="flex items-center gap-5 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative pb-2 text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                color: activeCategory === cat ? '#1A1A2E' : '#8A8A9A',
              }}
            >
              <span className="flex items-center gap-1.5">
                {cat}
                {cat === 'Ads & E-com' && (
                  <span
                    className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                    style={{ backgroundColor: '#F5E642', color: '#1A1A2E' }}
                  >
                    Free
                  </span>
                )}
              </span>
              {activeCategory === cat && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: '#1A1A2E' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div ref={galleryRef} className="mt-4">
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {filteredCards.map((card) => (
            <div key={card.id} className="gallery-card-wrapper">
              <GalleryCard
                image={card.image}
                likes={card.likes}
                hasHot={card.hasHot}
                duration={card.duration}
                title={card.title}
              />
            </div>
          ))}
        </Masonry>
      </div>
    </section>
  );
}
