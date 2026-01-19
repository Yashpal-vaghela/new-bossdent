import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState,useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import BASE_URL from "../api/config";
import Indian_states_cities_list from "indian-states-cities-list";
import { AddToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import Loader2 from "../component/Loader2";
// import useValidateUser from "../component/useValidateUser";

const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("First Name Field is required"),
  last_name: yup.string().required("Last Name Field is required"),
  address: yup.string().required("Address Field is required"),
  email: yup.string().email("Email is not valid").required("Email Field is required"),
  city: yup.string().required("City Field is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits").required("Phone Number Field is required"),
  state: yup.string().required("State Field is required."),
  zipcode: yup.string().matches(/^[0-9]{6}$/, "Zipcode must be 6 digits").required("Zipcode Field is required."),
  payment_method: yup.string().required("Please choose payment method is required"),
});
export const Checkout = () => {
  const [apiloading, setApiLoading] = useState(false);
  const States = Indian_states_cities_list?.STATES_OBJECT;
  const { token, user, cartData, deliverydata } = useSelector((state) => ({
    token: state.auth.token,
    user: state.user.user,
    cartData: state.cart.cart,
    deliverydata: state.cart.deliveryCharge,
  }),shallowEqual);
  const codeoption = useMemo(()=>{
    return Number(cartData.cart_total || 0) <= 10000;
  },[cartData?.cart_total]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  // const location = useLocation();
  // const validateUser = useValidateUser();
  const initialValues = useMemo(() => ({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    address: user?.address || "",
    email: user?.email || "",
    city: user?.city || "",
    phone: user?.phone_number?.slice(2) || "",
    state: user?.state || "",
    zipcode: user?.zipcode || "",
    payment_method: "",
  }), [user]);
  /* eslint-disable react-hooks/exhaustive-deps */
  const fetchPincodeDetails = useCallback(async (pincode) => {
    try {
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);

      if (res.data?.[0]?.Status !== "Success") {
        formik.setFieldError("zipcode", "Invalid pincode");
      }
    } catch {
      formik.setFieldError("zipcode", "Unable to fetch pincode details");
    }
  }, []);
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: checkoutSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async () => {
      if (formik?.values.payment_method && formik?.values) {
        try {
          setApiLoading(true);
          let payload = {}
          if(formik?.values.payment_method === "COD"){
            payload = {...formik?.values,delivery_charge:Number(deliverydata),handling_charge:25}
          }else{
            payload = {...formik?.values,delivery_charge:Number(deliverydata),handling_charge:0}
          }
          await axios.post(`${BASE_URL}/create-order`, payload, {
              headers: {
                Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
                "Content-Type": "application/json",
              },
            })
            .then(async (res) => {
              if (formik?.values.payment_method === "prepaid") {
                setApiLoading(true);
                const paymentResponse = await fetch(`${BASE_URL}/phonepe/new-initiate`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      order_id: `${res.data.order_id}`,
                      user_id: user.length !== 0 && user.user_id,
                      amount: `${(Number(res.data.order_total)) * 100}`,
                      mobile: user.length !== 0 && user.phone_number.slice(2),
                      redirect_url: window.location.origin + "/payment/success",
                    }),
                  }
                );
                if (!paymentResponse.ok) {
                  const paymentErrorText = await paymentResponse.text();
                  throw new Error("Failed to initiate payment.",paymentErrorText);
                }
                const paymentData = await paymentResponse.json();
                if (paymentData.phonepe_response.success && paymentData.phonepe_response &&paymentData.phonepe_response.data.instrumentResponse &&paymentData.phonepe_response.data.instrumentResponse.redirectInfo) {
                  setApiLoading(false);
                  const paymentUrl = paymentData.phonepe_response.data.instrumentResponse.redirectInfo.url;
                  //window.open(paymentUrl);
                  window.location.href = paymentUrl;
                  // paymentIntervalRef.current = setInterval(()=>{
                  //   checkPaymentStatus(paymentData.phonepe_response.data.merchantId,paymentData.x_verify,paymentData.phonepe_response.data.merchantTransactionId,res.data.order_id);
                  // },10000);
                  localStorage.setItem("orderId", res.data.order_id);
                  dispatch(AddToCart({ items: [], cart_count: 0, cart_total: 0 }));
                }
              } else {
                DeletCartItems();
                navigate("/payment/success");
                localStorage.setItem("orderId", res.data.order_id);
                localStorage.setItem("payment_method",JSON.stringify(formik?.values?.payment_method))
              }
            });
        } catch (err) {
          setApiLoading(false);
          toast.error(err?.message);
        } finally {
          setApiLoading(false);
        }
      }
    },
  });
  const DeletCartItems = async () => {
    setApiLoading(true);
    await axios.post(`${BASE_URL}/delete-cart`,{},{
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
    }).then((res) => {
        setApiLoading(false);
        dispatch(AddToCart({ ...res.data, items: [] }));
    }).catch((err) => {
        setApiLoading(false);
        console.log("err", err);
    });
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(()=>{
    if(hasFetched.current) return;
      hasFetched.current = true;

    if(Object.keys(user).length !== 0){
      fetchPincodeDetails(user?.zipcode)
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[]);

  return (
    <div className="home-main pt-0  cart-main">
      <section className="Breadcrumbs-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item ">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/checkout">Checkout page</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      {apiloading && <Loader2></Loader2>}
      <section className="checkout-page-section text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <form
                className="form checkout-form w-100"
                onSubmit={formik?.handleSubmit}
              >
                <div className="d-block d-md-flex gap-3 align-items-start align-items-lg-center">
                  <div
                    className={
                      formik?.errors?.first_name
                        ? "checkoutInputBox my-1 mb-2 mb-md-0"
                        : "checkoutInputBox mb-3 mb-md-4"
                    }
                  >
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      placeholder="Your First Name"
                      value={formik?.values?.first_name || ""}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                    ></input>
                    {formik?.errors?.first_name && (
                      <p className="text-danger my-1 my-lg-0 my-xl-1">
                        {formik?.errors?.first_name}
                      </p>
                    )}
                  </div>
                  <div
                    className={
                      formik?.errors?.last_name
                        ? "checkoutInputBox my-1 mb-2 mb-md-0"
                        : "checkoutInputBox mb-3 mb-md-4"
                    }
                  >
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="last_name"
                      placeholder="Your Last Name"
                      value={formik?.values?.last_name || ""}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                    ></input>
                    {formik?.errors?.last_name && (
                      <p className="text-danger my-1 my-lg-0 my-xl-1">
                        {formik?.errors?.last_name}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={
                    formik?.errors?.address
                      ? "checkoutInputBox my-1 mb-2 mb-md-2"
                      : "checkoutInputBox mb-3 mb-md-4"
                  }
                >
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="Your Address"
                    value={formik?.values?.address || ""}
                    onBlur={formik?.handleBlur}
                    onChange={formik?.handleChange}
                  ></input>
                  {formik?.errors?.address && (
                    <p className="text-danger my-1 my-lg-0 my-xl-1">
                      {formik?.errors?.address}
                    </p>
                  )}
                </div>
                <div className="d-block d-md-flex align-items-start align-items-lg-center gap-3">
                  <div
                    className={
                      formik?.errors?.email
                        ? "checkoutInputBox my-1 mb-2 mb-md-2"
                        : "checkoutInputBox mb-3 mb-md-4"
                    }
                  >
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter Email Address"
                      value={formik?.values?.email || ""}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                    ></input>
                    {formik?.errors?.email && (
                      <p className="text-danger my-1 my-lg-0 my-xl-1">
                        {formik?.errors?.email}
                      </p>
                    )}
                  </div>
                  <div
                    className={
                      formik?.errors?.city
                        ? "checkoutInputBox my-1 mb-2 mb-md-2"
                        : "checkoutInputBox mb-3 mb-md-4"
                    }
                  >
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={formik?.values?.city || ""}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      placeholder="Enter city"
                    />
                    {formik?.errors?.city && (
                      <p className="text-danger my-1 my-lg-0 my-xl-1">
                        {formik?.errors?.city}
                      </p>
                    )}
                  </div>
                </div>
                <div className="d-block align-items-xl-center align-items-start gap-2 gap-xl-3 d-lg-flex">
                  <div
                    className={
                      formik?.errors?.phone
                        ? "checkoutInputBox my-1 mb-2 mb-lg-0 mb-md-3"
                        : "checkoutInputBox mb-3 mt-md-0 mb-md-4"
                    }
                  >
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      placeholder="Enter Phone Number"
                      value={formik?.values?.phone || ""}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      maxLength={10}
                    ></input>
                    {formik?.errors?.phone && (
                      <p className="text-danger my-1 my-lg-0 my-xl-1">
                        {formik?.errors?.phone}
                      </p>
                    )}
                  </div>
                  <div
                    className={
                      formik?.errors?.state
                        ? "checkoutInputBox my-1 mb-2 mb-lg-0 mb-md-3"
                        : "checkoutInputBox mb-3 mt-md-0 mb-md-4"
                    }
                  >
                    <label className="form-label">State</label>
                    <select
                      className="form-select"
                      name="state"
                      value={formik?.values?.state || ""}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                    >
                      <option>Select state</option>
                      {States?.map((state, index) => {
                        return (
                          <React.Fragment key={index}>
                            <option value={state?.name}>{state?.value}</option>
                          </React.Fragment>
                        );
                      })}
                    </select>
                    {formik?.errors?.state && (
                      <p className="text-danger my-1 my-lg-0 my-xl-1">
                        {formik?.errors?.state}
                      </p>
                    )}
                  </div>
                  <div
                    className={
                      formik?.errors?.zipcode
                        ? "checkoutInputBox my-1 mb-2 mb-lg-0 mb-md-3"
                        : "checkoutInputBox mb-3 mt-md-0 mb-md-4"
                    }
                  >
                    <label className="form-label">Zipcode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zipcode"
                      placeholder="Zipcode"
                      value={formik?.values?.zipcode || ""}
                      // onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      maxLength="6"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        formik.setFieldValue("zipcode", value);

                        if (value.length === 6) {
                          fetchPincodeDetails(value);
                        }
                      }}
                    ></input>
                    {formik?.errors?.zipcode && (
                      <p className="text-danger my-1 my-lg-0 my-xl-1">
                        {formik?.errors?.zipcode}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-4">
              <div className="cart-total-container">
                <h2 className="cart-total-title">Cart Total</h2>
                {cartData?.items !== undefined &&
                  cartData?.items.length !== 0 ? (
                  cartData?.items.map((i, index) => {
                    return (
                      <div
                        className="d-flex align-items-center justify-content-between"
                        key={index}
                      >
                        <p>{i?.product_name}</p>
                        <p className="fw-bold">
                          ₹{Number(i?.subtotal).toFixed(2)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <></>
                )}
                <div className="cart-total-content">
                  <p>Subtotal:</p>
                  <p>₹{cartData?.cart_total}</p>
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
                  <p>₹ {(Number(cartData?.cart_total) + Number(deliverydata)).toFixed(2)}</p>
                </div>
                <div className="form-check my-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="payment_method"
                    value="prepaid"
                    onChange={formik?.handleChange}
                  ></input>
                  <label className="form-check-label d-flex gap-2 align-items-center justify-content-center">
                    <img
                      src="./img/payment_option1.svg"
                      className="img-fluid"
                      alt="Phone-pe-svg-icon"
                    ></img>
                    UPI, Credit or Debit Card, Net Banking, Buy Now Pay later
                  </label>
                </div>
                {/* {console.log("code",cartData?.items)} */}
                {codeoption && (
                  <div className="form-check my-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="payment_method"
                      value="COD"
                      disabled={
                        cartData?.items?.length === 1 ||
                        cartData?.items.some((item)=>item.category_ids?.includes(116) && Number(item.quantity) > 5)
                      }
                      onChange={formik?.handleChange}
                    ></input>
                    <label className="form-check-label d-flex  align-items-center justify-content-between">
                      <img
                        src="./img/payment_option2.svg"
                        className="img-fluid"
                        alt="Phone-pe-svg-icon"
                      ></img>
                      Cash On Delivery <b>Pay Extra ₹25 on COD</b>
                    </label>
                  </div>
                )}
                {formik?.errors?.payment_method && (
                  <p className="text-danger my-1 my-lg-0 my-xl-1">
                    {formik?.errors?.payment_method}
                  </p>
                )}
                <button
                  className="btn btn-checkout"
                  onClick={() => formik.handleSubmit()}
                >
                  {formik?.values?.payment_method === "COD"
                    ? "Place Order"
                    : "Proceed to payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
