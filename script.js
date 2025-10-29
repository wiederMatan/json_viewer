// JSON Viewer Script

const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const formatBtn = document.getElementById('formatBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const fileInput = document.getElementById('fileInput');
const expandAllBtn = document.getElementById('expandAllBtn');
const collapseAllBtn = document.getElementById('collapseAllBtn');
const copyBtn = document.getElementById('copyBtn');

// Example JSON data
const exampleJSON = {
    "name": "John Doe",
    "age": 30,
    "email": "john.doe@example.com",
    "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
    },
    "phoneNumbers": [
        {
            "type": "home",
            "number": "212-555-1234"
        },
        {
            "type": "mobile",
            "number": "646-555-5678"
        }
    ],
    "hobbies": ["reading", "traveling", "photography"],
    "isActive": true,
    "balance": 1234.56,
    "registeredDate": "2024-01-15T10:30:00Z"
};

// Format JSON button click handler
formatBtn.addEventListener('click', () => {
    const inputText = jsonInput.value.trim();

    if (!inputText) {
        showError('Please enter some JSON data');
        return;
    }

    try {
        const jsonData = JSON.parse(inputText);
        renderJSON(jsonData);
    } catch (error) {
        showError('Invalid JSON: ' + error.message);
    }
});

// Clear button click handler
clearBtn.addEventListener('click', () => {
    jsonInput.value = '';
    jsonOutput.innerHTML = '';
});

// Example button click handler
exampleBtn.addEventListener('click', () => {
    jsonInput.value = JSON.stringify(exampleJSON, null, 2);
    renderJSON(exampleJSON);
});

// File input change handler
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                jsonInput.value = JSON.stringify(jsonData, null, 2);
                renderJSON(jsonData);
            } catch (error) {
                showError('Invalid JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
});

// Expand all button click handler
expandAllBtn.addEventListener('click', () => {
    const allCollapsible = document.querySelectorAll('.collapsible');
    allCollapsible.forEach(item => {
        item.classList.add('expanded');
    });
});

// Collapse all button click handler
collapseAllBtn.addEventListener('click', () => {
    const allCollapsible = document.querySelectorAll('.collapsible');
    allCollapsible.forEach(item => {
        item.classList.remove('expanded');
    });
});

// Copy button click handler
copyBtn.addEventListener('click', async () => {
    const inputText = jsonInput.value.trim();

    if (!inputText) {
        showError('No JSON to copy');
        return;
    }

    try {
        // Parse to validate, then stringify with formatting
        const jsonData = JSON.parse(inputText);
        const formattedJSON = JSON.stringify(jsonData, null, 2);

        // Copy to clipboard
        await navigator.clipboard.writeText(formattedJSON);

        // Show success feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            Copied!
        `;
        copyBtn.classList.add('copied');

        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);

    } catch (error) {
        showError('Invalid JSON: ' + error.message);
    }
});

// Render JSON as a tree structure
function renderJSON(data, container = jsonOutput) {
    container.innerHTML = '';
    const tree = createJSONTree(data);
    container.appendChild(tree);
}

// Create JSON tree element
function createJSONTree(data, key = null, isLast = true) {
    const div = document.createElement('div');
    div.className = 'json-node';

    const type = getType(data);

    if (type === 'object' || type === 'array') {
        const isArray = Array.isArray(data);
        const entries = isArray ? data : Object.entries(data);
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
                    const child = createJSONTree(item, index, index === data.length - 1);
                    content.appendChild(child);
                });
            } else {
                const keys = Object.keys(data);
                keys.forEach((k, index) => {
                    const child = createJSONTree(data[k], k, index === keys.length - 1);
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

// Load example on page load
window.addEventListener('load', () => {
    jsonInput.value = JSON.stringify(exampleJSON, null, 2);
    renderJSON(exampleJSON);
});
