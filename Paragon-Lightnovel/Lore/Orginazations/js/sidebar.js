const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.sidebar-toggle');
toggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  document.body.classList.toggle('sidebar-open');
});
