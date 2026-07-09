const chapter1 = [{
        background: "img/chapter_1/classroom.jpg",

        characters: [{
            image: "img/character/male_character_uniform_normal.jpg",
            position: "center"
        }],

        animation: null,
        type: "narration",
        speaker: "",
        text: "The protagonist has just finished school and returned home."
    },

    {
        background: "img/chapter_1/classroom.jpg",

        characters: [{
            image: "img/character/teacher_teaching_normal.jpg",
            position: "center"
        }],

        animation: null,

        type: "thought",

        speaker: "Main",

        text: "Thật chán quá đi, mình muốn về nhà ngay bây giờ!"
    },

    {
        background: "img/chapter_1/classroom.jpg",

        characters: [{
                image: "img/character/teacher_teaching_normal.jpg",
                position: "left"
            },
            {
                image: "img/character/robot_lvl2.jpg",
                position: "right"
            }
        ],

        animation: "shake",

        type: "speech",

        speaker: "Thầy John",

        text: "Em lại bị điểm kém môn Toán rồi à? Học hành thế này thì làm sao mà thi đỗ được!"
    }
];

const speakerPortraits = {
    "Main": "img/character/portrait_male_character.png",
    "Thầy John": "img/character/portrait_teacher.png"
};