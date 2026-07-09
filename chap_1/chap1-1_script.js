const chapter1 = [{
        background: "../img/chapter_1/going_home.webp",

        characters: [],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Con phố bỗng trở nên yên tĩnh lạ thường. Xa xa xuất hiện những cột khói đen đang bốc lên giữa thành phố."
    },

    {
        background: "../img/chapter_1/going_home.webp",

        characters: [{
            image: "../img/character/male_character_uniform_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "thought",

        speaker: "Main",

        text: "...Có chuyện gì vậy?"
    },

    {
        background: "../img/chapter_1/main_city_destroyed.webp",

        characters: [],

        animation: null,

        type: "narration",

        speaker: "",

        text: "ẦMMMMMM...! Hàng loạt bom rải xuống, những tòa nhà chọc trời đổ sụp trong chốc lát."
    },

    {
        background: "../img/chapter_1/main_city_destroyed.webp",

        characters: [{
            image: "../img/character/commander_normal.webp",
            position: "center"
        }],

        animation: "shake",

        type: "speech",

        speaker: "Chỉ huy",

        text: "Quân y!"
    },

    {
        background: "../img/chapter_1/main_city_destroyed.webp",

        characters: [{
            image: "../img/character/commander_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Chỉ huy",

        text: "Qua đây ngay!"
    },

    {
        background: "../img/chapter_1/main_city_destroyed.webp",

        characters: [{
            image: "../img/character/medic_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Quân y",

        text: "Anh ấy vẫn còn thở!"
    },

    {
        background: "../img/chapter_1/main_city_destroyed.webp",

        characters: [{
            image: "../img/character/soldier_injured.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Người lính",

        text: "...Chúng..."
    },

    {
        background: "../img/chapter_1/main_city_destroyed.webp",

        characters: [{
            image: "../img/character/soldier_injured.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Người lính",

        text: "...quá mạnh..."
    },

    {
        background: "../img/chapter_1/main_city_destroyed.webp",

        characters: [],

        animation: "flash",

        type: "narration",

        speaker: "",

        text: "Chiếc camera trên vai 1 người lính đã ngã gục bất ngờ sáng lên."
    },

    {
        background: "../img/chapter_1/kidnaped_father.webp",

        characters: [],

        animation: null,

        type: "system",

        speaker: "HỆ THỐNG",

        text: "Đang phát bản ghi..."
    },

    {
        background: "../img/chapter_1/kidnaped_father.webp",

        characters: [],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Một màn hình hologram hiện ra."
    },

    {
        background: "../img/chapter_1/kidnaped_father.webp",

        characters: [{
            image: "../img/character/father_kidnaped.webp",
            position: "center"
        }],

        animation: "shake",

        type: "speech",

        speaker: "Nhà khoa học",

        text: "Không!"
    },

    {
        background: "../img/chapter_1/kidnaped_father.webp",

        characters: [{
            image: "../img/character/father_kidnaped.webp",
            position: "center"
        }],

        animation: "shake",

        type: "speech",

        speaker: "Nhà khoa học",

        text: "Thả tôi ra!"
    },

    {
        background: "../img/chapter_1/kidnaped_father.webp",

        characters: [],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Hai robot ngoài hành tinh đang khống chế ông."
    },

    {
        background: "../img/chapter_1/kidnaped_father.webp",

        characters: [{
            image: "../img/character/father_kidnaped.webp",
            position: "center"
        }],

        animation: null,

        type: "speech",

        speaker: "Nhà khoa học",

        text: "...Con của ba..."
    },

    {
        background: "../img/chapter_1/kidnaped_father.webp",

        characters: [],

        animation: "glitch",

        type: "narration",

        speaker: "",

        text: "Tín hiệu bắt đầu nhiễu."
    },

    {
        background: "",

        characters: [],

        animation: "glitch",

        type: "system",

        speaker: "HỆ THỐNG",

        text: "MẤT TÍN HIỆU"
    },

    {
        background: "../img/chapter_1/main_city_war.webp",

        characters: [{
            image: "../img/character/male_character_uniform_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "narration",

        speaker: "",

        text: "Mọi thứ chìm vào im lặng. Tôi đứng chết lặng."
    },

    {
        background: "../img/chapter_1/main_city_war.webp",

        characters: [{
            image: "../img/character/male_character_uniform_normal.webp",
            position: "center"
        }],

        animation: null,

        type: "thought",

        speaker: "Main",

        text: "...Ba...?"
    }
];

const speakerPortraits = {
    "Main": "../img/character/portrait_male_character.webp",
    "Chỉ huy": "../img/character/portrait_person.webp",
    "Quân y": "../img/character/portrait_people.webp",
    "Người lính": "../img/character/portrait_person.webp",
    "Nhà khoa học": "../img/character/portrait_father.webp",
    "HỆ THỐNG": "../img/character/portrait_person.webp"
};