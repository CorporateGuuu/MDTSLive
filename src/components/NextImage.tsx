'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface NextImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  onError?: (error: Event) => void;
}

export default function NextImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  onError,
  ...props
}: NextImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      if (onError) {
        onError(error.nativeEvent);
      }
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
