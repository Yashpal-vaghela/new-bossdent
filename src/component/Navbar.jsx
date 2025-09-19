import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [suggested, setSuggested] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // console.log("searchQuery", searchQuery, "query", query);
    // if (query !== "") {
    //   setSuggestions([]);
    // }
    try {
      const response = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/product-search?s=${searchQuery}`
      );
      const filterData = response.data.filter((product) => {
        return product.product_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
      const products = filterData.map((product) => ({
        id: product.product_id,
        title: product.product_name,
        slug: product.product_slug,
      }));
      setSuggestions(products);
    } catch (error) {
      console.error(
        "Error fetching search suggestions:",
        error.response.data.message
      );
      setSuggestions([]);
    }
  };

  //   const handleSearch = async (e) => {
  //     setSuggested(true);
  //   };

  const handleClick = (product) => {
    navigate(`/products/${encodeURIComponent(product.slug)}`);
    handleOffcanvas1();
    handleClearSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggested(false);
    setSuggestions([]);
    setSearchIcon((prev) => !prev);
  };
  const handleOffcanvas1 = () => {
    var x = document.getElementById("close");
    if (window.innerWidth <= 991) {
      if (window?.getElementById(x)?.display !== "none") {
        return x.click();
      }
    }
  };
  return (
    <div className="navbar-wrapper">
      <nav className="navbar navbar-dark navbar-expand-lg">
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
            <img
              src="/img/heart-icon.svg"
              className="img-fluid heart-icon"
              alt="heart-icon"
            ></img>
            <div className="position-relative d-lg-none d-md-block">
              <img
                className="img-fluid"
                alt="cart-icon"
                src="/img/cart-icon.svg"
                width="45"
                height="45"
              ></img>
              <span className="navbar-cart-counter">2</span>
            </div>
            <img
              src="/img/user-icon1.svg"
              className="img-fluid user-icon d-none d-lg-block"
              alt="user-icon"
            ></img>
          </div>
          <div className="search-icon-wrapper mx-auto">
            {searchQuery ? (
              <i className="fa-solid fa-xmark" onClick={handleClearSearch}></i>
            ) : (
              <img
                src="/img/Search.svg"
                className="search-icon img-fluid"
                alt="Search-icon"
              ></img>
            )}
            <input
              className="form-control searchInput"
              type="text"
              placeholder="Search"
              name="search"
              value={searchQuery}
              onChange={handleSearchChange}
            ></input>
            <button
              className={`${
                searchQuery ? "d-none btn btn-search" : "d-block btn btn-search"
              }`}
            >
              Search
            </button>
            {searchQuery && (
              <>
                {suggestions?.length !== 0 ? (
                  <div className="suggestion-main">
                    <ul className="suggestions">
                      {suggestions.map((product, index) => (
                        <li key={index} onClick={() => handleClick(product)}>
                          {product.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="suggestion-main">
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
          >
            {/* <i className="fa-solid fa-xmark"></i> */}
          </button>
        </div>
        <div className="offcanvas-body container  align-items-center">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/">Product</Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                href="#"
                className="nav-link dropdown-toggle"
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
                <ul className="dropdown-menu">
                  <li>
                    <Link href="#" className="dropdown-item">
                      category1
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="dropdown-item">
                      category2
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="dropdown-item">
                      category3
                    </Link>
                  </li>
                </ul>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/">About Us</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
          <div className="navbar-contact-wrapper d-flex align-items-center">
            <div className="navbar-contact">
              <img
                src="/img/user-icon1.svg"
                className="img-fluid user-icon d-lg-none d-md-block"
                alt="user-icon"
                width="40"
                height="40"
              ></img>
              <div className="d-flex justify-content-center align-items-center">
                <img
                  src="/img/call-icon.svg"
                  className="img-fluid"
                  alt="call-icon"
                ></img>
                <span className="navbar-contact-title">+91 76988 28883</span>
              </div>
            </div>

            <div className="navbar-cart-wrapper d-lg-flex d-none">
              <img
                src="/img/cart-icon.svg"
                className="img-fluid"
                alt="cart-icon"
              ></img>
              <span className="navbar-cart-counter">2</span>
              <div className="d-block">
                <p className="mb-2">shopping cart:</p>
                <span className="fw-bold">₹57.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
