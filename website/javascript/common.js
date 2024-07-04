// Include header
fetch('./html/header.html')
  .then((response) => response.text())
  .then((data) => {
    document.getElementById('header-include').innerHTML = data;
  });

// Include footer
fetch('./html/footer.html')
  .then((response) => response.text())
  .then((data) => {
    const currentYear = new Date().getFullYear();

    document.getElementById('footer-include').innerHTML = data;
    document.getElementById('current-year').textContent = currentYear;
  });

// Adjust body padding
const adjustBodyPadding = () => {
  const header = document.getElementById('header-include');
  const headerHeight = header.offsetHeight;
  document.body.style.paddingTop = headerHeight + 'px';
};

// Adjust main height
const adjustMainHeight = () => {
  const viewportHeight = window.innerHeight;
  const headerHeight = document.querySelector('#header-include').offsetHeight;
  const footerHeight = document.querySelector('#footer-include').offsetHeight;
  const mainElement = document.querySelector('main');
  const totalHeight = viewportHeight - headerHeight - footerHeight;
  mainElement.style.minHeight = `${totalHeight}px`;
};

window.addEventListener('load', adjustMainHeight);
window.addEventListener('resize', adjustMainHeight);

window.onload = adjustBodyPadding;
window.onresize = adjustBodyPadding;
