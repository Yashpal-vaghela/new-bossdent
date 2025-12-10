import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../api/config";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/singleproduct.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { Autoplay, Navigation, Pagination, Thumbs,} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ServiceSection } from "../component/ServiceSection";
import { RelatedProducts } from "../component/RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import { AddToCart } from "../redux/cartSlice";
import { AddToWishlist, WishlistCounter, wishlistId} from "../redux/wishlistSlice";
import { AddToCartModal } from "../component/AddToCartModal";
import Loader1 from "../component/Loader1";
import useValidateUser from "../component/useValidateUser";

const SingleProduct = () => {
  const { slug } = useParams();
  const [singleProduct, setSingleProduct] = useState([]);
  const [rating, setRating] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [showQuantity, setShowQuantity] = useState([]);
  const swiperRef = useRef(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState({});
  const [token] = useState(JSON.parse(localStorage.getItem("auth_token")));
  const cartData = useSelector((state) => state?.cart?.cart);
  const wishListData = useSelector((state) => state?.wishlist?.wishlist);
  const wishlistId1 = useSelector((state) => state.wishlist?.wishlistId);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [loading, setloading] = useState(true);
  const validateUser = useValidateUser();

  const a = cartData.length !== 0
      ? cartData?.items.map((i) => {
          return {
            id: i?.variation_id === 0 ? i?.product_id : i?.variation_id,
            quantity: i.quantity,
          };
        })
      : [];
  const b = a.reduce((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {});

  const visibleVariation = loadMore
    ? singleProduct?.variations
    : singleProduct?.variations?.slice(0, 3);
  const dispatch = useDispatch();
  const SingleProductData = async (controller) => {
      setloading(true);
      try {
        const res = await axios.get(`${BASE_URL}/new-product/${slug}`, {
          signal: controller.signal,
        });
        setSingleProduct(res.data?.data);
        setloading(false);
        handleRelatedProducts(controller, res.data.data?.id);
      } catch (err) {
        // setloading(false);
        if (err.name !== "AbortError") console.error(err);
      }
  };
  useEffect(() => {
    const controller = new AbortController();
    SingleProductData(controller);
    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    setQuantity(b);
  }, [cartData]);

  const productImages = [
    { img: "/img/product-img3.png" },
    { img: "/img/singleProduct-img1.png" },
    { img: "/img/singleProduct-img2.png" },
    { img: "/img/singleProduct-img3.png" },
  ];

  const handleQuantity = (e, id, action, item) => {
    // const AlreadyExistData = cartData.items.filter((i, index) => {
    //   return i?.variation_id !== 0
    //     ? typeof id === "object"
    //       ? i?.variation_id === id?.id
    //       : i?.variation_id === id && i?.product_id === singleProduct?.id
    //     : i?.product_id === singleProduct?.id;
    // });
    if (action === "variation") {
      if (!showQuantity.some((i) => i.variation_id === id)) {
        const filterdata = singleProduct?.variations.filter(
          (i) => i?.id === id
        );
        setShowQuantity((prev) => [...prev, ...filterdata]);
        // Initialize quantity for this variation
        // const qty = {...quantity,[id]:currentQty }
        // if(AlreadyExistData.length > 0){
        //   const payload = {
        //     cart_id:AlreadyExistData[0].cart_id,
        //     quantity:typeof id === "object" ? qty[id?.id]: qty[id],
        //   }
        //   console.warn("Edit",payload);
        // }
        // handleAddToCart(singleProduct,id,{...quantity,[id]:quantity},item?.attributes,"PLUS")
        const currentQty = quantity[id] || 1;
        setQuantity((prev) => ({
          ...prev,
          [id]: prev[id] || 1, // start from 1 if not already set
        }));

        if (currentQty < 2) {
          handleAddToCart(
            singleProduct,
            id,
            { ...quantity, [id]: currentQty },
            item?.attributes,
            "PLUS"
          );
        }
      }
    } else {
      const filterData = singleProduct?.id === id;
      setShowQuantity(filterData);
      const currentQty = quantity[id] || 1;
      setQuantity({ ...quantity, [id]: currentQty });
      if (currentQty < 2) {
        handleAddToCart(
          singleProduct,
          id,
          { ...quantity, [id]: currentQty },
          item,
          "PLUS"
        );
      }
    }
  };

  const handleUpdateqty = (e, action, id, singleproduct, item) => {
    e.preventDefault();
    if (singleProduct?.variations && singleProduct?.variations.length > 0) {
      const currentQty = quantity[item?.id] || 1;
      if (action === "PLUS") {
        handleAddToCart(
          singleproduct,
          item,
          { ...quantity, [id]: currentQty + 1 },
          item?.attributes,
          action
        );
        return setQuantity({ ...quantity, [item?.id]: currentQty + 1 });
      } else if (action === "MINUS") {
        if (currentQty > 1) {
          handleAddToCart(
            singleproduct,
            item,
            { ...quantity, [id]: currentQty - 1 },
            item?.attributes,
            action
          );
          return setQuantity({ ...quantity, [item?.id]: currentQty - 1 });
        } else {
          // remove product when quantity < 1
          const updatedShowQuantity = showQuantity.filter(
            (item) => item.id !== id
          );
          setShowQuantity(updatedShowQuantity);
          // handleAddToCart(singleproduct, item,{ ...quantity, [id]: currentQty },item?.attributes);
          const newQuantities = { ...quantity };
          delete newQuantities[id];
          return setQuantity(newQuantities);
        }
      }
    } else {
      const currentQty = quantity[id] || 1;
      if (action === "PLUS") {
        handleAddToCart(
          singleproduct,
          id,
          { ...quantity, [id]: currentQty + 1 },
          0,
          action
        );
        return setQuantity({ ...quantity, [id]: currentQty + 1 });
      } else if (action === "MINUS") {
        if (currentQty > 1) {
          handleAddToCart(
            singleproduct,
            id,
            { ...quantity, [id]: currentQty - 1 },
            0,
            action
          );
          return setQuantity({ ...quantity, [id]: currentQty - 1 });
        } else {
          // handleAddToCart(singleproduct, id, quantity, 0);
          setShowQuantity(false);
          return setQuantity(quantity);
        }
      }
    }
  };

  const handleAddToCart = async ( singleproduct, id, qty, selectattributes, action) => {
    if (!token) {
      validateUser();
    }

    const AlreadyExistingdata = cartData?.items?.filter((i, index) => {
      return i?.variation_id !== 0
        ? (typeof id === "object" ? i?.variation_id === id?.id : i?.variation_id === id) && i?.product_id === singleproduct?.id
        : i?.product_id === singleproduct?.id;
    });
    if (AlreadyExistingdata.length > 0) {
      const payload = {
        cart_id: AlreadyExistingdata[0]?.cart_id,
        quantity: typeof id === "object" ? qty[id?.id] : AlreadyExistingdata[0]?.quantity + qty[id],
      };
      handleEditApi(payload);
    } else {
      const payload = {
        product_id: singleProduct?.id,
        variation_id: typeof id === "object" ? id?.id : id,
        quantity: typeof id === "object" ? qty[id?.id] : qty[id],
      };
      // console.warn("finalAddtoCart", payload, qty);
      handleAddApi(payload);
    }
  };

  const handleWishlist = async (e, product) => {
    if (!token) {
     validateUser();
    }
    const filterWishlistData = wishListData?.filter(
      (i) => i?.product_id === product?.id
    );
    const filterwishlistId = wishlistId1.includes(product?.id);

    if (filterwishlistId) {
      await axios
        .post(
          `${BASE_URL}/delete-wishlist`,
          { wishlist_id: filterWishlistData[0]?.wishlist_id },
          {
            headers: {
              Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const updatedWishlist = wishlistId1.filter(
            (id) => id !== product?.id
          );
          toast.success("Product removed from watchlist successfully.");
          dispatch(AddToWishlist([]));
          dispatch(wishlistId(updatedWishlist));
          dispatch(WishlistCounter(res.data.wishlist_count));
        })
        .catch((err) => console.log("err", err));
    } else {
      console.warn("add wishlist data");
      await axios
        .post(
          `${BASE_URL}/add-wishlist`,
          { product_id: product?.id },
          {
            headers: {
              Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const updatedWishlist = [...wishlistId1, product?.id];
          toast.success("Product add into the wishlist!.");
          dispatch(AddToWishlist(response?.data.wishlist));
          dispatch(wishlistId(updatedWishlist));
          dispatch(WishlistCounter(response?.data?.wishlist_count));
        })
        .catch((error) => console.log("err", error));
    }
  };

  const handleRelatedProducts = async (controller, productId) => {
    await axios
      .get(`${BASE_URL}/related-products?product_id=${productId}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setRelatedProducts(res.data.related_products);
      })
      .catch((err) => {
        console.log("error", err)});
  };

  const handleAddToCartModal = async (e,product,selectedAttributes,quantity,variation = null) => {
    if (!token) {
      validateUser();
    }

    const AlreadyExistsData = cartData?.items?.filter((i) => {
      return i?.variation_id !== 0
        ? i?.variation_id === selectedAttributes?.variation_id
        : true && i?.product_id === product?.id;
    });
    if (AlreadyExistsData.length > 0) {
      if (
        product?.variation &&
        product.variations.length !== 0 &&
        selectedAttributes === 0
      ) {
        console.warn("ProductVariData Edit api call");
        setShowVariationModal((prev) => !prev);
        setSelectedProductForModal(product);
      } else {
        if (selectedAttributes === null && selectedAttributes !== undefined) {
          toast.error(
            `please select ${
              product?.variations?.map(
                (i, index) => Object.keys(i?.attributes)[index]
              )[0]
            }`
          );
        } else {
          const payload = {
            cart_id: AlreadyExistsData[0]?.cart_id,
            quantity: AlreadyExistsData[0]?.quantity + quantity,
          };
          console.warn("EditCartData api call", payload);
          handleEditApi(payload);
        }
      }
    } else {
      if (
        product?.variations &&
        product.variations.length !== 0 &&
        selectedAttributes === 0
      ) {
        setShowVariationModal((prev) => !prev);
        setSelectedProductForModal(product);
      } else {
        if (selectedAttributes === null && selectedAttributes !== undefined) {
          toast.error(
            `please select ${
              product?.variations?.map(
                (i, index) => Object.keys(i?.attributes)[index]
              )[0]
            }`
          );
        } else {
          const payload = {
            product_id: product?.id,
            variation_id:
              selectedAttributes === 0
                ? selectedAttributes
                : selectedAttributes?.variation_id,
            quantity: quantity,
          };
          console.warn("addtocartData api call", payload);
          handleAddApi(payload);
        }
      }
    }
  };

  const handleEditApi = async (payload) => {
    await axios
      .post(`${BASE_URL}/update-cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (showVariationModal === true) {
          setShowVariationModal((prev) => !prev);
        }
        toast.success("Product updated in cart successfully!");
        dispatch(AddToCart({ ...res.data, items: res.data.items }));
      })
      .catch((err) => {
        toast.error("Failed updating cart item:",err)
        console.log("error", err);
      });
  };

  const handleAddApi = async (payload) => {
    await axios
      .post(`${BASE_URL}/new-add-to-cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (showVariationModal === true) {
          setShowVariationModal((prev) => !prev);
        }
        toast.success("Product added to cart successfully!");
        dispatch(
          AddToCart({ ...res.data, items: [...cartData.items, res.data?.data] })
        );
        // dispatch(AddToCart({...res.data,items:cartData.items}))
      })
      .catch((err) => {
        toast.error("Failed to add to cart.");
        console.log("err", err);
      });
  };
  
  return (
    <div className="home-main pt-1 pt-md-4 ">
      <section className="Breadcrumbs-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item ">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item ">
                <Link to="/products">Products</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/products">{slug.split("-").join(" ")}</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      
      {loading  ? (
        <Loader1></Loader1>
      ) : (
        <>
          <section className="single-product-section">
            <AddToCartModal
              isOpen={showVariationModal}
              onClose={() => setShowVariationModal(false)}
              product={selectedProductForModal}
              onAddToCart={handleAddToCartModal}
              variations={selectedProductForModal?.variation}
            ></AddToCartModal>
            <div className="container position-relative">
              <div className="row">
                <div className="card-header d-lg-none align-items-center gap-4 d-flex">
                  {/* <span className="sale-title">
                    Sale <b>50%</b>
                  </span> */}
                   {singleProduct?.regular_price && singleProduct?.sale_price && (
                      <>
                        <span className="sale-title">
                          Sale {Math.round(((singleProduct?.regular_price - singleProduct?.sale_price) / singleProduct?.regular_price) * 100)}%
                        </span>
                        <span className="best-sale-title me-auto">Best Sale</span>
                      </>
                    )}
                 
                  {wishlistId1.includes(singleProduct?.id) ? (
                    <img
                      className="heart-icon img-fluid ms-auto"
                      src="/img/heart-fill-icon.svg"
                      alt="heart-fill-icon"
                      onClick={(e) => handleWishlist(e, singleProduct)}
                    ></img>
                  ) : (
                    <img
                      src="/img/heart-icon.svg"
                      className="heart-icon img-fluid ms-auto"
                      alt="heart-icon"
                      onClick={(e) => handleWishlist(e, singleProduct)}
                    ></img>
                  )}
                </div>
                <Swiper
                  ref={swiperRef}
                  spaceBetween={30}
                  centeredSlides={true}
                  autoplay="false"
                  loop={productImages.length > 1}
                  pagination={{ clickable: true }}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Autoplay, Pagination, Thumbs, Navigation]}
                  className="singleProductSwiper w-100 d-block d-lg-none"
                >
                  {productImages?.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="singleProduct-img-wrapper d-flex h-100 mb-5 align-items-center">
                          <img
                            // src={item?.img}
                            src={singleProduct?.image}
                            className="singleProduct-img  m-auto img-fluid"
                            alt="singleProduct-img"
                          ></img>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                {/* <Swiper
                  onSwiper={(swiper) => setThumbsSwiper(swiper || [])}
                  loop={productImages.length }
                  spaceBetween={20}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="singleProductThumbSwiper w-100 d-block d-lg-none mb-md-4"
                  breakpoints={{
                    576: { slidesPerView: 4, spaceBetween: 0 },
                    768: { slidesPerView: 5, spaceBetween: 15 },
                    992: { slidesPerView: 4 },
                  }}
                >
                  {productImages?.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="singleProduct-img-wrapper d-flex">
                          <img
                            src={item?.img}
                            className="singleProduct-img  m-auto img-fluid"
                            alt="singleProduct-img"
                          ></img>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper> */}
                <div className="col-lg-6 order-lg-1 order-2 ">
                  {singleProduct.length !== 0 ? (
                    <>
                      <div
                        className="card position-sticky"
                        style={{ top: "80px" }}
                      >
                        <div className="card-header d-lg-flex align-items-center gap-4 d-none ">
                          {/* <span className="sale-title">
                            Sale <b>50%</b>
                          </span> */}
                          {singleProduct?.regular_price && singleProduct?.sale_price && (
                            <>
                              <span className="sale-title">
                                Sale <b>{Math.round(((singleProduct?.regular_price - singleProduct?.sale_price) / singleProduct?.regular_price) * 100)}%</b>
                              </span>
                              <span className="best-sale-title me-auto">
                                Best Sale
                              </span>
                            </>
                          )}
                        
                          {wishlistId1.includes(singleProduct?.id) ? (
                            <img
                              className="heart-icon img-fluid ms-auto"
                              src="/img/heart-fill-icon.svg"
                              alt="heart-fill-icon"
                              onClick={(e) => handleWishlist(e, singleProduct)}
                            ></img>
                          ) : (
                            <img
                              src="/img/heart-icon.svg"
                              className="heart-icon img-fluid ms-auto"
                              alt="heart-icon"
                              onClick={(e) => handleWishlist(e, singleProduct)}
                            ></img>
                          )}
                        </div>
                        <div className="card-body">
                          <Swiper
                            ref={swiperRef || null}
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay="false"
                            loop={productImages.length > 1}
                            pagination={{ clickable: true }}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[Autoplay, Pagination, Thumbs, Navigation]}
                            className="singleProductSwiper w-100 d-none d-lg-block"
                          >
                            {productImages?.map((item, index) => {
                              return (
                                <SwiperSlide key={index}>
                                  <div className="singleProduct-img-wrapper d-flex">
                                    <img
                                      // src={item?.img}
                                      src={singleProduct?.image}
                                      className="singleProduct-img  m-auto img-fluid"
                                      alt="singleProduct-img"
                                    ></img>
                                  </div>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                          {/* <Swiper
                            // onSwiper={setThumbsSwiper}
                            onSwiper={(swiper) => setThumbsSwiper(swiper || [])}
                            loop={productImages.length > 4}
                            spaceBetween={20}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="singleProductThumbSwiper w-100 d-none d-lg-block"
                            breakpoints={{
                              768: { slidesPerView: 5, spaceBetween: 15 },
                              992: { slidesPerView: 4 },
                            }}
                          >
                            {productImages?.map((item, index) => {
                              return (
                                <SwiperSlide key={index}>
                                  <div className="singleProduct-img-wrapper d-flex">
                                    <img
                                      src={item?.img}
                                      className="singleProduct-img  m-auto img-fluid"
                                      alt="singleProduct-img"
                                    ></img>
                                  </div>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper> */}
                          <div className="singleProduct-info-wrapper">
                            <div className="review-content">
                              <select className="form-select my-3">
                                <option>Packaging</option>
                                <option>200</option>
                                <option>300</option>
                                <option>400</option>
                              </select>
                              <h3 className="review-title">
                                Ratings & Reviews
                              </h3>
                              <div className="review-box d-flex  align-items-center">
                                <label className="form-label mb-0">
                                  <i className="fa-solid fa-star"></i>{" "}
                                  {singleProduct?.average_rating}{" "}
                                </label>
                                <select className="form-select">
                                  <option>5 Reviews</option>
                                </select>
                              </div>
                              <form>
                                <div className="rating-stars">
                                  {[...Array(5)].map((_, index) => (
                                    <i
                                      className={
                                        rating > index
                                          ? "fa-solid fa-star filled"
                                          : "fa-solid fa-star"
                                      }
                                      key={index}
                                    ></i>
                                  ))}
                                </div>
                                <input
                                  className="form-control review-input mt-0 mb-3"
                                  type="text"
                                  placeholder="Enter your feedback"
                                  required
                                ></input>
                                <button className="btn btn-submit-review mt-3">
                                  Submit Review
                                </button>
                              </form>
                            </div>
                            <button
                              className="btn btn-buyNow mt-5 w-100"
                              onClick={handleAddToCart}
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-lg-6 order-lg-2 order-1 mt-3 mt-sm-0">
                  {singleProduct?.variations &&
                    visibleVariation?.map((item, index) => {
                      return (
                        <div
                          className="single-variation-wrapper mb-3 mb-md-4"
                          key={index}
                        >
                          <h3>
                            {singleProduct?.sku}{" "}
                            {Object.values(item?.attributes)[0]}
                          </h3>
                          <div className="row single-variation-info align-items-end justfiy-content-center">
                            <div className="col-lg-8 col-md-6 col-6">
                              {singleProduct?.short_description && (
                                <p>
                                  Pack Size:{" "}
                                  <b>
                                    {singleProduct?.short_description.replace(
                                      /<\/?p>/g,
                                      ""
                                    )}
                                  </b>
                                </p>
                              )}
                              <p>
                                Category:
                                {singleProduct?.categories?.map(
                                  (cat, index) => {
                                    return <b key={index}>{cat}, </b>;
                                  }
                                )}
                              </p>
                              <p>
                                Stock Status:{" "}
                                <b>{singleProduct?.stock_status}</b>
                              </p>
                            </div>
                            <div className="col-lg-4 col-md-6 col-6 px-1">
                              <div
                                className={`d-flex align-items-center  ${
                                  Object.keys(item?.attributes)[1]
                                    ? "mb-3 justify-content-end"
                                    : "mb-2 justify-content-end"
                                }`}
                              >
                                <p className="text-end mb-0">
                                  {Object.keys(item?.attributes)[0]}:{" "}
                                  <b>{Object.values(item?.attributes)[0]}</b>
                                </p>
                                &nbsp;
                              </div>
                              {showQuantity.some((i) => i.id === item?.id) ? (
                                <>
                                  <div className="singleProduct-quantity vari">
                                    <button
                                      onClick={(e) =>
                                        handleUpdateqty(
                                          e,
                                          "MINUS",
                                          item?.id,
                                          singleProduct,
                                          item
                                        )
                                      }
                                    >
                                      -
                                    </button>
                                    <span>{quantity[item?.id] || 1}</span>
                                    <button
                                      onClick={(e) =>
                                        handleUpdateqty(
                                          e,
                                          "PLUS",
                                          item?.id,
                                          singleProduct,
                                          item
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <button
                                  className="btn btn-addToCart me-0 ms-auto d-flex align-items-center justify-content-between"
                                  onClick={(e) =>
                                    handleQuantity(
                                      e,
                                      item?.id,
                                      "variation",
                                      item
                                    )
                                  }
                                >
                                  Add To Cart
                                  <div className="cart-icon">
                                    <img
                                      src="/img/cart-icon.svg"
                                      className="img-fluid"
                                      alt="cart-icon"
                                    />
                                  </div>
                                </button>
                              )}
                            </div>
                            <p>
                              Price:&nbsp;
                              {item?.sale_price !== null &&
                              item?.sale_price === item?.regular_price ? (
                                <>
                                  <b className="text-decoration-line-through">
                                    ₹{Number(item?.regular_price).toFixed(2)}
                                  </b>
                                  &nbsp;
                                  <b className="fw-bold">
                                    ₹{Number(item?.sale_price).toFixed(2)}
                                  </b>
                                </>
                              ) : (
                                <b className="fw-bold">
                                  ₹{Number(item?.price).toFixed(2)}
                                </b>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  {singleProduct?.type === "simple" && (
                    <>
                      <div className="single-variation-wrapper mb-3">
                        <h3>{singleProduct?.name}</h3>
                        <div className="row single-variation-info align-items-end justify-content-center">
                          <div className="col-lg-8 col-md-6 col-6">
                            {singleProduct?.short_description && (
                              <p>
                                Pack Size:{" "}
                                <b>
                                  {singleProduct?.short_description.replace(
                                    /<\/?p>/g,
                                    ""
                                  )}
                                </b>
                              </p>
                            )}
                            <p>
                              Category:
                              {singleProduct?.categories?.map((cat, index) => {
                                return <b key={index}>{cat}, </b>;
                              })}
                            </p>
                            <p>
                              Stock Status: <b>{singleProduct?.stock_status}</b>
                            </p>
                             <p>
                              Price:&nbsp;
                              {singleProduct?.sale_price !== null &&
                              singleProduct?.sale_price === singleProduct?.regular_price ? (
                                <>
                                  <b className="text-decoration-line-through">
                                    ₹{Number(singleProduct?.regular_price).toFixed(2)}
                                  </b>
                                  &nbsp;
                                  <b className="fw-bold">
                                    ₹{Number(singleProduct?.sale_price).toFixed(2)}
                                  </b>
                                </>
                              ) : (
                                <b className="fw-bold">
                                  ₹{Number(singleProduct?.price).toFixed(2)}
                                </b>
                              )}
                            </p>
                          </div>
                          <div className="col-lg-4 col-md-6 col-6 px-1">
                            {showQuantity === true ? (
                              <>
                                <div className="singleProduct-quantity withvar">
                                  <button
                                    onClick={(e) =>
                                      handleUpdateqty(
                                        e,
                                        "MINUS",
                                        singleProduct.id,
                                        singleProduct,
                                        0
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <span>{quantity[singleProduct.id]} </span>
                                  <button
                                    onClick={(e) =>
                                      handleUpdateqty(
                                        e,
                                        "PLUS",
                                        singleProduct.id,
                                        singleProduct,
                                        0
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-addToCart me-0 ms-auto d-flex align-items-center justify-content-between"
                                  onClick={(e) =>
                                    handleQuantity(
                                      e,
                                      singleProduct?.id,
                                      "without-variation",
                                      0
                                    )
                                  }
                                >
                                  Add To Cart
                                  <div className="cart-icon">
                                    <img
                                      src="/img/cart-icon.svg"
                                      className="img-fluid"
                                      alt="cart-icon"
                                    />
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {singleProduct?.variations !== null &&
                    singleProduct?.variations !== undefined &&
                    (loadMore === true ? (
                      <button
                        className="btn btn-loadMore mb-4 d-block m-auto"
                        onClick={() => setLoadMore((prev) => !prev)}
                      >
                        <i className="fa-solid fa-angles-up"></i>
                      </button>
                    ) : (
                      <button
                        className="btn btn-loadMore mb-4 d-block m-auto"
                        onClick={() => setLoadMore((prev) => !prev)}
                      >
                        <i className="fa-solid fa-angles-down"></i>
                      </button>
                    ))}
                  <div
                    className="single-variation-description-wrapper accordion"
                    id="accordionExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          Description
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        {singleProduct?.description && (
                          <div className="accordion-body">
                            {singleProduct?.description.replace(/<\/?p>/g, "")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <ServiceSection></ServiceSection>
          <RelatedProducts
            relatedproducts={relatedProducts}
            handleWishlist={handleWishlist}
            wishlistId1={wishlistId1}
            handleQuantity={handleQuantity}
            handleAddToCartModal={handleAddToCartModal}
          ></RelatedProducts>
        </>
      )}
    </div>
  );
};

export default SingleProduct;