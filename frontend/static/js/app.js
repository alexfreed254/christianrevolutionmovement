// ========================================
// CRM — Global Client Logic
// ========================================

// Mobile nav toggle
document.getElementById('mobileToggle')?.addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Auto-detect session from cookie → update nav
(function updateAuthUI() {
  const hasSession = document.cookie.includes('crm_session=');
  const loginBtn = document.getElementById('loginBtn');
  if (hasSession && loginBtn) {
    loginBtn.textContent = 'My Portal';
    loginBtn.href = '/portal';
  }
})();

// Animated stat counters
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Intersection observer for counters
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// Sunday service countdown
function updateCountdown() {
  const now = new Date();
  // Next Sunday 10:00 UTC
  const nextSunday = new Date(now);
  const daysUntilSunday = (7 - now.getUTCDay()) % 7 || 7;
  nextSunday.setUTCDate(now.getUTCDate() + daysUntilSunday);
  nextSunday.setUTCHours(10, 0, 0, 0);
  if (nextSunday < now) nextSunday.setUTCDate(nextSunday.getUTCDate() + 7);

  const diff = nextSunday - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const cdDays = document.getElementById('cd-days');
  if (cdDays) {
    cdDays.textContent = days;
    document.getElementById('cd-hours').textContent = hours;
    document.getElementById('cd-mins').textContent = mins;
    document.getElementById('cd-secs').textContent = secs;
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

// API helper with auth
window.crmAPI = async (url, options = {}) => {
  const token = document.cookie.split('crm_session=')[1]?.split(';')[0];
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
};

// PWA registration (if service worker exists)
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Auto-check-in on live page load (if authenticated)
if (window.location.pathname === '/live') {
  (async () => {
    try {
      const user = await crmAPI('/api/me');
      if (user) {
        await crmAPI('/api/attendance', {
          method: 'POST',
          body: JSON.stringify({ service_type: 'sunday', mode: 'online' })
        });
      }
    } catch (e) { /* not logged in */ }
  })();
}

console.log('%c✟ CHRIST REVOLUTION MOVEMENT', 'color: #8B7FC7; font-size: 20px; font-weight: bold;');
console.log('%cDisciple 2 Billion Souls by 2033', 'color: #a89dd8; font-size: 14px;');