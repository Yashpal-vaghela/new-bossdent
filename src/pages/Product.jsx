import React, { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';

export const Product = () => {
    const [products,setProducts] = useState([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11},{id:12}]);
    return (
        <div>
            <section className='Breadcrumbs-section'>
                <div className='container'>
                    <nav aria-label='breadcrumb'>
                        <ol className="breadcrumb">
                            <li className='breadcrumb-item active'>
                                <Link to="#">Home</Link>
                            </li>
                            <li>
                                <Link to="#">Products</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>
        </div>
    )
}

export default Product;