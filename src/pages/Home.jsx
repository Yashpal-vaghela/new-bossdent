import React, { useEffect, useRef, useState } from "react";
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
  const hasFetched = useRef(false);

  const fetchProducts = async (categorySlug = null) => {
    setLoadingProducts(true);
    try {
      let apiUrl = "";
      if (categorySlug) {
        apiUrl += `${BASE_URL}/category/${categorySlug}`;
      } else {
        apiUrl += `${BASE_URL}/products`;
      }
      const response = await axios.get(apiUrl, );
      setDentalProducts(response.data?.data || []);
      setLoadingProducts(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    if(hasFetched.current) return;
    hasFetched.current = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProducts();
    // const controller = new AbortController();
    // window.scrollTo({ top: 0, behavior: "smooth" });
    // fetchProducts(controller);
    // return () => controller.abort();
  }, []);
  const visibleProducts = Array.isArray(dentalProducts)
    ? dentalProducts.length > 8
      ? dentalProducts.slice(0, 8)
      : dentalProducts
    : [];
    
  const OtherBanner = [
    {
      id: 1,
      img: "/img/other-banner-img1.webp",
      slug: "/products/dispensing-gun-110",
    },
    {
      id: 2,
      img: "/img/other-banner-img2.webp",
      slug: "/products/patient-bibs",
    },
    {
      id: 3,
      img: "/img/other-banner-img3.webp",
      slug: "/products/micro-applicator-tips",
    },
    {
      id: 4,
      img: "/img/other-banner-img4.webp",
      slug: "/products/tieon-surgeon-cap-washable",
    },
    {
      id: 5,
      img: "/img/other-banner-img5.webp",
      slug: "/products/sterilization-rolls",
    },
    {
      id: 6,
      img: "/img/other-banner-img6.webp",
      slug: "/products/4-ply-mask-meltblown",
    },
    {
      id: 7,
      img: "/img/other-banner-img7.webp",
      slug: "/products/premium-patient-drape-washable-cotton-pvc",
    },
    {
      id: 8,
      img: "/img/other-banner-img8.webp",
      slug: "/products?category=tips",
    },
    {
      id: 9,
      img: "/img/other-banner-img9.webp",
      slug: "/products?category=polishing-kits",
    },
  ];

  const SocialData = [
    { id: 1, img: "/img/instagram-post11.jpg" },
    { id: 2, img: "/img/instagram-post9.jpg" },
    { id: 3, img: "/img/instagram-post12.jpg" },
    { id: 4, img: "/img/instagram-post10.jpg" },
    { id: 5, img: "/img/instagram-post8.jpg" },
    { id: 6, img: "/img/instagram-post13.jpg" },
  ];

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
              fetchProduct={fetchProducts}
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
              <div className="row align-items-center justify-content-center justify-content-lg-center">
                {[...OtherBanner]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 3)
                  .map((item, index) => {
                    return (
                      <div className="col-lg-4 col-md-4 col-12" key={index}>
                        <Link to={item?.slug}>
                          <img
                            src={item?.img}
                            className="other-banner-img img-fluid"
                            alt="other-banner-img"
                          ></img>
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
          <DisposableProducts
            token={token}
            getCartData={getCartData}
            dispatch={dispatch}
          />
          <section className="follow-section">
            <div className="container">
              <h2 className="text-white fs-2 text-center section-title">
                Follow us on Instagram
              </h2>
              <div className="row">
                {SocialData?.map((item, index) => {
                  return (
                    <div className="col-lg-2 col-md-3 col-4" key={index} >
                      <Link to="#" >
                        <img
                          src={item?.img}
                          className="img-fluid h-100"
                          alt="instagram-post"
                          style={{border:"1px solid #fff"}}
                        ></img>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
