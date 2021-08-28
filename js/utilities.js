// Add event function for all browser include IE 
function addEvent(el, event, callback) {
    if('addEventListener' in el) {
        el.addEventListener(event, callback, false);
    } else {
        el['e' + event + callback] = callback;
        el[event + callback] = function() {
            el['e' + event + callback](window.event);
        };
        el.attachEvent('on' + event, el[event + callback]);
    }
}

// Remove event function for all browser include IE
function removeEvent(el, event, callback) {
    if (el.detachEvent) {
        el.detachEvent('on'+ event, el[event + callback]);
        el[event + callback] = null;
    } else
        el.removeEventListener(event, callback, false);
}

// ...
