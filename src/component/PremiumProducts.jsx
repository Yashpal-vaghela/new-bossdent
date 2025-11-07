import React, { useEffect, useState } from 'react';
import axios from "axios";
import BASE_URL from "../api/config";

const PremiumProducts = () => {
    const [premiumProducts, setPremiumProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchPremiumProducts = async () => {
            try{
                const response = await axios.get(`${BASE_URL}/category/premium-product`);
                const product = response.data?.data || [];
                setPremiumProducts(product);
            }catch (error){
                console.error("Error fetching the Premium Products:", error);
                setError("Failed to load Premium Product.");
            } finally {
                setLoading(false);
            }
        };
        fetchPremiumProducts();
    },[]);
  return (
    <section className='premium-products-section'>
        <div className='container'>
            <div className='d-flex justify-content-between align-items-center'>
                <h2 className='text-white fs-2 section-title'>
                    Exclusive Premium Products
                </h2>
                <button className='btn btn-default txt-grident btn-view'>
                    view All<i className='fa-solid fa-arrow-right'/> 
                </button>
            </div>
            {loading ? (
                <p className="text-light text-center mt-4">Loading premium products...</p>
            ): error ? ( 
                <p className="text-danger text-center mt-4">{error}</p>
            ): premiumProducts.length === 0 ?(
                <p className="text-light text-center mt-4">No premium products available.</p>
            ) : (
                <div className='grid-container my-3'>
                    <div className='grid-item big card position-relative'>
                        {premiumProducts[6]?.regular_price && premiumProducts[6]?.sale_price && (
                            <span className="discount-badge position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white">
                                Sale {Math.round(((premiumProducts[6]?.regular_price - premiumProducts[6]?.sale_price) / premiumProducts[6]?.regular_price) * 100)}%
                            </span>
                        )}
                        <img
                            src={premiumProducts[6]?.image}
                            className="img-fluid"
                            alt={premiumProducts[6]?.name}
                        ></img>
                        <div className="product-cart-wrapper d-flex justify-content-between w-100 align-items-center">
                            <img
                            src="/img/heart-icon.svg"
                            className="heart-icon img-fluid"
                            alt="heart-icon"
                            ></img>
                            <button className="btn btn-default ">
                            Add to Cart
                            <img
                                src="/img/shopping-bag-icon.svg"
                                className="img-fluid"
                                alt="shopping-bag-icon"
                            ></img>
                            </button>
                            <img
                            src="/img/eye-icon.svg"
                            className="eye-icon img-fluid"
                            alt="eye-icon"
                            ></img>
                        </div>
                        <h2 className="product-card-title txt-grident">{premiumProducts[6]?.name}</h2>
                        <h3 className="product-price">
                            ₹{premiumProducts[6]?.sale_price ? (
                                <>
                                    <span className='text-muted text-decoration-line-through me-2'>
                                        ₹{premiumProducts[6]?.regular_price}
                                    </span>
                                    <span className='fw-bold text-white'>
                                        ₹{premiumProducts[6]?.sale_price}
                                    </span>
                                </>
                            ) : (
                                <span className="fw-bold text-white">
                                    ₹{premiumProducts[6]?.price || premiumProducts[6]?.regular_price || "0"}
                                </span>
                            )}
                        </h3> 
                    </div>
                    {premiumProducts.slice(0,11).map((item,index) => (
                        <div className='grid-item card position-relative' key={index}>
                            {item.regular_price && item.sale_price && (
                                <span className="discount-badge position-absolute top-0 end-0 m-2 px-2 py-1 rounded text-white">
                                Sale {Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100)}%
                                </span>
                            )}
                            <img 
                                src={item.image}
                                className='product-img img-fluid'
                                alt={item.name}
                            />
                            <div className='product-card-wrapper d-flex align-items-center justify-content-between w-100 h-auto'>
                                <div className='d-block'>
                                    <h2 className="product-card-title mb-0">{item.name}</h2>
                                    <p className="product-price mb-1">
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
                                    </p>
                                </div>
                                <img
                                    src="/img/lightShopping-bag-icon.svg"
                                    className="shopping-bag-icon img-fluid"
                                    alt="shopping-bag"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}    
        </div>
    </section>
  )
}

export default PremiumProducts
