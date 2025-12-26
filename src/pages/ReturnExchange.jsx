import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Loader2 from "../component/Loader2";
import { useSelector } from "react-redux";

const ReturnExchangeSchema = yup.object().shape({
  first_name: yup.string().required("First Name field is required"),
  last_name:yup.string().required("Last Name field is required"),
  contact_number: yup
    .number()
    .min(10, "The phone number must be a vaild number.")
    .required("Phone field is required"),
  order_number: yup
    .number()
    .min(4, "Order number min 4 digit enter")
    .required("Order Number field is required"),
  query: yup.string().required("query field is required"),
  return_or_replace: yup.string().required("Choose Option field is required"),
});

export const ReturnExchange = () => {
  const [apiloading,setApiLoading] = useState(false);
  const user = useSelector((state)=>state.user.user);
  const initialValues = {
    first_name: Object.keys(user).length !== 0 ? user?.first_name : "",
    last_name:Object.keys(user).length !== 0 ? user.last_name : "",
    contact_number: Object.keys(user).length !== 0 ? user.phone_number : "",
    order_number: "",
    query: "",
    return_or_replace: "",
  };
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues,
    validationSchema: ReturnExchangeSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async () => {
      const userLoggedIn = !!localStorage.getItem("auth_token");
      if (userLoggedIn) {
        setApiLoading(true);
        await axios
          .post(
            `https://admin.bossdentindia.com/wp-json/custom/v1/return-exchange`,
            {
              first_name: formik?.values.first_name,
              last_name: formik?.values.last_name,
              contact_number: formik?.values.contact_number,
              order_number: formik?.values.order_number,
              query: formik?.values.query,
              return_or_replace: formik?.values.return_or_replace,
            }
          )
          .then((response) => {
            setApiLoading(false);
            navigate("/");
            console.log("res", response);
          })
          .catch((error) =>{ setApiLoading(false);console.log("error", error)});
      }
    },
  });
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
                <Link to="/return-exchange">Return And Exchange</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      {apiloading && <Loader2></Loader2>}
      <section className="return-exchange-section">
        <div className="container">
          <div className="return-header-wrapper pt-2 pb-2">
            <h1 className="return-content-title text-center text-white">
              Contact us for Return & Exchange product
            </h1>
            <p className="text-center">
              We will contact you as soon as possible. Please enter your order
              details in the below form, It will help us for resolve your query.
            </p>
          </div>
          <div className="row mt-lg-5 mb-5 pb-3">
            <div className="col-lg-6 col-md-12 order-lg-1 order-2">
              <form
                className="form return-form"
                onSubmit={formik?.handleSubmit}
              >
                <div
                  className={`${formik?.errors?.first_name ? "my-3" : "mb-4"}`}
                >
                  <input
                    className="form-control"
                    placeholder="Enter First Name"
                    name="first_name"
                    type="text"
                    value={formik?.values?.first_name || ""}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  ></input>
                  {formik?.errors?.first_name && (
                    <span className="return-form-error">
                      {formik?.errors?.first_name}
                    </span>
                  )}
                </div>
                <div className={`${formik?.errors?.last_name ? "my-3" : "mb-4"}`}>
                  <input className="form-control" placeholder="Enter Last Name" name="last_name" type="text" value={formik?.values.last_name || ""} onChange={formik?.handleChange} onBlur={formik?.handleBlur}></input>
                  {formik?.errors?.last_name && (
                    <span className="return-form-error">{formik?.errors?.last_name}</span>
                  )}
                </div>
                <div
                  className={`${
                    formik?.errors?.contact_number ? "my-3" : "mb-4"
                  }`}
                >
                  <input
                    className="form-control"
                    placeholder="Phone Number"
                    name="contact_number"
                    type="number"
                    value={formik?.values?.contact_number || ""}
                    // onChange={formik?.handleChange}
                    // onBlur={formik?.handleBlur}
                  ></input>
                  {/* {formik?.errors?.contact_number && (
                    <span className="return-form-error">
                      {formik?.errors?.contact_number}
                    </span>
                  )} */}
                </div>
                <div
                  className={`${
                    formik?.errors?.order_number ? "my-3" : "mb-4"
                  }`}
                >
                  <input
                    className="form-control"
                    placeholder="Order Number"
                    name="order_number"
                    type="number"
                    maxLength={4}
                    minLength={4}
                    value={formik?.values?.order_number || ""}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  ></input>
                  {formik?.errors?.order_number && (
                    <span className="return-form-error">
                      {formik?.errors?.order_number}
                    </span>
                  )}
                </div>
                <div className={`${formik?.errors?.query ? "my-3" : "mb-4"}`}>
                  <textarea
                    className="form-control"
                    placeholder="Please enter yout query..."
                    name="query"
                    type="text"
                    rows="3"
                    value={formik?.values.query || ""}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  ></textarea>
                  {formik?.errors?.query && (
                    <span className="return-form-error">
                      {formik?.errors?.query}
                    </span>
                  )}
                </div>
                <div
                  className={`${
                    formik?.errors?.return_or_replace ? "my-3" : "mb-4"
                  }`}
                >
                  <div className="return-choose-option d-flex align-items-center ">
                    <div className="d-flex align-items-center form-check me-5">
                      <input
                        type="radio"
                        className="form-check-input mx-2"
                        name="return_or_replace"
                        value="return"
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      ></input>
                      <label className="form-check-label">&nbsp;Return</label>
                    </div>
                    <div className="d-flex align-items-center form-check mx-4">
                      <input
                        type="radio"
                        className="form-check-input mx-2"
                        name="return_or_replace"
                        value="replace"
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      ></input>
                      <label className="form-check-label">&nbsp;Replace</label>
                    </div>
                  </div>
                  {formik?.errors?.return_or_replace && (
                    <span className="return-form-error">
                      {formik?.errors?.return_or_replace}
                    </span>
                  )}
                </div>
                <button type="submit" className="btn btn-submit w-100 mb-3">
                  Submit Now
                </button>
              </form>
            </div>
            <div className="col-lg-6 col-md-12 order-lg-2 order-1">
              <img
                src="/img/refund-exchange-img.webp"
                alt="refund-exchange-img"
                className="img-fluid"
              ></img>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
