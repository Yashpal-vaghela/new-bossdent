import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const Success = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const token = useSelector((state)=>state.auth.token);
  // const [token] = useState(JSON.parse(localStorage.getItem("auth_token")));
  const [orderId] = useState(JSON.parse(localStorage.getItem("orderId")));
  const navigate = useNavigate();
  const fetchPaymentCallBack = async (controller) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/get-order-details/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
          signal:controller.signal
        }
      );
      const status = response.data.order.status;
      setPaymentStatus(status);
    } catch (err) {
      setPaymentStatus("failed");
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    if (orderId === undefined) {
      navigate("/");
    } else {
      fetchPaymentCallBack(controller);
    }
    return () => controller.abort();
  }, []);
  return (
    <div className="home-main pt-4">
      <section className="checkout-success-wrapper ">
        <div className="container">
          <h1 className="checkout-success-message">Thank You!</h1>
          <p>For Your Order</p>
          {
            (paymentStatus === "success" || paymentStatus === "Processing") && <h2>Your order was Successfully Placed.</h2>
          }
          {
            paymentStatus === "On-hold" && <h2>Your Payment could not be verified.</h2>
          }
          <br />
          {
            paymentStatus === "success" || paymentStatus === "Processing"? <p className="order-status-success"><i className="fa-regular fa-circle-check"></i> Order Successfully Placed</p> : 
            paymentStatus === "On-hold" ? <p className="order-status-failed"><i className="fa-regular fa-circle-xmark"></i>Payment Failed</p> : <></>
          }
          <p className="order-id">Your Order No:{orderId}</p>
          <p className="contact-detalis">
            If you have any question regarding your order, you can contact at{" "}
            <strong><Link to="mailto:zahndentaldepo@gmail.com">zahadental@gmail.com</Link> or call us at <Link to="tel:+917698828883">76988 28883</Link></strong>
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
