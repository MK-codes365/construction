'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const images = [
  {
    src: '/1.jpg',
    alt: 'Construction site with crane',
    hint: 'construction crane',
  },
  {
    src: '/2.jpg',
    alt: 'Builders working on a building frame',
    hint: 'construction workers',
  },
  {
    src: '/3.jpg',
    alt: 'Close-up of construction materials',
    hint: 'building materials',
  },
  {
    src: '/4.jpg',
    alt: 'Aerial view of a large construction project',
    hint: 'construction site',
  },
];

export function ImageSlideshow() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-video md:aspect-[2.5/1] overflow-hidden rounded-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                data-ai-hint={image.hint}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}
