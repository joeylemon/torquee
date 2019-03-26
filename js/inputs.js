// Listen for a right click
$("#canvas").contextmenu(function(e) {
    shapes.push(new Shape(getDrawPosition({x: e.pageX, y: e.pageY}), current_shape, getShapeSize()));
    e.preventDefault();
    return false;
});

var cur_zoom = 0;
$("#canvas").on("mousewheel", function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var change = 0.006 * -e.originalEvent.deltaY;
        if(cur_zoom + change <= 2 && cur_zoom + change >= -0.4) {
            cur_zoom += change;
            zoom(1 + cur_zoom);
            document.getElementById("zoom").value = cur_zoom;
        }
    }else {
        e.preventDefault();
        e.stopImmediatePropagation();
        move(-e.originalEvent.deltaX * (1/(1+cur_zoom)), -e.originalEvent.deltaY * (1/(1+cur_zoom)));
    }
});

document.getElementById("zoom").value = cur_zoom;
document.getElementById("zoom").oninput = function(e) {
    cur_zoom = parseFloat(document.getElementById("zoom").value);
    zoom(1 + cur_zoom);
}

$("#tool-clear").click(function(e) {
    drags = new Array();
});

var current_size = "tool-medium";
$("#tool-small, #tool-medium, #tool-large").click(function(e) {
    var target = e.target.id;
    $("#" + current_size).removeClass("active");
    $("#" + target).addClass("active");
    current_size = target;
});

var current_shape = "square";
$("[id*='tool-shape']").click(function(e) {
    var target = e.target.id;
    var shape = target.substring(11);
    $("#tool-shape-" + current_shape).removeClass("active");
    $("#" + target).addClass("active");
    current_shape = shape;
});

function getShapeSize() {
    switch(current_size) {
        case "tool-small":
            return 20; break;
        case "tool-medium":
            return 40; break;
        case "tool-large":
            return 55; break;
        default:
            return 20;
    }
}

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