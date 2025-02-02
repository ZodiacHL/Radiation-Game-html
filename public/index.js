const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dexterhurt = new Image();
const dextersmile = new Image();

dexterhurt.src = '/Dexter Hurt.png';
dextersmile.src = '/Dexter Smile.png';

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

let lessons = [
    {
        lessonText: "The discovery of X-rays by Wilhelm Conrad Roentgen in 1895 revolutionized medical diagnostics.",
        quizzes: [
            {
                question: "Who discovered X-rays?",
                answer: "1"
            },
            {
                question: "In what year were X-rays discovered?",
                answer: "2"
            }
        ]
    },
    {
        lessonText: "Radiation safety is critical to minimizing exposure to ionizing radiation. The ALARA principle stands for As Low As Reasonably Achievable.",
        quizzes: [
            {
                question: "What does ALARA stand for?",
                answer: "3"
            },
            {
                question: "Why is radiation safety important?",
                answer: "4"
            }
        ]
    },
    {
        lessonText: "Radiation comes in two forms: ionizing and non-ionizing. Examples of ionizing radiation include X-rays, and non-ionizing includes ultraviolet light.",
        quizzes: [
            {
                question: "What type of radiation includes ultraviolet light?",
                answer: "5"
            },
            {
                question: "What type of radiation is X-rays?",
                answer: "6"
            }
        ]
    }
];

// Adjust these scale factors to resize the image
const scaleFactor = 3.5; // 1.5 means 150% of the original size

let gameStarted = false;
let xrayMachine = { x: 200, y: 300, width: 50, height: 20 };
let dummy = { x: 600, y: 300, radius: 30, image: dexterhurt };
let beam = { x: 0, y: 0, width: 100, height: 5, active: false };

const adjustedRadius = dummy.radius * scaleFactor;

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
        if (Math.abs(beam.y - dummy.y) < adjustedRadius) {
            alert("The X-ray targeted Dexter correctly!");
            dummy.image = dextersmile; // Update the image to smile
        } else {
            alert("The X-ray missed Dexter. Try again.");
            dummy.image = dexterhurt; // Revert to hurt if missed
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

    ctx.imageSmoothingEnabled = true;  // Enable smoothing
    // Draw dummy using drawImage instead of createPattern
    ctx.save();
    ctx.beginPath();
    ctx.arc(dummy.x, dummy.y, adjustedRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip(); // Clip to ensure the circular shape
    ctx.drawImage(dummy.image, dummy.x - adjustedRadius, dummy.y - adjustedRadius, adjustedRadius * 2, adjustedRadius * 2);
    ctx.restore();

    // Draw beam
    if (beam.active) {
        ctx.fillStyle = 'green';
        ctx.fillRect(beam.x, beam.y - beam.height / 2, beam.width, beam.height);
    }
}

let currentLesson = 0; // Keep track of the current lesson
let currentQuiz = 0;    // Keep track of the current quiz in the current lesson

// Update lesson display
startButton.addEventListener('click', () => {
    instructions.classList.add('hidden');
    lessonContainer.classList.remove('hidden');
    quizContainer.classList.remove('hidden');
    lessonText.textContent = lessons[currentLesson].lessonText;
    quizQuestion.textContent = lessons[currentLesson].quizzes[currentQuiz].question;
});

// Move to next quiz within the current lesson
nextLesson.addEventListener('click', () => {
    if (currentQuiz !== 0) {
        quizContainer.classList.remove('hidden');
        quizQuestion.textContent = lessons[currentLesson].quizzes[currentQuiz].question;
    } else {
        if (currentQuiz === 0) {
            quizContainer.classList.remove('hidden');
        } else {
    
            if (currentQuiz + 1 < lessons[currentLesson].quizzes.length) {
                currentQuiz++; // Move to the next quiz
                
                quizQuestion.textContent = lessons[currentLesson].quizzes[currentQuiz].question;
            } else {
                // No more quizzes in this lesson, move to the next lesson
                currentLesson++;
                currentQuiz = 0; // Reset quiz to the first one in the next lesson
                if (currentLesson < lessons.length) {
                    lessonText.textContent = lessons[currentLesson].lessonText;
                    quizQuestion.textContent = lessons[currentLesson].quizzes[currentQuiz].question;
                    lessonContainer.classList.remove('hidden');
                } else {
                    // All lessons completed, start the game
                    lessonContainer.classList.add('hidden');
                    quizContainer.classList.add('hidden');
                    canvas.classList.remove('hidden');
                    gameStarted = true;
                    drawGame();
                }
            }
        }
    }
    
});

// Handle quiz answer submission
submitAnswer.addEventListener('click', () => {
    const userAnswer = quizAnswer.value.trim().toLowerCase();
    const correctAnswer = lessons[currentLesson].quizzes[currentQuiz].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        quizFeedback.textContent = "Correct!";
        quizFeedback.style.color = "green";
        quizFeedback.classList.remove('hidden');

        setTimeout(() => {
            quizFeedback.classList.add('hidden');
            quizAnswer.value = "";
            currentQuiz++;

            if (currentQuiz < lessons[currentLesson].quizzes.length) {
                quizQuestion.textContent = lessons[currentLesson].quizzes[currentQuiz].question;
            } else {
                if (currentQuiz + 1 < lessons[currentLesson].quizzes.length) {
                    currentQuiz++; // Move to the next quiz
                    
                    quizQuestion.textContent = lessons[currentLesson].quizzes[currentQuiz].question;
                } else {
                    // No more quizzes in this lesson, move to the next lesson
                    currentLesson++;
                    currentQuiz = 0; // Reset quiz to the first one in the next lesson
                    if (currentLesson < lessons.length) {
                        lessonText.textContent = lessons[currentLesson].lessonText;
                        quizQuestion.textContent = lessons[currentLesson].quizzes[currentQuiz].question;
                        lessonContainer.classList.remove('hidden');
                    } else {
                        // All lessons completed, start the game
                        lessonContainer.classList.add('hidden');
                        quizContainer.classList.add('hidden');
                        canvas.classList.remove('hidden');
                        gameStarted = true;
                        drawGame();
                    }
                }
                
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
    lessonText.textContent = lessons[currentLesson].lessonText;
});