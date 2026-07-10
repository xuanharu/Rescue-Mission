/* ============================================
   RESCUE MISSION - CHAPTER 1 GAME LOGIC
   ============================================ */

// ============================
// STATE
// ============================
let currentIndex = 0;
let chapterData = [];
let isAnimating = false;
let playerGender = 'male';
let playerName = 'Main';

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
const branchBtn = document.getElementById('branchBtn');
const coinValue = document.getElementById('coinValue');
const pauseBtn = document.getElementById('pauseBtn');
const muteBtn = document.getElementById('muteBtn');
const chaptersBtn = document.getElementById('chaptersBtn');
const homeBtn = document.getElementById('homeBtn');
const pauseOverlay = document.getElementById('pauseOverlay');

// ============================
// INITIALIZATION
// ============================
function init() {
    if (typeof chapter1 === 'undefined') {
        console.error('chapter1 data not found. Make sure chap1_script.js is loaded before chap1.js');
        return;
    }

    const save = loadSave();
    if (save) {
        if (save.character === 'female') playerGender = 'female';
        if (save.name) playerName = save.name;
    }

    // Prepare chapter data: swap male character art for female players
    chapterData = prepareChapter(chapter1, playerGender);
    currentIndex = 0;

    // Set coin value
    coinValue.textContent = (save && typeof save.money === 'number') ? save.money : '100';

    // Unlock current chapter
    unlockChapter('chap1');

    // Load first dialogue
    renderDialogue(currentIndex);

    // Bind events
    bindEvents();
}

// Build a player-aware copy of the chapter data
function prepareChapter(data, gender) {
    if (gender !== 'female') return data;
    return data.map(step => ({
        ...step,
        characters: (step.characters || []).map(ch => ({
            ...ch,
            image: ch.image.replace('male_character', 'female_character')
        }))
    }));
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
        speakerName.textContent = (data.speaker === 'Main') ? playerName : data.speaker;
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
        let portrait = (typeof speakerPortraits !== 'undefined' && speakerPortraits[data.speaker]) ? speakerPortraits[data.speaker] : '';
        if (data.speaker === 'Main' && playerGender === 'female') {
            portrait = '../img/character/portrait_female_character.webp';
        }
        speakerPortrait.src = portrait;
    }

    // Render background with fade
    renderBackground(data.background);

    // Render characters
    renderCharacters(data.characters, data.animation);

    // Branch button
    if (data.branch) {
        branchBtn.style.display = 'inline-block';
        nextBtn.disabled = true;
        branchBtn.disabled = false;
        branchBtn.onclick = () => {
            window.location.href = data.branch;
        };
    } else {
        branchBtn.style.display = 'none';
        updateButtonStates();
    }

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
    pauseBtn.addEventListener('click', togglePause);

    if (pauseOverlay) {
        pauseOverlay.addEventListener('click', togglePause);
    }

    muteBtn.addEventListener('click', toggleMute);

    homeBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    if (chaptersBtn) {
        chaptersBtn.addEventListener('click', openChapters);
    }
}

// ============================
// SAVE GAME
// ============================
const SAVE_KEY = 'rescueMission_save';

function loadSave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function saveGame() {
    const save = loadSave() || {};

    save.current = 'chap_1/chap1.html';
    if (typeof save.money === 'undefined') save.money = 100;
    if (!Array.isArray(save.skill)) save.skill = [];

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
        showSaveFeedback();
    } catch (e) {
        console.error('Failed to save game:', e);
    }
}

function showSaveFeedback() {
    console.log('Game saved');
}

// ============================
// AUDIO & NAVIGATION
// ============================

let isPaused = false;
let isMuted = false;

function togglePause() {
    isPaused = !isPaused;
    if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
        pauseBtn.title = isPaused ? 'Play' : 'Pause';
    }
    if (pauseOverlay) {
        pauseOverlay.style.display = isPaused ? 'flex' : 'none';
    }
}

function toggleMute() {
    isMuted = !isMuted;
    if (muteBtn) {
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        muteBtn.title = isMuted ? 'Unmute' : 'Mute';
    }
    const music = document.getElementById('bgMusic');
    if (music) music.muted = isMuted;
}

const CHAPTERS = [
    { id: 'chap0', name: 'Chương 0: Mở đầu', path: '../chap_0/chap0.html', requires: [] },
    { id: 'chap1', name: 'Chương 1: Bắt đầu', path: '../chap_1/chap1.html', requires: ['chap0'] },
    { id: 'chap1-1', name: 'Chương 1-1: Hồi tưởng', path: '../chap_1/chap1-1.html', requires: ['chap1'] },
    { id: 'chap1-2', name: 'Chương 1-2: Chiến đấu', path: '../chap_1/chap1-2.html', requires: ['chap1-1'] }
];

function getUnlockedChapters() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        const save = raw ? JSON.parse(raw) : null;
        if (save && Array.isArray(save.unlockedChapters)) {
            return save.unlockedChapters;
        }
    } catch (e) {}
    return ['chap0'];
}

function unlockChapter(chapterId) {
    const save = loadSave() || {};
    if (!Array.isArray(save.unlockedChapters)) {
        save.unlockedChapters = ['chap0'];
    }
    if (!save.unlockedChapters.includes(chapterId)) {
        save.unlockedChapters.push(chapterId);
    }
    save.currentChapter = chapterId;
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) {
        console.error('Failed to save chapters:', e);
    }
}

function openChapters() {
    const unlocked = getUnlockedChapters();
    const existing = document.getElementById('chaptersOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'chaptersOverlay';
    overlay.className = 'chapters-overlay';
    overlay.innerHTML = `
        <div class="chapters-box">
            <h3 class="chapters-title">CHƯƠNG</h3>
            <div class="chapters-list">
                ${CHAPTERS.map(chap => {
                    const isUnlocked = chap.requires.every(req => unlocked.includes(req)) || unlocked.includes(chap.id);
                    const isCurrent = window.location.pathname.endsWith(chap.path.replace('../', ''));
                    return `
                        <button class="chapter-btn ${isCurrent ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}"
                                data-path="${chap.path}" ${!isUnlocked ? 'disabled' : ''}>
                            <span class="chapter-name">${chap.name}</span>
                            <span class="chapter-status">${isCurrent ? 'ĐANG CHƠI' : (isUnlocked ? 'ĐÃ MỞ' : '🔒')}</span>
                        </button>
                    `;
                }).join('')}
            </div>
            <button id="closeChaptersBtn" class="inventory-close-btn">ĐÓNG</button>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelectorAll('.chapter-btn:not(.locked)').forEach(btn => {
        btn.addEventListener('click', () => {
            const path = btn.dataset.path;
            const chapterId = CHAPTERS.find(c => c.path === path)?.id;
            if (chapterId) unlockChapter(chapterId);
            window.location.href = path;
        });
    });

    const closeBtn = document.getElementById('closeChaptersBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => overlay.remove());
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

// ============================
// START
// ============================
document.addEventListener('DOMContentLoaded', () => {
    init();
    initBackgroundMusic();
});

// ============================
// BACKGROUND MUSIC (autoplay, no UI)
// ============================
function initBackgroundMusic() {
    const music = document.getElementById('bgMusic');
    if (!music) return;

    const tryPlay = () => {
        music.play().catch(() => {});
    };

    tryPlay();

    ['click', 'keydown', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, tryPlay, { once: true });
    });
}