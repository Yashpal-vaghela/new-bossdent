import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../api/config";
import Loader2 from "../component/Loader2";
import { AddToCart, CartTotal } from "../redux/cartSlice";
import useValidateUser from "../component/useValidateUser";
import { toast } from "react-toastify";
import { ConfirmationDialog } from "../component/ConfirmationDialog";

const Cart = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiloading, setApiLoading] = useState(false);
  const cartTotal = useSelector((state) => state.cart.cartTotal);
  const cartData = useSelector((state) => state.cart.cart);
  const deliverydata = useSelector((state) => state.cart.deliveryCharge);
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [selectProductModal, setSelectProductModal] = useState(false);
  const validateUser = useValidateUser();

  const handleClearCart = async () => {
    setApiLoading(true);
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
        setApiLoading(false);
        dispatch(AddToCart({ ...res.data, items: [] }));
        dispatch(CartTotal(res.data.cart_total));
      })
      .catch((err) => console.log("err", err));
  };
  const confirmDelete = (e, product) => {
    setShowDialogBox(true);
    setSelectProductModal(product);
  };
  const handleConfirmRemove = (e, product) => {
    handledeleteCart(e, product);
    setShowDialogBox(false);
  };
  const handleCancel = () => {
    setShowDialogBox(false);
  };
  const handledeleteCart = async (e, product) => {
    const payload = { cart_id: product?.cart_id };
    setApiLoading(true);
    await axios
      .post(`${BASE_URL}/delete-cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setApiLoading(false);
        const filterData = cartData?.items.filter(
          (item) => item.cart_id !== product?.cart_id
        );
        dispatch(AddToCart({ ...res.data, items: filterData }));
        dispatch(CartTotal(res.data.cart_total));
      })
      .catch((err) => console.log("err", err));
  };
  const handleUpdateQty = async (e, product, action) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to product update qty!")
    } else {
      setApiLoading(true)
      window.scrollTo({ top: 0, behavior: "smooth" });
      const cartItemUpdate = cartData?.items.find((item) => {
        return item?.variation_id !== 0
          ? item?.variation_id === product?.variation_id &&
              item.product_id === product.product_id
          : item.product_id === product.product_id;
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
        setApiLoading(true);
        const response = await axios.post(`${BASE_URL}/update-cart`, payload, {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
        });
        setApiLoading(false);
        toast.success(`${product?.product_name} quantity update successfully.`);
        dispatch(AddToCart(response.data));
        dispatch(CartTotal(response.data.cart_total));
      } catch (error) {
        console.error("err", error);
      }
    }
  };
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])

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
        {apiloading && <Loader2></Loader2>}
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
                            <React.Fragment key={index}>
                              {showDialogBox && (
                                <ConfirmationDialog
                                  onConfirm={(e) =>
                                    handleConfirmRemove(e, selectProductModal)
                                  }
                                  onCancel={handleCancel}
                                  title={item?.product_name}
                                  selectProductModal={selectProductModal}
                                ></ConfirmationDialog>
                              )}
                              <div
                                className={`cart-item ${item?.stock_status}`}
                              >
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
                                <button
                                  className="cart-item-remove"
                                  onClick={(e) => confirmDelete(e, item)}
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
                            </React.Fragment>
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

                      <div className="cart-total-content">
                        <p>Total:</p>
                        <p>
                          ₹
                          {(Number(cartTotal) + Number(deliverydata)).toFixed(
                            2
                          )}
                        </p>
                      </div>
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
