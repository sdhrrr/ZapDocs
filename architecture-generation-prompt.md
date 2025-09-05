```
# SOPHISTICATED ARCHITECTURE DOCUMENTATION GENERATOR PROMPT

You are an expert software architect and technical documentation specialist. Your task is to analyze the provided project codebase and generate a comprehensive JSON architecture documentation file that accurately represents the system's structure, components, and relationships.

## PROJECT CONTEXT
The project is "Docuz" - an interactive architecture documentation generator built with Node.js that converts JSON architecture definitions into beautiful, interactive HTML visualizations using Cytoscape.js. It creates self-contained HTML files with embedded styling and interactivity.

## ANALYSIS REQUIREMENTS

### 1. CODEBASE ANALYSIS
Thoroughly examine the following key files and directories:
- `generate.js` - Main entry point and orchestration logic
- `templates/` directory - HTML templates, CSS styles, and JavaScript components
- `package.json` - Dependencies and project metadata
- `examples/` directory - Sample JSON structures and patterns
- `README.md` - Project overview and usage instructions

### 2. ARCHITECTURAL COMPONENT IDENTIFICATION
Identify and document:
- **Entry Points**: CLI interfaces, main functions, API endpoints
- **Core Processing**: Data validation, transformation, orchestration logic
- **Template System**: HTML generation, CSS processing, JavaScript embedding
- **Visualization Engine**: Graph rendering, interactive components, layout algorithms
- **Theme Management**: Dark/light mode, styling systems, user preferences
- **File Operations**: Input/output handling, template loading, asset management
- **Utility Functions**: Validation, error handling, data processing helpers

### 3. RELATIONSHIP MAPPING
Analyze and document:
- Data flow between components
- Dependency relationships
- Control flow and orchestration patterns
- Template injection and processing pipelines
- Asset bundling and embedding strategies

## JSON SCHEMA REQUIREMENTS

Generate a JSON file following this exact structure:

```json
{
  "metadata": {
    "name": "Project Name",
    "description": "Comprehensive project description",
    "version": "X.X.X",
    "documentation": {
      "overview": "System overview and purpose",
      "installation": "Installation instructions", 
      "usage": "Basic usage examples",
      "features": ["Feature 1", "Feature 2", "..."],
      "architecture_principles": ["Principle 1", "Principle 2", "..."],
      "technical_stack": ["Technology 1", "Technology 2", "..."]
    }
  },
  "nodes": [
    {
      "id": "component-id",
      "data": {
        "label": "Component Name",
        "type": "component_type", // entry|backend|frontend|utility|data
        "details": {
          "summary": "Concise component description",
          "signature": "Method/function signature if applicable",
          "working": "Detailed explanation of how component functions",
          "responsibilities": ["Responsibility 1", "Responsibility 2"],
          "technologies": ["Tech used by this component"],
          "inputs": [
            {"name": "Input Name", "description": "Input description", "format": "Data format"}
          ],
          "outputs": [
            {"name": "Output Name", "description": "Output description", "format": "Data format"}
          ],
          "implementation_details": {
            "key_functions": ["function1()", "function2()"],
            "dependencies": ["dep1", "dep2"],
            "error_handling": "Error handling approach",
            "performance_considerations": "Performance notes"
          }
        }
      }
    }
  ],
  "hierarchy": {
    "component-id": {
      "parent": "parent-id-or-null",
      "children": ["child1", "child2"]
    }
  },
  "edges": [
    {
      "data": {
        "id": "edge-id",
        "source": "source-component-id", 
        "target": "target-component-id",
        "label": "relationship description"
      }
    }
  ]
}
```

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

Generate the complete JSON architecture documentation now, ensuring it accurately represents the actual codebase structure and relationships while maintaining professional documentation standards.
```
