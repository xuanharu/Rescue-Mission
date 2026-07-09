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

        speaker: "Alex",

        text: "Why are the lights off?"
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

        speaker: "Father",

        text: "Don't let them finish my research!"
    }
];