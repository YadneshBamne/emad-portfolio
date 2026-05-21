"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const AnimatedCarousel = ({
  title = "CREATIVE PARTNERS",
  logoCount = 15,
  autoPlay = true,
  autoPlayInterval = 2000,
  logos = null, 
  containerClassName = "",
  titleClassName = "",
  carouselClassName = "",
  logoClassName = "",
  itemsPerViewMobile = 3,
  itemsPerViewDesktop = 5,
  spacing = "",
  padding = "py-8 md:py-12",
  logoContainerWidth = "w-full",
  logoContainerHeight = "h-16 md:h-20",
  logoImageWidth = "w-full",
  logoImageHeight = "h-8 md:h-12",
  logoMaxWidth = "",
  logoMaxHeight = "",
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || !autoPlay) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, autoPlayInterval);

    return () => clearTimeout(timer);
  }, [api, current, autoPlay, autoPlayInterval]);

  // If logos are not provided, generate placeholders
  const defaultLogos = Array.from({ length: 16 }, (_, i) => `/${(i % 15) + 5}.png`);
  const logoItems = logos || defaultLogos;

  // Chunk logos into pairs for 2-row layout
  const chunkedLogos = [];
  for (let i = 0; i < logoItems.length; i += 2) {
    chunkedLogos.push(logoItems.slice(i, i + 2));
  }

  const logoImageSizeClasses = `${logoImageWidth} ${logoImageHeight} ${logoMaxWidth} ${logoMaxHeight}`.trim();

  return (
    <div className={`w-full ${padding} bg-transparent ${containerClassName}`}>
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className={`flex flex-col md:flex-row items-center ${spacing}`}>
          
          {/* Title Section */}
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start w-full md:w-auto mb-8 md:mb-0 shrink-0">
            <div className="flex items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600 mr-4 shrink-0">
                <path d="M12 2V9M12 15V22M2 12H9M15 12H22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
              </svg>
              <div className={`font-mono text-xs md:text-sm tracking-[0.2em] flex gap-2 ${titleClassName}`}>
                {title.split(' ').map((word, i) => (
                  <span key={i} className={i === 0 ? "text-zinc-500" : "text-white font-bold"}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
            {/* Vertical Divider (Desktop) / Horizontal Divider (Mobile) */}
            <div className="hidden md:block w-[1px] h-16 bg-zinc-800 mx-8"></div>
            <div className="md:hidden w-16 h-[1px] bg-zinc-800 my-6"></div>
          </div>
          
          {/* Carousel Section */}
          <div className="w-full overflow-hidden flex-1">
            <Carousel setApi={setApi} className={`w-full ${carouselClassName}`}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {chunkedLogos.map((chunk, index) => (
                  <CarouselItem className={`pl-2 md:pl-4 basis-1/${itemsPerViewMobile} lg:basis-1/${itemsPerViewDesktop}`} key={index}>
                    <div className="flex flex-col gap-4 md:gap-8 justify-center h-full">
                      {chunk.map((logo, logoIdx) => (
                        <div key={logoIdx} className={`flex ${logoContainerWidth} ${logoContainerHeight} items-center justify-center p-2 hover:bg-white/5 rounded-lg transition-colors ${logoClassName}`}>
                          <img 
                            src={typeof logo === 'string' ? logo : logo.src}
                            alt={typeof logo === 'string' ? `Logo ${index * 2 + logoIdx + 1}` : logo.alt}
                            className={`${logoImageSizeClasses} object-contain filter opacity-70 hover:opacity-100 transition-opacity duration-300`}
                          />
                        </div>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

        </div>
      </div>
    </div>
  );
};
