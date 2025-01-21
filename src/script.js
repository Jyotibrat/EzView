// script.js

const markdownInput = document.getElementById('markdown-input');
const preview = document.getElementById('preview');
const showPreviewButton = document.getElementById('show-preview');
const themeSelector = document.getElementById('theme-selector');
const fontSizeSelector = document.getElementById('font-size-selector');

// Render Markdown (only when button is clicked)
function renderMarkdown() {
  const markdownText = markdownInput.value;
  preview.innerHTML = marked.parse(markdownText);
}

// Theme Switcher
themeSelector.addEventListener('change', (e) => {
  document.body.className = `theme-${e.target.value}`;
});

// Font Size Adjuster
fontSizeSelector.addEventListener('change', (e) => {
  const fontSize = `${e.target.value}px`;
  markdownInput.style.fontSize = fontSize;
  preview.style.fontSize = fontSize;
});

// Show Preview on Button Click
showPreviewButton.addEventListener('click', renderMarkdown);

// Spell check functionality
const spellCheckToggle = document.getElementById('spell-check-toggle');

spellCheckToggle.addEventListener('click', () => {
    const currentState = markdownInput.spellcheck;
    markdownInput.spellcheck = !currentState;
    spellCheckToggle.classList.toggle('active');
    
    // Force refresh of spell checking
    const value = markdownInput.value;
    markdownInput.value = '';
    markdownInput.value = value;
});

// Updated Download functionality
document.getElementById('download-html').addEventListener('click', (e) => {
  e.preventDefault();
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Preview</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
  </style>
</head>
<body>
  ${preview.innerHTML}
</body>
</html>`;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  downloadFile(blob, 'markdown-preview.html');
});

document.getElementById('download-pdf').addEventListener('click', async (e) => {
  e.preventDefault();
  
  // Create a clone of the preview content
  const element = document.createElement('div');
  element.innerHTML = preview.innerHTML;
  element.style.padding = '20px';
  element.style.fontFamily = 'Arial, sans-serif';

  // Configure PDF options
  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'markdown-preview.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    // Show loading state (you can add a loading spinner here)
    document.body.style.cursor = 'wait';
    
    // Generate PDF
    await html2pdf().from(element).set(opt).save();
    
    // Reset cursor
    document.body.style.cursor = 'default';
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
    document.body.style.cursor = 'default';
  }
});

document.getElementById('download-md').addEventListener('click', (e) => {
  e.preventDefault();
  const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
  downloadFile(blob, 'markdown-content.md');
});

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}