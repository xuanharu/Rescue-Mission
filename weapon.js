/* ============================================
   RESCUE MISSION - WEAPON DATABASE
   ============================================ */

const WeaponDB = {
    weapons: [
        {
            id: "pistol_1",
            name: "Súng ngắn cơ bản",
            category: "gun",
            image: "../weapon/weapon_pistol_1.webp",
            cost: 0,
            type: "weapon",
            desc: "Khẩu súng ngắn tiêu chuẩn, đáng tin cậy",
            effect: {
                damage: [8, 12],
                attackBonus: 2
            }
        },
        {
            id: "pistol_2",
            name: "Súng ngắn nâng cao",
            category: "gun",
            image: "../weapon/weapon_pistol_2.webp",
            cost: 5,
            type: "weapon",
            desc: "Phiên bản cải tiến, bắn nhanh và chính xác hơn",
            effect: {
                damage: [12, 18],
                attackBonus: 4
            }
        },
        {
            id: "rifle_9",
            name: "Súng trường tầm xa",
            category: "gun",
            image: "../weapon/weapon_rifle_9.webp",
            cost: 10,
            type: "weapon",
            desc: "Sức mạnh hủy diệt từ khoảng cách xa",
            effect: {
                damage: [18, 26],
                attackBonus: 6
            }
        },
        {
            id: "dagger_9",
            name: "Dao găm",
            category: "melee",
            image: "../weapon/weapon_dagger_9.webp",
            cost: 0,
            type: "weapon",
            desc: "Vũ khí cận chiến nhanh và linh hoạt",
            effect: {
                damage: [6, 10],
                attackBonus: 1
            }
        },
        {
            id: "axe_9",
            name: "Rìu chiến",
            category: "melee",
            image: "../weapon/weapon_axe_9.webp",
            cost: 8,
            type: "weapon",
            desc: "Vũ khí nặng, gây sát thương lớn",
            effect: {
                damage: [15, 22],
                attackBonus: 5
            }
        },
        {
            id: "spear_9",
            name: "Thương",
            category: "melee",
            image: "../weapon/weapon_spear_9.webp",
            cost: 6,
            type: "weapon",
            desc: "Tấn công từ xa với thương",
            effect: {
                damage: [10, 16],
                attackBonus: 3
            }
        }
    ],

    categoryName: {
        gun: "Súng",
        melee: "Cận chiến"
    },

    getById(id) {
        return this.weapons.find(w => w.id === id);
    },

    getByCategory(category) {
        return this.weapons.filter(w => w.category === category);
    },

    /**
     * Activate weapon effect using EffectSystem
     * @param {Object} weapon - Weapon data
     * @param {Object} user - Character using the weapon
     * @param {Object} target - Target character
     * @param {Array} allTargets - All targets for AoE effects
     * @returns {Array} Battle log entries from EffectSystem
     */
    activate(weapon, user, target, allTargets = []) {
        const effects = weapon.effect || {};
        const logs = [];

        if (weapon.type === 'weapon') {
            // Base damage from weapon
            const min = effects.damage ? effects.damage[0] : 0;
            const max = effects.damage ? effects.damage[1] : 0;
            const baseDamage = randomRange(min, max);

            // Apply attack bonus as flat damage
            const bonus = effects.attackBonus || 0;
            const totalDamage = baseDamage + bonus;

            // Check for AoE (attack multiple targets)
            if (effects.aoe && allTargets.length > 1) {
                logs.push(...EffectSystem.applyAoEDamage(user, allTargets, totalDamage));
            } else {
                // Single target damage
                const defense = target.defense || 0;
                let finalDamage = Math.max(1, totalDamage - defense);

                // Apply damage multiplier if present
                if (effects.damageMultiplier) {
                    finalDamage = Math.floor(finalDamage * effects.damageMultiplier);
                }

                // Apply user buffs
                if (user.buffActive) {
                    finalDamage = Math.floor(finalDamage * (user.buffMultiplier || 1));
                    user.buffActive = false;
                    user.buffMultiplier = 1;
                }

                target.hp = Math.max(0, target.hp - finalDamage);
                logs.push({ type: 'damage', target: 'rival', amount: finalDamage });
            }

            // Disable guard if weapon has this effect
            if (effects.disableGuard) {
                target.guarding = false;
                logs.push({ type: 'status', target: 'rival', text: 'Guard broken!' });
            }
        }

        return logs;
    }
};

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (typeof module !== 'undefined') module.exports = WeaponDB;
