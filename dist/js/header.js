const HeaderManager = (function () {
    const hamburgerButton = document.getElementById("hamburger-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const submenuParents = document.querySelectorAll("#mobile-menu li.submenu-parent");
    let overlay;

    function HeaderManager(overlayArg) {
        overlay = overlayArg;
        registerEvents();
    }

    const registerEvents = function () {
        hamburgerButton.onclick = () => {
            if (hamburgerButton.classList.contains("close")) {
                hideMobileMenu();
            } else {
                showMobileMenu();
            }
        };

        // Submenu clicks
        for (let submenuParent of submenuParents) {
            submenuParent.getElementsByTagName("a")[0].onclick = () => {
                if (!isSubmenuActive(submenuParent)) {
                    submenuParents.forEach(function (currentSubmenuParent) {
                        hideSubmenu(currentSubmenuParent);
                    });
                }
                toggleSubmenu(submenuParent);
            };
        }

        overlay.addShouldCloseOverlaysListener(() => {
            hideMobileMenu();
        });
    }

    const showMobileMenu = function () {
        overlay.invokeShouldCloseOverlays();
        mobileMenu.classList.add("active");
        overlay.showOverlay();
        hamburgerButton.classList.add("close");
    };

    const hideMobileMenu = function () {
        mobileMenu.classList.remove("active");
        overlay.hideOverlay();
        for (let submenuParent of submenuParents) {
            hideSubmenu(submenuParent);
        }
        hamburgerButton.classList.remove("close");
    };

    const isSubmenuActive = function (submenuParent) {
        return submenuParent.classList.contains("active");
    };

    const toggleSubmenu = function (submenuParent) {
        submenuParent.classList.toggle("active");
    };

    const hideSubmenu = function (submenuParent) {
        submenuParent.classList.remove("active");
    };


    return HeaderManager;
}());

const headerManager = new HeaderManager(overlayManager);
