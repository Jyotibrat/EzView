// Function to load the navbar
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        });
}

// Function to load the footer
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            // Set the current year in the footer
            document.getElementById('year').textContent = new Date().getFullYear();
        });
}

// Load navbar and footer when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
});