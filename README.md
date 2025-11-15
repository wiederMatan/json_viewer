# JSON Viewer

A clean, lightweight JSON viewer and formatter with an interactive tree structure and property inspector. Inspired by jsonviewer.stack.hu, this tool helps you visualize, navigate, and understand JSON data easily.

## Features

### 🌳 Interactive Tree View
- **Hierarchical visualization** - Navigate complex JSON structures with ease
- **Expandable/collapsible nodes** - Click +/- icons to expand or collapse objects and arrays
- **Visual hierarchy** - Clear indentation and nesting for better readability
- **Node selection** - Click any node to view its properties in detail

### 📊 Property Inspector
- **Dynamic property table** - View selected node's properties with Name/Value columns
- **Real-time updates** - Property panel updates automatically when you select different nodes
- **Support for all types** - Works with objects, arrays, and primitive values

### 🔍 Search Functionality
- **Quick search** - Find any text in your JSON data
- **Navigation controls** - GO!, Next, and Previous buttons to cycle through results
- **Auto-scroll** - Automatically scrolls to and highlights matching nodes
- **Keyboard support** - Press Enter to initiate search

### 🎨 User Interface
- **Dual tab system** - Switch between Viewer (tree + properties) and Text (raw JSON) modes
- **Split panel layout** - Tree view on the left, property inspector on the right
- **Clean design** - Minimal beige/cream color scheme for comfortable viewing
- **Responsive** - Works on desktop, tablet, and mobile devices

### 🛠️ JSON Tools
- **Format** - Beautify JSON with proper indentation
- **Remove whitespace** - Minify JSON by removing all whitespace
- **Copy** - Copy formatted JSON to clipboard
- **Clear** - Reset the viewer

## Demo

Try it out by opening `index.html` or `standalone.html` in your browser!

## Installation

### Option 1: Clone the Repository
```bash
git clone https://github.com/wiederMatan/json_viewer.git
cd json_viewer
```

Then open `index.html` in your web browser.

### Option 2: Use Standalone Version
Simply download `standalone.html` - it's a single file with all CSS and JavaScript embedded. No external dependencies required!

## Usage

### Basic Usage
1. **Open the viewer** - Open `index.html` or `standalone.html` in your browser
2. **Paste JSON** - Switch to the "Text" tab and paste your JSON data
3. **Format** - Click the "Format" button to validate and format your JSON
4. **Visualize** - Switch to the "Viewer" tab to see the tree structure

### Navigating the Tree
- Click the **+/- icons** to expand or collapse nodes
- Click any **node** to view its properties in the right panel
- The **root node** is automatically expanded when you load JSON

### Searching
1. Type your search query in the search box at the bottom
2. Click **GO!** or press **Enter** to find matches
3. Use **Next** and **Previous** to navigate through results
4. Matching nodes will be highlighted and scrolled into view

### Keyboard Shortcuts
- **Enter** in search box - Perform search

## File Structure

```
json_viewer/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript functionality
├── standalone.html     # Single-file version
├── CLAUDE.md          # Claude Code guidance
├── README.md          # This file
└── LICENSE            # License information
```

## Technologies Used

- **HTML5** - Structure and layout
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - All functionality, no frameworks required
- **No dependencies** - Works completely offline

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

## Features in Detail

### Two Deployment Options

1. **Multi-file version** (`index.html` + `styles.css` + `script.js`)
   - Best for development and customization
   - Separated concerns for easier maintenance

2. **Standalone version** (`standalone.html`)
   - Single-file deployment
   - All CSS and JavaScript embedded inline
   - Perfect for quick sharing or simple hosting

### Color Scheme

The viewer uses a calming beige/cream color palette:
- Background: `#f5f0e8`
- Controls: `#e8dfd0`
- Borders: `#d0c4b0`
- Selection: `#c8d7f0` (light blue)

## Development

### Local Development

No build step required! Simply:

```bash
# Open in browser
open index.html

# Or use a local server for development
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Making Changes

When modifying functionality:
1. Edit `index.html`, `styles.css`, and `script.js` for the multi-file version
2. Update `standalone.html` to sync changes (or regenerate it)

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by [jsonviewer.stack.hu](https://jsonviewer.stack.hu)
- Built with assistance from Claude Code

## Author

**Matan Wieder**
- GitHub: [@wiederMatan](https://github.com/wiederMatan)

---

**Made with ❤️ and JSON**
