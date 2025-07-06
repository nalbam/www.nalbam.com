// Clock widget functionality
document.addEventListener('DOMContentLoaded', function() {
  const clockWidget = document.getElementById('clock-widget');

  function updateClock() {
    const now = new Date();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    const dateString = `${year}-${month}-${day}`;

    document.getElementById('clock-time').textContent = timeString;
    document.getElementById('clock-date').textContent = dateString;
  }

  // Update clock visibility based on profile visibility
  function updateClockVisibility() {
    const profileBox = document.getElementById('profile-box');
    const isProfileVisible = profileBox.style.display !== 'none';
    const profileOpacity = parseFloat(profileBox.style.opacity) || 1;

    // Show clock when profile is hidden or fully transparent, hide clock when profile is visible and opaque
    const shouldShowClock = !isProfileVisible || profileOpacity <= 0.1;
    clockWidget.style.display = shouldShowClock ? 'block' : 'none';
  }

  // Watch for profile visibility changes (both display and opacity)
  const profileBox = document.getElementById('profile-box');
  const observer = new MutationObserver(updateClockVisibility);
  observer.observe(profileBox, { attributes: true, attributeFilter: ['style'] });

  // Initial setup
  updateClock();
  updateClockVisibility();
  setInterval(updateClock, 1000);
});
