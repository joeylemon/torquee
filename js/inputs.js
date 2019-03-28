// Listen for a mouse move
$("#canvas").mousemove(function(e) {
    mouse = getDrawPosition({x: e.pageX, y: e.pageY});
});

// Listen for the beginning of a mouse drag
$("#canvas").mousedown(function(e) {
    mouse = getDrawPosition({x: e.pageX, y: e.pageY});

    if(e.button == 0) {
        var loc = {x: e.pageX, y: e.pageY};

        if(moving) {
            grab_loc = getDrawPosition(loc);
            document.getElementById("canvas").style.cursor = "grabbing";
            return;
        }

        if(!highlighting) anchor = getDrawPosition(loc);

        if(drags.length != 0 && !highlighting && !erasing) {
            drags[drags.length - 1].setDrawComponents(false);
        }
    }else if(e.button == 2) {
        shapes.push(new Shape(getDrawPosition({x: e.pageX, y: e.pageY}), current_shape, getShapeSize()));
    }
});

// Listen for the ending of a mouse drag
$("#canvas").mouseup(function(e) {
    mouse = getDrawPosition({x: e.pageX, y: e.pageY});

    if(e.button == 0) {
        if(highlighting) {
            var shape = getShapeAtLocation(mouse);
            if(shape) {
                if(highlighted && highlighted.id == shape.id) {
                    highlighted = undefined;
                }else{
                    highlighted = shape;
                }

                highlighting = false;
                toggleHighlighting(false);
            }
        }

        if(moving) {
            grab_loc = undefined;
            document.getElementById("canvas").style.cursor = "grab";
            return;
        }

        if(!anchor){ return; }

        if(!erasing) {
            var drag = getDrag();
            if(drag.distance > 10) {
                drags.push(drag);
            }
        }else{
            // Erase all objects inside of the rectangle
            var rect = new Rect(anchor, mouse);
            for(var i = shapes.length - 1; i >= 0; --i) {
                if(rect.contains(shapes[i].center)) {
                    if(highlighted && highlighted.id == shapes[i].id) highlighted = undefined;
                    shapes.splice(i, 1);
                }
            }
            for(var i = drags.length - 1; i >= 0; --i) {
                var drag = drags[i];
                if(rect.contains(drag.midpoint) || rect.contains(drag.from) || rect.contains(drag.to)) {
                    drags.splice(i, 1);
                }
            }
        }
        anchor = undefined;
    }
});

/**
 * Right click: add shape to canvas
 */
$("#canvas").contextmenu(function(e) {
    mouse = getDrawPosition({x: e.pageX, y: e.pageY});
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

        zoomChange(0.006 * -e.originalEvent.deltaY);
    }else{
        if(e.originalEvent.deltaY % 1 == 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
            move(-e.originalEvent.deltaX * (1/(1+cur_zoom)), -e.originalEvent.deltaY * (1/(1+cur_zoom)));
        }else{
            zoomChange(0.1 * (e.originalEvent.deltaY / Math.abs(e.originalEvent.deltaY)));
        }
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

document.getElementById("dampener").value = cur_dampening;
document.getElementById("dampener").oninput = function(e) {
    cur_dampening = parseFloat(document.getElementById("dampener").value);
}

/**
 * Clear button: clear all objects from canvas
 */
$("#tool-clear").click(function(e) {
    drags = new Array();
    shapes = new Array();
    highlighted = undefined;
});

/**
 * Erase button: toggle eraser
 */
var erasing = false;
$("#tool-eraser").click(function(e) {
    erasing = !erasing;
    toggleErasing(erasing);
});

function toggleErasing(on) {
    if(on) {
        $("#tool-eraser").addClass("active");
        document.getElementById("canvas").style.cursor = "url(images/eraser_cursor.png), auto";
    }else{
        $("#tool-eraser").removeClass("active");
        document.getElementById("canvas").style.cursor = "auto";
    }
}

var highlighting = false;
$("#tool-highlight").click(function(e) {
    highlighting = !highlighting;
    toggleHighlighting(highlighting);
});

function toggleHighlighting(on) {
    if(on) {
        $("#tool-highlight").addClass("active");
        document.getElementById("canvas").style.cursor = "url(images/highlight_cursor.png) 16 16, auto";
    }else{
        $("#tool-highlight").removeClass("active");
        document.getElementById("canvas").style.cursor = "auto";
    }
}

$("#tool-move").click(function(e) {
    moving = !moving;
    toggleMoving(moving);
});

function toggleMoving(on) {
    if(on) {
        $("#tool-move").addClass("active");
        document.getElementById("canvas").style.cursor = "grab";
    }else{
        $("#tool-move").removeClass("active");
        document.getElementById("canvas").style.cursor = "auto";
    }
}

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
            return 65; break;
        default:
            return 20;
    }
}

window.onkeydown = function(e) {
    var code = e.keyCode;
    //console.log(code);

    if(code == 16) {
        erasing = true;
        toggleErasing(true);
    }else if(code == 17) {
        moving = true;
        toggleMoving(true);
    }
};
window.onkeyup = function(e) {
    var code = e.keyCode;

    if(code == 16) {
        erasing = false;
        toggleErasing(false);
    }else if(code == 17) {
        moving = false;
        toggleMoving(false);
    }
};