import React from 'react'
import { useLocation,Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedOrderRoute = ({children}) => {
    const location = useLocation();
    const cartdata = useSelector((state)=>state.cart.cart)
    if(cartdata.items !== undefined && cartdata.items.length === 0){
        // if(cartdata.items.length === 0){
              return(
                    <Navigate 
                        to="/products"
                        state={{from:location.pathname}}
                        replace
                    ></Navigate>
            )
        
    }

    return children;
}
