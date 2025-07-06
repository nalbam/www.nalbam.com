// Profile toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('profile-toggle');
  const profileBox = document.getElementById('profile-box');
  const toggleIcon = toggleBtn.querySelector('i');

  let isProfileVisible = true; // Profile is visible by default
  let autoHideTimer = null;
  let randomPeekTimer = null;
  let lastInteractionTime = Date.now();
  let isManuallyHidden = false;

  // Auto-hide profile after 15 seconds of no interaction
  const AUTO_HIDE_DELAY = 15000;

  function updateToggleButton() {
    if (isProfileVisible) {
      profileBox.style.display = 'flex';
      profileBox.style.opacity = '0';
      profileBox.style.transform = 'scale(0.8)';
      setTimeout(() => {
        profileBox.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
        profileBox.style.opacity = '1';
        profileBox.style.transform = 'scale(1)';
      }, 10);
      toggleIcon.className = 'fa-solid fa-eye';
      toggleBtn.setAttribute('aria-label', 'Hide profile');
    } else {
      profileBox.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
      profileBox.style.opacity = '0';
      profileBox.style.transform = 'scale(0.8)';
      setTimeout(() => {
        profileBox.style.display = 'none';
      }, 600);
      toggleIcon.className = 'fa-solid fa-eye-slash';
      toggleBtn.setAttribute('aria-label', 'Show profile');
    }
  }

  function hideProfile() {
    if (isProfileVisible) {
      isProfileVisible = false;
      updateToggleButton();
    }
  }

  function showProfile() {
    if (!isProfileVisible) {
      isProfileVisible = true;
      updateToggleButton();
    }
  }

  function resetAutoHideTimer() {
    lastInteractionTime = Date.now();
    clearTimeout(autoHideTimer);

    // Only set auto-hide if profile is currently visible
    if (isProfileVisible) {
      autoHideTimer = setTimeout(() => {
        if (!isManuallyHidden) {
          hideProfile();
          startRandomPeek();
        }
      }, AUTO_HIDE_DELAY);
    }
  }

  function startRandomPeek() {
    function scheduleRandomPeek() {
      // Very random interval: 2-8 minutes
      const randomInterval = (120 + Math.random() * 360) * 1000;

      randomPeekTimer = setTimeout(() => {
        if (!isProfileVisible && !isManuallyHidden) {
          // Show profile for a brief moment (1-3 seconds)
          const peekDuration = 1000 + Math.random() * 2000;

          showProfile();

          setTimeout(() => {
            if (!isManuallyHidden) {
              hideProfile();
              scheduleRandomPeek(); // Schedule next random peek
            }
          }, peekDuration);
        } else {
          scheduleRandomPeek(); // Reschedule if conditions not met
        }
      }, randomInterval);
    }

    scheduleRandomPeek();
  }

  // Manual toggle button click
  toggleBtn.addEventListener('click', function() {
    isProfileVisible = !isProfileVisible;
    isManuallyHidden = !isProfileVisible;

    clearTimeout(autoHideTimer);
    clearTimeout(randomPeekTimer);

    updateToggleButton();

    if (isProfileVisible) {
      // If manually shown, reset auto-hide timer
      isManuallyHidden = false;
      resetAutoHideTimer();
    } else {
      // If manually hidden, start random peek
      startRandomPeek();
    }
  });

  // Track mouse movement and clicks to reset auto-hide timer
  document.addEventListener('mousemove', resetAutoHideTimer);
  document.addEventListener('click', resetAutoHideTimer);
  document.addEventListener('keydown', resetAutoHideTimer);

  // Initialize auto-hide timer
  resetAutoHideTimer();
});
