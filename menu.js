document.addEventListener('DOMContentLoaded', function () {
  var navLinks = document.getElementById('navLinks');

  // Done so that the website loads before the checkincode is used DONT remove or crash happens
  window.showMenu = function () {
    if (!navLinks) return;
    navLinks.style.right = '0';
  };
  window.hideMenu = function () {
    if (!navLinks) return;
    navLinks.style.right = '-200px';
  };

  var ddParents = document.querySelectorAll('.nav-links ul li.has-dropdown');
  console.log('Found dropdown parents:', ddParents.length);
  
  ddParents.forEach(function (li) {
    var a = li.querySelector(':scope > a');
    if (!a) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      ddParents.forEach(function (other) {
        if (other !== li) other.classList.remove('open');
      });
      li.classList.toggle('open');
      console.log('Dropdown toggled, has open class:', li.classList.contains('open'));
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-links')) {
      ddParents.forEach(function (li) {
        li.classList.remove('open');
      });
    }
  });
});
