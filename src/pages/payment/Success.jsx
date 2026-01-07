import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import BASE_URL from "../../api/config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const Success = () => {
  const [paymentStatus, setPaymentStatus] = useState("PROCESSING");
  const token = useSelector((state) => state.auth.token);
  const [orderId] = useState(JSON.parse(localStorage.getItem("orderId")));
  const [payment_method] = useState(JSON.parse(localStorage.getItem("payment_method")));
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const fetchPaymentCallBack = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/phonepe/status?order_id=${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      });

      const status = response.data.payment_status;
      setPaymentStatus(status);

      // Stop polling if payment is completed or failed
      if (status === "COMPLETED" || status === "FAILED") {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      setPaymentStatus("FAILED");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }
    console.log("payment",payment_method)
    if(payment_method !== "COD"){
      // Initial delay before first fetch (e.g., 2 seconds)
      const timeout = setTimeout(fetchPaymentCallBack, 2000);

      // Poll every 5 seconds
      intervalRef.current = setInterval(fetchPaymentCallBack, 5000);

      return () => {
        clearInterval(timeout);
        clearInterval(intervalRef.current);
      };
    }

  }, []);

  return (
    <div className="home-main pt-4">
      <section className="checkout-success-wrapper ">
        <div className="container">
          <h1 className="checkout-success-message">Thank You!</h1>
          <p>For Your Order</p>
          {["COMPLETED", "PROCESSING"].includes(paymentStatus) && (
            <h2>Your order was Successfully Placed.</h2>
          )}
          {paymentStatus === "FAILED" && <h2>Your Payment could not be verified.</h2>}
          <br />
          {["COMPLETED", "PROCESSING"].includes(paymentStatus) ? (
            <p className="order-status-success">
              <i className="fa-regular fa-circle-check"></i> Order Successfully Placed
            </p>
          ) : paymentStatus === "FAILED" ? (
            <p className="order-status-failed">
              <i className="fa-regular fa-circle-xmark"></i> Payment Failed
            </p>
          ) : null}
          <p className="order-id">Your Order No: {orderId}</p>
          <p className="payment-type">Payment Method: {payment_method}</p>
          <p className="contact-detalis">
            If you have any question regarding your order, you can contact at{" "}
            <strong>
              <Link to="mailto:zahndentaldepo@gmail.com">zahadental@gmail.com</Link> or call us at{" "}
              <Link to="tel:+917698828883">76988 28883</Link>
            </strong>
          </p>
          <div className="checkout-success">
            <div id="content">
              <div className="holder">
                <h2 className="text-center">
                  Thank you for your interest in BossDent India products.
                </h2>
                <p>Thanks for shopping with us online!</p>
                <div className="buttons">
                  <Link to="/products" className="btn text-white">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
