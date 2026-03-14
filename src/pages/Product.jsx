import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../api/config";
import { AddToCartModal } from "../component/AddToCartModal";
import toast from "react-hot-toast";
import {
  AddToWishlist,
  WishlistCounter,
  wishlistId,
} from "../redux/wishlistSlice";
import { AddToCart, CartTotal } from "../redux/cartSlice";
import useValidateUser from "../component/useValidateUser";
import Loader2 from "../component/Loader2";

export const Product = () => {

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [priceOpen, setPriceOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const token = useSelector((state) => state.auth.token);
  const { categories } = useSelector((state) => state.category);
  const { cart } = useSelector((state) => state.cart);
  const wishlistData = useSelector((state) => state?.wishlist?.wishlist);
  const wishlistId1 = useSelector((state) => state.wishlist?.wishlistId || []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validateUser = useValidateUser();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const category = searchParams.get("category");

  const itemsPerPage = useMemo(() => {
    if (window.innerWidth >= 1400) return 12;
    if (window.innerWidth <= 1024) return 8;
    return 12;
  }, []);

  const getFinalPrice = (p) => {
    return Number(p?.sale_price || p?.price || p?.regular_price || 0);
  };

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const apiUrl = category
          ? `${BASE_URL}/new-category/${category}?page=${currentPage}&per_page=12`
          : `${BASE_URL}/productspg?page=${currentPage}&per_page=12`;

        setSelectCategory(category || "");

        const res = await axios.get(apiUrl, {
          signal: controller.signal,
        });

        let fetchedProducts = res?.data?.data || [];


        if (sortOrder === "high-low") {
          fetchedProducts.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
        }
        else if (sortOrder === "low-high") {
          fetchedProducts.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
        }

        if (isActive) {
          setProducts(fetchedProducts);
          setCurrentPage(res?.data?.current_page || 1);
          setTotalPages(res?.data?.total_pages || 0);
        }

      } catch (err) {
        if (
          err?.name !== "AbortError" &&
          err?.name !== "CanceledError" &&
          err?.code !== "ERR_CANCELED"
        ) {
          console.error("Product API error:", err);
          if (isActive) {
            setProducts([]);
            setTotalPages(0);
            toast.error("Failed to load products.");
          }
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isActive = false;
      controller.abort();
    };

  }, [category, currentPage, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, sortOrder]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterPriceProduct = (e) => {
    setSortOrder(e.target.value);
  };

  const handleFilterProduct = (e, slug) => {
    const value = slug || "";
    setCurrentPage(1);

    if (value === "all-products" || value === "") {
      setSelectCategory("");
      navigate("/products");
      return;
    }

    setSelectCategory(value);
    navigate(`/products?category=${value}`);
  };

  const renderPagination = () => {
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <li className="page-item" key={i}>
            <button
              onClick={() => handlePageChange(i)}
              className={`page-link ${currentPage === i ? "active" : ""}`}
            >
              {i}
            </button>
          </li>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push(
          <li className="page-item disabled" key={`ellipsis-${i}`}>
            <span className="page-link">...</span>
          </li>
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
      return;
    }

    const AlreadyExistsData = cart?.items?.filter((i) => {
      return i?.variation_id !== 0
        ? i?.variation_id === selectedAttributes?.id
        : i?.product_id === product?.id;
    });

    if (product?.id === 4070) {
      navigate(`/products/${product.slug}`);
      return;
    }

    if (
      product?.variations &&
      product?.variations.length !== 0 &&
      selectedAttributes === 0
    ) {
      setShowVariationModal(true);
      setSelectedProductForModal(product);
      return;
    }

    if (selectedAttributes === null) {
      toast.error(
        `Please select ${product?.variations?.map((i, index) => Object.keys(i?.attributes)[index])[0] || "variation"
        }`
      );
      return;
    }

    if (selectedAttributes === undefined && product?.variations?.length > 0) {
      toast.error("Please select product variation");
      return;
    }

    if (selectedAttributes?.stock === "outofstock") {
      toast.error(`${product?.name} is out of stock`);
      return;
    }

    try {
      setApiLoading(true);

      if (AlreadyExistsData.length > 0) {
        const payload = {
          cart_id: AlreadyExistsData[0]?.cart_id,
          quantity: AlreadyExistsData[0]?.quantity + quantity,
        };

        const res = await axios.post(`${BASE_URL}/update-cart`, payload, {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
        });

        toast.success("Product updated in cart successfully!");
        dispatch(CartTotal(res.data.cart_total));
        dispatch(AddToCart({ ...res.data, items: res.data.items }));

        if (showVariationModal) setShowVariationModal(false);
        if (slug) navigate(slug);
      } else {
        const payload = {
          product_id: product?.id,
          variation_id:
            selectedAttributes === 0 ? 0 : selectedAttributes?.id || 0,
          quantity: quantity,
        };

        const res = await axios.post(`${BASE_URL}/new-add-to-cart`, payload, {
          headers: {
            Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type": "application/json",
          },
        });

        toast.success("Product added to cart successfully!");
        dispatch(CartTotal(res.data.cart_total));
        dispatch(
          AddToCart({
            ...res.data,
            items: [...(cart?.items || []), res.data?.data],
          })
        );

        if (showVariationModal) setShowVariationModal(false);
        if (slug) navigate(slug);
      }
    } catch (error) {
      console.error("Cart API error:", error);
      toast.error("Something went wrong while adding to cart.");
    } finally {
      setApiLoading(false);
    }
  };

  const handleAddToWishList = async (e, product) => {
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to add product to wishlist!");
      return;
    }

    const filterCartData = wishlistData?.filter(
      (i) => i?.product_id === product?.id
    );
    const isInWishlist = wishlistId1.includes(product?.id);

    try {
      setApiLoading(true);

      if (isInWishlist) {
        const res = await axios.post(
          `${BASE_URL}/delete-wishlist`,
          { wishlist_id: filterCartData[0]?.wishlist_id },
          {
            headers: {
              Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Product removed from wishlist.");
        const updatedWishlist = wishlistId1.filter((id) => id !== product?.id);
        dispatch(wishlistId(updatedWishlist));
        dispatch(WishlistCounter(res.data.wishlist_count));
      } else {
        const response = await axios.post(
          `${BASE_URL}/add-wishlist`,
          { product_id: product?.id },
          {
            headers: {
              Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Product added to wishlist!");
        const updatedWishlist = [...wishlistId1, product?.id];
        dispatch(AddToWishlist(response?.data.wishlist));
        dispatch(wishlistId(updatedWishlist));
        dispatch(WishlistCounter(response?.data?.wishlist_count));
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
      toast.error("Something went wrong with wishlist.");
    } finally {
      setApiLoading(false);
    }
  };

  const handleCardModalError = () => { };

  return (
    <React.Fragment>
      <div className="home-main product-main pt-0 pt-lg-0">
        <section className="Breadcrumbs-section">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  {searchParams.size !== 0 ? (
                    <Link to="/products">Category</Link>
                  ) : (
                    <Link to="/products">Products</Link>
                  )}
                </li>
                {searchParams.size !== 0 && (
                  <li className="breadcrumb-item active">
                    <Link to={`/products?category=${searchParams.get("category")}`}>
                      {searchParams.get("category")?.replace("all-", "")}
                    </Link>
                  </li>
                )}
              </ol>
            </nav>
          </div>
        </section>

        {apiLoading && <Loader2 />}

        {loading ? (
          <Loader2 />
        ) : (
          <section className="product-section">
            <AddToCartModal
              isOpen={showVariationModal}
              onClose={() => setShowVariationModal(false)}
              product={selectedProductForModal}
              onAddToCart={handleAddToCartFromModal}
              variations={selectedProductForModal?.variation}
              handleCardModalError={handleCardModalError}
            />

            <div className="container">
              <div className="product-category-content d-flex gap-5 my-4">
                <select
                  className="form-select w-auto"
                  aria-label="Category filter"
                  onChange={(e) => handleFilterProduct(e, e.target.value)}
                  value={selectCategory || ""}
                >
                  <option value="">Category</option>
                  <option value="all-products">All Products</option>
                  {categories?.map((categoryItem, index) => (
                    <option value={categoryItem?.slug} key={index}>
                      {categoryItem?.name}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select w-auto"
                  aria-label="Price filter"
                  onChange={handleFilterPriceProduct}
                  value={sortOrder || ""}
                >
                  <option value="">Price</option>
                  <option value="high-low">High to low</option>
                  <option value="low-high">Low to high</option>
                </select>
              </div>

              <div className="row justify-content-lg-start justify-content-md-center justify-content-center gap-3 gap-sm-0 mb-5">
                {products?.length > 0 ? (
                  products.map((product, index) => {
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
                        key={product?.id || index}
                      >
                        <div className={`card ${product.stock}`}>
                          {product.stock !== "instock" && (
                            <div className="out-of-stock-label">Out of Stock</div>
                          )}

                          <div className="card-header">
                            <div className="d-flex align-items-center justify-content-between">
                              {product?.regular_price && product?.sale_price && (
                                <span className="sale-title">
                                  Sale{" "}
                                  <b>
                                    {Math.round(
                                      ((product?.regular_price - product?.sale_price) /
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
                                  onClick={(e) => handleAddToWishList(e, product)}
                                />
                              ) : (
                                <img
                                  className="heart-icon img-fluid"
                                  src="/img/heart-icon1.svg"
                                  alt="heart-icon"
                                  onClick={(e) => handleAddToWishList(e, product)}
                                />
                              )}
                            </div>

                            <Link
                              to={`/products/${product.slug}`}
                              className="product-img-url"
                              state={{ from: location.pathname + location.search }}
                            >
                              <img
                                src={product?.image}
                                className="card-img-top img-fluid"
                                alt={product?.name || "product-img"}
                              />
                            </Link>
                          </div>

                          <div className="card-body">
                            <h2 className="product-title card-title">{product?.name}</h2>

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
                                    <>&nbsp;{`${Number(product?.price || 0)}.00`}</>
                                  )}
                                </span>
                              </div>

                              <div
                                className="product-cart-wrapper"
                                role="button"
                                onClick={(e) => {
                                  if (product.stock === "instock") {
                                    handleAddToCartFromModal(e, product, 0, 1);
                                  }
                                }}
                              >
                                <img
                                  src="/img/cart-icon.svg"
                                  className="cart-icon img-fluid"
                                  alt="cart-icon-img"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="card-footer p-0">
                            <Link to={`/products/${product?.slug}`} className="card-link">
                              <button className="btn btn-viewMore mt-3 py-2">
                                View Product
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center py-5">
                    <h4>No products found</h4>
                    <p>Please try another category or remove filters.</p>
                  </div>
                )}

                {totalPages > 1 && (
                  <nav
                    className="d-flex justify-content-center mt-5"
                    aria-label="Page navigation"
                  >
                    <ul className="pagination product-pagination">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          &laquo;
                        </button>
                      </li>

                      {renderPagination()}

                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </React.Fragment>
  );
};

export default Product;