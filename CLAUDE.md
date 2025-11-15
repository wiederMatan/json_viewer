# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static JSON Viewer web application that allows users to format, visualize, and interact with JSON data through an interactive tree structure.

## Architecture

### File Structure

- `index.html` - Main HTML page (references external CSS and JS)
- `standalone.html` - Self-contained single-file version with embedded CSS and JavaScript
- `styles.css` - All application styles
- `script.js` - Core JavaScript functionality

### Two Deployment Options

1. **Multi-file version** (`index.html` + `styles.css` + `script.js`)
   - Best for development and version control
   - Separates concerns for easier maintenance

2. **Standalone version** (`standalone.html`)
   - Single-file deployment option
   - All CSS and JavaScript embedded inline
   - Ideal for distribution or simple hosting

### Core Components

**JSON Tree Renderer** (`createJSONTree` in script.js)
- Recursively builds collapsible DOM tree from JSON data
- Handles objects, arrays, and primitive types differently
- Key rendering logic at script.js:150-256

**Event Handlers** (script.js:41-140)
- Format button: Validates and renders JSON input
- File import: Reads and parses JSON files via FileReader API
- Copy functionality: Uses Clipboard API with user feedback
- Expand/Collapse: Toggles all tree nodes via `.collapsible` class

**Type System** (`getType` at script.js:259-267)
- Distinguishes between null, array, object, string, number, boolean
- Used for syntax highlighting via CSS classes (`.value-string`, `.value-number`, etc.)

## Development Workflow

### Local Development

This is a static web application with no build step required:

```bash
# Simply open in a browser
open index.html
# or
open standalone.html
```

For local development with live reload, use any static server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (if http-server is installed)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### Making Changes

When modifying functionality:
1. Edit `index.html`, `styles.css`, and `script.js` for the multi-file version
2. If changes should be reflected in `standalone.html`, manually sync the embedded CSS and JavaScript sections

### Key Implementation Details

**Collapsible Tree Logic**
- Toggling handled via CSS: `.collapsible:not(.expanded) + .json-content { display: none; }`
- Click handler at script.js:224-226 toggles the `expanded` class
- Arrow rotation via CSS transform at styles.css:224-230

**Error Handling**
- JSON parsing errors caught and displayed via `showError()` function
- Visual error display styled with red background and left border (styles.css:282-289)

**Responsive Design**
- Two breakpoints: 968px (tablet) and 480px (mobile)
- Grid layout switches to single column on smaller screens
- Defined at styles.css:317-356
