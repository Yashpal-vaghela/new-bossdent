import { useEffect } from "react";
import { useSelector } from "react-redux";
import {  useLocation, useNavigate } from "react-router-dom";
import useValidateUser from "./useValidateUser";
// import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const validateUser = useValidateUser();
  const token = useSelector((state) => state.auth.token);
  // const token1 = JSON.parse(localStorage.getItem("token"));
  // const [authToken] = useState(token || token1);
  // console.log("authToken", authToken,typeof authToken);

  // const token = localStorage.getItem("auth_token");
  // const cartdata = useSelector((state) => state.cart.cart);

  /* eslint-disable react-hooks/exhaustive-deps */
  // useEffect(()=>{
  //   if(!authToken || authToken === "null"){
  //     localStorage.setItem("redireact_after_login",location.pathname);
  //     validateUser();
  //   }
  // },[])
  useEffect(() => {
    if (!token) {
      localStorage.setItem(
        "redireact_after_login",
        location.pathname
      );

      validateUser();
      navigate("/", { replace: true });
    }
  }, [token, location.pathname, navigate, validateUser]);

  if (!token) return null;

  // if(!authToken || authToken === "null"){
  //   localStorage.setItem("redireact_after_login",location.pathname);
  //   navigate("/");
  //   validateUser();
  //   return null;
  // }
  return children;
};

export default ProtectedRoute;
