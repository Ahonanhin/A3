// Purpose: Add an event listener to the element with ID 'hamburger', which represents a hamburger menu button
// When the 'hamburger' element is clicked, the event listener triggers a function that toggles the display property of the 'menu' element
// between 'flex' and 'none' to show or hide the menu

// Add an event listener to the element with ID 'hamburger', which represents a hamburger menu button
document.getElementById('hamburger').addEventListener('click', () => {
  // Get the element with ID 'menu', which represents the menu to be shown/hidden
  const menu = document.getElementById('menu');
  // Toggle the display property of the menu element between 'flex' and 'none' to show/hide the menu
  menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
  });