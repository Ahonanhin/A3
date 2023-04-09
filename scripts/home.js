document.getElementById('hamburger').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
  });