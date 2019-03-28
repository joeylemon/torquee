// An array of all overlay info-box elements
var infoboxes = document.getElementById("overlay").getElementsByClassName("info-box");

// Initialize the overlay
$("#overlay").hide();
initNav();

/**
 * Initialize the nav elements to be able to open overlay menus
 */
function initNav() {
    var nav = document.getElementById("nav").getElementsByTagName("a");
    for(var i = 0; i < nav.length; i++) {
        nav[i].id = "nav-" + i;
        nav[i].onclick = openMenu;
    }

    for(var i = 0; i < infoboxes.length; i++) {
        infoboxes[i].id = "menu-" + i;
        infoboxes[i].getElementsByClassName("close")[0].onclick = closeMenu;
    }
}

/**
 * Open an overlay menu
 */
function openMenu(event) {
    // Determine the id of the overlay element to open
    // by using the id of the nav element
    var id = parseInt(event.srcElement.id.substring(4));

    // Hide all other overlay boxes
    for(var i = 0; i < infoboxes.length; i++) {
        $("#" + infoboxes[i].id).hide();
    }
    $("#toolbox").hide();

    // Show the overlay
    $("#overlay").fadeIn(200);
    $("#menu-" + id).show();
}

/**
 * Close an overlay menu
 */
function closeMenu(event) {
    $("#overlay").fadeOut(200);
    $("#toolbox").fadeIn(200);
}