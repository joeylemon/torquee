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
createHiDPICanvas = function (w, h, ratio) {
    if (!ratio) {
        ratio = PIXEL_RATIO;
    }
    var can = document.getElementById("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

// Initialize the canvas and context
var width = $("#canvas").width();
var height = $("#canvas").height();
var canvas = createHiDPICanvas(width, height);
var ctx = canvas.getContext("2d");
var default_color = "#000";
ctx.translate(0.5, 0.5);
ctx.lineCap = "round";
ctx.textAlign = "center"; 
ctx.fillStyle = default_color;
ctx.strokeStyle = default_color;

var center = {x: width/2, y:height/2};

var scale = 1;
var last_scale = 0;
ctx.scale(scale, scale);

var translation = {x: 0, y: 0};

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
    // For some reason, we have to return to no translation or else zooming
    // will mess up dragging. A fix for another day?
    ctx.translate(-translation.x, -translation.y);
    translation = {x: 0, y: 0};

    // Scale back to normal by scaling the recriprocal of current
    ctx.scale(1/scale, 1/scale);

    scale = zoom;
    ctx.scale(scale, scale);
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