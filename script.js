document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  console.log('Initializing app');

  loadNavbar();
  loadFooter();
  attachEventListeners();

  // Get the theme from localStorage or default to 'light'
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Set the initial state of the toggle based on the saved theme
    themeToggle.checked = savedTheme === 'dark';

    // Add event listener to toggle switch
    themeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    });
  }

  // Hide the "Upload File" link if on the About page
  adjustPageSpecificContent();
}

function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
  console.log('Applied theme:', theme);
}

// Load the navbar dynamically
function loadNavbar() {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  return fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      navbarPlaceholder.innerHTML = data;
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        themeToggle.checked = savedTheme === 'dark';
        themeToggle.addEventListener('change', (e) => {
          const theme = e.target.checked ? 'dark' : 'light';
          applyTheme(theme);
          localStorage.setItem('theme', theme);
        });
      }
      // Add Sidebar Navigation Handler after navbar is loaded
      const hamburger = document.querySelector('.hamburger');
      if (hamburger) {
        hamburger.addEventListener('click', function() {
          this.classList.toggle('active');
          document.querySelector('.header-actions').classList.toggle('active');
        });
      }

      // Close sidebar when clicking outside
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.header-actions') && !e.target.closest('.hamburger')) {
          document.querySelector('.hamburger')?.classList.remove('active');
          document.querySelector('.header-actions')?.classList.remove('active');
        }
      });

      // Call adjustPageSpecificContent again after navbar is loaded
      adjustPageSpecificContent();
    })
    .catch(error => console.error('Error loading navbar:', error));
}

function adjustPageSpecificContent() {
  // Hide the "Upload File" link if on the About page
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'about.html') {
    const uploadLink = document.getElementById('upload-link');
    if (uploadLink) {
      uploadLink.style.display = 'none';
    }
  }
}

// Load the footer dynamically
function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  return fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      footerPlaceholder.innerHTML = data;
      // Set current year in footer
      document.getElementById('year').textContent = new Date().getFullYear();
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Attach theme selector listener
function attachThemeListener() {
  if (themeSelector) {
    themeSelector.addEventListener('change', (e) => {
      console.log('Theme changed to', e.target.value);
      applyTheme(e.target.value);
    });
  }
}

function applyTheme(theme) {
  document.body.className = `theme-${theme}`;
  console.log('Applied theme:', theme);
}

// Adjust Font Size
function adjustFontSize(size) {
  const fontSize = `${size}px`;
  const markdownInput = document.getElementById('markdown-input');
  const preview = document.getElementById('preview');
  
  if (markdownInput) {
    markdownInput.style.fontSize = fontSize;
  }
  if (preview) {
    preview.style.fontSize = fontSize;
  }
  console.log('Adjusted font size to', fontSize);
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
  console.log('Downloaded preview as HTML');
}

// Toggle Preview Mode (Real-Time vs Manual)
function togglePreviewMode(isRealTime) {
  const markdownInput = document.getElementById('markdown-input');
  const showPreviewButton = document.getElementById('show-preview');
  const isMobile = window.innerWidth <= 768;
  
  if (!markdownInput) {
    console.log('Markdown input not found, skipping preview mode toggle');
    return;
  }

  // Always enable real-time preview on mobile
  if (isMobile || isRealTime) {
    markdownInput.addEventListener('input', debouncedRenderMarkdown);
    console.log('Real-time preview enabled');
  } else {
    markdownInput.removeEventListener('input', debouncedRenderMarkdown);
    console.log('Manual preview enabled');
  }

  // Show preview button only when not in real-time mode and not on mobile
  if (showPreviewButton) {
    showPreviewButton.style.display = (isMobile || isRealTime) ? 'none' : 'inline-block';
  }
}

// Add window resize listener to handle preview button visibility
window.addEventListener('resize', debounce(() => {
  const isMobile = window.innerWidth <= 768;
  const markdownInput = document.getElementById('markdown-input');
  
  if (markdownInput) {
    // Re-enable real-time preview on mobile
    if (isMobile) {
      markdownInput.addEventListener('input', debouncedRenderMarkdown);
    }
    // Reset to user preference on desktop
    else {
      const realTimeToggle = document.getElementById('real-time-toggle');
      togglePreviewMode(realTimeToggle?.checked || false);
    }
  }
}, 250));

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  console.log('Downloaded file:', filename);
}

function downloadAsHtml() {
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Markdown Export</title>
      <style>
        body { 
          font-family: system-ui, -apple-system, sans-serif; 
          max-width: 800px; 
          margin: 40px auto; 
          padding: 20px;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      ${preview.innerHTML}
    </body>
    </html>
  `;
  downloadFile(new Blob([content], { type: 'text/html' }), 'export.html');
}

// Remove the old downloadAsPdf function and add this new one
async function downloadAsPdf() {
  try {
    document.body.style.cursor = 'wait';
    
    // Create new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    // Set basic styles
    doc.setFont('helvetica');
    doc.setFontSize(12);
    
    // Get the HTML content with styles
    const content = preview.innerHTML;
    
    // Create a temporary container with styles
    const temp = document.createElement('div');
    temp.innerHTML = content;
    temp.style.cssText = `
      font-family: helvetica;
      font-size: 12pt;
      line-height: 1.5;
      padding: 20px;
    `;

    // Apply markdown styles
    const styles = `
      h1 { font-size: 24pt; margin: 20px 0; font-weight: bold; }
      h2 { font-size: 20pt; margin: 18px 0; font-weight: bold; }
      h3 { font-size: 16pt; margin: 16px 0; font-weight: bold; }
      p { margin: 12px 0; }
      code { font-family: monospace; background: #f5f5f5; padding: 2px 4px; }
      pre { background: #f5f5f5; padding: 10px; margin: 10px 0; }
      blockquote { border-left: 3px solid #ccc; padding-left: 10px; margin: 10px 0; }
      ul, ol { margin: 10px 0; padding-left: 20px; }
      li { margin: 5px 0; }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    temp.appendChild(styleSheet);
    document.body.appendChild(temp);

    // Convert to PDF with applied styles
    await doc.html(temp, {
      callback: function(doc) {
        doc.save('markdown-export.pdf');
      },
      x: 15,
      y: 15,
      width: 180,
      windowWidth: 800
    });

    // Cleanup
    document.body.removeChild(temp);
    console.log('PDF generated successfully');
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    document.body.style.cursor = 'default';
  }
}

function downloadAsMarkdown() {
  const content = markdownInput.value;
  downloadFile(new Blob([content], { type: 'text/markdown' }), 'export.md');
}

// Attach event listeners
function attachEventListeners() {
  console.log('Attaching event listeners');

  // Check if elements exist before attaching listeners
  const showPreviewButton = document.getElementById('show-preview');
  if (showPreviewButton) {
    showPreviewButton.addEventListener('click', () => {
      console.log('Show Preview button clicked');
      renderMarkdown();
    });
  }

  // Move fontSizeSelector inside this function
  const fontSizeSelector = document.getElementById('font-size-selector');
  if (fontSizeSelector) {
    fontSizeSelector.addEventListener('change', (e) => {
      console.log('Font size changed to', e.target.value);
      adjustFontSize(e.target.value);
    });
  }

  // Move other element checks inside this function
  const realTimeToggle = document.getElementById('real-time-toggle');
  const spellCheckToggle = document.getElementById('spell-check-toggle');
  const downloadHtmlButton = document.getElementById('download-html');
  const downloadPdfButton = document.getElementById('download-pdf');
  const downloadMdButton = document.getElementById('download-md');
  const clearButton = document.getElementById('clear-markdown');

  // Check if we're on the main editor page
  const markdownInput = document.getElementById('markdown-input');
  const isEditorPage = !!markdownInput;

  // Attach listeners only if elements exist
  if (realTimeToggle) {
    realTimeToggle.addEventListener('change', (e) => {
      console.log('Real-time toggle changed to', e.target.checked);
      togglePreviewMode(e.target.checked);
    });
  }

  if (spellCheckToggle) {
    spellCheckToggle.addEventListener('click', () => {
      const currentState = markdownInput.spellcheck;
      console.log('Spell check toggled to', !currentState);
      markdownInput.spellcheck = !currentState;
      spellCheckToggle.classList.toggle('active');
      const value = markdownInput.value;
      markdownInput.value = '';
      markdownInput.value = value;
    });
  }

  if (downloadHtmlButton && isEditorPage) {
    downloadHtmlButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Download HTML button clicked');
      downloadAsHtml();
    });
  }

  if (downloadPdfButton) {
    downloadPdfButton.addEventListener('click', async (e) => {
      e.preventDefault();
      if (downloadPdfButton.disabled) return; // Prevent double clicks
      downloadPdfButton.disabled = true; // Disable button while processing
      console.log('Download PDF button clicked');
      await downloadAsPdf();
      downloadPdfButton.disabled = false; // Re-enable button after processing
    });
  }

  if (downloadMdButton) {
    downloadMdButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Download Markdown button clicked');
      downloadAsMarkdown();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      markdownInput.value = '';
      renderMarkdown();
      console.log('Clear button clicked, markdown input cleared');
    });
  }
}

const debouncedRenderMarkdown = debounce(renderMarkdown, 200);

function initializeApp() {
  console.log('Initializing app');
  
  Promise.all([loadNavbar(), loadFooter()])
    .then(() => {
      attachEventListeners(); // Only call this once
      applyTheme('light');
      
      const markdownInput = document.getElementById('markdown-input');
      const preview = document.getElementById('preview');
      
      if (markdownInput && preview) {
        const fontSizeSelector = document.getElementById('font-size-selector');
        adjustFontSize(fontSizeSelector ? fontSizeSelector.value : '18');
        
        // Enable real-time preview by default on mobile
        const isMobile = window.innerWidth <= 768;
        togglePreviewMode(isMobile);
        
        // Update real-time toggle to reflect mobile state
        const realTimeToggle = document.getElementById('real-time-toggle');
        if (realTimeToggle && isMobile) {
          realTimeToggle.checked = true;
        }
      } else {
        console.log('Not on markdown editor page, skipping editor initialization');
      }
    })
    .catch(error => console.error('Error initializing app:', error));
} // Add missing closing brace here

function renderMarkdown() {
  const markdownInput = document.getElementById('markdown-input');
  const preview = document.getElementById('preview');
  
  if (!markdownInput || !preview) {
    console.log('Markdown editor elements not found on this page');
    return;
  }

  const markdownText = markdownInput.value;
  console.log('Rendering markdown:', markdownText);
  try {
    preview.innerHTML = marked.parse(markdownText) || '<p>No content to preview</p>';
    console.log('Markdown rendered successfully');
  } catch (error) {
    console.log('Error rendering markdown:', error);
    preview.innerHTML = `<p style="color: red;">Error rendering markdown: ${error.message}</p>`;
  }
}

function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function adjustFontSize(size) {
  const fontSize = `${size}px`;
  const markdownInput = document.getElementById('markdown-input');
  const preview = document.getElementById('preview');
  
  if (markdownInput) {
    markdownInput.style.fontSize = fontSize;
  }
  if (preview) {
    preview.style.fontSize = fontSize;
  }
  console.log('Adjusted font size to', fontSize);
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  console.log('Downloaded file:', filename);
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
  try {
    document.body.style.cursor = 'wait';
    
    // Create new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    // Set basic styles
    doc.setFont('helvetica');
    doc.setFontSize(12);
    
    // Get the HTML content with styles
    const content = preview.innerHTML;
    
    // Create a temporary container with styles
    const temp = document.createElement('div');
    temp.innerHTML = content;
    temp.style.cssText = `
      font-family: helvetica;
      font-size: 12pt;
      line-height: 1.5;
      padding: 20px;
    `;

    // Apply markdown styles
    const styles = `
      h1 { font-size: 24pt; margin: 20px 0; font-weight: bold; }
      h2 { font-size: 20pt; margin: 18px 0; font-weight: bold; }
      h3 { font-size: 16pt; margin: 16px 0; font-weight: bold; }
      p { margin: 12px 0; }
      code { font-family: monospace; background: #f5f5f5; padding: 2px 4px; }
      pre { background: #f5f5f5; padding: 10px; margin: 10px 0; }
      blockquote { border-left: 3px solid #ccc; padding-left: 10px; margin: 10px 0; }
      ul, ol { margin: 10px 0; padding-left: 20px; }
      li { margin: 5px 0; }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    temp.appendChild(styleSheet);
    document.body.appendChild(temp);

    // Convert to PDF with applied styles
    await doc.html(temp, {
      callback: function(doc) {
        doc.save('markdown-export.pdf');
      },
      x: 15,
      y: 15,
      width: 180,
      windowWidth: 800
    });

    // Cleanup
    document.body.removeChild(temp);
    console.log('PDF generated successfully');
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    document.body.style.cursor = 'default';
  }
}

function downloadAsMarkdown() {
  const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
  downloadFile(blob, 'markdown-content.md');
}

// Toggle Preview Mode (Real-Time vs Manual)
function togglePreviewMode(isRealTime) {
  const markdownInput = document.getElementById('markdown-input');
  const showPreviewButton = document.getElementById('show-preview');
  const isMobile = window.innerWidth <= 768;
  
  if (!markdownInput) {
    console.log('Markdown input not found, skipping preview mode toggle');
    return;
  }

  // Always enable real-time preview on mobile
  if (isMobile || isRealTime) {
    markdownInput.addEventListener('input', debouncedRenderMarkdown);
    console.log('Real-time preview enabled');
  } else {
    markdownInput.removeEventListener('input', debouncedRenderMarkdown);
    console.log('Manual preview enabled');
  }

  // Show preview button only when not in real-time mode and not on mobile
  if (showPreviewButton) {
    showPreviewButton.style.display = (isMobile || isRealTime) ? 'none' : 'inline-block';
  }
}

// Add window resize listener to handle preview button visibility
window.addEventListener('resize', debounce(() => {
  const isMobile = window.innerWidth <= 768;
  const markdownInput = document.getElementById('markdown-input');
  
  if (markdownInput) {
    // Re-enable real-time preview on mobile
    if (isMobile) {
      markdownInput.addEventListener('input', debouncedRenderMarkdown);
    }
    // Reset to user preference on desktop
    else {
      const realTimeToggle = document.getElementById('real-time-toggle');
      togglePreviewMode(realTimeToggle?.checked || false);
    }
  }
}, 250));