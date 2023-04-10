let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function loadQuestions(continent) {
  const response = await fetch(`/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({selectedContinent: continent}),
  });
  const data = await response.json();
  startQuiz(data); // Change this line
}

document.addEventListener('DOMContentLoaded', async () => {
  const selectedContinent = sessionStorage.getItem('selectedContinent');
  if (!selectedContinent) {
      // Redirect to the homepage if no continent is selected
      window.location.href = '/';
      return;
  }
  await loadQuestions(selectedContinent);
});

function startQuiz(loadedQuestions) {
    questions = loadedQuestions;
    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        // Show the final score and end the quiz
        alert(`Your score: ${score}`);
        submitQuiz(); // Add this line
        return;
    }

    const question = questions[currentQuestionIndex];
    const quizQuestion = document.querySelector('.quiz-question');
    const quizOptions = document.querySelectorAll('.quiz-option');

    quizQuestion.textContent = question.question;

    for (let i = 0; i < question.options.length; i++) {
        quizOptions[i].textContent = question.options[i];
    }
}

const quizOptions = document.querySelectorAll('.quiz-option');
let selectedOption;

function updateSelectedOption(clickedOption) {
  quizOptions.forEach((option) => {
    if (option === clickedOption) {
      option.classList.add('selected-option');
    } else {
      option.classList.remove('selected-option');
    }
  });
}

quizOptions.forEach((option) => {
  option.addEventListener('click', (e) => {
    selectedOption = e.target;
    updateSelectedOption(e.target);
  });
});

const nextQuestionBtn = document.querySelector('.next-question');
nextQuestionBtn.addEventListener('click', () => {
  // Validate the answer and update the score if the answer is correct
  if (selectedOption && selectedOption.textContent === questions[currentQuestionIndex].correctAnswer) {
    score++;
  }
  
  // Update the score display
  updateScoreDisplay();
  
  // Move on to the next question
  currentQuestionIndex++;
  displayQuestion();
  
  // Reset the selected option
  selectedOption = null;
});


function updateScoreDisplay() {
  const scoreElement = document.getElementById('scorenum');
  scoreElement.textContent = score;
}

async function submitQuiz() {
  const date = new Date();
  const date_taken = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const quiz_data = {
    date_taken: date_taken,
    score: score,
    total_questions: questions.length,
  };

  const response = await fetch('/submit_quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quiz_data),
  });

  if (response.status === 401) {
    alert('You must be logged in to submit quiz results.');
    return;
  }

  const data = await response.json();
  if (data.success) {
    alert(`Your score: ${score}`);
  } else {
    alert('An error occurred while submitting your quiz results. Please try again later.');
  }
}