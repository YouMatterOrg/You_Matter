document.addEventListener('DOMContentLoaded', function () {
  var navLinks = document.getElementById('navLinks');

  // expose functions for onclick attributes
  window.showMenu = function () {
    if (!navLinks) return;
    navLinks.style.right = '0';
  };
  window.hideMenu = function () {
    if (!navLinks) return;
    navLinks.style.right = '-200px';
  };

  // dropdown click-to-toggle (keeps hover behavior for desktop via CSS)
  var ddParents = document.querySelectorAll('.nav-links ul li.has-dropdown');
  ddParents.forEach(function (li) {
    var a = li.querySelector(':scope > a');
    if (!a) return;
    a.addEventListener('click', function (e) {
      // Prevent navigation when clicking the COURSE label; open dropdown instead
      e.preventDefault();
      ddParents.forEach(function (other) {
        if (other !== li) other.classList.remove('open');
      });
      li.classList.toggle('open');
    });
  });

  // close dropdowns when clicking outside nav
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-links')) {
      ddParents.forEach(function (li) {
        li.classList.remove('open');
      });
    }
  });
});
