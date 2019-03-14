// An array for FloatingText objects
var drags = new Array();

// Listen for the ending of a mouse drag
$("#canvas").mouseup(function(e) {
    // applyForce(force, object);
    drags.push(getDrag());
    anchor = undefined;
});

/**
 * The draw function; called many times a second
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all floating texts
    for(var i = 0; i < drags.length; i++) {
        var drag = drags[i];
        drag.draw();
    }

    // Draw an arrow if the user is currently dragging
	// Also begin torque calculation
    if(anchor){
        getDrag().draw();
		
		//calcTorque(centPage,anchor,mouse,drag.getForce());
    }

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