import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const CategorySection = (categories,setLoadingCategories) => {
  const swiperRef = useRef(null);
  const CategoryData = [
    {
      cat_name: "Accessories",
      cat_img: "/img/cat-img1.webp",
      href: "/products?category=accessories",
    },
    { cat_name: "General Dentistry", cat_img: "/img/cat-img2.webp", href: "/products?category=general-dentist" },
    { cat_name: "Gloves", cat_img: "/img/cat-img3.webp", href: "/products?category=all-gloves" },
    { cat_name: "Masks", cat_img: "/img/cat-img4.webp", href: "/products?category=all-masks" },
    { cat_name: "Drapes", cat_img: "/img/cat-img5.webp", href: "/products?category=all-drapes" },
    { cat_name: "Sleeves", cat_img: "/img/cat-img6.webp", href: "/products?category=sleeves" },
    { cat_name: "caps", cat_img: "/img/cat-img7.webp", href: "/products?category=all-caps" },
    { cat_name: "Retractors", cat_img: "/img/cat-img8.webp", href: "/products?category=retractors" },
    { cat_name: "Tips", cat_img: "/img/cat-img9.webp", href: "/products?category=tips" },
    { cat_name: "Trays", cat_img: "/img/cat-img10.webp", href: "/products?category=trays" },
    { cat_name: "Wedges", cat_img: "/img/cat-img11.webp", href: "/products?category=wedges" },
    { cat_name: "Polishing Kits", cat_img: "/img/cat-img12.webp", href: "/products?category=polishing-kits" },
    // {cat_name:"Endo Categories",cat_img:"/img/cat-img6.png",href:""},
  ];
  return (
    <section className="category-section">
      <div className="container">
        <h2 className="category-title txt-grident">CATEGORY</h2>
        <h1 className="category-subtitle">Shop by Top Categories</h1>
        <Swiper
          ref={swiperRef}
          spaceBetween={0}
          slidesPerView={6}
          centeredSlides={false}
          autoplay="false"
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          loop={categories.length > 6}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="categorySwiper mt-lg-4"
          breakpoints={{
            0: {
              spaceBetween: 8,
              slidesPerView: 3,
            },
            768: {
              spaceBetween: 20,
              slidesPerView: 4,
            },
            991: {
              spaceBetween: 0,
              slidesPerView: 5,
            },
            1024: {
              spaceBetween: 0,
              slidesPerView: 6,
            },
            1200: {
              spaceBetween: 0,
              slidesPerView: 6,
            },
          }}
        >
          {CategoryData?.map((category, index) => {
            return (
              <SwiperSlide
                key={index}
                className="category-slide category-content-wrapper"
              >
                <Link to={category?.href}>
                  <img
                    src={category?.cat_img}
                    alt="slide-image"
                    className="slide-image card-img-top img-fluid"
                  ></img>
                  <p className="my-3">{category?.cat_name}</p>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};
export default CategorySection;
