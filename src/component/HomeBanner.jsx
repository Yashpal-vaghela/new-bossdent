import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const HomeBanner = () => {
  const swiperRef = useRef(null);
  const bannerImages = [
    { img: "/img/Discount-banner.webp", link: "/products" },
    {
      img: "/img/Patient-Drape-premuim.webp",
      link: "/products?category=119",
    },
    { img: "/img/Mask-banner.webp", link: "/products?category=118" },
    {
      img: "/img/Cheek-Reatractors.webp",
      link: "/products?category=125",
    },
    {
      img: "/img/Patient-bibs-banner.webp",
      link: "/products/patient-bibs",
    },
  ];

  useEffect(() => {
    bannerImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = src;
      link.as = "image";
      document.head.appendChild(link);
    });
    return () => {
      document
        .querySelectorAll("link[rel='preload'][as='image']")
        .forEach((link) => link.remove());
    };
  }, []);

  // Stop autoplay on hold (MouseDown or TouchStart)
  const handleHoldStart = () => {
    swiperRef.current.swiper.autoplay.stop();
  };

  // Resume autoplay on release (MouseUp or TouchEnd)
  const handleHoldEnd = () => {
    swiperRef.current.swiper.autoplay.start();
  };

  return (
    <>
      <section className="banner-section position-relative">
        <Swiper
          ref={swiperRef}
          spaceBetween={30}
          centeredSlides={true}
          autoplay="false"
          // autoplay={{
          //   delay: 3000,
          //   disableOnInteraction: false,
          // }}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          {bannerImages.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <Link
                  to={item.link}
                  className={`banner-${index}-main`}
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  onClick={() => {
                    return sessionStorage.getItem("Product_page") > 1
                      ? sessionStorage.setItem("Product_page", 1)
                      : null;
                  }}
                >
                  <div className="banner-img-main">
                    <img
                      src={item.img}
                      className="banner-img img-fluid"
                      alt="home-banner-img"
                    ></img>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    </>
  );
};

export default HomeBanner;
