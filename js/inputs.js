/**
 * Right click: add shape to canvas
 */
$("#canvas").contextmenu(function(e) {
    shapes.push(new Shape(getDrawPosition({x: e.pageX, y: e.pageY}), current_shape, getShapeSize()));
    e.preventDefault();
    return false;
});

/**
 * Mousewheel: zoom/pan canvas
 */
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

/**
 * Slider: zoom canvas
 */
document.getElementById("zoom").value = cur_zoom;
document.getElementById("zoom").oninput = function(e) {
    cur_zoom = parseFloat(document.getElementById("zoom").value);
    zoom(1 + cur_zoom);
}

/**
 * Clear button: clear all objects from canvas
 */
$("#tool-clear").click(function(e) {
    drags = new Array();
    shapes = new Array();
});

/**
 * Erase button: toggle eraser
 */
var erasing = false;
$("#tool-eraser").click(function(e) {
    erasing = !erasing;
    if(erasing) {
        $("#tool-eraser").addClass("active");
        document.getElementById("canvas").style.cursor = "url(images/eraser_cursor.png), auto";
    }else{
        $("#tool-eraser").removeClass("active");
        document.getElementById("canvas").style.cursor = "auto";
    }
});

/**
 * Shape selection: change the current shape
 */
var current_shape = "square";
$("[id*='tool-shape']").click(function(e) {
    var target = e.target.id;
    var shape = target.substring(11);
    $("#tool-shape-" + current_shape).removeClass("active");
    $("#" + target).addClass("active");
    current_shape = shape;
});

/**
 * Size button: change the size of newly-added shapes
 */
var current_size = "tool-medium";
$("#tool-small, #tool-medium, #tool-large").click(function(e) {
    var target = e.target.id;
    $("#" + current_size).removeClass("active");
    $("#" + target).addClass("active");
    current_size = target;
});

/**
 * Get the pixel value of the currently-selected size
 */
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

    var dist = 70;
    if(code == 37) move(-dist, 0);
    if(code == 38) move(0, -dist);
    if(code == 39) move(dist, 0);
    if(code == 40) move(0, dist);
};
window.onkeyup = function(e) {
    var code = e.keyCode;
    if(code == 91) {
        cmd_down = false;
    }
};