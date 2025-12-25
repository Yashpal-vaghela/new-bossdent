import React, { useEffect, useState } from "react";
import { Link,useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../api/config";
import Loader1 from "../component/Loader1";
import Loader2 from "../component/Loader2";

const Category = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryProducts = async() => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/category/${slug}`);
                const data = response.data?.data || [];

                setProducts(data);
                setCategoryName(slug.replace("-", " ").toUpperCase());
            }catch (err){
                console.error("Error fetching category products:", err);
                setError("Failed to load category products.");
            }finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    },[slug])
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
         <Loader2></Loader2>
        ) : (
          <>
            <section className="product-section">
              {/* <AddToCartModal isOpen={showVariationModal} onClose={()=>setShowVariationModal(false)} product={selectedProductForModal} onAddToCart={handleAddToCartFromModal} variations={selectedProductForModal?.variation}></AddToCartModal> */}
              <div className="container">
                <div className="product-category-content d-flex gap-5 my-4">
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
                              </div>
                              <div
                                className="product-cart-wrapper"
                                data-bs-toggle="modal"
                                data-bs-target="#cartModal"
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
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </React.Fragment>
  )
}

export default Category