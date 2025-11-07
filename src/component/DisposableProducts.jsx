import React, { useEffect, useState } from 'react';
import axios from "axios";
import BASE_URL from "../api/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DisposableProducts = () => {
    const [disposableProduct, SetDisposableProduct] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);

    useEffect(() =>{
        const fetchDisposableProducts = async () =>{
            try{
                const response = await axios.get(`${BASE_URL}/category/disposable`);
                const product = response.data?.data ||[];
                SetDisposableProduct(product)
            } catch (error){
                console.error("Error fetching the Disposable Products:", error);
                setError("Failed to load Disposable Product.");
            } finally {
                setLoading(false);
            }
        }
        fetchDisposableProducts();
    },[]);
  return (
    <section className="RecentSearch-section">
        <div className="container">
          <h2 className="text-white fs-2 text-center section-title">
            Disposable Products
          </h2>
          { loading ? (
            <p className="text-light text-center mt-4">Loading disposable products...</p>
          ) : error ? (
            <p className="text-danger text-center mt-4">{error}</p>
          ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={2}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
            className="py-4 disposable-swiper"
          >
            <div className="row py-3 py-md-4">
              {disposableProduct?.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="search-product-card card position-relative">
                      {item.regular_price && item.sale_price && (
                        <span className="discount-badge position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white">
                          Sale {Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100)}%
                        </span>
                      )}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="card-img-top img-fluid"
                      ></img>
                      <div className="card-body d-flex align-items-center justify-content-between px-0 px-lg-3 px-md-0 py-2">
                        <div className="d-block">
                          <h2 className="product-card-title mb-0">
                            {item.name}
                          </h2>
                          <p className="product-price mb-0">
                              {item.sale_price ? (
                                  <>
                                      <span className="text-muted text-decoration-line-through me-2">
                                          ₹{item.regular_price}
                                      </span>
                                      <span className="fw-bold text-white">
                                          ₹{item.sale_price}
                                      </span>
                                  </>
                              ) : (
                                      <span className="fw-bold text-white">
                                          ₹{item.price || item.regular_price || "0"}
                                      </span>
                                  )}
                          </p>
                        </div>
                        <img
                          className="shopping-bag-icon img-fluid"
                          alt="shopping-bages"
                          src="/img/lightShopping-bag-icon.svg"
                        ></img>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </div>
          </Swiper>
          )}
        </div>
    </section>
  )
}

export default DisposableProducts