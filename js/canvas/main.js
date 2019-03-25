// An array for FloatingText objects
var drags = new Array();

// Listen for a mouse move
$("#canvas").mousemove(function(e) {
    mouse = {x: e.pageX, y: e.pageY};
});

// Listen for the beginning of a mouse drag
$("#canvas").mousedown(function(e) {
    anchor = {x: e.pageX, y: e.pageY};
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all drags
    for(var i = 0; i < drags.length; i++) {
        var drag = drags[i];
        drag.draw();
    }

    // Draw an arrow if the user is currently dragging
    if(anchor){
        getDrag().draw();
    }

    // Draw a dot for a point of reference
    // Temporary: for debugging
    ctx.rect(200, 200, 5, 5);
    ctx.fill();
    drawText("(200,200)", 12, {x:202,y:220});

    drawText(getNetTorque({x:200,y:200}).toFixed(0) + " Nm", 23, {x:65, y:140}, "lemon");

    // Request the next frame to be drawn
    window.requestAnimationFrame(draw);
}
draw();

/**
 * Get a drag object for the current drag
 */
function getDrag() {
    return new Drag(anchor, mouse);
}