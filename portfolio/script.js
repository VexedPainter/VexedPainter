const USERNAME = "VexedPainter";

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initTypingAnimation();
  initSmoothScroll();
  initHamburgerMenu();
  initScrollReveal();
  initNavbarScroll();
  fetchGitHubStats();
  updateLastUpdateTime();
});

function initParticles() {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 900 } },
        color: { value: "#00d9ff" },
        shape: { type: "circle" },
        opacity: {
          value: 0.4,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#00d9ff",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.6 } },
          push: { particles_nb: 3 },
        },
      },
      retina_detect: true,
    });
  }
}

function initTypingAnimation() {
  const texts = [
    "Full-Stack Developer",
    "AI/ML Engineer",
    "Data Scientist",
    "Cybersecurity Explorer",
    "Problem Solver",
    "Code Creator",
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedTextElement = document.querySelector(".typed-text");

  function type() {
    if (!typedTextElement) return;

    const current = texts[textIndex];

    if (isDeleting) {
      typedTextElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("active")
      ? "hidden"
      : "";
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target) &&
      navMenu.classList.contains("active")
    ) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    reveals.forEach((reveal) => {
      const revealTop = reveal.getBoundingClientRect().top;

      if (revealTop < windowHeight - revealPoint) {
        reveal.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
}

function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
}

async function fetchGitHubStats() {
  const reposEl = document.getElementById("github-repos");
  const starsEl = document.getElementById("github-stars");
  const followersEl = document.getElementById("github-followers");

  try {
    const userResponse = await fetch(
      `https://api.github.com/users/${USERNAME}`,
    );

    if (!userResponse.ok) throw new Error("API error");

    const userData = await userResponse.json();

    if (reposEl) animateCounter(reposEl, userData.public_repos || 0);
    if (followersEl) animateCounter(followersEl, userData.followers || 0);

    const reposResponse = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100`,
    );
    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      const totalStars = repos.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0,
      );
      if (starsEl) animateCounter(starsEl, totalStars);
    } else if (starsEl) {
      starsEl.textContent = "0";
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    if (reposEl) reposEl.textContent = "3";
    if (followersEl) followersEl.textContent = "0";
    if (starsEl) starsEl.textContent = "0";
  }
}

function animateCounter(element, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

function updateLastUpdateTime() {
  const lastUpdateElement = document.getElementById("last-update");
  if (lastUpdateElement) {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    lastUpdateElement.textContent = `Last updated: ${now.toLocaleDateString("en-US", options)}`;
  }
}

if ("IntersectionObserver" in window) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
