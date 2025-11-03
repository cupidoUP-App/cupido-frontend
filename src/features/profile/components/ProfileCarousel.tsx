import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface ProfileCarouselProps {
  images: string[];
}

const ProfileCarousel: React.FC<ProfileCarouselProps> = ({ images }) => {
  return (
    <div className="w-[280px] rounded-2xl overflow-hidden shadow-lg">
      <Swiper spaceBetween={10} slidesPerView={1} loop={true}>
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`foto-${index}`} className="w-full h-[400px] object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProfileCarousel;
