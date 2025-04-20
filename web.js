if (localStorage.highscore == undefined) {
    document.querySelector('#highscore').innerText = "0"
    document.querySelector('#p3hs').innerText = "0"
} else {
    document.querySelector('#highscore').innerText = localStorage.highscore
    document.querySelector('#p3hs').innerText = localStorage.highscore
}
const correctSound = new Audio('/assets/correct.mp3');
const errorSound = new Audio('/assets/wrong.mp3');
const vol = document.querySelector('#vol');
const close = document.querySelector('#close');
const menu = document.querySelector('#menu');
const start = document.querySelector('.start_box');
const p2 = document.querySelector('.page2');
const next_btn = document.querySelector('#next');
const ans = document.getElementsByClassName('ans')
const allanswer = document.getElementsByClassName('answer')
const audio = document.querySelector('#bgmusic');

let sec = 30;
let intervalId;
let level = 1;
let flag = true;
let hscore = 0;
let score = 0;

const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["A) Berlin", "B) Madrid", "C) Paris", "D) Rome"],
        correctAnswer: "C) Paris"
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ["A) Harper Lee", "B) J.K. Rowling", "C) Ernest Hemingway", "D) Mark Twain"],
        correctAnswer: "A) Harper Lee"
    },
    {
        question: "What is the smallest planet in our solar system?",
        options: ["A) Mars", "B) Mercury", "C) Venus", "D) Earth"],
        correctAnswer: "B) Mercury"
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["A) Gold", "B) Oxygen", "C) Osmium", "D) Iron"],
        correctAnswer: "B) Oxygen"
    },
    {
        question: "What is the square root of 64?",
        options: ["A) 6", "B) 7", "C) 8", "D) 9"],
        correctAnswer: "C) 8"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["A) Jupiter", "B) Mars", "C) Saturn", "D) Venus"],
        correctAnswer: "B) Mars"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["A) Vincent van Gogh", "B) Pablo Picasso", "C) Leonardo da Vinci", "D) Michelangelo"],
        correctAnswer: "C) Leonardo da Vinci"
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["A) Elephant", "B) Whale Shark", "C) Blue Whale", "D) Giraffe"],
        correctAnswer: "C) Blue Whale"
    },
    {
        question: "What is the chemical formula for water?",
        options: ["A) CO2", "B) H2O", "C) O2", "D) H2O2"],
        correctAnswer: "B) H2O"
    },
    {
        question: "What is the tallest mountain in the world?",
        options: ["A) K2", "B) Kangchenjunga", "C) Mount Everest", "D) Kilimanjaro"],
        correctAnswer: "C) Mount Everest"
    }
];

// 🎵 Start music on first interaction (Start button)
start.addEventListener("click", () => {
    // Try to play audio
    audio.play().then(() => {
        console.log("Music started");
    }).catch(err => {
        console.log("Autoplay blocked:", err);
    });

    p2.style.zIndex = '3';
    p2.style.opacity = '1';
    document.querySelector('.page1').style.display = 'none';
    document.querySelector('.level h2').innerText = level + "/10";
    changequestion();
    timer();
    level++;
    next_btn.style.display = "none";
});

menu.addEventListener("click", () => {
    document.querySelector('#showmenu').classList.remove('show')
});

close.addEventListener("click", () => {
    document.querySelector('#showmenu').classList.add('show')
});

// 🔊 Volume toggle button
// Mute audio by default
audio.muted = true;

// Volume toggle button
vol.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().then(() => {
            audio.muted = false;
            vol.textContent = "volume_up";
        }).catch(err => {
            console.log("Autoplay blocked:", err);
        });
    } else {
        if (audio.muted) {
            audio.muted = false;
            vol.textContent = "volume_up";
        } else {
            audio.muted = true;
            vol.textContent = "volume_off";
        }
    }
});


function timer() {
    document.querySelector('.timer h2').style.color = "white";
    p2.style.backgroundColor = "#cdffc3";
    sec = 15;
    intervalId = setInterval(run, 1000);
}

function run() {
    if (sec <= 0) {
        sec = 0;
        clearInterval(intervalId);
        next_btn.style.display = "block";
    }
    if (sec <= 5) {
        p2.style.backgroundColor = "#ffd9a3";
        document.querySelector('.timer h2').style.color = "red";
    } else if (sec <= 10) {
        p2.style.backgroundColor = "#fffea7";
        document.querySelector('.timer h2').style.color = "yellow";
    }

    document.querySelector('.timer h2').innerText = `${sec < 10 ? "0" + sec : sec} Sec`;
    sec--;
}

next_btn.addEventListener('click', () => {
    clearInterval(intervalId);
    flag = true;

    if (level >= 11) {
        p2.style.display = "none";
        document.querySelector('.page3').style.display = "flex";
        document.querySelector('.page3').style.zIndex = "100";
        document.querySelector('#highscore').innerText = localStorage.highscore;
        document.querySelector('#p3hs').innerText = localStorage.highscore;
        updatescore();
        return;
    }

    document.querySelector('.level h2').innerText = level + "/10";
    changequestion();
    timer();
    level++;
    next_btn.style.display = "none";

    for (let j = 0; j < 4; j++) {
        allanswer[j].classList.remove('correct', 'wrong');
        document.getElementsByClassName('material-icons all')[j].innerText = "";
    }
});

if (flag) {
    document.querySelector('.a1').addEventListener("click", () => {
        if (flag) checkans(0), flag = false;
    });
    document.querySelector('.a2').addEventListener("click", () => {
        if (flag) checkans(1), flag = false;
    });
    document.querySelector('.a3').addEventListener("click", () => {
        if (flag) checkans(2), flag = false;
    });
    document.querySelector('.a4').addEventListener("click", () => {
        if (flag) checkans(3), flag = false;
    });
}

function checkans(n) {
    let userch = allanswer[n].firstElementChild.innerText;

    if (userch === quizQuestions[level - 2].correctAnswer) {
        document.getElementsByClassName('material-icons all')[n].innerText = "check_circle";
        allanswer[n].classList.add('correct');
        correctSound.currentTime = 0;
        correctSound.play(); // ✅ Play correct sound
        score++;
        next_btn.style.display = "block";
    } else {
        document.getElementsByClassName('material-icons all')[n].innerText = "cancel";
        allanswer[n].classList.add('wrong');
        
        // Cut 1 second from the beginning of the error sound
        errorSound.currentTime = 1; // Start playing from 1 second onward
        errorSound.play(); // ❌ Play error sound

        // Delay the showing of next button to ensure sound plays first
        setTimeout(() => {
            next_btn.style.display = "block";
        }, (errorSound.duration - 1.5) * 1000); // Adjust for the 1 second cut
    }

    // Show the correct answer in both cases
    for (let i = 0; i < 4; i++) {
        if (allanswer[i].firstElementChild.innerText === quizQuestions[level - 2].correctAnswer) {
            document.getElementsByClassName('material-icons all')[i].innerText = "check_circle";
            allanswer[i].classList.add('correct');
        }
    }
}



document.querySelector('.retry').addEventListener('click', () => {
    location.reload();
});

function changequestion() {
    document.querySelector('.question p').innerText = quizQuestions[level - 1].question;
    for (let j = 0; j < 4; j++) {
        ans[j].innerText = quizQuestions[level - 1].options[j];
    }
}

function updatescore() {
    if (hscore < score) {
        hscore = score;
        localStorage.highscore = hscore;
        document.querySelector('#p3hs').innerText = localStorage.highscore;
    }

    var angle = (score / 10) * 360;
    var gradient = `conic-gradient(#35BD3A 0deg, #35BD3A ${angle}deg, rgb(255, 56, 56) ${angle}deg, rgb(255, 56, 56))`;
    document.querySelector('.lc').style.backgroundImage = gradient;
    document.querySelector('.sc h2').innerText = score + "/10";
}

document.querySelector('#resetscore').addEventListener("click", () => {
    localStorage.highscore = 0;
    document.querySelector('#p3hs').innerText = "0";
    document.querySelector('#highscore').innerText = "0";
});
