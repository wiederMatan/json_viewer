// JSON Viewer Script

const jsonInput = document.getElementById('jsonInput');
const jsonTree = document.getElementById('jsonTree');
const propertyTableBody = document.getElementById('propertyTableBody');
const formatBtn = document.getElementById('formatBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const removeWhitespaceBtn = document.getElementById('removeWhitespaceBtn');
const aboutBtn = document.getElementById('aboutBtn');
const searchInput = document.getElementById('searchInput');
const searchGoBtn = document.getElementById('searchGoBtn');
const searchNextBtn = document.getElementById('searchNextBtn');
const searchPrevBtn = document.getElementById('searchPrevBtn');

// Tab functionality
const tabs = document.querySelectorAll('.tab');
const viewerTab = document.getElementById('viewer-tab');
const textTab = document.getElementById('text-tab');

let jsonData = null;
let selectedNode = null;
let searchResults = [];
let currentSearchIndex = -1;

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
        jsonData = JSON.parse(inputText);
        jsonInput.value = JSON.stringify(jsonData, null, 2);
        renderTree(jsonData);
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
        const data = JSON.parse(inputText);
        jsonInput.value = JSON.stringify(data);
    } catch (error) {
        alert('Invalid JSON: ' + error.message);
    }
});

// Clear button click handler
clearBtn.addEventListener('click', () => {
    jsonInput.value = '';
    jsonTree.innerHTML = '';
    propertyTableBody.innerHTML = '';
    jsonData = null;
    selectedNode = null;
});

// About button click handler
aboutBtn.addEventListener('click', () => {
    alert('JSON Viewer\n\nA simple tool for viewing and formatting JSON data.\n\nPaste your JSON, format it, and visualize it in a tree structure.');
});

// Search functionality
searchGoBtn.addEventListener('click', performSearch);
searchNextBtn.addEventListener('click', () => navigateSearch(1));
searchPrevBtn.addEventListener('click', () => navigateSearch(-1));

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query || !jsonData) return;

    // Clear previous search results
    searchResults = [];
    currentSearchIndex = -1;

    // Find all matching nodes
    const allNodes = document.querySelectorAll('.tree-node-header');
    allNodes.forEach(node => {
        const text = node.textContent.toLowerCase();
        if (text.includes(query)) {
            searchResults.push(node);
        }
    });

    if (searchResults.length > 0) {
        currentSearchIndex = 0;
        highlightSearchResult();
    } else {
        alert('No matches found');
    }
}

function navigateSearch(direction) {
    if (searchResults.length === 0) return;

    currentSearchIndex += direction;
    if (currentSearchIndex < 0) {
        currentSearchIndex = searchResults.length - 1;
    } else if (currentSearchIndex >= searchResults.length) {
        currentSearchIndex = 0;
    }

    highlightSearchResult();
}

function highlightSearchResult() {
    if (searchResults.length === 0 || currentSearchIndex < 0) return;

    const node = searchResults[currentSearchIndex];
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    node.click();
}

// Render tree
function renderTree(data) {
    jsonTree.innerHTML = '';
    selectedNode = null;
    propertyTableBody.innerHTML = '';

    const rootNode = createTreeNode('JSON', data, null);
    jsonTree.appendChild(rootNode);

    // Auto-expand root
    const rootChildren = rootNode.querySelector('.tree-children');
    if (rootChildren) {
        rootChildren.classList.add('expanded');
        const rootIcon = rootNode.querySelector('.tree-icon');
        if (rootIcon) {
            rootIcon.classList.remove('collapsed');
            rootIcon.classList.add('expanded');
        }
    }
}

// Create tree node
function createTreeNode(key, value, path) {
    const node = document.createElement('div');
    node.className = 'tree-node';

    const header = document.createElement('div');
    header.className = 'tree-node-header';

    const type = getType(value);
    const isContainer = type === 'object' || type === 'array';

    // Create icon
    const icon = document.createElement('span');
    icon.className = isContainer ? 'tree-icon collapsed' : 'tree-icon leaf';

    // Create label
    const label = document.createElement('span');
    label.className = 'tree-label';

    if (type === 'array') {
        label.textContent = `${key} []`;
    } else if (type === 'object') {
        label.textContent = `${key} {}`;
    } else {
        label.textContent = key;
    }

    header.appendChild(icon);
    header.appendChild(label);

    // Add type info
    if (!isContainer) {
        const typeSpan = document.createElement('span');
        typeSpan.className = 'tree-type';
        typeSpan.textContent = `: ${formatValue(value)}`;
        header.appendChild(typeSpan);
    }

    node.appendChild(header);

    // Store data for selection
    header.dataset.value = JSON.stringify(value);
    header.dataset.key = key;
    header.dataset.type = type;

    // Click handler
    header.addEventListener('click', (e) => {
        e.stopPropagation();

        // Toggle expansion for containers
        if (isContainer) {
            const children = node.querySelector('.tree-children');
            if (children) {
                const isExpanded = children.classList.contains('expanded');
                children.classList.toggle('expanded');
                icon.classList.toggle('collapsed', isExpanded);
                icon.classList.toggle('expanded', !isExpanded);
            }
        }

        // Handle selection
        selectNode(header, value);
    });

    // Create children for containers
    if (isContainer) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';

        if (type === 'array') {
            value.forEach((item, index) => {
                const childNode = createTreeNode(index, item, path ? `${path}[${index}]` : `[${index}]`);
                childrenContainer.appendChild(childNode);
            });
        } else {
            Object.keys(value).forEach(k => {
                const childNode = createTreeNode(k, value[k], path ? `${path}.${k}` : k);
                childrenContainer.appendChild(childNode);
            });
        }

        node.appendChild(childrenContainer);
    }

    return node;
}

// Select node and update property panel
function selectNode(header, value) {
    // Remove previous selection
    if (selectedNode) {
        selectedNode.classList.remove('selected');
    }

    // Add new selection
    header.classList.add('selected');
    selectedNode = header;

    // Update property panel
    updatePropertyPanel(value);
}

// Update property panel
function updatePropertyPanel(value) {
    propertyTableBody.innerHTML = '';

    const type = getType(value);

    if (type === 'object') {
        Object.keys(value).forEach(key => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const valueCell = document.createElement('td');

            nameCell.textContent = key;
            valueCell.textContent = formatValue(value[key]);

            row.appendChild(nameCell);
            row.appendChild(valueCell);
            propertyTableBody.appendChild(row);
        });
    } else if (type === 'array') {
        value.forEach((item, index) => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const valueCell = document.createElement('td');

            nameCell.textContent = index;
            valueCell.textContent = formatValue(item);

            row.appendChild(nameCell);
            row.appendChild(valueCell);
            propertyTableBody.appendChild(row);
        });
    } else {
        // For primitive values
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const valueCell = document.createElement('td');

        nameCell.textContent = 'value';
        valueCell.textContent = formatValue(value);

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        propertyTableBody.appendChild(row);
    }
}

// Format value for display
function formatValue(value) {
    const type = getType(value);

    if (type === 'string') {
        return `"${value}"`;
    } else if (type === 'null') {
        return 'null';
    } else if (type === 'object') {
        return '{...}';
    } else if (type === 'array') {
        return '[...]';
    } else {
        return String(value);
    }
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
    jsonTree.innerHTML = `<div class="error">${message}</div>`;
}

// Auto-load example on start (disabled - page starts blank)
// window.addEventListener('load', () => {
//     jsonInput.value = JSON.stringify(exampleJSON, null, 2);
//     jsonData = exampleJSON;
//     renderTree(exampleJSON);
// });
