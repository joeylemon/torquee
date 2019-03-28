// Get optimal pixel ratio for current device
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

// Create a canvas with optimal pixel ratios
function initCanvas(width, height) {
    canvas.width = width * PIXEL_RATIO;
    canvas.height = height * PIXEL_RATIO;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.getContext("2d").setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
}

// Initialize the canvas and context
var width = $("#canvas").width();
var height = $("#canvas").height();
var canvas = document.getElementById("canvas");
initCanvas(width, height);
var ctx = canvas.getContext("2d");
ctx.translate(0.5, 0.5);

/*
$(window).resize(function(e){
    ctx.translate(-translation.x, -translation.y);
    ctx.scale(1/scale, 1/scale);
    scale = 1;
    translation = {x: 0, y: 0};

    var w = $("#canvas").width();
    var h = $("#canvas").height();
    canvas.width = w * PIXEL_RATIO;
    canvas.height = h * PIXEL_RATIO;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    center = {x: w/2, y:h/2};
});
*/

var next_id = 0;

ctx.lineCap = "round";
ctx.textAlign = "center"; 
var default_color = "#000";
ctx.fillStyle = default_color;
ctx.strokeStyle = default_color;

var center = {x: width/2, y:height/2};

var scale = 1;
var last_scale = 0;
ctx.scale(scale, scale);

var translation = {x: 0, y: 0};

var moving = false;
var grab_loc;
var highlighted;

// The anchor for a mouse drag
var anchor;

// The current mouse position
var mouse = {x: 0, y: 0};

/**
 * Zoom the canvas in or out
 * 
 * @param {number} zoom The new scale of the canvas (normal zoom = 1)
 */
function zoom(zoom) {
    // For some reason we have to untranslate canvas before zooming
    ctx.translate(-translation.x, -translation.y);

    // Scale back to normal by scaling the recriprocal of current
    ctx.scale(1/scale, 1/scale);

    scale = zoom;
    ctx.scale(scale, scale);

    // Return to previous translation
    ctx.translate(translation.x, translation.y);
}

/**
 * Zoom in the given amount if it is within the zoom bounds
 * 
 * @param {number} change Amount to change zoom by
 */
function zoomChange(change) {
    var added = cur_zoom + change;
    if(added < -0.4) {
        added = -0.4;
    }else if(added > 2) {
        added = 2;
    }

    cur_zoom = added;
    zoom(1 + cur_zoom);
    document.getElementById("zoom").value = cur_zoom;
}

/**
 * 
 * @param {number} x The amount to move in the x direction
 * @param {number} y The amount of move in the y direction
 */
function move(x, y) {
    if(Math.abs(translation.x + x) < 1000) { translation.x += x; ctx.translate(x, 0); }
    if(Math.abs(translation.y + y) < 1000) { translation.y += y; ctx.translate(0, y); }
}

/**
 * Draw the background grid line
 */
function drawGridLine() {
    var start = -1000;
    setDrawColor("rgba(0,0,0,0.2)");

    // Vertical lines
    for(var x = start; x < canvas.width + -start; x += 40) {
        drawSolidLine({x: x, y: start}, {x: x, y: canvas.height + -start}, 1);
    }

    // Horizontal lines
    for(var y = start; y < canvas.height + -start; y += 40) {
        drawSolidLine({x: start, y: y}, {x: canvas.width + -start, y: y}, 1);
    }
    resetDrawColor();
}

/**
 * Draw text
 * 
 * @param {string} str The text to draw
 * @param {number} size The size of the text
 * @param {Object} pos The location to draw at
 */
function drawText(str, size, pos, font="profont") {
    ctx.font = size + "px " + font;
    ctx.fillText(str, pos.x, pos.y);
}

/**
 * Draw a solid line
 * 
 * @param {Object} from The origin coordinates
 * @param {Object} to The destination coordinates
 * @param {number} width The width of the line
 */
function drawSolidLine(from, to, width) {
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = width;
    ctx.stroke();
}

/**
 * Draw a dashed line
 * 
 * @param {Object} from The origin coordinates
 * @param {Object} to The destination coordinates
 * @param {number} width The width of the line
 * @param {Array} dash The dashing of the line [<length>, <spacing>] 
 */
function drawDashedLine(from, to, width, dash = [10, 20]) {
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Draw a dashed line with an arrow head
 * 
 * @param {Object} from The origin coordinates
 * @param {Object} to The destination coordinates
 * @param {number} width The width of the line
 * @param {Array} dash The dashing of the line [<length>, <spacing>] 
 */
function drawDashedLineWithArrow(from, to, width, dash = [10, 20]) {
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = width;
    ctx.stroke();
    if(distance(from, to) > 10) {
        drawArrowhead(ctx, from, to, 10);
    }
    ctx.setLineDash([]);
}

/**
 * Draw a line with an arrow head
 * 
 * @param {Object} from The origin coordinates
 * @param {Object} to The destination coordinates
 * @param {number} width The width of the line
 */
function drawLineWithArrow(from, to, width) {
    this.drawSolidLine(from, to, width);
    drawArrowhead(ctx, from, to, 12);
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

/**
 * Draw a bounding box between two points
 * 
 * @param {Object} from The start location
 * @param {Object} to The end location
 */
function drawBoundingBox(from, to) {
    setDrawColor("rgba(0,0,0,0.2)");
    var rect = new Rect(from, to);
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fill();
    setDrawColor("#9b9b9b");
    var dashing = [13, 9];
    drawDashedLine({x: rect.x, y: rect.y}, {x: rect.x + rect.width, y: rect.y}, 3, dashing);
    drawDashedLine({x: rect.x, y: rect.y}, {x: rect.x, y: rect.y + rect.height}, 3, dashing);
    drawDashedLine({x: rect.x + rect.width, y: rect.y}, {x: rect.x + rect.width, y: rect.y + rect.height}, 3, dashing);
    drawDashedLine({x: rect.x, y: rect.y + rect.height}, {x: rect.x + rect.width, y: rect.y + rect.height}, 3, dashing);
    resetDrawColor();
}

/**
 * Get the location for angle text
 * 
 * @param {number} quadrant 
 * @param {number} angle 
 * @param {Object} origin 
 */
function getAngleTextLocation(quadrant, angle, origin) {
    var angle_loc;
    switch(quadrant) {
        case 1:
            angle_loc = {x: origin.x + 40, y: origin.y + 14};
            break;
        case 2:
            angle_loc = {x: origin.x - 40, y: origin.y + 14};
            break;
        case 3:
            angle_loc = {x: origin.x - 40, y: origin.y - 6};
            break;
        case 4:
            angle_loc = {x: origin.x + 40, y: origin.y - 6};
            break;
    }
    return angle_loc;
}

/**
 * Set the canvas drawing color
 * 
 * @param {string} color The hex color to draw
 */
function setDrawColor(color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}

/**
 * Reset the drawing color to the default color
 */
function resetDrawColor() {
    ctx.fillStyle = default_color;
    ctx.strokeStyle = default_color;
}

/**
 * Rotate the canvas drawing
 * 
 * @param {number} angle The angle
 * @param {Object} draw_loc The location that will be drawn at (must draw desired object at 0, 0)
 */
function rotateCanvas(angle, draw_loc) {
    ctx.save();
    ctx.translate(draw_loc.x, draw_loc.y);
    ctx.rotate(angle);
}

/**
 * Reset the canvas to normal rotation
 */
function unrotateCanvas() {
    ctx.restore();
}