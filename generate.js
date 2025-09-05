const fs = require('fs');
const path = require('path');

class ArchitectureDocGenerator {
    constructor() {
        this.templatesDir = path.join(__dirname, 'templates');
        this.outputDir = path.join(__dirname, 'output');
        
        // Ensure output directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    
    /**
     * Generate HTML documentation from architecture JSON
     * @param {string} jsonPath - Path to architecture JSON file
     * @param {string} outputPath - Path for generated HTML file
     */
    async generate(jsonPath, outputPath) {
        try {
            console.log('🚀 Starting architecture documentation generation...');
            
            // 1. Read and validate JSON data
            const architectureData = this.loadArchitectureData(jsonPath);
            console.log('✅ Architecture data loaded successfully');
            
            // 2. Load template files
            const templates = this.loadTemplates();
            console.log('✅ Templates loaded successfully');
            
            // 3. Generate HTML content
            const htmlContent = this.generateHTML(architectureData, templates);
            console.log('✅ HTML content generated');
            
            // 4. Generate documentation page
            const docContent = this.generateDocumentation(architectureData);
            console.log('✅ Documentation page generated');
            
            // 5. Write output files
            this.writeOutputFile(outputPath, htmlContent);
            
            // Generate documentation file with same name but different suffix
            const docPath = outputPath.replace('.html', '-documentation.html');
            this.writeOutputFile(docPath, docContent);
            
            console.log(`✅ Architecture view generated: ${outputPath}`);
            console.log(`✅ Documentation view generated: ${docPath}`);
            
            // 6. Display summary
            this.displaySummary(architectureData, outputPath);
            
        } catch (error) {
            console.error('❌ Error generating documentation:', error.message);
            process.exit(1);
        }
    }
    
    loadArchitectureData(jsonPath) {
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`Architecture JSON file not found: ${jsonPath}`);
        }
        
        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        
        try {
            const data = JSON.parse(jsonContent);
            this.validateArchitectureData(data);
            return data;
        } catch (error) {
            throw new Error(`Invalid JSON in architecture file: ${error.message}`);
        }
    }
    
    validateArchitectureData(data) {
        // Basic validation
        if (!data.nodes || !Array.isArray(data.nodes)) {
            throw new Error('Architecture data must contain a "nodes" array');
        }
        
        if (!data.edges || !Array.isArray(data.edges)) {
            throw new Error('Architecture data must contain an "edges" array');
        }
        
        if (!data.hierarchy || typeof data.hierarchy !== 'object') {
            throw new Error('Architecture data must contain a "hierarchy" object');
        }
        
        // Validate nodes have required fields
        data.nodes.forEach((node, index) => {
            if (!node.id) {
                throw new Error(`Node at index ${index} missing required "id" field`);
            }
            if (!node.data || !node.data.label) {
                throw new Error(`Node "${node.id}" missing required "data.label" field`);
            }
        });
        
        // Validate edges reference existing nodes
        const nodeIds = new Set(data.nodes.map(n => n.id));
        data.edges.forEach((edge, index) => {
            if (!nodeIds.has(edge.source)) {
                throw new Error(`Edge at index ${index} references non-existent source node: ${edge.source}`);
            }
            if (!nodeIds.has(edge.target)) {
                throw new Error(`Edge at index ${index} references non-existent target node: ${edge.target}`);
            }
        });
        
        console.log(`📊 Validation complete: ${data.nodes.length} nodes, ${data.edges.length} edges`);
    }
    
    loadTemplates() {
        const templates = {};
        
        // Load HTML template
        const htmlPath = path.join(this.templatesDir, 'base.html');
        if (!fs.existsSync(htmlPath)) {
            throw new Error('HTML template not found: base.html');
        }
        templates.html = fs.readFileSync(htmlPath, 'utf8');
        
        // Load Documentation template
        const docPath = path.join(this.templatesDir, 'documentation.html');
        if (!fs.existsSync(docPath)) {
            throw new Error('Documentation template not found: documentation.html');
        }
        templates.documentation = fs.readFileSync(docPath, 'utf8');
        
        // Load CSS
        const cssPath = path.join(this.templatesDir, 'styles.css');
        if (!fs.existsSync(cssPath)) {
            throw new Error('CSS template not found: styles.css');
        }
        templates.css = fs.readFileSync(cssPath, 'utf8');
        
        // Load JavaScript
        const jsPath = path.join(this.templatesDir, 'visualization.js');
        if (!fs.existsSync(jsPath)) {
            throw new Error('JavaScript template not found: visualization.js');
        }
        templates.js = fs.readFileSync(jsPath, 'utf8');
        
        return templates;
    }
    
    generateHTML(architectureData, templates) {
        // Prepare project name
        const projectName = architectureData.metadata?.projectName || 'Architecture Documentation';
        
        // Inject architecture data into JavaScript
        const jsWithData = templates.js.replace(
            '/*ARCHITECTURE_DATA*/',
            JSON.stringify(architectureData, null, 2)
        );
        
        // Replace placeholders in HTML template
        let htmlContent = templates.html
            .replace('{{PROJECT_NAME}}', projectName)
            .replace('{{STYLES}}', templates.css)
            .replace('{{VISUALIZATION_JS}}', jsWithData);
        
        return htmlContent;
    }
    
    generateDocumentation(architectureData) {
        const templates = this.loadTemplates();
        
        // Extract documentation data
        const metadata = architectureData.metadata || {};
        const documentation = metadata.documentation || {};
        const fullDocumentation = metadata.fullDocumentation || {};
        
        // Generate components HTML with API format
        let componentsHTML = '';
        let componentNavHTML = '';
        
        if (architectureData.details) {
            for (const [nodeId, details] of Object.entries(architectureData.details)) {
                const node = architectureData.nodes.find(n => n.id === nodeId);
                if (!node) continue;
                
                const componentId = `component-${nodeId}`;
                const componentLabel = details.label || node.data.label;
                
                // Add navigation button
                componentNavHTML += `<button class="component-nav-btn" onclick="scrollToComponent('${componentId}')">${componentLabel}</button>\n`;
                
                let componentHTML = `<div class="api-component" id="${componentId}">
                    <div class="api-header">
                        <h3 class="api-title">\`${componentLabel}\`</h3>
                        <p class="api-summary">${details.summary || ''}</p>
                    </div>
                    <div class="api-content">`;
                
                // Signature section
                if (details.signature) {
                    componentHTML += `
                        <div class="api-section">
                            <h4>⚡ Function Signature</h4>
                            <div class="signature-block">${details.signature}</div>
                        </div>`;
                }
                
                // Parameters/Inputs - Modern card layout
                if (details.inputs && details.inputs.length > 0) {
                    componentHTML += `
                        <div class="api-section">
                            <h4>📥 Parameters</h4>
                            <div class="params-grid">`;
                    details.inputs.forEach(input => {
                        componentHTML += `
                            <div class="param-card input-card">
                                <div class="param-header">
                                    <span class="param-name">${input.name}</span>
                                    <span class="param-type">${input.format}</span>
                                </div>
                                <div class="param-description">${input.description}</div>
                            </div>`;
                    });
                    componentHTML += `</div></div>`;
                }
                
                // Returns/Outputs - Modern card layout
                if (details.outputs && details.outputs.length > 0) {
                    componentHTML += `
                        <div class="api-section">
                            <h4>📤 Returns</h4>
                            <div class="params-grid">`;
                    details.outputs.forEach(output => {
                        componentHTML += `
                            <div class="param-card output-card">
                                <div class="param-header">
                                    <span class="param-name">${output.name}</span>
                                    <span class="param-type">${output.format}</span>
                                </div>
                                <div class="param-description">${output.description}</div>
                            </div>`;
                    });
                    componentHTML += `</div></div>`;
                }
                
                // Working details/Notes
                if (details.working) {
                    componentHTML += `
                        <div class="api-section">
                            <h4>💡 Implementation Details</h4>
                            <div class="working-details">${details.working}</div>
                        </div>`;
                }
                
                // Dependencies/Imports
                if (details.imports && details.imports.length > 0) {
                    componentHTML += `
                        <div class="api-section">
                            <h4>📦 Dependencies</h4>
                            <div class="dependencies-list">`;
                    details.imports.forEach(dep => {
                        componentHTML += `<span class="dependency-badge">${dep}</span>`;
                    });
                    componentHTML += `</div>
                        </div>`;
                }
                
                componentHTML += `</div></div>`;
                componentsHTML += componentHTML;
            }
        }
        
        // Generate full documentation sections
        let fullDocHTML = '';
        if (fullDocumentation) {
            for (const [sectionKey, section] of Object.entries(fullDocumentation)) {
                fullDocHTML += `<div class="doc-section">
                    <h3>${section.title}</h3>
                    <div class="doc-content">${section.content}</div>`;
                
                // Add principles if available
                if (section.principles && section.principles.length > 0) {
                    fullDocHTML += `<div class="doc-principles">
                        <h4>Core Principles:</h4>
                        <ul>`;
                    section.principles.forEach(principle => {
                        fullDocHTML += `<li>${principle}</li>`;
                    });
                    fullDocHTML += `</ul></div>`;
                }
                
                // Add structure if available
                if (section.structure) {
                    fullDocHTML += `<div class="structure-grid">`;
                    for (const [key, value] of Object.entries(section.structure)) {
                        fullDocHTML += `<div class="structure-item">
                            <h5>${key.replace(/_/g, ' ').toUpperCase()}</h5>
                            <p>${value}</p>
                        </div>`;
                    }
                    fullDocHTML += `</div>`;
                }
                
                // Add patterns if available
                if (section.patterns && section.patterns.length > 0) {
                    fullDocHTML += `<div class="doc-patterns">
                        <h4>Design Patterns:</h4>
                        <ul>`;
                    section.patterns.forEach(pattern => {
                        fullDocHTML += `<li>${pattern}</li>`;
                    });
                    fullDocHTML += `</ul></div>`;
                }
                
                // Add technologies if available
                if (section.technologies && section.technologies.length > 0) {
                    fullDocHTML += `<div class="doc-technologies">
                        <h4>Technologies:</h4>
                        <ul>`;
                    section.technologies.forEach(tech => {
                        fullDocHTML += `<li>${tech}</li>`;
                    });
                    fullDocHTML += `</ul></div>`;
                }
                
                // Add common patterns if available
                if (section.common_patterns) {
                    fullDocHTML += `<div class="doc-patterns">
                        <h4>Common Patterns:</h4>
                        <div class="structure-grid">`;
                    for (const [key, value] of Object.entries(section.common_patterns)) {
                        fullDocHTML += `<div class="structure-item">
                            <h5>${key.replace(/_/g, ' ').toUpperCase()}</h5>
                            <p>${value}</p>
                        </div>`;
                    }
                    fullDocHTML += `</div></div>`;
                }
                
                // Add service communication if available
                if (section.service_communication && section.service_communication.length > 0) {
                    fullDocHTML += `<div class="doc-patterns">
                        <h4>Service Communication:</h4>
                        <ul>`;
                    section.service_communication.forEach(comm => {
                        fullDocHTML += `<li>${comm}</li>`;
                    });
                    fullDocHTML += `</ul></div>`;
                }
                
                // Add database patterns if available
                if (section.database_patterns) {
                    fullDocHTML += `<div class="doc-patterns">
                        <h4>Database Patterns:</h4>
                        <div class="structure-grid">`;
                    for (const [key, value] of Object.entries(section.database_patterns)) {
                        fullDocHTML += `<div class="structure-item">
                            <h5>${key.replace(/_/g, ' ').toUpperCase()}</h5>
                            <p>${value}</p>
                        </div>`;
                    }
                    fullDocHTML += `</div></div>`;
                }
                
                fullDocHTML += `</div>`;
            }
        }
        
        // Replace placeholders in documentation template
        const docContent = templates.documentation
            .replace(/\{\{PROJECT_NAME\}\}/g, metadata.name || 'Architecture Documentation')
            .replace(/\{\{PROJECT_DESCRIPTION\}\}/g, metadata.description || 'Project architecture documentation')
            .replace(/\{\{PROJECT_VERSION\}\}/g, metadata.version || '1.0.0')
            .replace(/\{\{PROJECT_SUMMARY\}\}/g, metadata.summary || 'No summary provided.')
            .replace(/\{\{OVERVIEW\}\}/g, documentation.overview || 'No overview provided.')
            .replace(/\{\{INSTALLATION\}\}/g, documentation.installation || 'npm install')
            .replace(/\{\{USAGE\}\}/g, documentation.usage || 'npm start')
            .replace(/\{\{API_REFERENCE\}\}/g, documentation.api_reference || 'No API reference provided.')
            .replace(/\{\{CONTRIBUTING\}\}/g, documentation.contributing || 'No contributing guidelines provided.')
            .replace(/\{\{LICENSE\}\}/g, documentation.license || 'No license information provided.')
            .replace('{{COMPONENTS}}', componentsHTML)
            .replace('{{COMPONENT_NAV}}', componentNavHTML)
            .replace('{{FULL_DOCUMENTATION}}', fullDocHTML)
            .replace('{{GRAPH_PAGE}}', 'index.html');
        
        return docContent;
    }
    
    writeOutputFile(outputPath, content) {
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Write file
        fs.writeFileSync(outputPath, content, 'utf8');
        
        // Get file size for summary
        const stats = fs.statSync(outputPath);
        const fileSizeKB = Math.round(stats.size / 1024);
        console.log(`📄 Generated file size: ${fileSizeKB} KB`);
    }
    
    displaySummary(architectureData, outputPath) {
        const metadata = architectureData.metadata || {};
        
        console.log('\n🎉 Generation Summary:');
        console.log('─'.repeat(50));
        console.log(`📋 Project: ${metadata.projectName || 'Unnamed Project'}`);
        console.log(`📊 Components: ${architectureData.nodes.length}`);
        console.log(`🔗 Connections: ${architectureData.edges.length}`);
        console.log(`📁 Output: ${path.resolve(outputPath)}`);
        console.log(`🌐 View: file://${path.resolve(outputPath)}`);
        console.log('─'.repeat(50));
        console.log('\n💡 Next steps:');
        console.log('   • Open the HTML file in your browser');
        console.log('   • Hover over components to see details');
        console.log('   • Click components to expand/collapse');
        console.log('   • Use controls to navigate the architecture');
    }
    
    // CLI helper methods
    static showHelp() {
        console.log(`
🏗️  Architecture Documentation Generator

Usage:
  node generate.js <input.json>

Examples:
  node generate.js examples/sample-architecture.json
  node generate.js my-project.json
  node generate.js examples/professional-sample.json

Options:
  --help, -h    Show this help message

The generator automatically creates output files in the output/ folder:
- [filename].html (interactive visualization)
- [filename]-documentation.html (comprehensive documentation)

Output files are self-contained and work offline in any browser.
        `);
    }
    
    static async main() {
        const args = process.argv.slice(2);
        
        // Show help
        if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
            ArchitectureDocGenerator.showHelp();
            return;
        }
        
        // Validate arguments
        if (args.length < 1) {
            console.error('❌ Error: Please provide input JSON file');
            console.log('   Usage: node generate.js <input.json>');
            console.log('   Output will be automatically generated in the output/ folder');
            process.exit(1);
        }
        
        const inputPath = args[0];
        
        // Extract filename without extension from input path
        const inputFileName = path.basename(inputPath, '.json');
        
        // Generate output path in the output folder
        const outputPath = path.join(__dirname, 'output', `${inputFileName}.html`);
        
        // Generate documentation
        const generator = new ArchitectureDocGenerator();
        await generator.generate(inputPath, outputPath);
    }
}

// Run if called directly
if (require.main === module) {
    ArchitectureDocGenerator.main().catch(error => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = ArchitectureDocGenerator;
