import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export const About = () => {
  const DentalProduct = [
    {
      id: 1,
      img: "/img/about-img1.webp",
      title: "Impression Trays",
      description: "durable and precise for accurate results",
    },
    {
      id: 2,
      img: "/img/about-img21.webp",
      title: "Face Masks",
      description: "a reliable barrier for hygiene and safety",
    },
    {
      id: 3,
      img: "/img/about-img3.webp",
      title: "Gloves",
      description: "comfortable protection for safe dental procedures",
    },
    {
      id: 4,
      img: "/img/about-img4.webp",
      title: "Patient Bibs",
      description: "disposable protection for clean, stress-free treatment",
    },
    {
      id: 5,
      img: "/img/about-img5.webp",
      title: "Surgeon Caps",
      description: "lightweight, hygienic coverage for professionals",
    },
    {
      id: 6,
      img: "/img/about-img6.webp",
      title: "Drapes & Sleeves",
      description: "disposable solutions for a sterile environment",
    },
  ];
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="home-main pt-0">
      <section className="Breadcrumbs-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/about">About</Link>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="about-section py-lg-5 py-4 py-md-4">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6">
              <img
                src="/img/about-content-Img1.webp"
                className="d-block mx-auto mb-3 mb-lg-0 mx-lg-0 img-fluid"
                alt="about-contentImg"
              ></img>
            </div>
            <div className="col-lg-6">
              <h2>We are a Trusted Dental Supplier for Every Dentist</h2>
              <p>
                We are a premium dental supply brand dedicated to supporting
                dentists with reliable, professional-grade essentials. At our
                core, we believe the right supplies are not just tools, but the
                very foundation of confident care.
              </p>
              <p>
                That’s why we combine quality assurance, consistency, and trust
                to deliver solutions that help dental professionals focus on
                what matters most — their patients.
              </p>
              <p>
                We began our journey in 2022 with a clear mission: to make
                professional-grade dental supplies easily accessible to dentists
                across India. Today, we are a trusted partner for clinics,
                hospitals, and dental professionals across the nation
              </p>
            </div>
            <div className="col-lg-6 mt-xl-5 mt-lg-4 order-2 order-lg-1">
              <h2 className="d-none d-lg-block">
                Our Values: Quality, Trust & Long term Partnership
              </h2>
              <p>
                At Bossdent, we stand for quality, trust, and long-term
                partnerships. Driven by excellence, we continue to grow as a
                brand dentists can rely on — building trust with every delivery.
              </p>
              <p className="mb-2 mb-lg-3">
                What started as a local initiative has now grown into a
                nationwide presence, serving clinics and professionals who count
                on us every day. Our story is shaped by one simple belief:
                dentists deserve supplies they never have to think twice about —
                and that’s exactly what we deliver.
              </p>
            </div>
            <div className="col-lg-6 mt-xl-5 mt-lg-0 order-1 order-lg-2">
              <h2 className="d-block d-lg-none  mt-3 mt-lg-0">
                Our Values: Quality, Trust & Long term Partnership
              </h2>
              <img
                src="/img/about-content-Img2.webp"
                className="d-block mx-auto mt-2 mb-4 my-lg-0 mx-lg-0 img-fluid"
                alt="about-content-img"
              ></img>
            </div>
          </div>
        </div>
      </section>
      <section className="dental-supply-info-section ">
        <div className="container">
          <h2>Comprehensive Dental Supply Range</h2>
          <p>
            We provide dentists with a complete range of essentials designed to
            keep every practice smooth, safe, and reliable. Our range includes
            protective wear, disposables, and clinical tools that ensure
            hygiene, comfort, and efficiency for every modern practice.
          </p>
          <div className="row align-items-center justify-content-center">
            {DentalProduct?.map((i, index) => {
              return (
                <div className="col-lg-4 col-6" key={index}>
                  <div className="card">
                    <h3 className="mb-1 mb-md-0">{i?.title}</h3>
                    <img
                      src={i?.img}
                      className="img-fluid"
                      alt="dental-supply-product-img"
                    />
                    <p>{i?.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p>
            Every product we deliver is selected to meet the standards of
            professional dentistry, helping clinics run without interruption and
            patients receive care with confidence At Bossdent, we don’t just
            supply items — we deliver the assurance that every detail of your
            practice is backed by dependable support.
          </p>
        </div>
      </section>
      <section className="trusted-section">
        <div className="container">
          <h2 className="aboutSection-title">Trusted by Professionals</h2>
          <p className="aboutSection-subtitle">
            Dentists across India trust us because we deliver more than just
            supplies — we deliver confidence and consistency. Here’s why
            Bossdent stands out
          </p>
          <ul>
            <li>
              Trusted Quality – Every product goes through strict checks to
              ensure consistent quality and reliability, so dentists never have
              to worry about performance or safety
            </li>
            <li>
              Nationwide Reach – With reliable nationwide distribution, we
              deliver quickly and efficiently — ensuring every clinic has
              dependable access to essential supplies.
            </li>
            <li>
              Affordable Solutions – We offer affordable solutions without
              compromise, giving dentists access to professional quality at fair
              prices.
            </li>
            <li>
              Dentist-Centric Approach – We understand the unique needs of
              dental practices and design our solutions to make daily clinical
              work smoother, safer, and stress-free.
            </li>
            <li>
              Proven Experience – Since 2022, we’ve consistently supported
              clinics nationwide — earning trust through reliability and
              long-term commitment.
            </li>
            <li>
              Consistency & Trust – Dentists choose us because we keep our
              promises — giving every order, big or small, the same care and
              attention.
            </li>
          </ul>
          <div className="row align-items-center justify-content-between contact-info-section">
            <div className="col-lg-6 mb-3 col-md-6">
              <img
                src="/img/contact-info-img.webp"
                className="img-fluid"
                alt="contact-info-img"
              ></img>
            </div>
            <div className="col-lg-6 col-md-6">
              <p>
                Connect with us today to explore our full catalogue of
                professional-quality dental supplies and build a foundation of
                confident care for your practice
              </p>
            </div>
            <div className="col-lg-6">
              <p>
                Plot No. 1 to 4, Ground Floor, Marutidham Industrial Estate
                Behind Hotel Royal, Velanja Road, Umra, Surat - 394130, Gujarat,
                India
              </p>
            </div>
            <div className="col-lg-3 pb-2 pb-lg-0">
              <Link to="tel:+917698828883">+91 76988 28883</Link>
            </div>
            <div className="col-lg-3 pb-2 pb-lg-0">
              <Link to="mailto:zahndentaldepo@gmail.com">
                bossdentindia@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
