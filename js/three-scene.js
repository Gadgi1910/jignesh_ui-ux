function initThreeScene() {
  const host = document.querySelector('.hero-art');
  if (!host || !window.THREE || !Portfolio.motion) return;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: 'low-power' });
  } catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);
  host.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
  camera.position.z = 5.8;
  const geometry = new THREE.TorusKnotGeometry(.82, .23, mobile ? 72 : 120, mobile ? 7 : 10, 2, 3);
  const material = new THREE.MeshBasicMaterial({ color: 0x53564c, wireframe: true, transparent: true, opacity: .38 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.set(.4, -.3, -.3);
  scene.add(mesh);
  const dotGeometry = new THREE.BufferGeometry();
  const points = [];
  const count = mobile ? 12 : 24;
  for (let i = 0; i < count; i++) {
    const theta = i / count * Math.PI * 2;
    points.push(Math.cos(theta) * 1.45, Math.sin(theta) * 1.2, Math.sin(theta * 3) * .3);
  }
  dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  const dotMaterial = new THREE.PointsMaterial({ color: 0x56784c, size: .026, transparent: true, opacity: .55 });
  const particles = new THREE.Points(dotGeometry, dotMaterial);
  scene.add(particles);
  const mouse = { x: 0, y: 0 }, smooth = { x: 0, y: 0 };
  let velocity = 0, lastScroll = scrollY, lastScrollTime = performance.now();
  const onMouse = event => { mouse.x = event.clientX / innerWidth - .5; mouse.y = event.clientY / innerHeight - .5; };
  const onScroll = () => { const now = performance.now(); velocity = Math.min(Math.abs(scrollY - lastScroll) / Math.max(now - lastScrollTime, 1), 5); lastScroll = scrollY; lastScrollTime = now; };
  const resize = () => { const { width, height } = host.getBoundingClientRect(); if (!width || !height) return; renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  if (!mobile) window.addEventListener('pointermove', onMouse, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  let raf = 0, visible = true, disposed = false, previous = 0, elapsed = 0;
  function render(now) {
    raf = 0;
    if (!visible || document.hidden || disposed) return;
    const delta = previous ? Math.min((now - previous) / 1000, .05) : .016;
    previous = now;
    elapsed += delta;
    const lerp = 1 - Math.exp(-delta * 3);
    smooth.x += (mouse.x - smooth.x) * lerp;
    smooth.y += (mouse.y - smooth.y) * lerp;
    velocity *= Math.exp(-delta * 4);
    mesh.rotation.y = elapsed * .09 + smooth.x * .4;
    mesh.rotation.x = .4 + smooth.y * .3;
    mesh.rotation.z = -.3 + Math.sin(elapsed * .2) * .08;
    mesh.scale.set(1 + velocity * .018, 1 - velocity * .009, 1);
    mesh.position.y = Math.sin(elapsed * .55) * .045;
    particles.rotation.z = -elapsed * .018;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
  }
  const start = () => { if (!raf && !disposed && visible && !document.hidden) { previous = 0; raf = requestAnimationFrame(render); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) start(); else stop(); });
  intersection.observe(host);
  const visibility = () => document.hidden ? stop() : start();
  document.addEventListener('visibilitychange', visibility);
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const preferenceChanged = event => { if (event.matches) cleanup(); };
  preference.addEventListener('change', preferenceChanged);
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); cleanup(); });
  function cleanup() {
    if (disposed) return;
    disposed = true; stop(); observer.disconnect(); intersection.disconnect();
    window.removeEventListener('pointermove', onMouse); window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', visibility);
    preference.removeEventListener('change', preferenceChanged);
    geometry.dispose(); material.dispose(); dotGeometry.dispose(); dotMaterial.dispose(); renderer.dispose();
    renderer.domElement.remove(); host.classList.remove('ready');
  }
  window.addEventListener('pagehide', event => { if (event.persisted) stop(); else cleanup(); });
  window.addEventListener('pageshow', event => { if (event.persisted) start(); });
  resize(); start(); host.classList.add('ready');
  Portfolio.cleanups.push(cleanup);
}
