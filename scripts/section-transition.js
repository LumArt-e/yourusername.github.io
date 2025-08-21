// Fade transition between sections and blur on scroll
document.querySelectorAll('.section').forEach(section => {
  section.classList.add('active-section');
});

window.addEventListener('scroll', () => {
  let lastY = window.scrollY;
  document.querySelectorAll('.section').forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight*0.7 && rect.bottom > window.innerHeight*0.3) {
      section.classList.remove('fade-section');
    } else {
      section.classList.add('fade-section');
    }
  });
});

// Transition between section visibility
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      entry.target.classList.remove('fade-section');
    } else {
      entry.target.classList.remove('fade-in');
      entry.target.classList.add('fade-section');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});