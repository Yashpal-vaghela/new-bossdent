import React from "react";
import { Link } from "react-router-dom";

export const HelpCenter = () => {
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
      <section className="help-center-section">
        <div className="container">
          <h1>
            <Link to="tel:+917698828883">+91 76988 28883</Link>
          </h1>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item help-item" >
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                  data-number="01"
                >
                  How to place an order?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body"  data-number="01">
                  <p>For the product order follow the below instructions:</p>
                  <p className="mb-sm-1 mb-3">Click on shop on the site header part.</p>
                  <ul className="account-ul">
                    <li>Select your product</li>
                    <li>Select size and quantity</li>
                    <li>Click on add to cart</li>
                    <li>Click on the cart icon & click on continue to checkout</li>
                    <li>Enter you required details on the checkout page</li>
                    <li>Select your payment options & click on place order button.</li>
                  </ul>
                  <p>Still unsatisfied, mail us <Link to="email:zahndentaldepo@gmail.com">zahndentaldepo@gmail.com</Link></p>
                </div>
              </div>
            </div>
            <div className="accordion-item help-item" >
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                  data-number="02"
                >
                  How to create an account?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body" data-number="02">
                  <p>For create an account follow the below instructions:</p>
                  <ul className="account-ul">
                    <li>Click on my account on the site header part.</li>
                    <li>You can see login & register form on the my account page.</li>
                    <li>Enter your details and click on register button.</li>
                  </ul>
                  <p>If you already have an account then you can enter your email/username and password in the login form on the my-account page.</p>
                </div>
              </div>
            </div>
            <div className="accordion-item help-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                  data-number="03"
                >
                  How much time it takes to deliver the order?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body" data-number="03">
                  <p>It takes 3-4 Business Days to deliver your order.</p>
                </div>
              </div>
            </div>
            <div className="accordion-item help-item">
              <h2 className="accordion-header" id="headingFour">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                  data-number="04"
                >
                  How can I contact the store?
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body" data-number="04"> 
                    <h2>How can I contact the store?</h2>
                    <ul className="address-ul">
                        <li>Bossdentindia (Disposables & Consumables) is an online dental product selling store based in Surat Gujrat.</li>
                        <li>Address: Plot No. 1 to 8, Marutidham Industrial Estate, Behind Hotel Royal, Velanja Road, Umra, Surat - 394130, Gujarat, India</li>
                        <li>Email: <Link to="email:">zahndentaldepo@gmail.com</Link></li>
                        <li>Phone: <Link to="tel:+917698828883">+91 76988 28883</Link></li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
