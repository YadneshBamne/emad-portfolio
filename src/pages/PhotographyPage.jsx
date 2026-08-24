import React, { useState, useEffect } from 'react';
import { AaryaNavigationDrawer } from '../components/AaryaNavigationDrawer';
import DynamicIslandNavbar from '../components/DynamicIslandNavbar';
import InfiniteCanvas from '../components/ui/InfiniteCanvas';
import { motion, AnimatePresence } from 'framer-motion';

export const PHOTO_ITEMS = [
  {
    id: 1,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/sequenceCredits@emadshaikh03_KM-43%20(1).jpg?updatedAt=1787199247781',
    code: 'N · 0 0 1',
    title: 'Karan Aujla Live Tour',
    orientation: 'portrait',
    aperture: 'f/1.4',
    shutter: '1/250s',
    iso: '1600',
    lens: '85MM GM'
  },
  {
    id: 2,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/credits_@emadshaikh03-34.jpg?updatedAt=1787199321895',
    code: 'N · 0 1 7',
    title: 'Stage Production Flare',
    orientation: 'portrait',
    aperture: 'f/1.2',
    shutter: '1/200s',
    iso: '6400',
    lens: '50MM APD'
  },
  {
    id: 3,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/Credits_@emadshaikh03-31.jpg?updatedAt=1787199255482',
    code: 'N · 8 6 6',
    title: 'Stadium Atmosphere',
    orientation: 'landscape',
    aperture: 'f/2.8',
    shutter: '1/160s',
    iso: '3200',
    lens: '70-200MM GM'
  },
  {
    id: 4,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-48%20(1).jpg?updatedAt=1787199008444',
    code: 'N · 5 1 2',
    title: 'Concert Spotlight Silhouette',
    orientation: 'landscape',
    aperture: 'f/1.8',
    shutter: '1/500s',
    iso: '800',
    lens: '135MM F1.8'
  },
  {
    id: 5,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC01914.jpg?updatedAt=1787199300412',
    code: 'N · 1 1 8',
    title: 'Live Arena Crowd',
    orientation: 'portrait',
    aperture: 'f/1.4',
    shutter: '1/320s',
    iso: '2000',
    lens: '35MM GM'
  },
  {
    id: 6,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-40(1).jpg?updatedAt=1787198959091',
    code: 'N · 2 0 4',
    title: 'Crowd Energy Surge',
    orientation: 'portrait',
    aperture: 'f/1.2',
    shutter: '1/250s',
    iso: '4000',
    lens: '50MM GM'
  },
  {
    id: 7,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-9.jpg?updatedAt=1787198996020',
    code: 'N · 7 7 4',
    title: 'Backstage Perspective',
    orientation: 'portrait',
    aperture: 'f/1.8',
    shutter: '1/125s',
    iso: '1600',
    lens: '85MM F1.8'
  },
  {
    id: 8,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/20251209_184430.jpg?updatedAt=1787198957580',
    code: 'N · 7 0 3',
    title: 'Festival Golden Hour',
    orientation: 'landscape',
    aperture: 'f/2.8',
    shutter: '1/200s',
    iso: '3200',
    lens: '24-70MM GM'
  },
  {
    id: 9,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-20(1).jpg?updatedAt=1787198955000',
    code: 'N · 9 9 1',
    title: 'Artist Focus Close-up',
    orientation: 'landscape',
    aperture: 'f/2.0',
    shutter: '1/400s',
    iso: '1600',
    lens: '50MM F2.0'
  },
  {
    id: 10,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/VOGUE-2.jpg?updatedAt=1787199298801',
    code: 'N · 3 4 1',
    title: 'Editorial Vogue Session',
    orientation: 'landscape',
    aperture: 'f/1.4',
    shutter: '1/160s',
    iso: '6400',
    lens: '85MM GM'
  },
  {
    id: 11,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/DSC-8.jpg?updatedAt=1787198975283',
    code: 'N · 6 0 5',
    title: 'Pyrotechnics & Beam Beacons',
    orientation: 'landscape',
    aperture: 'f/2.8',
    shutter: '1/250s',
    iso: '800',
    lens: '70-200MM GM'
  },
  {
    id: 12,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/work/hanumankind_02.jpg?updatedAt=1787198869718',
    code: 'N · 4 8 2',
    title: 'Hanumankind Headline Performance',
    orientation: 'portrait',
    aperture: 'f/1.2',
    shutter: '1/500s',
    iso: '3200',
    lens: '50MM GM'
  },
  {
    id: 13,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-14.jpg',
    code: 'N · 1 0 1',
    title: 'ISF Live Experience',
    orientation: 'portrait',
    aperture: 'f/1.4',
    shutter: '1/250s',
    iso: '1600',
    lens: '50MM GM'
  },
  {
    id: 14,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-68.jpg',
    code: 'N · 1 0 2',
    title: 'Nightscape Energy',
    orientation: 'portrait',
    aperture: 'f/1.8',
    shutter: '1/200s',
    iso: '3200',
    lens: '35MM GM'
  },
  {
    id: 15,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-172.jpg',
    code: 'N · 1 0 3',
    title: 'Visual Architecture',
    orientation: 'portrait',
    aperture: 'f/2.8',
    shutter: '1/160s',
    iso: '2000',
    lens: '24-70MM GM'
  },
  {
    id: 16,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES_75-6.jpg',
    code: 'N · 1 0 4',
    title: 'Baricci Editorial',
    orientation: 'portrait',
    aperture: 'f/1.4',
    shutter: '1/400s',
    iso: '800',
    lens: '85MM GM'
  },
  {
    id: 17,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-147.jpg',
    code: 'N · 1 0 5',
    title: 'Motion in Silhouette',
    orientation: 'portrait',
    aperture: 'f/1.2',
    shutter: '1/500s',
    iso: '1600',
    lens: '50MM GM'
  },
  {
    id: 18,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-65.jpg?updatedAt=1780411130453',
    code: 'N · 1 0 6',
    title: 'Artistic Exposure',
    orientation: 'portrait',
    aperture: 'f/2.0',
    shutter: '1/250s',
    iso: '1200',
    lens: '50MM GM'
  },
  {
    id: 19,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-71.jpg',
    code: 'N · 1 0 7',
    title: 'Light Transmission',
    orientation: 'portrait',
    aperture: 'f/1.4',
    shutter: '1/320s',
    iso: '1600',
    lens: '85MM GM'
  },
  {
    id: 20,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/credits_BARICCI_ES-75.jpg',
    code: 'N · 1 0 8',
    title: 'Ephemeral Momentum',
    orientation: 'portrait',
    aperture: 'f/1.8',
    shutter: '1/200s',
    iso: '3200',
    lens: '35MM GM'
  },
  {
    id: 21,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-8.jpg',
    code: 'N · 1 0 9',
    title: 'Frames of Intensity',
    orientation: 'portrait',
    aperture: 'f/1.4',
    shutter: '1/400s',
    iso: '1600',
    lens: '50MM GM'
  },
  {
    id: 22,
    src: 'https://ik.imagekit.io/4no4se4zt/Emad%20Shaikh/photos/ISF-11.jpg',
    code: 'N · 1 1 0',
    title: 'Captured Strobe Flare',
    orientation: 'portrait',
    aperture: 'f/2.0',
    shutter: '1/500s',
    iso: '2500',
    lens: '24-70MM GM'
  }
];

export default function PhotographyPage() {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  // Keyboard navigation for full screen view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % PHOTO_ITEMS.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + PHOTO_ITEMS.length) % PHOTO_ITEMS.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  const handleGridItemClick = (item, index) => {
    const targetSrc = item?.src ?? item?.image?.src;
    const matchIdx = PHOTO_ITEMS.findIndex(
      (p) => p.src === targetSrc || p.id === item.id || p.code === item.code
    );
    setActivePhotoIndex(matchIdx !== -1 ? matchIdx : index % PHOTO_ITEMS.length);
  };

  const activePhoto = activePhotoIndex !== null ? PHOTO_ITEMS[activePhotoIndex] : null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#050505] text-white select-none overflow-hidden">
      
      {/* GLOBAL HUD NAVIGATION OVERLAY */}
      <header className={`fixed top-0 left-0 w-full h-18 px-6 sm:px-10 z-50 pointer-events-none text-white bg-transparent transition-opacity duration-300 ${activePhotoIndex !== null ? 'opacity-0' : 'opacity-100'}`}>
        {/* Global Slide-Out Navigation (Framer Motion) - Mobile Only */}
        <div className="block md:hidden pointer-events-auto">
          <AaryaNavigationDrawer />
        </div>

        {/* Dynamic Island Navigation Bar */}
        <DynamicIslandNavbar activePath="/photography" />
      </header>

      {/* INFINITE CANVAS (Seamless Looping Drag with GSAP Physics & Motion Blur) */}
      <main className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <InfiniteCanvas
          items={PHOTO_ITEMS}
          itemWidth={275}
          itemHeight={360}
          gap={95}
          enableWheel={true}
          enableMotionBlur={true}
          onItemClick={handleGridItemClick}
          className="w-full h-full"
        />
      </main>

      {/* PURE MINIMALIST FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {activePhotoIndex !== null && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 md:p-12 cursor-pointer select-none"
            onClick={() => setActivePhotoIndex(null)}
          >
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              src={activePhoto.src}
              alt={activePhoto.title || activePhoto.code || "Photo"}
              draggable={false}
              className="max-h-[92vh] max-w-[92vw] w-auto h-auto object-contain rounded-none shadow-[0_30px_90px_rgba(0,0,0,0.95)] pointer-events-auto cursor-pointer"
              onClick={() => setActivePhotoIndex(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background sensor layout grids */}
      <div className="fixed inset-0 bg-page-sensor-grid opacity-10 pointer-events-none z-0" />

      {/* Embedded SVG grid blueprint styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-page-sensor-grid {
          background-size: 80px 80px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

    </div>
  );
}
