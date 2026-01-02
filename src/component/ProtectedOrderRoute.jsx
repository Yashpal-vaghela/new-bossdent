import React from 'react'
import { useLocation,Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useValidateUser from './useValidateUser';

export const ProtectedOrderRoute = ({children}) => {
    const location = useLocation();
    const token = useSelector((state)=>state.auth.token);
    const validateUser = useValidateUser();
    // const cartdata = useSelector((state)=>state.cart.cart);
    // if(token === "null"){
    //     // if(cartdata.items.length === 0){
    //           return(
    //                 <Navigate 
    //                     to="/"
    //                     state={{from:location.pathname}}
    //                     replace
    //                 ></Navigate>
    //         )
        
    // }
     useEffect(() => {
        if (!token || token === "null") {
            localStorage.setItem("redirect_after_login", location.pathname);
            validateUser();
        }
    }, [token]);
    if (!token || token === "null") {
        return null;
    }
    return children;
}
