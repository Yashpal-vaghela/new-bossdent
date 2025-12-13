import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';
import BASE_URL from "../api/config";
import Indian_states_cities_list from 'indian-states-cities-list';
import { AddToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { Success } from "./payment/Success";

const checkoutSchema = yup.object().shape({
    first_name: yup.string().required("First Name Field is required"),
    last_name: yup.string().required("Last Name Field is required"),
    address: yup.string().required("Address Field is required"),
    email:yup.string().email("Email is not valid").required("Email Field is required"),
    city:yup.string().required("City Field is required"),
    phone: yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits").required("Phone Number Field is required"),
    state: yup.string().required("State Field is required."),
    zipcode: yup.string().matches(/^[0-9]{6}$/, "Zipcode must be 6 digits").required("Zipcode Field is required.")
})

export const Checkout = () => {
    const [paymentMethod] = useState("PhonePe");
    const [paymentSuccess,setPaymentSuccess] = useState(false);
    const [paymentStatus,setPaymentStatus] = useState(false);
    const [orderId,setOrderId] = useState("");
    const [Loading,setLoading] = useState(false);
    const [token] = useState(JSON.parse(localStorage.getItem("auth_token")));
    const [States,setStates] = useState([]);
    const user = useSelector((state)=>state.user.user);
    const cartData = useSelector((state)=>state.cart.cart);
    const deliverydata = useSelector((state)=>state.cart.deliveryCharge);
    const paymentIntervalRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialValues = {
        first_name:Object.keys(user).length !== 0 ? user?.first_name : "",
        last_name:Object.keys(user).length !== 0 ? user?.last_name : "",
        address:Object.keys(user).length !== 0 ? user?.address : "",
        email:Object.keys(user).length !== 0 ? user?.email : "",
        city:Object.keys(user).length !== 0 ? user?.city : "",
        phone:Object.keys(user).length !== 0 ? user?.phone_number.slice(2) : "",
        state:Object.keys(user).length !== 0 ? user?.state : "",
        zipcode:Object.keys(user).length !== 0 ? user?.zipcode : "",
    }
    const formik = useFormik({
        initialValues,
        enableReinitialize: true, 
        validationSchema:checkoutSchema,
        validateOnChange:true,
        validateOnBlur:false,
        onSubmit: async ()=>{
            if(paymentMethod && formik?.values){
              try{
                setLoading(true);                  
                const orderResponse = await axios.post(`${BASE_URL}/create-order`,formik.values,{
                  headers:{
                    Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
                    "Content-Type": "application/json",
                  },
                }).then(async (res)=>{
                  const newOrderId = res.data.order_id.toString();
                  setOrderId(newOrderId);

                  if(paymentMethod === "PhonePe"){
                    setLoading(true);
                    const paymentResponse = await fetch(`${BASE_URL}/phonepe/new-initiate`,{
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            order_id:`${res.data.order_id}`,
                            user_id:user.length !== 0 && user.user_id,
                            amount:Number(`${(Number(res.data.order_total) + Number(deliverydata)) * 100}`),
                            mobile:user.length !== 0 && user.phone_number.slice(2),
                            // customerDetails:formik?.values
                          })
                    });
                    if(!paymentResponse.ok){
                      const paymentErrorText = await paymentResponse.text();
                      throw new Error("Failed to initiate payment.");
                    }

                   
                    const paymentData = await paymentResponse.json();
                    if(paymentData.phonepe_response.success && paymentData.phonepe_response && paymentData.phonepe_response.data.instrumentResponse && paymentData.phonepe_response.data.instrumentResponse.redirectInfo){
                      setLoading(false);
                      const paymentUrl = paymentData.phonepe_response.data.instrumentResponse.redirectInfo.url;
                      window.open(paymentUrl,"_blank");

                      paymentIntervalRef.current = setInterval(()=>{
                        checkPaymentStatus(paymentData.phonepe_response.data.merchantId,paymentData.x_verify,paymentData.phonepe_response.data.merchantTransactionId,res.data.order_id);
                      },10000);
                      DeletCartItems();
                    }
                  }
                });
              }catch(err){
                setLoading(false);
                toast.error(err?.message);
              } finally{
                setLoading(false);
              }
            }
        }
    })
    const checkPaymentStatus = async (merchantId,verifyToken,transactionId,orderId) =>{
      try{
        const res = await axios.post(`${BASE_URL}/phonepe/callback`,{"merchantTransactionId":transactionId},{
          headers:{
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
            "x-verify":verifyToken,
            "x-merchant-id":merchantId
          }
        });
        // console.log("Status:", res.data);
         setPaymentStatus(res.data.paymentStatus);
        if (res.data.payment_status === "COMPLETED") {
          toast.success("Payment Successful!");
          clearInterval(paymentIntervalRef.current);
          paymentIntervalRef.current = null; 
          setLoading(false);
          navigate("/payment/success");
        }
        if (res.data.payment_status === "FAILED" ) {
          toast.error("Payment Failed!");
          clearInterval(paymentIntervalRef.current);
          paymentIntervalRef.current = null;
          setLoading(false);
          navigate("/payment/success");
        }
        localStorage.setItem("orderId",JSON.stringify(orderId));
        setPaymentSuccess(true);
      }catch(err){
        console.log("Poll error", err);
      }
    }
    const DeletCartItems = async () =>{
      await axios.post(`${BASE_URL}/delete-cart`,{},{
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
        },
      }).then((res)=>{
        dispatch(AddToCart({...res.data,items:[]}));
      })
      .catch((err)=>{
        console.log("err",err);
      })
    }
    useEffect(()=>{
      setStates(Indian_states_cities_list?.STATES_OBJECT);
    },[user])

  return (
    <div className="home-main pt-3 cart-main">
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
      <section className="checkout-page-section text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <form className="form checkout-form w-100" onSubmit={formik?.handleSubmit}>
                <div className="d-block d-md-flex gap-3 align-items-start align-items-lg-center">
                  <div className={formik?.errors?.first_name ? "checkoutInputBox my-1 mb-2 mb-md-0" : "checkoutInputBox mb-3 mb-md-4"}>
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
                    {formik?.errors?.first_name &&(
                        <p className="text-danger my-1 my-lg-0 my-xl-1">{ formik?.errors?.first_name}</p>
                    )}
                  </div>
                  <div className={formik?.errors?.last_name ? "checkoutInputBox my-1 mb-2 mb-md-0" : "checkoutInputBox mb-3 mb-md-4"}>
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
                        <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.last_name}</p>
                    )}
                  </div>
                </div>
                <div className={formik?.errors?.address ? "checkoutInputBox my-1 mb-2 mb-md-2" : "checkoutInputBox mb-3 mb-md-4"}>
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
                    <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.address}</p>
                  )}
                </div>
                <div className="d-block d-md-flex align-items-start align-items-lg-center gap-3">
                  <div className={formik?.errors?.email ? "checkoutInputBox my-1 mb-2 mb-md-2" : "checkoutInputBox mb-3 mb-md-4"}>
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
                        <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.email}</p>
                    )}
                  </div>
                  <div className={formik?.errors?.city ? "checkoutInputBox my-1 mb-2 mb-md-2" : "checkoutInputBox mb-3 mb-md-4"}>
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
                        <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.city}</p>
                    )}
                  </div>
                </div>
                <div className="d-block align-items-xl-center align-items-start gap-2 gap-xl-3 d-lg-flex">
                  <div className={formik?.errors?.phone ? "checkoutInputBox my-1 mb-2 mb-lg-0 mb-md-3" : "checkoutInputBox mb-3 mt-md-0 mb-md-4"}>
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
                        <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.phone}</p>
                    )}
                  </div>
                  <div className={formik?.errors?.state ? "checkoutInputBox my-1 mb-2 mb-lg-0 mb-md-3" : "checkoutInputBox mb-3 mt-md-0 mb-md-4"}>
                    <label className="form-label">State</label>
                    <select className="form-select" name="state" value={formik?.values?.state || ""}  onChange={formik?.handleChange} onBlur={formik?.handleBlur}>
                      <option>Select state</option>
                      {
                        States?.map((state,index)=>{
                          return(
                            <React.Fragment key={index}>
                              <option value={state?.name}>{state?.value}</option>
                            </React.Fragment>
                          )
                        })
                      }
                    </select>
                    {formik?.errors?.state && (
                        <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.state}</p>
                    )}
                  </div>
                  <div className={formik?.errors?.zipcode ? "checkoutInputBox my-1 mb-2 mb-lg-0 mb-md-3" : "checkoutInputBox mb-3 mt-md-0 mb-md-4"}>
                    <label className="form-label">Zipcode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zipcode"
                      placeholder="Zipcode"
                      value={formik?.values?.zipcode || ""}
                      onChange={formik?.handleChange}
                      onBlur={formik?.handleBlur}
                      maxLength="6"
                    ></input>
                    {formik?.errors?.zipcode && (
                        <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.zipcode}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-4">
              <div className="cart-total-container">
                <h2 className="cart-total-title">Cart Total</h2>
                {
                  cartData?.items !== undefined && cartData?.items.length !== 0  ? cartData?.items.map((i,index)=>{
                    return(
                      <div className="d-flex align-items-center justify-content-between" key={index}>
                        <p>{i?.product_name}</p>
                        {/* {
                          i?.sale_price ? 
                          <div className="d-flex align-items-center">
                            <p className="fw-bold">
                              ₹{Number(i?.subtotal).toFixed(2)}
                            </p>
                          </div> : 
                          <p className="fw-bold">
                            ₹{Number(i?.subtotal).toFixed(2)}
                          </p>
                        } */}
                          <p className="fw-bold">
                            ₹{Number(i?.subtotal).toFixed(2)}
                          </p>
                      </div> 
                    )
                  }) : <></>
                }
                <div className="cart-total-content">
                    <p>Subtotal:</p>
                    <p>₹{cartData?.cart_total}</p>
                </div>
                <div className="cart-total-content">
                    <p>Shipping:</p>
                    <p>{deliverydata === 0 ? "Free" : `₹${Number(deliverydata).toFixed(2)}`} </p>
                </div>
                {/* <div className="cart-total-content">
                    <p>Discount:</p>
                    <p>Free</p>
                </div> */}
                <div className="cart-total-content">
                    <p>Total:</p>
                    <p>₹{(Number(cartData?.cart_total) + Number(deliverydata)).toFixed(2)}</p>
                </div>
                
                {/* <p className="cart-applycoupon-notice d-none">
                  You’ll save <b>₹50.00</b> on this order!{" "}
                </p> */}
                <button className="btn btn-checkout"  onClick={()=>formik.handleSubmit()}>Proceed to payment</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
