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

        console.log(this.angle * (180 / Math.PI));
        var pos = {x: to.x + 15, y: to.y - 20};
        if(this.angle > 0 && this.angle <= 90) {
            console.log("1");
            pos = {x: to.x + 40, y: to.y};
        }else if(this.angle > 90 && this.angle <= 180) {
            console.log("2");
            pos = {x: to.x - 40, y: to.y};
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
        setDrawColor("rgba(88,89,91,1)");
        drawDashedLine(this.from, {x: this.to.x, y: this.from.y}, 5, [10, 20]);
        drawDashedLine(this.to, {x: this.to.x, y: this.from.y}, 5, [10, 20]);
        resetDrawColor();

        drawText("544cos(x) = 54 N", 20, {
            x: this.from.x + ((this.to.x - this.from.x)/2), 
            y: this.from.y + 18
        });

        drawLineWithArrow(this.from, this.to, 7);
        drawText(this.text.str, this.text.size, this.text.pos);
    }
};