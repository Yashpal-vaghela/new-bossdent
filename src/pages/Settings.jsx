import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Indian_states_cities_list from "indian-states-cities-list";
import { ProfileSideBar } from "../component/ProfileSideBar";
import axios from "axios";
import BASE_URL from "../api/config";
import { AddToUser } from "../redux/userSlice";

export const Settings = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state)=>state.auth.token);
  const [States, setStates] = useState([]);
  const dispatch = useDispatch();
  const originalValues = {
    first_name: Object.keys(user).length !== 0 ? user?.first_name : "",
    last_name: Object.keys(user).length !== 0 ? user?.last_name : "",
    address: Object.keys(user).length !== 0 ? user?.address : "",
    email: Object.keys(user).length !== 0 ? user?.email : "",
    city: Object.keys(user).length !== 0 ? user?.city : "",
    phone_number: Object.keys(user).length !== 0 ? user?.phone_number.slice(2) : "",
    state: Object.keys(user).length !== 0 ? user?.state : "",
    zipcode: Object.keys(user).length !== 0 ? user?.zipcode : "",
    country: "In" || "",
    gst_number: "",
    company_name: "",
  };
  const formik = useFormik({
    initialValues: originalValues,
    enableReinitialize: true,
    // validationSchema:false,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async () => {
      // console.log("formik submit",formik?.values);
      const isSame =
        JSON.stringify(formik?.values) === JSON.stringify(originalValues);
      if (isSame) {
        console.log("No Changes found - API Not Called");
        return;
      }
      await axios.post(`${BASE_URL}/save-user-data`,(formik?.values),{
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
        }
      }).then((res)=>{
        dispatch(AddToUser(res?.data?.user_data));
      }).catch((err)=>console.log("err",err));
      console.warn("save user data api calling");
      navigate("/profile");
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStates(Indian_states_cities_list?.STATES_OBJECT);
  }, []);
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
                <Link to="/profile">Profile</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="profile-section setting-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 setting-content-wrapper profile-content-wrapper">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                href="#offcanvasExample1"
                aria-controls="offcanvasExample1"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <ProfileSideBar></ProfileSideBar>
            </div>
            <div className="col-lg-9 setting-details-wrapper">
              <div className="setting-header">
                <h2>Account Settings</h2>
                <button
                  className="btn btn-save"
                  type="submit"
                  onClick={() => formik.handleSubmit()}
                >
                  Save Changes
                </button>
              </div>
              <form className="form" onSubmit={formik?.handleSubmit}>
                <div className="d-flex setting-profile-content gap-md-3 justify-content-between align-items-center">
                  <div className="setting-profile-left w-100 order-md-1 order-2">
                    <div className="profileInputBox">
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="first_name"
                        placeholder="Enter Your First Name"
                        value={formik?.values?.first_name || ""}
                        onChange={formik?.handleChange}
                      ></input>
                    </div>
                    <div className="profileInputBox">
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="last_name"
                        value={formik?.values?.last_name || ""}
                        onChange={formik?.handleChange}
                        placeholder="Enter Your Last Name"
                      ></input>
                    </div>
                    <div className="profileInputBox">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder="Enter Your Email Address"
                        value={formik?.values?.email || ""}
                        onChange={formik?.handleChange}
                      ></input>
                    </div>
                    <div className="profileInputBox">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control"
                        type="text"
                        name="phone_number"
                        placeholder="Enter Your Phone Number"
                        value={formik?.values?.phone_number}
                      ></input>
                    </div>
                  </div>
                  <div className="setting-profile-right w-50 mt-md-0 mb-md-0 mt-4 mb-1 order-md-2 order-1">
                    <i className="fa-solid fa-circle-user"></i>
                  </div>
                </div>
                <div className="setting-billing-section ">
                  <div className="card-header">
                    <h2>Billing Address</h2>
                  </div>
                  <div className="card-body">
                    <div className="d-md-flex d-block align-items-center gap-3">
                      <div className="profileInputBox">
                        <label className="form-label">GST Number</label>
                        <input
                          className="form-control"
                          type="number"
                          name="gst_number"
                          placeholder="Enter GST Number"
                          value={formik?.values?.gst_number || ""}
                          onChange={formik?.handleChange}
                        ></input>
                      </div>
                      <div className="profileInputBox">
                        <label className="form-label">
                          Company Name(optional)
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="company_name"
                          placeholder="Enter company name"
                          value={formik?.values?.company_name || ""}
                          onChange={formik?.handleChange}
                        ></input>
                      </div>
                    </div>
                    <div className="profileInputBox">
                      <label className="form-label">Street Address</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Your Address"
                        name="address"
                        value={formik?.values?.address || ""}
                        onChange={formik?.handleChange}
                      ></input>
                    </div>
                    <div className="d-md-flex d-block align-items-center justify-content-between gap-4">
                      <div className="profileInputBox w-100">
                        <label className="form-label">States</label>
                        <select
                          className="form-select"
                          name="state"
                          value={formik?.values?.state || ""}
                          onChange={formik?.handleChange}
                        >
                          <option>Select state</option>
                          {States?.map((state, index) => {
                            return (
                              <option value={state?.name} key={index}>
                                {state?.value}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="profileInputBox w-100">
                        <label className="form-label">City</label>
                        <input type="text" className="form-control" placeholder="Enter City" name="city" value={formik?.values.city || ""} onChange={formik?.handleChange}></input>
                        {
                          formik?.errors?.city && <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.city}</p>
                        }
                      </div>
                      <div className="profileInputBox w-100">
                        <label className="form-label">Zipcode</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Zipcode"
                          name="zipcode"
                          value={formik?.values?.zipcode || ""}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
