const hamburger = document.querySelector('.hamburger');
const menuList = document.querySelector('.menu-list');
hamburger.addEventListener('click', () => {
  menuList.classList.toggle('open');
  hamburger.classList.toggle('menu-open');
});
document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', function(e) {
    menuList.classList.remove('open');
    hamburger.classList.remove('menu-open');
    // Smooth scroll to section
    const href = link.getAttribute('href');
    const section = document.querySelector(href);
    if (section) {
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active-section'));
      section.classList.add('active-section');
    }
  });
});