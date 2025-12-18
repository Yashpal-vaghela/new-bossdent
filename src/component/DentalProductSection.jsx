import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../api/config';
import { toast } from 'react-toastify';
import { AddToCart } from "../redux/cartSlice";

export const DentalProductSection = ({getCartData,token,dispatch,categories,loadingProducts,visibleProducts}) => {
    const [showAll, setShowAll] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const visibleCategories = showAll ? categories : categories.slice(0, 5);
    const handleCategoryClick = (slug) => {
        const controller = new AbortController();
        setSelectedCategory(slug);
        // if(slug){
        //   fetchProducts(controller, slug);
        // }
        // if (!slug) {
        //   fetchProducts(controller);
        // } else {
        //   fetchProducts(controller, slug);
        // }
        return () => controller.abort();
    };
    const handleAddToCart = async (e,product) =>{
        // console.log("add",e,product)
        const filterCartData = getCartData?.items.filter((i)=>i?.product_id === product?.id)
        if(filterCartData.length > 0 ){
        const payload = {
            cart_id:filterCartData[0]?.cart_id,
            quantity:Number(filterCartData[0].quantity) + 1
        }
        await axios.post(`${BASE_URL}/update-cart`,payload,{
            headers:{
            Authorization:`Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type" :"application/json"
            }
        }).then((res)=>{
            console.log("res",res.data);
            toast.success("Product updated in cart successfully!");
            dispatch(AddToCart({...res.data,items:res.data.items}));
        }).catch((err)=>{
            console.log("err",err);
        })
        }else{
        const payload = {
            product_id:product?.id,
            variation_id:0,
            quantity:1
        }
        await axios.post(`${BASE_URL}/new-add-to-cart`,payload,{
            headers:{
            Authorization:`Bearer ${token}`.replace(/\s+/g, " ").trim(),
            "Content-Type" :"application/json"
            }
        }).then((res)=>{
            console.log("res",res.data,getCartData);
            toast.success("Product added to cart successfully!");
            dispatch(AddToCart({...res.data,items: [...getCartData.items, res.data?.data]}));
        }).catch((err)=>{
            console.log("err",err);
        })
        }
    }

    return (
         <section className="dental-product-section">
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
                          <Link to={`/products?category=${category.slug}`}>
                            {category.name}
                          </Link>
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
                  ) : visibleProducts.length > 0 ? (
                    visibleProducts.map((item, index) => (
                      <div
                        className="col-lg-3 col-md-4 col-sm-6 col-6"
                        key={item.id || index}
                      >
                        <div className="card position-relative">
                          {item.regular_price && item.sale_price && (
                            <span className="discount-badge position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white">
                              Sale{" "}
                              {Math.round(
                                ((item.regular_price - item.sale_price) /
                                  item.regular_price) *
                                  100
                              )}
                              %
                            </span>
                          )}
                          <Link to={`/products?category=${item.slug}`}>
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
                                      ₹{item.regular_price}
                                    </span>
                                    <span className="fw-bold text-white">
                                      ₹{item.sale_price}
                                    </span>
                                  </>
                                ) : (
                                  <span className="fw-bold text-white">
                                    ₹{item.price || item.regular_price || "0"}
                                  </span>
                                )}
                                {/* ₹{item.sale_price || item.price || "0"} */}
                              </p>
                            </div>
                            <img
                              className="shopping-bag-icon img-fluid"
                              alt="shopping-bag"
                              src="/img/lightShopping-bag-icon.svg"
                              onClick={(e)=>handleAddToCart(e,item)}
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
    )
}
