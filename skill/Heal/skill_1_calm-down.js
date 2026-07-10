const skills = [
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
    }
];

const categoryName = {
    defend: "Phòng thủ",
    physics: "Vật lý",
    elements: "Nguyên tố",
    heal: "Hồi máu",
    buff: "Hỗ trợ"
};

if (typeof module !== 'undefined') module.exports = { skills, categoryName };
