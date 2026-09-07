// ===================================================
// DESIGNS SECTION (Phone ringing & Metanav previews)
// ===================================================
(() => {
  const phoneShowcase = document.getElementById('phone-showcase');
  const phoneBtn = document.getElementById('phone-btn');
  const linePanel = document.getElementById('line-panel');
  const metanavGrid = document.getElementById('metanav-grid');
  const metanavButtons = document.querySelectorAll('.metanav-btn');
  const lineContent = document.getElementById('line-content');
  const escHint = document.getElementById('esc-hint');

  if (!phoneShowcase || !phoneBtn || !linePanel || !metanavGrid || !lineContent || !metanavButtons.length) return;

  const projectPlaceholders = [
    { image: 'Ap_Poster.png', alt: 'Design 01' },
    { image: 'Oni_Tiyan.png', alt: 'Design 02' },
    { image: 'Led_Wall.gif', alt: 'Design 03' },
    { image: 'Manga.png', alt: 'Design 04' },
    { image: 'Black.png', alt: 'Design 05' },
    { image: 'Gradient.png', alt: 'Design 06' },
    { image: 'Babbage.png', alt: 'Design 07' },
    { image: 'Oshino.png', alt: 'Design 08' },
    { image: 'Baku.png', alt: 'Design 09' }
  ];

  const CONTENT_FADE_MS = 250;
  const ESC_HINT_DELAY_MS = 1000;
  let escHintTimer = null;

  const hideEscHint = () => {
    if (escHintTimer) {
      clearTimeout(escHintTimer);
      escHintTimer = null;
    }
    escHint?.classList.remove('is-visible');
  };

  const scheduleEscHint = () => {
    hideEscHint();
    if (!escHint) return;
    escHintTimer = setTimeout(() => {
      escHint.classList.add('is-visible');
      escHintTimer = null;
    }, ESC_HINT_DELAY_MS);
  };

  const renderContent = (data, index) =>
    `<div class="line-content-inner"><img src="assets/Designs/${data.image}" alt="${data.alt || ''}" class="line-content-img" data-index="${index}"></div>`;

  const answerPhone = () => {
    phoneShowcase.classList.add('is-answered');
    linePanel.classList.add('is-active');
  };

  const openAppFor = (index) => {
    const data = projectPlaceholders[index] || projectPlaceholders[0];
    const isVisible = lineContent.classList.contains('is-visible');

    if (isVisible) {
      lineContent.classList.remove('is-visible');
      setTimeout(() => {
        lineContent.innerHTML = renderContent(data, index);
        lineContent.classList.add('is-visible');
      }, CONTENT_FADE_MS);
    } else {
      lineContent.innerHTML = renderContent(data, index);
      lineContent.classList.add('is-visible');
    }

    metanavGrid.classList.add('is-hidden');
    document.body.classList.add('preview-open');
    scheduleEscHint();
  };

  const backToApps = () => {
    lineContent.classList.remove('is-visible');
    metanavGrid.classList.remove('is-hidden');
    document.body.classList.remove('preview-open');
    hideEscHint();
  };

  const resetDesignsScene = () => {
    phoneShowcase.classList.remove('is-answered');
    linePanel.classList.remove('is-active');
    lineContent.classList.remove('is-visible');
    lineContent.innerHTML = '';
    metanavGrid.classList.remove('is-hidden');
    document.body.classList.remove('preview-open');
    hideEscHint();
  };

  phoneBtn.addEventListener('click', answerPhone);

  metanavButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.remove('is-clicked');
      void btn.offsetWidth;
      btn.classList.add('is-clicked');
      openAppFor(Number(btn.dataset.index));
    });
  });

  const designsSection = document.getElementById('designs');
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!designsSection?.classList.contains('active') || !linePanel.classList.contains('is-active')) return;

    if (lineContent.classList.contains('is-visible')) {
      backToApps();
    } else {
      resetDesignsScene();
    }
    event.preventDefault();
    event.stopPropagation();
  }, true);

  document.querySelectorAll('a[href="#designs"]').forEach((link) => {
    link.addEventListener('click', resetDesignsScene);
  });
})();

// ===================================================
// CONTACT SECTION (Calling card reveal)
// ===================================================
(() => {
  const showcase = document.getElementById('calling-card-showcase');
  const cardBtn = document.getElementById('calling-card-btn');
  const reveal = document.getElementById('contact-reveal');

  if (!showcase || !cardBtn || !reveal) return;

  const openReveal = () => {
    showcase.classList.add('is-open');
    reveal.classList.add('is-visible');
  };

  const resetCallingCard = () => {
    showcase.classList.remove('is-open');
    reveal.classList.remove('is-visible');
    cardBtn.classList.remove('is-entering');
    void cardBtn.offsetWidth;
    cardBtn.classList.add('is-entering');
  };

  cardBtn.addEventListener('click', openReveal);

  document.querySelectorAll('a[href="#contact"]').forEach((link) => {
    link.addEventListener('click', resetCallingCard);
  });

  resetCallingCard();
})();

// ===================================================
// CONTACT FORM (FormSubmit Relay & Mailto Fallback)
// ===================================================
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const CONTACT_EMAIL = 'punay.stevenkenn.bscs2025@gmail.com';
  const status = document.getElementById('form-status');
  const btn = form.querySelector('.form-send');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (data._honey) return;

    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      status.textContent = 'Fill in all three fields first.';
      return;
    }

    btn.disabled = true;
    status.textContent = 'Sending…';

    fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        _subject: `Portfolio message from ${data.name}`
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        status.textContent = "Sent! I'll get back to you soon.";
        form.reset();
      })
      .catch(() => {
        status.textContent = "Couldn't reach the relay, opening your email app instead…";
        const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
        const body = encodeURIComponent(`${data.message}\n\nReply to: ${data.email}`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      })
      .finally(() => {
        btn.disabled = false;
      });
  });
})();

// ===================================================
// SCREEN NAVIGATION & WIPE TRANSITIONS
// ===================================================
(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const wipeEl = document.getElementById('wipe');
  const backBtn = document.querySelector('.back-to-top');
  const menuLinks = document.querySelectorAll('.nav-link');

  if (!screens.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let transitioning = false;

  let current = screens.find((s) => s.classList.contains('active'));
  let currentId = current ? current.id : 'top';
  document.body.dataset.screen = currentId;
  if (backBtn) backBtn.classList.toggle('is-visible', currentId !== 'top');

  const activateScreen = (id) => {
    screens.forEach((s) => s.classList.toggle('active', s.id === id));
    currentId = id;
    document.body.dataset.screen = id;
    if (backBtn) backBtn.classList.toggle('is-visible', id !== 'top');
    if (id !== 'designs') document.body.classList.remove('preview-open');
  };

  const goTo = (id) => {
    if (transitioning || id === currentId) return;
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('screen')) return;

    if (reduceMotion || !wipeEl) {
      activateScreen(id);
      return;
    }

    transitioning = true;
    wipeEl.classList.remove('go');
    void wipeEl.offsetWidth;
    wipeEl.classList.add('go');

    setTimeout(() => activateScreen(id), 340);
    setTimeout(() => {
      wipeEl.classList.remove('go');
      transitioning = false;
    }, 760);
  };

  menuLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      event.preventDefault();
      goTo(href.slice(1));
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') goTo('top');
  });
})();

// ===================================================
// BACKGROUND PARALLAX (Cursor tracking & lerp easing)
// ===================================================
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  const REACH = 52;
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  let ticking = false;

  const settled = () => Math.abs(targetX - curX) < 0.05 && Math.abs(targetY - curY) < 0.05;

  const loop = () => {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    root.style.setProperty('--par-x', `${curX.toFixed(2)}px`);
    root.style.setProperty('--par-y', `${curY.toFixed(2)}px`);

    if (settled()) {
      curX = targetX;
      curY = targetY;
      root.style.setProperty('--par-x', `${curX.toFixed(2)}px`);
      root.style.setProperty('--par-y', `${curY.toFixed(2)}px`);
      ticking = false;
      return;
    }
    requestAnimationFrame(loop);
  };

  const ensureLoopRunning = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(loop);
    }
  };

  document.addEventListener('mousemove', (event) => {
    const nx = (event.clientX / window.innerWidth) - 0.5;
    const ny = (event.clientY / window.innerHeight) - 0.5;
    targetX = -nx * REACH;
    targetY = -ny * REACH;
    ensureLoopRunning();
  }, { passive: true });
})();