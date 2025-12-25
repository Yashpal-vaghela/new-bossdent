import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelpSideBar } from "../component/HelpSideBar";

const Return = () => {
  const ReturnInfo = [
    {
      id: 1,
      title: "What is Bossdent’s return policy?",
      description:"We accept returns only for damaged, defective, wrong, or incomplete products. Because dental supplies are sensitive and regulated, many items cannot be returned once opened or used. Check our detailed <a href='/refund-and-returns-policy'>return & refund policy</a> here.",
    },
    {
      id: 2,
      title: "Which products are eligible for return?",
      description:
        "Products that are received in a damaged condition, wrongly delivered, or incomplete (missing items) are eligible for return. Furthermore, you can check our detailed <a href='/refund-and-returns-policy'>return & refund policy</a> here.",
    },
    {
      id: 3,
      title: "Can opened or used products be returned?",
      description:
        "No, opened or used products cannot be returned for hygiene and safety reasons.",
    },
    {
      id: 4,
      title: "Can disposable items like gloves and masks be returned?",
      description:
        "Disposable products can only be replaced if they are delivered in a damaged or defective condition. Otherwise, they are not eligible for return.",
    },
    {
      id: 5,
      title: "Do you allow returns on bulk orders?",
      description:
        "Bulk orders are generally not eligible for returns unless the items are received damaged, defective, or incorrect.",
    },
    {
      id: 6,
      title: "How long do I have to request a return after delivery?",
      description:
        "You must raise a return request within 72 hours (3 days) of receiving your order. After this period, returns cannot be accepted.",
    },
    {
      id: 7,
      title: "How do I request a return?",
      description:
        "You can contact our customer support via phone or WhatsApp with your order details. Our team will guide you through the process.",
    },
    {
      id: 8,
      title: "What details do I need to provide for a return request?",
      description:
        "Please share your order number, product details, reason for return, and supporting proofs (if applicable) with our support team.",
    },
    {
      id: 9,
      title: "How long does it take to process a return request?",
      description:
        "Once you submit your request, our team reviews it within 2–4 working days and updates you with the next steps.",
    },
    {
      id: 10,
      title: "Who pays for the return shipping charges?",
      description:
        "If the return is due to a Bossdent error (wrong, defective, or damaged product), we cover the return shipping cost. Otherwise, customers may need to bear the cost.",
    },
    {
      id: 11,
      title: "Will Bossdent arrange pickup for returned items?",
      description:
        "Yes, in most cases we arrange a courier pickup. If pickup service is not available at your PIN code, you may need to ship it back yourself, and we’ll guide you on how to do it.",
    },
    {
      id: 12,
      title: "What happens if I send the return without approval?",
      description:
        "Returns sent without approval will not be accepted, and no refund will be issued. Please always raise a return request first.",
    },
    {
      id: 13,
      title:"How long does it take to receive a refund after order cancellation?",
      description:"Refunds are usually processed within 3–7 working days after approval of the return.",
    },
    {
      id: 14,
      title:"What happens if the refund doesn’t appear in my account on time?",
      description:"If your refund doesn’t appear after 7 working days, please contact our support team with your transaction details, and we’ll check with the payment gateway or bank.",
    },
    {
      id: 15,
      title:"Can I exchange a product for a different size, pack, or variation?",
      description:"Exchanges are not possible at the moment. You will need to place a new order for the variation you need.",
    },
    {
      id: 16,
      title:"What should I do if I receive a damaged product?",
      description:"If you receive a damaged product, take photos immediately and contact our support team within 72 hours. We’ll arrange a replacement or refund as per policy.",
    },
    {
      id: 17,
      title:"What if I receive the wrong product in my order?",
      description:"If you receive the wrong product, notify us within 72 hours with proof. We’ll arrange for the correct product to be shipped to you at no extra cost.",
    },
    {
      id: 18,
      title:"What should I do if my order is missing items?",
      description:"If items are missing from your order, contact us within 72 hours. After verification, we’ll either ship the missing items or issue a refund.",
    },
    {
      id: 19,
      title:"What if the product I received is defective?",
      description:"For defective items, please contact us with photos/videos of the issue. If verified, we’ll provide a replacement or refund.",
    },
    {
      id: 20,
      title:"Do I need to provide proof for a damaged item?",
      description:"Yes, to be eligible for replacement or refund, an unboxing video is required. Moreover, photos of the damaged product and packaging are necessary so we can process your claim quickly.",
    },
    {
      id: 21,
      title:"Can I return an item that stopped working after use?",
      description:"If the product stopped working due to a manufacturing defect and is under warranty (for equipment like airotors/handpieces), it may be covered. Otherwise, used items cannot be returned.",
    },
  ];
 useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
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
                <Link to="/help-center/return">Return</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="return-info-section profile-section">
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
                <h3 className="help-title">Return & Refund</h3>
                <div className="help-order-content mt-3 mt-xl-4">
                  <div className="accordion help-order-accordion" id="accordionExample">
                    {ReturnInfo?.map((item,index)=>{
                      return(
                        <div className="accordion-item" key={index}>
                          <h2 className="accordion-header" id={`heading${item.id}`}>
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
                              <p dangerouslySetInnerHTML={{ __html: item?.description }}/>
                            </div>
                          </div>
                      </div>
                      )
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

export default Return;