const battleData = {
    music: "../music/galactic-conquest.mp3",
    background: "../img/chapter_1/fighting_scene.webp",
    playerStatus: {
        maxHP: 100,
        maxStamina: 50
    },
    rival: {
        name: "Robot LVL 2",
        image: "../img/character/robot_lvl2.webp",
        maxHP: 100,
        attack: 12,
        defense: 3
    },
    playerSkills: [{
            id: "dodge",
            name: "Né đòn",
            category: "defend",
            image: "../skill/Defend/skill_1_dodge.webp",
            cost: 10,
            type: "guard",
            desc: "Lăn tránh đòn tấn công sắp tới",
            effect: {
                damageReduction: 0.5
            }
        },
        {
            id: "punch",
            name: "Đấm thường",
            category: "physics",
            image: "../skill/Physics/skill_1_punch.webp",
            cost: 0,
            type: "attack",
            desc: "Cú đấm cơ bản vào đối thủ",
            effect: {
                damage: [10, 15]
            }
        },
        {
            id: "heavy_strike",
            name: "Đánh mạnh",
            category: "physics",
            image: "../skill/Physics/skill_1_punch.webp",
            cost: 20,
            type: "attack",
            desc: "Đòn đánh toàn lực gây nhiều sát thương",
            effect: {
                damage: [20, 28]
            }
        },
        {
            id: "fireball",
            name: "Cầu lửa",
            category: "elements",
            image: "",
            cost: 15,
            type: "attack",
            desc: "Bắn cầu lửa thiêu rụi đối thủ",
            effect: {
                damage: [18, 25]
            }
        },
        {
            id: "calm-down",
            name: "Bình tĩnh",
            category: "heal",
            image: "../skill/Heal/skill_1_calm-down.webp",
            cost: 15,
            type: "heal",
            desc: "Hít thở sâu và hồi phục vết thương",
            effect: {
                heal: [15, 22]
            }
        },
        {
            id: "focus",
            name: "Tập trung",
            category: "buff",
            image: "../skill/Buff/skill_1_focus.webp",
            cost: 10,
            type: "buff",
            desc: "Tăng sát thương lượt tới",
            effect: {
                damageBoost: 1.3
            }
        }
    ],
    messages: {
        playerAttack: [
            "{player} tấn công {rival}!",
            "{player} lao vào với đà tấn công!",
            "{player} tung cú đánh mạnh mẽ!"
        ],
        rivalAttack: [
            "{rival} tấn công {player}!",
            "{rival} lao về phía {player}!",
            "{rival} tung cú đấm năng lượng!"
        ],
        playerHeal: [
            "{player} hồi phục vết thương.",
            "{player} băng bó vết thương."
        ],
        playerGuard: [
            "{player} né đòn!",
            "{player} đứng thủ!"
        ],
        victory: "Bạn đã chiến thắng!",
        defeat: "Bạn đã bị hạ gục...",
        turnStart: "Lượt của {name}",
        skillUsed: "{player} sử dụng {skill}!"
    }
};