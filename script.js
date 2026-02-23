/* ==========================================================================
   SLIDE STATE & NAVIGATION
   ========================================================================== */
let currentSlideIndex = 1;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
const fullscreenBtn = document.getElementById('fullscreen-btn');
const presentationContainer = document.querySelector('.presentation-container');

function updateSlideState(slide, isActive) {
  slide.classList.toggle('active', isActive);
  slide.setAttribute('aria-hidden', !isActive);

  const heading = slide.querySelector('h1, h2, h3');
  if (heading) {
    if (isActive) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    } else {
      heading.removeAttribute('tabindex');
    }
  }
}

function showSlide(n) {
  if (n > totalSlides) currentSlideIndex = 1;
  if (n < 1) currentSlideIndex = totalSlides;

  slides.forEach((slide, index) => updateSlideState(slide, index + 1 === currentSlideIndex));
  indicators.forEach((indicator, index) => indicator.classList.toggle('active', index + 1 === currentSlideIndex));
}

function nextSlide()         { currentSlideIndex++; showSlide(currentSlideIndex); }
function previousSlide()     { currentSlideIndex--; showSlide(currentSlideIndex); }
function currentSlide(n)     { currentSlideIndex = n; showSlide(currentSlideIndex); }

/* ==========================================================================
   INDICATOR CLICKS
   ========================================================================== */
indicators.forEach((btn, index) => btn.addEventListener('click', () => currentSlide(index + 1)));

/* ==========================================================================
   FULLSCREEN
   ========================================================================== */
fullscreenBtn.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else presentationContainer.requestFullscreen();
});

/* ==========================================================================
   KEYBOARD NAVIGATION
   ========================================================================== */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && document.fullscreenElement) {
    document.exitFullscreen();
  }

  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    previousSlide();
  } else if (e.key >= '1' && e.key <= totalSlides.toString()) {
    currentSlide(parseInt(e.key));
  }
});

/* ==========================================================================
   TOUCH / SWIPE SUPPORT
   ========================================================================== */
let touchStartX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (diff < -50) nextSlide();
  if (diff > 50)  previousSlide();
});

/* ==========================================================================
   INIT
   ========================================================================== */
showSlide(currentSlideIndex);
