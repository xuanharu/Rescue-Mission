/* ============================================
   RESCUE MISSION - CHAPTER 0 LOGIC
   Character selection + localStorage
   ============================================ */

const STORAGE_KEY = 'rescueMission_save';

let selectedCharacter = null;

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initSelection();
    initSave();
    initModal();
    initNavigation();
    initBackgroundMusic();
});

/* --- Background Music (autoplay, no UI) --- */

function initBackgroundMusic() {
    const music = document.getElementById('bgMusic');
    if (!music) return;

    const tryPlay = () => {
        music.play().catch(() => {});
    };

    tryPlay();

    // Fallback: start on first user interaction (browsers may block autoplay)
    ['click', 'keydown', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, tryPlay, { once: true });
    });
}

/* --- Navigation --- */

function initNavigation() {
    const pauseBtn = document.getElementById('pauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const homeBtn = document.getElementById('homeBtn');
    const chaptersBtn = document.getElementById('chaptersBtn');
    const pauseOverlay = document.getElementById('pauseOverlay');

    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    if (homeBtn) homeBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    if (chaptersBtn) chaptersBtn.addEventListener('click', openChapters);
    if (pauseOverlay) pauseOverlay.addEventListener('click', togglePause);
}

let isPaused = false;
let isMuted = false;

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
        pauseBtn.title = isPaused ? 'Play' : 'Pause';
    }
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (pauseOverlay) {
        pauseOverlay.style.display = isPaused ? 'flex' : 'none';
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');
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
        const raw = localStorage.getItem(STORAGE_KEY);
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
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

    document.getElementById('closeChaptersBtn').addEventListener('click', () => {
        overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

/* --- Background Stars --- */

function initStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;

    const starCount = 60;

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

/* --- Character Selection --- */

function initSelection() {
    const cards = document.querySelectorAll('.char-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-pressed', 'false');
            });
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
            selectedCharacter = card.dataset.character;
        });
    });
}

/* --- Save Flow --- */

function initSave() {
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.addEventListener('click', onSave);
}

function onSave() {
    const nameInput = document.getElementById('charName');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!selectedCharacter) {
        showModal('Vui lòng chọn một nhân vật trước khi lưu.', false);
        return;
    }
    if (!name) {
        showModal('Vui lòng nhập tên cho nhân vật của bạn.', false);
        return;
    }

    const genderLabel = selectedCharacter === 'male' ? 'Nam' : 'Nữ';
    showModal(`Bạn đã chọn nhân vật <span class="hl">${genderLabel}</span> với tên <span class="hl">${escapeHtml(name)}</span>. Xác nhận lưu?`, true, {
        character: selectedCharacter,
        name: name
    });
}

/* --- Confirmation Modal --- */

let pendingData = null;

function initModal() {
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (confirmBtn) confirmBtn.addEventListener('click', onConfirm);
}

function showModal(html, withConfirm, data) {
    const modal = document.getElementById('confirmModal');
    const text = document.getElementById('modalText');
    if (!modal || !text) return;

    text.innerHTML = html;
    pendingData = withConfirm ? data : null;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    pendingData = null;
}

function onConfirm() {
    if (!pendingData) {
        closeModal();
        return;
    }

    const save = loadSave() || {};
    save.character = pendingData.character;
    save.name = pendingData.name;
    save.current = 'chap_1/chap1.html';
    if (typeof save.money === 'undefined') save.money = 100;
    if (!Array.isArray(save.skill)) save.skill = [];

    // Unlock chapters
    if (!Array.isArray(save.unlockedChapters)) {
        save.unlockedChapters = ['chap0'];
    }
    if (!save.unlockedChapters.includes('chap0')) {
        save.unlockedChapters.push('chap0');
    }
    if (!save.unlockedChapters.includes('chap1')) {
        save.unlockedChapters.push('chap1');
    }
    save.currentChapter = 'chap1';

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch (e) {
        console.error('Failed to save character:', e);
    }

    const saved = pendingData;
    pendingData = null;
    closeModal();

    const genderLabel = saved.character === 'male' ? 'Nam' : 'Nữ';
    showModal(`Đã lưu! Nhân vật <span class="hl">${genderLabel}</span> - <span class="hl">${escapeHtml(saved.name)}</span> đã được ghi lại.`, false);

    setTimeout(() => {
        window.location.href = '../chap_1/chap1.html';
    }, 1200);
}

/* --- Helpers --- */

function loadSave() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
