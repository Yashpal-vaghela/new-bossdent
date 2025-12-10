import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddToCartModal = ({
  isOpen,
  onClose,
  product,
  stockStatus,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [salePrice, setSalePrice] = useState(null);
  const [price,setPrice] = useState(null);
  const modalRef = useRef();

  // const uniqueVariations = React.useMemo(() => {
  //   if (!product?.variations) return [];
  //   return product?.variations.reduce((acc, item) => {
  //     const size = item.attributes.size;
  //     if (!acc[size]) {
  //       acc[size] = {
  //         variation_id: item?.id,
  //         attributes: { size, pack: [] },
  //         regular_price: [],
  //         sale_price: [],
  //         price: [],
  //       };
  //     }

  //     acc[size].attributes.pack.push(item.attributes.pack);
  //     acc[size].regular_price.push(item.regular_price);
  //     acc[size].sale_price.push(item.sale_price);
  //     acc[size].price.push(item.price);
  //     return acc;
  //   }, {});
  // }, [product]);

  const [variation, setVariations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // if (product?.slug === "paper-point") {
    //   setVariations(Object.values(uniqueVariations));
    // } else {
    //   setVariations(product?.variations);
    //   setSalePrice(product?.sale_price);
    //   setPrice(product?.price);
    // }
    setVariations(product?.variations);
    setSalePrice(product?.sale_price);
    setPrice(product?.price);
  }, [product]);

  function handleClickOutside(e) {
      // If modal is open AND click is outside modal content
      if (isOpen && modalRef.current) {
        onClose(); // close modal
        if(!modalRef.current.classList !== undefined){
            modalRef.current.classList.remove("d-block")
        }
      }
  }
  const handleAttributeSelect = (e) =>{
    const {name,value} = e.target;
    setSelectedAttributes({...selectedAttributes,[name]:value})
  }
  const getMatchedVariation = () => {
    if (!Object.values(selectedAttributes)[0]) return null;

    return product?.variations.find((v,index)=>{
      const sizeMatch = Object.values(v?.attributes)[0] === Object.values(selectedAttributes)[0];
      const packMatch = Object.values(v?.attributes)[1] && Object.values(v?.attributes)[1] === Object.values(selectedAttributes)[1];
      return Object.values(v?.attributes)[1] ? sizeMatch && packMatch : sizeMatch;
    });
  }
  const handleQuantity = (e,action) => {
    e.preventDefault();
    if(action === "PLUS"){
      setQuantity((prev)=> prev + 1);
    }else if(action === "MINUS" && quantity > 1){
      setQuantity((prev)=> prev - 1);
    }
  };

  if (!isOpen || !product) return null;
  return (
    <div className={`modal fade ${isOpen ? "show d-block" : ""}`} ref={modalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClickOutside}
            ></button>
          </div>
          <div className="modal-body">
            <h2 className="modal-title">{product?.name} {
              selectedAttributes !== undefined && Object.values(selectedAttributes)[0]}</h2>
            <div className="modal-img-wrapper d-flex align-items-start justify-content-between">
              <div className="modal-subdescription-wrapper">
                {
                  product.categories !== undefined && (
                    <h3 className="mb-1 modal-category-title">
                      Category:{" "}
                      <b>{product?.categories.map((i) => i.split(","))}</b>
                    </h3>
                  )
                }
              
                <p className="mb-0 modal-stockStatus">{product?.stock}</p>
                <p className="mb-1 modal-price">
                  Price: {product?.product_price ? 
                  <b>₹{Number(product?.product_price).toFixed(2)}</b> : 
                  <b>₹{Number(product?.price).toFixed(2)}</b>} 
                  {/* <b>₹{Number(product?.price).toFixed(2)}</b> */}
                </p>
              </div>
              <img
                src={product?.image}
                className="img-fluid"
                alt="cart-img"
                width="150"
                height="200"
              ></img>
            </div>
            <div className="modal-variation-wrapper mb-3">
                {
                    variation?.length > 0 && <>
                        <label className="form-label">Select {variation?.map((i,index)=>Object.keys(i?.attributes)[index])[0]}</label>
                        <select className="modal-variation-select form-select" name={Object.keys(variation[0]?.attributes)[0]} onChange={(e)=>handleAttributeSelect(e)}>
                            {variation !== undefined ?
                            <>  
                              <option>Select {variation?.map((i,index)=>Object.keys(i?.attributes)[index])[0]}</option>
                              {variation?.map((sizeKey,index) => {
                                  return (
                                      <option key={index}  value={Object.values(sizeKey?.attributes)[0]} >
                                          {Object.values(sizeKey?.attributes)[0]}
                                      </option>
                                  )})
                              }
                            </>
                            :<></>}
                        </select>
                    </>
                }
            </div>
            {variation?.map((i,index)=>Object.keys(i?.attributes)[index])[1] !== undefined ?
                <>
                    <label className="form-label">Select {variation?.map((i,index)=>Object.keys(i?.attributes)[index])[1]}</label>
                    <select className="modal-variation-select form-select" name={Object.keys(variation[0]?.attributes)[1]} onChange={(e)=>handleAttributeSelect(e)}> 
                        {variation &&
                          variation[0]?.attributes?.pack?.map((item, index) => (
                          <option key={index}  value={item}>{item}</option>
                        ))}
                    </select>
                </> :
                <div className="modal-quality-wrapper mt-4 mb-3 d-flex gap-4 align-items-center">
                    <button type="button" onClick={(e)=>handleQuantity(e,"MINUS")}>-</button>
                    <span>{quantity}</span>
                    <button type="button" onClick={(e)=>handleQuantity(e,"PLUS")}>+</button>
                </div>
            }
          </div>
          <div className="modal-footer mb-2">
            <button
              type="button"
              className="btn btn-addTocart"
              onClick={(e)=>{
                const selectedVariation = getMatchedVariation();
                onAddToCart(e,product,selectedVariation,quantity)}}
            >
              Add To Cart
            </button>
            <button
              type="button"
              className="btn btn-buynow"
              onClick={(e)=>{
                const selectedVariation = getMatchedVariation();
                onAddToCart(e,product,selectedVariation,quantity,"/checkout")
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};