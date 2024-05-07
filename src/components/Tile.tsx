'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';
import { BookLoadingSkeleton } from './LoadingSkeleton';

interface Props {
  src?: string;
  title: string;
}

const Tile = ({ src, title }: Props) => {
  const [isOptimized, setIsOptimized] = useState(true);
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {src ? (
        <>
          {loading && <BookLoadingSkeleton />}
          <Image
            id="img"
            alt={title}
            src={src}
            width="200"
            height="200"
            unoptimized={!isOptimized}
            className="absolute inset-0 object-cover w-full h-full rounded-lg shadow-sm"
            onError={() => setIsOptimized(false)}
            onLoad={() => setLoading(false)}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <PhotoIcon className="w-10 opacity-30" />
          <p className="text-xs opacity-30">No image available</p>
        </div>
      )}
    </div>
  );
};
export default Tile;
