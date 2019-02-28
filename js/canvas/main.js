// An array for FloatingText objects
var floating_text = new Array();

// Listen for the ending of a mouse drag
$("#canvas").mouseup(function(e) {
    // applyForce(force, object);
    var drag = getDrag();
    floating_text.push(new FloatingText(drag.getText(), drag.getTextPosition()));
    anchor = undefined;
});

/**
 * The draw function; called many times a second
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all floating texts
    for(var i = 0; i < floating_text.length; i++) {
        var f_text = floating_text[i];
        drawText(f_text.getText(), f_text.getSize(), f_text.getTextPosition());
        if(f_text.decrease() < 0) floating_text.splice(i, 1);
    }

    // Draw an arrow if the user is currently dragging
    if(anchor){
        var drag = getDrag();

        drawLineWithArrow(anchor, mouse);
        drawText(drag.getText(), 23, drag.getTextPosition());
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

/**
 * Draw text
 * 
 * @param {string} str The text to draw
 * @param {number} size The size of the text
 * @param {Object} pos The location to draw at
 */
function drawText(str, size, pos) {
    ctx.font = size + "px profont";
    ctx.fillText(str, pos.x, pos.y);
}

/**
 * Draw a line with an arrow head
 * 
 * @param {Object} from The origin coordinates
 * @param {Objeect} to The destination coordinates
 */
function drawLineWithArrow(from, to) {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = 7;
    ctx.stroke();
    drawArrowhead(ctx, from, to, 10);
}

/**
 * Draw an arrow head
 * 
 * @param {Object} context The canvas context
 * @param {Object} from The origin coordinates
 * @param {Object} to The destination coordinates
 * @param {number} radius The head radius
 */
function drawArrowhead(context, from, to, radius) {
    var x_center = to.x;
    var y_center = to.y;

    var angle;
    var x;
    var y;

    context.beginPath();

    angle = Math.atan2(to.y - from.y, to.x - from.x)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
}