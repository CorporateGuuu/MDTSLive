"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useState } from "react";

export default function NextImageClient({ src, alt, className, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);

  function handleError() {
    setFailed(true);
    // any other client-side handling...
  }

  if (failed) return <div className={className}>Image failed to load</div>;

  return <Image src={src} alt={alt} className={className} onError={handleError} {...rest} />;
}
