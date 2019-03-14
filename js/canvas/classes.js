/**
 * Holds information about a mouse drag
 */
class Drag {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.distance = distance(from, to);
        this.force = getDragForce(this.distance);
        this.angle = Math.atan2(to.y - from.y, to.x - from.x);
        this.components = {
            x: this.force * Math.cos(this.angle),
            y: this.force * Math.sin(this.angle)
        }
        this.quadrant = getQuadrant(this.angle);

        var pos = {x: to.x, y: to.y - 18};
        if(this.quadrant == 1 || this.quadrant == 2) {
            pos = {x: to.x, y: to.y + 35};
        }
        this.text = {
            size: 23,
            pos: pos,
            str: this.force.toFixed(0) + " N"
        }

        this.torque = {
            x: (Math.cos(this.angle) * this.force) * (from.y - origin.y),
            y: (Math.sin(this.angle) * this.force) * (from.x - origin.x)
        }
    }

    getForce(){ return this.force; }
    getTorque() { return this.torque; }

    draw() {
        setDrawColor("rgba(88,89,91,0.4)");
        drawDashedLine(this.from, {x: this.to.x, y: this.from.y}, 5, [10, 20]);
        drawDashedLine(this.to, {x: this.to.x, y: this.from.y}, 5, [10, 20]);

        var x_text_loc = {
            x: this.from.x + ((this.to.x - this.from.x)/2), 
            y: this.from.y + (this.quadrant > 2 ? 18 : -10)
        };
        var y_text_loc = {
            x: this.to.x + (this.quadrant == 1 || this.quadrant == 4 ? 20 : -12), 
            y: this.to.y - ((this.to.y - this.from.y)/2)
        };

        if(Math.abs(this.components.x) > 20) {
            drawText(this.force.toFixed(0) + "cos(θ) = " + this.components.x.toFixed(0) + " N", 10, x_text_loc);
        }

        if(Math.abs(this.components.y) > 25) {
            rotateCanvas(-Math.PI/2, y_text_loc);
            drawText(this.force.toFixed(0) + "sin(θ) = " + this.components.y.toFixed(0) + " N", 10, {x:0,y:0});
            unrotateCanvas();
        }

        resetDrawColor();

        drawLineWithArrow(this.from, this.to, 7);
        drawText(this.text.str, this.text.size, this.text.pos);
    }
};