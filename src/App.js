import React, { useEffect} from "react";
import "./App.css";
import { Allrouters } from "./component/Allrouters";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import { BrowserRouter } from "react-router-dom";
import "./css/common.css";
import "./css/navbar.css";
import "./css/home.css";
import "./css/footer.css";
import "./css/product.css";
import "./css/cart.css";
import "./css/login.css";
import "./css/support.css";
import "./css/contact.css";
import "./css/about.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./redux/cartSlice";
import { fetchWishList } from "./redux/wishlistSlice";
import { fetchUser } from "./redux/userSlice";
import { fetchCategories } from "./redux/categorySlice";
import Loader2 from "./component/Loader2";

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.category.loading);
  const token = useSelector((state)=>state.auth.token);
  
  useEffect(() => {
    if (!token) return;
      const controller = new AbortController();
      dispatch(fetchUser(undefined, { signal: controller.signal }));
      dispatch(fetchCart(undefined, { signal: controller.signal }));
      dispatch(fetchWishList(undefined, { signal: controller.signal }));
    return () => {
      controller.abort(); // cleanup on unmount
    };
  }, []);
  
  useEffect(() => {
    const controller = new AbortController();
    dispatch(fetchCategories(undefined, { signal: controller.signal }));
    return () => {
      controller.abort(); // cleanup on unmount
    };
  }, []);

  return (
    <React.Fragment>
      <BrowserRouter>
        <ToastContainer></ToastContainer>
        <Navbar></Navbar>
        {/* <Allrouters></Allrouters> */}
        {loading ? <Loader2></Loader2> : <Allrouters></Allrouters>}
        <Footer></Footer>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
