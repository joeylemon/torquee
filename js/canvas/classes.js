/**
 * Holds information about a mouse drag
 */
class Drag {
    constructor(from, to) {
        this.distance = distance(from, to);
        this.force = getDragForce(this.distance);
        this.txt_pos = {x: to.x + 15, y: to.y + 10};
    }

    getForce(){ return this.force; }
    getText(){ return this.force.toFixed(0) + " N"; }
    getTextPosition(){ return this.txt_pos; }
};

/**
 * Floating text that is meant be downsized until it reaches zero
 */
class FloatingText {
    constructor(text, txt_pos, disappear_speed = 0.6) {
        this.text = text;
        this.txt_pos = txt_pos;
        this.disappear_speed = disappear_speed;
        this.size = 23;
    }

    getSize() { return this.size; }
    decrease() { this.size -= this.disappear_speed; return this.size; }
    getText() { return this.text; }
    getTextPosition() { return this.txt_pos; }
};