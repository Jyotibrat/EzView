const htmlInput = document.getElementById('html-input');
const cssInput = document.getElementById('css-input');
const jsInput = document.getElementById('js-input');
const livePreview = document.getElementById('live-preview').contentWindow.document;
const popToggleButton = document.getElementById('pop-toggle');
const fontIncreaseButton = document.getElementById('font-increase');
const fontDecreaseButton = document.getElementById('font-decrease');
const editorContainer = document.getElementById('editor-container');
const previewContainer = document.getElementById('preview-container');
const togglePreviewButton = document.getElementById('toggle-preview');
const toast = document.getElementById('toast');
let popOutWindow = null;
let isDragging = false;

// Initialize CodeMirror
const htmlEditor = CodeMirror.fromTextArea(htmlInput, {
    mode: 'htmlmixed',
    lineNumbers: true,
    theme: 'dracula'
});

const cssEditor = CodeMirror.fromTextArea(cssInput, {
    mode: 'css',
    lineNumbers: true,
    theme: 'dracula'
});

const jsEditor = CodeMirror.fromTextArea(jsInput, {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'dracula'
});

// Live Preview Update
const editors = [htmlEditor, cssEditor, jsEditor];

editors.forEach(editor => {
    editor.on('change', () => {
        updatePreview(livePreview, htmlEditor.getValue(), cssEditor.getValue(), jsEditor.getValue());
        if (popOutWindow && !popOutWindow.closed) {
            updatePreview(popOutWindow.document, htmlEditor.getValue(), cssEditor.getValue(), jsEditor.getValue());
        }
    });
});

// Update Preview Function
function updatePreview(doc, htmlContent, cssContent, jsContent) {
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${cssContent}</style>
        </head>
        <body>
            ${htmlContent}
            <script>${jsContent}<\/script>
        </body>
        </html>
    `);
    doc.close();
}

// Show Toast Message
function showToast(message) {
    toast.textContent = message;
    toast.className = "show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
        toast.textContent = ""; // Clear the message after hiding
    }, 3000);
}

// Pop-out Preview
popToggleButton.addEventListener('click', () => {
    if (popOutWindow && !popOutWindow.closed) {
        // Pop-back functionality
        popOutWindow.close();
        popOutWindow = null;
        popToggleButton.textContent = '↗️';
        popToggleButton.title = 'Pop-out Preview';
        editorContainer.style.width = '50%';
        previewContainer.style.width = '50%';
        previewContainer.style.display = 'flex';
    } else {
        // Pop-out functionality
        popOutWindow = window.open("", "popout", "width=800,height=600");
        updatePreview(popOutWindow.document, htmlEditor.getValue(), cssEditor.getValue(), jsEditor.getValue());
        popToggleButton.textContent = '↙️';
        popToggleButton.title = 'Pop-back Preview';
        editorContainer.style.width = '100%';
        previewContainer.style.display = 'none';
    }
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
    editors.forEach(editor => {
        editor.getWrapperElement().style.fontSize = `${fontSize}px`;
        editor.refresh();
    });
});

fontDecreaseButton.addEventListener('click', () => {
    fontSize -= 1;
    editors.forEach(editor => {
        editor.getWrapperElement().style.fontSize = `${fontSize}px`;
        editor.refresh();
    });
});

// Initial Template for Testing
htmlEditor.setValue(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a test page for the live preview.</p>
</body>
</html>`);
cssEditor.setValue(`body { background: #f4f4f4; font-family: Arial, sans-serif; text-align: center; }
h1 { color: #333; }`);
jsEditor.setValue(`console.log('Hello, World!');`);

htmlEditor.refresh();
cssEditor.refresh();
jsEditor.refresh();

// Switch Editor Functionality
const switchHtmlButton = document.getElementById('switch-html');
const switchCssButton = document.getElementById('switch-css');
const switchJsButton = document.getElementById('switch-js');

switchHtmlButton.addEventListener('click', () => {
    switchEditor('html');
});

switchCssButton.addEventListener('click', () => {
    switchEditor('css');
});

switchJsButton.addEventListener('click', () => {
    switchEditor('js');
});

function switchEditor(editorType) {
    document.querySelectorAll('.CodeMirror').forEach(editor => {
        editor.style.display = 'none';
    });

    switchHtmlButton.classList.remove('active');
    switchCssButton.classList.remove('active');
    switchJsButton.classList.remove('active');

    if (editorType === 'html') {
        htmlEditor.getWrapperElement().style.display = 'block';
        switchHtmlButton.classList.add('active');
        htmlEditor.refresh();
    } else if (editorType === 'css') {
        cssEditor.getWrapperElement().style.display = 'block';
        switchCssButton.classList.add('active');
        cssEditor.refresh();
    } else if (editorType === 'js') {
        jsEditor.getWrapperElement().style.display = 'block';
        switchJsButton.classList.add('active');
        jsEditor.refresh();
    }
}

switchEditor('html'); // Set initial editor to HTML

// Toggle Preview Functionality
togglePreviewButton.addEventListener('click', () => {
    if (popOutWindow && !popOutWindow.closed) {
        showToast('Preview is popped out');
        return;
    }
    if (previewContainer.style.display === 'none') {
        previewContainer.style.display = 'flex';
        editorContainer.style.width = '50%';
    } else {
        previewContainer.style.display = 'none';
        editorContainer.style.width = '100%';
    }
});