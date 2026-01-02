import React, { useEffect, useState } from "react";
import HomeBanner from "../component/HomeBanner";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../api/config";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PremiumProducts from "../component/PremiumProducts";
import DisposableProducts from "../component/DisposableProducts";
import { ServiceSection } from "../component/ServiceSection";
import { useDispatch, useSelector } from "react-redux";
import CategorySection from "../component/CategorySection";
import { DentalProductSection } from "../component/DentalProductSection";
import Loader2 from "../component/Loader2";

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const { categories, loading } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [dentalProducts, setDentalProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const getCartData = useSelector((state) => state.cart.cart);
  const fetchProducts = async (controller, categorySlug = null) => {
    setLoadingProducts(true);
    try {
      let apiUrl = "";
      if (categorySlug) {
        apiUrl += `${BASE_URL}/category/${categorySlug}`;
      } else {
        apiUrl += `${BASE_URL}/products`;
      }
      const response = await axios.get(apiUrl, { signal: controller.signal });
      setDentalProducts(response.data?.data || []);
      setLoadingProducts(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProducts(controller);
    return () => controller.abort();
  }, []);
  const visibleProducts = Array.isArray(dentalProducts)
    ? dentalProducts.length > 8
      ? dentalProducts.slice(0, 8)
      : dentalProducts
    : [];

  return (
    <div className="home-main overflow-hidden pt-0 pt-sm-0">
      {loadingProducts ? (
        <Loader2></Loader2>
      ) : (
        <>
          <HomeBanner></HomeBanner>
          <ServiceSection></ServiceSection>
          {/* product range section */}
          {loading ? (
            <Loader2></Loader2>
          ) : (
            <DentalProductSection
              getCartData={getCartData}
              token={token}
              dispatch={dispatch}
              categories={categories}
              loadingProducts={loadingProducts}
              visibleProducts={visibleProducts}
            ></DentalProductSection>
          )}
          {/* Banner Section  */}
          <section className="banner-img-section">
            <div className="container">
              <Link to="/products?category=retractors">
                <img
                  src="/img/banner-img.webp"
                  className="banner-img img-fluid"
                  alt="banner-img"
                ></img>
              </Link>
            </div>
          </section>
          {/* categories section  */}
          <CategorySection categories={categories}></CategorySection>
          {/* Exclusive Premium Products section */}
          <PremiumProducts
            token={token}
            getCartData={getCartData}
            dispatch={dispatch}
          />
          <section className="Otherbanner-section">
            <div className="container">
              <div className="row align-items-center  justify-content-center justify-content-lg-center">
                <div className="col-lg-4 col-md-4 col-12">
                  <Link to="/products/dispensing-gun-110">
                    <img
                      src="/img/other-banner-img1.webp"
                      className="other-banner-img img-fluid"
                      alt="other-banner-img"
                    ></img>
                  </Link>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-5 col-6">
                  <Link to="/products/patient-bibs">
                    <img
                      src="/img/other-banner-img2.webp"
                      className="other-banner-img img-fluid"
                      alt="other-banner-img"
                    ></img>
                  </Link>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-5 col-6">
                  <Link to="/products/micro-applicator-tips">
                    <img
                      src="/img/other-banner-img3.webp"
                      className="other-banner-img img-fluid"
                      alt="other-banner-img"
                    ></img>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <DisposableProducts
            token={token}
            getCartData={getCartData}
            dispatch={dispatch}
          />
          {/* <section className="follow-section">
            <div className="container">
              <h2 className="text-white fs-2 text-center section-title">Follow us on Instagram</h2>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-4">
                  <Link to="#" >
                    <img src="/img/instagram-post1.jpg" className="img-fluid" alt="instagram-post"></img>
                  </Link>
                </div>
                <div className="col-lg-3 col-md-3 col-4">
                  <Link to="#">
                    <img src="/img/instagram-post2.jpg" className="img-fluid" alt="instagram-post"></img>
                  </Link>
                </div>
                <div className="col-lg-3 col-md-3 col-4">
                  <Link to="#">
                    <img src="/img/instagram-post3.jpg" className="img-fluid" alt="instagram-post"></img>
                  </Link>
                </div>
                <div className="col-lg-3 col-md-3 col-4">
                  <Link to="#">
                    <img src="/img/instagram-post.png" className="img-fluid" alt="instagram-post"></img>
                  </Link>
                </div>
              </div>
            </div>
          </section> */}
        </>
      )}
    </div>
  );
};

export default Home;
