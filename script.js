// script.js

const markdownInput = document.getElementById('markdown-input');
const preview = document.getElementById('preview');
const showPreviewButton = document.getElementById('show-preview');
const themeSelector = document.getElementById('theme-selector');
const fontSizeSelector = document.getElementById('font-size-selector');
const downloadButton = document.getElementById('download-html');
const realTimeToggle = document.getElementById('real-time-toggle');

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


function attachEventListeners() {
  // Manual Preview Button
  showPreviewButton.addEventListener('click', renderMarkdown);

  // Theme Selector
  themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));
  fontSizeSelector.addEventListener('change', (e) => adjustFontSize(e.target.value));
  downloadButton.addEventListener('click', downloadPreview);
  realTimeToggle.addEventListener('change', (e) => togglePreviewMode(e.target.checked));
}

const debouncedRenderMarkdown = debounce(renderMarkdown, 200);

function initializeApp() {
  attachEventListeners();
  applyTheme(themeSelector.value);
  adjustFontSize(fontSizeSelector.value);
  togglePreviewMode(false);
}

document.addEventListener('DOMContentLoaded', initializeApp);
