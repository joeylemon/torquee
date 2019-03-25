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

/**
 * Convert newton-meters to foot-pounds
 * 
 * @param {number} nm The amount of newton meters
 */
function nmToFtlb(nm) {
    return nm * 0.73756;
}

/**
 * Get the starting angle for an arc to be drawn in a quadrant
 * 
 * @param {number} quadrant The quadrant of the angle
 */
function getStartingAngleForQuadrant(quadrant) {
    if(quadrant == 4) {
        return 0;
    }else if(quadrant == 3) {
        return Math.PI;
    }else if(quadrant == 2) {
        return Math.PI;
    }else if(quadrant == 1) {
        return 0;
    }
}

/**
 * Get the sign of a torque
 * 
 * @param {Object} comp The component value (X or Y)
 * @param {number} val The value of the component
 * @param {Object} from The origin of the force
 * @param {Object} loc The location to get torque about
 */
function getTorqueSign(comp, val, from, loc) {
    var positive = (val > 0 ? false : true);
    if(comp == Component.Y) {
        var left = (loc.x - from.x > 0 ? true : false);
        if((positive && left) || (!positive && !left)){
            return -1;
        }
    }else if(comp == Component.X) {
        var below = (loc.y - from.y > 0 ? true : false);
        if((positive && !below) || (!positive && below)){
            return -1;
        }
    }

    return 1;
}

/**
 * Get the net torque about a location by totaling all drags
 * 
 * @param {Object} loc The location to get net torque about
 */
function getNetTorque(loc) {
    var net = 0;
    for(var i = 0; i < drags.length; i++) {
        var torque = drags[i].getTorque(loc);
        net += torque.x;
        net += torque.y;
    }
    return net;
}