document.addEventListener('DOMContentLoaded', () => {
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
