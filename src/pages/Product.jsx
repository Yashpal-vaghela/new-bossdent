import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../api/config";
import Loader1 from "../component/Loader1";
import { CartCounter, CartTotal } from "../redux/cartSlice";
import { AddToCartModal } from "../component/AddToCartModal";
import { toast } from "react-toastify";
// import { AddToCart } from "../redux/cartSlice";

export const Product = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [finalProducts, setFinalProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token] = useState(JSON.parse(localStorage.getItem("auth_token")));
  // const [Model, setModel] = useState(false);
  const [showVariationModal,setShowVariationModal] = useState(false);
  const [selectedProductForModal,setSelectedProductForModal] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (window.innerWidth >= 1400) {
      return 12;
    } else if (window.innerWidth <= 1024) {
      return 8;
    } else {
      return 12;
    }
  });
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchProductData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/products`);
      // const allProducts = res.data.data || [];
      // setProducts(allProducts);
      // // Total pages
      // setTotalPages(Math.ceil(allProducts.length) / itemsPerPage);

      const indexOfLastProduct = currentPage * itemsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
      const currentsProducts = res.data.data.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );
      const totalPages = Math.ceil(res.data.data.length / itemsPerPage);
      console.log(
        "to",
        itemsPerPage,
        totalPages,
        "currentProducts---",
        currentsProducts
      );

      setTotalPages(totalPages);
      setProducts(currentsProducts);
      setFinalProducts(currentsProducts);
      // pagination();
      if (res.data.data) {
        setLoading(false);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }
  };
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setcurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    const controller = new AbortController();
    fetchProductData();
    return () => controller.abort();
  }, []);
  const handleFilterProduct = async (e, slug) => {
    // console.log("proudt",e,slug);
    if (slug === "all-products") {
      fetchProductData();
    } else {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/category/${slug}`);
        // console.log("res", res.data);
        if (res.data) {
          setLoading(false);
        }
        const filterProducts = res.data.data.products || [];
        setTotalPages(Math.ceil(filterProducts.length / itemsPerPage));
        setcurrentPage(1);
        setProducts(filterProducts.slice(0, itemsPerPage));
      } catch (err) {
        console.error("err", err);
      }
    }
  };
  const renderPagination = () => {
    const paginationButtons = [];
    if (totalPages === 170) {
      if (totalPages <= 1) return paginationButtons;
      paginationButtons.push(
        <button
          key={1}
          className={`pagination_button page-item ${
            currentPage === 1 ? "active" : ""
          }`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      // If current page is 1, show pages 1-4 and an ellipsis
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          paginationButtons.push(
            <button
              key={i}
              className={`paginate_button page-item ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        if (totalPages > 5) {
          paginationButtons.push(
            <span key="end-ellipsis" className="ellipsis">
              ...
            </span>
          );
        }
      }
      // If current page is near the end, show pages around the end
      else if (currentPage > totalPages - 3) {
        if (totalPages > 5) {
          paginationButtons.push(
            <span key="start-ellipsis" className="ellipsis">
              ...
            </span>
          );
        }
        for (let i = totalPages - 3; i < totalPages; i++) {
          paginationButtons.push(
            <button
              key={i}
              className={`paginate_button page-item ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
      }
      // For other cases, show the current page, previous, and next page
      else {
        paginationButtons.push(
          <span key="start-ellipsis" className="ellipsis">
            ...
          </span>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          paginationButtons.push(
            <button
              key={i}
              className={`paginate_button page-item ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        paginationButtons.push(
          <span key="end-ellipsis" className="ellipsis">
            ...
          </span>
        );
      }
      paginationButtons.push(
        <button
          key={totalPages}
          className={`paginate_button page-item ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
      return paginationButtons;
    } else {
      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === currentPage ||
          i === totalPages ||
          (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
          paginationButtons.push(
            <button
              key={i}
              className={`paginate_button page-item ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        } else if (i === currentPage - 2 || i === currentPage + 2) {
          // Add ellipsis for skipped pages
          paginationButtons.push(
            <span key={`ellipsis-${i}`} className="ellipsis">
              ...
            </span>
          );
        }
      }
      return paginationButtons;
    }
  };
  const handleCart = async (e, product) => {
    e.preventDefault();
    const payload = {
      product_id: product.id,
      variation_id: 0,
      quantity: 1,
    };
    console.log("product", product);
    if (product.variations && product.variations.length !== 0) {
      // setModel(true);
      setShowVariationModal(true);
      setSelectedProductForModal(product);
    } else {
      setShowVariationModal(false);
      // setModel(false);
    }
    // await axios
    //   .post(`${BASE_URL}/new-add-to-cart`, payload, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "content-Type": "application/json",
    //     },
    //   })
    //   .then((res) => {
    //     navigate("/cart");
    //     dispatch(CartCounter(res.data.cart_count));
    //     dispatch(CartTotal(res.data.cart_total));

    //   }
    // )
    // .catch((err) => console.log("err", err));
  };

  const handleAddToCartFromModal = async (product,selectedAttributes,quantity,variation=null) =>{
    if(!token){
      toast.error("Please login to add product to cart!");
    }
    let cartItems = []
    try{
      const res  =  await axios.get(`${BASE_URL}/get-cart`,{
         headers: {
          Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
          "Content-Type": "application/json",
        },
      })
      cartItems = res.data.items || [];
      dispatch(CartTotal(res.data.cart_total));
      dispatch(CartCounter(res.data.cart_count));
      
      console.log("res",res)
    } catch(error){
      console.log("error",error)
    }
  }
  return (
    <React.Fragment>
      <div className="home-main pt-4 pt-lg-0">
        <section className="Breadcrumbs-section">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active">
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/products">Products</Link>
                </li>
              </ol>
            </nav>
          </div>
        </section>
        {loading ? (
          <Loader1></Loader1>
        ) : (
          <>
            <section className="product-section">
              <AddToCartModal isOpen={showVariationModal} onClose={()=>setShowVariationModal(false)} product={selectedProductForModal} onAddToCart={handleAddToCartFromModal} variations={selectedProductForModal?.variation}></AddToCartModal>
              <div className="container">
                <div className="product-category-content d-flex gap-5 my-4">
                  <select
                    className="form-select w-auto"
                    aria-label="Default select example"
                    onChange={(e) => handleFilterProduct(e, e.target.value)}
                  >
                    <option>Category</option>
                    <option value="all-products">All Products</option>
                    {categories?.map((category, index) => {
                      return (
                        <option value={category?.slug} key={index}>
                          {category?.name}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    className="form-select w-auto"
                    aria-label="Default select example"
                  >
                    <option>Price</option>
                    <option>100</option>
                    <option>200</option>
                  </select>
                </div>
                {/* {loading ? (
                  <Loader1></Loader1>
                ) : (
                )} */}
                <div className="row justify-content-center gap-3 gap-sm-0 mb-5">
                  {products?.map((product, index) => {
                    const greaterPrice = Math.max(
                      Number(product.price) || 0,
                      Number(product.regular_price) || 0
                    );
                    const lowerPrice = Math.min(
                      Number(product.price) || 0,
                      Number(product.regular_price) || 0
                    );
                    return (
                      <div
                        className="col-11 col-sm-10 col-md-6 col-lg-4 col-xl-3 p-0"
                        key={index}
                      >
                        {/* <Link
                        to={`/products/${product?.slug}`}
                        className="card-link"
                      >
                      </Link> */}
                        <div className={`card ${product.stock}`}>
                          <div className="card-header">
                            <div className={`${product.stock}`}>
                              {product.stock !== "instock" && product.stock}
                            </div>
                            <img
                              className="heart-icon img-fluid"
                              src="/img/heart-icon.svg"
                              alt="heart-icon"
                            ></img>
                            <img
                              src={product?.image}
                              className="card-img-top img-fluid"
                              alt="product-img"
                            ></img>
                          </div>
                          <div className="card-body">
                            <h2 className="product-title card-title">
                              {product?.name}
                            </h2>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="product-content-wrapper">
                                <span className="product-price card-text">
                                  ₹&nbsp;
                                  {product?.regular_price !== null &&
                                  product.regular_price !== product.price ? (
                                    <>
                                      <b>{`${greaterPrice}.00`}</b>
                                      {`${lowerPrice}.00`}
                                    </>
                                  ) : (
                                    <>{`${Number(product.price)}.00`}</>
                                  )}
                                </span>

                                <p className="product-review">
                                  <i className="fa-solid fa-star me-2"></i>4.1
                                </p>
                              </div>
                              <div
                                className="product-cart-wrapper"
                                data-bs-toggle="modal"
                                data-bs-target="#cartModal"
                                onClick={(e) => handleCart(e, product)}
                              >
                                <img
                                  src="/img/cart-icon.svg"
                                  className="cart-icon img-fluid"
                                  alt="cart-icon-img"
                                ></img>
                              </div>
                            </div>
                          </div>
                          <div className="card-footer p-0">
                            <button className="btn btn-viewMore mt-3 py-2">
                              view Product
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <nav
                    className="d-flex justify-content-center mt-5"
                    aria-label="Page navigation example"
                  >
                    <ul className="pagination product-pagination">
                      <li className="page-item" disabled={currentPage === 1}>
                        <Link
                          className="page-link"
                          to="#"
                          aria-label="Previous"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <span aria-hidden="true">&laquo;</span>
                        </Link>
                      </li>
                      <li className="page-item">{renderPagination()}</li>
                      <li className="page-item">
                        <Link to="#" className="page-link">
                          1
                        </Link>
                      </li>
                      <li className="page-item">
                        <Link to="#" className="page-link">
                          2
                        </Link>
                      </li>
                      <li
                        className="page-item"
                        disabled={currentPage === totalPages}
                      >
                        <Link
                          to="#"
                          className="page-link"
                          aria-label="Next"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <span aria-hidden="true">&raquo;</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default Product;
