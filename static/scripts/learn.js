document.querySelector(".search-enter-btn").addEventListener("click", async function() {
    const searchInput = document.querySelector(".search-input").value;
    const response = await fetch(`/country_info?query=${searchInput}`);
    const data = await response.json();
  
    if (data.error) {
      document.getElementById("result").innerHTML = data.error;
    } else {
      document.getElementById("capital").innerHTML = `Capital:  ${data.capital}`;
      document.getElementById("continent").innerHTML = `Continent:  ${data.continentName}`;
      document.getElementById("population").innerHTML = `Population:  ${data.population} inhabitants`;
      document.getElementById("currency").innerHTML = `Currency: ${data.currencyCode}`;
    }
  });
  