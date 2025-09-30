import heroPreloaderGif from '@/assets/hero-preloader.gif';

interface FloatingGifProps {
  isVisible: boolean;
}

export default function FloatingGif({ isVisible }: FloatingGifProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
      <div className="w-24 h-24 pulse-gentle">
        <img
          src={heroPreloaderGif}
          alt=""
          className="w-full h-full object-contain animate-float"
          role="presentation"
        />
      </div>
    </div>
  );
}