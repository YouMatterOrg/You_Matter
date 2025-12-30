document.addEventListener('DOMContentLoaded', function () {
  // Trigger global nav slide-in once DOM is ready
  requestAnimationFrame(function(){
    setTimeout(function(){
      document.body.classList.add('nav-ready');
    }, 30);
  });

  // Reveal: slide-in elements when entering viewport
  try {
    var revealEls = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
    if (revealEls && revealEls.length) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

      revealEls.forEach(function(el){ io.observe(el); });
    }
  } catch (e) {
    // Fallback: if IntersectionObserver unsupported, show immediately
    var fallbackEls = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
    fallbackEls.forEach(function(el){ el.classList.add('in-view'); });
  }
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
    
    // Prevent navigation on parent link, just toggle dropdown
    a.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Close other dropdowns
      ddParents.forEach(function (other) {
        if (other !== li) other.classList.remove('open');
      });
      
      // Toggle current dropdown
      li.classList.toggle('open');
      console.log('Dropdown toggled, open class:', li.classList.contains('open'));
    });
    
    // Handle dropdown item clicks - allow them to navigate normally
    var dropdown = li.querySelector('.dropdown');
    if (dropdown) {
      var dropdownItems = dropdown.querySelectorAll('a');
      dropdownItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
          console.log('Dropdown item clicked:', item.href);
          // Don't prevent default - let the link navigate
          // Just close the dropdown
          li.classList.remove('open');
          // Allow the click to proceed naturally
        });
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    // Check if click is outside nav-links
    var clickedInNav = e.target.closest('.nav-links');
    if (!clickedInNav) {
      ddParents.forEach(function (li) {
        li.classList.remove('open');
      });
    }
  });
});
