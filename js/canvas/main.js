// An array for FloatingText objects
var drags = new Array();
var shapes = new Array();
shapes.push(new Shape({x:width/2 - (width/2 % 40),y:height/2 - (height/2 % 40)}, "square", 50));

// Listen for a mouse move
$("#canvas").mousemove(function(e) {
    mouse = getDrawPosition({x: e.pageX, y: e.pageY});
});

// Listen for the beginning of a mouse drag
$("#canvas").mousedown(function(e) {
    anchor = getDrawPosition({x: e.pageX, y: e.pageY});
    if(drags.length != 0) {
        drags[drags.length - 1].setDrawComponents(false);
    }
});

// Listen for the ending of a mouse drag
$("#canvas").mouseup(function(e) {
    // applyForce(force, object);
    var drag = getDrag();
    if(drag.force > 0.5) {
        drags.push(drag);
    }
    anchor = undefined;
});

/**
 * The draw function; called many times a second
 */
function draw() {
    ctx.clearRect(-translation.x, -translation.y, canvas.width, canvas.height);

    drawGridLine();

    // Draw all drags
    drawAllElements(drags);

    // Draw the current drag if user is still dragging
    if(anchor){
        getDrag().draw();
    }

    drawAllElements(shapes);

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