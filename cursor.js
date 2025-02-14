document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; 
        mouseY = e.clientY;
    });

    function animateCursor() {
        posX += (mouseX - posX) * 0.1; 
        posY += (mouseY - posY) * 0.1;
        cursor.style.transform = `translate(${posX}px, ${posY}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();
});
