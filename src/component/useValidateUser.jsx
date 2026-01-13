// import { useLocation, useNavigate } from 'react-router-dom';

const useValidateUser = () => {
    // const location = useLocation();
    // const navigate = useNavigate();

    const validateUser = () => {
        setTimeout(() => {
            const modal = document.getElementById("exampleModal");
            if (!modal) return;

            // ❗ Prevent duplicate backdrop
            if (document.querySelector(".modal-backdrop")) return;

            modal.classList.add("show");
            modal.style.display = "block";

            const backdrop = document.createElement("div");
            backdrop.className = "modal-backdrop fade show";
            document.body.appendChild(backdrop);

            document.body.classList.add("modal-open");
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "15px";
        }, 1000);
    };

    return validateUser;
}

export default useValidateUser;