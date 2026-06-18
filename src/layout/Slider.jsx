import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';


// import required modules
import { EffectFade, Navigation, Pagination } from 'swiper/modules';

function Slider() {


  const slides = [
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1749122613387_1749122613386_wolt_post_sayt_banner_draqon.png&w=3840&q=75",
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1749122602813_1749122602813_wolt_post_sayt_banner_lilo_stich.png&w=3840&q=75",
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1750852575156_1750852575156_wolt_post_sayt_banner.png&w=3840&q=75",
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1750851048929_1750851048929_28__years_later__sayt_banner.png&w=3840&q=75",
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1750851012194_1750851012194_Megan_2_sayt_banner.png&w=3840&q=75",
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1750850971063_1750850971062_F1__sayt_banner.png&w=3840&q=75",
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1749122805573_1749122805573_wolt_post_sayt_banner___telebe.png&w=3840&q=75",
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1749122799285_1749122799284_wolt_post_sayt_banner__lilo_stich__aile.png&w=3840&q=75",
    "https://new.parkcinema.az/_next/image?url=https%3A%2F%2Fnew.parkcinema.az%2Fapi%2Ffile%2FgetFile%2F1749122791931_1749122791930_wolt_post_sayt_banner__draqon.png&w=3840&q=75"
  ]
  useEffect(() => {
    // Sol düyməni gizlə (default prev)
    const prevEl = document.querySelector('.swiper-button-prev');
    if (prevEl) {
      prevEl.style.display = 'none';
    }
  }, [])

  return (
    <div className="relative">
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-[95vh] bg-black/40 z-10 pointer-events-none" />

      {/* Swiper */}
      <Swiper
        spaceBetween={30}
        effect={'fade'}
        loop={true}
        navigation={true}
        modules={[EffectFade, Navigation]}
        className="mySwiper"
      >
        {slides.map((imgSrc, index) => (
          <SwiperSlide key={index}>
            <img
              src={imgSrc}
              alt={`Slide ${index + 1}`}
              className="w-full h-[95vh] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Slider
