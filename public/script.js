"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("all");

  useEffect(() => {
    let lastScrollTop = 0;

    // Cursor
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

    // Navbar scroll
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");

      if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 60);
      }

      // auto close nav
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

    // Hamburger menu
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

    navLinks?.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    // Scroll reveal
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

    // cleanup (VERY IMPORTANT)
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Count up (React safe)
  useEffect(() => {
    const stats = document.querySelectorAll(".hero-stat-num");

    if (stats.length < 4) return;

    const targets = [10, 3000, 15, 8];

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

      el.dataset.counted = "true";
    });
  }, []);

  return (
    <div>
      <h1>AJ Salon</h1>
    </div>
  );
}