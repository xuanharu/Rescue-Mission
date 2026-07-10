/* ============================================
   RESCUE MISSION - EFFECT SYSTEM
   ============================================
   This file centralizes all effect logic for
   skills, weapons, and items.

   Each effect function takes:
   - user: the character using the effect
   - target: the target character
   - amount: numeric value from effect data
   - context: battle state (optional)

   Returns:
   - logs: array of effect results for UI display
   ============================================ */

const EffectSystem = {

    /* --- DAMAGE EFFECTS --- */

    /**
     * Apply flat damage bonus/penalty to target
     * @param {Object} user - Character using the effect
     * @param {Object} target - Character receiving damage
     * @param {number} amount - Flat damage value to add/subtract
     * @returns {Array} Battle log entries
     */
    applyFlatDamage(user, target, amount) {
        const damage = Math.max(0, amount);
        target.hp = Math.max(0, target.hp - damage);
        return [{ type: 'damage', target: 'rival', amount: damage }];
    },

    /**
     * Apply percentage-based damage multiplier
     * @param {Object} user - Character using the effect
     * @param {Object} target - Character receiving damage
     * @param {number} amount - Percentage multiplier (e.g., 1.5 = +50%)
     * @param {number} baseDamage - Base damage before multiplier
     * @returns {Array} Battle log entries
     */
    applyDamageMultiplier(user, target, amount, baseDamage) {
        const damage = Math.max(1, Math.floor(baseDamage * amount));
        target.hp = Math.max(0, target.hp - damage);
        return [{ type: 'damage', target: 'rival', amount: damage }];
    },

    /* --- HEAL EFFECTS --- */

    /**
     * Restore HP to user by flat amount
     * @param {Object} user - Character being healed
     * @param {number} amount - HP to restore
     * @returns {Array} Battle log entries
     */
    applyHeal(user, target, amount) {
        const healAmount = Math.min(amount, user.maxHP - user.hp);
        user.hp = Math.min(user.maxHP, user.hp + healAmount);
        return [{ type: 'heal', target: 'player', amount: healAmount }];
    },

    /**
     * Restore HP by percentage of max HP
     * @param {Object} user - Character being healed
     * @param {number} amount - Percentage of max HP to restore (e.g., 0.3 = 30%)
     * @returns {Array} Battle log entries
     */
    applyHealPercentage(user, target, amount) {
        const healAmount = Math.floor(user.maxHP * amount);
        const actualHeal = Math.min(healAmount, user.maxHP - user.hp);
        user.hp = Math.min(user.maxHP, user.hp + actualHeal);
        return [{ type: 'heal', target: 'player', amount: actualHeal }];
    },

    /* --- GUARD / DEFENSE EFFECTS --- */

    /**
     * Enable guard mode - reduces incoming damage by percentage
     * @param {Object} user - Character guarding
     * @param {number} amount - Damage reduction percentage (e.g., 0.5 = 50%)
     * @returns {Array} Battle log entries
     */
    applyGuard(user, target, amount) {
        user.guarding = true;
        user.guardReduction = amount;
        return [{ type: 'guard', target: 'player', amount: Math.round(amount * 100) }];
    },

    /**
     * Disable guard/defend skill for target
     * @param {Object} user - Character applying the effect
     * @param {Object} target - Character whose guard is disabled
     * @param {number} amount - Number of turns guard is disabled (unused, for future)
     * @returns {Array} Battle log entries
     */
    applyDisableGuard(user, target, amount) {
        target.guarding = false;
        target.guardDisabled = true;
        return [{ type: 'status', target: 'rival', text: 'Guard disabled!' }];
    },

    /* --- BUFF / DEBUFF EFFECTS --- */

    /**
     * Apply damage boost buff to user's next attack
     * @param {Object} user - Character receiving buff
     * @param {number} amount - Damage multiplier (e.g., 1.5 = +50%)
     * @returns {Array} Battle log entries
     */
    applyDamageBoost(user, target, amount) {
        user.buffActive = true;
        user.buffMultiplier = amount;
        return [{ type: 'buff', target: 'player', amount: Math.round(amount * 100) }];
    },

    /**
     * Disable specific skill type for target
     * @param {Object} user - Character applying the effect
     * @param {Object} target - Character whose skill is disabled
     * @param {string} amount - Skill type to disable (e.g., "heal", "guard", "buff")
     * @returns {Array} Battle log entries
     */
    applyDisableSkill(user, target, amount) {
        target.disabledSkills = target.disabledSkills || [];
        target.disabledSkills.push(amount);
        return [{ type: 'status', target: 'rival', text: `${amount} skill disabled!` }];
    },

    /* --- STAMINA EFFECTS --- */

    /**
     * Modify stamina by flat amount
     * @param {Object} user - Character whose stamina changes
     * @param {number} amount - Stamina change (positive or negative)
     * @returns {Array} Battle log entries
     */
    applyStaminaChange(user, target, amount) {
        user.stamina = Math.max(0, Math.min(user.maxStamina, user.stamina + amount));
        return [{ type: 'stamina', target: 'player', amount: amount }];
    },

    /**
     * Modify stamina by percentage
     * @param {Object} user - Character whose stamina changes
     * @param {number} amount - Percentage of max stamina (e.g., 0.5 = +50%)
     * @returns {Array} Battle log entries
     */
    applyStaminaPercentage(user, target, amount) {
        const staminaChange = Math.floor(user.maxStamina * amount);
        user.stamina = Math.max(0, Math.min(user.maxStamina, user.stamina + staminaChange));
        return [{ type: 'stamina', target: 'player', amount: staminaChange }];
    },

    /**
     * Reduce stamina cost of all skills for a duration
     * @param {Object} user - Character receiving the effect
     * @param {number} amount - Percentage reduction (e.g., 0.3 = -30% cost)
     * @returns {Array} Battle log entries
     */
    applyStaminaCostReduction(user, target, amount) {
        user.staminaCostReduction = amount;
        return [{ type: 'status', target: 'player', text: 'Stamina cost reduced!' }];
    },

    /* --- MULTI-TARGET EFFECTS --- */

    /**
     * Apply damage to all targets (for AoE skills/weapons)
     * @param {Object} user - Character attacking
     * @param {Array} targets - Array of target characters
     * @param {number} amount - Damage amount
     * @returns {Array} Battle log entries
     */
    applyAoEDamage(user, targets, amount) {
        const logs = [];
        targets.forEach(target => {
            const damage = Math.max(1, amount - (target.defense || 0));
            target.hp = Math.max(0, target.hp - damage);
            logs.push({ type: 'damage', target: 'rival', amount: damage });
        });
        return logs;
    },

    /* --- UTILITY EFFECTS --- */

    /**
     * Apply custom effect handler
     * @param {Function} handler - Custom effect function
     * @param {Object} user - Character using the effect
     * @param {Object} target - Target character
     * @param {*} data - Effect data
     * @returns {Array} Battle log entries
     */
    applyCustom(handler, user, target, data) {
        if (typeof handler === 'function') {
            return handler(user, target, data);
        }
        return [];
    }
};

if (typeof module !== 'undefined') module.exports = EffectSystem;
