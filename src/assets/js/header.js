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


// (function () {
//     var pageName = document.querySelector('.page__single');
//     var header = document.querySelector('header');
//
//     if (pageName) {
//         header.classList.add('fixed');
//         header.classList.add('bg__color');
//     } else {
//         header.classList.add('bg__color');
//     }
// })();

(function() {
    var header = document.querySelector('header');
    //
    // window.scroll(function() {
    //     if (header.scrollTop() >= 300) {
    //         header.classList.remove('absolute');
    //     } else {
    //         header.classList.add('absolute');
    //     }
    // });

    // window.onscroll = function() {scrollFunction()};

    // function scrollFunction() {
    //     if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    //         document.querySelector('header').classList.remove('transparent');
    //     } else {
    //         document.querySelector('header').classList.add('transparent');
    //     }
    // }
})();