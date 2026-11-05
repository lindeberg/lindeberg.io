(() => {
  const canvas = document.getElementById("toy");
  const ctx = canvas.getContext("2d");
  const MAX = 1500;
  const PULL = 16; // circular orbit speed is sqrt(PULL) px per frame at any radius
  const SOFTENING = 400;
  const SWALLOW_RADIUS = 10;
  const pointer = { x: 0, y: 0, down: false, moved: false };
  const particles = [];
  let width;
  let height;
  let hue = 30;
  let last = performance.now();

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!pointer.moved) {
      pointer.x = width / 2;
      pointer.y = height / 2;
    }
  }

  // Place a particle on a random ring around the hole, moving sideways so it orbits.
  function orbitParticle(particle) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * Math.min(width, height) * 0.4;
    const speed = Math.sqrt(PULL) * (0.6 + Math.random() * 0.8);
    particle.x = pointer.x + Math.cos(angle) * radius;
    particle.y = pointer.y + Math.sin(angle) * radius;
    particle.px = particle.x;
    particle.py = particle.y;
    particle.vx = -Math.sin(angle) * speed;
    particle.vy = Math.cos(angle) * speed;
    particle.hue = hue + Math.random() * 60;
    return particle;
  }

  function burst(count) {
    for (let i = 0; i < count; i++) {
      particles.push(orbitParticle({}));
      if (particles.length > MAX) particles.shift();
    }
  }

  function step(now) {
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    const pull = pointer.down ? PULL * 3 : PULL;

    if (pointer.down) burst(4);

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1.5;
    for (const p of particles) {
      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < SWALLOW_RADIUS * SWALLOW_RADIUS) {
        orbitParticle(p);
        continue;
      }
      const accel = pull / (distSq + SOFTENING);
      p.px = p.x;
      p.py = p.y;
      p.vx += dx * accel * dt;
      p.vy += dy * accel * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      ctx.strokeStyle = `hsl(${p.hue} 100% 60%)`;
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, pointer.down ? 13 : 9, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.strokeStyle = "rgba(254, 218, 74, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();

    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  canvas.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.moved = true;
  });
  canvas.addEventListener("pointerdown", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.moved = true;
    pointer.down = true;
    hue = (hue + 47) % 360;
    burst(40);
    document.body.classList.add("played");
  });
  const release = () => {
    pointer.down = false;
  };
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);

  resize();
  burst(200);
  requestAnimationFrame(step);
})();
