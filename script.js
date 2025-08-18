let currentSlideIndex = 1;
// Use const for variables that won't be reassigned
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
const fullscreenBtn = document.getElementById('fullscreen-btn');
const presentationContainer = document.querySelector('.presentation-container');
const navContainer = document.querySelector('.nav-container');

// A function to set the state of a single slide
function updateSlideState(slide, isActive) {
  slide.classList.toggle('active', isActive);
  // WCAG change: Dynamically manage aria-hidden attribute for screen readers.
  // Crucial step for accessibility.
  slide.setAttribute('aria-hidden', !isActive);

  // WCAG change: Manage focus for keyboard navigation.
  // Main heading of the active slide is focusable.
  const heading = slide.querySelector('h1, h2, h3');
  if (heading) {
    if (isActive) {
      // Make the heading focusable when the slide is active
      heading.setAttribute('tabindex', '-1');
      // Set focus to the active slide's heading
      heading.focus();
    } else {
      // Remove tabindex from inactive slides
      heading.removeAttribute('tabindex');
    }
  }
}

// A function to show a specific slide
function showSlide(n) {
  if (n > totalSlides) {
    currentSlideIndex = 1;
  }
  if (n < 1) {
    currentSlideIndex = totalSlides;
  }

  // Update all slides and indicators based on the new index
  slides.forEach((slide, index) => {
    const isActive = index + 1 === currentSlideIndex;
    updateSlideState(slide, isActive);
  });

  indicators.forEach((indicator, index) => {
    const isActive = index + 1 === currentSlideIndex;
    indicator.classList.toggle('active', isActive);
  });
}

function nextSlide() {
  currentSlideIndex++;
  showSlide(currentSlideIndex);
}

function previousSlide() {
  currentSlideIndex--;
  showSlide(currentSlideIndex);
}

// Remove the window.onclick function to use event listeners
// instead of inline onclick attributes in the HTML.
function currentSlide(n) {
  currentSlideIndex = n;
  showSlide(currentSlideIndex);
}

// WCAG Change: Use a single, clean event listener for all indicator buttons
indicators.forEach((button, index) => {
  button.addEventListener('click', () => {
    currentSlide(index + 1);
  });
});

// Event listener for fullscreen button
fullscreenBtn.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    presentationContainer.requestFullscreen();
  }
});

// WCAG Change: Add an event listener for "Escape" key to exit fullscreen,
// which is a standard accessibility practice.
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && document.fullscreenElement) {
    document.exitFullscreen();
  }
});

// WCAG Change: Keyboard navigation with event.preventDefault() for better control.
document.addEventListener('keydown', function(event) {
  // Prevent default behavior to avoid issues like page scrolling with spacebar
  if (event.key === 'ArrowRight' || event.key === ' ') {
    event.preventDefault();
    nextSlide();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    previousSlide();
  } else if (event.key >= '1' && event.key <= totalSlides.toString()) {
    currentSlide(parseInt(event.key));
  }
});

// Event listener for next/previous buttons
const nextBtn = document.querySelector('.nav-btn[aria-label="Next slide"]');
const prevBtn = document.querySelector('.nav-btn[aria-label="Previous slide"]');

if (nextBtn) {
  nextBtn.addEventListener('click', nextSlide);
}

if (prevBtn) {
  prevBtn.addEventListener('click', previousSlide);
}


// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    nextSlide();
  }
  if (touchEndX > touchStartX + 50) {
    previousSlide();
  }
}

// Initializing the presentation and setting the first slide as active
showSlide(currentSlideIndex);
