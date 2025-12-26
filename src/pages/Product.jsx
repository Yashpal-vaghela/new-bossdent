import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../api/config";
import Loader1 from "../component/Loader1";
// import { CartCounter } from "../redux/cartSlice";
import { AddToCartModal } from "../component/AddToCartModal";
import { toast } from "react-toastify";
import {
  AddToWishlist,
  WishlistCounter,
  wishlistId,
} from "../redux/wishlistSlice";
import { AddToCart, CartTotal } from "../redux/cartSlice";
import useValidateUser from "../component/useValidateUser";
import Loader2 from "../component/Loader2";

export const Product = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setloading] = useState(false);
  const [apiloading, setApiLoading] = useState(false);
  // const [token] = useSelector((state)=>state.auth.token);
  const token = useSelector((state) => state.auth.token);
  // console.log("token",token);
  // const [token] = useState(JSON.parse(localStorage.getItem("auth_token")));
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [itemsPerPage] = useState(() => {
    if (window.innerWidth >= 1400) {
      return 12;
    } else if (window.innerWidth <= 1024) {
      return 8;
    } else {
      return 12;
    }
  });
  const { categories } = useSelector((state) => state.category);
  const { cart } = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state?.wishlist?.wishlist);
  const wishlistId1 = useSelector((state) => state.wishlist?.wishlistId);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const validateUser = useValidateUser();

  const fetchProductData = async (controller) => {
    setloading(true);
    try {
      let apiUrl = "";
      if (category) {
        apiUrl += `${BASE_URL}/category/${category}`;
      } else {
        apiUrl += `${BASE_URL}/products`;
      }
      const res = await axios.get(apiUrl, { signal: controller.signal });
      let allProducts = res.data.data ? res.data.data : res.data || [];
      if (sortOrder === "high-low") {
        allProducts = allProducts.sort(
          (a, b) => getFinalPrice(b) - getFinalPrice(a)
        );
      }
      if (sortOrder === "low-high") {
        allProducts = allProducts.sort(
          (a, b) => getFinalPrice(a) - getFinalPrice(b)
        );
      }

      const indexOfLastProduct = currentPage * itemsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
      const currentsProducts = allProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );
      const totalPages = Math.ceil(allProducts.length / itemsPerPage);
      // console.log("allProducts",allProducts,currentsProducts,)
      setTotalPages(totalPages);
      setProducts(currentsProducts);
      // setFinalProducts(currentsProducts);
      if (res.data.data) {
        setloading(false);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }
  };

  const handleFilterPriceProduct = (e) => {
    setSortOrder(e.target.value);
  };

  const getFinalPrice = (p) => {
    return Number(p.sale_price || p.price || p.regular_price || 0);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setcurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProductData(controller);
    return () => controller.abort();
  }, [currentPage, searchParams, sortOrder]);

  const handleFilterProduct = async (e, slug) => {
    if (slug === "all-products") {
      navigate("/products");
      const controller = new AbortController();
      fetchProductData(controller);
      setSelectCategory("");
      return () => controller.abort();
    } else {
      setloading(true);
      setSelectCategory(e.target.value);
      navigate(`?category=${slug}`);
      try {
        const res = await axios.get(`${BASE_URL}/category/${slug}`);
        if (res.data) {
          setloading(false);
        }
        const filterProducts = res.data.data || [];
        setTotalPages(Math.ceil(filterProducts.length / itemsPerPage));
        setcurrentPage(1);
        setProducts(filterProducts.slice(0, itemsPerPage));
      } catch (err) {
        console.error("err", err);
      }
    }
  };

  const renderPagination = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      // Only show nearby pages and first/last
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`page-link ${currentPage === i ? "active" : ""}`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push(
          <span key={`ellipsis-${i}`} className="ellipsis">
            ...
          </span>
        );
      }
    }
    return buttons;
  };

  const handleAddToCartFromModal = async (
    e,
    product,
    selectedAttributes,
    quantity,
    slug
  ) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to product add to cart!");
    } else {
      const AlreadyExistsData = cart?.items?.filter((i) => {
        return i?.variation_id !== 0
          ? i?.variation_id === selectedAttributes?.id
          : true && i?.product_id === product?.id;
      });
      console.log("slug", AlreadyExistsData);

      if (AlreadyExistsData.length > 0) {
        if (
          product?.variations &&
          product.variations.length !== 0 &&
          selectedAttributes === 0
        ) {
          console.warn("ProductVariationsData Edit api call");
          setShowVariationModal((prev) => !prev);
          setSelectedProductForModal(product);
        } else {
          if (selectedAttributes === null && selectedAttributes !== undefined) {
            toast.error(
              `please select ${
                product?.variations?.map(
                  (i, index) => Object.keys(i?.attributes)[index]
                )[0]
              }`
            );
          } else {
            if (selectedAttributes === undefined) {
              toast.error(
                `please select ${
                  product?.variations?.map(
                    (i, index) => Object.keys(i?.attributes)[index]
                  )[1]
                }`
              );
            } else {
              const payload = {
                cart_id: AlreadyExistsData[0]?.cart_id,
                quantity: AlreadyExistsData[0]?.quantity + quantity,
              };
              console.warn("EditCartData api call", payload);
              setApiLoading(true);
              // setLoading(true);
              try {
                const res = await axios.post(
                  `${BASE_URL}/update-cart`,
                  payload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                        .replace(/\s+/g, " ")
                        .trim(),
                      "Content-Type": "application/json",
                    },
                  }
                );
                setApiLoading(false);
                // setLoading(false);
                toast.success("Product updated in cart successfully!");
                if (showVariationModal === true) {
                  setShowVariationModal((prev) => !prev);
                }
                dispatch(CartTotal(res.data.cart_total));
                // dispatch(CartCounter(res.data.cart_count));
                dispatch(AddToCart({ ...res.data, items: res.data.items }));
                if (slug) {
                  navigate(slug);
                }
              } catch (error) {
                console.log("error", error);
              }
            }
          }
        }
      } else {
        if (
          product?.variations &&
          product.variations.length !== 0 &&
          selectedAttributes === 0
        ) {
          // console.warn("ProductVariationsData api call");
          setShowVariationModal((prev) => !prev);
          setSelectedProductForModal(product);
        } else {
          if (selectedAttributes === null && selectedAttributes !== undefined) {
            toast.error(
              `please select ${
                product?.variations?.map(
                  (i, index) => Object.keys(i?.attributes)[index]
                )[0]
              }`
            );
          } else {
            if (selectedAttributes === undefined) {
              toast.error(
                `please select ${
                  product?.variations?.map(
                    (i, index) => Object.keys(i?.attributes)[index]
                  )[1]
                }`
              );
            } else {
              const payload = {
                product_id: product?.id,
                variation_id:
                  selectedAttributes === 0
                    ? selectedAttributes
                    : selectedAttributes?.id,
                quantity: quantity,
              };
              // console.warn(
              //   "addtocartData api call",
              //   payload,
              //   "select",
              //   selectedAttributes,
              //   product?.variations
              // );
              setApiLoading(true);
              // setLoading(true);
              try {
                const res = await axios.post(
                  `${BASE_URL}/new-add-to-cart`,
                  payload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                        .replace(/\s+/g, " ")
                        .trim(),
                      "Content-Type": "application/json",
                    },
                  }
                );
                if (showVariationModal === true) {
                  setShowVariationModal((prev) => !prev);
                }
                setApiLoading(false);
                // setLoading(false);
                toast.success("Product added to cart successfully!");
                res !== undefined && dispatch(CartTotal(res.data.cart_total));
                // dispatch(CartCounter(res.data.cart_count));
                dispatch(
                  AddToCart({
                    ...res.data,
                    items: [...cart.items, res.data?.data],
                  })
                );
                if (slug) {
                  navigate(slug);
                }
              } catch (error) {
                console.log("error", error);
              }
            }
          }
        }
      }
    }
  };

  const handleAddToWishList = async (e, product) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to add product to wishlist!")
    } else {
      const FilterCartdata = wishlistData?.filter(
        (i) => i?.product_id === product?.id
      );
      const filterwishlistId = wishlistId1.includes(product?.id);
      if (filterwishlistId) {
        console.warn("update wishlist and remove wishlist data");
        setApiLoading(true);
        await axios
          .post(
            `${BASE_URL}/delete-wishlist`,
            { wishlist_id: FilterCartdata[0]?.wishlist_id },
            {
              headers: {
                Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            // const a = wishlistId.filter((i)=>i !== product?.id);
            toast.success("Product removed from wishlist.");
            const updatedWishlist = wishlistId1.filter(
              (id) => id !== product?.id
            );
            dispatch(wishlistId(updatedWishlist));
            dispatch(WishlistCounter(res.data.wishlist_count));
            setApiLoading(false);
          })
          .catch((err) => console.log("err", err));
      } else {
        console.warn("add wishlist data");
        setApiLoading(true);
        await axios
          .post(
            `${BASE_URL}/add-wishlist`,
            { product_id: product?.id },
            {
              headers: {
                Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            toast.success("Product added to wishlist!");
            const updatedWishlist = [...wishlistId1, product?.id];
            dispatch(AddToWishlist(response?.data.wishlist));
            dispatch(wishlistId(updatedWishlist));
            dispatch(WishlistCounter(response?.data?.wishlist_count));
            setApiLoading(false);
          })
          .catch((error) => console.log("err", error));
      }
    }
  };

  return (
    <React.Fragment>
      <div className="home-main pt-3 pt-sm-4 pt-lg-0">
        <section className="Breadcrumbs-section">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item ">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  {searchParams.size !== 0 ? (
                    <Link to="#">Category</Link>
                  ) : (
                    <Link to="/products">Products</Link>
                  )}
                </li>
                {searchParams.size !== 0 && (
                  <li className="breadcrumb-item active">
                    <Link
                      to={`/products?category=${searchParams.get("category")}`}
                    >
                      {searchParams.get("category")?.replace("all-", "")}
                    </Link>
                  </li>
                )}
              </ol>
            </nav>
          </div>
        </section>
        {apiloading && <Loader2></Loader2>}
        {loading ? (
          <Loader2></Loader2>
        ) : (
          <>
            <section className="product-section">
              <AddToCartModal
                isOpen={showVariationModal}
                onClose={() => setShowVariationModal(false)}
                product={selectedProductForModal}
                onAddToCart={handleAddToCartFromModal}
                variations={selectedProductForModal?.variation}
              ></AddToCartModal>
              <div className="container">
                <div className="product-category-content d-flex gap-5 my-4">
                  <select
                    className="form-select w-auto"
                    aria-label="Default select example"
                    onChange={(e) => handleFilterProduct(e, e.target.value)}
                    value={selectCategory || ""}
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
                    onChange={(e) => handleFilterPriceProduct(e)}
                    value={sortOrder || ""}
                  >
                    <option value="">Price</option>
                    <option value="high-low">High to low</option>
                    <option value="low-high">low to high</option>
                  </select>
                </div>
                <div className="row justify-content-lg-start justify-content-md-center gap-3 gap-sm-0 mb-5">
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
                        className="col-11 col-sm-10 col-md-6 col-lg-4 col-xl-3 px-2"
                        key={index}
                      >
                        <div className={`card ${product.stock}`}>
                          {product.stock !== "instock" ? (
                            <div className="out-of-stock-label">
                              Out of Stock
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className="card-header">
                            <div className="d-flex align-items-center justify-content-between">
                              {product?.regular_price &&
                                product?.sale_price && (
                                  <span className="sale-title">
                                    Sale{" "}
                                    <b>
                                      {Math.round(
                                        ((product?.regular_price -
                                          product?.sale_price) /
                                          product?.regular_price) *
                                          100
                                      )}
                                      %
                                    </b>
                                  </span>
                                )}
                              {wishlistId1.includes(product?.id) ? (
                                <img
                                  className="heart-icon img-fluid"
                                  src="/img/heart-fill-icon3.svg"
                                  alt="heart-fill-icon"
                                  onClick={(e) =>
                                    handleAddToWishList(e, product)
                                  }
                                ></img>
                              ) : (
                                <img
                                  className="heart-icon img-fluid"
                                  src="/img/heart-icon1.svg"
                                  alt="heart-icon"
                                  onClick={(e) =>
                                    handleAddToWishList(e, product)
                                  }
                                ></img>
                              )}
                            </div>
                            <Link
                              to={`/products/${product.slug}`}
                              className="product-img-url"
                            >
                              <img
                                src={product?.image}
                                className="card-img-top img-fluid"
                                alt="product-img"
                              ></img>
                            </Link>
                          </div>
                          <div className="card-body">
                            <h2 className="product-title card-title">
                              {product?.name}
                            </h2>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="product-content-wrapper">
                                <span className="product-price card-text">
                                  ₹
                                  {product?.regular_price !== null &&
                                  product?.regular_price !== product?.price ? (
                                    <>
                                      <b>{`${greaterPrice}.00`}</b>
                                      {`${lowerPrice}.00`}
                                    </>
                                  ) : (
                                    <>&nbsp;{`${Number(product?.price)}.00`}</>
                                  )}
                                </span>

                                {/* <p className="product-review">
                                  <i className="fa-solid fa-star me-2"></i>4.1
                                </p> */}
                              </div>
                              <div
                                className="product-cart-wrapper"
                                role="button"
                                // data-bs-toggle={product?.variations && product?.variations.length !== 0 ? "modal" : undefined}
                                // data-bs-target={product?.variations && product?.variations.length !== 0 ? "#cartModal" : undefined}
                                // disabled={showVariationModal}
                                // disabled={product?.stock == "outofstock" ? true :false }
                                disabled="true"
                                onClick={(e) =>
                                  product.stock === "instock" ? (
                                    handleAddToCartFromModal(e, product, 0, 1)
                                  ) : (
                                    <></>
                                  )
                                }
                                // onClick={(e) => handleAddToCart(e, product)}
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
                            <Link
                              to={`/products/${product?.slug}`}
                              className="card-link"
                            >
                              <button className="btn btn-viewMore mt-3 py-2">
                                view Product
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <nav
                    className="d-flex justify-content-center mt-5"
                    aria-label="Page navigation"
                  >
                    <ul className="pagination product-pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          &laquo;
                        </button>
                      </li>

                      {renderPagination()}

                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          &raquo;
                        </button>
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
