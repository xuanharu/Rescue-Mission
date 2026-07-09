// ==========================================
// Rescue Mission - Chapter 1
// ==========================================

// chapter1 comes from chap1_script.js

let currentIndex = 0;
let playerCoin = 100;

// =============================
// DOM
// =============================

const background = document.getElementById("storyBackground");
const characterLayer = document.getElementById("characterLayer");

const speaker = document.getElementById("speakerName");
const dialogue = document.getElementById("dialogueText");
const dialogueBox = document.getElementById("dialogueBox");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const coinValue = document.getElementById("coinValue");

// =============================
// Initialization
// =============================

window.addEventListener("DOMContentLoaded", () => {

    coinValue.textContent = playerCoin;

    renderScene();

    nextBtn.addEventListener("click", nextDialogue);
    previousBtn.addEventListener("click", previousDialogue);

    dialogueBox.addEventListener("click", nextDialogue);

    document.addEventListener("keydown", (e) => {

        if (e.code === "Space") {

            e.preventDefault();

            nextDialogue();

        }

    });

});

// =============================
// Render Scene
// =============================

function renderScene() {

    const scene = chapter1[currentIndex];

    updateBackground(scene.background);

    updateCharacters(scene.characters);

    updateDialogue(scene);

    updateButtons();

}

// =============================
// Background
// =============================

function updateBackground(image) {

    background.classList.remove("fade-in");

    void background.offsetWidth;

    background.src = "img/background/" + image;

    background.classList.add("fade-in");

}

// =============================
// Characters
// =============================

function updateCharacters(characters) {

    characterLayer.innerHTML = "";

    characters.forEach(character => {

        const img = document.createElement("img");

        img.src = "img/characters/" + character.image;

        img.classList.add("character");

        img.classList.add(character.position);

        img.classList.add("fade-character");

        if (character.animation) {

            img.classList.add(character.animation);

        }

        characterLayer.appendChild(img);

    });

}

// =============================
// Dialogue
// =============================

function updateDialogue(scene) {

    dialogueBox.classList.remove(
        "speech",
        "thought",
        "narration"
    );

    dialogueBox.classList.add(scene.type);

    if (scene.type === "narration") {

        speaker.style.display = "none";

    } else {

        speaker.style.display = "block";
        speaker.textContent = scene.speaker;

    }

    dialogue.classList.remove("dialogueFade");

    void dialogue.offsetWidth;

    dialogue.innerHTML = scene.text;

    dialogue.classList.add("dialogueFade");

}

// =============================
// Buttons
// =============================

function updateButtons() {

    previousBtn.disabled = currentIndex === 0;

    nextBtn.disabled = currentIndex === chapter1.length - 1;

}

// =============================
// Navigation
// =============================

function nextDialogue() {

    if (currentIndex >= chapter1.length - 1)
        return;

    currentIndex++;

    renderScene();

}

function previousDialogue() {

    if (currentIndex <= 0)
        return;

    currentIndex--;

    renderScene();

}