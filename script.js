/* =============================================
   ANNIVERSARY WEBSITE — script.js
   Features: Particles, Live Timer, Audio, Scroll Reveal
   ============================================= */

// =============================================
// 1. FALLING PETALS / PARTICLES (Canvas)
// =============================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const EMOJIS  = ['🌸', '🌹', '💕', '❤️', '💗', '🌺', '✨', '💖'];
  const COUNT   = 30;

  function createParticle() {
    return {
      x:        Math.random() * canvas.width,
      y:        -30,
      emoji:    EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      size:     14 + Math.random() * 18,
      speedY:   0.5 + Math.random() * 1.2,
      speedX:   (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      opacity:  0.6 + Math.random() * 0.4,
      wobble:   Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.02,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height; // start spread
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.y        += p.speedY;
      p.wobble   += p.wobbleSpeed;
      p.x        += p.speedX + Math.sin(p.wobble) * 0.5;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font        = `${p.size}px serif`;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
      ctx.restore();

      if (p.y > canvas.height + 40) {
        particles[i] = createParticle();
      }
    });
    animId = requestAnimationFrame(animate);
  }

  animate();
})();

// =============================================
// 2. LIVE ANNIVERSARY COUNTER
// =============================================
(function initCounter() {
  const startDate = new Date('2024-06-27T00:00:00');

  function update() {
    const now   = new Date();
    const diff  = now - startDate; // ms

    const totalSecs  = Math.floor(diff / 1000);
    const totalMins  = Math.floor(diff / 60000);
    const totalHours = Math.floor(diff / 3600000);
    const totalDays  = Math.floor(diff / 86400000);

    const secs  = totalSecs  % 60;
    const mins  = totalMins  % 60;
    const hours = totalHours % 24;

    const el = (id) => document.getElementById(id);

    if (el('days-count'))  el('days-count').textContent  = totalDays.toLocaleString();
    if (el('hours-count')) el('hours-count').textContent = hours;
    if (el('mins-count'))  el('mins-count').textContent  = String(mins).padStart(2, '0');
    if (el('secs-count'))  el('secs-count').textContent  = String(secs).padStart(2, '0');

    // Fun facts update
    if (el('hugs-count'))  el('hugs-count').textContent  = Math.floor(totalHours * 0.8).toLocaleString();
    if (el('msgs-count'))  el('msgs-count').textContent  = (Math.floor(totalDays * 70) + 50000).toLocaleString();
  }

  update();
  setInterval(update, 1000);
})();

// =============================================
// 3. SCROLL REVEAL ANIMATION
// =============================================
(function initScrollReveal() {
  // Reveal hero elements immediately
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
  }, 200);

  // Observe other elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  // Add reveal class to section content elements
  const targets = document.querySelectorAll(
    '.counter-card, .timeline-card, .promise-card, .letter-card, .final-message, .fun-fact'
  );

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  // Intersection callback for these elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => revealObserver.observe(el));
})();

// =============================================
// 4. NAV DOTS — Active State on Scroll
// =============================================
(function initNavDots() {
  const sections = document.querySelectorAll('.section');
  const dots     = document.querySelectorAll('.nav-dot');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(dot => {
          dot.classList.toggle('active', dot.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
})();

// =============================================
// 5. AUDIO — Romantic Melody (Web Audio API)
// =============================================
(function initAudio() {
  const btn = document.getElementById('audio-btn');
  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let scheduledNodes = [];

  // Romantic melody notes (frequency in Hz)
  // "Can't Help Falling in Love" style gentle progression
  const melody = [
    // Verse 1
    { f: 261.63, d: 0.5 }, // C4
    { f: 293.66, d: 0.5 }, // D4
    { f: 329.63, d: 0.5 }, // E4
    { f: 392.00, d: 0.5 }, // G4
    { f: 349.23, d: 0.5 }, // F4
    { f: 329.63, d: 0.5 }, // E4
    { f: 293.66, d: 1.0 }, // D4
    { f: 0,      d: 0.5 }, // rest
    { f: 261.63, d: 0.5 }, // C4
    { f: 293.66, d: 0.5 }, // D4
    { f: 329.63, d: 0.5 }, // E4
    { f: 392.00, d: 0.5 }, // G4
    { f: 440.00, d: 0.5 }, // A4
    { f: 392.00, d: 0.5 }, // G4
    { f: 349.23, d: 1.5 }, // F4
    { f: 0,      d: 0.5 }, // rest
    // Verse 2
    { f: 329.63, d: 0.5 }, // E4
    { f: 349.23, d: 0.5 }, // F4
    { f: 392.00, d: 0.5 }, // G4
    { f: 440.00, d: 0.5 }, // A4
    { f: 493.88, d: 0.5 }, // B4
    { f: 523.25, d: 0.5 }, // C5
    { f: 493.88, d: 1.0 }, // B4
    { f: 0,      d: 0.5 }, // rest
    { f: 440.00, d: 0.5 }, // A4
    { f: 392.00, d: 0.5 }, // G4
    { f: 349.23, d: 0.5 }, // F4
    { f: 329.63, d: 0.5 }, // E4
    { f: 293.66, d: 0.5 }, // D4
    { f: 261.63, d: 2.0 }, // C4
    { f: 0,      d: 1.0 }, // long rest
  ];

  function playNote(ctx, freq, startTime, duration, gainNode) {
    if (freq === 0) return null;
    const osc  = ctx.createOscillator();
    const env  = ctx.createGain();

    osc.type      = 'sine';
    osc.frequency.value = freq;

    const attack  = 0.05;
    const release = 0.15;

    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(0.25, startTime + attack);
    env.gain.setValueAtTime(0.25, startTime + duration - release);
    env.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(env);
    env.connect(gainNode);
    osc.start(startTime);
    osc.stop(startTime + duration);
    scheduledNodes.push(osc);
    return osc;
  }

  function scheduleMelody(ctx, gainNode, startOffset = 0) {
    let time = ctx.currentTime + 0.1 + startOffset;
    const totalDuration = melody.reduce((acc, n) => acc + n.d, 0);

    melody.forEach(note => {
      playNote(ctx, note.f, time, note.d * 0.55, gainNode);
      time += note.d * 0.55;
    });

    // Schedule repeat
    return setTimeout(() => {
      if (isPlaying) scheduleMelody(ctx, gainNode);
    }, (time - ctx.currentTime) * 1000 - 200);
  }

  let loopTimer = null;

  function startMusic() {
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioCtx.destination);

    // Fade in
    masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.5);

    isPlaying = true;
    loopTimer = scheduleMelody(audioCtx, masterGain);

    btn.querySelector('.audio-label').textContent = 'Pause';
    btn.querySelector('.audio-icon').textContent  = '♪';
  }

  function stopMusic() {
    if (!audioCtx) return;
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);

    clearTimeout(loopTimer);
    isPlaying = false;

    setTimeout(() => {
      scheduledNodes.forEach(n => { try { n.stop(); } catch(e) {} });
      scheduledNodes = [];
      audioCtx.close();
      audioCtx = null;
    }, 900);

    btn.querySelector('.audio-label').textContent = 'Musik';
    btn.querySelector('.audio-icon').textContent  = '♫';
  }

  btn.addEventListener('click', () => {
    if (!isPlaying) startMusic();
    else stopMusic();
  });
})();

// =============================================
// 6. HEARTBEAT CURSOR TRAIL
// =============================================
(function initCursorTrail() {
  const trail = [];
  const maxTrail = 8;

  document.addEventListener('mousemove', (e) => {
    const heart = document.createElement('div');
    heart.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      pointer-events: none;
      font-size: ${10 + Math.random() * 10}px;
      z-index: 9999;
      user-select: none;
      transform: translate(-50%, -50%);
      animation: heart-fade 0.8s ease forwards;
    `;
    heart.textContent = ['❤️','💕','🌸','✨'][Math.floor(Math.random() * 4)];
    document.body.appendChild(heart);
    trail.push(heart);

    if (trail.length > maxTrail) {
      const old = trail.shift();
      old.remove();
    }

    setTimeout(() => { heart.remove(); }, 800);
  });

  // Add keyframe for cursor trail
  const style = document.createElement('style');
  style.textContent = `
    @keyframes heart-fade {
      0%   { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0;   transform: translate(-50%, -160%) scale(0.4); }
    }
  `;
  document.head.appendChild(style);
})();
