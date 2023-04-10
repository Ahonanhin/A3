// Purpose: Add an event listener to the element with class 'search-enter-btn', which represents the search button
// When the 'search-enter-btn' element is clicked, the event listener triggers an async function that fetches data from the server
// based on the search query entered in the input field with class 'search-input'

// Add an event listener to the element with class 'search-enter-btn', which represents the search button
document.querySelector(".search-enter-btn").addEventListener("click", async function() {
  // Get the value of the input field with class 'search-input', which represents the search query
  const searchInput = document.querySelector(".search-input").value;
  // Fetch data from the server using the fetch API with the search query as a parameter in the URL
  const response = await fetch(`/country_info?query=${searchInput}`);
  // Parse the response data as JSON
  const data = await response.json();

  // If there is an error in the response data
  if (data.error) {
      // Update the inner HTML of the element with ID 'result' to display the error message
      document.getElementById("result").innerHTML = data.error;
  } else {
      // Update the inner HTML of elements with IDs 'capital', 'continent', 'population', and 'currency'
      // to display the corresponding data retrieved from the server
      document.getElementById("capital").innerHTML = `Capital:  ${data.capital}`;
      document.getElementById("continent").innerHTML = `Continent:  ${data.continentName}`;
      document.getElementById("population").innerHTML = `Population:  ${data.population} inhabitants`;
      document.getElementById("currency").innerHTML = `Currency: ${data.currencyCode}`;
  }
});