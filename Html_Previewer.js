const htmlInput = document.getElementById('html-input');
const livePreview = document.getElementById('live-preview').contentWindow.document;
const popOutButton = document.getElementById('pop-out');
const fontIncreaseButton = document.getElementById('font-increase');
const fontDecreaseButton = document.getElementById('font-decrease');
const editorContainer = document.getElementById('editor-container');
const previewContainer = document.getElementById('preview-container');
const divider = document.getElementById('divider');
let popOutWindow = null;
let isDragging = false;

// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(htmlInput, {
    mode: 'htmlmixed',
    lineNumbers: true,
    theme: 'dracula'
});

// Live Preview Update
editor.on('change', () => {
    updatePreview(livePreview, editor.getValue());
    if (popOutWindow && !popOutWindow.closed) {
        updatePreview(popOutWindow.document, editor.getValue());
    }
});

// Update Preview Function
function updatePreview(doc, content) {
    doc.open();
    doc.write(content);
    doc.close();
}

// Pop Out Preview
popOutButton.addEventListener('click', () => {
    if (popOutWindow && !popOutWindow.closed) {
        popOutWindow.focus();
        return;
    }
    popOutWindow = window.open("", "popout", "width=800,height=600");
    updatePreview(popOutWindow.document, editor.getValue());

    // Hide the pop-out button
    popOutButton.style.display = 'none';

    popOutWindow.onbeforeunload = () => {
        editorContainer.style.width = '50%';
        previewContainer.style.width = '50%';
        previewContainer.style.display = 'flex';

        // Show the pop-out button
        popOutButton.style.display = 'flex';
    };

    editorContainer.style.width = '100%';
    previewContainer.style.display = 'none';
});

// Resizable Divider
divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
});

function drag(e) {
    if (!isDragging) return;
    
    const minWidth = 200; 
    const maxWidth = window.innerWidth - minWidth;
    const offset = Math.min(maxWidth, Math.max(minWidth, e.clientX));

    editorContainer.style.width = `${offset}px`;
    previewContainer.style.width = `${window.innerWidth - offset}px`;
    
    // Temporarily disable iframe interaction
    document.getElementById("live-preview").style.pointerEvents = "none";
}

function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
    
    // Re-enable iframe interaction
    document.getElementById("live-preview").style.pointerEvents = "auto";
}

// Font Size Control
let fontSize = 14; // Initial font size

fontIncreaseButton.addEventListener('click', () => {
    fontSize += 1;
    editor.getWrapperElement().style.fontSize = `${fontSize}px`;
    editor.refresh();
});

fontDecreaseButton.addEventListener('click', () => {
    fontSize -= 1;
    editor.getWrapperElement().style.fontSize = `${fontSize}px`;
    editor.refresh();
});

// Initial Template for Testing
editor.setValue(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
    <style>
        body { background: #f4f4f4; font-family: Arial, sans-serif; text-align: center; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a test page for the live preview.</p>
</body>
</html>`);
editor.refresh();