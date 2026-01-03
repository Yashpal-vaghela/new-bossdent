// import React, { useState,useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";

export const ContactModal = ({ isOpen ,setOpen}) => {
  const modalRef = useRef();
  const handleClose = () =>{
    const modal = document.getElementById("contactModal");
    const isModalOpen = modal && modal.classList.contains("show");
  
    if (isModalOpen) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      setOpen(false);
    }else{
      setOpen(true);
    }
  }

  return (
    <div
      className={`modal fade contact-details-modal ${isOpen ? "show d-block" : ""}`}
      ref={modalRef}
      id="contactModal"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="contactModalLabel">
              Contact Details
            </h4>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-2">This product is available on customization only.</p>
            <p className="mb-2">Please contact our team for size, design and order details.</p>
            <span className="d-flex align-items-center justify-content-between mb-3">
              <Link to="tel:+917698828883" className="text-grident">
                +91 76988 28883
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
