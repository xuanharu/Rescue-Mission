/* ============================================
   RESCUE MISSION - SKILL DATABASE
   ============================================ */

const SkillDB = {
    skills: [{ //Đấm thường: Sức mạnh vật lý từ 5 đến 10 DMG
            id: "punch",
            name: "Đấm thường",
            category: "physics",
            image: "../skill/Physics/skill_1_punch.webp",
            cost: 0,
            type: "attack",
            desc: "Sức mạnh vật lý từ 5 đến 10 DMG",
            effect: {
                damage: [5, 10]
            }
        },
        { //Đánh mạnh: Sức mạnh vật lý từ 15 đến 25 DMG
            id: "heavy_strike",
            name: "Đánh mạnh",
            category: "physics",
            image: "../skill/Physics/skill_1_punch.webp",
            cost: 10,
            type: "attack",
            desc: "Sức mạnh vật lý từ 15 đến 25 DMG",
            effect: {
                damage: [15, 25]
            }
        },
        { //Cầu lửa: Sức mạnh nguyên tố lửa từ 20 đến 35 DMG. Có khả năng áp chế nguyên tố gió và nguyên tố băng.
            id: "fireball",
            name: "Cầu lửa",
            category: "elements",
            image: "",
            cost: 15,
            type: "attack",
            desc: "Sức mạnh nguyên tố lửa từ 20 đến 35 DMG. Có khả năng áp chế nguyên tố gió và nguyên tố băng.",
            effect: {
                damage: [20, 35]
            }
        },
        { // Né đòn: Giảm sát thương nhận vào 50% trong lượt tiếp theo
            id: "dodge",
            name: "Né đòn",
            category: "defend",
            image: "../skill/Defend/skill_1_dodge.webp",
            cost: 10,
            type: "guard",
            desc: "Lăn tránh 50% sát thương từ đòn tấn công sắp tới",
            effect: {
                damageReduction: 0.5
            }
        },
        { // Bình tĩnh: Hồi phục từ 15 đến 25 HP
            id: "calm-down",
            name: "Bình tĩnh",
            category: "heal",
            image: "../skill/Heal/skill_1_calm-down.webp",
            cost: 15,
            type: "heal",
            desc: "Hồi phục từ 15 đến 25 HP",
            effect: {
                heal: [15, 25]
            }
        },
        { // Tập trung: Tăng 1.3 lần sát thương cho lượt đánh kế tiếp
            id: "focus",
            name: "Tập trung",
            category: "buff",
            image: "../skill/Buff/skill_1_focus.webp",
            cost: 10,
            type: "buff",
            desc: "Tăng 1.3 lần sát thương cho lượt đánh kế tiếp",
            effect: {
                damageBoost: 1.3
            }
        }
    ],

    categoryName: {
        defend: "Phòng thủ",
        physics: "Vật lý",
        elements: "Nguyên tố",
        heal: "Hồi máu",
        buff: "Hỗ trợ"
    },

    getById(id) {
        return this.skills.find(s => s.id === id);
    },

    getByCategory(category) {
        return this.skills.filter(s => s.category === category);
    },

    /**
     * Activate skill effect using EffectSystem
     * @param {Object} skill - Skill data
     * @param {Object} user - Character using the skill
     * @param {Object} target - Target character
     * @returns {Array} Battle log entries from EffectSystem
     */
    activate(skill, user, target) {
        const effects = skill.effect || {};
        const logs = [];

        if (skill.type === 'attack') {
            const min = effects.damage ? effects.damage[0] : 0;
            const max = effects.damage ? effects.damage[1] : 0;
            const baseDamage = randomRange(min, max);

            // Check for damage multiplier
            if (effects.damageMultiplier) {
                logs.push(...EffectSystem.applyDamageMultiplier(user, target, effects.damageMultiplier, baseDamage));
            } else {
                // Standard damage calculation
                const defense = target.defense || 0;
                let finalDamage = Math.max(1, baseDamage - defense);

                // Apply user buffs
                if (user.buffActive) {
                    finalDamage = Math.floor(finalDamage * (user.buffMultiplier || 1));
                    user.buffActive = false;
                    user.buffMultiplier = 1;
                }

                // Apply flat damage bonus from weapons/items
                if (user.damageBonus) {
                    finalDamage += user.damageBonus;
                    user.damageBonus = 0;
                }

                target.hp = Math.max(0, target.hp - finalDamage);
                logs.push({ type: 'damage', target: 'rival', amount: finalDamage });
            }

        } else if (skill.type === 'heal') {
            const min = effects.heal ? effects.heal[0] : 0;
            const max = effects.heal ? effects.heal[1] : 0;
            const healAmount = randomRange(min, max);
            user.hp = Math.min(user.maxHP, user.hp + healAmount);
            logs.push({ type: 'heal', target: 'player', amount: healAmount });

        } else if (skill.type === 'guard') {
            const reduction = effects.damageReduction || 0.5;
            logs.push(...EffectSystem.applyGuard(user, target, reduction));

        } else if (skill.type === 'buff') {
            const boost = effects.damageBoost || 1.5;
            logs.push(...EffectSystem.applyDamageBoost(user, target, boost));
        }

        return logs;
    }
};

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (typeof module !== 'undefined') module.exports = SkillDB;