const mainNav = document.querySelector('.page-header__nav');
const mainNavToggle =  document.querySelector('.page-header__button-nav');

if(mainNav) {
  mainNavToggle.addEventListener('click', () => {
    mainNav.classList.remove('page-header__nav--opened');
    mainNav.classList.toggle('page-header__nav--closed');
  })
}
