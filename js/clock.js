function initLocationClock() {
  const clocks = document.querySelectorAll('[data-location-clock]');
  if (!clocks.length) return;
  const { location, timeZone } = window.PortfolioData.site;
  let formatter;
  try { formatter = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); }
  catch { formatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); }
  let timer;
  function update() {
    clearTimeout(timer);
    const now = new Date();
    clocks.forEach(clock => {
      const time = clock.querySelector('time');
      time.textContent = formatter.format(now);
      time.dateTime = now.toISOString();
      clock.querySelector('[data-location]').textContent = location;
    });
    if (!document.hidden) timer = setTimeout(update, 60000 - Date.now() % 60000 + 20);
  }
  update();
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else update(); });
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', update);
}
