import { Navigate, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useValidateUser from "./useValidateUser";

const ProtectedOrderRoute = ({ children }) => {
  const location = useLocation();
  const validateUser = useValidateUser();
  const token = useSelector((state) => state.auth.token);
  // const token1 = JSON.parse(localStorage.getItem("auth_token"));
  const calledRef = useState(false);
  // const authtoken = token1 ? token1 : token;
  // const [authtoken] = useState(token1 ? token1 : token);
  const cartData = useSelector((state) => state.cart.cart);
  // console.log("token", token, token1, "authToken", authtoken,"cartDtaa",cartData);
  // console.log("authToken---",authtoken,authtoken === "null");

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!token && !calledRef.current) {
      calledRef.current = true;
      localStorage.setItem("redirect_after_login", location.pathname);
      validateUser(); // modal / redirect
    }
  }, [token, location.pathname, validateUser]);

  if (!token) {
    if (cartData?.items?.length === 0) {
      return <Navigate to="/products" state={{ from: location.pathname}} replace />;
    }
    return null; // wait for login modal
  }

  return children;
};

export default ProtectedOrderRoute;
