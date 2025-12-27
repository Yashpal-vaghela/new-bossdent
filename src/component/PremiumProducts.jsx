import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../api/config";
import { Link } from "react-router-dom";
import { AddToCartModal } from "./AddToCartModal";
import useValidateUser from "./useValidateUser";
import { toast } from "react-toastify";
import { AddToCart } from "../redux/cartSlice";
import { useSelector } from "react-redux";
import {
  AddToWishlist,
  WishlistCounter,
  wishlistId,
} from "../redux/wishlistSlice";
import Loader2 from "./Loader2";

const PremiumProducts = ({ token, getCartData, dispatch }) => {
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiloading,setApiLoading] = useState(false);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const wishlistData = useSelector((state) => state?.wishlist?.wishlist);
  const wishlistId1 = useSelector((state) => state.wishlist?.wishlistId);
  const validateUser = useValidateUser();

  const fetchPremiumProducts = async (controller) => {
    try {
      const response = await axios.get(`${BASE_URL}/category/premium-product`, {
        signal: controller.signal,
      });
      const product = response.data?.data || [];
      setPremiumProducts(product);
    } catch (error) {
      console.error("Error fetching the Premium Products:", error);
    } finally {
      setLoading(false);
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
      toast.error("Please login to add to cart product!")
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
              setApiLoading(true);
              // console.log("EditCartData api call")
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
      } else {
        if (
          product?.variations &&
          product?.variations.length !== 0 &&
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
                product_id: product?.id,
                variation_id:
                  selectedAttributes === 0
                    ? selectedAttributes
                    : selectedAttributes?.id,
                quantity: quantity,
              };
              setApiLoading(true);
              // console.log("AddtoCartData api call",payload);
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

  const handleAddToWishlist = async (e, product) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to add product to wishlist!")
    } else {
      const FilterCartData = wishlistData?.filter(
        (i) => i?.product_id === product?.id
      );
      const filterwishlistId = wishlistId1.includes(product?.id);
      if (filterwishlistId) {
        setApiLoading(true);
        // console.log("update wishlist add remove wishlist data");
        await axios
          .post(
            `${BASE_URL}/delete-wishlist`,
            { wishlist_id: FilterCartData[0]?.wishlist_id },
            {
              headers: {
                Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            setApiLoading(false);
            toast.success("Product removed form wishlist");
            const updatedWishlist = wishlistId1.filter(
              (id) => id !== product?.id
            );
            dispatch(wishlistId(updatedWishlist));
            dispatch(WishlistCounter(res.data.wishlist_count));
          })
          .catch((err) => console.log("err", err));
      } else {
        setApiLoading(true);
        // console.log("add wishlist data");
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
            toast.success("Product added to wishlist!");
            const updatedWishlist = [...wishlistId1, product?.id];
            dispatch(AddToWishlist(response?.data.wishlist));
            dispatch(wishlistId(updatedWishlist));
            dispatch(WishlistCounter(response.data.wishlist_count));
          })
          .catch((err) => console.log("err", err));
      }
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    fetchPremiumProducts(controller);
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <section className="premium-products-section">
      <AddToCartModal
        isOpen={showVariationModal}
        onClose={() => setShowVariationModal(false)}
        product={selectedProductForModal}
        onAddToCart={handleAddToCart}
        variations={selectedProductForModal?.variation}
      ></AddToCartModal>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-white fs-2 section-title">
            Exclusive Premium Products
          </h2>
          <button className="btn btn-default txt-grident btn-view">
            <Link to={`/products?category=premium-product`}>
               view All
            <i className="fa-solid fa-arrow-right" />
            </Link>
          </button>
        </div>
        {apiloading && <Loader2></Loader2>}
        {loading ? (
          <p className="text-light text-center mt-4">
            Loading premium products...
          </p>
        ) : premiumProducts.length === 0 ? (
          <p className="text-light text-center mt-4">
            No premium products available.
          </p>
        ) : (
          <div className="grid-container my-3 mt-md-2 mb-md-2">
            <div className="grid-item big card position-relative">
              {premiumProducts[6]?.regular_price &&
                premiumProducts[6]?.sale_price && (
                  <span className="discount-badge position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white">
                    Sale{" "}
                    {Math.round(
                      ((premiumProducts[6]?.regular_price -
                        premiumProducts[6]?.sale_price) /
                        premiumProducts[6]?.regular_price) *
                        100
                    )}
                    %
                  </span>
                )}
              <Link to={`/products/${premiumProducts[6]?.slug}`}>
                <img
                  src={premiumProducts[6]?.image}
                  className="img-fluid"
                  alt={premiumProducts[6]?.name}
                ></img>
              </Link>

              <div className="product-cart-wrapper d-flex justify-content-between w-100 align-items-center">
                {wishlistId1.includes(premiumProducts[6]?.id) ? (
                  <img
                    src="/img/heart-fill-icon1.svg"
                    className="heart-icon img-fluid"
                    alt="heart-icon"
                    onClick={(e) => handleAddToWishlist(e, premiumProducts[6])}
                  ></img>
                ) : (
                  <img
                    src="/img/heart-icon.svg"
                    className="heart-icon img-fluid"
                    alt="heart-icon"
                    onClick={(e) => handleAddToWishlist(e, premiumProducts[6])}
                  ></img>
                )}
                <button
                  className="btn btn-default"
                  onClick={(e) => handleAddToCart(e, premiumProducts[6], 0, 1)}
                >
                  Add to Cart
                  <img
                    src="/img/shopping-bag-icon.svg"
                    className="img-fluid"
                    alt="shopping-bag-icon"
                  ></img>
                </button>
                {/* <img
                  src="/img/eye-icon.svg"
                  className="eye-icon img-fluid"
                  alt="eye-icon"
                ></img> */}
              </div>
              <h2 className="product-card-title txt-grident">
                {premiumProducts[6]?.name}
              </h2>
              <h3 className="product-price">
                {premiumProducts[6]?.sale_price ? (
                  <>
                    <span className="text-muted text-decoration-line-through me-2">
                      ₹{Number(premiumProducts[6]?.regular_price).toFixed(2)}
                    </span>
                    <span className="fw-bold text-white">
                      ₹{Number(premiumProducts[6]?.sale_price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="fw-bold text-white">
                    ₹
                    {Number(premiumProducts[6]?.price ||
                      premiumProducts[6]?.regular_price ||
                      "0").toFixed(2)}
                  </span>
                )}
              </h3>
            </div>
            {premiumProducts.slice(0, 11).map((item, index) => (
              <div className="grid-item card position-relative" key={index}>
                {item?.regular_price && item?.sale_price && (
                  <span className="discount-badge position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white">
                    Sale{" "}
                    {Math.round(
                      ((item?.regular_price - item?.sale_price) /
                        item?.regular_price) *
                        100
                    )}
                    %
                  </span>
                )}
                <Link to={`/products/${item?.slug}`}>
                  <img
                    src={item?.image}
                    className="product-img img-fluid"
                    alt={item?.name}
                  />
                </Link>
                <div className="product-card-wrapper d-flex align-items-center justify-content-between w-100 h-auto">
                  <div className="d-block">
                    <h2 className="product-card-title mb-0">{item?.name}</h2>
                    <p className="product-price mb-1">
                      {item?.sale_price ? (
                        <>
                          <span className="text-muted text-decoration-line-through me-2">
                            ₹{Number(item?.regular_price).toFixed(2)}
                          </span>
                          <span className="fw-bold text-white">
                            ₹{Number(item?.sale_price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="fw-bold text-white">
                          ₹{Number(item?.price || item?.regular_price || "0").toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                  <img
                    src="/img/lightShopping-bag-icon.svg"
                    className="shopping-bag-icon img-fluid"
                    alt="shopping-bag"
                    onClick={(e) => handleAddToCart(e, item, 0, 1)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PremiumProducts;
