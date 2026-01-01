import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import BASE_URL from "../api/config";
import { useDispatch, useSelector } from "react-redux";
import Indian_states_cities_list from "indian-states-cities-list";
import { ProfileEditFormModal } from "../component/ProfileEditFormModal";
import { AddToOrder } from "../redux/orderSlice";
import { ProfileSideBar } from "../component/ProfileSideBar";
import Loader2 from "../component/Loader2";

const Profile = () => {
  const { user} = useSelector((s) => s.user);
  const token = useSelector((state)=>state.auth.token);
  const [orderData, setOrderData] = useState([]);
  const [States, setStates] = useState([]);
  const [loadMore] = useState(false);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const visibleOrderData = loadMore ? orderData : orderData.slice(0, 5);

  const handlefetchOrderData = async (controller) => {
    setloading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    await axios
      .get(`${BASE_URL}/get-all-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })
      .then((res) => {
        setloading(false);
        setOrderData(res?.data?.orders);
        dispatch(AddToOrder(res.data?.orders));
      })
      .catch((err) => console.log("err", err));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleString("en-GB", { day: "numeric" });
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  };

  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo({ top: 0, behavior: "smooth" });
    handlefetchOrderData(controller);
    setStates(Indian_states_cities_list?.STATES_OBJECT);
    return ()=>{
      controller.abort();
    }
  }, []);
  return (
    <div className="home-main pt-0 pt-lg-0">
      <section className="Breadcrumbs-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/profile">Profile</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="profile-section">
        {loading ? (
          <Loader2></Loader2>
        ) : (
          <>
            <div className="container">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                href="#offcanvasExample1"
                aria-controls="offcanvasExample1"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="d-flex w-100 profile-content-wrapper align-items-start justify-content-between gap-3">
                <ProfileSideBar></ProfileSideBar>
                <div className="rightside-bar col-lg-9 row">
                  <div className="col-lg-6 col-12">
                    <div className="profile-content card">
                      <i className="fa-solid fa-circle-user"></i>
                      <h2 className="profile-username">
                        {Object.keys(user).length !== 0 ? (
                          <>
                            {user?.first_name}
                            {user?.last_name}
                          </>
                        ) : (
                          "username"
                        )}
                      </h2>
                      <button className="btn">
                        Edit Profile{" "}
                        <img
                          src="/img/profile-edit-icon.svg"
                          className="ms-1 ms-sm-2 mb-1 img-fluid"
                          alt="profile-edit-icon"
                        ></img>
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="billing-address-content card">
                      <h2>Billing Address</h2>
                      {Object.keys(user).length !== 0 ? (
                        <>
                          <h3>
                            {user?.first_name}
                            {user?.last_name}
                          </h3>
                          <p className="mb-2">
                            {user?.address}, {user?.city}, {user?.state}{" "}
                            {user.zipcode}.
                          </p>
                          <Link to={`email:${user.email}`}>{user?.email}</Link>
                          <p className="billing-contact-number">
                            {user?.phone_number?.slice(2)}
                          </p>
                        </>
                      ) : (
                        <div className="m-auto">No Data Available</div>
                      )}
                      <button
                        className="btn me-auto"
                        data-bs-toggle="modal"
                        data-bs-target="#EditformModal"
                      >
                        Edit Address{" "}
                        <img
                          src="/img/profile-edit-icon.svg"
                          className="ms-1 mb-1 img-fluid"
                          alt="profile-edit-icon"
                        ></img>
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-12 col-12">
                    <div className="order-History">
                      {orderData.length !== 0 ? (
                        visibleOrderData?.map((i, index) => {
                          return (
                            <div className="order-card" key={index}>
                              <div className="row1">
                                <span>
                                  <b>ORDER ID :</b> #{i?.order_id}
                                </span>
                                <span>
                                  <b>DATE :</b> {formatDate(i?.order_date)}
                                </span>
                                <span>
                                  <b>STATUS :</b> {i?.status}
                                </span>
                              </div>

                              <div className="row2">
                                <span>
                                  <b>TOTAL :</b> ₹{Number(i?.order_total)} (
                                  {Number(i?.item_count)} Products)
                                </span>
                                <button className="details-btn">
                                  View Details
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="order-card">
                          <p className="mb-0">No Order Data found!</p>
                        </div>
                      )}
                      <table className="w-100 order-table ">
                        <thead>
                          <tr>
                            <th>ORDER ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PRODUCT ITEMS</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderData.length !== 0 ? (
                            visibleOrderData?.map((i, index) => {
                              return (
                                <tr key={index}>
                                  <td>#{i?.order_id}</td>
                                  <td>{formatDate(i?.order_date)}</td>
                                  <td>₹{Number(i?.order_total).toFixed(2)}</td>
                                  <td>{Number(i?.item_count)} Products</td>
                                  <td>
                                    <Link to={`/order-history/${i?.order_id}`}>
                                      View Details
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center"> No Order Data found!</td>
                            </tr>
                          )}
                        </tbody>
                        {loadMore !== true && orderData.length > 5 ? (
                          <tfoot>
                            <tr>
                              <td colSpan="5" className="text-end">
                                <Link to="/order-history">
                                  <button className="btn btn-view">
                                    View More Details
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          </tfoot>
                        ) : (
                          <></>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ProfileEditFormModal
              States={States}
              user={user}
              token={token}
            ></ProfileEditFormModal>
          </>
        )}
      </section>
    </div>
  );
};

export default Profile;
