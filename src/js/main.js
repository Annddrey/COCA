const pageHeader = document.querySelector('.page-header');
const mainNav = document.querySelector('.page-header__nav');
const mainNavToggle =  document.querySelector('.page-header__button-nav');

if(mainNavToggle) {
  mainNavToggle.addEventListener('click', () => {
    mainNav.classList.toggle('page-header__nav--opened');
    mainNav.classList.toggle('page-header__nav--closed');

    pageHeader.classList.toggle('page-header--opened-menu');
  })
}
