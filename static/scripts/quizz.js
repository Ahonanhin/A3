const quizData = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correct: 1
    },
    // Add more questions here
  ];

  let currentQuestion = 0;
  let score = 0;

  const quizQuestion = document.querySelector(".quiz-question");
  const quizOptions = document.querySelectorAll(".quiz-option");
  const nextQuestionBtn = document.querySelector(".next-question");
  const scoreNumber = document.querySelector(".score-number");

  function updateQuestion() {
    quizQuestion.textContent = quizData[currentQuestion].question;
    quizOptions.forEach((option, index) => {
      option.textContent = quizData[currentQuestion].options[index];
    });
  }

  function checkAnswer(answer) {
    if (answer == quizData[currentQuestion].correct) {
      score++;
      scoreNumber.textContent = score;
    }
  }

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      updateQuestion();
    } else {
      alert("Quiz completed! Your score: " + score);
      // Reset the quiz
      currentQuestion = 0;
      score = 0;
      scoreNumber.textContent = score;
      updateQuestion();
    }
  }

  quizOptions.forEach((option) => {
    option.addEventListener("click", () => {      
    const answer = option.getAttribute("data-option");
    checkAnswer(answer);
  });
});

nextQuestionBtn.addEventListener("click", nextQuestion);

updateQuestion(); // Load the first question on page load