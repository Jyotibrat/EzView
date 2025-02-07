let pyodide;
let editor;

async function initPyodide() {
  pyodide = await loadPyodide();
  console.log("Pyodide loaded successfully");

  // Set up a simpler input function that writes to stdout before getting input
  pyodide.runPython(`
        import sys
        from js import prompt
        
        def custom_input(prompt_text=""):
            # Write the prompt to stdout first
            sys.stdout.write(prompt_text)
            sys.stdout.flush()
            # Use JavaScript's prompt function directly
            result = prompt(prompt_text)
            if result is None:
                raise EOFError("User cancelled input")
            # Write the user's input to stdout
            sys.stdout.write(result + "\\n")
            sys.stdout.flush()
            return result

        __builtins__.input = custom_input
    `);
}

function initCodeMirror() {
  editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
    mode: "python",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    extraKeys: {
      Tab: (cm) => {
        cm.replaceSelection("    ", "end");
      },
    },
  });

  editor.setSize("100%", "auto");
}

// Initialize both Pyodide and CodeMirror
initPyodide();
initCodeMirror();

document.getElementById("run-button").addEventListener("click", async () => {
  if (!pyodide) {
    console.log("Pyodide is not loaded yet");
    return;
  }

  const code = editor.getValue();
  const outputElement = document.getElementById("output");

  // Clear previous output
  outputElement.textContent = "";
  outputElement.style.color = ""; // Reset error color

  try {
    // Set up stdout capture
    pyodide.runPython(`
            import sys
            import io
            sys.stdout = io.StringIO()
        `);

    // Add a terminal prompt at the start
    outputElement.textContent = ">>> Running Python program...\n\n";

    // Run the user's code
    await pyodide.runPythonAsync(code);

    // Get the captured output
    const output = pyodide.runPython("sys.stdout.getvalue()");
    outputElement.textContent += output + "\n>>> Program finished.";
  } catch (error) {
    outputElement.textContent += `\nError: ${error.message}`;
    outputElement.style.color = "#f44747";
  }
});

document.getElementById("toggle-terminal").addEventListener("click", () => {
  const terminal = document.getElementById("terminal");
  if (terminal.style.display === "" || terminal.style.display === "none") {
    terminal.style.display = "flex";
  } else {
    terminal.style.display = "none";
  }
});

document.getElementById("close-terminal").addEventListener("click", () => {
  const terminal = document.getElementById("terminal");
  terminal.style.display = "none";
});

document.getElementById("add-file").addEventListener("click", () => {
  document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", (event) => {
  const fileList = document.getElementById("file-list");
  Array.from(event.target.files).forEach((file) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    li.draggable = true;
    li.addEventListener("click", () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        editor.setValue(e.target.result);
      };
      reader.readAsText(file);
    });
    fileList.appendChild(li);
  });
});

document.getElementById("create-file").addEventListener("click", () => {
  const fileName = prompt("Enter the name of the new file:");
  if (fileName) {
    const fileList = document.getElementById("file-list");
    const li = document.createElement("li");
    li.textContent = fileName;
    li.draggable = true;
    li.addEventListener("click", () => {
      editor.setValue("");
    });
    fileList.appendChild(li);
  }
});

document.getElementById("close-sidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("file-sidebar");
  sidebar.classList.add("hidden");
  updateEditorSize();
});

document.getElementById("toggle-sidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("file-sidebar");
  sidebar.classList.toggle("hidden");
  updateEditorSize();
});

function updateEditorSize() {
  const sidebar = document.getElementById("file-sidebar");
  const editorTerminalContainer = document.getElementById("editor-terminal-container");
  if (sidebar.classList.contains("hidden")) {
    editorTerminalContainer.style.width = "100%";
  } else {
    editorTerminalContainer.style.width = "calc(100% - 250px)";
  }
}

// Resizing functionality
const resizer = document.getElementById('resizer');
const editorContainer = document.querySelector('.editor-container');
const terminal = document.querySelector('.output-container');

let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
  isResizing = true;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
  });
});

function handleMouseMove(e) {
  if (!isResizing) return;

  const offset = e.clientY - editorContainer.getBoundingClientRect().top;
  const containerHeight = resizer.parentNode.getBoundingClientRect().height;

  if (offset < 50 || offset > containerHeight - 50) return; // prevent too small or too large resizing

  editorContainer.style.height = `${offset}px`;
  terminal.style.height = `${containerHeight - offset - resizer.offsetHeight}px`;
}