const editor = $('#editor');
const lineCol = $('#line-col');
const lineNumbers = $('#line-numbers');

let isWrapped = false;
let showLineNumbers = false;
let undoStack = [];
let redoStack = [];

function init() {
    initShortcuts();
    restoreState();
    updateLineCol();
    editor.addEventListener('input', onEditorInput);
    editor.addEventListener('click', updateLineCol);
    editor.addEventListener('keyup', updateLineCol);
    window.addEventListener('beforeunload', saveState);
}

function onEditorInput() {
    updateLineCol();
    saveState();
}

function updateLineCol() {
    const text = editor.value.substring(0, editor.selectionStart);
    const lines = text.split('\n');
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;
    lineCol.textContent = `Line ${currentLine}, Col ${currentCol}`;
    updateLineNumbers();
}

function updateLineNumbers() {
    if (!showLineNumbers) {
        lineNumbers.style.display = 'none';
        editor.style.paddingLeft = '10px';
        return;
    }
    lineNumbers.style.display = 'block';
    editor.style.paddingLeft = '40px';
    const lines = editor.value.split('\n');
    lineNumbers.innerHTML = lines.map((_, i) => `${i + 1}<br>`).join('');
}

function saveState() {
    undoStack.push(editor.value);
    redoStack = [];
    saveToLocalStorage('editorContent', editor.value);
}

function restoreState() {
    const savedContent = getFromLocalStorage('editorContent');
    if (savedContent) {
        editor.value = savedContent;
        updateLineCol();
    }
}

init();