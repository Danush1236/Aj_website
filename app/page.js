"use client";

import "./globals.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("all");
  const [testiIndex, setTestiIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    service: "",
    datetime: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formStatus.type) setFormStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment.");
      }

      setFormStatus({
        type: "success",
        message: `Appointment booked successfully! Reference: ${data.id}`,
      });
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        service: "",
        datetime: "",
        message: "",
      });
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error.message || "Failed to book appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTesti = (index) => {
    const track = document.getElementById("testiTrack");
    const card = track?.querySelector(".testi-card");
    if (!track || !card) return;

    const gap = 24;
    track.scrollTo({
      left: index * (card.offsetWidth + gap),
      behavior: "smooth",
    });
    setTestiIndex(index);
  };

  useEffect(() => {
    let lastScrollTop = 0;

    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");

    const moveCursor = (e) => {
      if (cursor && ring) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
      }
    };

    document.addEventListener("mousemove", moveCursor);

    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 60);
      }

      const navLinks = document.getElementById("navLinks");
      const closeBtn = document.getElementById("closeBtn");
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (navLinks && closeBtn) {
        if (scrollTop > lastScrollTop && navLinks.classList.contains("open")) {
          navLinks.classList.remove("open");
          closeBtn.classList.remove("show");
        }
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const closeBtn = document.getElementById("closeBtn");

    const openMenu = () => {
      navLinks?.classList.toggle("open");
      closeBtn?.classList.toggle("show");
    };

    const closeMenu = () => {
      navLinks?.classList.remove("open");
      closeBtn?.classList.remove("show");
    };

    hamburger?.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);

    const navAnchors = navLinks?.querySelectorAll("a") ?? [];
    navAnchors.forEach((a) => a.addEventListener("click", closeMenu));

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => observer.observe(el));

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", handleScroll);
      hamburger?.removeEventListener("click", openMenu);
      closeBtn?.removeEventListener("click", closeMenu);
      navAnchors.forEach((a) => a.removeEventListener("click", closeMenu));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const stats = document.querySelectorAll(".hero-stat-num");
    if (stats.length < 4) return;

    const targets = [10, 3000, 15, 8];
    const intervals = [];

    stats.forEach((el, i) => {
      if (!el || el.dataset.counted) return;

      let count = 0;
      const target = targets[i];
      const steps = 50;
      const increment = target / steps;

      const interval = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(interval);
        }

        let display = Math.floor(count);
        if (i === 1) display = Math.round(count / 1000) + "k";
        el.textContent = display + "+";
      }, 30);

      intervals.push(interval);
      el.dataset.counted = "true";
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <>
      <div className="cursor" id="cursor" />
      <div className="cursor-ring" id="cursorRing" />
      {/* NAV */}
  <nav id="navbar">
    <a href="#" className="nav-logo">
      <img src="image/logo.png" alt="AJ Salon Logo" />
    </a>
    <ul className="nav-links" id="navLinks">
      <li>
        <a href="#about">About</a>
      </li>
      <li>
        <a href="#services">Services</a>
      </li>
      <li>
        <a href="#gallery">Gallery</a>
      </li>
      <li>
        <a href="#team">Team</a>
      </li>
      <li>
        <a href="#contact">Contact</a>
      </li>
      <li>
        <a href="#contact" className="nav-cta">
          Book Appointment
        </a>
      </li>
    </ul>
    <button className="hamburger" id="hamburger" aria-label="Menu">
      <span />
      <span />
      <span />
    </button>
    <button className="close-btn" id="closeBtn" aria-label="Close Menu">
      <span />
      <span />
    </button>
  </nav>
  {/* HERO */}
  <section className="hero" id="home">
    <video className="hero-video" autoPlay muted loop playsInline>
      <source
        src="image/Hair Salon BROLL video shot on SONY A7siii.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
    <div className="hero-content">
      <div className="hero-eyebrow">
        Premium Beauty &amp; Grooming · Sri Lanka
      </div>
      <h1>
        More Than a Salon.A Place Where
        <br />
        <em>Confidence</em> Begins.
      </h1>
      <p className="hero-sub">
        Expert beauty, precision grooming, and personalized care designed to
        help you look your best — and feel even better.
      </p>
      <div className="hero-actions">
        <a href="#contact" className="btn-primary">
          Book Appointment
        </a>
        <a href="#services" className="btn-outline">
          Explore Services
        </a>
      </div>
    </div>
    <div className="hero-stats">
      <div className="hero-stat">
        <div className="hero-stat-num">
          10<span>+</span>
        </div>
        <div className="hero-stat-label">Years of Expertise</div>
      </div>
      <div className="hero-stat">
        <div className="hero-stat-num">
          3k<span>+</span>
        </div>
        <div className="hero-stat-label">Happy Clients</div>
      </div>
      <div className="hero-stat">
        <div className="hero-stat-num">
          15<span>+</span>
        </div>
        <div className="hero-stat-label">Expert Stylists</div>
      </div>
      <div className="hero-stat">
        <div className="hero-stat-num">
          8<span>+</span>
        </div>
        <div className="hero-stat-label">Service Categories</div>
      </div>
    </div>
  </section>
  {/* MARQUEE */}
  <div className="marquee-strip">
    <div className="marquee-track" id="marqueeTrack">
      <span className="marquee-item">
        Hair Styling <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Bridal Looks <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Skin Care <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Men's Grooming <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Nail Care <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Professional Makeovers <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Hair Coloring <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Beauty Treatments <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Hair Styling <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Bridal Looks <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Skin Care <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Men's Grooming <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Nail Care <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Professional Makeovers <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Hair Coloring <span className="marquee-dot" />
      </span>
      <span className="marquee-item">
        Beauty Treatments <span className="marquee-dot" />
      </span>
    </div>
  </div>
  {/* ABOUT */}
  <section className="about" id="about">
    <div className="about-grid">
      <div className="about-visual reveal">
        <div className="about-img-main">
          <img
            src="image/image1.jpg"
            alt="AJ Salon"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="about-accent-card">
          <div className="about-accent-num">10+</div>
          <div className="about-accent-label">Years of Excellence</div>
        </div>
      </div>
      <div className="about-content">
        <div className="section-label reveal">Our Story</div>
        <h2 className="section-title reveal reveal-delay-1">
          Crafted
          <br />
          <em>Around You</em>
        </h2>
        <p className="about-text reveal reveal-delay-2">
          AJ Salon is not simply about haircuts or beauty treatments. It is
          about helping you express confidence, individuality, and self-care
          through expert services delivered in a refined environment. Every
          visit is a personalized experience tailored to your unique style and
          needs.
        </p>
        <div className="about-features reveal reveal-delay-3">
          <div className="about-feat">
            <div className="about-feat-icon">
              <img src="image/icon 01.gif" alt="Icon" />
            </div>
            <div>
              <div className="about-feat-label">Expert Team</div>
              <div className="about-feat-sub">
                15+ certified beauty professionals
              </div>
            </div>
          </div>
          <div className="about-feat">
            <div className="about-feat-icon">
              <img src="image/icon 01.gif" alt="Icon" />
            </div>
            <div>
              <div className="about-feat-label">Personalized Care</div>
              <div className="about-feat-sub">
                Consultations tailored to you
              </div>
            </div>
          </div>
          <div className="about-feat">
            <div className="about-feat-icon">
              <img src="image/icon 01.gif" alt="Icon" />
            </div>
            <div>
              <div className="about-feat-label">Premium Products</div>
              <div className="about-feat-sub">International luxury brands</div>
            </div>
          </div>
          <div className="about-feat">
            <div className="about-feat-icon">
              <img src="image/icon 01.gif" alt="Icon" />
            </div>
            <div>
              <div className="about-feat-label">Luxury Atmosphere</div>
              <div className="about-feat-sub">
                Comfortable, modern interiors
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* SERVICES */}
  <section className="services" id="services">
    <div className="services-header">
      <div>
        <div className="section-label" style={{ color: "var(--green)" }}>
          What We Offer
        </div>
        <h2 className="section-title reveal">
          Our <em>Services</em>
        </h2>
      </div>
      {/* <p class="services-sub reveal">Precision craftsmanship across every beauty and grooming discipline.</p> */}
    </div>
    <div className="services-grid">
      <div className="service-card reveal">
        <img
          src="image/hair cut.jpeg"
          alt="Hair Styling"
          className="service-card-img"
        />
        <div className="service-name">Hair Styling &amp; Cutting</div>
        <p className="service-desc">
          Precision cuts and modern styles tailored to your face shape,
          lifestyle, and personality.
        </p>
        <a href="#contact" className="service-link">
          Book Now{" "}
        </a>
      </div>
      <div className="service-card reveal reveal-delay-1">
        <img
          src="image/Hair Coloring.jpg"
          alt="Hair Coloring"
          className="service-card-img"
        />
        <div className="service-name">Hair Coloring</div>
        <p className="service-desc">
          From subtle highlights to bold transformations — expert color with
          premium international products.
        </p>
        <a href="#contact" className="service-link">
          Book Now{" "}
        </a>
      </div>
      <div className="service-card reveal reveal-delay-2">
        <img
          src="/image/Bridal.JPG"
          alt="Bridal"
          className="service-card-img"
        />
        <div className="service-name">Bridal &amp; Event Styling</div>
        <p className="service-desc">
          Unforgettable looks for your most important moments. Trial sessions
          available.
        </p>
        <a href="#contact" className="service-link">
          Book Now{" "}
        </a>
      </div>
      <div className="service-card reveal reveal-delay-3">
        <img
          src="image/Beauty Treatments.jpg"
          alt="Beauty"
          className="service-card-img"
        />
        <div className="service-name">Beauty Treatments</div>
        <p className="service-desc">
          Rejuvenating facials, threading, and professional beauty rituals for
          radiant results.
        </p>
        <a href="#contact" className="service-link">
          Book Now{" "}
        </a>
      </div>
      <div className="service-card reveal">
        <img
          src="image/Skin Care.jpg"
          alt="Skin Care"
          className="service-card-img"
        />
        <div className="service-name">Skin Care</div>
        <p className="service-desc">
          Advanced skin analysis and targeted treatments for a healthy, luminous
          complexion.
        </p>
        <a href="#contact" className="service-link">
          Book Now{" "}
        </a>
      </div>
      <div className="service-card reveal reveal-delay-1">
        <img
          src="image/Men's Grooming.jpg"
          alt="Grooming"
          className="service-card-img"
        />
        <div className="service-name">Men's Grooming</div>
        <p className="service-desc">
          Classic and modern cuts, beard styling, and grooming rituals for the
          modern gentleman.
        </p>
        <a href="#contact" className="service-link">
          Book Now{" "}
        </a>
      </div>
      <div className="service-card reveal reveal-delay-2">
        <img
          src="image/Nail Care.jpg"
          alt="Nails"
          className="service-card-img"
        />
        <div className="service-name">Nail Care</div>
        <p className="service-desc">
          Manicures, pedicures, gel, and nail art crafted with premium products
          and precision.
        </p>
        <a href="#contact" className="service-link">
          Book Now{" "}
        </a>
      </div>
      <div className="service-card reveal reveal-delay-3">
        <img
          src="image/Professional Makeovers.jpg"
          alt="Makeover"
          className="service-card-img"
        />
        <div className="service-name">Professional Makeovers</div>
        <p className="service-desc">
          Full-face makeup artistry for any occasion — editorial, natural, or
          dramatic looks.
        </p>
        <a href="#contact" className="service-link">
          Book Now{" "}
        </a>
      </div>
    </div>
  </section>
  {/* WHY CHOOSE */}
  <section className="why" id="why">
    <div className="why-grid-wrap">
      <div className="why-intro">
        <div className="section-label reveal">Why AJ Salon</div>
        <h2 className="section-title reveal reveal-delay-1">
          The Standard
          <br />
          of <em>Excellence</em>
        </h2>
        <p className="reveal reveal-delay-2">
          Every detail of your experience has been considered — from the
          products we use to the atmosphere we create. This is beauty done
          right.
        </p>
      </div>
      <div className="why-grid">
        <div className="why-card reveal">
          <div className="why-num">01</div>
          <div className="why-name">Experienced Professionals</div>
          <p className="why-desc">
            Our team brings years of certified training and a passion for
            perfection to every service.
          </p>
        </div>
        <div className="why-card reveal reveal-delay-1">
          <div className="why-num">02</div>
          <div className="why-name">Personalized Consultations</div>
          <p className="why-desc">
            We listen before we create. Every service begins with understanding
            your unique vision.
          </p>
        </div>
        <div className="why-card reveal reveal-delay-2">
          <div className="why-num">03</div>
          <div className="why-name">Premium Products</div>
          <p className="why-desc">
            Only the finest international brands — protecting your hair, skin,
            and nails with every treatment.
          </p>
        </div>
        <div className="why-card reveal reveal-delay-3">
          <div className="why-num">04</div>
          <div className="why-name">Hygiene &amp; Safety</div>
          <p className="why-desc">
            Strict sanitization protocols across all tools, stations, and spaces
            — your safety is non-negotiable.
          </p>
        </div>
        <div className="why-card reveal reveal-delay-1">
          <div className="why-num">05</div>
          <div className="why-name">Modern Techniques</div>
          <p className="why-desc">
            Continuously trained in the latest global trends and cutting-edge
            styling techniques.
          </p>
        </div>
        <div className="why-card reveal reveal-delay-2">
          <div className="why-num">06</div>
          <div className="why-name">Relaxing Environment</div>
          <p className="why-desc">
            A calm, elegant space designed to make every visit feel like a true
            luxury escape.
          </p>
        </div>
      </div>
    </div>
  </section>
  {/* GALLERY */}
  <section className="gallery" id="gallery">
    <div className="gallery-wrap">
      <div className="gallery-header">
        <div className="section-label reveal">Our Work</div>
        <h2 className="section-title reveal reveal-delay-1">
          The <em>Gallery</em>
        </h2>
        <div className="gallery-tabs" role="tablist">
          <button
            className={`gallery-tab${tab === "all" ? " active" : ""}`}
            onClick={() => setTab("all")}
          >
            All
          </button>
          <button
            className={`gallery-tab${tab === "hair" ? " active" : ""}`}
            onClick={() => setTab("hair")}
          >
            Hair Styling
          </button>
          <button
            className={`gallery-tab${tab === "bridal" ? " active" : ""}`}
            onClick={() => setTab("bridal")}
          >
            Bridal
          </button>
          <button
            className={`gallery-tab${tab === "before-after" ? " active" : ""}`}
            onClick={() => setTab("before-after")}
          >
            Before &amp; After
          </button>
          <button
            className={`gallery-tab${tab === "salon" ? " active" : ""}`}
            onClick={() => setTab("salon")}
          >
            Salon
          </button>
        </div>
      </div>
      <div className="gallery-grid reveal">
        <div className="gallery-item">
          <img
            src="image/hair style01.jpg"
            alt="Hair Style"
            className="gallery-img"
          />
          <div className="gallery-overlay">
            <div className="gallery-overlay-content">
              <div className="gallery-overlay-label">Modern Hair Styling</div>
            </div>
          </div>
        </div>
        <div className="gallery-item">
          <img
            src="image/hair style02.jpg"
            alt="Hair Style"
            className="gallery-img"
          />
          <div className="gallery-overlay">
            <div className="gallery-overlay-content">
              <div className="gallery-overlay-label">Professional Cut</div>
            </div>
          </div>
        </div>
        <div className="gallery-item">
          <img
            src="image/hair style03.jpg"
            alt="Hair Style"
            className="gallery-img"
          />
          <div className="gallery-overlay">
            <div className="gallery-overlay-content">
              <div className="gallery-overlay-label">Creative Styling</div>
            </div>
          </div>
        </div>
        <div className="gallery-item">
          <img
            src="image/hair style06.jpg"
            alt="Hair Style"
            className="gallery-img"
          />
          <div className="gallery-overlay">
            <div className="gallery-overlay-content">
              <div className="gallery-overlay-label">Expert Techniques</div>
            </div>
          </div>
        </div>
        <div className="gallery-item">
          <img
            src="image/hair style05.jpg"
            alt="Hair Style"
            className="gallery-img"
          />
          <div className="gallery-overlay">
            <div className="gallery-overlay-content">
              <div className="gallery-overlay-label">
                Precision Cut &amp; Style
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* TEAM */}
  <section className="team" id="team">
      <div className="team-wrap">
        <div className="team-header">
          <div className="section-label reveal">The Experts</div>
          <h2 className="section-title reveal reveal-delay-1">
            Meet Our <em>Artists</em>
          </h2>
        </div>
        <div className="team-grid">
          <div className="team-card reveal">
            <div className="team-avatar">
              <img
                src="image/man1.jpg"
                alt="Amara Silva"
                className="team-avatar-img"
              />
              <div className="team-overlay">
                <div className="team-overlay-name">Amara Silva</div>
                <div className="team-overlay-role">Senior Stylist</div>
                <div className="team-overlay-exp">12 Years Experience</div>
              </div>
              <div className="team-avatar-accent" />
            </div>
            <div className="team-socials">
              {/* <a href="#" class="team-social">in</a>
    <a href="#" class="team-social">ig</a> */}
            </div>
          </div>
          <div className="team-card reveal reveal-delay-1">
            <div className="team-avatar">
              <img
                src="image/man2.jpg"
                alt="Jayden Perera"
                className="team-avatar-img"
              />
              <div className="team-overlay">
                <div className="team-overlay-name">Jayden Perera</div>
                <div className="team-overlay-role">Color Specialist</div>
                <div className="team-overlay-exp">8 Years Experience</div>
              </div>
              <div className="team-avatar-accent" />
            </div>
            <div className="team-socials">
              {/* <a href="#" class="team-social">in</a>
    <a href="#" class="team-social">ig</a> */}
            </div>
          </div>
          <div className="team-card reveal reveal-delay-2">
            <div className="team-avatar">
              <img
                src="image/man3.jpg"
                alt="Nisha Fernando"
                className="team-avatar-img"
              />
              <div className="team-overlay">
                <div className="team-overlay-name">Nisha Fernando</div>
                <div className="team-overlay-role">Bridal Expert</div>
                <div className="team-overlay-exp">10 Years Experience</div>
              </div>
              <div className="team-avatar-accent" />
            </div>
            <div className="team-socials">
              {/* <a href="#" class="team-social">in</a>
    <a href="#" class="team-social">ig</a> */}
            </div>
          </div>
          <div className="team-card reveal reveal-delay-3">
            <div className="team-avatar">
              <img
                src="image/man5.jpg"
                alt="Roshan Dias"
                className="team-avatar-img"
              />
              <div className="team-overlay">
                <div className="team-overlay-name">Roshan Dias</div>
                <div className="team-overlay-role">Grooming Specialist</div>
                <div className="team-overlay-exp">6 Years Experience</div>
              </div>
              <div className="team-avatar-accent" />
            </div>
            <div className="team-socials">
              {/* <a href="#" class="team-social">in</a>
    <a href="#" class="team-social">ig</a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* TESTIMONIALS */}
    <section className="testimonials" id="testimonials">
      <div className="testimonials-wrap">
        <div className="testimonials-header">
          <div className="section-label reveal">Client Love</div>
          <h2 className="section-title reveal reveal-delay-1">
            What They <em>Say</em>
          </h2>
        </div>
        <div className="testimonials-track" id="testiTrack">
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">
              "Walking out of AJ Salon, I felt like a completely new version of
              myself. The attention to detail and genuine care from the stylists
              is unlike anywhere else in Colombo."
            </p>
            <div className="testi-author">
              <div className="testi-avatar">
                <img
                  src="image/man1.jpg"
                  alt="Priya Mendis"
                  className="testi-avatar-img"
                />
              </div>
              <div>
                <div className="testi-name">Priya Mendis</div>
                <div className="testi-service">Hair Styling &amp; Color</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">
              "My bridal look was absolutely breathtaking. Nisha understood
              exactly what I wanted — even better than I could describe. Every
              guest complimented my look."
            </p>
            <div className="testi-author">
              <div className="testi-avatar">
                <img
                  src="image/man2.jpg"
                  alt="Kavitha Raj"
                  className="testi-avatar-img"
                />
              </div>
              <div>
                <div className="testi-name">Kavitha Raj</div>
                <div className="testi-service">Bridal Styling</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">
              "As someone who's always been anxious about barbers, AJ Salon
              changed that completely. Roshan's precision and calm approach made
              the experience genuinely enjoyable."
            </p>
            <div className="testi-author">
              <div className="testi-avatar">
                <img
                  src="image/man3.jpg"
                  alt="Ashan Wickrama"
                  className="testi-avatar-img"
                />
              </div>
              <div>
                <div className="testi-name">Ashan Wickrama</div>
                <div className="testi-service">Men's Grooming</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">
              "The skin treatment I received was transformative. My complexion
              has never looked better. The products they use are clearly premium
              — I can feel and see the difference."
            </p>
            <div className="testi-author">
              <div className="testi-avatar">
                <img
                  src="image/man5.jpg"
                  alt="Dilani Senanayake"
                  className="testi-avatar-img"
                />
              </div>
              <div>
                <div className="testi-name">Dilani Senanayake</div>
                <div className="testi-service">Skin Care Treatment</div>
              </div>
            </div>
          </div>
        </div>
        <div className="testi-nav">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              className={`testi-dot${testiIndex === i ? " active" : ""}`}
              onClick={() => scrollTesti(i)}
              aria-label={`Testimonial ${i + 1}`}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
    {/* CTA */}
    <section className="cta-section">
      <div className="cta-inner">
        <div className="section-label" style={{ justifyContent: "center" }}>
          Reserve Your Seat
        </div>
        <h2 className="cta-title">
          Your Next Look
          <br />
          <em>Starts Here</em>
        </h2>
        <p className="cta-sub">
          Book your appointment today and experience expert care tailored to
          your unique style.
        </p>
        <a
          href="#contact"
          className="btn-primary"
          style={{ fontSize: 14, padding: "18px 48px" }}
        >
          Book Appointment
        </a>
      </div>
    </section>
    {/* CONTACT */}
    <section className="contact" id="contact">
      <div className="contact-wrap">
        <div className="contact-header">
          <div className="section-label reveal">Get In Touch</div>
          <h2 className="section-title reveal reveal-delay-1">
            Visit <em>Us</em>
          </h2>
        </div>
        <div className="contact-grid">
          <div>
            {/* map removed */}
            <div className="contact-info-block">
              <div className="contact-info-label">Address</div>
              <div className="contact-info-value">
                123 Main Street, Negombo
                <br />
                Western Province, Sri Lanka
              </div>
            </div>
            <div className="contact-info-block">
              <div className="contact-info-label">Opening Hours</div>
              <div className="contact-info-value">
                Mon–Sat: 9:00 AM – 8:00 PM
                <br />
                Sunday: 10:00 AM – 6:00 PM
              </div>
            </div>
            <div className="contact-info-block">
              <div className="contact-info-label">Contact</div>
              <div className="contact-info-value">
                +94 77 123 4567
                <br />
                hello@ajsalon.lk
              </div>
            </div>
            {/* social links removed */}
          </div>
          <div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-input"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-input"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+94 77 000 0000"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service</label>
                <select
                  name="service"
                  className="form-select"
                  value={formData.service}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a service...</option>
                  <option value="Hair Styling & Cutting">
                    Hair Styling &amp; Cutting
                  </option>
                  <option value="Hair Coloring">Hair Coloring</option>
                  <option value="Bridal & Event Styling">
                    Bridal &amp; Event Styling
                  </option>
                  <option value="Beauty Treatments">Beauty Treatments</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Men's Grooming">Men&apos;s Grooming</option>
                  <option value="Nail Care">Nail Care</option>
                  <option value="Professional Makeover">
                    Professional Makeover
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Date &amp; Time</label>
                <input
                  type="datetime-local"
                  name="datetime"
                  className="form-input"
                  value={formData.datetime}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message (Optional)</label>
                <textarea
                  name="message"
                  className="form-textarea"
                  placeholder="Any special requests or questions..."
                  value={formData.message}
                  onChange={handleFormChange}
                />
              </div>
              {formStatus.message && (
                <p
                  className={`form-status form-status-${formStatus.type}`}
                  role="status"
                >
                  {formStatus.message}
                </p>
              )}
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Book My Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    {/* FOOTER */}
    <footer>
      <div className="footer-top">
        <div>
          <a href="#" className="footer-logo">
            <img src="image/logo.png" alt="AJ Salon Logo" />
          </a>
          <p className="footer-tagline">
            Premium beauty and grooming destination in Sri Lanka. Where
            confidence begins.
          </p>
        </div>
        <div>
          <div className="footer-col-title">Navigation</div>
          <ul className="footer-links">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Services</div>
          <ul className="footer-links">
            <li>
              <a href="#">Hair Styling</a>
            </li>
            <li>
              <a href="#">Bridal Looks</a>
            </li>
            <li>
              <a href="#">Skin Care</a>
            </li>
            <li>
              <a href="#">Men's Grooming</a>
            </li>
            <li>
              <a href="#">Nail Care</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li>
              <a href="#">Negombo, Sri Lanka</a>
            </li>
            <li>
              <a href="#">+94 77 123 4567</a>
            </li>
            <li>
              <a href="#">hello@ajsalon.lk</a>
            </li>
            <li>
              <a href="#">Book Appointment</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2025 AJ Salon. All rights reserved.</div>
        <div className="footer-badge">
          Premium Beauty <span>✦</span> Negombo, Sri Lanka
        </div>
      </div>
    </footer>
    </>
  );
}
