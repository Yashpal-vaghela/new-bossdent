import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HelpSideBar } from "../component/HelpSideBar";

const Order = () => {
  const phone = "+917698828883";
  const OrderInfo = [
    {
      id: 1,
      title: "How to place a new order on the Bossdent website?",
      description:
        "Browse our products, add the items you need to your cart, and proceed to checkout. Enter your delivery details, select a payment method, and confirm your order.",
    },
    {
      id: 2,
      title: "Do I need a GST number to shop on Bossdent?",
      description:
        "No, a GST number is not required for shopping. It is optional and only needed if you want your GST number to appear on the invoice for business claims.",
    },
    {
      id: 3,
      title: "Do you provide GST invoices with every order?",
      description:
        "Yes, every order comes with a proper GST invoice. If you provide your GST number during checkout, it will be included on your invoice.",
    },
    {
      id: 4,
      title: "Can I track my order in real-time?",
      description:
        "Yes, once your order is shipped, you’ll receive a tracking link via email or SMS. You can use this link to follow your package until delivery.",
    },
    {
      id: 5,
      title: "Can I order in bulk for my dental clinic or hospital?",
      description: `Absolutely. We supply clinics, hospitals, and distributors with bulk quantities. You can place a large order directly through our website or <a href='tel:${phone}'>contact our support team</a> for assistance.`,
    },
    {
      id: 6,
      title: "Do you offer discounts for bulk orders?",
      description: `Yes, we provide special pricing for bulk or recurring orders. Please <a href='tel:${phone}'>reach out to our support team</a> for customised quotations.`,
    },
    {
      id: 7,
      title: "Can I place an international order outside India?",
      description: `Currently, Bossdent serves customers across India. For international orders, please <a href='tel:${phone}'>contact our support team</a> to discuss possibilities and shipping options.`,
    },
    {
      id: 8,
      title: "Can I request a quotation before confirming a bulk order?",
      description:
        "Yes, if you need a formal quotation for your clinic, hospital, or institution, our team will be happy to provide one. Just <a href='/contact'>contact us</a> with your requirements.",
    },
    {
      id: 9,
      title: "Do you have a minimum order value for free shipping?",
      description:
        "Yes, we offer free shipping above 2300 Rs. The exact threshold will be displayed at checkout.",
    },
    {
      id: 10,
      title: "Can I change my delivery address after placing the order?",
      description: `If your order has not yet been shipped, you can <a href='tel:${phone}'>contact our support team</a> to update your delivery address. Once shipped, the address cannot be changed.`,
    },
    {
      id: 11,
      title: "Can I change the items in my order after checkout?",
      description:
        "Orders cannot be modified once placed. If you need to make changes, we suggest cancelling the order before it is shipped and placing a new one.",
    },
    {
      id: 12,
      title: "How do I cancel my order before it ships?",
      description: `To cancel, log in to your account, go to “My Orders,” and select Cancel. You can also <a href='tel:${phone}'>contact our support team.</a> Once shipped, cancellations are no longer possible.`,
    },
    {
      id: 13,
      title:
        "How do I contact Bossdent if I face issues while placing an order?",
      description:
        "You can reach us via email, phone, or WhatsApp. Our support team is always ready to assist you with any order-related concerns. Contact details are available on our <a href='/contact'>Contact Us</a> page.",
    },
  ];
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="home-main pt-0 pt-lg-0">
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
                <Link to="/help-center/order">Order</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="order-info-section profile-section">
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
              <h2 className="back-title">
                <Link to="/help-center">
                  <i className="fa-solid fa-chevron-left"></i> Help
                </Link>
              </h2>
              <h3 className="help-title">Order</h3>
              <div className="help-order-content my-4">
                <div
                  className="accordion help-order-accordion"
                  id="accordionExample"
                >
                  {OrderInfo?.map((item, index) => {
                    return (
                      <div className="accordion-item" key={index}>
                        <h2
                          className="accordion-header"
                          id={`heading${item.id}`}
                        >
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${item?.id}`}
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            {item?.title}
                          </button>
                        </h2>
                        <div
                          id={`collapse${item.id}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading${item.id}`}
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

export default Order;
