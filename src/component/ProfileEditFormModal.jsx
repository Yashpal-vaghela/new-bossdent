import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useState } from 'react';
import BASE_URL from '../api/config';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AddToUser } from '../redux/userSlice';

const editSchema = yup.object().shape({
    email:yup.string().email("Email is not valid"),
    phone: yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    zipcode: yup.string().matches(/^[0-9]{6}$/, "Zipcode must be 6 digits"),
})
export const ProfileEditFormModal = ({States,user,token}) => {
    const originalValues = {
            first_name: Object.keys(user).length !== 0 ? user?.first_name : "",
            last_name: Object.keys(user).length !== 0 ? user?.last_name: "",
            address: Object.keys(user).length !== 0 ? user?.address : "",
            email: Object.keys(user).length !== 0 ? user?.email : "",
            city: Object.keys(user).length !== 0 ? user?.city : "",
            phone: Object.keys(user).length !== 0 ? user?.phone_number?.slice(2) : "",
            state: Object.keys(user).length !== 0 ? user?.state : "",
            zipcode: Object.keys(user).length !== 0 ? user?.zipcode : "",
    };
    console.log("user----",user);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: originalValues,
        enableReinitialize: true, 
        validationSchema:editSchema,
        validateOnChange:true,
        validateOnBlur:false,
        onSubmit:async ()=>{
            console.log("submit",formik?.values);
            const isSame = JSON.stringify(formik?.values) === JSON.stringify(originalValues);
            if(isSame){
                console.log("No Changes found - API Not Called");
                return;
            }
            console.log("Changes detected — calling API...", formik.values);
            await axios.post(`${BASE_URL}/save-user-data`,(formik?.values),{
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type": "application/json",                
                }
            }).then((res)=>{
                console.log("res",res.data);
                // setUser1({user:res.data.user_data});
                dispatch(AddToUser(res?.data?.user_data));
                // const modalEl = document.getElementById("EditformModal");
                // const modal =
                document.getElementById("EditformModal")?.classList.remove("show");
                document.querySelector(".modal-backdrop")?.remove();
                document.body.classList.remove("modal-open");
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
            })
            .catch((err)=>console.log("err",err))
        }
    })
    // console.log("user----------",user,formik?.values)
    return (
        <div className="modal fade" id="EditformModal" tabIndex="-1" aria-labelledby="EditformModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <h2>Edit Profile Details</h2>
                <form className="form edit-form" onSubmit={formik?.handleSubmit}>
                  <div className="d-block d-md-flex gap-3 align-items-start align-items-lg-center">
                    <div className="editInputBox">
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-control" placeholder="Your First Name" name="first_name" value={formik?.values.first_name || ""} onChange={formik?.handleChange}></input>
                    </div>
                    <div className="editInputBox">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" placeholder="Your Last Name" name="last_name" value={formik?.values?.last_name || ""} onChange={formik?.handleChange}></input>
                    </div>
                  </div>
                  <div className="editInputBox">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" placeholder="Your Address" name="address" value={formik?.values?.address || ""} onChange={formik?.handleChange}></input>
                  </div>
                  <div className="d-block d-md-flex gap-3 align-items-start align-items-lg-center">
                      <div className="editInputBox">
                        <label className="form-label">Email</label>
                        <input  type="email" className="form-control" placeholder="Enter Email Address" name="email" value={formik?.values?.email || ""} onChange={formik?.handleChange}></input>
                        {
                            formik?.errors?.email && <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.email}</p>
                        }
                      </div>
                      <div className="editInputBox">
                        <label className="form-label">City</label>
                        <input type="text" className="form-control" placeholder="Enter City" name="city" value={formik?.values?.city || ""} onChange={formik?.handleChange}></input>
                      </div>
                  </div>
                  <div className="d-block align-items-xl-center align-items-start gap-2 gap-xl-3 d-lg-flex">
                    <div className="editInputBox">
                        <label className="form-label">Phone</label>
                        <input type="text" className="form-control" placeholder="Enter Phone Number" name="phone" maxLength={10} value={formik.values?.phone || ""} onChange={formik?.handleChange}></input>
                        {formik?.errors?.phone && (
                            <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.phone}</p>
                        )}
                    </div>
                    <div className="editInputBox">
                      <label className="form-label">State</label>
                      <select className="form-select" name="state" value={formik?.values?.state || ""} onChange={formik?.handleChange}>
                        <option>Select state</option>
                        {
                          States?.map((state,index)=>{
                            return(
                              <option value={state?.name} key={index}>{state?.value}</option>
                            )
                          })
                        }
                      </select>
                    </div>
                    <div className="editInputBox">
                      <label className="form-label">Zipcode</label>
                      <input type="text" className="form-control" name="zipcode" placeholder="Zipcode" maxLength="6" value={formik?.values?.zipcode || ""} onChange={formik?.handleChange}></input>
                      {formik?.errors?.zipcode &&(
                        <p className="text-danger my-1 my-lg-0 my-xl-1">{formik?.errors?.zipcode}</p>
                      )}
                    </div>
                  </div>
                  <button className="btn-edit btn w-100 my-3" type="submit">Save Details</button>
                  {/* <div className="d-block d-md-flex">
                    <button className="btn-edit btn">Edit Profile</button>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
    )
}
