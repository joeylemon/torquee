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
ctx.translate(0.5, 0.5);
ctx.lineCap = "round";
ctx.fillStyle = "#000";
ctx.strokeStyle = "#000";

// The anchor for a mouse drag
var anchor;

// The current mouse position
var mouse = {x: 0, y: 0};

// Listen for a mouse move
$("#canvas").mousemove(function(e) {
    mouse = {x: e.pageX, y: e.pageY};
});

// Listen for the beginning of a mouse drag
$("#canvas").mousedown(function(e) {
    anchor = {x: e.pageX, y: e.pageY};
});