import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const AddToCartModal = ({isOpen,onClose,product,stockStatus,onAddToCart}) => {
    const [quantity,setQuantity] = useState(1);
    const [selectedAttributes,setSelectedAttributes] = useState({});
    const [salePrice,setSalePrice] = useState(null);
    const [productData,setProductData] = useState([]);
    const [isCategoryLoading,setIsCategoryLoading] = useState(true);
    const navigate = useNavigate();
    
    // if(!isOpen || !product || isCategoryLoading) return null;
    console.log("product",product);
    return (
        // <div className="modal-overlay">
        //     <div className="modal-container">
        //         <div className="model-close" onClick={onClose}>×</div>
        //         <div className="modal-content">
        //             <div className="modal-image">
        //                 <img src="/img/cat-img1.png" className="img-fuid" alt="cat-img"></img>
        //             </div>

        //             <div className="modal-details">
        //                 <h2 className="modal-title">Modal title</h2>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="modal fade" id="cartModal" tabIndex="-1" aria-labelledby='cartModal' aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label='Close'></button>
                    </div>
                    <div className="modal-body">
                         <h2 className="modal-title">4 Ply Mask (Meltblown)</h2>
                         
                         <div className="modal-img-wrapper d-flex align-items-start justify-content-between">
                            <div className="modal-subdescription-wrapper">
                                <h3 className='mb-1 modal-category-title'>Category: Mask</h3>
                                {/* <p className='mb-0 '>Category: Mask</p> */}
                                <p className='mb-0 modal-stockStatus'>In Stock</p>
                                <p className="mb-1 modal-price">Price: <b>₹200.00</b></p>
                            </div>
                            <img src="/img/cat-img1.png" className='img-fluid' alt="cart-img"></img>
                         </div>
                         <div className='modal-variation-wrapper mb-3'>
                            <label className='form-label'>Select color</label>
                            <select className="modal-variation-select form-select">
                                <option>Select Color</option>
                                <option>Blue</option>
                                <option>Yellow</option>
                                <option>Orange</option>
                            </select>
                         </div>
                         <div className="modal-quality-wrapper mt-4 mb-3 d-flex gap-4 align-items-center">
                            <button >-</button>
                            <span>1</span>
                            <button>+</button>
                         </div>
                    </div>
                    <div className='modal-footer '>
                        <button type="button" className="btn btn-addTocart " onClick={onAddToCart}>Add To Cart</button>
                        <button type="button" className="btn btn-buynow " onClick={()=>navigate("/checkout")}>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
