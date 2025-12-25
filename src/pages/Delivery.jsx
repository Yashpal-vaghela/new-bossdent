import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelpSideBar } from "../component/HelpSideBar";
import Loader2 from '../component/Loader2';

const Delivery = () => {
  const DeliveryInfo = [
    {
      id: 1,
      title: "Do you deliver to all cities in India?",
      description: "Yes, we deliver across most cities and towns in India.",
    },
    {
      id: 2,
      title: "Can I get same-day or next-day delivery in my city?",
      description:
        "Currently, same-day or next-day delivery is not available. Most orders are delivered within the standard delivery timelines.",
    },
    {
      id: 3,
      title: "Can I schedule delivery for a specific date or time?",
      description:
        "We use a third-party service provider for shipping all our orders. That’s why a specific date or time of delivery is not possible. Orders are delivered during standard courier working hours.",
    },
    {
      id: 4,
      title: "What are the shipping charges for my orders?",
      description:
        "On orders above 2300 Rs, we provide free shipping. For orders below 2300 Rs, shipping charges depend on your location, order size, and weight. The exact charge will be displayed at checkout before payment.",
    },
    {
      id: 5,
      title: "Do you offer free shipping?",
      description: "Yes, we offer free shipping on orders above 2300 Rs.",
    },
    {
      id: 6,
      title: "How long will it take to receive my order?",
      description:
        "Delivery usually takes 3–7 working days, depending on your city and the courier service. Remote or rural areas may take a little longer.",
    },
    {
      id: 7,
      title: "Can I contact the courier directly about my delivery?",
      description:
        "Yes, once your order is shipped, the courier’s details and tracking number will be shared with you. You can contact the courier directly if needed.",
    },
    {
      id: 8,
      title: "What happens if I am not available to receive my order?",
      description:
        "If you’re not available, the courier will usually make another delivery attempt. In some cases, they may also contact you for a suitable time.",
    },
    {
      id: 9,
      title: "What if the courier delivers to the wrong address?",
      description:
        "If your package is delivered to the wrong address, <a href='/contact'>contact us</a> right away. We will coordinate with the courier to resolve the issue quickly.",
    },
    {
      id: 10,
      title: "What happens if my order is lost in transit?",
      description:
        "If your order is lost during transit, we will either reship your order at no extra cost or provide a full refund.",
    },
    {
      id: 11,
      title: "Can I reschedule delivery if I missed it the first time?",
      description:
        "Yes, in most cases, the courier will attempt redelivery. You can also contact the courier directly using the tracking details to arrange a new time.",
    },
    {
      id: 12,
      title: "What happens if I am not available to receive my COD order?",
      description:
        "The courier will attempt delivery again. If the order cannot be delivered after multiple attempts, it may be returned to us. Repeated non-acceptance may affect future COD eligibility.",
    },
    {
      id: 13,
      title: "How do I report a delivery problem to Bossdent?",
      description:
        "You can <a href='/contact'>contact us</a> via phone or WhatsApp. Provide your order number and issue details, and our support team will resolve it as quickly as possible.",
    },
  ];
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="home-main pt-4">
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
      <section className="delivery-info-section">
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
            <div className="rightside-bar col-lg-9">
              <h2 className="back-title">
                <Link to="/help-center">
                  <i className="fa-solid fa-chevron-left"></i> Help
                </Link>
              </h2>
              <h3 className="help-title">Shipping & Delivery</h3>
              <div className="delivery-content my-4">
                <div
                  className="accordion help-order-accordion"
                  id="accordionExample"
                >
                  {DeliveryInfo?.map((item, index) => {
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

export default Delivery;
