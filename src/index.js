const headerSnapMenuOpen = document.querySelector('.header__snap--open');
const headerSnapMenuClose = document.querySelector('.header__snap--close');

headerSnapMenuOpen.addEventListener('click', () => {
  headerSnapMenuOpen.classList.remove('hidden-menu')
})

headerSnapMenuClose.addEventListener('click', () => {
  headerSnapMenuOpen.classList.add('hidden-menu')
})