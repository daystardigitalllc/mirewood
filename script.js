document.addEventListener('DOMContentLoaded', () => {
  // 0. Seasonal Theme System (season itself is set in season-config.js)
  const seasonHeroImages = {
    spring: { src: 'assets/mirewood_spring.jpg', alt: 'Mirewood venue in spring, lush green forest surrounding the grounds' },
    summer: { src: 'assets/mirewood_summer.jpg', alt: 'Mirewood venue in summer, open field ceremony setup under a clear blue sky' },
    fall: { src: 'assets/mirewood_fall.jpg', alt: 'Mirewood venue in fall, trail lined with turning autumn leaves' },
    winter: { src: 'assets/mirewood_winter.jpg', alt: 'Mirewood venue in winter, snow-covered forest trail' }
  };

  const currentSeason = document.documentElement.getAttribute('data-season') || 'fall';
  // The winter photo is a tall portrait shot with the couple low in the frame;
  // on a wide hero the default center crop cuts them out entirely, so bias down.
  const winterObjectPosition = 'center 85%';

  document.querySelectorAll('[data-seasonal-hero]').forEach((img) => {
    img.src = seasonHeroImages[currentSeason].src;
    img.alt = seasonHeroImages[currentSeason].alt;
    img.style.objectPosition = currentSeason === 'winter' ? winterObjectPosition : '';
  });

  // The homepage hero normally shows a fixed venue photo (not the season rotation
  // above), but in winter it swaps to the snow photo since the venue looks so different
  const homeHero = document.querySelector('.hero--editorial .hero__bg-img');
  if (homeHero && currentSeason === 'winter') {
    homeHero.src = seasonHeroImages.winter.src;
    homeHero.alt = seasonHeroImages.winter.alt;
    homeHero.style.objectPosition = winterObjectPosition;
  }

  // 1. Mobile Menu Toggle
  const toggleBtn = document.querySelector('.navbar__toggle');
  const navMenu = document.querySelector('.navbar__menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('navbar__toggle--active');
      navMenu.classList.toggle('navbar__menu--active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('navbar__toggle--active');
        navMenu.classList.remove('navbar__menu--active');
      });
    });
  }

  // 2. Navbar Scroll Style
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    });
  }

  // 3. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight * 0.85) {
        el.classList.add('reveal--active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load

  // 4. Contact Form Interaction
  const contactForm = document.querySelector('.chat__form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Simple visual feedback for submit
      submitBtn.disabled = true;
      submitBtn.textContent = 'SENDING...';
      
      setTimeout(() => {
        submitBtn.style.backgroundColor = '#526657'; // Success Green
        submitBtn.textContent = 'SENT SUCCESSFULLY!';
        
        // Reset form
        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.textContent = originalText;
        }, 3000);
      }, 1500);
    });
  }

  // 5. Gallery Lightbox Modal
  const galleryItems = document.querySelectorAll('.gallery-grid__item');
  const lightbox = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-modal__img');
  const lightboxClose = document.querySelector('.lightbox-modal__close');

  if (galleryItems.length > 0 && lightbox && lightboxImg && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      document.body.style.overflow = ''; // Restore background scroll
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });
  }
});
