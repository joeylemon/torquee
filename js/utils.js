const Component = {
    X: 1, Y: 2
};

/**
 * Get the distance between two positions
 * 
 * @param {Object} p1 The first position
 * @param {Object} p2 The second position
 */
function distance(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Get a force (N) based on a distance
 * 
 * @param {number} dist The distance
 */
function getDragForce(dist) {
    return dist / 8;
}

/**
 * Convert radians to degrees
 * 
 * @param {number} radians The radians to convert
 */
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Convert pixels to meters (1 grid on screen)
 * 
 * @param {number} pixels The amount of pixels
 */
function pixelsToMeters(pixels) {
    return pixels / 40;
}

function getNetTorque(loc) {
    var net = {x: 0, y: 0};
    for(var i = 0; i < drags.length; i++) {
        var torque = drags[i].getTorque(loc);
        net.x += torque.x;
        net.y += torque.y;
    }
    return net;
}