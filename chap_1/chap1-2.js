/* ============================================
   RESCUE MISSION - CHAPTER 1-2 BATTLE LOGIC
   ============================================ */

let playerGender = 'male';
let playerName = 'Main';
let battleActive = false;
let isPlayerTurn = true;
let canAct = false;

let player = {
    name: '',
    maxHP: 100,
    hp: 100,
    stamina: 50,
    maxStamina: 50,
    image: '',
    guarding: false,
    buffActive: false,
    buffMultiplier: 1,
    weapon: null,
    weaponBonus: 0,
    damageBonus: 0
};

let rival = {
    name: '',
    maxHP: 100,
    hp: 100,
    image: ''
};

let skills = [];
let currentCategory = 'defend';
let inventory = {
    weapons: [],
    items: []
};

const playerNameEl = document.getElementById('playerName');
const playerHPText = document.getElementById('playerHPText');
const playerHPBar = document.getElementById('playerHPBar');
const playerHPPercent = document.getElementById('playerHPPercent');
const rivalNameEl = document.getElementById('rivalName');
const rivalHPText = document.getElementById('rivalHPText');
const rivalHPBar = document.getElementById('rivalHPBar');
const rivalHPPercent = document.getElementById('rivalHPPercent');
const playerChar = document.getElementById('playerChar');
const rivalChar = document.getElementById('rivalChar');
const battleLog = document.getElementById('battleLog');
const damagePopup = document.getElementById('damagePopup');
const skillsContainer = document.getElementById('skillsContainer');
const skillTabs = document.getElementById('skillTabs');
const victoryOverlay = document.getElementById('victoryOverlay');
const defeatOverlay = document.getElementById('defeatOverlay');
const continueBtn = document.getElementById('continueBtn');
const retryBtn = document.getElementById('retryBtn');
const pauseBtn = document.getElementById('pauseBtn');
const muteBtn = document.getElementById('muteBtn');
const homeBtn = document.getElementById('homeBtn');
const coinValue = document.getElementById('coinValue');
const staminaValue = document.getElementById('staminaValue');
const weapon1Slot = document.getElementById('weapon1Slot');
const weapon2Slot = document.getElementById('weapon2Slot');
const buffItemSlot = document.getElementById('buffItemSlot');
const inventoryOverlay = document.getElementById('inventoryOverlay');
const inventoryList = document.getElementById('inventoryList');
const inventoryTitle = document.getElementById('inventoryTitle');
const closeInventoryBtn = document.getElementById('closeInventoryBtn');
const chaptersBtn = document.getElementById('chaptersBtn');
const chaptersOverlay = document.getElementById('chaptersOverlay');
const chaptersList = document.getElementById('chaptersList');
const closeChaptersBtn = document.getElementById('closeChaptersBtn');
const pauseOverlay = document.getElementById('pauseOverlay');

function init() {
    const save = loadSave();
    if (save) {
        if (save.character === 'female') playerGender = 'female';
        if (save.name) playerName = save.name;
    }

    if (typeof battleData === 'undefined') {
        console.error('battleData not found');
        return;
    }

    initBattle(save);
    bindEvents();
    startBattle();
}

function initBattle(save) {
    player.name = playerName;
    player.maxHP = battleData.playerStatus.maxHP;
    player.hp = battleData.playerStatus.maxHP;
    player.stamina = battleData.playerStatus.maxStamina;
    player.maxStamina = battleData.playerStatus.maxStamina;
    player.guarding = false;
    player.buffActive = false;
    player.buffMultiplier = 1;
    player.weapon = null;
    player.weaponBonus = 0;
    player.damageBonus = 0;
    player.image = playerGender === 'female'
        ? '../img/character/female_character_fighting_weapon.webp'
        : '../img/character/male_character_fighting_weapon.webp';

    rival.name = battleData.rival.name;
    rival.maxHP = battleData.rival.maxHP;
    rival.hp = battleData.rival.maxHP;
    rival.image = battleData.rival.image;

    skills = battleData.playerSkills.map(id => {
        if (typeof SkillDB !== 'undefined') {
            const skill = SkillDB.getById(id);
            if (skill) return { ...skill };
        }
        return null;
    }).filter(Boolean);
    currentCategory = 'defend';

    // Load inventory
    inventory.weapons = (battleData.character && battleData.character.weapons) ? [...battleData.character.weapons] : [];
    inventory.items = (battleData.character && battleData.character.items) ? [...battleData.character.items] : [];

    // Update equipment slots
    updateEquipmentSlots();

    // Unlock current chapter
    unlockChapter('chap1-2');

    coinValue.textContent = (save && typeof save.money === 'number') ? save.money : '100';

    playerNameEl.textContent = player.name;
    rivalNameEl.textContent = rival.name;
    playerChar.src = player.image;
    rivalChar.src = rival.image;

    if (battleData.background) {
        document.getElementById('battleBg').src = battleData.background;
    }
    if (battleData.music) {
        const music = document.getElementById('bgMusic');
        if (music) {
            music.src = battleData.music;
            music.play().catch(() => {});
        }
    }

    updateHPBars();
    updateStaminaDisplay();
    renderSkills(currentCategory);
}

function startBattle() {
    battleActive = true;
    isPlayerTurn = true;
    canAct = true;

    showBattleLog(battleData.messages.turnStart.replace('{name}', player.name));
    showTurnIndicator(player.name);
    updateStaminaDisplay();
    enableSkills(true);
}

function bindEvents() {
    pauseBtn.addEventListener('click', togglePause);

    if (pauseOverlay) {
        pauseOverlay.addEventListener('click', togglePause);
    }

    muteBtn.addEventListener('click', toggleMute);

    homeBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    // Chapters button
    if (chaptersBtn) {
        chaptersBtn.addEventListener('click', () => {
            openChapters();
        });
    }

    if (closeChaptersBtn) {
        closeChaptersBtn.addEventListener('click', closeChapters);
    }

    if (chaptersOverlay) {
        chaptersOverlay.addEventListener('click', (e) => {
            if (e.target === chaptersOverlay) closeChapters();
        });
    }

    continueBtn.addEventListener('click', () => {
        window.location.href = '../chap_1/chap1.html';
    });

    retryBtn.addEventListener('click', () => {
        victoryOverlay.style.display = 'none';
        defeatOverlay.style.display = 'none';
        initBattle(loadSave());
        startBattle();
    });

    // Equipment slot clicks
    if (weapon1Slot) weapon1Slot.addEventListener('click', () => openInventory('weapon', 0));
    if (weapon2Slot) weapon2Slot.addEventListener('click', () => openInventory('weapon', 1));
    if (buffItemSlot) buffItemSlot.addEventListener('click', () => openInventory('item', 0));

    // Close inventory
    if (closeInventoryBtn) {
        closeInventoryBtn.addEventListener('click', closeInventory);
    }

    // Close inventory on overlay click
    if (inventoryOverlay) {
        inventoryOverlay.addEventListener('click', (e) => {
            if (e.target === inventoryOverlay) closeInventory();
        });
    }

    if (skillTabs) {
        skillTabs.addEventListener('click', (e) => {
            if (!e.target.classList.contains('skill-tab')) return;
            skillTabs.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            renderSkills(category);
        });
    }
}

function renderSkills(category = 'defend') {
    skillsContainer.innerHTML = '';
    const filtered = skills.filter(s => s.category === category);

    filtered.forEach((skill) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'skill-btn';
        btn.dataset.index = skills.indexOf(skill);

        const costBadge = skill.cost > 0 ? `<span class="skill-cost-badge">-${skill.cost}</span>` : '';
        const imageHtml = skill.image ? `<img class="skill-icon" src="${skill.image}" alt="${skill.name}">` : '<div class="skill-icon" style="background:rgba(76,200,255,0.1);border-radius:50%;"></div>';

        btn.innerHTML = `
            ${imageHtml}
            <div class="skill-info">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-desc">${skill.desc}</div>
            </div>
            ${costBadge}
        `;

        btn.addEventListener('click', () => useSkill(skills.indexOf(skill)));
        skillsContainer.appendChild(btn);
    });

    enableSkills(true);
}

function useSkill(index) {
    if (!canAct || !battleActive || !isPlayerTurn) return;

    const skill = skills[index];
    if (player.stamina < skill.cost) {
        showBattleLog('Không đủ stamina!');
        return;
    }

    canAct = false;
    enableSkills(false);
    player.stamina -= skill.cost;
    updateStaminaDisplay();

    showBattleLog(battleData.messages.skillUsed
        .replace('{player}', player.name)
        .replace('{skill}', skill.name));

    const logs = SkillDB.activate(skill, player, rival);

    if (skill.type === 'attack') {
        animateAttack('player');
        setTimeout(() => {
            animateHit('rival');
            processBattleLogs(logs);
            checkBattleEnd();
        }, 300);

        setTimeout(() => {
            if (battleActive && !checkBattleEnd()) {
                rivalTurn();
            }
        }, 1200);

    } else if (skill.type === 'heal') {
        animateHeal('player');
        setTimeout(() => {
            processBattleLogs(logs);
        }, 300);

        setTimeout(() => {
            if (battleActive) {
                rivalTurn();
            }
        }, 1200);

    } else if (skill.type === 'guard') {
        animateHeal('player');
        processBattleLogs(logs);
        showBattleLog(battleData.messages.playerGuard[Math.floor(Math.random() * battleData.messages.playerGuard.length)]
            .replace('{player}', player.name));

        setTimeout(() => {
            if (battleActive) {
                rivalTurn();
            }
        }, 1200);

    } else if (skill.type === 'buff') {
        animateHeal('player');
        processBattleLogs(logs);

        setTimeout(() => {
            if (battleActive) {
                rivalTurn();
            }
        }, 1200);
    }
}

function rivalTurn() {
    if (!battleActive) return;

    isPlayerTurn = false;
    showTurnIndicator(rival.name);

    setTimeout(() => {
        let damage = randomRange(battleData.rival.attack - 2, battleData.rival.attack + 3);
        if (player.guarding) {
            damage = Math.floor(damage * 0.5);
            player.guarding = false;
        }
        player.hp = Math.max(0, player.hp - damage);

        animateAttack('rival');
        setTimeout(() => {
            animateHit('player');
            showDamage(damage, 'player');
            updateHPBars();
            checkBattleEnd();
        }, 300);

        setTimeout(() => {
            if (battleActive && !checkBattleEnd()) {
                isPlayerTurn = true;
                canAct = true;
                player.stamina = Math.min(player.maxStamina, player.stamina + 10);
                updateHPBars();
                updateStaminaDisplay();
                renderSkills(currentCategory);
                enableSkills(true);
                showTurnIndicator(player.name);
            }
        }, 1200);
    }, 600);
}

function checkBattleEnd() {
    if (rival.hp <= 0) {
        battleActive = false;
        rival.hp = 0;
        updateHPBars();
        setTimeout(() => {
            victoryOverlay.style.display = 'flex';
            showBattleLog(battleData.messages.victory);
        }, 500);
        return true;
    }

    if (player.hp <= 0) {
        battleActive = false;
        player.hp = 0;
        updateHPBars();
        setTimeout(() => {
            defeatOverlay.style.display = 'flex';
            showBattleLog(battleData.messages.defeat);
        }, 500);
        return true;
    }

    return false;
}

function updateHPBars() {
    const playerPercent = Math.round((player.hp / player.maxHP) * 100);
    const rivalPercent = Math.round((rival.hp / rival.maxHP) * 100);

    playerHPBar.style.width = playerPercent + '%';
    rivalHPBar.style.width = rivalPercent + '%';

    playerHPText.textContent = `${player.hp}/${player.maxHP}`;
    rivalHPText.textContent = `${rival.hp}/${rival.maxHP}`;

    if (playerHPPercent) playerHPPercent.textContent = playerPercent + '%';
    if (rivalHPPercent) rivalHPPercent.textContent = rivalPercent + '%';

    playerHPBar.classList.toggle('low', playerPercent <= 30);
    rivalHPBar.classList.toggle('low', rivalPercent <= 30);
}

function updateStaminaDisplay() {
    if (staminaValue) {
        staminaValue.textContent = `${player.stamina}/${player.maxStamina}`;
    }
}

function enableSkills(enabled) {
    const btns = skillsContainer.querySelectorAll('.skill-btn');
    btns.forEach((btn) => {
        const index = parseInt(btn.dataset.index, 10);
        const skill = skills[index];
        if (!skill) return;
        let cost = skill.cost;
        if (player.staminaCostReduction) {
            cost = Math.floor(cost * (1 - player.staminaCostReduction));
        }
        btn.disabled = !enabled || player.stamina < cost;
    });
}

function animateAttack(who) {
    const el = who === 'player' ? playerChar : rivalChar;
    el.classList.add('attacking');
    setTimeout(() => el.classList.remove('attacking'), 400);
}

function animateHit(who) {
    const el = who === 'player' ? playerChar : rivalChar;
    el.classList.add('hit', 'damaged');
    setTimeout(() => {
        el.classList.remove('hit', 'damaged');
    }, 400);
}

function animateHeal(who) {
    const el = who === 'player' ? playerChar : rivalChar;
    el.classList.add('healing');
    setTimeout(() => el.classList.remove('healing'), 600);
}

function showDamage(amount, type) {
    damagePopup.classList.remove('show', 'player-damage', 'rival-damage', 'heal');
    damagePopup.textContent = (type === 'player-heal' ? '+' : '-') + amount;

    if (type === 'player-heal') {
        damagePopup.classList.add('player-damage', 'heal');
        damagePopup.style.left = '15%';
        damagePopup.style.top = '40%';
    } else if (type === 'player') {
        damagePopup.classList.add('player-damage');
        damagePopup.style.left = '15%';
        damagePopup.style.top = '40%';
    } else {
        damagePopup.classList.add('rival-damage');
        damagePopup.style.left = '75%';
        damagePopup.style.top = '40%';
    }

    damagePopup.classList.add('show');
    setTimeout(() => damagePopup.classList.remove('show'), 1000);
}

function showBattleLog(msg) {
    battleLog.textContent = msg;
    battleLog.classList.add('show');
    setTimeout(() => battleLog.classList.remove('show'), 2000);
}

function showTurnIndicator(name) {
    const existing = document.querySelector('.turn-indicator');
    if (existing) existing.remove();

    const indicator = document.createElement('div');
    indicator.className = 'turn-indicator show';
    indicator.textContent = `Lượt của ${name}`;
    document.querySelector('.battle-scene').appendChild(indicator);
    setTimeout(() => {
        indicator.classList.remove('show');
        setTimeout(() => indicator.remove(), 300);
    }, 1500);
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ============================
   INVENTORY SYSTEM
   ============================ */

function openInventory(type, index) {
    if (!canAct || !battleActive) return;

    inventoryTitle.textContent = type === 'weapon' ? 'VŨ KHÍ' : 'VẬT PHẨM';
    renderInventory(type);
    inventoryOverlay.style.display = 'flex';
}

function closeInventory() {
    inventoryOverlay.style.display = 'none';
}

function renderInventory(type) {
    inventoryList.innerHTML = '';

    const items = type === 'weapon' ? inventory.weapons : inventory.items;
    const db = type === 'weapon' ? (typeof WeaponDB !== 'undefined' ? WeaponDB : null) : (typeof ItemDB !== 'undefined' ? ItemDB : null);

    if (!db) {
        inventoryList.innerHTML = '<div style="text-align:center;color:var(--text-gray);">Không có dữ liệu</div>';
        return;
    }

    if (items.length === 0) {
        inventoryList.innerHTML = '<div style="text-align:center;color:var(--text-gray);">Trống</div>';
        return;
    }

    items.forEach((itemId, index) => {
        const item = db.getById(itemId);
        if (!item) return;

        const iconHtml = item.image
            ? `<img src="${item.image}" alt="${item.name}">`
            : '<div class="no-image-placeholder"></div>';

        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `
            <div class="inventory-item-icon">
                ${iconHtml}
            </div>
            <div class="inventory-item-info">
                <div class="inventory-item-name">${item.name}</div>
                <div class="inventory-item-desc">${item.desc}</div>
            </div>
            <div class="inventory-item-cost">${item.cost > 0 ? '-' + item.cost : 'FREE'}</div>
        `;

        div.addEventListener('click', () => {
            if (type === 'weapon') {
                equipWeapon(index);
            } else {
                useItem(index);
            }
            closeInventory();
        });

        inventoryList.appendChild(div);
    });
}

function equipWeapon(index) {
    if (index >= inventory.weapons.length) return;

    const weaponId = inventory.weapons[index];
    const weapon = typeof WeaponDB !== 'undefined' ? WeaponDB.getById(weaponId) : null;
    if (!weapon) return;

    // Unequip old weapon bonus if any
    if (player.weapon) {
        player.weaponBonus = 0;
    }

    // Equip new weapon
    player.weapon = weapon;
    player.weaponBonus = weapon.effect.attackBonus || 0;

    showBattleLog(`Đã trang bị ${weapon.name}!`);
    updateEquipmentSlots();
}

function useItem(index) {
    if (index >= inventory.items.length) return;
    if (!canAct || !battleActive || !isPlayerTurn) return;

    const itemId = inventory.items[index];
    const item = typeof ItemDB !== 'undefined' ? ItemDB.getById(itemId) : null;
    if (!item) return;

    // Remove item from inventory
    inventory.items.splice(index, 1);

    // Activate item effect
    if (typeof ItemDB !== 'undefined') {
        const logs = ItemDB.activate(item, player, rival);
        processBattleLogs(logs);
    }

    showBattleLog(`Sử dụng ${item.name}!`);
}

function processBattleLogs(logs) {
    logs.forEach(log => {
        switch (log.type) {
            case 'damage':
                showDamage(log.amount, 'rival');
                updateHPBars();
                break;
            case 'heal':
                showDamage(log.amount, 'player-heal');
                updateHPBars();
                break;
            case 'guard':
                showBattleLog(`Né đòn! Giảm ${log.amount}% sát thương.`);
                break;
            case 'buff':
                showBattleLog(`Tập trung! Tăng ${log.amount}% sát thương.`);
                break;
            case 'stamina':
                updateStaminaDisplay();
                break;
            case 'status':
                showBattleLog(log.text);
                break;
            default:
                break;
        }
    });
}

function updateEquipmentSlots() {
    // Update weapon slots based on equipped weapon
    const w1Img = weapon1Slot.querySelector('.slot-img');
    const w1Label = weapon1Slot.querySelector('.slot-label');
    const w2Img = weapon2Slot.querySelector('.slot-img');
    const w2Label = weapon2Slot.querySelector('.slot-label');
    const buffImg = buffItemSlot.querySelector('.slot-img');
    const buffLabel = buffItemSlot.querySelector('.slot-label');

    if (player.weapon) {
        if (w1Img) {
            w1Img.src = player.weapon.image;
            w1Img.style.display = 'block';
        }
        if (w1Label) w1Label.textContent = '';
        weapon1Slot.style.borderColor = 'rgba(76, 255, 136, 0.6)';
    } else if (inventory.weapons[0]) {
        const weapon = typeof WeaponDB !== 'undefined' ? WeaponDB.getById(inventory.weapons[0]) : null;
        if (weapon) {
            if (w1Img) {
                w1Img.src = weapon.image;
                w1Img.style.display = 'block';
            }
            if (w1Label) w1Label.textContent = '';
        }
    } else {
        if (w1Img) w1Img.style.display = 'none';
        if (w1Label) w1Label.textContent = 'VŨ KHÍ 1';
    }

    if (inventory.weapons[1]) {
        const weapon = typeof WeaponDB !== 'undefined' ? WeaponDB.getById(inventory.weapons[1]) : null;
        if (weapon) {
            if (w2Img) {
                w2Img.src = weapon.image;
                w2Img.style.display = 'block';
            }
            if (w2Label) w2Label.textContent = '';
        }
    } else {
        if (w2Img) w2Img.style.display = 'none';
        if (w2Label) w2Label.textContent = 'VŨ KHÍ 2';
    }

    // Update buff item slot
    if (inventory.items[0]) {
        const item = typeof ItemDB !== 'undefined' ? ItemDB.getById(inventory.items[0]) : null;
        if (item) {
            if (item.image) {
                if (buffImg) {
                    buffImg.src = item.image;
                    buffImg.style.display = 'block';
                }
                if (buffLabel) buffLabel.textContent = '';
            } else {
                if (buffImg) buffImg.style.display = 'none';
                if (buffLabel) buffLabel.textContent = item.name.substring(0, 10);
            }
        }
    } else {
        if (buffImg) buffImg.style.display = 'none';
        if (buffLabel) buffLabel.textContent = 'BUFF';
    }
}

/* ============================
   SAVE GAME
   ============================ */
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
    save.current = 'chap_1/chap1-2.html';
    if (typeof save.money === 'undefined') save.money = 100;
    if (!Array.isArray(save.skill)) save.skill = [];

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
        console.log('Game saved');
    } catch (e) {
        console.error('Failed to save game:', e);
    }
}

/* ============================
   CHAPTER SYSTEM
   ============================ */

const CHAPTERS = [
    { id: 'chap0', name: 'Chương 0: Mở đầu', path: '../chap_0/chap0.html', requires: [] },
    { id: 'chap1', name: 'Chương 1: Bắt đầu', path: '../chap_1/chap1.html', requires: ['chap0'] },
    { id: 'chap1-1', name: 'Chương 1-1: Hồi tưởng', path: '../chap_1/chap1-1.html', requires: ['chap1'] },
    { id: 'chap1-2', name: 'Chương 1-2: Chiến đấu', path: '../chap_1/chap1-2.html', requires: ['chap1-1'] }
];

function getUnlockedChapters() {
    const save = loadSave();
    if (save && Array.isArray(save.unlockedChapters)) {
        return save.unlockedChapters;
    }
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
    chaptersList.innerHTML = '';

    CHAPTERS.forEach(chap => {
        const isUnlocked = chap.requires.every(req => unlocked.includes(req)) || unlocked.includes(chap.id);
        const isCurrent = window.location.pathname.endsWith(chap.path.replace('../', ''));

        const btn = document.createElement('button');
        btn.className = 'chapter-btn';
        if (isCurrent) btn.classList.add('active');
        if (!isUnlocked) btn.classList.add('locked');

        btn.innerHTML = `
            <span class="chapter-name">${chap.name}</span>
            <span class="chapter-status">${isCurrent ? 'ĐANG CHƠI' : (isUnlocked ? 'ĐÃ MỞ' : '🔒')}</span>
        `;

        if (isUnlocked) {
            btn.addEventListener('click', () => {
                unlockChapter(chap.id);
                window.location.href = chap.path;
            });
        }

        chaptersList.appendChild(btn);
    });

    chaptersOverlay.style.display = 'flex';
}

function closeChapters() {
    chaptersOverlay.style.display = 'none';
}

/* ============================
   AUDIO CONTROLS
   ============================ */

let isPaused = false;
let isMuted = false;

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
    pauseBtn.title = isPaused ? 'Play' : 'Pause';

    if (pauseOverlay) {
        pauseOverlay.style.display = isPaused ? 'flex' : 'none';
    }

    if (isPaused) {
        battleActive = false;
        canAct = false;
        enableSkills(false);
    } else {
        battleActive = true;
        isPlayerTurn = true;
        canAct = true;
        enableSkills(true);
        showTurnIndicator(player.name);
    }
}

function toggleMute() {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    muteBtn.title = isMuted ? 'Unmute' : 'Mute';

    const music = document.getElementById('bgMusic');
    if (music) {
        music.muted = isMuted;
    }
}

/* ============================
   START
   ============================ */
document.addEventListener('DOMContentLoaded', () => {
    init();
    initBackgroundMusic();
});

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
