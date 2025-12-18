import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/wishlist.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AddToCartModal } from "../component/AddToCartModal";
import BASE_URL from "../api/config";
import axios from "axios";
import {
  AddToWishlist,
  WishlistCounter,
  wishlistId,
} from "../redux/wishlistSlice";
import { AddToCart,  CartTotal } from "../redux/cartSlice";
import Loader1 from "../component/Loader1";
import useValidateUser from "../component/useValidateUser";

const Wishlist = () => {
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [token] = useState(JSON.parse(localStorage.getItem("auth_token")));
  const wishlistData = useSelector((state) => state?.wishlist?.wishlist);
  const Loading = useSelector((state) => state.wishlist?.loading);
  const cartData = useSelector((state) => state.cart?.cart);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  const validateUser = useValidateUser();


  const wishlistId1 = useSelector((state) => state.wishlist?.wishlistId);

  const handledeleteWishlist = async (filterwishlist, wishlistid, product) => {
    // console.log("deletewishlist", filterwishlist, wishlistId1, [
    //   ...wishlistId1,
    //   product?.product_id,
    // ]);
    // const updatedWishlist = wishlistId1.filter(id => id !== product?.product_id);
    // const filterData = wishlistData.filter((i)=>i.product_id !== product?.product_id)
    // console.log("updatewish",updatedWishlist,"filterData",filterData);
    await axios
      .post(
        `${BASE_URL}/delete-wishlist`,
        { wishlist_id: filterwishlist[0]?.wishlist_id },
        {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("res", res.data);
        const updatedWishlist = wishlistId1.filter(
          (id) => id !== product?.product_id
        );
        const filterData = wishlistData.filter(
          (i) => i.product_id !== product?.product_id
        );
        dispatch(AddToWishlist(filterData));
        dispatch(wishlistId(updatedWishlist));
        dispatch(WishlistCounter(res?.data?.wishlist_count));
      })
      .catch((err) => console.log("err", err));
  };
  const handleDeleteWishlist = async (e, product) => {
    const a = wishlistData?.filter((i) => i.product_id === product?.product_id);

    // console.log("delte", a);
    await axios
      .post(
        `${BASE_URL}/delete-wishlist`,
        { wishlist_id: a[0]?.wishlist_id },
        {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("res", res.data);
        const updatedWishlist = wishlistId1.filter(
          (id) => id !== product?.product_id
        );
        const filterData = wishlistData?.filter(
          (i) => i.product_id !== product?.product_id
        );

        dispatch(AddToWishlist(filterData));
        dispatch(wishlistId(updatedWishlist));
        dispatch(WishlistCounter(res?.data?.wishlist_count));
      })
      .catch((err) => console.log("err", err));
  };
  const handleAddToCart = async (e, product, selectedAttributes, qty) => {
    if (!token) {
      validateUser();
      // toast.error("Please login to add product to wishlist!");
    }
    // console.log("addtoCart",product,"cartData",cartData);
    const filterwishlist = wishlistData?.filter(
      (i) => i?.product_id === product?.product_id
    );
    const filterwishlistId = wishlistId1.includes(product?.product_id);
    // console.log("fil",filterwishlistId,wishlistId1)
    const AlreadyExistsData = cartData?.items.filter((i) => {
      const sizeMatch =
        i?.variation_id !== 0
          ? i?.variation_id === selectedAttributes?.id
          : true && i?.product_id === product?.product_id;
      return sizeMatch;
    });
    // console.log(
    //   "AlreasyExistData",
    //   AlreadyExistsData,
    //   "quantity",
    //   qty,
    //   "selectAttributes",
    //   selectedAttributes
    // );

    if (AlreadyExistsData.length > 0) {
      if (
        product?.variations &&
        product?.variations.length !== 0 &&
        selectedAttributes === 0
      ) {
        // console.log("call addtocart api");
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
          handledeleteWishlist(filterwishlist, filterwishlistId, product);
          const payload = {
            cart_id: AlreadyExistsData[0]?.cart_id,
            quantity: AlreadyExistsData[0]?.quantity + qty,
          };
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
              dispatch(AddToCart({ ...res.data, items: res.data.items }));
            })
            .catch((err) => {
              console.log("error", err);
            });
          console.warn("Edit CartData api call", filterwishlist);
        }
      }
    } else {
      if (
        product?.variations &&
        product?.variations.length !== 0 &&
        selectedAttributes === 0
      ) {
        // console.log("call addtocart api");
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
          handledeleteWishlist(filterwishlist, filterwishlistId, product);
          const payload = {
            product_id: product?.product_id,
            variation_id:
              selectedAttributes === 0
                ? selectedAttributes
                : selectedAttributes?.id,
            quantity: qty,
          };
          // console.log("paylaod", payload, "selecy", selectedAttributes);
          await axios
            .post(`${BASE_URL}/new-add-to-cart`, payload, {
              headers: {
                Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              console.log("res", res.data);
              if (showVariationModal === true) {
                setShowVariationModal((prev) => !prev);
              }
              dispatch(CartTotal(res.data.cart_total));
              // dispatch(CartCounter(res.data.cart_count));
              dispatch(
                AddToCart({
                  ...res.data,
                  items: [...cartData.items, res.data?.data],
                })
              );
            })
            .catch((err) => console.log("error", err));
          console.warn("Add CartData api call");
        }
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 2000);
  }, []);
  return (
    <div className="home-main wishlist-main">
      <section className="Breadcrumbs-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item ">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" >
                <Link to="/wishlist">WishList</Link>
                
              </li>
            </ol>
          </nav>
        </div>
      </section>
      {loading || Loading ? (
        <Loader1></Loader1>
      ) : (
        <>
          {wishlistData?.length === 0 ? (
            <div className="my-5 text-center wishlist-page-empty">
              <p className="mb-3">Your Wishlist Is Empty!</p>
              <Link to="/products" className="mb-2">
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              <section className="wishlist-section">
                <AddToCartModal
                  isOpen={showVariationModal}
                  onClose={() => setShowVariationModal(false)}
                  product={selectedProductForModal}
                  onAddToCart={handleAddToCart}
                  variations={selectedProductForModal?.variation}
                ></AddToCartModal>
                <div className="container">
                  <div className="wishlist-container my-4">
                    <div className="wishlist-header">
                      <h2>Img</h2>
                      <h2>Product</h2>
                      <h2>Price</h2>
                      <h2>Pack Size</h2>
                      <h2>Stock</h2>
                      <h2>Cart</h2>
                    </div>
                    {wishlistData?.map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          <div className="wishlist-item" key={index}>
                            <div className="wishlist-item-wrapper">
                              <div className="wishlist-item-product">
                                <img
                                  src={item?.image}
                                  alt="wishlist-product-img"
                                  width={145}
                                  height={200}
                                  className="wishlist-product-img img-fluid"
                                ></img>
                              </div>
                              <p className="wishlist-item-name mb-1 d-md-none">
                                {item?.name}
                              </p>
                              <p className="wishlist-item-price mb-md-0 mb-1 d-md-none">
                                ₹{Number(item?.price).toFixed(2)}
                              </p>
                              <p className="wishlist-item-pack mb-md-0 mb-4 d-md-none">
                                {item?.short_description}
                              </p>
                            </div>
                            <p className="wishlist-item-name mb-1 d-md-block d-none">
                              {item?.name}
                            </p>
                            <p className="wishlist-item-price mb-md-0 mb-1 d-md-block d-none">
                              ₹{Number(item?.price).toFixed(2)}
                            </p>
                            <p className="wishlist-item-pack mb-md-0 mb-4 d-md-block d-none">
                              {item?.short_description}
                            </p>
                            <button
                              className={`btn wishlist-item-stock ${item.stock}`}
                            >
                              {item?.stock}
                            </button>
                            <button
                              className="btn wishlist-addTocart"
                              onClick={(e) => handleAddToCart(e, item, 0, 1)}
                            >
                              Add to Cart
                            </button>
                            <button
                              className="wishlist-item-remove"
                              onClick={(e) => handleDeleteWishlist(e, item)}
                            >
                              ✕
                            </button>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Wishlist;
