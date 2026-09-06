// ===================================================
// Designs section: a ringing Phone.png sits center-stage.
// Answering it slides Line.png up (same pulled-from-pocket
// motion as before), revealing 8 Metanav app icons on it.
// Tapping an app fades in that project's preview and shows
// a Back button; Back returns to the 8-icon view. Leaving
// the Designs screen and coming back resets it so the phone
// rings again on the next visit.
// Swap the placeholder text/images in `projectPlaceholders`
// below for real project content whenever it's ready.
// ===================================================
(function () {
  var phoneShowcase = document.getElementById('phone-showcase');
  var phoneBtn = document.getElementById('phone-btn');
  var linePanel = document.getElementById('line-panel');
  var metanavGrid = document.getElementById('metanav-grid');
  var metanavButtons = document.querySelectorAll('.metanav-btn');
  var lineContent = document.getElementById('line-content');
  var backBtn = document.getElementById('designs-back-btn');
  var escHint = document.getElementById('esc-hint');

  if (!phoneShowcase || !phoneBtn || !linePanel || !metanavGrid || !lineContent || metanavButtons.length === 0) return;

  // one entry per app icon, in the same order as the icons on Line.png
  var projectPlaceholders = [
    { image: 'Ap_poster.png', alt: 'Design 01' },
    { image: 'Oni_Tiyan.png', alt: 'Design 02' },
    { image: 'LED_Wall.gif', alt: 'Design 03' },
    { image: 'Manga.png', alt: 'Design 04' },
    { image: 'Black.png', alt: 'Design 05' },
    { image: 'Gradient.png', alt: 'Design 06' },
    { image: 'Babbage.png', alt: 'Design 07' },
    { image: 'Oshino.png', alt: 'Design 08' },
    { image: 'Baku.png', alt: 'Design 09' }
  ];

  // how long .line-content's fade-out takes — must match the opacity
  // transition on .line-content in styles.css
  var CONTENT_FADE_MS = 250;
  // how long a preview stays open before the Esc-hint fades in beside it
  var ESC_HINT_DELAY_MS = 1000;
  var escHintTimer = null;

  function hideEscHint() {
    if (escHintTimer) {
      clearTimeout(escHintTimer);
      escHintTimer = null;
    }
    if (escHint) escHint.classList.remove('is-visible');
  }

  function scheduleEscHint() {
    hideEscHint();
    if (!escHint) return;
    escHintTimer = setTimeout(function () {
      escHint.classList.add('is-visible');
      escHintTimer = null;
    }, ESC_HINT_DELAY_MS);
  }

  function renderContent(data, index) {
    return '<div class="line-content-inner"><img src="assets/Designs/' + data.image + '" alt="' +
      (data.alt || '') + '" class="line-content-img" data-index="' + index + '"></div>';
  }

  // answering the call: hide the phone, slide Line.png into view
  function answerPhone() {
    phoneShowcase.classList.add('is-answered');
    linePanel.classList.add('is-active');
  }

  // tapping an app icon: fade the current preview out (if any) before
  // swapping in the new one, so nothing flashes into view early
  function openAppFor(index) {
    var data = projectPlaceholders[index] || projectPlaceholders[0];
    var isVisible = lineContent.classList.contains('is-visible');

    if (isVisible) {
      lineContent.classList.remove('is-visible');
      setTimeout(function () {
        lineContent.innerHTML = renderContent(data, index);
        lineContent.classList.add('is-visible');
      }, CONTENT_FADE_MS);
    } else {
      lineContent.innerHTML = renderContent(data, index);
      lineContent.classList.add('is-visible');
    }

    metanavGrid.classList.add('is-hidden');
    if (backBtn) backBtn.classList.add('is-visible');
    // the dedicated Back.png button above already returns to the app
    // grid, so hide the global back-to-top button while a preview is
    // open — having both on screen at once was confusing
    document.body.classList.add('preview-open');
    scheduleEscHint();
  }

  // Back button: close the preview, return to the 8 apps
  function backToApps() {
    lineContent.classList.remove('is-visible');
    metanavGrid.classList.remove('is-hidden');
    if (backBtn) backBtn.classList.remove('is-visible');
    document.body.classList.remove('preview-open');
    hideEscHint();
  }

  // full reset: back to the ringing phone, as if a fresh visit
  function resetDesignsScene() {
    phoneShowcase.classList.remove('is-answered');
    linePanel.classList.remove('is-active');
    lineContent.classList.remove('is-visible');
    lineContent.innerHTML = '';
    metanavGrid.classList.remove('is-hidden');
    if (backBtn) backBtn.classList.remove('is-visible');
    document.body.classList.remove('preview-open');
    hideEscHint();
  }

  phoneBtn.addEventListener('click', answerPhone);

  metanavButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // restart the click animation every time, even on rapid clicks
      btn.classList.remove('is-clicked');
      void btn.offsetWidth; // force a reflow so the animation replays
      btn.classList.add('is-clicked');

      openAppFor(Number(btn.dataset.index));
    });
  });

  if (backBtn) backBtn.addEventListener('click', backToApps);

  // Esc key inside the Designs scene has three levels:
  //  - a design preview is open  -> back to the 8 apps
  //  - just the 8 apps are shown -> hang up, back to the ringing phone
  //  - phone not answered yet    -> Line.png isn't showing, so this
  //                                 listener steps aside and the
  //                                 site-wide Escape-to-home shortcut runs
  // Capture phase + stopPropagation so this runs before, and blocks,
  // the site-wide Escape-to-home listener whenever it applies.
  var designsSection = document.getElementById('designs');
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (!designsSection || !designsSection.classList.contains('active')) return;
    if (!linePanel.classList.contains('is-active')) return; // Line.png not showing — let global Escape handle it

    if (lineContent.classList.contains('is-visible')) {
      backToApps();
    } else {
      resetDesignsScene(); // just the apps grid showing — hang up, back to the ringing phone
    }
    event.preventDefault();
    event.stopPropagation();
  }, true);

  // ring again on every fresh visit to the Designs screen
  document.querySelectorAll('a[href="#designs"]').forEach(function (link) {
    link.addEventListener('click', resetDesignsScene);
  });
})();


// ===================================================
// Contact form: relayed via formsubmit.co, falling back to the
// visitor's own mail app if the relay can't be reached. Swap
// CONTACT_EMAIL for wherever you want messages to land.
// ===================================================
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var CONTACT_EMAIL = 'punay.stevenkenn.bscs2025@gmail.com';
  var status = document.getElementById('form-status');
  var btn = form.querySelector('.form-send');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());

    if (data._honey) return; // honeypot caught a bot

    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      status.textContent = 'Fill in all three fields first.';
      return;
    }

    btn.disabled = true;
    status.textContent = 'Sending…';

    fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        _subject: 'Portfolio message from ' + data.name
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        status.textContent = "Sent! I'll get back to you soon.";
        form.reset();
      })
      .catch(function () {
        // relay unreachable: open the visitor's own mail app instead
        status.textContent = "Couldn't reach the relay, opening your email app instead…";
        var subject = encodeURIComponent('Portfolio message from ' + data.name);
        var body = encodeURIComponent(data.message + '\n\nReply to: ' + data.email);
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
      })
      .finally(function () {
        btn.disabled = false;
      });
  });
})();


// ===================================================
// Screen navigation: the page no longer scrolls. Every
// section is a full-viewport "screen"; clicking a menu
// link (or the back button, or pressing Escape) swaps
// which one has .active, covered by a quick diagonal
// wipe so the swap itself is never visible.
// ===================================================
(function () {
  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var wipeEl = document.getElementById('wipe');
  var backBtn = document.querySelector('.back-to-top');
  var menuLinks = document.querySelectorAll('.nav-link');

  if (screens.length === 0) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var transitioning = false;

  // whichever screen already has .active in the HTML (the hero) is where we start
  var current = screens.filter(function (s) { return s.classList.contains('active'); })[0];
  var currentId = current ? current.id : 'top';
  document.body.dataset.screen = currentId;
  if (backBtn) backBtn.classList.toggle('is-visible', currentId !== 'top');

  function activateScreen(id) {
    screens.forEach(function (s) {
      s.classList.toggle('active', s.id === id);
    });
    currentId = id;
    document.body.dataset.screen = id;
    if (backBtn) backBtn.classList.toggle('is-visible', id !== 'top');
    // leaving Designs entirely (not just closing its preview) should
    // always clear this, so the global back-to-top button doesn't
    // stay hidden on other screens
    if (id !== 'designs') document.body.classList.remove('preview-open');
  }

  function goTo(id) {
    if (transitioning || id === currentId) return;
    var target = document.getElementById(id);
    if (!target || !target.classList.contains('screen')) return;

    if (reduceMotion || !wipeEl) {
      activateScreen(id);
      return;
    }

    transitioning = true;
    wipeEl.classList.remove('go');
    void wipeEl.offsetWidth; // restart the animation even on rapid clicks
    wipeEl.classList.add('go');

    // swap screens once the panes have fully covered the viewport
    setTimeout(function () { activateScreen(id); }, 340);
    // clean up once the panes have swept fully off-screen again
    setTimeout(function () {
      wipeEl.classList.remove('go');
      transitioning = false;
    }, 760);
  }

  menuLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      event.preventDefault();
      goTo(href.slice(1));
    });
  });

  // Escape always jumps back to the main menu
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') goTo('top');
  });
})();


// ===================================================
// Background parallax: every decorative background layer
// (the hero/about photo slabs, the Designs star backdrop,
// the Projects diagonal wash, and the dotted page texture)
// drifts a little in the OPPOSITE direction from the mouse,
// so the backdrop reads like it's sitting on its own plane
// behind the content. Eased with a lerp so it trails the
// cursor smoothly instead of snapping to it. The actual
// motion is applied in CSS via the --par-x/--par-y variables
// this sets on <html> — see the "BACKGROUND PARALLAX" block
// in styles.css. Skipped entirely for reduced-motion users.
// ===================================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;
  var REACH = 52; // total px of travel from edge-to-edge of the viewport
  var targetX = 0, targetY = 0, curX = 0, curY = 0;
  var ticking = false; // is the easing loop currently running?

  // Only the layer inside the currently-active screen actually needs to
  // keep recalculating every frame (see the matching CSS override in
  // styles.css) — but we still only want the loop itself running while
  // it's actually got somewhere left to ease toward, see below.
  function settled() {
    return Math.abs(targetX - curX) < 0.05 && Math.abs(targetY - curY) < 0.05;
  }

  function loop() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    root.style.setProperty('--par-x', curX.toFixed(2) + 'px');
    root.style.setProperty('--par-y', curY.toFixed(2) + 'px');

    if (settled()) {
      // snap to the exact target and stop — no more per-frame work
      // until the mouse moves again. This is the fix for the constant
      // background repaint/recalc that was happening even when the
      // cursor was sitting still.
      curX = targetX;
      curY = targetY;
      root.style.setProperty('--par-x', curX.toFixed(2) + 'px');
      root.style.setProperty('--par-y', curY.toFixed(2) + 'px');
      ticking = false;
      return;
    }
    requestAnimationFrame(loop);
  }

  function ensureLoopRunning() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(loop);
    }
  }

  document.addEventListener('mousemove', function (event) {
    // -0.5..0.5 across the viewport, then flipped so the
    // background eases the opposite way from the cursor
    var nx = (event.clientX / window.innerWidth) - 0.5;
    var ny = (event.clientY / window.innerHeight) - 0.5;
    targetX = -nx * REACH;
    targetY = -ny * REACH;
    ensureLoopRunning();
  }, { passive: true });
})();
