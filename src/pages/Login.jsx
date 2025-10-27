import React from "react";

const Login = () => {
  return (
    <div className="home-main">
      <div className="container">
        <section className="login-container">
          <div className="row">
            <div className="col-lg-6 col-6">Login</div>
            <div className="col-lg-6 col-6">
              <img src="/img/" className="img-fluid" alt="bossdent-logo"></img>
            </div>
            <div className="col-12">
              <input
                className="form-control"
                name="email"
                value=""
                placeholder="Email"
              ></input>
            </div>
            <div className="col-12">
              <input
                className="form-control"
                name="password"
                value=""
                placeholder="password"
              ></input>
            </div>
          </div>
          Login
        </section>
      </div>
    </div>
  );
};

export default Login;



// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import BASE_URL from "../api/config";

// const Cart = () => {
//   const cartData = [{ id: 1 }, { id: 2 }, { id: 3 }];
//   const relatedProduct = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
//   const [CartData, setCartData] = useState([]);
//   const [token] = useState(JSON.parse(localStorage.getItem("auth_token")));
//   const navigate = useNavigate();

//   const fetchCartData = async () => {
//     try {
//       const res = await axios
//         .get(`${BASE_URL}/get-cart`, {
//           headers: {
//             Authorization: `Bearer ${token}`.replace(/\s+/g, " ").trim(),
//             "Content-Type": "application/json",
//           },
//           withCredentials: false,
//         })
//         .then((res) => {
//           console.log("res", res.data);
//           setCartData(res.data.items);
//         })
//         .catch((err) => console.log("error", err));
//       console.log("res", res.data);
//       setCartData(res.data);
//     } catch (error) {
//       console.log("error", error);
//     }
//   };
//   useEffect(() => {
//     fetchCartData();
//   }, []);
//   return (
//     <div className="home-main">
//       <section className="breadcrumb-section pt-3 pb-2">
//         <div className="container">
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="#">Home</Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">
//                 Cart
//               </li>
//             </ol>
//           </nav>
//         </div>
//       </section>
//       <section className="cart-section">
//         <div className="container">
//           <div className="row my-5 text-white">
//             <div className="col-lg-8">
//               <div className="cart-container">
//                 <div className="cart-header">
//                   <h2>Img</h2>
//                   <h2>Product Title</h2>
//                   <h2 >Pack Size</h2>
//                   <h2>Quantity</h2>
//                   <h2>Subtotal</h2>
//                 </div>
//                 {CartData.length !== 0 &&
//                   CartData?.map((item, index) => {
//                     return (
//                       <div className="cart-item" key={index}>
//                         <div className="cart-item-product">
//                           <img
//                             src={item?.image}
//                             alt="cart-product-img"
//                             className="cart-product-img img-fluid"
//                             width="100%"
//                             height="100%"
//                           ></img>
//                           <p className="cart-item-name mb-1">
//                             {item?.product_name}
//                           </p>
//                           <p className="cart-item-pack mb-1 d-block d-md-none">1 pcs / box</p>
//                           <p className="cart-item-price mb-0 d-flex d-md-block gap-1">
//                             ₹ {item?.product_price}
//                           </p>
//                         </div>
//                         <div className="card-item-product-title">
//                           <p className="cart-item-name mb-1">
//                             {item?.product_name}
//                           </p>
//                           <p className="cart-item-price mb-0 d-flex d-md-block gap-1">
//                             ₹ {item?.product_price}
//                             <p className="cart-item-pack mb-0 d-block d-md-none">X 1 pcs / box</p>
//                           </p>
                        
//                           <p className="cart-item-subtotal mb-0 d-block d-md-none">
//                             ₹ {item?.subtotal}
//                           </p>
//                         </div>
//                         <p className="cart-item-pack mb-0 d-md-block d-none">1 pcs / box</p>
//                         <div className="cart-item-quantity">
//                           <button>-</button>
//                           <span>{item?.quantity}</span>
//                           <button>+</button>
//                         </div>
//                         <p className="cart-item-subtotal mb-0 d-md-block d-none">
//                           ₹ {item?.subtotal}
//                         </p>
//                         <button className="cart-item-remove d-block d-md-none"></button>
//                         <button className="cart-item-remove d-md-block d-none">✕</button>
//                       </div>
//                     );
//                   })}

//                 <div className="cart-footer d-md-block d-none">
//                   <button
//                     className="return-shop"
//                     onClick={() => navigate("/products")}
//                   >
//                     Return to shop
//                   </button>
//                   <button className="clear-cart">Clear cart</button>
//                 </div>
//               </div>
//               <div className="cart-footer d-md-none d-flex">
//                   <button
//                     className="return-shop"
//                     onClick={() => navigate("/products")}
//                   >
//                     Return to shop
//                   </button>
//                   <button className="clear-cart">Clear cart</button>
//               </div>
             
//             </div>
//             <div className="col-lg-4">
//               <div className="cart-coupon-container">
//                 <div className="cart-coupon-title d-flex justify-content-between align-items-center">
//                   <h2>Best Coupons For You</h2>
//                   <Link to="#" className="cart-applycoupon-btn">
//                     All Coupons <i className="fa-solid fa-chevron-right"></i>
//                   </Link>
//                 </div>
//                 <input
//                   className="form-control"
//                   name="coupon"
//                   placeholder="Coupon code"
//                 ></input>
//                 <button className="btn btn-checkout">
//                   Proceed to checkout
//                 </button>
//               </div>
//               <div className="cart-total-container">
//                 <h2 className="cart-total-title">Cart Total</h2>
//                 <div className="cart-total-content">
//                   <p>Subtotal:</p>
//                   <p>$84.00</p>
//                 </div>
//                 <div className="cart-total-content">
//                   <p>Shipping:</p>
//                   <p>Free</p>
//                 </div>
//                 <div className="cart-total-content">
//                   <p>Discount:</p>
//                   <p>Free</p>
//                 </div>
//                 <div className="cart-total-content">
//                   <p>Total:</p>
//                   <p>$84.00</p>
//                 </div>
//                 <p className="cart-applycoupon-notice">
//                   You’ll save <b>₹50.00</b> on this order!{" "}
//                 </p>
//                 <button className="btn btn-checkout">
//                   Proceed to checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="related-section product-section">
//         <div className="container">
//           <h2 className="related-product-title">Related Products</h2>
//           <div className="row justify-content-center gap-3 gap-sm-0 mb-5">
//             {relatedProduct?.map((product, index) => {
//               return (
//                 <div
//                   className="col-11 col-sm-10 col-md-6 col-lg-4 col-xl-3"
//                   key={index}
//                 >
//                   <div className="card">
//                     <img
//                       src="/img/product-img3.png"
//                       className="card-img-top img-fluid"
//                       alt="product-img"
//                     ></img>
//                     <div className="card-body">
//                       <h2 className="product-title card-title">
//                         Customizable Retainer Box
//                       </h2>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <div className="product-content-wrapper">
//                           <span className="product-price card-text">
//                             Starting at: ₹200.00
//                           </span>
//                           <p className="product-review mb-2 mb-md-2 mb-lg-4">
//                             <i className="fa-solid fa-star me-2"></i>4.1
//                           </p>
//                         </div>
//                         <div className="product-cart-wrapper">
//                           <img
//                             src="/img/cart-icon.svg"
//                             className="cart-icon img-fluid"
//                             alt="cart-icon-img"
//                           ></img>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Cart;
