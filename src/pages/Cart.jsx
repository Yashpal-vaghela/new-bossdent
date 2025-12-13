import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../api/config";
// import Loader1 from "../component/Loader1";
import { AddToCart, CartCounter, CartTotal } from "../redux/cartSlice";
import useValidateUser from "../component/useValidateUser";
import { toast } from "react-toastify";

const Cart = () => {
  const [token] = useState(JSON.parse(localStorage.getItem("auth_token")));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState("");
  const cartTotal = useSelector((state) => state.cart.cartTotal);
  const cartData = useSelector((state) => state.cart.cart);
  const deliverydata = useSelector((state) => state.cart.deliveryCharge);
  const validateUser = useValidateUser();
  const handleClearCart = async () => {
    setloading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    await axios
      .post(
        `${BASE_URL}/delete-cart`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setloading(false);
        dispatch(AddToCart({ ...res.data, items: [] }));
        dispatch(CartCounter(res.data.cart_count));
        dispatch(CartTotal(res.data.cart_total));
      })
      .catch((err) => console.log("err", err));
  };
  const handledeleteCart = async (e, id) => {
    const payload = { cart_id: id };
    await axios
      .post(`${BASE_URL}/delete-cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const filterData = cartData?.items.filter(
          (item) => item.cart_id !== id
        );
        dispatch(AddToCart({ ...res.data, items: filterData }));
        dispatch(CartCounter(res.data.cart_count));
        dispatch(CartTotal(res.data.cart_total));
      })
      .catch((err) => console.log("err", err));
  };
  const handleUpdateQty = async (e, product, action) => {
    if (!token) {
      validateUser();
    }
    setloading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const cartItemUpdate = cartData?.items.find((item) => {
      return item?.variation_id !== 0
        ? item?.variation_id === product?.variation_id &&
            item.product_id === product.product_id
        : item.product_id === product.product_id;
      // const isSameProduct = item.product_id === product.product_id;
      //  isSameProduct;
    });
    let newQuantity =
      action === "PLUS"
        ? Number(cartItemUpdate.quantity) + 1
        : Number(cartItemUpdate.quantity) - 1;

    if (newQuantity <= 0) return;

    try {
      const payload = {
        cart_id: product.cart_id,
        quantity: newQuantity,
      };
      const response = await axios.post(`${BASE_URL}/update-cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      });
      setloading(false);
      toast.success(`${product?.product_name} quantity update successfully.`)
      dispatch(AddToCart(response.data));
      dispatch(CartTotal(response.data.cart_total));
    } catch (error) {
      console.error("err", error);
    }
  };

  return (
    <div className="home-main cart-main">
      <section className="Breadcrumbs-section pt-2 pt-sm-2 pb-2">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/cart">Cart</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <>
        {loading && (
          <div className="loader-overlay">
          <div className="loader"></div>
        </div> 
        )} 
          {cartData?.items.length === 0 ? (
            <>
              <div className="my-5 text-center cart-page-empty">
                <p className="mb-3">Your Cart Is Empty !</p>
                <Link to="/products" className="mb-2">
                  Shop Now
                </Link>
              </div>
            </>
          ) : (
            <>
              <section className="cart-section">
                <div className="container">
                  <div className="row my-4 my-sm-5 text-white">
                    <div className="col-lg-8">
                      <div className="cart-container">
                        <div className="cart-header">
                          <h2>Img</h2>
                          <h2>Product Title</h2>
                          <h2>Pack Size</h2>
                          <h2>Quantity</h2>
                          <h2>Subtotal</h2>
                        </div>
                        {cartData.items !== undefined &&
                          cartData?.items?.map((item, index) => {
                            return (
                              <div className="cart-item" key={index}>
                                <div className="cart-item-product">
                                  <img
                                    src={item?.image}
                                    alt="cart-product-img"
                                    className="cart-product-img img-fluid"
                                    width="100%"
                                    height="100%"
                                  ></img>
                                </div>
                                <div className="card-item-product-title">
                                  <p className="cart-item-name mb-1">
                                    {item?.product_name}
                                  </p>
                                  <p className="cart-item-price mb-2 d-flex justify-content-between align-items-center d-md-block gap-1">
                                    ₹ {item?.product_price}
                                    <b className="cart-item-pack d-block d-md-none">
                                      {" "}
                                      1 pcs / box
                                    </b>
                                  </p>
                                  <p className="cart-item-subtotal mb-3 d-block d-md-none">
                                    ₹ {item?.subtotal}
                                  </p>
                                  <div className="cart-item-quantity justify-content-center  d-flex d-md-none">
                                    <button
                                      onClick={(e) =>
                                        handleUpdateQty(e, item, "MINUS")
                                      }
                                    >
                                      -
                                    </button>
                                    <span>{item?.quantity}</span>
                                    <button
                                      onClick={(e) =>
                                        handleUpdateQty(e, item, "PLUS")
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <p className="cart-item-pack mb-0 d-md-block d-none">
                                  1 pcs / box
                                </p>
                                <div className="cart-item-quantity justify-content-start d-md-flex d-none">
                                  <button
                                    onClick={(e) =>
                                      handleUpdateQty(e, item, "MINUS")
                                    }
                                  >
                                    -
                                  </button>
                                  <span>{item?.quantity}</span>
                                  <button
                                    onClick={(e) =>
                                      handleUpdateQty(e, item, "PLUS")
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                                <p className="cart-item-subtotal mb-0 d-md-block d-none">
                                  ₹ {item?.subtotal}
                                </p>
                                {/* <button className="cart-item-remove d-flex align-items-center justify-content-center d-md-none" onClick={(e)=>handledeleteCart(e,item?.cart_id)}>
                                </button> */}
                                <button
                                  className="cart-item-remove"
                                  onClick={(e) =>
                                    handledeleteCart(e, item?.cart_id)
                                  }
                                >
                                  <p className="d-flex mb-0 align-items-center justify-content-center d-md-none">
                                    Remove{" "}
                                    <img
                                      src="/img/Trash-icon.svg"
                                      className="img-fluid"
                                      alt="trash-icon"
                                    ></img>
                                  </p>
                                  <p className="d-md-block d-none">✕</p>
                                </button>
                              </div>
                            );
                          })}
                        {cartData.items.length !== 0 && (
                          <div className="cart-footer d-md-flex d-none">
                            <button
                              className="return-shop"
                              onClick={() => navigate("/products")}
                            >
                              Return to shop
                            </button>
                            <button
                              className="clear-cart"
                              onClick={() => handleClearCart()}
                            >
                              Clear cart
                            </button>
                          </div>
                        )}
                      </div>
                      {cartData.items.length !== 0 && (
                        <div className="cart-footer d-md-none d-flex ">
                          <button
                            className="return-shop"
                            onClick={() => navigate("/products")}
                          >
                            Return to shop
                          </button>
                          <button className="clear-cart">Clear cart</button>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4">
                      {/* <div className="cart-coupon-container">
                        <div className="cart-coupon-title d-flex justify-content-between align-items-center">
                          <h2>Best Coupons For You</h2>
                          <Link
                            to="#"
                            className="cart-applycoupon-btn"
                            onClick={handleModal}
                          >
                            All Coupons{" "}
                            <i className="fa-solid fa-chevron-right"></i>
                          </Link>
                        </div>
                        <input
                          className="form-control"
                          name="coupon"
                          placeholder="Coupon code"
                        ></input>
                        <button className="btn btn-checkout">
                          Apply Coupon Code
                        </button>
                      </div> */}
                      <div className="cart-total-container">
                        <h2 className="cart-total-title">Cart Total</h2>
                        <div className="cart-total-content">
                          <p>Subtotal:</p>
                          <p>₹{cartTotal}</p>
                        </div>
                        <div className="cart-total-content">
                          <p>Shipping:</p>
                          <p>
                            {deliverydata === 0
                              ? "Free"
                              : `₹${Number(deliverydata).toFixed(2)}`}{" "}
                          </p>
                        </div>
                        {/* <div className="cart-total-content">
                          <p>Discount:</p>
                          <p>Free</p>
                        </div> */}
                        <div className="cart-total-content">
                          <p>Total:</p>
                          {/* {finalTotal} */}
                          {/* {console.log("cart", cartTotal, deliverydata)} */}
                          <p>
                            ₹{(Number(cartTotal) + Number(deliverydata)).toFixed(2)}
                          </p>
                        </div>
                        {/* <p className="cart-applycoupon-notice">
                          You’ll save <b>₹50.00</b> on this order!{" "}
                        </p> */}
                        <Link to="/checkout">
                          <button className="btn btn-checkout">
                            Proceed to checkout
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
    </div>
  );
};

export default Cart;
