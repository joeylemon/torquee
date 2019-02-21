var infoboxes = document.getElementById("overlay").getElementsByClassName("info-box");

$("#overlay").hide();
initNav();

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

function openMenu(event) {
    var id = parseInt(event.srcElement.id.substring(4));

    for(var i = 0; i < infoboxes.length; i++) {
        $("#" + infoboxes[i].id).hide();
    }

    $("#overlay").fadeIn(200);
    $("#menu-" + id).show();
}

function closeMenu(event) {
    $("#overlay").fadeOut(200);
}