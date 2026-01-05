import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "../api/config";
import { toast } from "react-toastify";
import { AddToCart } from "../redux/cartSlice";
import Loader2 from "./Loader2";
import useValidateUser from "./useValidateUser";
import { AddToCartModal } from "./AddToCartModal";

export const DentalProductSection = ({
  getCartData,
  token,
  dispatch,
  categories,
  loadingProducts,
  visibleProducts,
  fetchProduct,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [apiloading, setApiLoading] = useState(false);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [visibleProduct, setVisibleProduct] = useState(visibleProducts);
  const visibleCategories = showAll ? categories : categories.slice(0, 5);
  const validateUser = useValidateUser();
  const navigate = useNavigate();
  const handleCategoryClick = async (e, slug) => {
    console.log("slug", slug, slug);
    const controller = new AbortController();
    setSelectedCategory(slug);
    let apiUrl = "";
    if (slug) {
      apiUrl += `${BASE_URL}/category/${slug}`;
    } else {
      apiUrl += `${BASE_URL}/products`;
    }
    setApiLoading(true);
    await axios
      .get(apiUrl)
      .then((res) => {
        let visiblePro = "";
        if (Array.isArray(res.data.data)) {
          if (res.data.data.length > 4 && res.data.data.length < 8) {
            visiblePro = res.data.data.slice(0, 4);
          } else if (res.data.data.length > 8) {
            visiblePro = res.data.data.slice(0, 8);
          } else {
            visiblePro = res.data.data;
          }
        } else {
          visiblePro = [];
        }
        setApiLoading(false);
        setVisibleProduct(visiblePro);
        console.log("res", res.data.data, visiblePro);
      })
      .catch((err) => console.log("err", err));

    return () => controller.abort();
  };
  const handleAddToCart = async (e, product, selectedAttributes, quantity) => {
    // console.log("add", e, product, selectedAttributes, quantity);
    if (token === "null" || !token) {
      validateUser();
      toast.error("Please login to product add to cart!");
    } else {
      const AlreadyExistsData = getCartData?.items.filter((i) => {
        return i?.variation_id !== 0
          ? typeof selectedAttributes === "object"
            ? i?.variation_id === selectedAttributes?.id
            : i?.variation_id === selectedAttributes
          : true && i?.product_id === product?.id;
      });
      if (product?.id !== 4070) {
        if (
          product?.variations &&
          product?.variations.length !== 0 &&
          selectedAttributes === 0
        ) {
          console.warn("open modal ProductVariationsData Edit api call");
          setShowVariationModal((prev) => !prev);
          setSelectedProductForModal(product);
        } else {
          if (selectedAttributes === null && selectedAttributes !== undefined) {
            toast.error(
              `Please select ${
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
              if (AlreadyExistsData.length > 0) {
                const payload = {
                  cart_id: AlreadyExistsData[0]?.cart_id,
                  quantity: AlreadyExistsData[0]?.quantity + quantity,
                };
                setApiLoading(true);
                // console.log("EditCartData api call")
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
                  toast.success("Product updated in cart successfully!");
                  if (showVariationModal === true) {
                    setShowVariationModal((prev) => !prev);
                  }
                  dispatch(AddToCart({ ...res.data, items: res.data.items }));
                } catch (err) {
                  console.log("error", err);
                }
              } else {
                const payload = {
                  product_id: product?.id,
                  variation_id:
                    selectedAttributes === 0
                      ? selectedAttributes
                      : selectedAttributes?.id,
                  quantity: quantity,
                };
                setApiLoading(true);
                // console.log("AddtoCartData api call",payload);
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
                  toast.success("Product added to cart successfully!");
                  dispatch(
                    AddToCart({
                      ...res.data,
                      items: [...getCartData.items, res.data?.data],
                    })
                  );
                } catch (err) {
                  console.log("error", err);
                }
              }
            }
          }
        }
      }else{
        navigate(`/products/${product.slug}`);
      }
    }
  };

  return (
    <>
      {apiloading && <Loader2></Loader2>}
      <section className="dental-product-section">
        <AddToCartModal
          isOpen={showVariationModal}
          onClose={() => setShowVariationModal(false)}
          product={selectedProductForModal}
          onAddToCart={handleAddToCart}
          variations={selectedProductForModal?.variation}
        ></AddToCartModal>
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
                onClick={(e) => handleCategoryClick(e, null)}
              >
                All Products
                {/* <Link to="/products"></Link> */}
              </li>
              {visibleCategories?.map((category, index) => {
                return (
                  <li
                    key={index}
                    className={`product-category ${
                      selectedCategory === category.slug ? "active" : ""
                    }`}
                    onClick={(e) => handleCategoryClick(e, category.slug)}
                  >
                    {category.name}
                    {/* <Link to={`/products?category=${category?.slug}`}>
                    </Link> */}
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
          <div className="row pt-1 pt-md-3 justify-content-center">
            {loadingProducts ? (
              <p>Loading products...</p>
            ) : visibleProduct.length > 0 ? (
              visibleProduct.map((item, index) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 col-6"
                  key={item.id || index}
                >
                  <div className="card position-relative">
                    {item.regular_price && item.sale_price && (
                      <span className="discount-badge position-absolute top-0 end-0 m-1 m-sm-2 px-2 py-1 rounded text-white">
                        Sale{" "}
                        {Math.round(
                          ((item.regular_price - item.sale_price) /
                            item.regular_price) *
                            100
                        )}
                        %
                      </span>
                    )}
                    <Link to={`/products/${item.slug}`}>
                      <img
                        src={item.image || "/img/product-img4.png"}
                        className="card-img-top img-fluid"
                        alt={item.name || "Product"}
                      />
                    </Link>

                    <div className="card-body d-flex align-items-center justify-content-between px-lg-0 px-0 py-2">
                      <div className="d-block">
                        <h2 className="product-card-title mb-0">
                          {item.name || "Product Title"}
                        </h2>
                        <p className="product-price mb-0">
                          {item.sale_price ? (
                            <>
                              <span className="text-muted text-decoration-line-through me-2">
                                ₹{Number(item.regular_price).toFixed(2)}
                              </span>
                              <span className="fw-bold text-white">
                                ₹{Number(item.sale_price).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="fw-bold text-white">
                              ₹
                              {Number(
                                item.price || item.regular_price || "0"
                              ).toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                      <img
                        className="shopping-bag-icon img-fluid"
                        alt="shopping-bag"
                        src="/img/lightShopping-bag-icon.svg"
                        onClick={(e) => handleAddToCart(e, item, 0, 1)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-light text-center">
                No products found for this category.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
