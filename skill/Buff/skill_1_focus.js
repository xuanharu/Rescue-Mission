const skills = [
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
];

const categoryName = {
    defend: "Phòng thủ",
    physics: "Vật lý",
    elements: "Nguyên tố",
    heal: "Hồi máu",
    buff: "Hỗ trợ"
};

if (typeof module !== 'undefined') module.exports = { skills, categoryName };
