import { SafeImage } from "@/components/ui/SafeImage";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  height?: number;
}

export function ProductImage({ src, alt, className = "", height }: ProductImageProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: height ?? "100%" }}>
      <SafeImage src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
