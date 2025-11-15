// JSON Viewer Script

const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const formatBtn = document.getElementById('formatBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const removeWhitespaceBtn = document.getElementById('removeWhitespaceBtn');
const aboutBtn = document.getElementById('aboutBtn');

// Tab functionality
const tabs = document.querySelectorAll('.tab');
const viewerTab = document.getElementById('viewer-tab');
const textTab = document.getElementById('text-tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');

        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show/hide tab content
        if (tabName === 'viewer') {
            viewerTab.classList.add('active');
            textTab.classList.remove('active');
        } else {
            viewerTab.classList.remove('active');
            textTab.classList.add('active');
        }
    });
});

// Example JSON data
const exampleJSON = {
    "user": "matanwieder",
    "name": "John",
    "age": 30
};

// Copy button click handler
copyBtn.addEventListener('click', async () => {
    const inputText = jsonInput.value.trim();

    if (!inputText) {
        alert('No JSON to copy');
        return;
    }

    try {
        await navigator.clipboard.writeText(inputText);

        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        alert('Failed to copy to clipboard');
    }
});

// Format JSON button click handler
formatBtn.addEventListener('click', () => {
    const inputText = jsonInput.value.trim();

    if (!inputText) {
        alert('Please enter some JSON data');
        return;
    }

    try {
        const jsonData = JSON.parse(inputText);
        jsonInput.value = JSON.stringify(jsonData, null, 2);
        renderJSON(jsonData);

        // Switch to text tab to show the tree view
        tabs[1].click();
    } catch (error) {
        alert('Invalid JSON: ' + error.message);
    }
});

// Remove whitespace button click handler
removeWhitespaceBtn.addEventListener('click', () => {
    const inputText = jsonInput.value.trim();

    if (!inputText) {
        alert('Please enter some JSON data');
        return;
    }

    try {
        const jsonData = JSON.parse(inputText);
        jsonInput.value = JSON.stringify(jsonData);
    } catch (error) {
        alert('Invalid JSON: ' + error.message);
    }
});

// Clear button click handler
clearBtn.addEventListener('click', () => {
    jsonInput.value = '';
    jsonOutput.innerHTML = '';
});

// About button click handler
aboutBtn.addEventListener('click', () => {
    alert('JSON Viewer\n\nA simple tool for viewing and formatting JSON data.\n\nPaste your JSON, format it, and visualize it in a tree structure.');
});

// Render JSON as a tree structure
function renderJSON(data, container = jsonOutput) {
    container.innerHTML = '';
    const tree = createJSONTree(data);
    container.appendChild(tree);
}

// Create JSON tree element
function createJSONTree(data, key = null) {
    const div = document.createElement('div');
    div.className = 'json-node';

    const type = getType(data);

    if (type === 'object' || type === 'array') {
        const isArray = Array.isArray(data);
        const isEmpty = isArray ? data.length === 0 : Object.keys(data).length === 0;

        // Create collapsible header
        const header = document.createElement('div');
        header.className = 'json-key collapsible expanded';

        const toggle = document.createElement('span');
        toggle.className = 'toggle';
        toggle.textContent = '▼';
        header.appendChild(toggle);

        if (key !== null) {
            const keySpan = document.createElement('span');
            keySpan.className = 'key';
            keySpan.textContent = `"${key}": `;
            header.appendChild(keySpan);
        }

        const bracket = document.createElement('span');
        bracket.className = 'bracket';
        bracket.textContent = isArray ? '[' : '{';
        header.appendChild(bracket);

        if (isEmpty) {
            const closeBracket = document.createElement('span');
            closeBracket.className = 'bracket';
            closeBracket.textContent = isArray ? ']' : '}';
            header.appendChild(closeBracket);
        } else {
            const count = document.createElement('span');
            count.className = 'count';
            count.textContent = ` ${isArray ? data.length : Object.keys(data).length} items `;
            header.appendChild(count);
        }

        div.appendChild(header);

        if (!isEmpty) {
            const content = document.createElement('div');
            content.className = 'json-content';

            if (isArray) {
                data.forEach((item, index) => {
                    const child = createJSONTree(item, index);
                    content.appendChild(child);
                });
            } else {
                const keys = Object.keys(data);
                keys.forEach((k) => {
                    const child = createJSONTree(data[k], k);
                    content.appendChild(child);
                });
            }

            const closeLine = document.createElement('div');
            closeLine.className = 'json-node';
            const closeBracket = document.createElement('span');
            closeBracket.className = 'bracket';
            closeBracket.textContent = isArray ? ']' : '}';
            closeLine.appendChild(closeBracket);
            content.appendChild(closeLine);

            div.appendChild(content);

            // Add toggle functionality
            header.addEventListener('click', () => {
                header.classList.toggle('expanded');
            });
        }
    } else {
        // Primitive value
        const line = document.createElement('div');
        line.className = 'json-line';

        if (key !== null) {
            const keySpan = document.createElement('span');
            keySpan.className = 'key';
            keySpan.textContent = `"${key}": `;
            line.appendChild(keySpan);
        }

        const valueSpan = document.createElement('span');
        valueSpan.className = `value value-${type}`;

        if (type === 'string') {
            valueSpan.textContent = `"${data}"`;
        } else if (type === 'null') {
            valueSpan.textContent = 'null';
        } else {
            valueSpan.textContent = String(data);
        }

        line.appendChild(valueSpan);
        div.appendChild(line);
    }

    return div;
}

// Get the type of a value
function getType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'unknown';
}

// Show error message
function showError(message) {
    jsonOutput.innerHTML = `<div class="error">${message}</div>`;
}
