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
        this.quadrant = getQuadrant(this.angle);
        this.components = {
            x: this.force * Math.cos(this.angle),
            y: this.force * Math.sin(this.angle)
        }
        this.component_text = {
            x: new ComponentText(Component.X, this.quadrant, this.from, this.to, this.force.toFixed(0) + "cos(θ) = " + this.components.x.toFixed(0) + " N"),
            y: new ComponentText(Component.Y, this.quadrant, this.from, this.to, this.force.toFixed(0) + "sin(θ) = " + this.components.y.toFixed(0) + " N"),
        }

        this.text_pos = {x: to.x, y: to.y - 18};
        if(this.quadrant == 1 || this.quadrant == 2) {
            this.text_pos = {x: to.x, y: to.y + 35};
        }

        this.torque = {
            x: this.components.x * (from.y - centPage.y),
            y: this.components.y * (from.x - centPage.x)
        }

        this.draw_components = true;
    }

    getForce(){ return this.force; }
    getTorque() { return this.torque; }
    setDrawComponents(bool) { this.draw_components = bool; }

    draw() {
        if(this.draw_components){
            setDrawColor("rgba(88,89,91,0.4)");
            drawDashedLine(this.from, {x: this.to.x, y: this.from.y}, 5, [10, 20]);
            drawDashedLine(this.to, {x: this.to.x, y: this.from.y}, 5, [10, 20]);

            if(Math.abs(this.components.x) > 10) this.component_text.x.draw();
            if(Math.abs(this.components.y) > 10) this.component_text.y.draw();

            resetDrawColor();
        }

        drawLineWithArrow(this.from, this.to, 7);
        drawText(this.force.toFixed(0) + " N", 23, this.text_pos);
    }
};

/**
 * Draws an x or y component for a given drag
 */
class ComponentText {
    constructor(component, quadrant, from, to, str) {
        this.component = component;
        this.quadrant = quadrant;
        this.from = from;
        this.to = to;
        this.str = str;

        if(component == Component.X) {
            this.loc = {
                x: this.from.x + ((this.to.x - this.from.x)/2), 
                y: this.from.y + (this.quadrant > 2 ? 18 : -10)
            };
        }else if(component == Component.Y) {
            this.loc = {
                x: this.to.x + (this.quadrant == 1 || this.quadrant == 4 ? 20 : -12), 
                y: this.to.y - ((this.to.y - this.from.y)/2)
            };
        }
    }

    draw() {
        if(this.component == Component.X) {
            drawText(this.str, 10, this.loc);
        }else if(this.component == Component.Y) {
            rotateCanvas(-Math.PI/2, this.loc);
            drawText(this.str, 10, {x:0,y:0});
            unrotateCanvas();
        }
    }
};