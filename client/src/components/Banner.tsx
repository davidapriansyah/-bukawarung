"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function Banner() {
  const banners = [
    {
      image:
        "https://indodana-web.imgix.net/assets/promo/ID_PL_BANNER_BUKALAPAK_PROMO-ONLINE_DISKON80_SEP23_APPS_1320X600.jpg?auto=compress&auto=format", // Path gambar
      title: "SPARCTACULAR CLEARANCE SALE",
      discount: "Diskon s.d. 34%",
    },
    {
      image:
        "https://i0.wp.com/trikinet.com/wp-content/uploads/2020/11/akun-bukareksa-bukalapak.png",
      title: "KALIBRE",
      discount: "Diskon s.d. 100RB",
    },
    {
      image:
        "https://images-loyalty.ovo.id/public/deal/17/34/l/30710.jpg?ver=1",
      title: "OVO Promo",
      discount: "Diskon s.d. 40%",
    },
    {
      image:
        "https://rm.id/files/konten/berita/bukalapak-mapankan-warung-dengan-teknologi_20142.jpg",
      title: "MITRA",
      discount: "Discount voucher s/d 200RB",
    },
    {
      image:
        "https://s4.bukalapak.com/bukalapak-kontenz-production/content_attachments/83169/w-368/Home_Banner_Bukalapak_Desktop_834_352_Copy_2_1_1_2_.jpg",
      title: "SELLER TOP SPENDER",
      discount: "PRIZE UP TO 3JT",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="rounded-lg shadow-md"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-80 sm:h-[400px] object-cover rounded-lg" // Adjusted height for better display
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-start px-4 sm:px-8 text-white">
                <h2 className="text-lg sm:text-2xl font-bold">
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-lg">{banner.discount}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
