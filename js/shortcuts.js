const SHORTCUTS = {
    's': { name: 'Save', action: saveFile },
    'q': { name: 'Quit', action: quitEditor },
    'o': { name: 'Open', action: openFile },
    'g': { name: 'Help', action: showHelp },
    'l': { name: 'Toggle Line Numbers', action: toggleLineNumbers },
    'i': { name: 'Indent', action: indent },
    'u': { name: 'Unindent', action: unindent },
};

function initShortcuts() {
    const shortcutsContainer = $('#shortcuts');
    Object.entries(SHORTCUTS).forEach(([key, { name }]) => {
        shortcutsContainer.innerHTML += `<span class="shortcut">^${key.toUpperCase()} ${name}</span>`;
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && SHORTCUTS[e.key.toLowerCase()]) {
            e.preventDefault();
            SHORTCUTS[e.key.toLowerCase()].action();
        }
    });
}

function saveFile() {
    const blob = new Blob([editor.value], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = prompt('Enter filename:', 'editor_content.txt') || 'editor_content.txt';
    a.click();
}

function quitEditor() {
    if (confirm('Are you sure you want to quit?')) {
        window.close();
    }
}

function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.value = e.target.result;
            updateLineCol();
            saveState();
        };
        reader.readAsText(file);
    };
    input.click();
}

function showHelp() {
    alert('Help: This is a web-based Nano-like editor.\n\nShortcuts:\n^S: Save\n^Q: Quit\n^O: Open\n^G: Help\n^L: Toggle Line Numbers\n^I: Indent\n^U: Unindent');
}

function toggleLineNumbers() {
    showLineNumbers = !showLineNumbers;
    updateLineNumbers();
}

function indent() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const lines = editor.value.slice(start, end).split('\n');
    const indentedLines = lines.map(line => '    ' + line);
    editor.setRangeText(indentedLines.join('\n'), start, end, 'select');
    saveState();
}

function unindent() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const lines = editor.value.slice(start, end).split('\n');
    const unindentedLines = lines.map(line => line.replace(/^( {1,4}|\t)/, ''));
    editor.setRangeText(unindentedLines.join('\n'), start, end, 'select');
    saveState();
}

// Define shortcut actions here (saveFile, quitEditor, etc.)