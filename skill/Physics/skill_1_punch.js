const skills = [
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
