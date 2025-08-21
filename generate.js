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
            
            // 4. Write output file
            this.writeOutputFile(outputPath, htmlContent);
            console.log(`✅ Documentation generated successfully: ${outputPath}`);
            
            // 5. Display summary
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
  node generate.js <input.json> <output.html>

Examples:
  node generate.js examples/sample-architecture.json output/docs.html
  node generate.js ./my-project.json ./docs/architecture.html

Options:
  --help, -h    Show this help message

The generator creates a self-contained HTML file with interactive
architecture visualization using Cytoscape.js.
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
        if (args.length < 2) {
            console.error('❌ Error: Please provide input JSON file and output HTML file');
            console.log('   Usage: node generate.js <input.json> <output.html>');
            process.exit(1);
        }
        
        const [inputPath, outputPath] = args;
        
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
