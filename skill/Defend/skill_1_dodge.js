const skills = [
    {
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
