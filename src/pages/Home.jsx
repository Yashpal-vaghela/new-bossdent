import React, { useEffect,  useState } from "react";
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
import { useSelector } from "react-redux";
import CategorySection from "../component/CategorySection";
import Loader1 from "../component/Loader1";

const Home = () => {
  const SearchProductData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const [showAll, setShowAll] = useState(false);
  // for fetching product categories
  const {categories,loading} = useSelector((state)=>state.category);
  // console.log("categore",categories1);
  // const [loadingCategories, setLoadingCategories] = useState(true);
  // const [errorCategories, setErrorCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  //for fetching product
  const [dentalProducts, setDentalProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  // const [errorProducts, setErrorProducts] = useState(null);
  // const visibleCategories = showAll ? categories : categories.slice(0, 5);
  const visibleCategories = categories;
 
  const fetchProducts = async (controller,categorySlug = null) => {
    console.log("contr",controller);
    setLoadingProducts(true);
      try {
        const url = categorySlug
          ? `${BASE_URL}/category/${categorySlug}`
          : `${BASE_URL}/products`;

        const response = await axios.get(url,{signal:controller.signal}); 
        setDentalProducts(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setErrorProducts("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };
  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller);
    return () => controller.abort();
  }, []);

  const handleCategoryClick = (slug) =>{
    const controller = new AbortController();
    setSelectedCategory(slug);
    if (!slug) {
      fetchProducts(controller);
    } else {
      fetchProducts(controller,slug);
    }
    return () => controller.abort();
  };
  const visibleProducts = Array.isArray(dentalProducts)
  ? (dentalProducts.length > 8 ? dentalProducts.slice(0, 8) : dentalProducts)
  : [];
  return (
    <div className="home-main overflow-hidden">
      <HomeBanner></HomeBanner>
      <ServiceSection></ServiceSection>
      {/* product range section */}
      {
        loading ? <Loader1></Loader1> : <section className="dental-product-section ">
        <div className="container">
          <h2 className="text-white fs-2 text-center section-title">
            Our Dental Products Range
          </h2>
          <div className="product-filter-content">
             <ul className="product-filter-category-list">
                <li
                  className={`product-category ${
                    selectedCategory === null ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  <Link to="/products">All Products</Link>
                </li>
                {visibleCategories?.map((category, index) => {
                  return (
                    <li
                      key={index}
                      className={`product-category ${
                        selectedCategory === category.slug ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(category.slug)}
                    >
                      <Link to={`/products?category=${category.slug}`}>{category.name}</Link>
                    </li>
                  );
                })}
                {categories.length > 5 && (
                  <li
                    className="product-category"
                    onClick={() => setShowAll((prev) => !prev)}
                  >
                    <Link to="#">{showAll ? "View Less" : "View All"}</Link>
                  </li>
                )}
              </ul>
          </div>
          <div className="row pt-3 justify-content-center">
            {loadingProducts ? (
              <p>Loading products...</p>
            ) : (
                visibleProducts.length  > 0 ? ( visibleProducts.map((item, index) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={item.id || index}>
                    <div className="card position-relative">
                      {item.regular_price && item.sale_price && (
                        <span className="discount-badge position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white">
                          Sale {Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100)}%
                        </span>
                      )}
                      <img
                        src={item.image || "/img/product-img4.png"}
                        className="card-img-top img-fluid"
                        alt={item.name || "Product"}
                      />
                      <div className="card-body d-flex align-items-center justify-content-between px-lg-3 px-0 py-2">
                        <div className="d-block">
                          <h2 className="product-card-title mb-0">
                            {item.name || "Product Title"}
                          </h2>
                          <p className="product-price mb-0">
                            {item.sale_price ? (
                                <>
                                  <span className="text-muted text-decoration-line-through me-2">
                                    ₹{item.regular_price}
                                  </span>
                                  <span className="fw-bold text-white">
                                    ₹{item.sale_price}
                                  </span>
                                </>
                              ) : (
                                <span className="fw-bold text-white">₹{item.price || item.regular_price || "0"}</span>
                              )}
                          {/* ₹{item.sale_price || item.price || "0"} */}
                          </p>
                        </div>
                        <img
                          className="shopping-bag-icon img-fluid"
                          alt="shopping-bag"
                          src="/img/lightShopping-bag-icon.svg"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) :(
                 <p className="text-light text-center">No products found for this category.</p>
              )
            ) }
          </div>
        </div>
      </section>
      }
     
      {/* Banner Section  */}
      <section className="banner-img-section ">
        <div className="container">
          <img
            src="/img/banner-img.png"
            className="banner-img img-fluid"
            alt="banner-img"
          ></img>
        </div>
      </section>
      {/* categories section  */}
      <CategorySection categories={categories} ></CategorySection>
      {/* Exclusive Premium Products section */}
      <PremiumProducts />
      <section className="Otherbanner-section">
        <div className="container">
          <div className="row align-items-center  justify-content-center justify-content-lg-center">
            <div className="col-lg-4 col-md-4 col-12">
              <img
                src="/img/other-banner-img1.png"
                className="other-banner-img img-fluid"
                alt="other-banner-img"
              ></img>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-5 col-6">
              <img
                src="/img/other-banner-img2.png"
                className="other-banner-img img-fluid"
                alt="other-banner-img"
              ></img>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-5 col-6">
              <img
                src="/img/other-banner-img3.png"
                className="other-banner-img img-fluid"
                alt="other-banner-img"
              ></img>
            </div>
            {/* {OtherBannerData?.map((item, index) => {
              return (
                <div className="col-lg-4 col-md-6 col-12" key={index}>
                  <img
                    src={item.img}
                    className="other-banner-img img-fluid"
                    alt="other-banner-img"
                  ></img>
                </div>
              );
            })} */}
          </div>
        </div>
      </section>
      <section className="RecentSearch-section">
        <div className="container">
          <h2 className="text-white fs-2 text-center section-title">
            Recent Searched
          </h2>
          <div className="row py-3 py-md-4">
            {SearchProductData?.map((item, index) => {
              return (
                <div className="col-lg-3 col-md-3 col-6 " key={index}>
                  <div className="search-product-card card">
                    <img
                      src="/img/product-img4.png"
                      alt="search-rpoduct-img"
                      className="card-img-top img-fluid"
                    ></img>
                    <div className="card-body d-flex align-items-center justify-content-between px-0 px-lg-3 px-md-0 py-2">
                      <div className="d-block">
                        <h2 className="product-card-title mb-0">
                          Product Title
                        </h2>
                        <p className="product-price mb-0">$12.00</p>
                        {/* <div className="rating-stars">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div> */}
                      </div>
                      <img
                        className="shopping-bag-icon img-fluid"
                        alt="shopping-bages"
                        src="/img/lightShopping-bag-icon.svg"
                      ></img>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <DisposableProducts />
    </div>
  );
};

export default Home;
