import React, { useRef,useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

export const RelatedProducts = ({relatedproducts,handleWishlist,wishlistId1,handleQuantity,handleAddToCartModal}) => {
  const swiperRef = useRef(null);

  return (
    <section className="related-product-section pt-3">
      <div className="container">
        <h3 className="related-title">Related Products</h3>
        <Swiper
          spaceBetween={18}
          slidesPerView={1}
        //   autoplay={{delay:3000,disableOnInteraction:false}}
          autoplay="false"
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Navigation, Autoplay, Pagination]}
          className="relatedSwiper"
          breakpoints={{
            0: {slidesPerView:1, spaceBetween:0},
            576: { slidesPerView: 2,spaceBetween:10 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
          }}
        >
          {
            relatedproducts.length !== 0 && relatedproducts?.map((item,index)=>{
              return(
                <SwiperSlide key={index}>
                  <div className="related-product-card position-relative">
                    <div className="d-flex align-items-center">
                      {item?.regular_price && item?.sale_price && (
                        <>
                          <span className="sale-title">
                            Sale {Math.round(((item?.regular_price - item?.sale_price) / item?.regular_price) * 100)}%
                          </span>
                          {/* <span className="best-sale-title me-auto">Best Sale</span> */}
                        </>
                      )}
                      {
                        wishlistId1.includes(item.id) ? 
                          <img className="heart-icon img-fluid mb-2" src="/img/heart-fill-icon.svg" alt="heart-fill-icon" onClick={(e)=>handleWishlist(e,item)}></img>:  
                          <img src="/img/heart-icon.svg" className="heart-icon img-fluid mb-2" alt="heart-icon" width="28" height="28" onClick={(e)=>handleWishlist(e,item)}></img>
                      }
                    </div>
                    
                    <Link to={`/products/${item?.slug}`}>
                      <img
                        src={item?.image}
                        className="img-fluid related-product-img mb-3"
                        alt="related-img"
                      ></img>
                    </Link>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-block">
                        <h4 className="related-product-title">{item?.name}</h4>
                        <p className="related-product-price">Starting at: ₹{Number(item?.price).toFixed(2)}</p>
                        <div className="rating-stars">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <img src="/img/addTocart-icon.svg" className="img-fluid" alt="addToCart-icon" onClick={(e)=>handleAddToCartModal(e,item,0,1,item.variations,item.type)}></img> 
                    </div>
                  </div>
                </SwiperSlide>
              )
            })
          }
        </Swiper>
      </div>
    </section>
  );
};
