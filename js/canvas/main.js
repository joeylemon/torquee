// An array for FloatingText objects
var drags = new Array();
var shapes = new Array();

// Add a default shape at the center
shapes.push(new Shape({x:width/2 - (width/2 % 40),y:height/2 - (height/2 % 40)}, "square", 50));

var highlighted;

// Listen for a mouse move
$("#canvas").mousemove(function(e) {
    mouse = getDrawPosition({x: e.pageX, y: e.pageY});
});

// Listen for the beginning of a mouse drag
$("#canvas").mousedown(function(e) {
    if(e.button == 0) {
        var loc = {x: e.pageX, y: e.pageY};

        if(moving) {
            grab_loc = getDrawPosition(loc);
            return;
        }

        if(!highlighting) anchor = getDrawPosition(loc);

        if(drags.length != 0 && !highlighting && !erasing) {
            drags[drags.length - 1].setDrawComponents(false);
        }
    }
});

// Listen for the ending of a mouse drag
$("#canvas").mouseup(function(e) {
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
 * The draw function; called many times a second
 */
function draw() {
    ctx.clearRect(-translation.x, -translation.y, canvas.width, canvas.height);

    drawGridLine();

    drawAllElements(drags);

    // Draw the current drag if user is still dragging
    if(anchor){
        if(!erasing) {
            getDrag().draw();
        }else{
            drawBoundingBox(anchor, mouse);
        }
    }

    drawAllElements(shapes);

    if(moving && grab_loc) {
        var diff = {x: mouse.x - grab_loc.x, y: mouse.y - grab_loc.y};
        move(diff.x, diff.y);
    }

    // Request the next frame to be drawn
    window.requestAnimationFrame(draw);
}
draw();

/**
 * Draw all elements in an array
 * 
 * @param {Array} arr An array of classes with a draw() function
 */
function drawAllElements(arr) {
    for(var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        obj.draw();
    }
}

/**
 * Get a drag object for the current drag
 */
function getDrag() {
    return new Drag(anchor, mouse);
}