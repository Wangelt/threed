import { SafeImage } from "@/components/ui/SafeImage";

interface OnboardingSlideProps {
  title: string;
  subtitle: string;
  image: string;
  imageHeight: number;
}

export function OnboardingSlide({ title, subtitle, image, imageHeight }: OnboardingSlideProps) {
  return (
    <div className="flex flex-col items-center px-8">
      <div className="h-6" />
      <div
        className="relative w-full rounded-[20px] overflow-hidden"
        style={{ height: imageHeight }}
      >
        <SafeImage src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="h-12" />
      <h2 className="text-center text-xl font-medium text-black leading-[1.18]">{title}</h2>
      <div className="h-4" />
      <p className="text-center text-lg font-normal text-black leading-[1.333]">{subtitle}</p>
    </div>
  );
}
