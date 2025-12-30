import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ProfileSideBar } from "../component/ProfileSideBar";

export const HelpCenter = () => {
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  return (
    <div className="home-main pt-4 pb-2">
      <section className="Breadcrumbs-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/refund-and-returns-policy">Help and Center</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="help-center-section profile-section">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            href="#offcanvasExample1"
            aria-controls="offcanvasExample1"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="d-flex w-100 profile-content-wrapper align-items-start justify-content-between gap-3">
            <ProfileSideBar></ProfileSideBar>
            <div className="rightside-bar col-lg-9 ">
              <div className="row help-content-wrapper order-2  order-sm-1">
                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="card">
                    <Link to="/help-center/order">
                      <div className="card-content">
                        <img
                          src="/img/order-img1.jpg"
                          className="card-header img-fluid"
                          alt="order-img"
                        ></img>
                        <p className="card-footer text-center">Order</p>
                      </div>
                      <svg
                        width="22"
                        height="39"
                        viewBox="0 0 22 39"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.21673 0.000114441L21.6084 19.3918L2.21673 38.7834L6.48499e-05 36.5668L17.1771 19.3918L0.00214767 2.21678L2.21673 0.000114441Z"
                          fill="white"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="card">
                    <Link to="/help-center/delivery">
                      <div className="card-content">
                        <img
                          src="/img/delivery-img2.jpg"
                          className="img-fluid"
                          alt="delivery-img"
                        ></img>
                        <p className="card-footer text-center">Delivery</p>
                      </div>
                      <svg
                        width="22"
                        height="39"
                        viewBox="0 0 22 39"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.21673 0.000114441L21.6084 19.3918L2.21673 38.7834L6.48499e-05 36.5668L17.1771 19.3918L0.00214767 2.21678L2.21673 0.000114441Z"
                          fill="white"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="card">
                    <Link to="/help-center/payment-info">
                      <div className="card-content">
                        <img
                          src="/img/payment-img2.jpg"
                          className="img-fluid"
                          alt="payment-img"
                        ></img>
                        <p className="card-footer text-center">Payment</p>
                      </div>
                      <svg
                        width="22"
                        height="39"
                        viewBox="0 0 22 39"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.21673 0.000114441L21.6084 19.3918L2.21673 38.7834L6.48499e-05 36.5668L17.1771 19.3918L0.00214767 2.21678L2.21673 0.000114441Z"
                          fill="white"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="card">
                    <Link to="/help-center/return">
                      <div className="card-content">
                        <img
                          src="/img/return-img1.jpg"
                          className="img-fluid"
                          alt="return-img"
                        ></img>
                        <p className="card-footer text-center">Return</p>
                      </div>
                      <svg
                        width="22"
                        height="39"
                        viewBox="0 0 22 39"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.21673 0.000114441L21.6084 19.3918L2.21673 38.7834L6.48499e-05 36.5668L17.1771 19.3918L0.00214767 2.21678L2.21673 0.000114441Z"
                          fill="white"
                        />
                      </svg>
                    </Link>
                    <svg width="22" height="39" viewBox="0 0 22 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.21673 0.000114441L21.6084 19.3918L2.21673 38.7834L6.48499e-05 36.5668L17.1771 19.3918L0.00214767 2.21678L2.21673 0.000114441Z" fill="white"/>
</svg>

                  </div>
                </div>
              </div>
              <div className="help-order-content mt-0 mt-sm-4 order-1 order-sm-2">
                <div
                  className="accordion help-order-accordion"
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
                        How to place a new order on the Bossdent website?
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <p>
                          Browse our products, add the items you need to your
                          cart, and proceed to checkout. Enter your delivery
                          details, select a payment method, and confirm your
                          order.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Do I need a GST number to shop on Bossdent?
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <p>
                          No, a GST number is not required for shopping. It is
                          optional and only needed if you want your GST number
                          to appear on the invoice for business claims.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Do you provide GST invoices with every order?
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <p>
                          Yes, every order comes with a proper GST invoice. If
                          you provide your GST number during checkout, it will
                          be included on your invoice.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                      >
                        Can I track my order in real-time?
                      </button>
                    </h2>
                    <div
                      id="collapseFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <p>
                          Yes, once your order is shipped, you’ll receive a
                          tracking link via email or SMS. You can use this link
                          to follow your package until delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
