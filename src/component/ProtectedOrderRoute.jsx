import React from 'react'
import { useLocation,Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedOrderRoute = ({children}) => {
    const location = useLocation();
    const token = useSelector((state)=>state.auth.token);
    // const cartdata = useSelector((state)=>state.cart.cart);
    if(token === "null"){
        // if(cartdata.items.length === 0){
              return(
                    <Navigate 
                        to="/"
                        state={{from:location.pathname}}
                        replace
                    ></Navigate>
            )
        
    }

    return children;
}
