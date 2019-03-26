// Listen for a right click
$("#canvas").contextmenu(function(e) {
    shapes.push(getDrawPosition({x: e.pageX, y: e.pageY}));
    e.preventDefault();
    return false;
});

var cur_zoom = 0;
$("#canvas").on("mousewheel", function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var change = 0.006 * -e.originalEvent.deltaY;
        if(cur_zoom + change <= 1 && cur_zoom + change >= -0.2) {
            cur_zoom += change;
            zoom(1 + cur_zoom);
        }
    }else {
        e.preventDefault();
        e.stopImmediatePropagation();
        move(-e.originalEvent.deltaX, -e.originalEvent.deltaY);
    }
});

// Keep track of if the command button is down
// May be useful in the future for more controls
var cmd_down = false;
window.onkeydown = function(e) {
    var code = e.keyCode;
    //console.log(code);
    if(code == 91) {
        cmd_down = true;
    }

    if(code == 37) move(-20, 0);
    if(code == 38) move(0, -20);
    if(code == 39) move(20, 0);
    if(code == 40) move(0, 20);
};
window.onkeyup = function(e) {
    var code = e.keyCode;
    if(code == 91) {
        cmd_down = false;
    }
};