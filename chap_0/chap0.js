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
