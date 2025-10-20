// ===== FINAL BULLETPROOF Carousel + Lightbox =====
// Complete rewrite to ensure lightbox always works

let currentSlide = 0;
let totalSlides = 0;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎬 Initializing carousel and lightbox...");
  initCarousel();
  initLightbox();
});

// ===== Initialize Carousel =====
function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const indicators = document.getElementById("carouselIndicators");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track) {
    console.error("❌ Carousel track not found!");
    return;
  }

  const slides = track.querySelectorAll(".carousel-slide");
  totalSlides = slides.length;
  console.log(`✅ Found ${totalSlides} slides`);

  if (totalSlides === 0) {
    console.warn("⚠️ No slides found in carousel");
    return;
  }

  // Create indicators
  if (indicators) {
    indicators.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement("div");
      indicator.className = "carousel-indicator";
      if (i === 0) indicator.classList.add("active");
      indicator.addEventListener("click", () => goToSlide(i));
      indicators.appendChild(indicator);
    }
  }

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveCarousel(-1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveCarousel(1);
    });
  }

  // Add click handlers to ALL carousel images
  slides.forEach((slide, index) => {
    const img = slide.querySelector(".carousel-image");
    if (!img) return;
    
    img.style.cursor = "pointer";
    
    // Simple, direct click handler
    img.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const imgSrc = img.getAttribute("src");
      console.log(`🖱️ Image clicked at index ${index}: ${imgSrc}`);
      openLightbox(imgSrc);
    });
    
    // Touch support for mobile
    img.addEventListener("touchend", (e) => {
      e.preventDefault();
      const imgSrc = img.getAttribute("src");
      console.log(`👆 Image touched at index ${index}: ${imgSrc}`);
      openLightbox(imgSrc);
    }, { passive: false });
  });

  // Auto-rotate carousel every 5 seconds
  setInterval(() => moveCarousel(1), 5000);

  console.log("✅ Carousel initialized successfully");
}

// ===== Carousel Navigation =====
function moveCarousel(direction) {
  currentSlide += direction;
  if (currentSlide < 0) currentSlide = totalSlides - 1;
  else if (currentSlide >= totalSlides) currentSlide = 0;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  const indicators = document.querySelectorAll(".carousel-indicator");
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i === currentSlide);
  });

  const slides = track.querySelectorAll(".carousel-slide");
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });
}

// ===== Lightbox System =====
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImg = document.getElementById("lightboxImg");

  if (!lightbox || !lightboxClose || !lightboxImg) {
    console.error("❌ Lightbox elements not found!");
    console.log("Lightbox:", lightbox);
    console.log("Close button:", lightboxClose);
    console.log("Lightbox image:", lightboxImg);
    return;
  }

  // Click outside to close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close button
  lightboxClose.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  });

  // Prevent closing when clicking the image itself
  lightboxImg.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      closeLightbox();
    }
  });

  console.log("✅ Lightbox initialized successfully");
}

function openLightbox(imgSrc) {
  console.log("🔍 Opening lightbox with:", imgSrc);
  
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  if (!lightbox || !lightboxImg) {
    console.error("❌ Cannot open lightbox - elements missing");
    console.log("Lightbox element:", lightbox);
    console.log("Lightbox img element:", lightboxImg);
    return;
  }

  if (!imgSrc || imgSrc === "") {
    console.error("❌ Cannot open lightbox - no image source provided");
    return;
  }

  // Set the image source FIRST
  lightboxImg.src = imgSrc;
  console.log("✅ Image src set to:", lightboxImg.src);
  
  // Force display with both methods
  lightbox.style.display = "flex";
  lightbox.style.visibility = "visible";
  lightbox.style.opacity = "1";
  lightbox.classList.add("active");
  
  // Prevent body scrolling
  document.body.style.overflow = "hidden";
  
  // Log computed style for debugging
  const computedStyle = window.getComputedStyle(lightbox);
  console.log("Lightbox display:", computedStyle.display);
  console.log("Lightbox visibility:", computedStyle.visibility);
  console.log("Lightbox z-index:", computedStyle.zIndex);
  
  console.log("✅ Lightbox opened successfully");
}

function closeLightbox() {
  console.log("❌ Closing lightbox");
  
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  
  if (!lightbox) return;

  // Hide lightbox with all methods
  lightbox.classList.remove("active");
  lightbox.style.display = "none";
  lightbox.style.visibility = "hidden";
  lightbox.style.opacity = "0";
  
  // Clear image source to free memory
  if (lightboxImg) {
    lightboxImg.src = "";
  }
  
  // Restore body scrolling
  document.body.style.overflow = "";
  
  console.log("✅ Lightbox closed");
}