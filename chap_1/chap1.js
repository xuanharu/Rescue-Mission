/* ============================================
   RESCUE MISSION - CHAPTER 1 GAME LOGIC
   ============================================ */

// ============================
// STATE
// ============================
let currentIndex = 0;
let chapterData = [];
let isAnimating = false;

// ============================
// DOM REFERENCES
// ============================
const storyBackground = document.getElementById('storyBackground');
const characterLayer = document.getElementById('characterLayer');
const dialogueBox = document.getElementById('dialogueBox');
const speakerName = document.getElementById('speakerName');
const speakerPortrait = document.getElementById('speakerPortrait');
const dialogueText = document.getElementById('dialogueText');
const previousBtn = document.getElementById('previousBtn');
const nextBtn = document.getElementById('nextBtn');
const coinValue = document.getElementById('coinValue');
const closeBtn = document.getElementById('closeBtn');
const saveBtn = document.getElementById('saveBtn');
const homeBtn = document.getElementById('homeBtn');

// ============================
// INITIALIZATION
// ============================
function init() {
  if (typeof chapter1 === 'undefined') {
    console.error('chapter1 data not found. Make sure chap1_script.js is loaded before chap1.js');
    return;
  }

  chapterData = chapter1;
  currentIndex = 0;

  // Set coin value
  coinValue.textContent = '100';

  // Load first dialogue
  renderDialogue(currentIndex);

  // Bind events
  bindEvents();
}

// ============================
// RENDER FUNCTIONS
// ============================
function renderDialogue(index) {
  if (isAnimating) return;
  isAnimating = true;

  const data = chapterData[index];
  if (!data) {
    isAnimating = false;
    return;
  }

  // Update dialogue box type class
  dialogueBox.className = 'dialogue-box ' + (data.type || 'speech');

  // Update speaker
  if (data.speaker && data.type !== 'narration') {
    speakerName.textContent = data.speaker;
    speakerName.style.display = 'block';
  } else {
    speakerName.style.display = 'none';
  }

  // Update dialogue text
  dialogueText.textContent = data.text;

  // Update portrait (hide for narration)
  if (data.type === 'narration' || !data.speaker) {
    speakerPortrait.style.display = 'none';
  } else {
    speakerPortrait.style.display = 'block';
    // Portrait could be linked to character images here
    speakerPortrait.src = '';
  }

  // Render background with fade
  renderBackground(data.background);

  // Render characters
  renderCharacters(data.characters, data.animation);

  // Update button states
  updateButtonStates();

  // Reset animation lock after transition
  setTimeout(() => {
    isAnimating = false;
  }, 500);
}

function renderBackground(bgPath) {
  if (!bgPath) return;

  // Fade out
  storyBackground.classList.add('fade-out');

  setTimeout(() => {
    storyBackground.src = bgPath;
    storyBackground.onload = () => {
      storyBackground.classList.remove('fade-out');
    };
  }, 400);
}

function renderCharacters(characters, animation) {
  characterLayer.innerHTML = '';

  if (!characters || characters.length === 0) return;

  characters.forEach((char, i) => {
    const img = document.createElement('img');
    img.src = char.image;
    img.alt = 'Character';
    img.className = 'character ' + (char.position || 'center');

    // Apply animation class if specified
    if (animation) {
      img.classList.add('anim-' + animation);
    } else {
      img.classList.add('anim-idle');
    }

    // Stagger character entrance
    img.style.opacity = '0';
    img.style.animationDelay = (i * 0.15) + 's';

    characterLayer.appendChild(img);

    // Trigger entrance animation
    setTimeout(() => {
      img.style.opacity = '1';
    }, 50);
  });
}

function updateButtonStates() {
  previousBtn.disabled = currentIndex <= 0;
  nextBtn.disabled = currentIndex >= chapterData.length - 1;
}

// ============================
// NAVIGATION
// ============================
function goNext() {
  if (currentIndex < chapterData.length - 1) {
    currentIndex++;
    renderDialogue(currentIndex);
  }
}

function goPrevious() {
  if (currentIndex > 0) {
    currentIndex--;
    renderDialogue(currentIndex);
  }
}

// ============================
// EVENT BINDING
// ============================
function bindEvents() {
  // Next button
  nextBtn.addEventListener('click', goNext);

  // Previous button
  previousBtn.addEventListener('click', goPrevious);

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      goNext();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      goPrevious();
    }
  });

  // Click dialogue box to advance
  dialogueBox.addEventListener('click', (e) => {
    // Prevent triggering if user is selecting text
    if (window.getSelection && window.getSelection().toString().length === 0) {
      goNext();
    }
  });

  // Navigation buttons
  closeBtn.addEventListener('click', () => {
    console.log('Close');
  });

  saveBtn.addEventListener('click', () => {
    console.log('Save');
  });

  homeBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}

// ============================
// START
// ============================
document.addEventListener('DOMContentLoaded', init);
