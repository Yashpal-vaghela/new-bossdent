import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer-section">
        <div className="footer-email-section-wrapper footer-email-section-wrapper">
          <div className="container">
            <div className="row justify-content-between align-items-center ">
              <div className="col-lg-4">
                <h2>Subscribe our Newsletter</h2>
                <p>
                  Subscribe to get expert dental tips, product updates, and
                  exclusive offers straight to your inbox.
                </p>
              </div>
              <div className="col-lg-4">
                <div className="email-input-wrapper">
                  <input
                    className="form-control"
                    name="email"
                    placeholder="Your email address"
                  ></input>
                  <button className="btn btn-default">Subscribe</button>
                </div>
              </div>
              <div className="col-lg-2 px-2">
                <div className="social-link-icon-wrapper d-flex justify-content-between">
                  <Link to="https://www.facebook.com/share/FgTSjonfbbaGDbNo/?mibextid=qi2Omg">
                    <i className="fa-brands fa-facebook-f social-link-icon"></i>
                  </Link>
                  <Link to="#">
                    <i className="fa-brands fa-twitter social-link-icon"></i>
                  </Link>
                  <Link to="#">
                    <i className="fa-brands fa-pinterest-p social-link-icon"></i>
                  </Link>
                  <Link to="https://www.instagram.com/_bossdent_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D">
                    <i className="fa-brands fa-instagram social-link-icon"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container pt-4 pb-0">
          <div className="footer-main-content mb-2 mb-sm-3 mb-md-4">
            <div className="row mt-lg-3">
              <div className="col-lg-4">
                <img
                  src="/img/logo2.svg"
                  className="footer-logo img-fluid mb-3"
                  alt="logo"
                ></img>
                <p className="footer-content">
                  A leading dental supply partner for dentists. Trusted by more
                  than 10k dentists in India, we deliver authentic and reliable
                  dental products that set the standard for modern dentistry.
                </p>
              </div>
              <div className="col-lg-2 col-md-3 col-4">
                <h2>Company</h2>
                <ul className="footer-social-link">
                  <li>
                    <Link to="/aboutus">About Us</Link>
                  </li>
                  <li>
                    <Link to="#">Social Media</Link>
                  </li>
                  <li>
                    <Link to="/contactus">Contact Us</Link>
                  </li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-3 col-4">
                <h2>Shop</h2>
                <ul className="footer-social-link">
                  <li>
                    <Link to="/products">All Products</Link>
                  </li>
                  <li>
                    <Link to="#">New Arrivals</Link>
                  </li>
                  <li>
                    <Link to="#">Best Sellers</Link>
                  </li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-3 col-4">
                <h2>Categories</h2>
                <ul className="footer-social-link">
                  <li>
                    <Link to="#">Gloves</Link>
                  </li>
                  <li>
                    <Link to="#">Masks</Link>
                  </li>
                  <li>
                    <Link to="#">Airotor</Link>
                  </li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-3 col-4">
                <h2>Support</h2>
                <ul className="footer-social-link">
                  <li>
                    <Link to="#">FAQs</Link>
                  </li>
                  <li>
                    <Link to="#">Returns & Refunds</Link>
                  </li>
                  <li>
                    <Link to="#">Track Your Order</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright-wrapper d-md-flex d-grid justify-content-between align-items-center">
            <p className="mb-0 order-md-1 order-2">2025 © all right reserved by BossDentIndia</p>
            <div className="footer-copyright order-md-2 order-1">
              <span>+91 76988 28883</span>
              or
              <Link
                to="mailto:zahndentaldepo@gmailcom"
                className="footer-copyright-link"
              >
                zahndentaldepo@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
