// An array for FloatingText objects
var drags = new Array();
var shapes = new Array();

// Add a default shape at the center
shapes.push(new Shape({
    x: width / 2 - (width / 2 % 40),
    y: height / 2 - (height / 2 % 40)
}, "flower", 40));

/**
 * The draw function; called many times a second
 */
function draw() {
    ctx.clearRect(-translation.x, -translation.y, canvas.width, canvas.height);

    drawGridLine();

    drawAllElements(drags);

    // Draw the current drag if user is still dragging
    if (anchor) {
        if (!erasing) {
            getDrag().draw();
        } else {
            drawBoundingBox(anchor, mouse);
        }
    }

    drawAllElements(shapes);

    if (moving && grab_loc) {
        var diff = { x: mouse.x - grab_loc.x, y: mouse.y - grab_loc.y };
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
    for (var i = 0; i < arr.length; i++) {
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