const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const instructions = document.querySelector('.instructions');
const lessonContainer = document.getElementById('lessonContainer');
const lessonText = document.getElementById('lessonText');
const nextLesson = document.getElementById('nextLesson');
const startButton = document.getElementById('startButton');

const quizContainer = document.getElementById('quizContainer');
const quizQuestion = document.getElementById('quizQuestion');
const quizAnswer = document.getElementById('quizAnswer');
const submitAnswer = document.getElementById('submitAnswer');
const backToLesson = document.getElementById('backToLesson');
const quizFeedback = document.getElementById('quizFeedback');

let currentLesson = 0;
let currentQuiz = 0;
let lessons = [
    "The discovery of X-rays by Wilhelm Conrad Roentgen in 1895 revolutionized medical diagnostics.",
    "Radiation safety is critical to minimizing exposure to ionizing radiation. The ALARA principle stands for As Low As Reasonably Achievable.",
    "Radiation comes in two forms: ionizing and non-ionizing. Examples of ionizing radiation include X-rays, and non-ionizing includes ultraviolet light."
];

let quizzes = [
    {
        question: "Who discovered X-rays?",
        answer: "Wilhelm Roentgen"
    },
    {
        question: "What does ALARA stand for?",
        answer: "As Low As Reasonably Achievable"
    },
    {
        question: "What type of radiation includes ultraviolet light?",
        answer: "Non-ionizing"
    }
];

let gameStarted = false;
let xrayMachine = { x: 200, y: 300, width: 50, height: 20 };
let dummy = { x: 600, y: 300, radius: 30 };
let beam = { x: 0, y: 0, width: 100, height: 5, active: false };

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

    if (e.key === 'ArrowUp' && xrayMachine.y > 0) {
        xrayMachine.y -= 20;
    } else if (e.key === 'ArrowDown' && xrayMachine.y < canvas.height - xrayMachine.height) {
        xrayMachine.y += 20;
    } else if (e.key === ' ') {
        fireBeam();
    }
    drawGame();
});

function fireBeam() {
    beam.x = xrayMachine.x + xrayMachine.width;
    beam.y = xrayMachine.y + xrayMachine.height / 2;
    beam.active = true;

    drawGame();

    setTimeout(() => {
        if (Math.abs(beam.y - dummy.y) < dummy.radius) {
            alert("The X-ray targeted the dummy correctly!");
        } else {
            alert("The X-ray missed the dummy. Try again.");
        }
        beam.active = false;
        drawGame();
    }, 500);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw X-ray machine
    ctx.fillStyle = 'gray';
    ctx.fillRect(xrayMachine.x, xrayMachine.y, xrayMachine.width, xrayMachine.height);

    // Draw dummy
    ctx.beginPath();
    ctx.arc(dummy.x, dummy.y, dummy.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'pink';
    ctx.fill();
    ctx.closePath();

    // Draw beam
    if (beam.active) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(beam.x, beam.y - beam.height / 2, beam.width, beam.height);
    }
}

startButton.addEventListener('click', () => {
    instructions.classList.add('hidden');
    lessonContainer.classList.remove('hidden');
    lessonText.textContent = lessons[currentLesson];
});

nextLesson.addEventListener('click', () => {
    lessonContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    quizQuestion.textContent = quizzes[currentQuiz].question;
});

submitAnswer.addEventListener('click', () => {
    const userAnswer = quizAnswer.value.trim().toLowerCase();
    const correctAnswer = quizzes[currentQuiz].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        quizFeedback.textContent = "Correct!";
        quizFeedback.style.color = "green";
        quizFeedback.classList.remove('hidden');

        setTimeout(() => {
            quizFeedback.classList.add('hidden');
            quizAnswer.value = "";
            currentQuiz++;
            currentLesson++;

            if (currentLesson < lessons.length) {
                lessonText.textContent = lessons[currentLesson];
                quizContainer.classList.add('hidden');
                lessonContainer.classList.remove('hidden');
            } else {
                quizContainer.classList.add('hidden');
                canvas.classList.remove('hidden');
                gameStarted = true;
                drawGame();
            }
        }, 1000);
    } else {
        quizFeedback.textContent = "Incorrect. Try again.";
        quizFeedback.style.color = "red";
        quizFeedback.classList.remove('hidden');
    }
});

backToLesson.addEventListener('click', () => {
    quizContainer.classList.add('hidden');
    lessonContainer.classList.remove('hidden');
    quizAnswer.value = "";
    quizFeedback.classList.add('hidden');
    lessonText.textContent = lessons[currentLesson];
});