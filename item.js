/* ============================================
   RESCUE MISSION - ITEM DATABASE
   ============================================ */

const ItemDB = {
    items: [
        {
            id: "energy_drink",
            name: "Nước tăng lực",
            category: "consumable",
            image: "",
            cost: 25,
            type: "item",
            desc: "Khôi phục 30 stamina",
            effect: {
                staminaChange: 30
            }
        },
        {
            id: "stamina_pill",
            name: "Viên tăng stamina",
            category: "consumable",
            image: "",
            cost: 15,
            type: "item",
            desc: "Giảm 20% stamina cost cho 1 lượt",
            effect: {
                staminaCostReduction: 0.2
            }
        },
        {
            id: "damage_boost",
            name: "Thuốc tăng sức mạnh",
            category: "consumable",
            image: "",
            cost: 30,
            type: "item",
            desc: "Tăng 50% damage cho 1 lượt",
            effect: {
                damageMultiplier: 1.5
            }
        },
        {
            id: "smoke_bomb",
            name: "Bom khói",
            category: "consumable",
            image: "",
            cost: 20,
            type: "item",
            desc: "Vô hiệu hóa skill đối thủ 1 lượt",
            effect: {
                disableSkill: "attack"
            }
        },
        {
            id: "adrenaline",
            name: "Adrenaline",
            category: "consumable",
            image: "",
            cost: 35,
            type: "item",
            desc: "Tăng 100% stamina tối đa, giảm 50% stamina cost",
            effect: {
                staminaMultiplier: 2,
                staminaCostReduction: 0.5
            }
        }
    ],

    categoryName: {
        consumable: "Tiêu hao",
        equipment: "Trang bị",
        special: "Đặc biệt"
    },

    getById(id) {
        return this.items.find(i => i.id === id);
    },

    getByCategory(category) {
        return this.items.filter(i => i.category === category);
    },

    /**
     * Activate item effect using EffectSystem
     * @param {Object} item - Item data
     * @param {Object} user - Character using the item
     * @param {Object} target - Target character
     * @returns {Array} Battle log entries from EffectSystem
     */
    activate(item, user, target) {
        const effects = item.effect || {};
        const logs = [];

        if (item.type === 'item') {
            // Stamina change (flat or percentage)
            if (effects.staminaChange) {
                logs.push(...EffectSystem.applyStaminaChange(user, target, effects.staminaChange));
            }
            if (effects.staminaPercentage) {
                logs.push(...EffectSystem.applyStaminaPercentage(user, target, effects.staminaPercentage));
            }

            // Stamina cost reduction
            if (effects.staminaCostReduction) {
                logs.push(...EffectSystem.applyStaminaCostReduction(user, target, effects.staminaCostReduction));
            }

            // Damage multiplier
            if (effects.damageMultiplier) {
                logs.push(...EffectSystem.applyDamageBoost(user, target, effects.damageMultiplier));
            }

            // Disable specific skill type
            if (effects.disableSkill) {
                logs.push(...EffectSystem.applyDisableSkill(user, target, effects.disableSkill));
            }

            // Direct damage
            if (effects.damage) {
                const min = effects.damage[0];
                const max = effects.damage[1];
                const damage = randomRange(min, max);
                target.hp = Math.max(0, target.hp - damage);
                logs.push({ type: 'damage', target: 'rival', amount: damage });
            }

            // Flat damage boost (adds to next attack)
            if (effects.damageBonus) {
                user.damageBonus = (user.damageBonus || 0) + effects.damageBonus;
                logs.push({ type: 'status', target: 'player', text: `+${effects.damageBonus} damage bonus!` });
            }
        }

        return logs;
    }
};

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (typeof module !== 'undefined') module.exports = ItemDB;
