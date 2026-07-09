/* ============================================
   RESCUE MISSION - MAIN MENU SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initParticles();
  initButtons();
});

/* --- Background Effects --- */
function initStars() {
  const container = document.getElementById('starsContainer');
  if (!container) return;

  const starCount = 50;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const size = Math.random() * 2 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);

    container.appendChild(star);
  }
}

function initParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;

  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 3 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const moveX = (Math.random() - 0.5) * 100;
    const moveY = (Math.random() - 0.5) * 100;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.setProperty('--duration', `${duration}s`);
    particle.style.setProperty('--delay', `${delay}s`);
    particle.style.setProperty('--move-x', `${moveX}px`);
    particle.style.setProperty('--move-y', `${moveY}px`);

    container.appendChild(particle);
  }
}

/* --- Button Interactions --- */
function initButtons() {
  const buttons = document.querySelectorAll('.menu-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      handleButtonClick(action);
    });
  });
}

function handleButtonClick(action) {
  switch (action) {
    case 'start':
      console.log('Start Game');
      break;
    case 'save':
      console.log('Open Save Menu');
      break;
    case 'equipments':
      console.log('Open Equipment Menu');
      break;
    default:
      console.log('Unknown action:', action);
  }
}
