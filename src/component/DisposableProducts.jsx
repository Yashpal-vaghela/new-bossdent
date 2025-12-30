import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../api/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useValidateUser from "./useValidateUser";
import { AddToCart } from "../redux/cartSlice";
import { AddToCartModal } from "./AddToCartModal";
import Loader2 from "./Loader2";

const DisposableProducts = ({ token, getCartData, dispatch }) => {
  const [disposableProduct, SetDisposableProduct] = useState([]);
  const [apiloading, setApiLoading] = useState(true);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  const validateUser = useValidateUser();
  const fetchDisposableProducts = async (controller) => {
    try {
      const response = await axios.get(`${BASE_URL}/category/disposable`, {
        signal: controller.signal,
      });
      const product = response.data?.data || [];
      SetDisposableProduct(product);
    } catch (error) {
      console.error("Error fetching the Disposable Products:", error);
    } finally {
      setApiLoading(false);
    }
  };
  const handleAddToCart = async (
    e,
    product,
    selectedAttributes,
    quantity,
    slug
  ) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to product add to cart!")
      // toast.error("Please login to add product to wishlist!")
    } else {
      const AlreadyExistsData = getCartData?.items?.filter((i) => {
        return i?.variation_id !== 0
          ? i?.variation_id === selectedAttributes?.id
          : true && i?.product_id === product?.id;
      });
      if (AlreadyExistsData.length > 0) {
        if (
          product?.variations &&
          product?.variations.length !== 0 &&
          selectedAttributes === 0
        ) {
          console.warn("open modal ProductVariationsData Edit api call");
          setShowVariationModal((prev) => !prev);
          setSelectedProductForModal(product);
        } else {
          if (selectedAttributes === null && selectedAttributes !== undefined) {
            toast.error(
              `Please select ${
                product?.variations?.map(
                  (i, index) => Object.keys(i?.attributes)[index]
                )[0]
              }`
            );
          } else {
            if (selectedAttributes === undefined) {
              toast.error(
                `please select ${
                  product?.variations?.map(
                    (i, index) => Object.keys(i?.attributes)[index]
                  )[1]
                }`
              );
            } else {
              const payload = {
                cart_id: AlreadyExistsData[0]?.cart_id,
                quantity: AlreadyExistsData[0]?.quantity + quantity,
              };
              // console.log("EditCartData api call").
              setApiLoading(true);
              try {
                const res = await axios.post(
                  `${BASE_URL}/update-cart`,
                  payload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                        .replace(/\s+/g, " ")
                        .trim(),
                      "Content-Type": "application/json",
                    },
                  }
                );
                setApiLoading(false);
                toast.success("Product updated in cart successfully!");
                if (showVariationModal === true) {
                  setShowVariationModal((prev) => !prev);
                }
                dispatch(AddToCart({ ...res.data, items: res.data.items }));
              } catch (err) {
                console.log("error", err);
              }
            }
          }
        }
        // console.log("open modal and select value");
      } else {
        if (
          product?.variations &&
          product?.variations.length !== 0 &&
          selectedAttributes === 0
        ) {
          setShowVariationModal((prev) => !prev);
          setSelectedProductForModal(product);
          // console.log("open modal")
        } else {
          if (selectedAttributes === null && selectedAttributes !== undefined) {
            // console.log("please select variations");
            toast.error(
              `please select ${
                product?.variations?.map(
                  (i, index) => Object.keys(i?.attributes)[index]
                )[0]
              }`
            );
          } else {
            if (selectedAttributes === undefined) {
              // console.log("please select variations");
              toast.error(
                `please select ${
                  product?.variations?.map(
                    (i, index) => Object.keys(i?.attributes)[index]
                  )[1]
                }`
              );
            } else {
              const payload = {
                product_id: product?.id,
                variation_id:
                  selectedAttributes === 0
                    ? selectedAttributes
                    : selectedAttributes?.id,
                quantity: quantity,
              };
              // console.log("AddtoCartData api call",payload);
              setApiLoading(true);
              try {
                const res = await axios.post(
                  `${BASE_URL}/new-add-to-cart`,
                  payload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                        .replace(/\s+/g, " ")
                        .trim(),
                      "Content-Type": "application/json",
                    },
                  }
                );
                if (showVariationModal === true) {
                  setShowVariationModal((prev) => !prev);
                }
                setApiLoading(false);
                toast.success("Product added to cart successfully!");
                dispatch(
                  AddToCart({
                    ...res.data,
                    items: [...getCartData.items, res.data?.data],
                  })
                );
              } catch (err) {
                console.log("error", err);
              }
            }
          }
        }
      }
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    fetchDisposableProducts(controller);
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <section className="RecentSearch-section">
      <AddToCartModal
        isOpen={showVariationModal}
        onClose={() => setShowVariationModal(false)}
        product={selectedProductForModal}
        onAddToCart={handleAddToCart}
        variations={selectedProductForModal?.variation}
      ></AddToCartModal>
      <div className="container">
        <h2 className="text-white fs-2 text-center section-title">
          Disposable Products
        </h2>
        {apiloading && 
          <Loader2></Loader2>
        }
         <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={2}
            pagination={{ clickable: true }}
            // autoplay="false"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
            className="pt-2 pb-4 pt-sm-3 pt-md-3 pb-md-4 py-lg-3 py-xl-4 disposable-swiper"
          >
            <div className="row py-3 py-md-4">
              {disposableProduct?.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="search-product-card card position-relative">
                      {item.regular_price && item.sale_price && (
                        <span className="discount-badge position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white">
                          Sale{" "}
                          {Math.round(
                            ((item.regular_price - item.sale_price) /
                              item.regular_price) *
                              100
                          )}
                          %
                        </span>
                      )}
                      <Link to={`/products/${item?.slug}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="card-img-top img-fluid"
                        ></img>
                      </Link>

                      <div className="card-body d-flex align-items-center justify-content-between px-2 px-lg-3 px-md-2 py-2">
                        <div className="d-block">
                          <h2 className="product-card-title mb-1">
                            {item.name}
                          </h2>
                          <p className="product-price mb-0">
                            {item.sale_price ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-2">
                                  ₹{Number(item.regular_price).toFixed(2)}
                                </span>
                                <span className="fw-bold text-white">
                                  ₹{Number(item.sale_price).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="fw-bold text-white">
                                ₹{Number(item.price || item.regular_price || "0").toFixed(2)}
                              </span>
                            )}
                          </p>
                        </div>
                        <img
                          className="shopping-bag-icon img-fluid"
                          alt="shopping-bages"
                          src="/img/lightShopping-bag-icon.svg"
                          onClick={(e) => handleAddToCart(e, item, 0, 1)}
                        ></img>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </div>
          </Swiper>
      </div>
    </section>
  );
};

export default DisposableProducts;
