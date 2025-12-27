import React from 'react';
import { useSelector } from 'react-redux';
import {Navigate,useLocation} from 'react-router-dom';   
// import { toast } from 'react-toastify';

const ProtectedRoute = ({children}) => {
    const location = useLocation();
    // const token = localStorage.getItem("auth_token");
    const cartdata = useSelector((state)=>state.cart.cart);
    
    if(cartdata.items !== undefined && cartdata.items.length === 0){
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

export default ProtectedRoute;