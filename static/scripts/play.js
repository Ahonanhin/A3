function loadQuestions(continent) {
    sessionStorage.setItem('selectedContinent', continent);
  
    fetch('/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selectedContinent: continent }),
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          console.error('An error occurred:', response.statusText);
        }
        return response.json();
      })
      .then((questions) => {
        sessionStorage.setItem('questions', JSON.stringify(questions));
        window.location.href = '/quiz';
      })
      .catch((error) => {
        console.error('Error during fetch:', error);
      });
  }
  