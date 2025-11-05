import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProfileCarouselProps {
  images: string[];
}

const ProfileCarousel: React.FC<ProfileCarouselProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return null; // O un placeholder si se prefiere, pero por ahora nada.
  }

  const slides = images.slice(0, 5);

  return (
    <div className="relative w-[340px] md:w-[440px] lg:w-[520px] rounded-2xl overflow-visible">
      {/* tarjetas apiladas de fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-6 top-6 h-full w-full -rotate-6 rounded-2xl bg-white/60 shadow-xl" />
        <div className="absolute right-6 -top-4 h-full w-full rotate-3 rounded-2xl bg-white/40 shadow-lg" />
      </div>
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        effect="coverflow"
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 1.2, slideShadows: false }}
        spaceBetween={16}
        slidesPerView={1}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        className="h-[460px] md:h-[520px] lg:h-[560px] overflow-hidden rounded-2xl bg-white/70 shadow-2xl backdrop-blur-sm"
      >
        {slides.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`foto-${index}`}
              className="w-full h-[460px] md:h-[520px] lg:h-[560px] object-cover select-none"
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProfileCarousel;
