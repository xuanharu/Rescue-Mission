const battleData = {
    music: "../music/galactic-conquest.mp3",
    background: "../img/chapter_1/fighting_scene.webp",
    playerStatus: {
        maxHP: 100,
        maxStamina: 50
    },
    character: {
        weapons: ["pistol_1"],
        items: ["energy_drink"]
    },
    rival: {
        name: "Robot LVL 2",
        image: "../img/character/robot_lvl2.webp",
        maxHP: 100,
        attack: 12,
        defense: 3
    },
    playerSkills: [
        "dodge",
        "punch",
        "heavy_strike",
        "fireball",
        "calm-down",
        "focus"
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