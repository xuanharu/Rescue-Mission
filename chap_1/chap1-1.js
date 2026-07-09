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
let choiceActive = false;

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
const closeBtn = document.getElementById('closeBtn');
const saveBtn = document.getElementById('saveBtn');
const homeBtn = document.getElementById('homeBtn');

// ============================
// INITIALIZATION
// ============================
function init() {
    if (typeof chapter1 === 'undefined') {
        console.error('chapter1 data not found. Make sure chap1-1_script.js is loaded before chap1-1.js');
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

    // Branch / Choice buttons
    if (data.choices && data.choices.length) {
        choiceActive = true;
        branchBtn.style.display = 'none';
        nextBtn.disabled = true;
        previousBtn.disabled = true;
        renderChoices(data.choices);
    } else if (data.branch) {
        choiceActive = false;
        branchBtn.style.display = 'inline-block';
        nextBtn.disabled = true;
        branchBtn.onclick = () => {
            window.location.href = data.branch;
        };
    } else {
        choiceActive = false;
        branchBtn.style.display = 'none';
        clearChoices();
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

function renderChoices(choices) {
    const container = document.getElementById('choicesContainer');
    if (!container) return;

    container.innerHTML = '';
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';
        btn.textContent = choice.label;
        btn.addEventListener('click', () => {
            choiceActive = false;
            clearChoices();
            goNext();
        });
        container.appendChild(btn);
    });
}

function clearChoices() {
    const container = document.getElementById('choicesContainer');
    if (container) container.innerHTML = '';
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
        // Prevent triggering if a choice is pending or user is selecting text
        if (choiceActive) return;
        if (window.getSelection && window.getSelection().toString().length === 0) {
            goNext();
        }
    });

    // Navigation buttons
    closeBtn.addEventListener('click', () => {
        console.log('Close');
    });

    saveBtn.addEventListener('click', saveGame);

    homeBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
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

    save.current = 'chap_1/chap1-1.html';
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
    const original = saveBtn.textContent;
    saveBtn.textContent = 'Đã lưu ✓';
    setTimeout(() => {
        saveBtn.textContent = original;
    }, 1500);
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
