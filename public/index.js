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
        lessonText: "The discovery of X-rays by Wilhelm Roentgen in 1895 revolutionized medical diagnostics. Roentgen discovered X-rays while experimenting with cathode rays and noticed that these rays could pass through objects and produce an image of his wife, Anna Ludwig's, hand on a photographic plate.",
        quizzes: [
            {
                question: "Who discovered X-rays?",
                answer: "Wilhelm Roentgen"
            },
            {
                question: "In what year were X-rays discovered?",
                answer: "1895"
            },
            {
                question: "Who was first to have an x-ray tested on them?",
                answer: "Anna Ludwig"
            }
        ]
    },
    {
        lessonText: "Radiation safety is critical to minimizing exposure to ionizing radiation, especially in medical fields such as dental radiography. The primary guiding principle in radiation safety is ALARA, which stands for As Low As Reasonably Achievable. This principle encourages the reduction of radiation doses to the lowest possible level while still obtaining the necessary diagnostic information.",
        quizzes: [
            {
                question: "Which type of radiation do we aim to minimize exposure of?",
                answer: "Ionizing"
            },
            {
                question: "What is the radiation safety principle called?",
                answer: "ALARA"
            }
        ]
    },
    {
        lessonText: "Radiation comes in various forms and can be classified into two main categories: ionizing and non-ionizing radiation. Ionizing Radiation: This type of radiation has enough energy to remove tightly bound electrons from atoms, thus creating ions. Ionizing radiation is used in medical imaging, such as X-rays. Non-ionizing Radiation: This type of radiation has lower energy and does not ionize atoms. Examples include ultraviolet (UV) light. Non-ionizing radiation is generally less harmful but can still pose risks.",
        quizzes: [
            {
                question: "What type of radiation leads to the creation of ions?",
                answer: "Ionizing"
            },
            {
                question: "What is an example of ionizing radiation?",
                answer: "X-rays"
            },
            {
                question: "What is an example of non-ionizing radiation?",
                answer: "Ultraviolet Light"
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

let exposureLevel = 0; // Initial exposure level
const maxExposure = 100; // Maximum allowed exposure
const exposureStep = 10; // Step size for exposure adjustment

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

    if (e.key === 'ArrowUp' && xrayMachine.y > 0) {
        xrayMachine.y -= 20;
    } else if (e.key === 'ArrowDown' && xrayMachine.y < canvas.height - xrayMachine.height) {
        xrayMachine.y += 20;
    } else if (e.key === ' ') {
        fireBeam();
    }
     // Adjust exposure
     else if (e.key === 'ArrowRight') {
        adjustExposure(1); // Increase exposure
    } else if (e.key === 'ArrowLeft') {
        adjustExposure(-1); // Decrease exposure
    }
    drawGame();
});

function adjustExposure(direction) {
    exposureLevel = Math.min(Math.max(exposureLevel + direction * exposureStep, 0), maxExposure);
    alert(`Exposure level: ${exposureLevel}`);
}

function fireBeam() {
    beam.x = xrayMachine.x + xrayMachine.width;
    beam.y = xrayMachine.y + xrayMachine.height / 2;
    beam.active = true;

    drawGame();

    setTimeout(() => {
        if (Math.abs(beam.y - dummy.y) < adjustedRadius) {
            // Check exposure level when the beam hits Dexter
            if (exposureLevel >= 50 && exposureLevel <= 80) {
                alert("The X-ray correctly targeted Dexter!");
                dummy.image = dextersmile; // Update to smile
            } else if (exposureLevel < 50) {
                alert("Exposure too low! Adjust and try again.");
                dummy.image = dexterhurt; // Revert to hurt if missed
            } else {
                alert("Exposure too high! Risk of damage!");
                dummy.image = dexterhurt; // Revert to hurt if too high
            }
        } else {
            alert("The X-ray missed Dexter. Try again.");
            dummy.image = dexterhurt;
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

    // Display exposure level
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Exposure Level: ${exposureLevel}`, 10, 20);
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

// Handle quiz answer submission with Enter key
quizAnswer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
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
                    currentLesson++;
                    currentQuiz = 0; // Reset to the first quiz in the next lesson
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
            }, 1000);
        } else {
            quizFeedback.textContent = "Incorrect. Try again.";
            quizFeedback.style.color = "red";
            quizFeedback.classList.remove('hidden');
        }
    }
});


backToLesson.addEventListener('click', () => {
    quizContainer.classList.add('hidden');
    lessonContainer.classList.remove('hidden');
    quizAnswer.value = "";
    quizFeedback.classList.add('hidden');
    lessonText.textContent = lessons[currentLesson].lessonText;
});