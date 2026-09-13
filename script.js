// ---- Menu rendering ----
(function () {
  const sections = window.ROLINE_MENU;
  const tabsEl = document.querySelector('.menu-tabs');
  const panesEl = document.querySelector('.menu-panels');
  if (!sections || !tabsEl || !panesEl) return;

  function buildItem(item) {
    const li = document.createElement('li');
    li.className = 'menu-item';
    const row = document.createElement('div');
    row.className = 'menu-item-row';
    const name = document.createElement('span');
    name.className = 'menu-item-name';
    name.textContent = item.name;
    const dots = document.createElement('span');
    dots.className = 'menu-item-dots';
    dots.setAttribute('aria-hidden', 'true');
    const price = document.createElement('span');
    price.className = 'menu-item-price';
    price.textContent = item.price;
    row.append(name, dots, price);
    li.appendChild(row);
    if (item.desc) {
      const d = document.createElement('p');
      d.className = 'menu-item-desc';
      d.textContent = item.desc;
      li.appendChild(d);
    }
    return li;
  }

  function buildGroup(group) {
    const wrap = document.createElement('div');
    wrap.className = 'menu-group';
    if (group.title) {
      const h = document.createElement('h3');
      h.className = 'menu-group-title';
      h.textContent = group.title;
      wrap.appendChild(h);
    }
    if (group.note) {
      const p = document.createElement('p');
      p.className = 'menu-group-note';
      p.textContent = group.note;
      wrap.appendChild(p);
    }
    const ul = document.createElement('ul');
    ul.className = 'menu-list';
    group.items.forEach((it) => ul.appendChild(buildItem(it)));
    wrap.appendChild(ul);
    return wrap;
  }

  function buildPanel(sec) {
    const div = document.createElement('div');
    div.className = 'menu-panel';
    div.id = 'menu-panel-' + sec.id;
    div.dataset.menu = sec.id;
    sec.groups.forEach((g) => div.appendChild(buildGroup(g)));
    return div;
  }

  sections.forEach((sec) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-tab';
    btn.textContent = sec.label;
    btn.dataset.menu = sec.id;
    btn.addEventListener('click', () => select(sec.id));
    tabsEl.appendChild(btn);
  });

  sections.forEach((sec) => panesEl.appendChild(buildPanel(sec)));

  function select(id) {
    tabsEl.querySelectorAll('.menu-tab').forEach((b) => {
      const on = b.dataset.menu === id;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    panesEl.querySelectorAll('.menu-panel').forEach((p) => {
      const show = p.dataset.menu === id;
      if (show) {
        p.classList.remove('hidden');
        p.classList.remove('fade-in');
        void p.offsetWidth; // restart the fade animation
        p.classList.add('fade-in');
      } else {
        p.classList.add('hidden');
        p.classList.remove('fade-in');
      }
    });
  }

  select('dinner');
})();

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
      '.menu-head > *',
      '.menu-tabs',
      '.menu-panels',
      '.occasion-image',
      '.occasion-copy > *',
      '.reservation-intro > *',
      '.reservation-form',
      '.visit-copy > *',
      '.visit-side',
      '.site-footer > *'
    ];

    // Every reveal tween is registered per element so the safety observer
    // below can force-play it if its scroll trigger never fires.
    const pendingReveals = new Map();

    revealGroups.forEach((selector) => {
      const tween = gsap.from(selector, {
        scrollTrigger: {
          trigger: selector,
          start: 'top 86%',
          once: true,
          onRefresh: (self) => {
            // Elements near the bottom of the page can get a start position
            // beyond the maximum scroll offset (the menu makes the page very
            // tall). Such a trigger would never fire and the content would
            // stay invisible forever, so clamp the start back into range.
            const max = ScrollTrigger.maxScroll(window);
            if (self.start > max - 2) {
              self.start = max - 2;
            }
          }
        },
        y: 24,
        opacity: 0,
        duration: 0.42,
        stagger: 0.06,
        ease: 'power2.out'
      });
      gsap.utils.toArray(selector).forEach((element) => pendingReveals.set(element, tween));
    });

    // Safety net: if a reveal element becomes visible while its tween has
    // not started yet (e.g. its trigger could never fire), play it anyway.
    // IntersectionObserver does not depend on GSAP's scroll calculations.
    const revealSafety = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const tween = pendingReveals.get(entry.target);
        if (tween && tween.progress() === 0 && !tween.isActive()) {
          tween.play(0);
        }
      });
    }, { threshold: 0.04 });
    pendingReveals.forEach((tween, element) => revealSafety.observe(element));

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
