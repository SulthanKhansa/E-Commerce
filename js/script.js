document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for both navbar and hero navigation
  document.querySelectorAll(".nav-main a, .hero-nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      // Handle home navigation
      if (targetId === "#top") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // Toggle hamburger menu
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburgerMenu && mobileNav) {
    hamburgerMenu.addEventListener("click", function () {
      hamburgerMenu.classList.toggle("active");
      mobileNav.classList.toggle("active");
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll(".mobile-nav a").forEach((link) => {
      link.addEventListener("click", function () {
        hamburgerMenu.classList.remove("active");
        mobileNav.classList.remove("active");
      });
    });
  }

  // Menu tab functionality
  const tabButtons = document.querySelectorAll(".tab-img");
  const tabContents = document.querySelectorAll(".tab-content-img");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Hapus kelas aktif dari semua tombol dan konten
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Tambahkan kelas aktif ke tombol dan konten yang dipilih
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Navbar show/hide on scroll
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.remove("navbar--hidden");
    } else {
      navbar.classList.add("navbar--hidden");
    }
  });

  // Scroll animation for fade-in elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  const fadeInElements = document.querySelectorAll(".fade-in");
  fadeInElements.forEach((el) => {
    observer.observe(el);
  });
});
