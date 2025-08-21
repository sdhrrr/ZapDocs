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
            // Node styles
            {
                selector: 'node',
                style: {
                    'background-color': '#66BB6A',
                    'label': 'data(label)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'font-size': '12px',
                    'font-weight': 'bold',
                    'width': '80px',
                    'height': '80px',
                    'border-width': '2px',
                    'border-color': '#4CAF50',
                    'text-wrap': 'wrap',
                    'text-max-width': '70px',
                    'overlay-opacity': 0,
                    'transition-property': 'background-color, border-color, width, height',
                    'transition-duration': '0.3s'
                }
            },
            
            // Type-specific node styles
            {
                selector: 'node.application',
                style: {
                    'background-color': '#2196F3',
                    'border-color': '#1976D2',
                    'width': '100px',
                    'height': '100px',
                    'font-size': '14px'
                }
            },
            
            {
                selector: 'node.backend',
                style: {
                    'background-color': '#FF5722',
                    'border-color': '#D84315',
                    'shape': 'rectangle'
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
                    'shape': 'diamond'
                }
            },
            
            {
                selector: 'node.frontend',
                style: {
                    'background-color': '#4CAF50',
                    'border-color': '#388E3C',
                    'shape': 'rectangle'
                }
            },
            
            {
                selector: 'node.database',
                style: {
                    'background-color': '#795548',
                    'border-color': '#5D4037',
                    'shape': 'barrel'
                }
            },
            
            {
                selector: 'node.cache',
                style: {
                    'background-color': '#607D8B',
                    'border-color': '#455A64',
                    'shape': 'hexagon'
                }
            },
            
            // Hover effects
            {
                selector: 'node:active',
                style: {
                    'overlay-opacity': 0.2,
                    'overlay-color': '#000'
                }
            },
            
            // Selected state
            {
                selector: 'node:selected',
                style: {
                    'border-width': '4px',
                    'border-color': '#333'
                }
            },
            
            // Edge styles
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'line-color': '#95A5A6',
                    'target-arrow-color': '#95A5A6',
                    'width': '3px',
                    'arrow-scale': 1.2,
                    'transition-property': 'line-color, target-arrow-color, width',
                    'transition-duration': '0.3s'
                }
            },
            
            // Highlighted edges
            {
                selector: 'edge.highlighted',
                style: {
                    'line-color': '#E74C3C',
                    'target-arrow-color': '#E74C3C',
                    'width': '4px'
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
        // Node hover
        this.cy.on('mouseover', 'node', (event) => {
            const node = event.target;
            this.handleNodeHover(node);
        });
        
        this.cy.on('mouseout', 'node', (event) => {
            this.clearHighlights();
        });
        
        // Node click 
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
        
        sidebar.innerHTML = `
            <h3>${nodeData.label}</h3>
            
            <div class="detail-section">
                <span class="detail-label">Summary:</span>
                <p class="working-description">${details.summary || 'No description available.'}</p>
            </div>
            
            ${details.signature ? `
                <div class="detail-section">
                    <span class="detail-label">Signature:</span>
                    <div class="signature">${details.signature}</div>
                </div>
            ` : ''}
            
            ${details.working ? `
                <div class="detail-section">
                    <span class="detail-label">How it works:</span>
                    <p class="working-description">${details.working}</p>
                </div>
            ` : ''}
            
            ${details.imports && details.imports.length > 0 ? `
                <div class="detail-section">
                    <span class="detail-label">Dependencies:</span>
                    <ul class="imports-list">
                        ${details.imports.map(imp => `<li>${imp}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
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
            rankDir: 'TB',
            nodeSep: 50,
            rankSep: 100,
            marginX: 50,
            marginY: 50,
            animate: true,
            animationDuration: 500,
            animationEasing: 'ease-out',
            fit: true,
            padding: 50
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
});
