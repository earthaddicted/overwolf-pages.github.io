const OverlayManager = (function () {
  const blackOverlay = document.getElementById("black-overlay");    
  
  function OverlayManager() {
    this.onShouldCloseOverlaysHandlers = [];
    blackOverlay.onclick = () => { this.invokeShouldCloseOverlays(); };
  }

  OverlayManager.prototype.invokeShouldCloseOverlays = function() {
    for (let handler of this.onShouldCloseOverlaysHandlers) {
      handler();
    }
  }

  OverlayManager.prototype.showOverlay = function() {
    blackOverlay.classList.add("active");
  }

  OverlayManager.prototype.hideOverlay = function() {
    blackOverlay.classList.remove("active");
  }

  OverlayManager.prototype.addShouldCloseOverlaysListener = function(handler) {
    this.onShouldCloseOverlaysHandlers.push(handler);
  }

  return OverlayManager;
}());

const overlayManager = new OverlayManager();

const HeaderManager = (function () {
  const hamburgerButton = document.getElementById("hamburger-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const submenuParents = document.querySelectorAll("#mobile-menu li.submenu-parent");
  let overlay;
  
  function HeaderManager(overlayArg) {                
    overlay = overlayArg;
    registerEvents();
  }

  const registerEvents = function() {
    hamburgerButton.onclick = () => { 
      if (hamburgerButton.classList.contains("close")) {
        hideMobileMenu();
      } else {
        showMobileMenu();
      }
    };
    
    // Submenu clicks
    for (let submenuParent of submenuParents) {
      submenuParent.getElementsByTagName("a")[0].onclick = () => { toggleSubmenu(submenuParent); };
    }

    overlay.addShouldCloseOverlaysListener(() => {
      hideMobileMenu();
    });
  }

  const showMobileMenu = function() {
    overlay.invokeShouldCloseOverlays();
    mobileMenu.classList.add("active");
    overlay.showOverlay();
    hamburgerButton.classList.add("close");
  };

  const hideMobileMenu = function() {
    mobileMenu.classList.remove("active");
    overlay.hideOverlay();
    for (let submenuParent of submenuParents) {
      hideSubmenu(submenuParent);
    }
    hamburgerButton.classList.remove("close");
  };

  const toggleSubmenu = function(submenuParent) {
    const submenu = submenuParent.getElementsByClassName("submenu")[0];
    submenu.classList.toggle("active");
  }

  const hideSubmenu = function(submenuParent) {
    const submenu = submenuParent.getElementsByClassName("submenu")[0];
    submenu.classList.remove("active");
  }

  return HeaderManager;
}());

const headerManager = new HeaderManager(overlayManager);

(function () {
  var pageName = document.querySelector('.page__brand');
  var header = document.querySelector('header');

  if (pageName) {
    header.classList.add('fixed');
    header.classList.add('transparent');
  } else {
    header.classList.add('bg__color');
  }
})();

(function() {
  var header = document.querySelector('header');

  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
          document.querySelector('header').classList.remove('transparent');
      } else {
          document.querySelector('header').classList.add('transparent');
      }
  }
})();