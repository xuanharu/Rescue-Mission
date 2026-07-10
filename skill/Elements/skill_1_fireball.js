const skills = [
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
