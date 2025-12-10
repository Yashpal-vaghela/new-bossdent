import React from 'react'

export const ServiceSection = () => {
    return (
        <section className="contact-link-section mb-4 mt-4 mt-lg-5">
        <div className="container">
          <div className="row">
            <div className="contact-content-wrapper mb-3 mb-md-0 col-lg-3 col-md-6  col-6 d-flex justify-content-center align-items-center">
              <img
                src="/img/dentist-icon.svg"
                className="trusted-dentist-icon img-fluid"
                alt="trusted-dentist-icon"
                width="53"
                height="52"
              ></img>
              <div className="contact-link-section-content d-block">
                <h2 className="mb-1">Trusted Dentists</h2>
                <p className="mb-1">Serving 10k+ Dental Clinics</p>
              </div>
            </div>
            <div className="contact-content-wrapper mb-3 mb-md-0 col-lg-3 col-md-6 col-6 d-flex justify-content-center align-items-center">
              <img
                src="/img/headphones-icon1.svg"
                className="headphone-icon-img img-fluid"
                alt="headphones-icon"
                width="53"
                height="52"
              ></img>
              <div className="contact-link-section-content d-block">
                <h2 className="mb-1">Quick & Easy Support</h2>
                <p className="mb-1">Fast, Easy Help Anytime</p>
              </div>
            </div>
            <div className="contact-content-wrapper mb-1 mb-md-0 col-lg-3 col-md-6 col-6 d-flex justify-content-center align-items-center">
              <img
                src="/img/secure-icon1.svg"
                className="secure-icon-img img-fluid"
                alt="secure-icon"
                width="53"
                height="52"
              ></img>
              <div className="contact-link-section-content d-block">
                <h2 className="mb-1">Secure Payment Options</h2>
                <p className="mb-1">Safe, Protected & Hassle-Free</p>
              </div>
            </div>
            <div className="contact-content-wrapper mb-1 mb-md-0 col-lg-3 col-md-6 col-6 d-flex justify-content-center align-items-center">
              <img
                src="/img/product-quality-icon.svg"
                alt="product-quality-icon"
                className="product-quality-img img-fluid"
                width="53"
                height="52"
              ></img>
              <div className="contact-link-section-content d-block">
                <h2 className="mb-1">Authentic Product Quality</h2>
                <p className="mb-1">Genuine, Certified & Reliable</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}
