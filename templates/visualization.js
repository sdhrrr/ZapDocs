// Architecture Visualization with Cytoscape.js

// Register Dagre extension
if (typeof cytoscape !== 'undefined' && typeof cytoscapeDagre !== 'undefined') {
    cytoscape.use(cytoscapeDagre);
} else if (typeof window !== 'undefined') {
    // Wait for libraries to load
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof cytoscape !== 'undefined' && typeof cytoscapeDagre !== 'undefined') {
            cytoscape.use(cytoscapeDagre);
        }
    });
}

class ArchitectureViewer {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        this.architectureData = data;
        this.cy = null;
        this.state = {
            hoveredNode: null,
            selectedNode: null,
            visibleNodes: new Set(),
            navigationPath: ['root'],
            currentLevel: 0,
            maxLevel: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupCytoscape();
        this.setupEventHandlers();
        this.calculateMaxLevel(); // Calculate the maximum hierarchy depth
        this.initialLayout();
        this.updateProjectHeader();
    }
    
    setupCytoscape() {
        // Process data for Cytoscape
        const elements = this.processArchitectureData();
        
        this.cy = cytoscape({
            container: this.container,
            elements: elements,
            style: this.getStylesheet(),
            layout: { name: 'grid' }, // Will be replaced with proper layout
            
            // Simple, clean settings - no fancy stuff
            minZoom: 0.1,
            maxZoom: 3,
            zoomingEnabled: true,
            panningEnabled: true,
            boxSelectionEnabled: false,
            selectionType: 'single',
            autoungrabify: false,
            autounselectify: false
        });
    }
    
    processArchitectureData() {
        const nodes = this.architectureData.nodes.map(node => ({
            group: 'nodes',
            data: {
                id: node.id,
                label: node.data.label,
                type: node.data.type || 'default',
                // Include ALL node data for detailed summaries
                description: node.data.description,
                summary: node.data.summary,
                keyPrinciples: node.data.keyPrinciples,
                keyFunctions: node.data.keyFunctions,
                keyResponsibilities: node.data.keyResponsibilities,
                keyFeatures: node.data.keyFeatures,
                keyPowers: node.data.keyPowers,
                powers: node.data.powers,
                functions: node.data.functions,
                historicalContext: node.data.historicalContext,
                selectionMethod: node.data.selectionMethod,
                accountability: node.data.accountability,
                termLength: node.data.termLength,
                composition: node.data.composition,
                principle: node.data.principle,
                structure: node.data.structure,
                sovereignty: node.data.sovereignty,
                representation: node.data.representation,
                specialPowers: node.data.specialPowers,
                jurisdiction: node.data.jurisdiction,
                independence: node.data.independence,
                specialization: node.data.specialization,
                requirements: node.data.requirements,
                significance: node.data.significance,
                democraticRole: node.data.democraticRole,
                keyComponents: node.data.keyComponents,
                keyElements: node.data.keyElements,
                protectedRights: node.data.protectedRights,
                purpose: node.data.purpose,
                enforcement: node.data.enforcement,
                types: node.data.types,
                considerations: node.data.considerations,
                impact: node.data.impact,
                advantages: node.data.advantages,
                mechanisms: node.data.mechanisms,
                variants: node.data.variants,
                characteristics: node.data.characteristics,
                effects: node.data.effects,
                mechanics: node.data.mechanics,
                controversies: node.data.controversies,
                process: node.data.process,
                benefits: node.data.benefits,
                concerns: node.data.concerns,
                methods: node.data.methods,
                regulation: node.data.regulation,
                balance: node.data.balance,
                implementation: node.data.implementation,
                importance: node.data.importance,
                challenges: node.data.challenges,
                protection: node.data.protection,
                branches: node.data.branches,
                mechanism: node.data.mechanism,
                examples: node.data.examples,
                operation: node.data.operation,
                effect: node.data.effect,
                details: this.architectureData.details[node.id] || {}
            },
            classes: node.data.type || 'default'
        }));
        
        const edges = this.architectureData.edges.map(edge => ({
            group: 'edges',
            data: {
                id: `${edge.source}-${edge.target}`,
                source: edge.source,
                target: edge.target
            }
        }));
        
        return [...nodes, ...edges];
    }
    
    getStylesheet() {
        return [
            // Base node styles with better text accommodation
            {
                selector: 'node',
                style: {
                    'background-color': '#66BB6A',
                    'label': 'data(label)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'font-size': '11px', // Normal readable size
                    'font-weight': '600', 
                    'font-family': 'Inter, sans-serif',
                    'width': '85px', // Increased from 70px to better fit text
                    'height': '85px', // Increased from 70px
                    'border-width': '2px', // Normal border
                    'border-color': '#4CAF50',
                    'text-wrap': 'wrap',
                    'text-max-width': '80px', // Adjusted for larger nodes
                    'overlay-opacity': 0,
                    'transition-property': 'background-color, border-color, border-width',
                    'transition-duration': '0.3s',
                    'shape': 'round-rectangle'
                }
            },
            
            // TYPE-SPECIFIC STYLES with better text accommodation
            {
                selector: 'node.application',
                style: {
                    'background-color': '#2196F3',
                    'border-color': '#1976D2',
                    'width': '95px', // Increased for main applications
                    'height': '95px',
                    'font-size': '12px'
                }
            },
            
            {
                selector: 'node.backend',
                style: {
                    'background-color': '#FF5722',
                    'border-color': '#D84315',
                    'shape': 'round-rectangle'
                }
            },
            
            {
                selector: 'node.component',
                style: {
                    'background-color': '#9C27B0',
                    'border-color': '#7B1FA2'
                }
            },
            
            {
                selector: 'node.entry',
                style: {
                    'background-color': '#FF9800',
                    'border-color': '#F57C00',
                    'shape': 'diamond',
                    'width': '90px', // Increased for better text fit
                    'height': '90px'
                }
            },
            
            {
                selector: 'node.frontend',
                style: {
                    'background-color': '#4CAF50',
                    'border-color': '#388E3C',
                    'shape': 'round-rectangle'
                }
            },
            
            {
                selector: 'node.database',
                style: {
                    'background-color': '#795548',
                    'border-color': '#5D4037',
                    'shape': 'barrel',
                    'width': '90px', // Increased for better text fit
                    'height': '90px'
                }
            },
            
            {
                selector: 'node.data',
                style: {
                    'background-color': '#607D8B',
                    'border-color': '#455A64',
                    'shape': 'barrel'
                }
            },
            
            {
                selector: 'node.utility',
                style: {
                    'background-color': '#607D8B',
                    'border-color': '#455A64',
                    'shape': 'hexagon'
                }
            },
            
            // SUBTLE HOVER AND INTERACTION STATES
            {
                selector: 'node.highlighted',
                style: {
                    'border-width': '3px',
                    'border-color': '#FFC107', // Subtle yellow highlight
                    'transition-duration': '0.2s'
                }
            },
            
            {
                selector: 'node:hover',
                style: {
                    'border-width': '3px'
                }
            },
            
            {
                selector: 'node:active',
                style: {
                    'overlay-opacity': 0.1,
                    'overlay-color': '#000'
                }
            },
            
            {
                selector: 'node:selected',
                style: {
                    'border-width': '4px',
                    'border-color': '#333'
                }
            },
            
            // ENHANCED EDGE STYLES with better visibility
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier', // Curved edges for better readability
                    'target-arrow-shape': 'triangle',
                    'line-color': '#666666', // Lighter color for better visibility
                    'target-arrow-color': '#666666',
                    'width': '3px', // 🔧 THICKER LINES (was 2px)
                    'target-arrow-size': '15px', // 🔧 BIGGER ARROWS (was 10px)
                    'arrow-scale': 1.5, // 🔧 LARGER ARROW SCALE (was 1.2)
                    'control-point-step-size': '40px', // Normal curve control
                    'overlay-opacity': 0,
                    'opacity': 1, // Full opacity for clear visibility
                    'transition-property': 'line-color, target-arrow-color, width, opacity',
                    'transition-duration': '0.3s'
                }
            },
            
            // Edge type-specific styles with normal colors
            {
                selector: 'edge.dependency',
                style: {
                    'line-color': '#2196F3',
                    'target-arrow-color': '#2196F3'
                }
            },
            
            {
                selector: 'edge.uses',
                style: {
                    'line-color': '#4CAF50',
                    'target-arrow-color': '#4CAF50',
                    'line-style': 'dashed',
                    'line-dash-pattern': [6, 3]
                }
            },
            
            {
                selector: 'edge.contains',
                style: {
                    'line-color': '#9C27B0',
                    'target-arrow-color': '#9C27B0',
                    'width': '3px' // Slightly thicker for containment
                }
            },
            
            {
                selector: 'edge.connects',
                style: {
                    'line-color': '#FF9800',
                    'target-arrow-color': '#FF9800'
                }
            },
            
            // Subtle highlighted edges
            {
                selector: 'edge.highlighted',
                style: {
                    'line-color': '#FFC107',
                    'target-arrow-color': '#FFC107',
                    'width': '3px',
                    'opacity': 1,
                    'transition-duration': '0.2s'
                }
            },
            
            // Edge hover effects
            {
                selector: 'edge:hover',
                style: {
                    'width': '3px',
                    'opacity': 1
                }
            },
            
            // Dimmed elements for interactive highlighting
            {
                selector: '.dimmed',
                style: {
                    'opacity': 0.25
                }
            },
            
            // Hidden elements
            {
                selector: '.hidden',
                style: {
                    'display': 'none'
                }
            }
        ];
    }
    
    setupEventHandlers() {
        // Subtle node hover highlighting without dimming others
        this.cy.on('mouseover', 'node', (event) => {
            const node = event.target;
            
            // Just highlight the hovered node subtly
            node.addClass('highlighted');
            
            // Also handle component details
            this.handleNodeHover(node);
            
            // Show enhanced tooltip
            this.showNodeTooltip(node, event);
        });
        
        this.cy.on('mouseout', 'node', (event) => {
            const node = event.target;
            
            // Remove highlighting from the node
            node.removeClass('highlighted');
            
            // Clear other highlights
            this.clearHighlights();
            this.hideTooltips();
        });
        
        // Simple edge hover effects without dimming
        this.cy.on('mouseover', 'edge', (event) => {
            const edge = event.target;
            
            // Just highlight the edge
            edge.addClass('highlighted');
            
            this.showEdgeTooltip(edge, event);
        });

        this.cy.on('mouseout', 'edge', (event) => {
            const edge = event.target;
            edge.removeClass('highlighted');
            this.hideTooltips();
        });
        
        // Node click with enhanced interaction
        this.cy.on('tap', 'node', (event) => {
            const node = event.target;
            this.handleNodeClick(node);
        });
        
        // Background click
        this.cy.on('tap', (event) => {
            if (event.target === this.cy) {
                this.clearSelection();
            }
        });

        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.key === 'r' || event.key === 'R') {
                this.applyLayout();
            } else if (event.key === 'f' || event.key === 'F') {
                this.cy.fit(null, 50);
            } else if (event.key === 'Escape') {
                this.cy.elements().removeClass('dimmed highlighted connected');
                this.hideTooltips();
                this.clearSelection();
            } else if (event.key === 'c' || event.key === 'C') {
                this.cy.center();
            }
        });
    }
    
    handleNodeHover(node) {
        this.state.hoveredNode = node;
        
        // Highlight connected elements
        const connectedEdges = node.connectedEdges();
        connectedEdges.addClass('highlighted');
        
        // Update sidebar
        this.updateSidebar(node);
    }
    
    handleNodeClick(node) {
        this.state.selectedNode = node;
        
        // Check if node has children in hierarchy
        const nodeId = node.id();
        const children = this.architectureData.hierarchy[nodeId];
        
        if (children && children.length > 0) {
            this.toggleNodeChildren(node, children);
        }
        
        // Update sidebar with permanent selection
        this.updateSidebar(node);
    }
    
    toggleNodeChildren(parentNode, childrenIds) {
        const parentId = parentNode.id();
        
        // Check if children are currently visible
        const firstChild = this.cy.getElementById(childrenIds[0]);
        const areChildrenVisible = firstChild.length > 0 && !firstChild.hasClass('hidden');
        
        if (areChildrenVisible) {
            // Hide children
            this.hideNodeChildren(childrenIds);
        } else {
            // Show children
            this.showNodeChildren(childrenIds);
        }
        
        // Re-layout after visibility changes
        this.applyLayout();
    }
    
    showNodeChildren(childrenIds) {
        childrenIds.forEach(childId => {
            const childNode = this.cy.getElementById(childId);
            if (childNode.length > 0) {
                childNode.removeClass('hidden');
                this.state.visibleNodes.add(childId);
            }
        });
    }
    
    hideNodeChildren(childrenIds) {
        // Recursively hide children and their descendants
        const toHide = new Set();
        
        const addDescendants = (nodeId) => {
            toHide.add(nodeId);
            const children = this.architectureData.hierarchy[nodeId] || [];
            children.forEach(addDescendants);
        };
        
        childrenIds.forEach(addDescendants);
        
        toHide.forEach(nodeId => {
            const node = this.cy.getElementById(nodeId);
            if (node.length > 0) {
                node.addClass('hidden');
                this.state.visibleNodes.delete(nodeId);
            }
        });
    }
    
    clearHighlights() {
        this.cy.edges().removeClass('highlighted');
        if (!this.state.selectedNode) {
            this.updateSidebar(null);
        }
    }
    
    clearSelection() {
        this.state.selectedNode = null;
        this.updateSidebar(null);
    }
    
    updateSidebar(node) {
        const sidebar = document.getElementById('component-details');
        
        if (!node) {
            sidebar.innerHTML = `
                <div class="empty-state">
                    <h3>Component Explorer</h3>
                    <p>Hover over a component to see its details, or click to explore its structure.</p>
                </div>
            `;
            return;
        }
        
        const nodeData = node.data();
        const details = nodeData.details || {};
        const metadata = this.architectureData.metadata || {};
        const isTechnical = this.isTechnicalContent(metadata);
        
        let sidebarHTML = `
            <h3>${nodeData.label}</h3>
            
            <div class="detail-section">
                <span class="detail-label">Summary:</span>
                <p class="working-description">${nodeData.summary || nodeData.description || 'No description available.'}</p>
            </div>
        `;
        
        // Add content-specific sections based on content type
        if (!isTechnical) {
            // Non-technical content (like democracy, history, etc.)
            sidebarHTML = this.addEducationalSections(sidebarHTML, details, nodeData);
        } else {
            // Technical content (software architecture)
            sidebarHTML = this.addTechnicalSections(sidebarHTML, details);
        }
        
        sidebar.innerHTML = sidebarHTML;
    }
    
    isTechnicalContent(metadata) {
        const technicalTypes = ['software', 'code', 'architecture', 'system', 'api', 'framework'];
        const nonTechnicalTypes = ['educational', 'political-science', 'history', 'social', 'concept'];
        
        if (metadata.contentType && nonTechnicalTypes.includes(metadata.contentType)) {
            return false;
        }
        
        if (metadata.topic && nonTechnicalTypes.includes(metadata.topic)) {
            return false;
        }
        
        if (metadata.contentType && technicalTypes.includes(metadata.contentType)) {
            return true;
        }
        
        // Default to technical for backward compatibility
        return true;
    }
    
    addEducationalSections(sidebarHTML, details, nodeData) {
        // Add educational content sections with comprehensive details
        
        // Key Principles
        if (nodeData.keyPrinciples && nodeData.keyPrinciples.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Key Principles:</span>
                    <ul class="principles-list">
                        ${nodeData.keyPrinciples.map(principle => `<li>${principle}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Key Functions
        if (nodeData.keyFunctions && nodeData.keyFunctions.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Key Functions:</span>
                    <ul class="functions-list">
                        ${nodeData.keyFunctions.map(func => `<li>${func}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Key Responsibilities
        if (nodeData.keyResponsibilities && nodeData.keyResponsibilities.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Key Responsibilities:</span>
                    <ul class="responsibilities-list">
                        ${nodeData.keyResponsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Key Features
        if (nodeData.keyFeatures && nodeData.keyFeatures.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Key Features:</span>
                    <ul class="features-list">
                        ${nodeData.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Powers
        if (nodeData.powers && nodeData.powers.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Powers:</span>
                    <ul class="powers-list">
                        ${nodeData.powers.map(power => `<li>${power}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Key Powers
        if (nodeData.keyPowers && nodeData.keyPowers.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Key Powers:</span>
                    <ul class="key-powers-list">
                        ${nodeData.keyPowers.map(power => `<li>${power}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Selection Method
        if (nodeData.selectionMethod) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Selection Method:</span>
                    <p class="selection-description">${nodeData.selectionMethod}</p>
                </div>`;
        }
        
        // Accountability
        if (nodeData.accountability) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Accountability:</span>
                    <p class="accountability-description">${nodeData.accountability}</p>
                </div>`;
        }
        
        // Term Length
        if (nodeData.termLength) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Term Length:</span>
                    <p class="term-description">${nodeData.termLength}</p>
                </div>`;
        }
        
        // Composition
        if (nodeData.composition) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Composition:</span>
                    <p class="composition-description">${nodeData.composition}</p>
                </div>`;
        }
        
        // Principle
        if (nodeData.principle) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Core Principle:</span>
                    <p class="principle-description">${nodeData.principle}</p>
                </div>`;
        }
        
        // Structure
        if (nodeData.structure) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Structure:</span>
                    <p class="structure-description">${nodeData.structure}</p>
                </div>`;
        }
        
        // Sovereignty
        if (nodeData.sovereignty) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Sovereignty:</span>
                    <p class="sovereignty-description">${nodeData.sovereignty}</p>
                </div>`;
        }
        
        // Representation
        if (nodeData.representation) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Representation:</span>
                    <p class="representation-description">${nodeData.representation}</p>
                </div>`;
        }
        
        // Special Powers
        if (nodeData.specialPowers) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Special Powers:</span>
                    <p class="special-powers-description">${nodeData.specialPowers}</p>
                </div>`;
        }
        
        // Jurisdiction
        if (nodeData.jurisdiction) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Jurisdiction:</span>
                    <p class="jurisdiction-description">${nodeData.jurisdiction}</p>
                </div>`;
        }
        
        // Independence
        if (nodeData.independence) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Independence:</span>
                    <p class="independence-description">${nodeData.independence}</p>
                </div>`;
        }
        
        // Requirements
        if (nodeData.requirements) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Requirements:</span>
                    <p class="requirements-description">${nodeData.requirements}</p>
                </div>`;
        }
        
        // Significance
        if (nodeData.significance) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Significance:</span>
                    <p class="significance-description">${nodeData.significance}</p>
                </div>`;
        }
        
        // Democratic Role
        if (nodeData.democraticRole) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Democratic Role:</span>
                    <p class="democratic-role-description">${nodeData.democraticRole}</p>
                </div>`;
        }
        
        // Key Components
        if (nodeData.keyComponents && nodeData.keyComponents.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Key Components:</span>
                    <ul class="components-list">
                        ${nodeData.keyComponents.map(component => `<li>${component}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Historical Context
        if (nodeData.historicalContext) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Historical Context:</span>
                    <p class="context-description">${nodeData.historicalContext}</p>
                </div>`;
        }
        
        // Advantages
        if (nodeData.advantages && nodeData.advantages.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Advantages:</span>
                    <ul class="advantages-list">
                        ${nodeData.advantages.map(advantage => `<li>${advantage}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Mechanisms
        if (nodeData.mechanisms && nodeData.mechanisms.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Mechanisms:</span>
                    <ul class="mechanisms-list">
                        ${nodeData.mechanisms.map(mechanism => `<li>${mechanism}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Types
        if (nodeData.types && nodeData.types.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Types:</span>
                    <ul class="types-list">
                        ${nodeData.types.map(type => `<li>${type}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Characteristics
        if (nodeData.characteristics && nodeData.characteristics.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Characteristics:</span>
                    <ul class="characteristics-list">
                        ${nodeData.characteristics.map(char => `<li>${char}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // Effects
        if (nodeData.effects) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Effects:</span>
                    <p class="effects-description">${nodeData.effects}</p>
                </div>`;
        }
        
        // Purpose
        if (nodeData.purpose) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Purpose:</span>
                    <p class="purpose-description">${nodeData.purpose}</p>
                </div>`;
        }
        
        // Implementation
        if (nodeData.implementation) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Implementation:</span>
                    <p class="implementation-description">${nodeData.implementation}</p>
                </div>`;
        }
        
        // Importance
        if (nodeData.importance) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Importance:</span>
                    <p class="importance-description">${nodeData.importance}</p>
                </div>`;
        }
        
        // Challenges
        if (nodeData.challenges) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Challenges:</span>
                    <p class="challenges-description">${nodeData.challenges}</p>
                </div>`;
        }
        
        // Benefits
        if (nodeData.benefits) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Benefits:</span>
                    <p class="benefits-description">${nodeData.benefits}</p>
                </div>`;
        }
        
        // Concerns
        if (nodeData.concerns) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Concerns:</span>
                    <p class="concerns-description">${nodeData.concerns}</p>
                </div>`;
        }
        
        return sidebarHTML;
    }
    
    addTechnicalSections(sidebarHTML, details) {
        // Technical content sections (original implementation)
        if ((details.inputs && details.inputs.length > 0) || (details.outputs && details.outputs.length > 0)) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Data Flow:</span>
                    <div class="io-summary">`;
            
            if (details.inputs && details.inputs.length > 0) {
                sidebarHTML += `<div class="io-quick">📥 <strong>Inputs:</strong> `;
                sidebarHTML += details.inputs.map(input => `${input.name} (${input.format})`).join(', ');
                sidebarHTML += `</div>`;
            }
            
            if (details.outputs && details.outputs.length > 0) {
                sidebarHTML += `<div class="io-quick">📤 <strong>Outputs:</strong> `;
                sidebarHTML += details.outputs.map(output => `${output.name} (${output.format})`).join(', ');
                sidebarHTML += `</div>`;
            }
            
            sidebarHTML += `</div></div>`;
        }
        
        if (details.signature) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Signature:</span>
                    <div class="signature">${details.signature}</div>
                </div>`;
        }
        
        if (details.working) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">How it works:</span>
                    <p class="working-description">${details.working}</p>
                </div>`;
        }
        
        if (details.imports && details.imports.length > 0) {
            sidebarHTML += `
                <div class="detail-section">
                    <span class="detail-label">Dependencies:</span>
                    <ul class="imports-list">
                        ${details.imports.map(imp => `<li>${imp}</li>`).join('')}
                    </ul>
                </div>`;
        }
        
        return sidebarHTML;
    }
    
    updateProjectHeader() {
        const header = document.getElementById('project-info');
        const metadata = this.architectureData.metadata || {};
        
        header.innerHTML = `
            <div class="project-header">
                <h1 class="project-title">${metadata.projectName || 'Architecture Documentation'}</h1>
                <p class="project-description">${metadata.description || 'Interactive component visualization'}</p>
            </div>
        `;
    }
    
    // Enhanced tooltip system for better user interaction
    showNodeTooltip(node, event) {
        const tooltip = this.getOrCreateTooltip();
        const nodeData = node.data();
        
        let content = `<div class="tooltip-header">${nodeData.label}</div>`;
        if (nodeData.type) content += `<div class="tooltip-type">Type: ${nodeData.type}</div>`;
        if (nodeData.description) content += `<div class="tooltip-desc">${nodeData.description}</div>`;
        
        const connections = node.connectedEdges().length;
        content += `<div class="tooltip-connections">Connections: ${connections}</div>`;
        
        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
        this.positionTooltip(tooltip, event);
    }

    showEdgeTooltip(edge, event) {
        const tooltip = this.getOrCreateTooltip();
        const edgeData = edge.data();
        const sourceLabel = edge.source().data('label');
        const targetLabel = edge.target().data('label');
        
        let content = `<div class="tooltip-header">${sourceLabel} → ${targetLabel}</div>`;
        if (edgeData.type) content += `<div class="tooltip-type">Relationship: ${edgeData.type}</div>`;
        if (edgeData.description) content += `<div class="tooltip-desc">${edgeData.description}</div>`;
        
        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
        this.positionTooltip(tooltip, event);
    }

    hideTooltips() {
        const tooltip = document.getElementById('cytoscape-tooltip');
        if (tooltip) tooltip.style.display = 'none';
    }

    positionTooltip(tooltip, event) {
        const containerRect = this.cy.container().getBoundingClientRect();
        const x = event.renderedPosition.x + containerRect.left + 10;
        const y = event.renderedPosition.y + containerRect.top - 10;
        
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
        
        // Ensure tooltip stays within viewport
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth) {
            tooltip.style.left = (x - tooltipRect.width - 20) + 'px';
        }
        if (tooltipRect.top < 0) {
            tooltip.style.top = (y + 40) + 'px';
        }
    }

    getOrCreateTooltip() {
        let tooltip = document.getElementById('cytoscape-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'cytoscape-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(30,30,30,0.95));
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 13px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
                z-index: 10000;
                max-width: 280px;
                pointer-events: none;
                display: none;
                backdrop-filter: blur(10px);
                line-height: 1.4;
            `;
            
            // Add tooltip styles
            const style = document.createElement('style');
            style.textContent = `
                #cytoscape-tooltip .tooltip-header {
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 6px;
                    font-size: 14px;
                }
                #cytoscape-tooltip .tooltip-type {
                    color: #64B5F6;
                    font-size: 12px;
                    margin-bottom: 4px;
                }
                #cytoscape-tooltip .tooltip-desc {
                    color: #E0E0E0;
                    font-size: 12px;
                    margin-bottom: 6px;
                    line-height: 1.3;
                }
                #cytoscape-tooltip .tooltip-connections {
                    color: #81C784;
                    font-size: 11px;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }
    
    initialLayout() {
        // Hide all children initially, show only top-level nodes
        const topLevelNodes = this.getTopLevelNodes();
        
        this.cy.nodes().forEach(node => {
            const nodeId = node.id();
            if (topLevelNodes.includes(nodeId)) {
                this.state.visibleNodes.add(nodeId);
            } else {
                node.addClass('hidden');
            }
        });
        
        this.applyLayout();
    }
    
    getTopLevelNodes() {
        const allNodes = this.architectureData.nodes.map(n => n.id);
        const childNodes = new Set();
        
        // Find all nodes that are children of others
        Object.values(this.architectureData.hierarchy).forEach(children => {
            children.forEach(child => childNodes.add(child));
        });
        
        // Top-level nodes are those that are not children of any other node
        return allNodes.filter(nodeId => !childNodes.has(nodeId));
    }
    
    applyLayout() {
        const visibleElements = this.cy.elements().filter(ele => !ele.hasClass('hidden'));
        
        const layout = visibleElements.layout({
            name: 'dagre',
            rankDir: 'TB', // Top to bottom hierarchy
            // ANTI-OVERLAP SPACING: Prevent node overlapping
            rankSep: 120, // Increased vertical spacing to prevent overlap
            nodeSep: 80,  // Increased horizontal spacing between nodes
            // Edge separation and routing
            edgeSep: 15,  // Space between parallel edges
            spacingFactor: 1.3, // Increased overall spacing multiplier
            // Algorithm settings for optimal layout
            ranker: 'network-simplex', // Best algorithm for hierarchical layouts
            align: 'UL', // Align nodes to upper-left for consistent positioning
            // Animation and fit settings
            marginX: 40, // Good margins to prevent edge clipping
            marginY: 40,
            animate: true,
            animationDuration: 600,
            animationEasing: 'ease-in-out',
            fit: true,
            padding: 40,
            // Advanced settings to prevent overlapping
            nodeDimensionsIncludeLabels: true, // Account for label size
            avoidOverlap: true, // Force non-overlapping layout
            idealEdgeLength: 100 // Preferred edge length
        });
        
        layout.run();
    }
    
    // Control methods
    expandAll() {
        // Show all nodes
        this.cy.nodes().removeClass('hidden');
        
        // Update visible nodes state
        this.state.visibleNodes.clear();
        this.architectureData.nodes.forEach(node => {
            this.state.visibleNodes.add(node.id);
        });
        
        // Apply layout with a slight delay to ensure nodes are visible
        setTimeout(() => {
            this.applyLayout();
        }, 100);
    }
    
    collapseAll() {
        this.initialLayout();
    }
    
    fitView() {
        const visibleElements = this.cy.elements().filter(ele => !ele.hasClass('hidden'));
        this.cy.fit(visibleElements, 50);
    }
    
    resetView() {
        this.state.currentLevel = 0; // Reset drill level
        this.cy.reset();
        this.collapseAll();
    }

    // Level-based drill methods
    calculateMaxLevel() {
        const getNodeLevel = (nodeId, level = 0) => {
            const children = this.architectureData.hierarchy[nodeId];
            if (!children || children.length === 0) {
                return level;
            }
            
            let maxChildLevel = level;
            children.forEach(childId => {
                const childLevel = getNodeLevel(childId, level + 1);
                maxChildLevel = Math.max(maxChildLevel, childLevel);
            });
            
            return maxChildLevel;
        };

        // Start from top-level nodes
        const topLevelNodes = this.getTopLevelNodes();
        let maxLevel = 0;
        
        topLevelNodes.forEach(nodeId => {
            const nodeLevel = getNodeLevel(nodeId, 0);
            maxLevel = Math.max(maxLevel, nodeLevel);
        });
        
        this.state.maxLevel = maxLevel;
        return maxLevel;
    }

    drillDown() {
        if (this.state.currentLevel >= this.state.maxLevel) {
            return;
        }

        this.state.currentLevel++;
        this.showNodesUpToLevel(this.state.currentLevel);
    }

    drillUp() {
        if (this.state.currentLevel <= 0) {
            return;
        }

        this.state.currentLevel--;
        this.showNodesUpToLevel(this.state.currentLevel);
    }

    showNodesUpToLevel(targetLevel) {
        // First hide all nodes
        this.cy.nodes().addClass('hidden');
        this.state.visibleNodes.clear();

        const showNodeAndAncestors = (nodeId, currentLevel = 0) => {
            if (currentLevel <= targetLevel) {
                // Show this node
                const node = this.cy.getElementById(nodeId);
                if (node.length > 0) {
                    node.removeClass('hidden');
                    this.state.visibleNodes.add(nodeId);
                }

                // Show children if we haven't reached target level
                if (currentLevel < targetLevel) {
                    const children = this.architectureData.hierarchy[nodeId];
                    if (children) {
                        children.forEach(childId => {
                            showNodeAndAncestors(childId, currentLevel + 1);
                        });
                    }
                }
            }
        };

        // Start from top-level nodes
        const topLevelNodes = this.getTopLevelNodes();
        topLevelNodes.forEach(nodeId => {
            showNodeAndAncestors(nodeId, 0);
        });

        // Apply layout to visible nodes
        this.applyLayout();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Architecture data will be injected here by the generator
    const architectureData = /*ARCHITECTURE_DATA*/;
    
    // Create the viewer
    window.architectureViewer = new ArchitectureViewer('cy', architectureData);
    
    // Setup control buttons with error handling
    const expandBtn = document.getElementById('expand-all');
    if (expandBtn) {
        expandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.architectureViewer.expandAll();
        });
    }
    
    const collapseBtn = document.getElementById('collapse-all');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.architectureViewer.collapseAll();
        });
    }
    
    const fitBtn = document.getElementById('fit-view');
    if (fitBtn) {
        fitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.architectureViewer.fitView();
        });
    }
    
    const resetBtn = document.getElementById('reset-view');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.architectureViewer.resetView();
        });
    }

    // Drill down/up buttons
    const drillDownBtn = document.getElementById('drill-down');
    if (drillDownBtn) {
        drillDownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.architectureViewer.drillDown();
        });
    }

    const drillUpBtn = document.getElementById('drill-up');
    if (drillUpBtn) {
        drillUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.architectureViewer.drillUp();
        });
    }
    
    // Documentation toggle button
    const toggleDocsBtn = document.getElementById('toggle-docs');
    if (toggleDocsBtn) {
        toggleDocsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Navigate to documentation page
            const currentPage = window.location.pathname;
            const docPage = currentPage.replace('.html', '-documentation.html');
            window.location.href = docPage;
        });
    }
});
