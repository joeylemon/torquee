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
var canvas = createHiDPICanvas($("#canvas").width(), $("#canvas").height());
var ctx = canvas.getContext("2d");
var default_color = "#000";
ctx.translate(0.5, 0.5);
ctx.lineCap = "round";
ctx.textAlign = "center"; 
ctx.fillStyle = default_color;
ctx.strokeStyle = default_color;

// The anchor for a mouse drag
var anchor;

// The current mouse position
var mouse = {x: 0, y: 0};

var centPage = {x:canvas.width/2, y:canvas.height/2};

// Listen for a mouse move
$("#canvas").mousemove(function(e) {
    mouse = {x: e.pageX, y: e.pageY};
});

// Listen for the beginning of a mouse drag
$("#canvas").mousedown(function(e) {
    anchor = {x: e.pageX, y: e.pageY};
});

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
function drawDashedLine(from, to, width, dash = [5, 15]) {
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = width;
    ctx.stroke();
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

function setDrawColor(color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}

function resetDrawColor() {
    ctx.fillStyle = default_color;
    ctx.strokeStyle = default_color;
}