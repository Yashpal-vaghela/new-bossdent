import React from "react";
import { Link } from "react-router-dom";
import "../css/wishlist.css";

const Wishlist = () => {
  const wishlistData = [
    { id: 1, stock: "instock" },
    { id: 2, stock: "instock" },
    { id: 3, stock: "outstock" },
  ];

  return (
    <div className="home-main wishlist-main">
      <section className="breadcrumb-section pt-2 pb-2">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                WishList
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="wishlist-section">
        <div className="container">
          <div className="wishlist-container my-4">
            <div className="wishlist-header">
              <h2>Img</h2>
              <h2>Product</h2>
              <h2>Price</h2>
              <h2>Pack Size</h2>
              <h2>Stock</h2>
              <h2>Cart</h2>
            </div>
            {wishlistData?.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="wishlist-item" key={index}>
                    <div className="wishlist-item-wrapper">
                      <div className="wishlist-item-product">
                        <img
                          src="/img/cart-product-img.png"
                          alt="wishlist-product-img"
                          className="wishlist-product-img img-fluid"
                        ></img>
                      </div>
                      <p className="wishlist-item-name mb-1">
                        Customizable Retainer Box
                      </p>
                      <p className="wishlist-item-price mb-md-0 mb-1">
                        ₹3300.00
                      </p>
                      <p className="wishlist-item-pack mb-md-0 mb-4">
                        1 pcs / box
                      </p>
                    </div>
                    <button className={`btn wishlist-item-stock ${item.stock}`}>
                      {item?.stock}
                    </button>
                    <button className="btn wishlist-addTocart">
                      Add to Cart
                    </button>
                    <button className="wishlist-item-remove">✕</button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Wishlist;
