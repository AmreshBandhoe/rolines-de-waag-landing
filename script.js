const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const motionMedia = gsap.matchMedia();

  motionMedia.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero-copy > *', {
      y: 24,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out'
    });

    const revealGroups = [
      '.intro-grid > *',
      '.flavours-top > *',
      '.flavour-card',
      '.occasion-image',
      '.occasion-copy > *',
      '.reservation-intro > *',
      '.reservation-form',
      '.visit-copy > *',
      '.visit-side',
      '.site-footer > *'
    ];

    revealGroups.forEach((selector) => {
      gsap.from(selector, {
        scrollTrigger: {
          trigger: selector,
          start: 'top 86%',
          once: true
        },
        y: 24,
        opacity: 0,
        duration: 0.42,
        stagger: 0.06,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.button, .text-link, .header-cta, .site-nav a').forEach((element) => {
      const lift = element.matches('.button') ? -3 : -1;
      const scale = element.matches('.button') ? 1.015 : 1;

      element.addEventListener('mouseenter', () => {
        gsap.to(element, { y: lift, scale, duration: 0.2, ease: 'power2.out', overwrite: true });
      });
      element.addEventListener('mouseleave', () => {
        gsap.to(element, { y: 0, scale: 1, duration: 0.2, ease: 'power2.out', overwrite: true });
      });
    });

    gsap.utils.toArray('.card-image').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -4, duration: 0.25, ease: 'power2.out', overwrite: true });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.25, ease: 'power2.out', overwrite: true });
      });
    });
  });
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Close' : 'Menu';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'Menu';
    });
  });
}

const reservationForm = document.getElementById('reservation-form');

if (reservationForm) {
  reservationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(reservationForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const date = String(formData.get('date') || '').trim();
    const time = String(formData.get('time') || '').trim();
    const guests = String(formData.get('guests') || '').trim();
    const notes = String(formData.get('notes') || '').trim();
    const status = reservationForm.querySelector('.form-status');

    if (!name || !email || !date || !time || !guests) {
      if (status) {
        status.textContent = 'Please complete all required fields before submitting.';
        status.classList.add('error');
      }
      return;
    }

    const subject = encodeURIComponent(`Reservation request for ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nNotes: ${notes || 'None'}`
    );

    window.location.href = `mailto:reservations@rolinesdewaag.com?subject=${subject}&body=${body}`;

    if (status) {
      status.textContent = `Thanks, ${name}! Your reservation request is ready to send.`;
      status.classList.remove('error');
    }

    reservationForm.reset();
  });
}

const occasionSlides = document.querySelectorAll('.occasion-slide');
if (occasionSlides.length > 1) {
  let slideIndex = 0;

  setInterval(() => {
    occasionSlides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % occasionSlides.length;
    occasionSlides[slideIndex].classList.add('active');
  }, 3200);
}
