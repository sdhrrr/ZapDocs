# 🏗️ Architecture Documentation Generator

A lightweight, framework-agnostic tool that converts JSON architecture definitions into beautiful, interactive HTML documentation with hierarchical visualization.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate documentation
node generate.js examples/sample-architecture.json my-docs.html

# Open my-docs.html in your browser
```

## ✨ Features

- 🖱️ **Interactive Graphs**: Drag nodes, zoom, pan, click to explore
- 📊 **Hierarchical Visualization**: Tree-like architecture layouts
- ⬇️ **Level-based Navigation**: Drill down/up through architecture layers
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎯 **Component Details**: Rich hover tooltips and sidebar information
- 📄 **Standalone Output**: Self-contained HTML files that work offline
- 🎨 **Component Types**: Predefined styles for common architecture components

## 📋 Input Format

Create a JSON file defining your architecture:

```json
{
  "metadata": {
    "name": "My System",
    "description": "System overview",
    "version": "1.0.0"
  },
  "nodes": [
    {
      "id": "frontend",
      "data": { 
        "label": "Frontend", 
        "type": "frontend" 
      }
    },
    {
      "id": "backend", 
      "data": { 
        "label": "Backend", 
        "type": "backend" 
      }
    },
    {
      "id": "database",
      "data": { 
        "label": "Database", 
        "type": "database" 
      }
    }
  ],
  "edges": [
    { "source": "frontend", "target": "backend" },
    { "source": "backend", "target": "database" }
  ],
  "hierarchy": {
    "frontend": ["ui-components", "routing"],
    "backend": ["api-server", "auth-service"]
  },
  "details": {
    "frontend": {
      "description": "User interface layer",
      "technologies": ["React", "TypeScript"],
      "responsibilities": ["User interaction", "Data presentation"],
      "endpoints": ["https://app.example.com"]
    }
  }
}
```

## 🎮 Generated Features

### Navigation Controls
- **📂 Expand All**: Show all components at once
- **📁 Collapse All**: Hide children, show only top-level
- **⬇️ Drill Down**: Progressively reveal next hierarchy level
- **⬆️ Drill Up**: Hide deepest visible level
- **🎯 Fit View**: Auto-fit visible components to screen
- **🔄 Reset**: Return to initial view

### Interactive Elements
- **Drag**: Move nodes around for better viewing
- **Zoom**: Mouse wheel to zoom in/out
- **Pan**: Drag background to pan around
- **Hover**: See component details in sidebar
- **Click**: Expand/collapse component children

## 🎯 Component Types & Colors

| Type | Color | Use Case |
|------|-------|----------|
| `frontend` | 🔵 Blue | UI components, web apps |
| `backend` | 🟢 Green | Server components, APIs |
| `database` | 🟠 Orange | Data storage, caches |
| `api` | 🟣 Purple | API services, gateways |
| `external` | ⚫ Gray | Third-party services |
| `mobile` | 🩷 Pink | Mobile applications |

## 📖 Visual Guide

### Node Shapes
- **Rounded rectangles**: All components use the same shape
- **Bright colors**: Active components
- **Thick border**: Selected component
- **Faded**: Hidden/collapsed components

### Data Flow
- **→ Arrows**: Show dependencies and data flow direction
- **Hierarchy**: Parent nodes contain child nodes
- **Connections**: Lines represent system interactions

### Controls
- **Drag**: Move nodes around
- **Scroll**: Zoom in/out
- **Hover**: Show component details
- **Click**: Expand/collapse children
- **Drill Down/Up**: Navigate hierarchy levels

## 🏗️ Project Structure

```
arch-docs-generator/
├── generate.js              # Main generator script
├── package.json            # Dependencies and metadata
├── README.md              # This file
├── templates/             # HTML/CSS/JS templates
│   ├── base.html         # Page structure template
│   ├── styles.css        # Styling and layout
│   └── visualization.js  # Cytoscape.js integration
├── examples/             # Sample architecture files
│   ├── sample-architecture.json
│   ├── ecommerce-platform.json
│   └── edutech-platform.json
└── output/              # Generated documentation files
```

## 📦 Dependencies

### Node.js Dependencies
- **fs-extra**: Enhanced file system operations for cross-platform compatibility

### Browser Libraries (CDN)
- **Cytoscape.js** `3.26.0`: Interactive graph visualization engine
- **Dagre** `0.8.5`: Hierarchical graph layout algorithm
- **Cytoscape-Dagre** `2.5.0`: Bridge between Cytoscape and Dagre

*Total browser payload: ~200KB minified*

## 💡 Usage Examples

### Basic Usage
```bash
node generate.js input.json output.html
```

### Batch Generation
```bash
node generate.js architectures/web-app.json docs/web-app.html
node generate.js architectures/mobile-app.json docs/mobile-app.html
node generate.js architectures/data-pipeline.json docs/data-pipeline.html
```

### Continuous Documentation
```bash
# Watch for changes and regenerate
npm run generate examples/my-arch.json docs/latest.html
```

## 🔧 Customization

### Custom Styling
Edit `templates/styles.css` to customize:
- Component colors and shapes
- Layout and spacing
- Typography and fonts
- Responsive breakpoints

### Custom Behavior
Modify `templates/visualization.js` to add:
- Custom event handlers
- Additional control buttons
- Different layout algorithms
- Export functionality

### Template Modification
Update `templates/base.html` for:
- Different page structure
- Additional metadata
- Custom branding
- Integration with other tools

## 🤝 Example Workflow

1. **Design**: Map your system's components and connections
2. **Define**: Create JSON file with components, relationships, and details
3. **Generate**: Run `node generate.js your-arch.json documentation.html`
4. **Share**: Distribute the self-contained HTML file
5. **Iterate**: Update JSON and regenerate as your architecture evolves

## 🛠️ Advanced Usage

### Hierarchical Architectures
Use the `hierarchy` field to create multi-level structures:
```json
{
  "hierarchy": {
    "web-app": ["frontend", "backend"],
    "frontend": ["components", "routing", "state"],
    "backend": ["api", "services", "database"],
    "services": ["auth", "payment", "notification"]
  }
}
```

### Rich Component Details
Add comprehensive information to each component:
```json
{
  "details": {
    "api-gateway": {
      "description": "Central API gateway handling all external requests",
      "technologies": ["Kong", "Docker", "Redis"],
      "responsibilities": [
        "Request routing",
        "Authentication",
        "Rate limiting",
        "Request/response transformation"
      ],
      "endpoints": ["https://api.example.com"],
      "documentation": "https://docs.example.com/api-gateway"
    }
  }
}
```
**Generate beautiful architecture documentation in seconds!** 🎉
