import React from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AddToCart } from "../redux/cartSlice";
import {
  AddToWishlist,
  WishlistCounter,
  wishlistId,
} from "../redux/wishlistSlice";
import { AddToken } from "../redux/authSlice";

export const ProfileSideBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const handleLogout = () => {
    const controller = new AbortController();
    localStorage.removeItem("auth_token");
    dispatch(AddToCart({ items: [], cart_count: 0, cart_total: 0 }));
    dispatch(AddToWishlist({ wishlist: [], wishlistCount: 0 }));
    dispatch(WishlistCounter(0));
    dispatch(wishlistId(0));
    dispatch(AddToken("null"));
    // navigate("/");
    return () => {
      controller.abort();
    };
  };
  const handleOffcanvas1 = () => {
    const offcanvasEl = document.getElementById("offcanvasExample1");
    if (offcanvasEl) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
      bsOffcanvas?.hide();
    }

    // ✅ REMOVE BODY INLINE STYLES
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.body.classList.remove("offcanvas-backdrop", "show");
  };
  return (
    <React.Fragment>
      <div
        className="leftside-bar offcanvas offcanvas-start col-lg-3 col-7"
        tabIndex="-1"
        id="offcanvasExample1"
        aria-labelledby="offcanvasLabel"
      >
        <div className="offcanvas-header ms-auto">
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            id="close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <h2>Navigation</h2>
          <ul id="leftside-ul">
            <li
              className={
                location.pathname.split("/")[1] === "order-history"
                  ? "active"
                  : ""
              }
              onClick={handleOffcanvas1}
            >
              <Link to="/order-history">
                <svg
                  className="order-icon icon-2"
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.79395 9.5L3.42969 11.8662L3.08008 12.2158L3.42578 12.5693C4.02161 13.1786 4.73247 13.6637 5.51758 13.9951C6.3028 14.3266 7.14672 14.4981 7.99902 14.5H8.00098C9.34342 14.498 10.6525 14.0806 11.748 13.3047C12.7462 12.5978 13.5216 11.6246 13.9902 10.5H14.0205L14.1377 10.166C14.2141 9.94806 14.2785 9.72517 14.332 9.5H15.3467C15.0215 11.0927 14.1878 12.5429 12.9609 13.625C11.5909 14.8333 9.82671 15.4999 8 15.5H7.98828C7.0043 15.5029 6.02929 15.3109 5.12012 14.9346C4.21095 14.5582 3.38544 14.0051 2.69141 13.3076L2.33789 12.9521L1.9834 13.3066L0.5 14.791V9.5H5.79395ZM7.99512 0.5H8.00195C8.98599 0.496933 9.96086 0.689142 10.8701 1.06543C11.7795 1.4418 12.6057 1.99465 13.2998 2.69238L13.6523 3.04785L14.0068 2.69434L15.5 1.20508V6.5H10.208L12.5752 4.13379L12.9248 3.78418L12.5791 3.43066C11.9826 2.82065 11.2705 2.33536 10.4844 2.00391C9.6983 1.67253 8.85404 1.50119 8.00098 1.5H7.99902C6.65658 1.50203 5.34749 1.91944 4.25195 2.69531C3.25383 3.4022 2.47839 4.37545 2.00977 5.5H1.98047L1.8623 5.83301C1.78507 6.05128 1.72142 6.27445 1.66797 6.5H0.652344C0.977373 4.90786 1.81096 3.45792 3.03711 2.37598C4.32063 1.24352 5.95023 0.586405 7.65332 0.507812L7.99512 0.5Z"
                    fill="transparent"
                    stroke="transparent"
                  />
                </svg>
                Order History
              </Link>
            </li>
            <li
              className={location.pathname === "/profile" ? "active" : ""}
              onClick={handleOffcanvas1}
            >
              <Link to="/profile">
                <svg
                  className="me-2 icon-1 profile-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21H13V15H21V21ZM11 21H3V11H11V21ZM21 13H13V3H21V13ZM11 9H3V3H11V9Z"
                    fill="transparent"
                  />
                </svg>
                Profile
              </Link>
            </li>
            <li
              className={location.pathname === "/wishlist" ? "active" : ""}
              onClick={handleOffcanvas1}
            >
              <Link to="/wishlist">
                <svg
                  className="me-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9997 21.0543C-7.99987 10.0001 6.00011 -1.99988 11.9997 5.58817C18.0001 -1.99989 32.0001 10.0001 11.9997 21.0543Z"
                    stroke="transparent"
                    strokeWidth="1.5"
                  />
                </svg>
                Wishlist
              </Link>
            </li>
            <li
              className={location.pathname === "/cart" ? "active" : ""}
              onClick={handleOffcanvas1}
            >
              <Link to="/cart">
                <svg
                  className="me-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 10H5L3 21H21L19 10H16M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10M8 10H16M8 10V13M16 10V13"
                    stroke="transparent"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Shopping Cart
              </Link>
            </li>
            <li
              className={location.pathname === "/settings" ? "active" : ""}
              onClick={handleOffcanvas1}
            >
              <Link to="/settings">
                <svg
                  className="me-2 setting-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2107_1922)">
                    <mask
                      id="mask0_2107_1922"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <path
                        d="M23.5 23.5V0.5H0.5V23.5H23.5Z"
                        fill="white"
                        stroke="white"
                      />
                    </mask>
                    <g mask="url(#mask0_2107_1922)">
                      <path
                        d="M11.9999 8.31258C9.96333 8.31258 8.31235 9.96352 8.31235 12.0001C8.31235 14.0366 9.96333 15.6875 11.9999 15.6875C14.0364 15.6875 15.6874 14.0366 15.6874 12.0001C15.6874 9.96352 14.0364 8.31258 11.9999 8.31258ZM22.3499 9.36867L21.3515 10.1906C20.2127 11.1281 20.2127 12.872 21.3515 13.8096L22.3499 14.6315C22.7037 14.9227 22.7951 15.4271 22.566 15.824L20.5946 19.2386C20.3654 19.6355 19.8829 19.8085 19.4538 19.6478L18.2427 19.1941C16.8614 18.6766 15.3511 19.5485 15.1086 21.0036L14.896 22.2792C14.8207 22.7312 14.4296 23.0626 13.9713 23.0626H10.0284C9.57015 23.0626 9.17902 22.7312 9.1037 22.2792L8.89107 21.0036C8.64859 19.5485 7.13833 18.6766 5.75697 19.1941L4.54601 19.6478C4.11682 19.8085 3.63434 19.6355 3.40517 19.2386L1.43375 15.824C1.20463 15.4271 1.29598 14.9227 1.6498 14.6315L2.64823 13.8096C3.78706 12.872 3.78706 11.1281 2.64823 10.1906L1.6498 9.36867C1.29598 9.07739 1.20463 8.57302 1.43375 8.17613L3.40517 4.76153C3.63434 4.36464 4.11682 4.19158 4.54601 4.35236L5.75697 4.80602C7.13833 5.32351 8.64859 4.45159 8.89107 2.99655L9.1037 1.72095C9.17902 1.26893 9.57015 0.93762 10.0284 0.93762H13.9713C14.4296 0.93762 14.8207 1.26893 14.896 1.72095L15.1086 2.99655C15.3511 4.45159 16.8614 5.32351 18.2427 4.80602L19.4538 4.35236C19.8829 4.19158 20.3654 4.36464 20.5946 4.76153L22.566 8.17613C22.7951 8.57302 22.7037 9.07739 22.3499 9.36867Z"
                        stroke="#CCCCCC"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_1922">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Settings
              </Link>
            </li>
            <li
              className={location.pathname === "/help-center" ? "active" : ""}
              onClick={handleOffcanvas1}
            >
              <Link to="/help-center">
                <svg
                  className="help-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2404_2300)">
                    <path
                      d="M22.3148 10.4635C22.2294 7.85483 21.1515 5.37712 19.3013 3.53613C17.3502 1.58463 14.7571 0.510254 12.0001 0.510254C6.43171 0.510254 1.88184 4.94238 1.68571 10.4635C1.25635 10.6537 0.891364 10.9643 0.634978 11.3578C0.378592 11.7512 0.241811 12.2105 0.241211 12.6801V15.4034C0.241906 16.0464 0.497672 16.663 0.952391 17.1177C1.40711 17.5724 2.02364 17.8282 2.66671 17.8289C3.08278 17.8284 3.48167 17.6629 3.77588 17.3687C4.07009 17.0745 4.23559 16.6756 4.23609 16.2595V11.8236C4.23609 11.011 3.61284 10.3484 2.82046 10.2696C3.11296 5.4595 7.11721 1.63525 12.0001 1.63525C14.4571 1.63525 16.7675 2.593 18.5063 4.33188C20.1031 5.92863 21.0376 8.00988 21.1782 10.27C20.3866 10.3495 19.7645 11.0118 19.7645 11.8236V16.2591C19.7645 17.0785 20.3975 17.7453 21.1992 17.8146V18.9355C21.1985 19.5424 20.9571 20.1243 20.5279 20.5534C20.0987 20.9826 19.5168 21.2239 18.9098 21.2245H17.2145C17.1002 20.8913 16.8844 20.6022 16.5974 20.3979C16.3104 20.1935 15.9666 20.0842 15.6143 20.0853H13.8668C13.616 20.0853 13.3752 20.1385 13.1547 20.2413C12.8595 20.3777 12.6094 20.5957 12.434 20.8695C12.2585 21.1434 12.1651 21.4618 12.1647 21.787C12.1647 22.2423 12.3421 22.6698 12.6635 22.9896C12.821 23.1484 13.0085 23.2743 13.215 23.3601C13.4216 23.4458 13.6432 23.4897 13.8668 23.4891H15.6143C16.3388 23.4891 16.9775 23.0208 17.2156 22.3495H18.9098C20.7927 22.3495 22.3242 20.818 22.3242 18.9355V17.6144C22.751 17.4231 23.1135 17.1126 23.368 16.7203C23.6225 16.3279 23.7583 15.8703 23.759 15.4026V12.6794C23.759 11.6916 23.1642 10.8411 22.3148 10.4635ZM3.11071 11.8236V16.2591C3.11071 16.504 2.91159 16.7035 2.66634 16.7035C2.32154 16.7031 1.99099 16.566 1.74718 16.3222C1.50338 16.0784 1.36623 15.7478 1.36584 15.403V12.6798C1.36623 12.335 1.50338 12.0044 1.74718 11.7606C1.99099 11.5168 2.32154 11.3797 2.66634 11.3793C2.91159 11.3793 3.11071 11.5788 3.11071 11.8236ZM16.1787 21.9078C16.1508 22.0369 16.0795 22.1526 15.9768 22.2358C15.8741 22.3189 15.7461 22.3644 15.614 22.3649H13.8665C13.7127 22.3649 13.5683 22.3049 13.4581 22.1946C13.4044 22.1414 13.3619 22.078 13.3329 22.0081C13.3039 21.9383 13.2891 21.8634 13.2893 21.7878C13.2897 21.6348 13.3507 21.4883 13.4588 21.3802C13.567 21.2721 13.7136 21.2113 13.8665 21.211H15.614C15.7677 21.211 15.9121 21.2706 16.022 21.3809C16.1307 21.4893 16.1907 21.634 16.1907 21.7878C16.1911 21.829 16.1866 21.8703 16.1787 21.9078ZM22.634 15.403C22.6336 15.7478 22.4964 16.0784 22.2526 16.3222C22.0088 16.566 21.6783 16.7031 21.3335 16.7035C21.2156 16.7034 21.1027 16.6566 21.0193 16.5732C20.936 16.4899 20.8892 16.377 20.8891 16.2591V11.8236C20.8891 11.5788 21.0882 11.3793 21.3335 11.3793C21.6783 11.3797 22.0088 11.5168 22.2526 11.7606C22.4964 12.0044 22.6336 12.335 22.634 12.6798V15.403Z"
                      fill="none"
                    />
                    <path
                      d="M15.6424 15.5968C16.2743 15.5961 16.8802 15.3447 17.327 14.8979C17.7738 14.451 18.0252 13.8452 18.0259 13.2133V8.35664C18.0259 7.72139 17.7776 7.12289 17.3269 6.67214C16.8761 6.22139 16.278 5.97314 15.6424 5.97314H8.35762C7.72569 5.97384 7.11984 6.22518 6.673 6.67202C6.22616 7.11887 5.97482 7.72471 5.97412 8.35664V13.2133C5.97482 13.8452 6.22616 14.451 6.673 14.8979C7.11984 15.3447 7.72569 15.5961 8.35762 15.5968H8.40225V16.8553C8.4015 17.0089 8.43115 17.1612 8.48948 17.3034C8.54781 17.4456 8.63367 17.5748 8.74212 17.6837C8.85058 17.7926 8.97949 17.8789 9.12144 17.9378C9.26338 17.9967 9.41557 18.0269 9.56925 18.0268C9.72282 18.0271 9.87488 17.9965 10.0164 17.9367C10.1578 17.877 10.2859 17.7894 10.3927 17.6791L12.4864 15.5968H15.6424ZM11.8582 14.6353L9.5925 16.8886C9.58237 16.8991 9.57487 16.907 9.5535 16.8976C9.52762 16.8871 9.52762 16.8703 9.52762 16.8553V15.0343C9.52762 14.8851 9.46836 14.742 9.36287 14.6365C9.25738 14.531 9.11431 14.4718 8.96512 14.4718H8.358C8.02434 14.4714 7.70447 14.3387 7.46854 14.1027C7.23261 13.8668 7.09989 13.5469 7.0995 13.2133V8.35664C7.09989 8.02299 7.23261 7.70312 7.46854 7.46719C7.70447 7.23126 8.02434 7.09854 8.358 7.09814H15.6427C15.978 7.09814 16.2934 7.22939 16.5319 7.46752C16.7704 7.70602 16.9012 8.02177 16.9012 8.35664V13.2133C16.9008 13.5469 16.7681 13.8668 16.5322 14.1027C16.2963 14.3387 15.9764 14.4714 15.6427 14.4718H12.255C12.1061 14.4718 11.9636 14.5306 11.8582 14.6353Z"
                      fill="none"
                    />
                    <path
                      d="M9.26737 10.0449C8.80987 10.0449 8.4375 10.4177 8.4375 10.8748C8.4375 11.3319 8.81025 11.7047 9.26737 11.7047C9.72525 11.7047 10.098 11.3319 10.098 10.8748C10.098 10.4177 9.72562 10.0449 9.26737 10.0449ZM11.9996 10.0449C11.5421 10.0449 11.1697 10.4177 11.1697 10.8748C11.1697 11.3319 11.5425 11.7047 11.9996 11.7047C12.4579 11.7047 12.8303 11.3319 12.8303 10.8748C12.8303 10.4177 12.4579 10.0449 11.9996 10.0449ZM14.7319 10.0449C14.2744 10.0449 13.902 10.4177 13.902 10.8748C13.902 11.3319 14.2747 11.7047 14.7319 11.7047C15.1897 11.7047 15.5625 11.3319 15.5625 10.8748C15.5625 10.4177 15.1897 10.0449 14.7319 10.0449Z"
                      fill="none"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2404_2300">
                      <rect width="24" height="24" fill="none" />
                    </clipPath>
                  </defs>
                </svg>
                Help
              </Link>
            </li>
            <li data-bs-toggle="modal" data-bs-target="#logoutModal">
              <svg
                className="logout-icon"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_2107_1951"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <path
                    d="M23.25 23.25V0.75H0.75V23.25H23.25Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </mask>
                <g mask="url(#mask0_2107_1951)">
                  <path
                    d="M15.9843 18.375V20.25C15.9843 21.8033 14.7251 23.0625 13.1718 23.0625H3.74999C2.1967 23.0625 0.9375 21.8033 0.9375 20.25V3.75006C0.9375 2.19676 2.1967 0.937564 3.74999 0.937564H13.1718C14.7251 0.937564 15.9843 2.19676 15.9843 3.75006V5.62505"
                    stroke="#CCCCCC"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.8281 12.0469H10.125"
                    stroke="transparent"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.5513 15.1407L22.6506 13.0413C23.1998 12.4921 23.1998 11.6017 22.6506 11.0526L20.5513 8.95317"
                    stroke="#CCCCCC"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              Logout
            </li>
          </ul>
        </div>
      </div>
      <div
        className="modal modal-fade"
        id="logoutModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="logoutModalLabel">
                Logout
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-2">
                Are you sure you want to Logout this account
              </p>
            </div>
            <div className="modal-footer align-items-center justify-content-between">
              <button className="btn btn-cancel" data-bs-dismiss="modal">
                Cancel
              </button>
              <div className="line"></div>
              <button
                className="btn btn-logout"
                data-bs-dismiss="modal"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
