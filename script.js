// script.js

const markdownInput = document.getElementById('markdown-input');
const preview = document.getElementById('preview');
const showPreviewButton = document.getElementById('show-preview');
const themeSelector = document.getElementById('theme-selector');
const fontSizeSelector = document.getElementById('font-size-selector');
const realTimeToggle = document.getElementById('real-time-toggle');
const spellCheckToggle = document.getElementById('spell-check-toggle');

// Utility: Debounce function for performance optimization (real-time preview)
function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
function renderMarkdown() {
  const markdownText = markdownInput.value;
  try {
    preview.innerHTML = marked.parse(markdownText) || '<p>No content to preview</p>';
  } catch (error) {
    preview.innerHTML = `<p style="color: red;">Error rendering markdown: ${error.message}</p>`;
  }
}

// Theme Switcher
themeSelector.addEventListener('change', (e) => {
  document.body.className = `theme-${e.target.value}`;
});

function applyTheme(theme) {
  document.body.className = `theme-${theme}`;
}

// Adjust Font Size
function adjustFontSize(size) {
  const fontSize = `${size}px`;
  markdownInput.style.fontSize = fontSize;
  preview.style.fontSize = fontSize;
}

// Download Preview as HTML
function downloadPreview() {
  const blob = new Blob([preview.innerHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'markdown-preview.html';
  a.click();
  URL.revokeObjectURL(url);
}

// Toggle Preview Mode (Real-Time vs Manual)
function togglePreviewMode(isRealTime) {
  if (isRealTime) {
    markdownInput.addEventListener('input', debouncedRenderMarkdown);
    showPreviewButton.style.display = 'none'; 
  } else {
    markdownInput.removeEventListener('input', debouncedRenderMarkdown);
    showPreviewButton.style.display = 'inline-block'; // Show manual preview button
  }
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAsHtml() {
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
}

async function downloadAsPdf() {
  const element = document.createElement('div');
  element.innerHTML = preview.innerHTML;
  element.style.padding = '20px';
  element.style.fontFamily = 'Arial, sans-serif';

  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'markdown-preview.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    document.body.style.cursor = 'wait';
    await html2pdf().from(element).set(opt).save();
    document.body.style.cursor = 'default';
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
    document.body.style.cursor = 'default';
  }
}

function downloadAsMarkdown() {
  const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
  downloadFile(blob, 'markdown-content.md');
}

function attachEventListeners() {
  // Manual Preview Button
  showPreviewButton.addEventListener('click', renderMarkdown);

  // Theme Selector
  themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));
  fontSizeSelector.addEventListener('change', (e) => adjustFontSize(e.target.value));
  realTimeToggle.addEventListener('change', (e) => togglePreviewMode(e.target.checked));
  
  // Spell check toggle
  spellCheckToggle.addEventListener('click', () => {
    const currentState = markdownInput.spellcheck;
    markdownInput.spellcheck = !currentState;
    spellCheckToggle.classList.toggle('active');
    
    // Force refresh of spell checking
    const value = markdownInput.value;
    markdownInput.value = '';
    markdownInput.value = value;
  });
  
  // Download buttons
  document.getElementById('download-html').addEventListener('click', (e) => {
    e.preventDefault();
    downloadAsHtml();
  });
  
  document.getElementById('download-pdf').addEventListener('click', async (e) => {
    e.preventDefault();
    await downloadAsPdf();
  });
  
  document.getElementById('download-md').addEventListener('click', (e) => {
    e.preventDefault();
    downloadAsMarkdown();
  });
}

const debouncedRenderMarkdown = debounce(renderMarkdown, 200);

function initializeApp() {
  attachEventListeners();
  applyTheme(themeSelector.value);
  adjustFontSize(fontSizeSelector.value);
  togglePreviewMode(false);
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Get reference to the Clear button
const clearButton = document.getElementById('clear-markdown');

clearButton.addEventListener('click', () => {
  markdownInput.value = ''; 
  renderMarkdown(); 
});
