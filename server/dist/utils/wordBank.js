"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWord = generateWord;
// 📚 Word list for the Hangman game
function generateWord(difficulty) {
    const easyWords = [
        { word: "cat", hint: "A small pet that loves to chase mice." },
        { word: "sun", hint: "The center of our solar system." },
        { word: "cup", hint: "You use this to drink water or tea." },
    ];
    const mediumWords = [
        { word: "planet", hint: "Earth is one of these." },
        { word: "basket", hint: "You carry fruits in this." },
        { word: "button", hint: "You fasten your shirt with this." },
    ];
    const hardWords = [
        { word: "astronomy", hint: "The scientific study of stars and planets." },
        { word: "algorithm", hint: "A step-by-step method for solving a problem." },
        { word: "symbiosis", hint: "Relationship where two organisms live closely together." },
    ];
    let pool = easyWords;
    if (difficulty === "medium")
        pool = mediumWords;
    else if (difficulty === "hard")
        pool = hardWords;
    const random = pool[Math.floor(Math.random() * pool.length)];
    return random; // { word: "planet", hint: "Earth is one of these." }
}
