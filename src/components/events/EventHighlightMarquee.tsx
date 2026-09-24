import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string;
  category?: string;
}

// 24 curated conference, podium, networking, and audience photos matching user's reference
const ROW_1_PHOTOS: GalleryPhoto[] = [
  {
    id: 'r1-1',
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    caption: 'Governor Delivering Opening Keynote Address',
    category: 'Keynote'
  },
  {
    id: 'r1-2',
    image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    caption: 'Young Banking Professionals & University Fellows',
    category: 'Delegates'
  },
  {
    id: 'r1-3',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    caption: 'Plenary Session Audience at Kempinski Grand Ballroom',
    category: 'Auditorium'
  },
  {
    id: 'r1-4',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    caption: 'Executive Panel: Ethical AI Governance in Banking',
    category: 'Panel'
  },
  {
    id: 'r1-5',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    caption: 'Fintech Innovation Syndicate Collaboration',
    category: 'Breakout'
  },
  {
    id: 'r1-6',
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    caption: 'Exhibition Hall & Partner Showcase Networking',
    category: 'Networking'
  },
  {
    id: 'r1-7',
    image_url: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80',
    caption: 'Young Women Leaders in African Banking Initiative',
    category: 'Leadership'
  },
  {
    id: 'r1-8',
    image_url: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=800&q=80',
    caption: 'Chief Risk Officer Masterclass Workshop',
    category: 'Workshop'
  }
];

const ROW_2_PHOTOS: GalleryPhoto[] = [
  {
    id: 'r2-1',
    image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    caption: 'Chartered Bankers Class of 2026 Celebration',
    category: 'Fellows'
  },
  {
    id: 'r2-2',
    image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    caption: 'Distinguished Speaker at the Podium on Stage',
    category: 'Speaker'
  },
  {
    id: 'r2-3',
    image_url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80',
    caption: 'Engaged Delegates Listening to Policy Deliberations',
    category: 'Audience'
  },
  {
    id: 'r2-4',
    image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    caption: 'Roundtable Discussion: ESG Compliance & Green Financing',
    category: 'Roundtable'
  },
  {
    id: 'r2-5',
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    caption: 'Institutional Partnership Signing Ceremony',
    category: 'Ceremony'
  },
  {
    id: 'r2-6',
    image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80',
    caption: 'Executive Luncheon & Bilateral Exchange',
    category: 'Luncheon'
  },
  {
    id: 'r2-7',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    caption: 'Keynote Q&A Session with Banking Executives',
    category: 'Q&A'
  },
  {
    id: 'r2-8',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    caption: 'Student Mentorship & Next-Gen Banking Forum',
    category: 'Youth'
  }
];

const ROW_3_PHOTOS: GalleryPhoto[] = [
  {
    id: 'r3-1',
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    caption: 'Conference Grand Foyer Morning Registration',
    category: 'Registration'
  },
  {
    id: 'r3-2',
    image_url: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80',
    caption: 'Bank of Ghana Supervisory Presentation',
    category: 'Keynote'
  },
  {
    id: 'r3-3',
    image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    caption: 'Commercial Bank CEOs at Annual Ethics Summit',
    category: 'Executives'
  },
  {
    id: 'r3-4',
    image_url: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=800&q=80',
    caption: 'Technical Masterclass on Cyber Security & Fraud',
    category: 'Masterclass'
  },
  {
    id: 'r3-5',
    image_url: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=800&q=80',
    caption: 'Annual Banking Excellence Gala Dinner & Awards',
    category: 'Gala'
  },
  {
    id: 'r3-6',
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    caption: 'Delegates Celebrating Conference Resolutions',
    category: 'Celebration'
  },
  {
    id: 'r3-7',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    caption: 'Presidential Address at Bankers Annual Dinner',
    category: 'Presidency'
  },
  {
    id: 'r3-8',
    image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    caption: 'Fintech Demo Hall & Digital Transformation Stalls',
    category: 'Exhibition'
  }
];

// All photos combined for lightbox navigation
const ALL_PHOTOS: GalleryPhoto[] = [
  ...ROW_1_PHOTOS,
  ...ROW_2_PHOTOS,
  ...ROW_3_PHOTOS
];

export const EventHighlightMarquee: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const openLightbox = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const currentIndex = selectedPhoto
    ? ALL_PHOTOS.findIndex((p) => p.id === selectedPhoto.id)
    : -1;

  const prevPhoto = () => {
    if (currentIndex === -1) return;
    const newIdx = (currentIndex - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length;
    setSelectedPhoto(ALL_PHOTOS[newIdx]);
  };

  const nextPhoto = () => {
    if (currentIndex === -1) return;
    const newIdx = (currentIndex + 1) % ALL_PHOTOS.length;
    setSelectedPhoto(ALL_PHOTOS[newIdx]);
  };

  return (
    <div className="relative w-full overflow-hidden py-4 space-y-4 sm:space-y-6">
      {/* ROW 1: SWIPES TO RIGHT */}
      <div className="marquee-container overflow-hidden flex select-none">
        <div className="animate-marquee-right flex gap-3 sm:gap-4">
          {[...ROW_1_PHOTOS, ...ROW_1_PHOTOS].map((photo, idx) => (
            <div
              key={`r1-${idx}`}
              onClick={() => openLightbox(photo)}
              className="w-64 sm:w-80 md:w-96 h-44 sm:h-56 shrink-0 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/80 group relative"
            >
              <img
                src={photo.image_url}
                alt={photo.caption}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                <span className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                  {photo.caption}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[11px] text-[#F5A623] font-extrabold">
                  <ZoomIn className="w-3.5 h-3.5" /> Click to enlarge
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 2: SWIPES TO LEFT (Instagram Portrait 4:5 Size matching user reference) */}
      <div className="marquee-container overflow-hidden flex select-none">
        <div className="animate-marquee-left flex gap-3 sm:gap-4">
          {[...ROW_2_PHOTOS, ...ROW_2_PHOTOS].map((photo, idx) => (
            <div
              key={`r2-${idx}`}
              onClick={() => openLightbox(photo)}
              className="w-48 sm:w-60 md:w-72 h-60 sm:h-[300px] md:h-[360px] aspect-[4/5] shrink-0 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/80 group relative"
            >
              <img
                src={photo.image_url}
                alt={photo.caption}
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                <span className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                  {photo.caption}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[11px] text-[#F5A623] font-extrabold">
                  <ZoomIn className="w-3.5 h-3.5" /> Click to enlarge
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 3: SWIPES TO RIGHT */}
      <div className="marquee-container overflow-hidden flex select-none">
        <div className="animate-marquee-right flex gap-3 sm:gap-4">
          {[...ROW_3_PHOTOS, ...ROW_3_PHOTOS].map((photo, idx) => (
            <div
              key={`r3-${idx}`}
              onClick={() => openLightbox(photo)}
              className="w-64 sm:w-80 md:w-96 h-44 sm:h-56 shrink-0 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/80 group relative"
            >
              <img
                src={photo.image_url}
                alt={photo.caption}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                <span className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                  {photo.caption}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[11px] text-[#F5A623] font-extrabold">
                  <ZoomIn className="w-3.5 h-3.5" /> Click to enlarge
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Prev Arrow */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Next Arrow */}
            <button
              onClick={nextPhoto}
              className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image & Caption */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center z-10"
            >
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.caption}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              <div className="mt-4 text-center px-4">
                <p className="text-white font-bold text-base sm:text-lg">
                  {selectedPhoto.caption}
                </p>
                <p className="text-xs text-[#F5A623] font-semibold mt-1">
                  Photo {currentIndex + 1} of {ALL_PHOTOS.length} &bull; CIB Ghana Archive
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
