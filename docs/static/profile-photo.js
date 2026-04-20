(function () {
  const PHOTOS = [
    'static/profiles/nalbam-2025.png',
    'static/profiles/nalbam-2022.jpg',
    'static/profiles/nalbam-2020.jpg'
  ];
  const HALF_FLIP_MS = 300;

  const wrapper = document.querySelector('.profile-photo-wrapper');
  const img = document.querySelector('.profile-photo');
  if (!wrapper || !img) return;

  let index = Math.floor(Math.random() * PHOTOS.length);
  img.src = PHOTOS[index];

  let animating = false;

  function next() {
    if (animating) return;
    animating = true;
    wrapper.classList.add('flipping');

    setTimeout(() => {
      index = (index + 1) % PHOTOS.length;
      img.src = PHOTOS[index];
      wrapper.classList.remove('flipping');
    }, HALF_FLIP_MS);

    setTimeout(() => {
      animating = false;
    }, HALF_FLIP_MS * 2);
  }

  wrapper.addEventListener('click', next);
  wrapper.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      next();
    }
  });
})();
