import React from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";

export const ProfileSideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem("auth_token");
      navigate("/");
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
              className={location.pathname.split("/")[1] === "order-history" ? "active" : ""}
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
            <li className={location.pathname === "/profile" ? "active" : ""}>
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
            <li className={location.pathname === "/wishlist" ? "active" : ""}>
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
            <li className={location.pathname === "/cart" ? "active" : ""}>
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
            <li className={location.pathname === "/settings" ? "active" : ""}>
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
