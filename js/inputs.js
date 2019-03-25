// Listen for a right click
$("#canvas").contextmenu(function(e) {
    shapes.push({x: e.pageX, y: e.pageY});
    e.preventDefault();
    return false;
});

// Keep track of if the command button is down
// May be useful in the future for more controls
var cmd_down = false;
window.onkeydown = function(e) {
    var code = e.keyCode;
    //console.log(code);
    if(code == 91) {
        cmd_down = true;
    }
};
window.onkeyup = function(e) {
    var code = e.keyCode;
    if(code == 91) {
        cmd_down = false;
    }
};