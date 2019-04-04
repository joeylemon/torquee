/**
 * Holds information about a mouse drag
 */
class Drag {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
        this.distance = distance(from, to);
        this.force = getDragForce(this.distance);
        this.force_text = this.force.toFixed(getDecimalPlaces());
        this.angle = Math.atan2(to.y - from.y, to.x - from.x);

        // Convert angle to radians, and keep it between 0-90
        this.distances = {
            x: Math.abs(to.x - from.x),
            y: Math.abs(to.y - from.y)
        }
        this.deg_angle = radToDeg(Math.atan2(this.distances.y, this.distances.x));

        this.quadrant = getQuadrant(this.angle);

        // Find the force components
        this.components = {
            x: this.force * Math.cos(this.angle),
            y: this.force * Math.sin(this.angle)
        }

        // Initialize all drawing locations in constructor to save processing
        // when drag is drawn
        this.component_text = {
            x: new ComponentText(Component.X, from, to, this.force, this.quadrant, this.components),
            y: new ComponentText(Component.Y, from, to, this.force, this.quadrant, this.components),
        }
        this.angle_loc = getAngleTextLocation(this.quadrant, this.deg_angle, this.from);
        this.start_angle = getStartingAngleForQuadrant(this.quadrant);

        this.text_pos = { x: to.x, y: to.y - 18 };
        if (this.quadrant <= 2) this.text_pos = { x: to.x, y: to.y + 35 };

        // This gets set to false once user has started a new drag
        this.draw_components = true;
    }

    getForce() { return this.force; }
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
        if (this.draw_components) {
            // Set color to transparent gray
            setDrawColor("rgba(88,89,91,0.4)");

            if (!doDisableComponents()) {
                // Draw x-component line
                drawDashedLineWithArrow(this.from, { x: this.to.x, y: this.from.y }, 5);

                // Draw y-component line
                drawDashedLineWithArrow(this.from, { x: this.from.x, y: this.to.y }, 5);

                // Draw component texts
                if (Math.abs(this.distances.x) > 60) this.component_text.x.draw();
                if (Math.abs(this.distances.y) > 60) this.component_text.y.draw();
            }

            if (this.deg_angle > 3 && this.distance > 20) {
                // Draw the angle text
                drawText(this.deg_angle.toFixed(0) + "°", 12, this.angle_loc);

                // Draw the angle arc
                ctx.lineWidth = 5;
                ctx.beginPath();
                if (this.quadrant == 4 || this.quadrant == 2) {
                    ctx.arc(this.from.x, this.from.y, 25, this.start_angle, this.angle, true);
                } else {
                    ctx.arc(this.from.x, this.from.y, 25, this.start_angle, this.angle, false);
                }
                ctx.stroke();
            }

            // Draw distance lines extending from last added shape
            var shape = highlighted ? highlighted : getLastAddedShape();
            if (shape && this.force > 0 && !doDisableDistances()) {
                // Set color to transparent orange
                setDrawColor("rgba(220,130,0,0.4)");

                // Get the last added shape
                var loc = shape.loc;

                // Calculate the x and y distances
                var x_dist = Math.abs(pixelsToMeters(this.from.x - loc.x));
                var y_dist = Math.abs(pixelsToMeters(this.from.y - loc.y));

                // Draw x distance line
                ctx.lineCap = "square";
                drawSolidLine(loc, { x: this.from.x, y: loc.y }, 5);
                if (x_dist > 0.5) {
                    // Draw dist times force text above line
                    var text = x_dist.toFixed(getDecimalPlaces()) + "m";
                    if (!doDisableComponents()) {
                        text += " x " + Math.abs(this.components.y).toFixed(0) + "N";
                    }
                    drawText(text, 10, { x: loc.x + ((this.from.x - loc.x) / 2), y: loc.y - 8 });

                    // Draw torque text below line
                    if (!doDisableTorque()) {
                        drawText(this.getTorque(loc).y.toFixed(getDecimalPlaces()) + " Nm", 10, { x: loc.x + ((this.from.x - loc.x) / 2), y: loc.y + 15 });
                    }
                }

                // Draw y distance line
                drawSolidLine(loc, { x: loc.x, y: this.from.y }, 5);
                if (y_dist > 0.5) {
                    // Rotate the canvas 90 degrees
                    rotateCanvas(-Math.PI / 2, { x: loc.x - 7, y: loc.y + ((this.from.y - loc.y) / 2) });

                    // Draw dist times force text above line
                    var text = y_dist.toFixed(getDecimalPlaces()) + "m";
                    if (!doDisableComponents()) {
                        text += " x " + Math.abs(this.components.x).toFixed(0) + "N";
                    }
                    drawText(text, 10, { x: 0, y: 0 });

                    // Draw torque text below line
                    if (!doDisableTorque()) {
                        drawText(this.getTorque(loc).x.toFixed(getDecimalPlaces()) + " Nm", 10, { x: 0, y: 23 });
                    }

                    unrotateCanvas();
                }
                ctx.lineCap = "round";
            }

            resetDrawColor();
        }

        // If force is small, draw line without an arrowhead
        if (this.distance < 10) {
            drawSolidLine(this.from, this.to, 7);
            return;
        }

        // Draw the force arrow
        drawLineWithArrow(this.from, this.to, 7);

        // Draw the force text
        drawText(this.force_text + " N", 20, this.text_pos);
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
        this.components_text = {
            x: Math.abs(this.components.x).toFixed(getDecimalPlaces()),
            y: Math.abs(this.components.y).toFixed(getDecimalPlaces())
        }
        this.angle = Math.atan2(Math.abs(to.y - from.y), Math.abs(to.x - from.x));
        this.deg_angle = radToDeg(this.angle);

        if (component == Component.X) {
            this.loc = {
                x: this.from.x + ((this.to.x - this.from.x) / 2),
                y: this.from.y + (this.quadrant > 2 ? 18 : -10)
            };
        } else if (component == Component.Y) {
            this.loc = {
                x: this.from.x + (this.quadrant == 2 || this.quadrant == 3 ? 20 : -12),
                y: this.to.y - ((this.to.y - this.from.y) / 2)
            };
        }
    }

    draw() {
        if (this.component == Component.X) {
            drawText(this.force.toFixed(0) + "cos(" + this.deg_angle.toFixed(0) + ") = " + this.components_text.x + " N", 10, this.loc);
        } else if (this.component == Component.Y) {
            rotateCanvas(-Math.PI / 2, this.loc);
            drawText(this.force.toFixed(0) + "sin(" + this.deg_angle.toFixed(0) + ") = " + this.components_text.y + " N", 10, { x: 0, y: 0 });
            unrotateCanvas();
        }
    }
};

// Load in all images in draw_shapes dictionary
var imgs = {
    square: { mult: 1 },
    circle: { mult: 0.7 },
    triangle: { mult: 0.5 },
    schleter: { mult: 0.45 },
    flower: { mult: 0.9 },
    hexagon: { mult: 0.75 },
}

for (var key in imgs) {
    var img = new Image();
    img.src = 'images/' + key + '.png';
    imgs[key]["img"] = img;
}

/**
 * Draws a shape onto the canvas
 */
class Shape {
    constructor(loc, shape, size = 20) {
        this.loc = loc;
        this.img = imgs[shape].img;
        this.size = size;
        this.mom_inertia = this.size * 50 * imgs[shape].mult;
        this.center = { x: this.loc.x - (this.size / 2), y: this.loc.y - (this.size / 2) };
        this.rotation = 0;
        this.last_rotation = 0;
        this.id = ++next_id;
    }

    getTorque() { return getNetTorque(this.loc); }

    getAngularAcceleration() { return -this.getTorque() / this.mom_inertia }

    /**
     * Take into account the time since last rotation
     * to follow the velocity
     */
    getAmountToRotate() {
        var time = Date.now() - this.last_rotation;
        return this.getAngularAcceleration() / 10 * time;
    }

    /**
     * Rotate the shape
     * 
     * @param {number} rads The radians to rotate by
     */
    rotate(rads) {
        this.rotation = (this.rotation + rads) % (2 * Math.PI);
        this.last_rotation = Date.now();
    }

    draw() {
        this.rotate(this.getAmountToRotate());

        rotateCanvas(this.rotation, this.loc);
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        unrotateCanvas();

        var mass_offset = 13;
        if (!doDisableTorque()) {
            drawText(this.getTorque().toFixed(getDecimalPlaces()) + " Nm", 12, { x: this.loc.x, y: this.center.y + this.size + 13 }, "profont");
            mass_offset = 24.5;
        }

        if (highlighted && highlighted.id == this.id) {
            setDrawColor("#5b5b5b");
            drawText(-this.getAngularAcceleration().toFixed(4) + " rad/s²", 11, { x: this.loc.x, y: this.center.y - 7 }, "profont");
            drawText(this.mom_inertia + " kg-m²", 11, { x: this.loc.x + 2, y: this.center.y + this.size + mass_offset }, "profont");
            resetDrawColor();
        }
    }
};

/**
 * Holds information about a rectangle given two of its points
 */
class Rect {
    constructor(from, to) {
        this.x = from.x < to.x ? from.x : to.x;
        this.y = from.y < to.y ? from.y : to.y;
        this.width = Math.abs(from.x - to.x);
        this.height = Math.abs(from.y - to.y);
    }

    contains(loc) {
        return this.x <= loc.x && loc.x <= this.x + this.width &&
            this.y <= loc.y && loc.y <= this.y + this.height;
    }
};