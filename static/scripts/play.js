// Purpose: This function loads quiz questions from the server for a selected continent
// It sets the selected continent in session storage, fetches data from the server using POST method with JSON body
// and credentials included, and handles the response and any errors that may occur during the fetch

function loadQuestions(continent) {
  // Set the selected continent in session storage
  sessionStorage.setItem('selectedContinent', continent);

  // Fetch data from the server using POST method with JSON body and credentials included
  fetch('/quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ selectedContinent: continent }),
    credentials: 'include'
  })
    .then((response) => {
      // Check if the response is not OK and log an error message
      if (!response.ok) {
        console.error('An error occurred:', response.statusText);
      }
      // Parse the response data as JSON
      return response.json();
    })
    .then((questions) => {
      // Set the retrieved questions in session storage
      sessionStorage.setItem('questions', JSON.stringify(questions));
      // Redirect to the '/quiz' page
      window.location.href = '/quiz';
    })
    .catch((error) => {
      // Log an error message for any catch errors during fetch
      console.error('Error during fetch:', error);
    });
}