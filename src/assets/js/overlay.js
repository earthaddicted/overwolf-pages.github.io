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