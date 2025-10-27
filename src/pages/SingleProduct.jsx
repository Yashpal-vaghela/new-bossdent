import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../api/config";
import axios from "axios";

const SingleProduct = () => {
  const { slug } = useParams();
  const [singleProduct,setSingleProduct] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const SingleProductData = async () => {
      try{
        const res = await axios.get(`${BASE_URL}/product/${slug}`,{signal:controller.signal});
        setSingleProduct(res.data.data);
      } catch(err){
        if(err.name !== "AbortError") console.error(err);
      }
    }
    SingleProductData();
    return () => controller.abort();
  }, []);
  return (
    <div>
      Single Product page
      <section className="breadcrumb-section">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Products</li>
            <li className="breadcrumb-item active">
              Customizable retainer box
            </li>
          </ol>
        </nav>
      </section>
    </div>
  );
};

export default SingleProduct;
