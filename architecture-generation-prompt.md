```
# ZAPDOCS ARCHITECTURE GENERATOR PROMPT

You are an expert software architect. Analyze the provided ZapDocs codebase and generate a JSON architecture file that accurately represents the system.

## PROJECT OVERVIEW
ZapDocs converts JSON architecture definitions into interactive, self-contained HTML documentation using Cytoscape.js visualizations.

**Key Components:**
- `generate.js` - ArchitectureDocGenerator class with methods: loadArchitectureData(), validateArchitectureData(), loadTemplates(), generateHTML(), generateDocumentation(), writeOutputFile()
- `templates/` - HTML templates with Cytoscape.js integration, CSS styling, theme management
- CLI: `node generate.js input.json` (automatic output generation)

## REQUIRED JSON SCHEMA

## REQUIRED JSON SCHEMA

```json
{
  "metadata": {
    "projectName": "String",
    "description": "String", 
    "version": "String",
    "summary": "String"
  },
  "nodes": [
    {
      "id": "component-id",
      "data": {
        "label": "Component Name",
        "type": "entry|backend|frontend|utility|data",
        "description": "Brief description",
        "summary": "Detailed explanation",
        "keyFeatures": ["Feature 1", "Feature 2"],
        "responsibilities": ["Responsibility 1", "Responsibility 2"]
      }
    }
  ],
  "edges": [
    {
      "source": "source-id",
      "target": "target-id", 
      "label": "relationship description"
    }
  ],
  "hierarchy": {
    "parent-id": ["child1", "child2"]
  },
  "details": {
    "component-id": {
      "summary": "How it works",
      "working": "Step-by-step explanation",
      "signature": "main function if applicable",
      "inputs": [{"name": "Input", "description": "Description", "format": "Type"}],
      "outputs": [{"name": "Output", "description": "Description", "format": "Type"}]
    }
  }
}
```

## REQUIRED COMPONENTS (6-8 total)

Generate these components based on actual ZapDocs implementation:

1. **CLI Interface** (`entry`) - Command-line entry point
2. **ArchitectureDocGenerator** (`backend`) - Main orchestration class  
3. **JSON Validator** (`utility`) - Schema validation
4. **Template Processor** (`backend`) - HTML/CSS/JS processing
5. **Visualization Engine** (`frontend`) - Cytoscape.js integration
6. **Documentation Generator** (`frontend`) - Documentation pages
7. **Output Manager** (`utility`) - File writing and paths
8. **Theme System** (`utility`) - Dark/light mode (optional)

## COMPONENT RELATIONSHIPS
- CLI → ArchitectureDocGenerator (orchestrates)
- ArchitectureDocGenerator → JSON Validator (validates)
- ArchitectureDocGenerator → Template Processor (processes)
- Template Processor → Visualization Engine (embeds)
- Template Processor → Documentation Generator (generates)
- ArchitectureDocGenerator → Output Manager (writes)

## OUTPUT REQUIREMENTS

Generate complete, valid JSON that:
1. Accurately represents ZapDocs current implementation
2. Includes 6-8 core components with proper relationships
3. Uses correct component types and technical details
4. Works with: `node generate.js generated-architecture.json`
5. Professional documentation suitable for developers

Focus on architectural accuracy over excessive detail.

## ANALYSIS REQUIREMENTS

### 1. CODEBASE ANALYSIS
Thoroughly examine these key files and understand their current implementation:

**Core Files:**
- `generate.js` - Main orchestration engine with ArchitectureDocGenerator class
- `package.json` - Project metadata and dependencies (fs-extra, Node.js 14+)
- `README.md` - Project overview and current status
- `INSTRUCTIONS.md` - User setup and usage guidelines

**Template System:**
- `templates/base.html` - Interactive visualization template with Cytoscape.js
- `templates/documentation.html` - Comprehensive documentation template
- `templates/styles.css` - Modern responsive styling with theme support
- `templates/visualization.js` - Interactive graph rendering and navigation
- `templates/theme.js` - Dark/light theme management

**Examples and Output:**
- `examples/` - Sample JSON files demonstrating schema structure
- `output/` - Generated HTML documentation files (both interactive and detailed views)

### 2. CURRENT IMPLEMENTATION ANALYSIS
Focus on these implemented features:

**Core Processing Pipeline:**
- JSON validation and data loading
- Template loading and asset management
- HTML generation with embedded CSS/JavaScript
- Dual output generation (interactive + documentation views)
- Automatic output file naming and directory management

**Advanced Features:**
- Cytoscape.js integration for interactive graphs
- Component hover tooltips and navigation
- Theme switching (dark/light mode)
- Responsive design for mobile/desktop
- Self-contained output files with no external dependencies

**CLI Interface:**
- Simplified command structure: `node generate.js input.json`
- Automatic output path generation in `output/` folder
- Comprehensive error handling and user feedback
- Help system and usage examples

### 3. ARCHITECTURAL COMPONENT IDENTIFICATION
Identify and document these system components:

**Entry Points:**
- CLI interface and argument parsing
- Main generator orchestration
- Help system and error handling

**Core Processing:**
- JSON validation and schema verification
- Template loading and management
- HTML generation and asset embedding
- Output file creation and management

**Template System:**
- HTML template processing
- CSS style injection
- JavaScript asset embedding
- Theme management integration

**Visualization Engine:**
- Cytoscape.js graph rendering
- Interactive component navigation
- Layout algorithms and controls
- Export functionality

**Documentation System:**
- Comprehensive documentation generation
- Component detail rendering
- API-style documentation formatting
- Cross-referencing and navigation

## UPDATED JSON SCHEMA REQUIREMENTS

Generate a JSON file following this exact structure that matches the current implementation:

```json
{
  "metadata": {
    "projectName": "Project Name",
    "description": "Brief project description",
    "version": "X.X.X",
    "author": "Author Name",
    "summary": "Comprehensive project summary",
    "documentation": {
      "overview": "Detailed system overview and purpose",
      "installation": "Installation and setup instructions", 
      "usage": "Usage examples and commands",
      "features": [
        "Key feature 1",
        "Key feature 2"
      ],
      "architecture_principles": [
        "Design principle 1",
        "Design principle 2"
      ],
      "technical_stack": [
        "Technology 1",
        "Technology 2"
      ]
    }
  },
  "nodes": [
    {
      "id": "component-id",
      "data": {
        "label": "Component Name",
        "type": "entry|backend|frontend|utility|data|process",
        "description": "Brief component description",
        "summary": "Detailed component summary and purpose",
        "keyFeatures": [
          "Feature 1",
          "Feature 2"
        ],
        "responsibilities": [
          "Responsibility 1",
          "Responsibility 2"
        ],
        "technologies": [
          "Tech 1",
          "Tech 2"
        ],
        "implementation": {
          "keyFunctions": [
            "function1()",
            "function2()"
          ],
          "dependencies": [
            "dependency1",
            "dependency2"
          ],
          "fileLocation": "path/to/main/file",
          "errorHandling": "Error handling approach"
        }
      }
    }
  ],
  "edges": [
    {
      "source": "source-component-id",
      "target": "target-component-id",
      "label": "relationship description",
      "type": "data-flow|control-flow|dependency|composition"
    }
  ],
  "hierarchy": {
    "parent-component-id": [
      "child-component-1",
      "child-component-2"
    ]
  },
  "details": {
    "component-id": {
      "label": "Component Name",
      "summary": "Detailed explanation of component purpose and functionality",
      "working": "Step-by-step explanation of how the component operates",
      "signature": "main function signature if applicable",
      "inputs": [
        {
          "name": "Input Name",
          "description": "Input description",
          "format": "Data format/type"
        }
      ],
      "outputs": [
        {
          "name": "Output Name", 
          "description": "Output description",
          "format": "Data format/type"
        }
      ],
      "implementation_details": {
        "algorithms": "Key algorithms used",
        "data_structures": "Important data structures",
        "performance": "Performance characteristics",
        "scalability": "Scalability considerations"
      }
    }
  }
}
```

## QUALITY CRITERIA

### TECHNICAL ACCURACY
- Components must reflect the actual ArchitectureDocGenerator class structure
- Relationships must represent real data flows in the generation pipeline
- Function names and implementations must match current code
- File paths and dependencies must be accurate

### ARCHITECTURAL SOPHISTICATION
- Show clear separation between CLI, processing, templating, and output
- Demonstrate understanding of the template injection pipeline
- Highlight the dual-output generation pattern (interactive + documentation)
- Show how self-contained HTML files are created

### DOCUMENTATION EXCELLENCE
- Use professional, technical language appropriate for developers
- Include specific method names from ArchitectureDocGenerator class
- Reference actual file locations and template structure
- Balance high-level architecture with implementation specifics

## COMPONENT GUIDELINES

### COMPONENT TYPES AND EXAMPLES
- `entry`: CLI interface, main() function, argument parsing
- `backend`: Core generation logic, template processing, validation
- `frontend`: Interactive visualization, user interface components
- `utility`: Helper functions, file operations, error handling  
- `data`: JSON schemas, configuration, metadata management
- `process`: Workflows, pipelines, transformation processes

### REQUIRED COMPONENTS (6-8 total)
1. **CLI Interface** - Entry point and user interaction
2. **Generation Engine** - Core ArchitectureDocGenerator orchestration
3. **Template Processor** - HTML/CSS/JS template management
4. **Validation System** - JSON schema validation and error handling
5. **Visualization Renderer** - Cytoscape.js integration and interactive features
6. **Documentation Generator** - Comprehensive documentation creation
7. **Output Manager** - File writing and asset management
8. **Theme System** - Dark/light mode and styling management (optional)

### RELATIONSHIP PATTERNS
- CLI → Generation Engine → Template Processor → Output
- Validation System validates input for Generation Engine
- Template Processor loads assets for both Visualization and Documentation
- Output Manager handles both interactive and documentation file creation

## OUTPUT REQUIREMENTS

1. **Generate complete, valid JSON** matching the current schema exactly
2. **Include 6-8 well-defined components** representing major system areas
3. **Provide accurate implementation details** referencing actual code
4. **Create logical hierarchy** showing parent-child relationships where applicable
5. **Define meaningful edges** with descriptive relationship labels
6. **Include comprehensive details section** for complex components
7. **Ensure compatibility** with current template processing system

## EXAMPLE COMPONENT (Template Processor)

```json
{
  "id": "template-processor",
  "data": {
    "label": "Template Processing Engine",
    "type": "backend",
    "description": "Manages HTML template loading, asset injection, and output generation",
    "summary": "Core template processing system that loads HTML templates, injects CSS/JavaScript assets, performs data substitution, and generates self-contained HTML files for both interactive visualization and comprehensive documentation views.",
    "keyFeatures": [
      "Multi-template support (base.html, documentation.html)",
      "Asset embedding (CSS, JavaScript)",
      "Data injection and placeholder replacement",
      "Self-contained output generation"
    ],
    "responsibilities": [
      "Load and validate template files",
      "Embed CSS and JavaScript assets",
      "Inject architecture data into templates",
      "Generate complete HTML output files"
    ],
    "technologies": [
      "Node.js fs module",
      "Template literal processing",
      "Asset bundling"
    ],
    "implementation": {
      "keyFunctions": [
        "loadTemplates()",
        "generateHTML()",
        "generateDocumentation()",
        "writeOutputFile()"
      ],
      "dependencies": [
        "fs",
        "path"
      ],
      "fileLocation": "generate.js (lines 140-200)",
      "errorHandling": "Try-catch with detailed error messages for file operations"
    }
  }
}
```

Generate the complete JSON architecture documentation now, ensuring it accurately represents ZapDocs' current implementation while maintaining professional documentation standards suitable for technical stakeholders and future development.

## QUALITY CRITERIA

### TECHNICAL ACCURACY
- Components must reflect actual code structure
- Relationships must represent real dependencies and data flows
- Technical details must be accurate and implementable
- Function signatures and APIs must match actual code

### ARCHITECTURAL SOPHISTICATION  
- Demonstrate understanding of software architecture patterns
- Show clear separation of concerns
- Identify design patterns and architectural decisions
- Highlight system boundaries and interfaces

### DOCUMENTATION EXCELLENCE
- Use professional, technical language
- Provide actionable implementation details
- Include specific function names, file paths, and technical specifications
- Balance high-level overview with implementation specifics

### COMPONENT DEPTH
Each component should include:
- **Purpose**: Why it exists and its role in the system
- **Functionality**: What it does and how it works
- **Dependencies**: What it relies on and what relies on it
- **Implementation**: Key functions, algorithms, data structures
- **Interfaces**: Inputs, outputs, and interaction patterns

## ARCHITECTURAL GUIDELINES

### HIERARCHY DESIGN
- Start with clear entry points (CLI, main functions)
- Group related functionality into logical layers
- Show clear data flow from input to output
- Maintain 6-10 components for optimal clarity

### COMPONENT TYPES
- `entry`: CLI interfaces, main entry points
- `backend`: Core processing, business logic, orchestration
- `frontend`: UI components, visualization, user interaction  
- `utility`: Helper functions, validation, data processing
- `data`: Data models, schemas, persistence layers

### RELATIONSHIP LABELS
Use descriptive, actionable relationship labels:
- "orchestrates", "validates", "processes", "generates"
- "embeds", "injects", "transforms", "renders"
- "manages", "coordinates", "handles", "controls"

## OUTPUT REQUIREMENTS

1. **Generate complete, valid JSON** following the schema exactly
2. **Include 6-10 well-defined components** representing major system areas
3. **Provide detailed implementation information** for each component
4. **Create logical hierarchy** showing clear parent-child relationships
5. **Define meaningful edges** with descriptive labels
6. **Ensure professional documentation** suitable for technical stakeholders

## EXAMPLE COMPONENT DETAIL LEVEL

```json
{
  "id": "template-processor",
  "data": {
    "label": "Template Processing Engine",
    "type": "backend",
    "details": {
      "summary": "Core template processing system that merges JSON architecture data with HTML templates",
      "working": "Loads HTML templates from the templates/ directory, performs placeholder replacement using template literals, injects CSS/JavaScript assets, and generates complete self-contained HTML files. Handles both main visualization view and detailed documentation pages.",
      "responsibilities": [
        "Template file loading and validation",
        "Placeholder replacement and data injection", 
        "CSS/JavaScript asset embedding",
        "Output file generation and optimization"
      ],
      "technologies": ["Node.js fs module", "Template literals", "String replacement"],
      "inputs": [
        {"name": "Template Files", "description": "HTML template files with placeholders", "format": "HTML"},
        {"name": "Architecture Data", "description": "Validated JSON architecture definition", "format": "Object"},
        {"name": "Asset Files", "description": "CSS and JavaScript assets", "format": "String"}
      ],
      "outputs": [
        {"name": "Generated HTML", "description": "Complete HTML files with embedded assets", "format": "HTML"}
      ],
      "implementation_details": {
        "key_functions": ["loadTemplates()", "replaceePlaceholders()", "embedAssets()", "writeOutput()"],
        "dependencies": ["fs-extra", "path"],
        "error_handling": "Try-catch blocks with descriptive error messages for file operations",
        "performance_considerations": "Synchronous file operations for simplicity, suitable for build-time generation"
      }
    }
  }
}
```

Generate the complete JSON architecture documentation now, ensuring it accurately represents ZapDocs' current implementation while maintaining professional documentation standards suitable for technical stakeholders and future development.

---

## PROMPT USAGE INSTRUCTIONS

**For LLM Integration:**
1. Provide this prompt along with the complete ZapDocs codebase
2. Include all files: generate.js, templates/, examples/, package.json, README.md, INSTRUCTIONS.md
3. Request JSON output following the exact schema above
4. Validate output against current template processing requirements
5. Test generated JSON with: `node generate.js generated-architecture.json`

**Expected Output:**
- Complete JSON file ready for ZapDocs processing
- 6-8 architectural components representing current system
- Accurate technical details matching actual implementation
- Professional documentation suitable for stakeholders
- Compatible with current template and visualization system
```
