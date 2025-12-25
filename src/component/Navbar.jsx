import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginDialogBox from "./LoginDialogBox";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
// import Loader1 from "./Loader1";
import BASE_URL from "../api/config";
import { AddToken } from "../redux/authSlice";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { categories } = useSelector((state) => state.category);
  const cartCounter = useSelector((state) => state.cart.cartCount);

  const cartTotal = useSelector((state) => state.cart.cartTotal);
  const token = useSelector((state)=>state.auth.token);
  const wishlistCounter = useSelector((state) => state.wishlist.wishlistCount);
    const cartCounter1 = useSelector((state)=>state.wishlist);
  // const [token,setToken] = useState(localStorage.getItem("auth_token"));
  const text = "* Free shipping on order above 2300 *";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      setSearchIcon(true);
    } else {
      setSearchIcon(false);
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/product-suggestions?s=${query}`
      );
      // console.warn("response", response);
      const filterData = response?.data?.suggestions?.filter((product) => {
        return product?.name.toLowerCase().includes(query.toLowerCase());
      });
      const products = filterData.map((product) => ({
        id: product?.id,
        title: product?.name,
        slug: product?.slug,
      }));
      setSuggestions(products);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    }
  };
  const handleClick = (product) => {
    navigate(`/products/${encodeURIComponent(product.slug)}`);
    handleOffcanvas1();
    handleClearSearch();
  };
  const handleClearSearch = () => {
    setSearchQuery("");
    // setSuggested(false);
    setSuggestions([]);
    setSearchIcon((prev) => !prev);
  };
  const handleOffcanvas1 = () => {
    var x = document.getElementById("close");
    if (window.innerWidth <= 991) {
      if (x?.display !== "none") {
        return x.click();
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const topNav = document.querySelector(".navbar-top");
      const navbarMainElements =
        document.getElementsByClassName("navbar-wrapper");
      const navbarlogoElements = document.getElementById("navbar-logo-desktop");
      const navbarContactElement = document.querySelector(
        ".navbar-contact-wrapper"
      );
      const searchInputMobile = document.getElementById("searchInputMobile");

      if (window.innerWidth > 991) {
        if (window.scrollY >= 20) {
          topNav !== null ? (topNav.style.display = "none") : <></>;
          Array.from(navbarMainElements).forEach((element) => {
            element.style.position = "fixed";
            element.style.padding = "0px 0px 5px 0px";
          });
          navbarlogoElements.classList.remove("d-lg-none");
          searchInputMobile !== null && searchIcon == true ? (
            searchInputMobile.classList.add("d-flex")
          ) : (
            <></>
          );
          // searchIcon == true ? a.classList.add("d-none") : <></>;
          navbarContactElement != null ? (
            navbarContactElement.classList.add("navbarcontact-position-sticky")
          ) : (
            <></>
          );
        } else {
          topNav !== undefined ? (topNav.style.display = "flex") : <></>;
          navbarContactElement != null ? (
            navbarContactElement.classList.remove(
              "navbarcontact-position-sticky"
            )
          ) : (
            <></>
          );
          searchInputMobile !== null && searchIcon == true ? (
            searchInputMobile.classList.add("d-none")
          ) : (
            <></>
          );
          Array.from(navbarMainElements).forEach((element) => {
            // element.style.position = "relative";
            element.style.padding = "0px 0px 0px 0px";
          });

          navbarlogoElements.classList.add("d-lg-none");
        }
      } else {
        topNav.style.display = "flex";
        navbarContactElement !== null ? (
          (navbarContactElement.style.display = "none")
        ) : (
          <></>
        );
        searchInputMobile !== null && searchIcon == true ? (
          searchInputMobile.classList.add("d-none")
        ) : (
          <></>
        );
        Array.from(navbarMainElements).forEach((element) => {
          element.style.position = "relative";
          element.style.padding = "0px 0px 22px 0px";
        });
        navbarlogoElements.classList.add("d-lg-none");
      }
    };
    dispatch(AddToken(JSON.parse(localStorage.getItem("auth_token")) || "null"));
    console.log("loca",JSON.parse(localStorage.getItem("auth_token")));
    const handleResize = () => {
      handleScroll();
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleScroll();
    return () => {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="navbar-wrapper">
        <nav className="navbar navbar-top navbar-dark navbar-expand-lg">
          <div className="container position-relative">
            <Link to="/" className="navbar-logo">
              <img src="/img/logo2.svg" className="img-fluid" alt="logo"></img>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="social-link-wrapper">
              {searchIcon && searchQuery && (
                <img
                  className="search-icon img-fluid pe-2 m-2"
                  alt="search-icon"
                  id="search-icon"
                  width="35"
                  height="35"
                  src="/img/search-icon.svg"
                  onClick={() => {
                    setSearchIcon((prev) => !prev);
                  }}
                ></img>
              )}
              <Link to="/wishlist" className="position-relative">
                <span className="navbar-wishlist-counter">
                  {wishlistCounter}
                </span>
                <img
                  src="/img/heart-icon.svg"
                  className="img-fluid heart-icon"
                  alt="heart-icon"
                  width="35"
                  height="35"
                ></img>
              </Link>

              <div className="position-relative d-lg-none d-md-block">
                <Link to="/cart" className="navbar-counter">
                  <img
                    className="img-fluid"
                    alt="cart-icon"
                    src="/img/cart-icon.svg"
                    width="45"
                    height="45"
                  ></img>
                  <span className="navbar-cart-counter">{cartCounter}</span>
                </Link>
              </div>
              {token !== "null" ? (
                <img
                  src="/img/user-icon1.svg"
                  className="img-fluid user-icon d-none d-lg-block"
                  alt="user-icon"
                  onClick={() => navigate("/profile")}
                ></img>
              ) : (
                <img
                  src="/img/user-icon1.svg"
                  className="img-fluid user-icon d-none d-lg-block"
                  alt="user-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                ></img>
              )}
            </div>
            {!searchIcon || searchQuery ? (
              <>
                <div className="search-icon-wrapper mx-auto">
                  {searchQuery ? (
                    <i
                      className="fa-solid fa-xmark"
                      onClick={handleClearSearch}
                      id="close-icon"
                    ></i>
                  ) : (
                    <img
                      src="/img/Search.svg"
                      className="search-icon img-fluid"
                      alt="Search-icon"
                      id="search-icon"
                    ></img>
                  )}
                  <input
                    className="form-control  searchInput"
                    type="text"
                    placeholder="Search..."
                    name="search"
                    id="searchInputMobile"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  ></input>
                  {searchQuery && (
                    <>
                      {suggestions?.length !== 0 ? (
                        <div className="suggestion-main" id="suggestion-main">
                          <ul className="suggestions">
                            {suggestions.map((product, index) => (
                              <li
                                key={index}
                                onClick={() => handleClick(product)}
                              >
                                {product.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="suggestion-main" id="suggestion-main">
                          <ul className="suggestions">
                            <li>
                              <h2 className="d-flex m-auto align-items-center justify-content-center">
                                No Products Items Found!
                              </h2>
                            </li>
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
           
          </div>
        <div className="navbar-bottom-highlight d-lg-none d-block">
          <div className="ticker">
            <div className="ticker-track">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i}>{text}</span>
              ))}
            </div>
          </div>
        </div>
        </nav>
        <div
          className="offcanvas offcanvas-start navbar-offcanvas navbar-content-wrapper d-lg-flex"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              id="close"
            ></button>
          </div>
          <div className="offcanvas-body container align-items-center">
            <ul className="navbar-nav me-auto me-lg-0">
              <li className="nav-item">
                <Link to="/" onClick={handleOffcanvas1}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" onClick={handleOffcanvas1}>
                  Product
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories{" "}
                  <img
                    src="/img/arrow-down-img.svg"
                    className="arrow-down-img img-fluid"
                    alt="arrow-down-img"
                  ></img>
                </Link>
                <ul className="dropdown-menu">
                  {categories?.map((category, index) => (
                    <li key={index}>
                      <Link
                        to={`/products?category=${category?.slug}`}
                        className="dropdown-item"
                        onClick={(e) => {
                          handleOffcanvas1();
                        }}
                      >
                        {category?.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <Link to="/about" onClick={handleOffcanvas1}>
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" onClick={handleOffcanvas1}>
                  Contact Us
                </Link>
              </li>
            </ul>
            <Link
              to="/"
              className="navbar-logo d-none d-lg-none"
              id="navbar-logo-desktop"
            >
              <img src="/img/logo2.svg" className="img-fluid" alt="logo"></img>
            </Link>
            <div className="navbar-contact-wrapper d-flex align-items-center">
              <div className="navbar-contact align-items-center">
                <div className="d-block search-input-content">
                  {searchIcon || searchQuery ? (
                    <div className="search-icon-wrapper search-icon-position-sticky">
                      {searchQuery ? (
                        <i
                          className="fa-solid fa-xmark d-none"
                          onClick={handleClearSearch}
                          id="close-icon"
                        ></i>
                      ) : (
                        <img
                          src="/img/Search.svg"
                          className="search-icon d-none img-fluid"
                          alt="search-icon"
                          id="search-icon"
                        ></img>
                      )}
                      <input
                        className="form-control w-75 d-none searchInput"
                        type="text"
                        placeholder="Search..."
                        name="search"
                        id="searchInput"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      ></input>
                      {searchIcon && searchQuery && (
                        <>
                          {suggestions.length !== 0 ? (
                            <div
                              className="suggestion-main d-none"
                              id="suggestion-main"
                            >
                              <ul className="suggestions">
                                {suggestions.map((product, index) => (
                                  <li
                                    key={index}
                                    onClick={() => handleClick(product)}
                                  >
                                    {product.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div
                              className="suggestion-main"
                              id="suggestion-main"
                            >
                              <ul className="suggestions">
                                <li>
                                  <h2 className="d-flex m-auto align-items-center justify-content-center">
                                    No Products Items Found!
                                  </h2>
                                </li>
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <img
                      src="/img/search-icon.svg"
                      className="search-icon d-none  img-fluid m-2"
                      alt="search-icon"
                      id="search-icon"
                      width="30"
                      height="30"
                      onClick={() => setSearchIcon((prev) => !prev)}
                    ></img>
                  )}
                </div>
                <Link to="/wishlist" className="position-relative">
                  <span className="navbar-wishlist-counter d-none">
                    {wishlistCounter}
                  </span>
                  <img
                    src="/img/heart-icon.svg"
                    className="img-fluid heart-icon d-none"
                    alt="heart-icon"
                    id="heart-icon"
                    width="28"
                    height="28"
                  ></img>
                  <span className="navbar-wishlist-counter d-none">
                    {wishlistCounter}
                  </span>
                </Link>
                {token !== "null" ? (
                  <img
                    className="img-fluid user-icon d-none"
                    alt="user-icon"
                    src="/img/user-icon1.svg"
                    id="user-icon"
                    onClick={() => navigate("/profile")}
                  ></img>
                ) : (
                  <img
                    className="img-fluid user-icon d-none"
                    alt="user-icon"
                    src="/img/user-icon1.svg"
                    id="user-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  ></img>
                )}
                <div className="d-flex justify-content-center align-items-center">
                  <a
                    href="tel:+917698828883"
                    className="ms-2 text-decoration-none"
                  >
                    <img
                      src="/img/call-icon.svg"
                      className="call-icon img-fluid"
                      alt="call-icon"
                      width="28"
                      height="28"
                    ></img>
                    <span className="navbar-contact-title">
                      +91 76988 28883
                    </span>
                  </a>
                </div>
              </div>
              <div className="navbar-cart-wrapper d-lg-flex d-none align-items-center">
                <Link to="/cart" className="navbar-counter">
                  <img
                    src="/img/cart-icon.svg"
                    className="img-fluid"
                    alt="cart-icon"
                  ></img>
                  <span className="navbar-cart-counter">{cartCounter}</span>
                </Link>
                <div className="d-block cart-info" id="cart-info">
                  <p className="mb-2">shopping cart:</p>
                  <span className="fw-bold">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoginDialogBox></LoginDialogBox>
        {/* <div className="d-flex navbar-bottom-highlight d-flex justify-content-center align-items-center">
          <p>*Free shipping on order above 2300*</p>
        </div> */}
        <div className="navbar-bottom-highlight d-none d-lg-block">
          <div className="ticker">
            <div className="ticker-track">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i}>{text}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Navbar;
