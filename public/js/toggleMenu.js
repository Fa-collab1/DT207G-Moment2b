function toggleMenu() {
    var navLinks = document.querySelector('.nav-links'); //hitta nav-links
    if (navLinks.style.display === "block") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "block";  // visa nav-links när knappen klickas
    }
}
