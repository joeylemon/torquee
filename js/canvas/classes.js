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
        this.deg_angle = radToDeg(Math.atan2(Math.abs(to.y - from.y), Math.abs(to.x - from.x)));
        this.quadrant = getQuadrant(this.angle);
        this.components = {
            x: this.force * Math.cos(this.angle),
            y: this.force * Math.sin(this.angle)
        }
        this.component_text = {
            x: new ComponentText(Component.X, from, to, this.force, this.quadrant, this.components),
            y: new ComponentText(Component.Y, from, to, this.force, this.quadrant, this.components),
        }

        this.text_pos = {x: to.x, y: to.y - 18};
        if(this.quadrant <= 2) this.text_pos = {x: to.x, y: to.y + 35};

        this.draw_components = true;
    }

    getForce(){ return this.force; }
    setDrawComponents(bool) { this.draw_components = bool; }

    /**
     * Get the torque about a location
     * @param {Object} loc The location coordinates
     */
    getTorque(loc) { 
        return {
            x: Math.abs(this.components.x * pixelsToMeters(this.from.y - loc.y)) * getTorqueSign(Component.X, this.components.x, this.from, loc),
            y: Math.abs(this.components.y * pixelsToMeters(this.from.x - loc.x)) * getTorqueSign(Component.Y, this.components.y, this.from, loc)
        }
    }

    /**
     * Draw the drag arrow, force, and components
     */
    draw() {
        if(this.draw_components){
            setDrawColor("rgba(88,89,91,0.4)");
            drawDashedLine(this.from, {x: this.to.x, y: this.from.y}, 5, [10, 20]);
            drawDashedLine(this.to, {x: this.to.x, y: this.from.y}, 5, [10, 20]);

            if(this.deg_angle >= 15 && this.deg_angle <= 80 && (Math.abs(this.components.x) > 10 || Math.abs(this.components.y) > 10)) {
                drawText(this.deg_angle.toFixed(0) + "°", 15, getAngleTextLocation(this.quadrant, this.deg_angle, this.from));
            }

            if(Math.abs(this.components.x) > 10) this.component_text.x.draw();
            if(Math.abs(this.components.y) > 10) this.component_text.y.draw();

            resetDrawColor();
        }

        if(this.force < 0.5){
            drawSolidLine(this.from, this.to, 7);
            return;
        }
        
        drawLineWithArrow(this.from, this.to, 7);
        drawText(this.force.toFixed(0) + " N", 23, this.text_pos);
    }
};

/**
 * Draws an x or y component for a given drag
 */
class ComponentText {
    constructor(component, from, to, force, quadrant, components) {
        this.component = component;
        this.from = from;
        this.to = to;
        this.force = force;
        this.quadrant = quadrant;
        this.components = components;
        this.angle = Math.atan2(Math.abs(to.y - from.y), Math.abs(to.x - from.x));
        this.deg_angle = radToDeg(this.angle);

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
            drawText(this.force.toFixed(0) + "cos(" + this.deg_angle.toFixed(0) + ") = " + Math.abs(this.components.x).toFixed(0) + " N", 10, this.loc);
        }else if(this.component == Component.Y) {
            rotateCanvas(-Math.PI/2, this.loc);
            drawText(this.force.toFixed(0) + "sin(" + this.deg_angle.toFixed(0) + ") = " + Math.abs(this.components.y).toFixed(0) + " N", 10, {x:0,y:0});
            unrotateCanvas();
        }
    }
};