import React from "react";
import { Link } from "react-router-dom";


const Profile = () => {
  return (
    <div className="home-main">
      <section className="Breadcrumbs-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">
                <Link to="#">Home</Link>
              </li>
              <li>
                <Link to="#">Profile</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className=""></section>
    </div>
  );
};

export default Profile;
