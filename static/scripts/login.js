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
  document.getElementById('login-box').style.display = 'block';
  } else {
  const error = await response.json();
  alert(error.error);
  }
  });
  
  async function updateUserInfo() {
  const response = await fetch('/user_info');
  const data = await response.json();
  
  if (response.ok) {
  document.getElementById('user-username').innerText = data.username;
  document.getElementById('user-email').innerText = data.email;
  } else {
  alert(data.error);
  }
  }

  