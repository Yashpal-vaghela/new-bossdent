import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../api/config";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/singleproduct.css";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ServiceSection } from "../component/ServiceSection";
import { RelatedProducts } from "../component/RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import { AddToCart } from "../redux/cartSlice";
import {
  AddToWishlist,
  WishlistCounter,
  wishlistId,
} from "../redux/wishlistSlice";
import { AddToCartModal } from "../component/AddToCartModal";
import useValidateUser from "../component/useValidateUser";
import Loader2 from "../component/Loader2";
import { ContactModal } from "../component/ContactModal";

const SingleProduct = () => {
  const { slug } = useParams();
  const [singleProduct, setSingleProduct] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [showQuantity, setShowQuantity] = useState([]);
  const [quantity, setQuantity] = useState({});
  const token = useSelector((state) => state.auth.token);
  const cartData = useSelector((state) => state?.cart?.cart);
  const wishListData = useSelector((state) => state?.wishlist?.wishlist);
  const wishlistId1 = useSelector((state) => state.wishlist?.wishlistId);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [loading, setloading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [apiloading, setApiLoading] = useState(false);
  const validateUser = useValidateUser();
  const navigate = useNavigate();

  const a =
    cartData.length !== 0
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
      if (err.name !== "AbortError") console.error(err);
    }
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const controller = new AbortController();
    SingleProductData(controller);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (token === "null" || !token) {
      setQuantity(b);
    }
  }, [cartData]);

  const handleShowQuantity = () => {
    setShowQuantity([]);
  };
  const handleQuantity = (e, id, action, item, product) => {
    console.log("id", id, action, item, product);
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to product add to cart!");
    } else {
      if (product?.stock_status !== "outofstock") {
        if (action === "variation") {
          if (!showQuantity.some((i) => i.variation_id === id)) {
            const filterdata = singleProduct?.variations.filter(
              (i) => i?.id === id
            );
            const currentQty = quantity[id] || 1;
            setQuantity((prev) => ({
              ...prev,
              [id]: prev[id] || 1, // start from 1 if not already set
            }));
            setShowQuantity((prev) => [...prev, ...filterdata]);
            // console.log("cur",currentQty,filterdata,"showQUn",showQuantity)
            // handleCardError("without-error");
            if (currentQty < 2) {
              handleAddToCart(
                singleProduct,
                id,
                { ...quantity, [id]: currentQty },
                item?.attributes,
                "PLUS"
              );
            }
            // else{
            //   handleAddToCart(singleProduct,id,{...quantity,[id]:currentQty+quantity},item?.attributes,"PLUS")
            // }
          }
        } else {
          if (product?.id !== 4070) {
            const filterData = singleProduct?.id === id;
            setShowQuantity(filterData);
            const currentQty = quantity[id] || 1;
            setQuantity({ ...quantity, [id]: currentQty });
            // console.log("cur",currentQty,filterData,"showQUn",showQuantity)
            // handleCardError("without-error");
            if (currentQty < 2) {
              handleAddToCart(
                singleProduct,
                id,
                { ...quantity, [id]: currentQty },
                item,
                "PLUS"
              );
            }
          } else {
            setShowContactModal((prev) => !prev);
          }
        }
      }else{
        toast.error(`${product?.sku} is outofstock`)
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
        handleCardError("without-error");
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
          handleCardError("without-error");
          return setQuantity({ ...quantity, [item?.id]: currentQty - 1 });
        } else {
          // remove product when quantity < 1
          const updatedShowQuantity = showQuantity.filter(
            (item) => item.id !== id
          );
          setShowQuantity(updatedShowQuantity);
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
          setShowQuantity(false);
          return setQuantity(quantity);
        }
      }
    }
  };

  const handleAddToCart = async (
    singleproduct,
    id,
    qty,
    selectattributes,
    action
  ) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to product add to cart!");
    } else {
      const AlreadyExistingdata = cartData?.items?.filter((i, index) => {
        return i?.variation_id !== 0
          ? (typeof id === "object"
              ? i?.variation_id === id?.id
              : i?.variation_id ===
                (Object.keys(selectattributes).length !== 0
                  ? id
                  : selectattributes)) && i?.product_id === singleproduct?.id
          : i?.product_id === singleproduct?.id;
      });
      // console.log(
      //   "singleProduct",
      //   singleProduct,
      //   id,
      //   qty,
      //   selectattributes,
      //   action,
      //   "Already",
      //   AlreadyExistingdata,
      //   showQuantity
      // );
      if (AlreadyExistingdata.length > 0) {
        const payload = {
          cart_id: AlreadyExistingdata[0]?.cart_id,
          quantity:
            typeof id === "object" ? qty[id?.id] : AlreadyExistingdata[0]?.quantity ?  AlreadyExistingdata[0]?.quantity + 1 
              : qty[id]
        };
        // console.log("payload",payload,typeof id);
        handleEditApi(payload);
        // if (showQuantity.length !== 0) {
        //   handleEditApi(payload);
        // }
      } else {
        // console.log("sel",Object.keys(selectattributes) )
        const payload = {
          product_id: singleProduct?.id,
          variation_id:
            Object.keys(selectattributes).length !== 0
              ? typeof id === "object"
                ? id?.id
                : id
              : selectattributes,
          quantity: typeof id === "object" ? qty[id?.id] : qty[id],
        };
        handleAddApi(payload);
      }
      // if (action === "/checkout") {
      //   navigate(`${action}`);
      //   if (cartData?.items?.length === 0) {
      //     toast.error("Your cart is empty!");
      //   }
      // }
    }
  };

  const handleWishlist = async (e, product) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to add product to wishlist!");
    } else {
      const filterWishlistData = wishListData?.filter(
        (i) => i?.product_id === product?.id
      );
      const filterwishlistId = wishlistId1.includes(product?.id);

      if (filterwishlistId) {
        setApiLoading(true);
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
            setApiLoading(false);
            const updatedWishlist = wishlistId1.filter(
              (id) => id !== product?.id
            );
            toast.success("Product removed from wishlist successfully.");
            dispatch(AddToWishlist([]));
            dispatch(wishlistId(updatedWishlist));
            dispatch(WishlistCounter(res.data.wishlist_count));
          })
          .catch((err) => console.log("err", err));
      } else {
        console.warn("add wishlist data");
        setApiLoading(true);
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
            setApiLoading(false);
            const updatedWishlist = [...wishlistId1, product?.id];
            toast.success("Product add into the wishlist!.");
            dispatch(AddToWishlist(response?.data.wishlist));
            dispatch(wishlistId(updatedWishlist));
            dispatch(WishlistCounter(response?.data?.wishlist_count));
          })
          .catch((error) => console.log("err", error));
      }
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
        console.log("error", err);
      });
  };

  const handleAddToCartModal = async (
    e,
    product,
    selectedAttributes,
    quantity,
    variation = null,
    action
  ) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to product add to cart!");
    } else {
      const AlreadyExistsData = cartData?.items?.filter((i) => {
        return i?.variation_id !== 0
          ? i?.variation_id === selectedAttributes?.variation_id
          : true && i?.product_id === product?.id;
      });
      if (
        product?.variations &&
        product.variations.length !== 0 &&
        selectedAttributes === 0
      ) {
        setShowVariationModal((prev) => !prev);
        setSelectedProductForModal(product);
      } else {
        if (selectedAttributes === null && selectedAttributes !== undefined) {
          handleCardModalError("error");
           toast.error(
              `please select ${
                product?.variations?.map(
                  (i, index) => Object.keys(i?.attributes)[index]
                )[0]
              }`
            );
        } else {
          if (AlreadyExistsData.length > 0) {
            const payload = {
              cart_id: AlreadyExistsData[0]?.cart_id,
              quantity: AlreadyExistsData[0]?.quantity + quantity,
            };
            console.warn("EditCartData api call", payload);
            handleEditApi(payload);
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
    }
  };

  const handleEditApi = async (payload) => {
    setApiLoading(true);
    await axios
      .post(`${BASE_URL}/update-cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setApiLoading(false);
        if (showVariationModal === true) {
          setShowVariationModal((prev) => !prev);
        }
        toast.success("Product updated in cart successfully!");
        dispatch(AddToCart({ ...res.data, items: res.data.items }));
      })
      .catch((err) => {
        toast.error("Failed updating cart item:", err);
        console.log("error", err);
      });
  };

  const handleAddApi = async (payload) => {
    setApiLoading(true);
    await axios
      .post(`${BASE_URL}/new-add-to-cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setApiLoading(false);
        if (showVariationModal === true) {
          setShowVariationModal((prev) => !prev);
        }
        toast.success("Product added to cart successfully!");
        dispatch(
          AddToCart({ ...res.data, items: [...cartData.items, res.data?.data] })
        );
      })
      .catch((err) => {
        toast.error("Failed to add to cart.");
        console.log("err", err);
      });
  };
  const handleCheckout = (e, product, id, qty) => {
    // console.log("e", e, product, id, qty);
    if (product.variations !== null) {
      handleCardError("error");
    } else {
      handleCardError("without-error");
      if (id !== 4070) {
        handleAddToCart(product, id, qty, 0);
        setTimeout(() => {
          navigate("/checkout");
        }, 1000);
        // console.log("addtocart");
      } else {
        setShowContactModal((prev) => !prev);
      }
    }
  };
  const handleCardError = (action) => {
    //  const card = document.getElementsByClassName("single-variation-wrapper");
    const card1 = document.querySelectorAll(".btn-addToCart");
    // console.log("set error to select variations", card1, action);
    if (action === "error") {
      // console.log("card1", card1);
      card1.forEach((i) => {
        i.style.border = "1.4px solid red";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    } else if (action === "without-error") {
      card1.forEach((i) => {
        i.style.border = "1.4px solid rgba(239, 239, 239, 1)";
      });
    }
  };
  const handleCardModalError = (action) => {
    const card1 = document.querySelectorAll(".modal-variation-select");
    // console.log("set error to select variations", card1, action);
    if (action === "error") {
      // console.log("card1", card1);
      card1.forEach((i) => {
        i.style.border = "1.4px solid red";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    } else if (action === "without-error") {
      card1.forEach((i) => {
        i.style.border = "1.4px solid rgba(239, 239, 239, 1)";
      });
    }
  };

  return (
    <div className="home-main pt-0  pt-lg-0">
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
      {apiloading && <Loader2></Loader2>}
      {loading ? (
        <Loader2></Loader2>
      ) : (
        <>
          <section className="single-product-section">
            <AddToCartModal
              isOpen={showVariationModal}
              onClose={() => setShowVariationModal(false)}
              product={selectedProductForModal}
              onAddToCart={handleAddToCartModal}
              variations={selectedProductForModal?.variation}
              handleCardModalError={handleCardModalError}
            ></AddToCartModal>
            <div className="container position-relative">
              <div className="row">
                <div className="card-header d-lg-none align-items-center gap-4 d-flex">
                  {singleProduct?.regular_price &&
                    singleProduct?.sale_price && (
                      <>
                        <span className="sale-title">
                          Sale{" "}
                          {Math.round(
                            ((singleProduct?.regular_price -
                              singleProduct?.sale_price) /
                              singleProduct?.regular_price) *
                              100
                          )}
                          %
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
                <div className="singleProduct-img-wrapper d-flex  d-lg-none h-100 mb-2 align-items-center">
                  <img
                    src={singleProduct?.image}
                    className="singleProduct-img  m-auto img-fluid"
                    alt="singleProduct-img"
                  ></img>
                </div>
                <div className="col-lg-6 order-lg-1 order-2 ">
                  {singleProduct.length !== 0 ? (
                    <>
                      <div
                        className="card position-sticky"
                        style={{ top: "80px" }}
                      >
                        <div className="card-header d-lg-flex align-items-center gap-4 d-none ">
                          {singleProduct?.regular_price &&
                            singleProduct?.sale_price && (
                              <>
                                <span className="sale-title">
                                  Sale{" "}
                                  <b>
                                    {Math.round(
                                      ((singleProduct?.regular_price -
                                        singleProduct?.sale_price) /
                                        singleProduct?.regular_price) *
                                        100
                                    )}
                                    %
                                  </b>
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
                          <div className="singleProduct-img-wrapper d-none d-lg-flex h-100 mb-5 align-items-center">
                            <img
                              src={singleProduct?.image}
                              className="singleProduct-img  m-auto img-fluid"
                              alt="singleProduct-img"
                            ></img>
                          </div>

                          <div className="singleProduct-info-wrapper">
                            <button
                              className="btn btn-buyNow mt-3 w-100"
                              // onClick={(e) => {
                              //   navigate("/checkout");
                              //   handleAddToCart(
                              //     e,
                              //     singleProduct,
                              //     singleProduct?.id,
                              //     quantity,
                              //     "/checkout"
                              //   );
                              // }}
                              onClick={(e) =>
                                handleCheckout(
                                  e,
                                  singleProduct,
                                  singleProduct?.id,
                                  quantity
                                )
                              }
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
                <div
                  className="col-lg-6 order-lg-2 order-1 mt-3 mt-sm-0"
                  id="singleCardWrapper"
                >
                  {singleProduct?.variations &&
                    visibleVariation?.map((item, index) => {
                      console.log("item",item)
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
                                    {/* {singleProduct?.short_description.replace(
                                      /<\/?(p|ul|li)>/g,
                                      ""
                                    )}, */}
                                    {singleProduct.short_description
                                      .replace(/<\/li>\s*<li>/g, ", ")
                                      .replace(/<\/?(p|ul|li)>/g, "")}
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
                                <b>{item?.stock_status}</b>
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
                                  {Object.keys(item?.attributes)[0].replace(
                                    /pa_|attribute_/,
                                    ""
                                  )}
                                  : <b>{Object.values(item?.attributes)[0]}</b>
                                </p>
                                &nbsp;
                              </div>
                              {Array.isArray(showQuantity) && (
                                <>
                                  {showQuantity.some(
                                    (i) => i.id === item?.id
                                  ) ? (
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
                                        {/* {console.log("qun---", quantity)} */}
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
                                      className={`btn btn-addToCart me-0 ms-auto d-flex align-items-center justify-content-between ${singleProduct.stock_status}`}
                                      onClick={(e) =>
                                        handleQuantity(
                                          e,
                                          item?.id,
                                          "variation",
                                          item,
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
                                </>
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
                              singleProduct?.sale_price ===
                                singleProduct?.regular_price ? (
                                <>
                                  <b className="text-decoration-line-through">
                                    ₹
                                    {Number(
                                      singleProduct?.regular_price
                                    ).toFixed(2)}
                                  </b>
                                  &nbsp;
                                  <b className="fw-bold">
                                    ₹
                                    {Number(singleProduct?.sale_price).toFixed(
                                      2
                                    )}
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
                            {/* {console.log("qun", quantity)} */}
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
                                  className={`btn btn-addToCart me-0 ms-auto d-flex align-items-center justify-content-between ${singleProduct?.stock_status}`}
                                  onClick={(e) =>
                                    handleQuantity(
                                      e,
                                      singleProduct?.id,
                                      "without-variation",
                                      0,
                                      singleProduct
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
                  {/* {console.log("vi",visibleVariation > 3,singleProduct)} */}
                  {singleProduct?.variations !== null &&
                    singleProduct?.variations !== undefined &&
                    singleProduct?.variations.length > 3 &&
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
            handleShowQuantity={handleShowQuantity}
          ></RelatedProducts>
          <ContactModal
            isOpen={showContactModal}
            setOpen={setShowContactModal}
          ></ContactModal>
        </>
      )}
    </div>
  );
};

export default SingleProduct;
