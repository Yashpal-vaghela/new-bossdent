import React from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useValidateUser = () => {
    const navigate = useNavigate();
    const validateUser = () =>{
        toast.error("Please login to add product to wishlist!");
        setTimeout(() => {
            const modal = document.getElementById("exampleModal");
            if (modal) {
                modal.classList.add("show");
                modal.style.display = "block";

                // Add backdrop
                const backdrop = document.createElement("div");
                backdrop.className = "modal-backdrop fade show";
                document.body.appendChild(backdrop);

                // Body settings
                document.body.classList.add("modal-open");
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = "15px";
            }
            navigate("/");
        }, 2000);
    }
    return validateUser;
}

export default useValidateUser;