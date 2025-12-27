import axios from "axios";
import React, { useEffect, useState,useRef } from "react";
import BASE_URL from "../api/config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchCart } from "../redux/cartSlice";
import { fetchWishList } from "../redux/wishlistSlice";
import { fetchUser } from "../redux/userSlice";
import { AddToken } from "../redux/authSlice";

const LoginDialogBox = () => {
  const [formvalue, setformValue] = useState("");
  const [step, setStep] = useState(1);
  const [time, setTime] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRequestOTP = async (e, action) => {
    if (formvalue?.phone_number || formvalue !== "") {
      if (action === "login") {
        setStep(2);
        setTime(60);
        setShowResend(false);
        await axios
          .post(`${BASE_URL}/login/request-otp`, formvalue, {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Basic ODA3M2FiM2JjODo3ZTlmNTFlZDc5YjIxMTlmYTJmZA==",
            },
          })
          .then((response) => {
            console.log("response", response);
          })
          .catch((err) => console.log("err", err));
      } else {
        await axios
          .post(`${BASE_URL}/login/resend-otp`, formvalue, {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Basic ODA3M2FiM2JjODo3ZTlmNTFlZDc5YjIxMTlmYTJmZA==",
            },
          })
          .then((res) => console.log("res", res))
          .catch((err) => console.error("error", err));
      }
    } else {
      toast.error("please enter phone number");
      return;
    }
  };
  const handleChange = (e) => {
    const { name } = e?.target;
    const value = e.target.value.replace(/\D/g, "");
    // setformValue({ [name]: value });
    if (value.length <= 10) {
      setformValue({ [name]: value });
    }
  };

  useEffect(() => {
    if (step !== 2 || showResend) return; // stop if showing resend

    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, showResend]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      // If current box has value, clear it
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }

      // If empty → move focus to previous input
      if (index > 0) {
        const prevInput = e.target.previousSibling;
        if (prevInput) prevInput.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmitOTP = async (e, index) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next box automatically
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }

    // If all boxes are filled → Verify OTP
    if (newOtp.every((digit) => digit !== "")) {
      const finalOtp = newOtp.join("");

      try {
        const res = await axios.post(`${BASE_URL}/login/verify-otp`, {
          phone_number: formvalue.phone_number,
          otp: finalOtp,
        });
        localStorage.setItem("auth_token", JSON.stringify(res.data.token));
        document.querySelector("#exampleModal .btn-close").click();
        setTimeout(() => {
          setStep(1);
          setformValue("");
          setTime(60);
          setShowResend(false);
          setOtp(["", "", "", "", "", ""]);
          const redirectPath = location.pathname || "/";
          navigate(redirectPath);
        }, 2000);
        // const modalElement = document.querySelectorAll(".modal");
        const modal = document.getElementById("exampleModal");
        const isModalOpen = modal && modal.classList.contains("show");
        if (isModalOpen) {
          modal.classList.remove("show");
          modal.style.display = "none";
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        }

        // navigate("/profile");
        toast.success("OTP verified successfully!");
        const controller = new AbortController();
        dispatch(fetchCart(undefined, { signal: controller.signal }));
        dispatch(fetchWishList(undefined, { signal: controller.signal }));
        dispatch(fetchUser(undefined, { signal: controller.signal }));
        dispatch(AddToken(res.data.token));
        return () => {
          controller.abort(); // cleanup on unmount
        };
      } catch (err) {
        toast.error("Invaild OTP, Please Enter correct OTP.");
        // console.error("❌ OTP Verification Failed:", err);
      }
    }
  };
  const modalRef = useRef(null);
  const handleClose = () => {
    const modal = window.bootstrap.Modal.getInstance(modalRef.current) ||
    new window.bootstrap.Modal(modalRef.current);
    console.log("modal",modal)
    modal.hide();
  };
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      // aria-hidden="true"
      // data-bs-backdrop="static"
      data-bs-keyboard="false"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              // data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            {step === 1 ? (
              <>
                <div className="d-flex justify-content-between align-items-center ">
                  <h5 className="modal-title">
                    <img
                      src="/img/singin.svg"
                      className="img-fluid mx-3"
                      alt="sign-in-icon"
                      width="20"
                      height="20"
                    ></img>
                    Sign in
                  </h5>
                  <img
                    src="/img/logo2.svg"
                    className="img-fluid"
                    alt="logo"
                  ></img>
                </div>
                <div className="form-wrapper phone-box">
                  <span>+91</span>
                  <input
                    className="form-control w-100"
                    placeholder="Phone number"
                    type="number"
                    name="phone_number"
                    value={formvalue?.phone_number || ""}
                    onChange={handleChange}
                    maxLength={10}
                  ></input>
                </div>
                <button
                  className="btn btn-sendOTP text-white"
                  onClick={(e) => handleRequestOTP(e, "login")}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-block">
                    <h5 className="modal-title">
                      <img
                        src="/img/requestOTP-icon.svg"
                        className="img-fluid mx-2"
                        alt="sign-in-icon"
                        width="25"
                        height="25"
                      ></img>
                      OTP Verification
                    </h5>
                    <p className="mb-0 ms-2">
                      Enter 6- Digit OTP sent to whatsapp
                    </p>
                  </div>
                  <img
                    src="/img/logo2.svg"
                    className="img-fluid"
                    alt="logo"
                  ></img>
                </div>
                <div className="otp-inputs mt-4 d-flex ">
                  {otp.map((value, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className="otp-box"
                      value={value}
                      onChange={(e) => handleSubmitOTP(e, i)}
                      onKeyDown={(e) => handleBackspace(e, i)}
                    />
                  ))}
                </div>
                <div className="text-center my-5 resend-wrapper">
                  {!showResend ? (
                    <div className="timer">{formattedTime}</div>
                  ) : (
                    <button
                      className="btn btn-sendOTP text-white"
                      onClick={(e) => handleRequestOTP(e, "resend")}
                    >
                      Resend OTP
                    </button>
                  )}
                  <p className="mb-2">or</p>
                  <Link
                    to="#"
                    onClick={() => setStep(1)}
                    className="d-inline-block mb-2"
                  >
                    Edit Number
                  </Link>
                  <p className="mb-2">
                    Need help? <Link to="#">Connect with us</Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDialogBox;
