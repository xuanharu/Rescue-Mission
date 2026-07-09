const chapter1 = [{
        background: "../img/chapter_1/classroom.webp",

        characters: [],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Một buổi sáng tại trường Trung học Elite, một học sinh đi trễ đang lẻn vào lớp học."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
            image: "../img/character/teacher_teaching_normal_1.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Thầy John",

        text: "Chào buổi sáng, các em."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
            image: "../img/character/teacher_teaching_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Học sinh",

        text: "Chào buổi sáng, thầy ạ."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
            image: "../img/character/teacher_teaching_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Thầy John",

        text: "Thầy đã chấm xong bài kiểm tra hôm qua."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Cả lớp dần im lặng."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
            image: "../img/character/teacher_teaching_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Thầy John",

        text: "Đa số các em đều làm rất tốt..."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
            image: "../img/character/teacher_teaching_badgrade_1.webp",
            position: "center"
        }],

        animation: "shake",

        type: "speech",

        speaker: "Thầy John",

        text: "...nhưng có một học sinh bị điểm 0."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
                image: "../img/character/teacher_teaching_normal.webp",
                position: "left"
            },
            {
                image: "../img/character/male_character_uniform_normal.webp",
                position: "right"
            }
        ],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Thầy giáo nhìn về phía cuối lớp."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
                image: "../img/character/teacher_teaching_disappoint.webp",
                position: "left"
            },
            {
                image: "../img/character/male_character_uniform_normal.webp",
                position: "right"
            }
        ],

        animation: null,

        type: "speech",

        speaker: "Thầy John",

        text: "Lại đi trễ à...Em lên đây."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
                image: "../img/character/teacher_teaching_disappoint.webp",
                position: "left"
            },
            {
                image: "../img/character/male_character_uniform_normal.webp",
                position: "right"
            }
        ],

        animation: null,

        type: "speech",

        speaker: "Thầy John",

        text: "Em là một đứa trẻ thông minh. Nhưng em chưa bao giờ thật sự nghiêm túc trong việc học."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
            image: "../img/character/male_character_uniform_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "thought",

        speaker: "Main",

        text: "...Em xin lỗi ạ."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [{
                image: "../img/character/teacher_teaching_disappoint.webp",
                position: "left"
            },
            {
                image: "../img/character/male_character_uniform_normal.webp",
                position: "right"
            }
        ],

        animation: null,

        type: "speech",

        speaker: "Thầy John",

        text: "Thầy hy vọng lần sau em sẽ làm tốt hơn."
    },

    {
        background: "../img/chapter_1/classroom.webp",

        characters: [],

        animation: "fade",

        type: "narration",

        speaker: "",

        text: "Chuông tan học vang lên."
    },

    {
        background: "../img/chapter_1/nothing.webp",

        characters: [{
            image: "../img/character/male_character_uniform_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Sau giờ học, tôi lặng lẽ bước trên con đường về nhà."
    },

    {
        background: "../img/chapter_1/nothing.webp",

        characters: [{
            image: "../img/character/male_character_uniform_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "thought",

        speaker: "Main",

        text: "...Lại điểm 0 nữa."
    },

    {
        background: "../img/chapter_1/nothing.webp",

        characters: [{
            image: "../img/character/male_character_uniform_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "thought",

        speaker: "Main",

        text: "Ba chắc sẽ thất vọng lắm..."
    },

    {
        background: "../img/chapter_1/future_street.webp",

        characters: [{
            image: "../img/character/male_character_uniform_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Tôi tiếp tục bước đi mà không hề biết rằng cuộc sống của mình sắp thay đổi mãi mãi...",
        branch: '../chap_1/chap1-1.html'
    },
];

const speakerPortraits = {
    "Main": "../img/character/portrait_male_character.webp",
    "Thầy John": "../img/character/portrait_teacher.webp",
    "Học sinh": "../img/character/portrait_people.webp"
};