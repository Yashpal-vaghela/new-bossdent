import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as yup from "yup";
import Loader2 from "../component/Loader2";

const ContactSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name field is required."),

  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email field is required."),

  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone is required"),

  subject: yup.string().required("Subject Field is required."),

  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message Field is required."),
});

export const Contact = () => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };

  const [apiloading, setApiLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: ContactSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async () => {
      const userLoggedIn = !!localStorage.getItem("auth_token");

      if (userLoggedIn) {
        setApiLoading(true);

        try {
          const res = await axios.post(
            "https://admin.bossdentindia.com/wp-json/custom/v1/submit-form",
            {
              name: formik.values.name,
              email: formik.values.email,
              phone: formik.values.phone,
              subject: formik.values.subject,
              message: formik.values.message,
            }
          );

          setApiLoading(false);
          formik.resetForm();
          toast.success("Form submitted successfully.");
          console.log("res", res);
        } catch (err) {
          setApiLoading(false);
          toast.error("There was an error submitting the form.");
          console.log("err", err);
        }
      }
    },
  });

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
                <Link to="/contact">Contact</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {apiloading && <Loader2 />}

      <section className="contact-section my-4 my-md-5">
        <div className="container">
          <div className="row pt-2 pb-4 gap-3 gap-sm-0">
            <div className="col-lg-6 mx-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22653.660484652923!2d72.893032!3d21.29031055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0474f4845eac3%3A0x15ce59a9f50ccaf5!2sAdvance%20Dental%20Export!5e=0!3m2!1sen!2sin!4v1724932357670!5m2!1sen!2sin"
                width="90%"
                height="90%"
                className="d-flex mx-auto rounded-3"
                title="Google Maps"
              ></iframe>
            </div>

            <div className="col-lg-6">
              <div className="contact-details-content">
                <h2>Have You any Suggestion or Queries?</h2>
                <p className="text-center">
                  Fill in the below form and we will get in touch with you as
                  soon as possible.
                </p>

                <form className="form contact-form" onSubmit={formik.handleSubmit}>
                  
                  {/* Name */}
                  <div className={`${formik.touched.name && formik.errors.name ? "my-3" : "mb-4"}`}>
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-danger m-0">{formik.errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className={`${formik.touched.email && formik.errors.email ? "my-3" : "mb-4"}`}>
                    <input
                      className="form-control"
                      type="text"
                      name="email"
                      placeholder="E-mail"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-danger m-0">{formik.errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className={`${formik.touched.phone && formik.errors.phone ? "my-3" : "mb-4"}`}>
                    <input
                      className="form-control"
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formik.values.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          formik.setFieldValue("phone", value);
                        }
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-danger m-0">{formik.errors.phone}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className={`${formik.touched.subject && formik.errors.subject ? "my-3" : "mb-4"}`}>
                    <input
                      className="form-control"
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <p className="text-danger m-0">{formik.errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className={`${formik.touched.message && formik.errors.message ? "my-3" : "mb-4"}`}>
                    <textarea
                      className="form-control"
                      name="message"
                      placeholder="Message"
                      rows="3"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.message && formik.errors.message && (
                      <p className="text-danger m-0">{formik.errors.message}</p>
                    )}
                  </div>

                  <button
                    className="btn contact-btn"
                    type="submit"
                    disabled={!formik.isValid || apiloading}
                  >
                    Submit Now
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-info-wrapper d-flex justify-content-between row text-white mt-4 mt-md-4 pb-md-5 pb-3">
            <div className="contact-info-email contact-link-wrapper col-lg-3 col-md-6 col-12">
              <div className="email-icon contact-info-icon">
                <img src="/img/email-icon.svg" alt="" className="img-fluid" />
              </div>
              <p>Email</p>
              <Link to="mailto:zahndentaldepo@gmail.com">
                zahndentaldepo@gmail.com
              </Link>
            </div>

            <div className="contact-info-location contact-link-wrapper col-lg-5 col-md-6 col-12">
              <div className="contact-info-icon">
                <img src="/img/location-icon.svg" alt="" className="img-fluid" />
              </div>
              <p>Location</p>
              <span className="text-center d-block">
                Plot No. 1 to 8, Marutidham Industrial Estate, Behind Hotel
                Royal, Velanja Road, Umra, Surat-394130, Gujarat
              </span>
            </div>

            <div className="contact-info-contact contact-link-wrapper col-lg-3 col-md-6 col-12">
              <div className="contact-info-icon">
                <img src="/img/grident-call-icon.svg" alt="" className="img-fluid" />
              </div>
              <p>Phone</p>
              <Link to="tel:+917698828883">+91 76988 28883</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};