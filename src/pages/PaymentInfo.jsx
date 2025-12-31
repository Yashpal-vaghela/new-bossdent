import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HelpSideBar } from "../component/HelpSideBar";

const PaymentInfo = () => {
  const paymentInfo = [
    {
      id: 1,
      title: "What payment methods are accepted at Bossdent?",
      description:
        "We accept all major payment options, including UPI, credit/debit cards, and net banking.",
    },
    {
      id: 2,
      title: "Is it safe to make payments on Bossdent?",
      description:
        "Yes, all payments are 100% secure. We use trusted payment gateways with encryption to protect your details.",
    },
    {
      id: 3,
      title: "Are my card details stored anywhere in the Bossdent portal?",
      description:
        "No card details are stored on our website. All transactions are processed through secure payment partners.",
    },
    {
      id: 4,
      title: "Can I save my payment details for faster checkout?",
      description:
        "For security reasons, Bossdent does not store your card or UPI details. You will need to enter them each time you make a payment.",
    },
    {
      id: 5,
      title: "Do you support EMI (Easy Monthly Installments) on large orders?",
      description:
        "At present, we do not offer EMI options directly on the website. For very large institutional or bulk orders, please <a href='/contact'>contact us</a> for special arrangements.",
    },
    {
      id: 6,
      title:
        "What should I do if the payment fails, but the amount is deducted?",
      description:
        "Don’t worry. In such cases, the amount is usually refunded automatically to your bank account within 3–7 working days. If not, you can share your transaction details with our support team for quick help.",
    },
    {
      id: 7,
      title: "Is Cash on Delivery (COD) available?",
      description:
        "Yes, the COD option is available at Bossdent India. However, for COD, you have to pay an additional 25 Rs COD handling charge.",
    },
    {
      id: 8,
      title: "Is there any order value limit for Cash on Delivery?",
      description:
        "Yes. Cash on Delivery is available only for orders below Rs. 10,000. For orders above Rs. 10,000, you must place a prepaid order.",
    },
    {
      id: 9,
      title: "Can I change my payment method after selecting COD?",
      description:
        "Once an order is placed with COD, the payment method cannot be modified. You will need to cancel the order and place a new one with your preferred payment method.",
    },
    {
      id: 10,
      title: "How do I apply a coupon code or promo code?",
      description:
        "When you’re on the checkout page, enter your coupon code in the “Apply Coupon” box and click Apply. The discount will be shown in your order summary.",
    },
    {
      id: 11,
      title: "Can I use more than one coupon in a single order?",
      description: "No, only one coupon code can be used per order.",
    },
    {
      id: 12,
      title: "Can I use the same coupon code multiple times?",
      description:
        "Some coupons are single-use only, while others may be used multiple times.",
    },
    {
      id: 13,
      title: "How can I stay updated about new offers and discounts?",
      description:
        "Visit our website frequently to get updated about new offers, discounts, and newly launched products.",
    },
  ];
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  return (
    <div className="home-main pt-1 pt-lg-0">
      <section className="Breadcrumbs-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/help-center">Help</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/help-center/payment">Payment</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="payment-info-section profile-section">
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
            <HelpSideBar></HelpSideBar>
            <div className="rightside-bar col-lg-9 col-12">
              <h2 className="back-title"><Link to="/help-center"><i className="fa-solid fa-chevron-left"></i> Help</Link></h2>
              <h3 className="help-title">Payment</h3>
              <div className="payment-order-content my-4">
                <div
                  className="accordion help-order-accordion"
                  id="accordionExample"
                >
                  {paymentInfo?.map((item, index) => {
                    return (
                      <div className="accordion-item" key={index}>
                        <h2
                          className="accordion-header"
                          id={`heading${item?.id}`}
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${item?.id}`}
                            aria-expanded="false"
                            aria-controls={`collapse${item?.id}`}
                          >
                            {item?.title}
                          </button>
                        </h2>
                        <div
                          id={`collapse${item?.id}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading${item?.id}`}
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: item?.description,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentInfo;
