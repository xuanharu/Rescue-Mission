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
    buffMultiplier: 1
};

let rival = {
    name: '',
    maxHP: 100,
    hp: 100,
    image: ''
};

let skills = [];
let currentCategory = 'defend';

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
const closeBtn = document.getElementById('closeBtn');
const saveBtn = document.getElementById('saveBtn');
const homeBtn = document.getElementById('homeBtn');
const coinValue = document.getElementById('coinValue');
const staminaValue = document.getElementById('staminaValue');

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
    player.image = playerGender === 'female'
        ? '../img/character/female_character_fighting_weapon.webp'
        : '../img/character/male_character_fighting_weapon.webp';

    rival.name = battleData.rival.name;
    rival.maxHP = battleData.rival.maxHP;
    rival.hp = battleData.rival.maxHP;
    rival.image = battleData.rival.image;

    skills = battleData.playerSkills.map(s => ({ ...s }));
    currentCategory = 'defend';

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
    closeBtn.addEventListener('click', () => {
        console.log('Close');
    });

    saveBtn.addEventListener('click', saveGame);

    homeBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    continueBtn.addEventListener('click', () => {
        window.location.href = '../chap_1/chap1.html';
    });

    retryBtn.addEventListener('click', () => {
        victoryOverlay.style.display = 'none';
        defeatOverlay.style.display = 'none';
        initBattle(loadSave());
        startBattle();
    });

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

    if (skill.type === 'attack') {
        let damage = randomRange(skill.damage[0], skill.damage[1]) - rival.defense;
        if (player.buffActive) {
            damage = Math.floor(damage * player.buffMultiplier);
            player.buffActive = false;
            player.buffMultiplier = 1;
        }
        const finalDamage = Math.max(1, damage);
        rival.hp = Math.max(0, rival.hp - finalDamage);

        showBattleLog(battleData.messages.skillUsed
            .replace('{player}', player.name)
            .replace('{skill}', skill.name));

        animateAttack('player');
        setTimeout(() => {
            animateHit('rival');
            showDamage(finalDamage, 'rival');
            updateHPBars();
            checkBattleEnd();
        }, 300);

        setTimeout(() => {
            if (battleActive && !checkBattleEnd()) {
                rivalTurn();
            }
        }, 1200);

    } else if (skill.type === 'heal') {
        const healAmount = randomRange(skill.heal[0], skill.heal[1]);
        player.hp = Math.min(player.maxHP, player.hp + healAmount);

        showBattleLog(battleData.messages.skillUsed
            .replace('{player}', player.name)
            .replace('{skill}', skill.name));

        animateHeal('player');
        setTimeout(() => {
            showDamage(healAmount, 'player-heal');
            updateHPBars();
        }, 300);

        setTimeout(() => {
            if (battleActive) {
                rivalTurn();
            }
        }, 1200);

    } else if (skill.type === 'guard') {
        player.guarding = true;

        showBattleLog(battleData.messages.skillUsed
            .replace('{player}', player.name)
            .replace('{skill}', skill.name));

        animateHeal('player');
        showBattleLog(battleData.messages.playerGuard[Math.floor(Math.random() * battleData.messages.playerGuard.length)]
            .replace('{player}', player.name));

        setTimeout(() => {
            if (battleActive) {
                rivalTurn();
            }
        }, 1200);

    } else if (skill.type === 'buff') {
        player.buffActive = true;
        player.buffMultiplier = skill.effect.damageBoost || 1.5;

        showBattleLog(battleData.messages.skillUsed
            .replace('{player}', player.name)
            .replace('{skill}', skill.name));

        animateHeal('player');

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
        btn.disabled = !enabled || player.stamina < skill.cost;
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
