//Purpose: This file contains JavaScript code for our website that handles user authentication
// and other related functionalities, such as registering a new user, logging in,
// displaying user information, logging out, and deleting user account.
// It also includes functions to fetch past quizzes and populate quiz results table.


document.getElementById('login-link').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Clear the input fields in the signup box
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  
    // Hide the signup box and display the login box
    document.getElementById('signup-box').style.display = 'none';
    document.getElementById('table').style.display = 'none';
    document.getElementById('login-box').style.display = 'block';
  });
  
  document.getElementById('signup-link').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Hide the login box and display the signup box
    document.getElementById('signup-box').style.display = 'block';
    document.getElementById('table').style.display = 'none';
    document.getElementById('login-box').style.display = 'none';
  });

  document.querySelector('#signup-box .submit').addEventListener('click', async function(event) {
    event.preventDefault();
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      }),
      });
      
      if (response.ok) {
      // Clear the input fields in the signup box
      document.getElementById('username').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      document.getElementById('confirm-password').value = '';

      // Hide the signup box and display the user info box
      document.getElementById('signup-box').style.display = 'none';
      document.getElementById('user-info').style.display = 'block';
      updateUserInfo();
    } else {
      const error = await response.json();
      alert(error.error);
      }
      });
      
      document.querySelector('#login-box .submit').addEventListener('click', async function(event) {
      event.preventDefault();
      const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      username: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value,
      }),
      });
      
      if (response.ok) {
      // Clear the input fields in the login box
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';
      // Hide the login box and display the user info box
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('user-info').style.display = 'block';
  document.getElementById('table').style.display = 'block';

  updateUserInfo();
} else {
  const error = await response.json();
  alert(error.error);
  }
  });
  
  document.getElementById('logout-button').addEventListener('click', async function(event) {
  event.preventDefault();
  const response = await fetch('/logout', { method: 'POST' });
  
  if (response.ok) {
  // Hide the user info box and display the login box
  document.getElementById('user-info').style.display = 'none';
  document.getElementById('table').style.display = 'none';
  document.getElementById('login-box').style.display = 'block';
  } else {
  const error = await response.json();
  alert(error.error);
  }
  });
  
  async function updateUserInfo() {
    // Fetch user info from the server
    const response = await fetch('/user_info');
    const data = await response.json();
    
    if (response.ok) {
      // Update the user info box with the received data
      document.getElementById('user-username').innerText = data.username;
      document.getElementById('user-email').innerText = data.email;
    } else {
      // Display an error message if fetching user info fails
      alert(data.error);
    }
  }
  
  // Event listener for the click event on the delete user button
  document.getElementById('delete-user-btn').addEventListener('click', async function() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Send a request to delete the user account to the server
        const response = await fetch('/delete_user', {method: 'POST'});
        const result = await response.json();
        if (response.ok) {
          // Display success message and redirect to home page after successful deletion
          alert('User account deleted successfully.');
          window.location.href = '/';
        } else {
          // Display error message if user account deletion fails
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  });
  
  async function checkLoginStatus() {
    // Fetch login status from the server
    const response = await fetch('/check_login');
    const data = await response.json();
    
    if (data.is_logged_in) {
      // Hide the signup and login boxes, and display the user info box if user is logged in
      document.getElementById('signup-box').style.display = 'none';
      document.getElementById('login-box').style.display = 'none';
      document.getElementById('user-info').style.display = 'block';
      
      // Update the user info box with the received data
      document.getElementById('user-username').innerText = data.username;
      document.getElementById('user-email').innerText = data.email;
    } else {
      // Display the login box and hide the signup and user info boxes if user is not logged in
      document.getElementById('login-box').style.display = 'block';
      document.getElementById('signup-box').style.display = 'none';
      document.getElementById('user-info').style.display = 'none';
    }
  }
  
  async function fetchPastQuizzes() {
    // Fetch past quizzes from the server
    const response = await fetch('/past_quizzes');
    if (response.ok) {
      // If response is successful, parse response body as JSON and return it
      return response.json();
    } else {
      // If response is not successful, throw an error
      throw new Error('Failed to fetch past quizzes');
    }
  }
  
  function populateQuizResultsTable(quizResults) {
    // Populate the quiz results table with data
    const tableBody = document.getElementById('quiz-results-table').tBodies[0];
    tableBody.innerHTML = '';
    for (const quiz of quizResults) {
      // Create a row for each quiz in the table and populate its cells
      const row = tableBody.insertRow();
      const dateCell = row.insertCell();
      const scoreCell = row.insertCell();
      const totalQuestionsCell = row.insertCell();
      dateCell.textContent = quiz.date_taken;
      scoreCell.textContent = quiz.score;
      totalQuestionsCell.textContent = quiz.total_questions;
    }
    // Display a message if there are no quiz results
    if (quizResults.length === 0) {
      document.getElementById('no-quizzes-message').style.display = 'block';
    } else {
      document.getElementById('no-quizzes-message').style.display = 'none';
    }
  }
  
  document.getElementById('date-filter').addEventListener('input', async (event) => {
    // Event listener for the date filter input
    // Fetch past quizzes from the server and filter them by the selected date
    const filterDate = event.target.value;
    const quizResults = await fetchPastQuizzes();
    const filteredQuizzes = quizResults.filter(quiz => quiz.date_taken === filterDate);
    // Populate the quiz results table with the filtered quizzes
    populateQuizResultsTable(filteredQuizzes);
  });
  
  document.getElementById('sort-by').addEventListener('change', updateQuizResults);
  document.getElementById('sort-order').addEventListener('change', updateQuizResults);
  document.getElementById('score-filter-input').addEventListener('input', updateQuizResults);
  
  async function updateQuizResults() {
    // Update quiz results based on the selected sorting and filtering options
    const sortBy = document.getElementById('sort-by').value;
    const sortOrder = document.getElementById('sort-order').value;
    const scoreFilter = parseInt(document.getElementById('score-filter-input').value, 10) || null;
    // Fetch past quizzes from the server with the selected options
    const sortedQuizzes = await fetchPastQuizzes(sortBy, sortOrder, scoreFilter);
    // Populate the quiz results table with the sorted quizzes
    populateQuizResultsTable(sortedQuizzes);
  }
  
  async function fetchPastQuizzes(sortBy = 'date', sortOrder = 'asc', scoreFilter = null) {
    // Fetch past quizzes from the server with optional sorting and filtering options
    let url = `/past_quizzes?sort_by=${sortBy}&sort_order=${sortOrder}`;
    if (scoreFilter !== null) {
      url += `&score_filter=${scoreFilter}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  
  // Call the checkLoginStatus function when the page is loaded
  window.addEventListener('DOMContentLoaded', checkLoginStatus);
  