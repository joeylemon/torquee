/**
 * Holds information about a mouse drag
 */
class Drag {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.distance = distance(from, to);
        this.force = getDragForce(this.distance);

        this.text = {
            size: 23,
            pos: {x: to.x + 15, y: to.y + 10},
            str: this.force.toFixed(0) + " N"
        }

        var angle = Math.atan2(to.y - from.y, to.x - from.x);
        this.torque = {
            x: (Math.cos(angle) * this.force) * (from.y - origin.y),
            y: (Math.sin(angle) * this.force) * (from.x - origin.x)
        }
    }

    getForce(){ return this.force; }
    getTorque() { return this.torque; }

    draw() {
        drawLineWithArrow(this.from, this.to);
        drawText(this.text.str, this.text.size, this.text.pos);
    }
};