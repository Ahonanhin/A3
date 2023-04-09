document.getElementById('login-link').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Clear the input fields in the signup box
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  
    // Hide the signup box and display the login box
    document.getElementById('signup-box').style.display = 'none';
    document.getElementById('login-box').style.display = 'block';
  });
  
  document.getElementById('signup-link').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Hide the login box and display the signup box
    document.getElementById('signup-box').style.display = 'block';
    document.getElementById('login-box').style.display = 'none';
  });
  