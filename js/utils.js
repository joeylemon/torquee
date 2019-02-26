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
    return Math.pow(dist / 20, 2);
}