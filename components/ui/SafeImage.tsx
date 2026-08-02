"use client";

import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function SafeImage({ src, alt, className, fill, width, height, priority }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`bg-surface flex items-center justify-center text-text-muted text-xs ${className ?? ""}`}
        style={fill ? undefined : { width, height }}
      >
        No image
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onError={() => setFailed(true)}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 300}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
