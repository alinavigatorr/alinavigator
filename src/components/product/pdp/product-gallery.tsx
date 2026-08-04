'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, PlayCircle } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        className="relative aspect-square w-full rounded-[var(--radius-lg)] bg-white/[0.02] border border-white/5 overflow-hidden group cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - تصویر ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isZoomed ? 'scale-125' : 'scale-100'}`}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Lightbox / Fullscreen indicator */}
        <button className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square rounded-[var(--radius-md)] overflow-hidden transition-all duration-300 ${
              activeIndex === index 
                ? 'ring-2 ring-[rgb(var(--primary))] ring-offset-2 ring-offset-[#0a0a0a] opacity-100' 
                : 'opacity-50 hover:opacity-100 border border-white/10'
            }`}
          >
            <Image
              src={img}
              alt={`تامینل ${index + 1}`}
              fill
              sizes="20vw"
              className="object-cover"
            />
            {/* Future-ready for video indicator */}
            {index === 4 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-white/80" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}