const toggle = document.getElementById("hamburger");
const nav = document.getElementById("navMenu");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  const navLinks = document.querySelectorAll("#navMenu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
}

const mediaModal = document.getElementById("mediaModal");
const mediaModalContent = document.getElementById("mediaModalContent");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
let activeModalVideo = null;

function closeMediaModal() {
  if (!mediaModal || !mediaModalContent) {
    return;
  }

  if (activeModalVideo) {
    activeModalVideo.pause();
    activeModalVideo.currentTime = 0;
    activeModalVideo = null;
  }

  mediaModal.classList.remove("open");
  mediaModal.setAttribute("aria-hidden", "true");
  mediaModalContent.innerHTML = "";
  document.body.style.overflow = "";
}

function openMediaModal(content) {
  if (!mediaModal || !mediaModalContent) {
    return;
  }

  mediaModalContent.innerHTML = content;
  mediaModal.classList.add("open");
  mediaModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  activeModalVideo = mediaModalContent.querySelector("video");
  if (activeModalVideo) {
    activeModalVideo.muted = false;
    activeModalVideo.volume = 1;
    activeModalVideo.play().catch(() => {
      activeModalVideo.controls = true;
    });
  }
}

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeMediaModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMediaModal();
  }
});

const reelCards = document.querySelectorAll(".reel-card");

reelCards.forEach((card) => {
  card.addEventListener("click", () => {
    const videoSrc = card.dataset.video;
    const title = card.dataset.title || "Latest Clip";
    const caption = card.dataset.caption || "";

    openMediaModal(`
      <div class="media-popout">
        <figure>
          <video src="${videoSrc}" controls playsinline></video>
        </figure>
        <div class="details">
          <span class="eyebrow">Reel</span>
          <h3 id="mediaModalTitle">${title}</h3>
          <p>${caption}</p>
        </div>
      </div>
    `);
  });
});

const eventCards = document.querySelectorAll("#events .event-card");

function openEventModal(card) {
  const imageSrc = card.dataset.image;
  const name = card.dataset.name || "Upcoming Event";
  const location = card.dataset.location || "";
  const caption = card.dataset.caption || "";
  const ticket = card.dataset.ticket || "#";

  openMediaModal(`
    <div class="media-popout">
      <figure>
        <img src="${imageSrc}" alt="${name} poster">
      </figure>
      <div class="details">
        <span class="eyebrow">Upcoming Event</span>
        <h3 id="mediaModalTitle">${name}</h3>
        <p>${location}</p>
        <p>${caption}</p>
        <p><a href="${ticket}" target="_blank" rel="noopener noreferrer" class="ticket-link">Buy Tickets</a></p>
      </div>
    </div>
  `);
}

eventCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest(".ticket-link")) {
      return;
    }

    openEventModal(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEventModal(card);
    }
  });
});

const crewSlider = document.querySelector(".crew-slider");
const leftArrow = document.querySelector(".slider-arrow.left");
const rightArrow = document.querySelector(".slider-arrow.right");
let autoSlideStopped = false;
let autoScrollFrame = null;

function openCrewModal(card) {
  const imageSrc = card.dataset.image;
  const name = card.dataset.name || "Crew Member";
  const handle = card.dataset.handle || "";
  const caption = card.dataset.caption || "";

  openMediaModal(`
    <div class="media-popout">
      <figure>
        <img src="${imageSrc}" alt="${name}">
      </figure>
      <div class="details">
        <span class="eyebrow">Crew</span>
        <h3 id="mediaModalTitle">${name}</h3>
        <p>${handle}</p>
        <p>${caption}</p>
      </div>
    </div>
  `);
}

function stopAutoSlide() {
  autoSlideStopped = true;

  if (autoScrollFrame) {
    cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = null;
  }
}

function getSlideAmount() {
  const firstCard = document.querySelector(".crew-card");
  return firstCard ? firstCard.offsetWidth + 20 : 240;
}

if (crewSlider) {
  const originalCards = Array.from(crewSlider.querySelectorAll(".crew-card"));

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    crewSlider.appendChild(clone);
  });

  crewSlider.addEventListener("click", (event) => {
    const clickedCard = event.target.closest(".crew-card");

    if (!clickedCard) {
      return;
    }

    openCrewModal(clickedCard);
  });

  const autoScroll = () => {
    if (autoSlideStopped) {
      return;
    }

    const loopPoint = crewSlider.scrollWidth / 2;
    crewSlider.scrollLeft += 0.6;

    if (crewSlider.scrollLeft >= loopPoint) {
      crewSlider.scrollLeft -= loopPoint;
    }

    autoScrollFrame = requestAnimationFrame(autoScroll);
  };

  autoScrollFrame = requestAnimationFrame(autoScroll);
}

if (leftArrow && crewSlider) {
  leftArrow.addEventListener("click", () => {
    stopAutoSlide();
    crewSlider.scrollBy({ left: -getSlideAmount(), behavior: "smooth" });
  });
}

if (rightArrow && crewSlider) {
  rightArrow.addEventListener("click", () => {
    stopAutoSlide();
    crewSlider.scrollBy({ left: getSlideAmount(), behavior: "smooth" });
  });
}

const heroSlides = document.querySelectorAll(".hero-slide");
let activeHeroSlide = 0;

if (heroSlides.length > 1) {
  setInterval(() => {
    heroSlides[activeHeroSlide].classList.remove("active");
    activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
    heroSlides[activeHeroSlide].classList.add("active");
  }, 4000);
}
