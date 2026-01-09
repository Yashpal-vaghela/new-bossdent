import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../api/config";
import { AddToOrder } from "../redux/orderSlice";
import { ProfileSideBar } from "../component/ProfileSideBar";
import Loader2 from "../component/Loader2";

export const OrderHistory = () => {
  const [orderData, setOrderData] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [apiloading, setApiLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const start = (page - 1) * rowsPerPage;
  const visibleData = orderData.slice(start, start + rowsPerPage);
  const totalPages = Math.ceil(orderData.length / rowsPerPage);
  const dispatch = useDispatch();
  const params = useParams();

  const handlefetchOrderData = async (controller) => {
    setApiLoading(true);
    await axios
      .get(`${BASE_URL}/get-all-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })
      .then((res) => {
        setApiLoading(false);
        setOrderData(res?.data?.orders);
        dispatch(AddToOrder(res?.data?.orders));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const handlefetchOrderDetails = async (controller) => {
    setApiLoading(true);
    await axios
      .get(`${BASE_URL}/get-order-details/${params?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })
      .then((res) => {
        setApiLoading(false);
        console.log("res", res.data);
        setOrderDetails(res?.data?.order);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleString("en-GB", { day: "numeric" });
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const renderPagination = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        buttons.push(
          <li className="page-item" key={`${i}`}>
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`page-link ${page === i ? "active" : ""}`}
            >
              {i}
            </button>
          </li>
        );
      } else if (i === page - 2 || i === page + 2) {
        buttons.push(
          <span key={`ellipsis-${i}`} className="ellipsis">
            {" "}
            ...{" "}
          </span>
        );
      }
    }
    return buttons;
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const controller = new AbortController();
    if (Object.keys(params)[0] !== undefined) {
      handlefetchOrderDetails(controller);
    } else {
      handlefetchOrderData(controller);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => controller.abort();
  }, [params]);

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
                <Link to="/order-history">Order History</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      {apiloading ? (
        <Loader2></Loader2>
      ) : (
        <section className="profile-section order-history-section">
          <div className="container">
            <div className="row">
              <>
                <div className="col-lg-3 order-history-content-wrapper profile-content-wrapper align-items-start justify-content-between">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    href="#offcanvasExample1"
                    aria-controls="offcanvasExample1"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <ProfileSideBar></ProfileSideBar>
                </div>
                {Object.keys(params)[0] === undefined ? (
                  <div className="col-lg-9 order-details-container">
                    <h2>Order History</h2>
                    <React.Fragment>
                      {orderData.length !== 0 ? (
                        visibleData?.map((i, index) => {
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
                                  <Link to={`/order-history/${i?.order_id}`}>
                                    <i className="fa-regular fa-eye"></i>
                                  </Link>
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
                      <nav className="order-card py-4">
                        <ul className="order-table-pagination pagination justify-content-center m-0">
                          <li
                            className={`page-item ${
                              page === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page - 1)}
                            >
                              <i className="fa-solid fa-angles-left"></i>
                            </button>
                          </li>
                          {renderPagination()}
                          <li
                            className={`page-item ${
                              page === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page + 1)}
                            >
                              <i className="fa-solid fa-angles-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </React.Fragment>

                    <table className="table order-detail-table ">
                      <thead>
                        <tr>
                          <td>Order id</td>
                          <td>Date</td>
                          <td>Total</td>
                          <td>Status</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {orderData.length !== 0 ? (
                          visibleData?.map((i, index) => {
                            return (
                              <tr key={index}>
                                <td>#{i?.order_id}</td>
                                <td>{formatDate(i?.order_date)}</td>
                                <td>
                                  ₹{Number(i?.order_total).toFixed(2)} (
                                  {Number(i?.item_count)} products)
                                </td>
                                <td>{i?.status}</td>
                                <td>
                                  <Link to={`/order-history/${i?.order_id}`}>
                                    <i className="fa-regular fa-eye"></i>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="p-5 text-center">
                              No Order Data found!
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="5">
                            <nav>
                              <ul className="order-table-pagination pagination justify-content-center m-0">
                                <li
                                  className={`page-item ${
                                    page === 1 ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => setPage(page - 1)}
                                  >
                                    <i className="fa-solid fa-angles-left"></i>
                                  </button>
                                </li>
                                {renderPagination()}
                                <li
                                  className={`page-item ${
                                    page === totalPages ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => setPage(page + 1)}
                                  >
                                    <i className="fa-solid fa-angles-right"></i>
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="col-lg-9 order-details-container">
                    {apiloading ? (
                      <Loader2></Loader2>
                    ) : (
                      <>
                        {orderDetails?.length !== 0 ? (
                          <>
                            <div className="order-header">
                              <h2 className="mb-0">Order Details</h2>
                              <span className="status">
                                {orderDetails?.status === "Processing"
                                  ? "Success"
                                  : orderDetails?.status}
                              </span>
                            </div>
                            <div className="row order-view-details-row">
                              <div className="col-lg-8 billing-address-section d-flex">
                                <div className="billing-address-card card">
                                  <div className="card-header">
                                    <h3 className="mb-0">Billing Address</h3>
                                  </div>
                                  <div className="card-body">
                                    <div className="username-wrapper">
                                      <p className="mb-0">
                                        {orderDetails?.billing?.first_name}
                                        {orderDetails?.billing?.last_name}
                                      </p>
                                      <span>
                                        {orderDetails?.billing?.address}{" "}
                                        {orderDetails?.billing?.city},
                                        {orderDetails?.billing?.state} -{" "}
                                        {orderDetails?.billing?.zipcode}.
                                      </span>
                                    </div>

                                    <div className="email-wrapper mb-2">
                                      <label className="form-label mb-0">
                                        Email
                                      </label>
                                      <p>{orderDetails?.billing?.email}</p>
                                    </div>
                                    <div className="phone-wrapper">
                                      <label className="form-label mb-0">
                                        Phone
                                      </label>
                                      <p className="mb-1">
                                        {orderDetails?.billing?.phone?.slice(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="billing-address-card">
                                  <div className="card-header">
                                    <h3 className="mb-0">Shipping Address</h3>
                                  </div>
                                  <div className="card-body">
                                    <div className="username-wrapper">
                                      <p className="mb-0">
                                        {orderDetails?.billing?.first_name}
                                        {orderDetails?.billing?.last_name}
                                      </p>
                                      <span>
                                        {orderDetails?.billing?.address}{" "}
                                        {orderDetails?.billing?.city},
                                        {orderDetails?.billing?.state} -{" "}
                                        {orderDetails?.billing?.zipcode}.
                                      </span>
                                    </div>
                                    <div className="email-wrapper mb-2">
                                      <label className="form-label mb-0">
                                        Email
                                      </label>
                                      <p>{orderDetails?.billing?.email}</p>
                                    </div>
                                    <div className="phone-wrapper">
                                      <label className="form-label mb-0">
                                        Phone
                                      </label>
                                      <p className="mb-1">
                                        {orderDetails?.billing?.phone?.slice(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="summary-card-section card">
                                  <div className="card-header d-xl-flex d-lg-lock d-flex align-items-center justify-content-between">
                                    <div className="summary-row d-block">
                                      <h2>Order Id:</h2>
                                      <p className="mb-0">
                                        #{orderDetails?.order_id}
                                      </p>
                                    </div>
                                    <div className="line1"></div>
                                    <div className="summary-row d-block">
                                      <h2>Payment Method:</h2>
                                      <p className="mb-0">
                                        {orderDetails?.payment_method}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="card-body">
                                    <div className="summary-total-row">
                                      <span>Subtotal</span>
                                      <p>₹{orderDetails?.subtotal}</p>
                                    </div>
                                    <div className="summary-total-row">
                                      <span>Shipping</span>
                                      <p>
                                       {orderDetails?.shipping_charge ===
                                        "0.00"
                                          ? "Free"
                                          :  `₹${orderDetails?.shipping_charge}`}
                                      </p>
                                    </div>
                                    {
                                      orderDetails?.handling_charge !== "0.00" ? 
                                      <div className="summary-total-row">
                                        <span>Pay Extra on COD</span>
                                        <p style={{color:"#00c16e"}}>₹{Number(orderDetails?.handling_charge).toFixed(2)} </p>
                                      </div>:<></>
                                    }
                                    <div className="summary-total-row total align-items-center">
                                      <span>Total</span>
                                      <p>₹{orderDetails?.total}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <table className="product-order-table table w-100">
                              <thead>
                                <tr>
                                  <td>Product</td>
                                  <td>price</td>
                                  <td className="text-center">Quantity</td>
                                  <td className="text-center">subtotal</td>
                                </tr>
                              </thead>
                              <tbody>
                                {orderDetails?.items.map((i, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{i?.product_name}</td>
                                      <td>₹{i?.product_price}</td>
                                      <td className="text-center">
                                        x {i?.quantity}
                                      </td>
                                      <td className="text-center">
                                        {i?.total}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
