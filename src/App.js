import React, { useEffect, useState } from "react";
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
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Loader1 from "./component/Loader1";

function App() {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 40000);
  // }, []);
  return (
    <React.Fragment>
       <BrowserRouter>
          <ToastContainer></ToastContainer>
          <Navbar></Navbar>
          <Allrouters></Allrouters>
          <Footer></Footer>
        </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
