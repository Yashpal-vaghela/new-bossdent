import React, { useEffect, useRef, useState } from "react";
import HomeBanner from "../component/HomeBanner";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Home = () => {
  const CategoryData = [
    {
      cat_name: "Accessories",
      cat_img: "/img/cat-img1.png",
      href: "products?category=46",
    },
    { cat_name: "General Dentistry", cat_img: "/img/cat-img2.png", href: "" },
    { cat_name: "Gloves", cat_img: "/img/cat-img3.png", href: "" },
    { cat_name: "Masks", cat_img: "/img/cat-img4.png", href: "" },
    { cat_name: "Drapes", cat_img: "/img/cat-img5.png", href: "" },
    { cat_name: "Sleeves", cat_img: "/img/cat-img6.png", href: "" },
    { cat_name: "caps", cat_img: "/img/cat-img7.png", href: "" },
    { cat_name: "Retractors", cat_img: "/img/cat-img8.png", href: "" },
    { cat_name: "Tips", cat_img: "/img/cat-img9.png", href: "" },
    { cat_name: "Trays", cat_img: "/img/cat-img10.png", href: "" },
    { cat_name: "Wedges", cat_img: "/img/cat-img11.png", href: "" },
    { cat_name: "Polishing Kits", cat_img: "/img/cat-img12.png", href: "" },
    // {cat_name:"Endo Categories",cat_img:"/img/cat-img6.png",href:""},
  ];
  const ProductData = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
  ];
  // const OtherBannerData = [
  //   { id: 1, img: "/img/other-banner-img1.png" },
  //   { id: 2, img: "/img/other-banner-img2.png" },
  //   { id: 3, img: "/img/other-banner-img3.png" },
  // ];
  const SearchProductData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const DentalProductData = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
  ];
  const [showAll, setShowAll] = useState(false);
  const {categories,loading,error} = useSelector((state)=>state.category);
  // const { categories, loading, error } = useCategories();
  const visibleCategories = showAll ? categories : categories.slice(0, 5);

  const swiperRef = useRef(null);

  return (
    <div className="home-main overflow-hidden">
      <HomeBanner></HomeBanner>
      <section className="contact-link-section mb-4 mt-4 mt-lg-5">
        <div className="container">
          <div className="row">
            <div className="contact-content-wrapper mb-3 mb-md-0 col-lg-3 col-md-6  col-6 d-flex justify-content-center align-items-center">
              <img
                src="/img/Trusted-dentist-icon.svg"
                className="trusted-dentist-icon img-fluid"
                alt="trusted-dentist-icon"
                width="53"
                height="52"
              ></img>
              <div className="contact-link-section-content d-block">
                <h2 className="mb-1">Trusted Dentists</h2>
                <p className="mb-1">Serving 10k+ Dental Clinics</p>
              </div>
            </div>
            <div className="contact-content-wrapper mb-3 mb-md-0 col-lg-3 col-md-6 col-6 d-flex justify-content-center align-items-center">
              <img
                src="/img/headphones-icon1.svg"
                className="headphone-icon-img img-fluid"
                alt="headphones-icon"
                width="53"
                height="52"
              ></img>
              <div className="contact-link-section-content d-block">
                <h2 className="mb-1">Quick & Easy Support</h2>
                <p className="mb-1">Fast, Easy Help Anytime</p>
              </div>
            </div>
            <div className="contact-content-wrapper mb-1 mb-md-0 col-lg-3 col-md-6 col-6 d-flex justify-content-center align-items-center">
              <img
                src="/img/secure-icon1.svg"
                className="secure-icon-img img-fluid"
                alt="secure-icon"
                width="53"
                height="52"
              ></img>
              <div className="contact-link-section-content d-block">
                <h2 className="mb-1">Secure Payment Options</h2>
                <p className="mb-1">Safe, Protected & Hassle-Free</p>
              </div>
            </div>
            <div className="contact-content-wrapper mb-1 mb-md-0 col-lg-3 col-md-6 col-6 d-flex justify-content-center align-items-center">
              <img
                src="/img/product-quality-icon.svg"
                alt="product-quality-icon"
                className="product-quality-img img-fluid"
                width="53"
                height="52"
              ></img>
              <div className="contact-link-section-content d-block">
                <h2 className="mb-1">Authentic Product Quality</h2>
                <p className="mb-1">Genuine, Certified & Reliable</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="dental-product-section ">
        <div className="container">
          <h2 className="text-white fs-2 text-center section-title">
            Our Dental Products Range
          </h2>
          <div className="product-filter-content">
            <ul className="product-filter-category-list">
              {visibleCategories?.map((category, index) => {
                return (
                  <li className="product-category" key={index}>
                    <Link to={category?.slug}>{category?.name}</Link>
                  </li>
                );
              })}
              {categories.length > 5 && (
                <li className="product-category" onClick={()=>setShowAll((prev)=>!prev)}>
                  <Link to="#">{showAll ? "View Less" :"View All"}</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="row pt-3 justify-content-center">
            {DentalProductData?.map((item, index) => {
              return (
                <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={index}>
                  <div className="card">
                    <img
                      src="/img/product-img4.png"
                      className="card-img-top img-fluid"
                      alt="dental-product-img"
                    ></img>
                    <div className="card-body d-flex align-items-center justify-content-between px-lg-3 px-0 py-2">
                      <div className="d-block">
                        <h2 className="product-card-title mb-0">
                          Product Title
                        </h2>
                        <p className="product-price mb-0">$12.00</p>
                      </div>
                      <img
                        className="shopping-bag-icon img-fluid"
                        alt="shopping-bages"
                        src="/img/lightShopping-bag-icon.svg"
                      ></img>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="banner-img-section ">
        <div className="container">
          <img
            src="/img/banner-img.png"
            className="banner-img img-fluid"
            alt="banner-img"
          ></img>
        </div>
      </section>
      <section className="category-section">
        <div className="container">
          <h2 className="category-title txt-grident">CATEGORY</h2>
          <h1 className="category-subtitle">Shop by Top Categories</h1>
          {/* <div className="row ">
            {CategoryData?.map((category, index) => {
              return (
                <div
                  className="col-lg-2 col-md-3 col-12 category-content-wrapper"
                  key={index}
                >
                  <Link to={category?.href}>
                    <img
                      src={category?.cat_img}
                      className="my-2 img-fluid"
                      alt="category-image"
                    ></img>
                    <p className="my-3">{category?.cat_name}</p>
                  </Link>
                </div>
              );
            })}
          </div> */}
          <Swiper
            ref={swiperRef}
            spaceBetween={0}
            slidesPerView={6}
            centeredSlides={true}
            autoplay="false"
            grabCursor={true}
            pagination={{
              clickable: true,
            }}
            loop={true}
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

      <section className="premium-products-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="text-white fs-2 section-title">
              Exclusive Premium Products
            </h1>
            <button className="btn btn-dafult txt-grident btn-view">
              view All <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div className="grid-container my-3">
            <div className="grid-item big  card">
              <img
                src="https://admin.bossdentindia.com/wp-content/uploads/2024/06/137.jpg"
                className="img-fluid"
                alt="product-sale-img"
              ></img>
              <div className="product-cart-wrapper d-flex justify-content-between w-100 align-items-center">
                <img
                  src="/img/heart-icon.svg"
                  className="heart-icon img-fluid"
                  alt="heart-icon"
                ></img>
                <button className="btn btn-default ">
                  Add to Cart
                  <img
                    src="/img/shopping-bag-icon.svg"
                    className="img-fluid"
                    alt="shopping-bag-icon"
                  ></img>
                </button>
                <img
                  src="/img/eye-icon.svg"
                  className="eye-icon img-fluid"
                  alt="eye-icon"
                ></img>
              </div>
              <h2 className="product-card-title active">Product Title</h2>
              <h3 className="product-price">
                $12.00 <span className="txt-dashed-price">$24.00</span>
              </h3>
              {/* <div className="rating-stars d-flex align-items-center justify-content-center">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <span className="rating-count">(524 Feedback)</span>
              </div> */}
              <div className="sale-content d-block">
                <p className="sale-price-title mb-2">
                  Hurry up! Offer ends In:
                </p>
                <div className="sale-time-wrapper d-flex justify-content-between">
                  <p className="d-grid">
                    01 <span>Days</span>
                  </p>
                  <p className="d-grid">
                    23 <span>Hours</span>
                  </p>
                  <span>:</span>
                  <p className="d-grid">
                    34 <span>Mins</span>
                  </p>
                  <span>:</span>
                  <p className="d-grid">
                    57 <span>Secs</span>
                  </p>
                </div>
              </div>
            </div>
            {ProductData?.map((item, index) => {
              return (
                <div className="grid-item card" key={index}>
                  <img
                    src="/img/product-img1.png"
                    className="product-img img-fluid"
                    alt="product-img"
                  ></img>
                  <div className="product-card-wrapper d-flex align-items-center justify-content-between w-100 h-auto">
                    <div className="d-block">
                      <h2 className="product-card-title mb-0">Product Title</h2>
                      <p className="product-price mb-1">$12.00</p>
                      {/* <div className="rating-stars">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div> */}
                    </div>
                    <img
                      src="/img/lightShopping-bag-icon.svg"
                      className="shopping-bag-icon img-fluid"
                      alt="shopping-bages"
                    ></img>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="Otherbanner-section">
        <div className="container">
          <div className="row align-items-center  justify-content-center justify-content-lg-center">
            <div className="col-lg-4 col-md-4 col-12">
              <img
                src="/img/other-banner-img1.png"
                className="other-banner-img img-fluid"
                alt="other-banner-img"
              ></img>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-5 col-6">
              <img
                src="/img/other-banner-img2.png"
                className="other-banner-img img-fluid"
                alt="other-banner-img"
              ></img>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-5 col-6">
              <img
                src="/img/other-banner-img3.png"
                className="other-banner-img img-fluid"
                alt="other-banner-img"
              ></img>
            </div>
            {/* {OtherBannerData?.map((item, index) => {
              return (
                <div className="col-lg-4 col-md-6 col-12" key={index}>
                  <img
                    src={item.img}
                    className="other-banner-img img-fluid"
                    alt="other-banner-img"
                  ></img>
                </div>
              );
            })} */}
          </div>
        </div>
      </section>
      <section className="RecentSearch-section">
        <div className="container">
          <h2 className="text-white fs-2 text-center section-title">
            Recent Searched
          </h2>
          <div className="row py-3 py-md-4">
            {SearchProductData?.map((item, index) => {
              return (
                <div className="col-lg-3 col-md-3 col-6 " key={index}>
                  <div className="search-product-card card">
                    <img
                      src="/img/product-img4.png"
                      alt="search-rpoduct-img"
                      className="card-img-top img-fluid"
                    ></img>
                    <div className="card-body d-flex align-items-center justify-content-between px-0 px-lg-3 px-md-0 py-2">
                      <div className="d-block">
                        <h2 className="product-card-title mb-0">
                          Product Title
                        </h2>
                        <p className="product-price mb-0">$12.00</p>
                        {/* <div className="rating-stars">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div> */}
                      </div>
                      <img
                        className="shopping-bag-icon img-fluid"
                        alt="shopping-bages"
                        src="/img/lightShopping-bag-icon.svg"
                      ></img>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
