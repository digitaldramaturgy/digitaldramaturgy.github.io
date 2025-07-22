/* Character Network Visualization D3.js Implementation
 * Extends CollectionBuilder's visualization capabilities
 * Integrates with session-constants for data loading
 */

// Character Network D3.js Implementation
class CharacterNetworkD3 {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            nodeRadius: options.nodeRadius || 15,
            linkDistance: options.linkDistance || 100,
            linkStrength: options.linkStrength || 0.5,
            chargeStrength: options.chargeStrength || -300,
            ...options
        };
        
        this.svg = null;
        this.simulation = null;
        this.nodes = [];
        this.links = [];
        this.nodeElements = null;
        this.linkElements = null;
        this.labelElements = null;
        this.tooltip = null;
        
        this.showLabels = true;
        this.nodeScale = 1.0;
        
        this.init();
    }
    
    init() {
        this.createSVG();
        this.createTooltip();
        this.loadAndProcessData();
    }
    
    createSVG() {
        // Clear existing content
        d3.select(`#${this.containerId}`).selectAll("*").remove();
        
        // Create responsive SVG
        this.svg = d3.select(`#${this.containerId}`)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${this.options.width} ${this.options.height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("background-color", "#fafafa")
            .style("border-radius", "8px");
        
        // Add zoom and pan
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on("zoom", (event) => {
                this.networkContainer.attr("transform", event.transform);
            });
        
        this.svg.call(this.zoom);
        
        // Create main container
        this.networkContainer = this.svg.append("g")
            .attr("class", "network-container");
        
        // Add background click handler to clear selection
        this.svg.on("click", () => {
            this.clearSelection();
        });
    }
    
    createTooltip() {
        this.tooltip = d3.select("body").append("div")
            .attr("class", "character-network-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "8px 12px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", 1000)
            .style("max-width", "200px");
    }
    
    loadAndProcessData() {
        // Wait for session data if not available
        if (typeof dd_characters === 'undefined' || dd_characters.length === 0) {
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = 
                    '<div class="alert alert-warning">No character data available. Please load a play first.</div>';
            }
            return;
        }
        
        this.processCharacterData();
        this.createForceSimulation();
        this.createNetworkElements();
        this.updateStatistics();
        
        // Hide loading indicator
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
    
    processCharacterData() {
        // Create nodes from characters
        this.nodes = dd_characters.map(character => {
            const sceneCount = character.scenesList ? character.scenesList.length : 0;
            const lineCount = this.calculateLineCount(character.name);
            
            return {
                id: character.name,
                name: character.name,
                scenes: character.scenesList || [],
                sceneCount: sceneCount,
                lineCount: lineCount,
                group: this.calculateCharacterGroup(sceneCount, lineCount),
                radius: this.calculateNodeRadius(sceneCount, lineCount),
                x: Math.random() * this.options.width,
                y: Math.random() * this.options.height
            };
        });
        
        // Create links based on shared scenes
        this.links = [];
        const linkMap = new Map();
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeA = this.nodes[i];
                const nodeB = this.nodes[j];
                
                const sharedScenes = nodeA.scenes.filter(scene => 
                    nodeB.scenes.includes(scene)
                );
                
                if (sharedScenes.length > 0) {
                    const linkId = `${nodeA.id}-${nodeB.id}`;
                    const link = {
                        source: nodeA.id,
                        target: nodeB.id,
                        value: sharedScenes.length,
                        sharedScenes: sharedScenes,
                        id: linkId
                    };
                    
                    this.links.push(link);
                    linkMap.set(linkId, link);
                }
            }
        }
        
        console.log(`Processed ${this.nodes.length} characters and ${this.links.length} connections`);
    }
    
    calculateLineCount(characterName) {
        // Calculate line count from dd_items if available
        if (typeof dd_items === 'undefined' || dd_items.length === 0) {
            return 0;
        }
        
        return dd_items.filter(item => 
            item.player && 
            item.player.trim() === characterName &&
            item.player.trim() !== 'StageDirection'
        ).length;
    }
    
    calculateCharacterGroup(sceneCount, lineCount) {
        // Get total metrics for ratio calculations
        const totalScenes = dd_scenes ? dd_scenes.length : 1;
        const totalLines = this.getTotalSpeakingLines();
        
        // Calculate ratios
        const sceneRatio = sceneCount / totalScenes;
        const lineRatio = lineCount / Math.max(totalLines, 1);
        
        // Create composite score (weighted: 60% lines, 40% scenes)
        const compositeScore = (lineRatio * 0.6) + (sceneRatio * 0.4);
        
        // Adaptive thresholds based on play structure
        if (compositeScore >= 0.15) return 1; // Major characters (top 15% by composite score)
        if (compositeScore >= 0.08) return 2; // Supporting characters (8-15%)
        if (compositeScore >= 0.02) return 3; // Minor characters (2-8%)
        return 4; // Background characters (under 2%)
    }
    
    getTotalSpeakingLines() {
        if (typeof dd_items === 'undefined' || dd_items.length === 0) {
            return 1; // Avoid division by zero
        }
        
        return dd_items.filter(item => 
            item.player && 
            item.player.trim() !== '' &&
            item.player.trim() !== 'StageDirection'
        ).length;
    }
    
    calculateNodeRadius(sceneCount, lineCount) {
        // Base radius calculation using both scene count and line count
        const sceneRadius = Math.max(8, Math.min(25, 8 + sceneCount * 1.2));
        const lineRadius = Math.max(8, Math.min(25, 8 + Math.sqrt(lineCount) * 2));
        
        // Take the average of both metrics, slightly favoring line count
        return Math.round((lineRadius * 0.6) + (sceneRadius * 0.4));
    }
    
    createForceSimulation() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink(this.links)
                .id(d => d.id)
                .distance(d => Math.max(50, this.options.linkDistance - (d.value * 15)))
                .strength(d => Math.min(0.8, this.options.linkStrength + (d.value * 0.1)))
            )
            .force("charge", d3.forceManyBody()
                .strength(this.options.chargeStrength)
            )
            .force("center", d3.forceCenter(
                this.options.width / 2, 
                this.options.height / 2
            ))
            .force("collision", d3.forceCollide()
                .radius(d => d.radius + 5)
                .strength(0.7)
            )
            .alphaTarget(0.1)
            .on("tick", () => this.tick());
    }
    
    createNetworkElements() {
        // Create links
        this.linkElements = this.networkContainer.selectAll(".network-link")
            .data(this.links)
            .enter().append("line")
            .attr("class", "network-link")
            .style("stroke", "#999")
            .style("stroke-opacity", 0.6)
            .style("stroke-width", d => Math.max(1, Math.sqrt(d.value) * 2))
            .on("mouseover", (event, d) => this.showLinkTooltip(event, d))
            .on("mouseout", () => this.hideTooltip());
        
        // Create nodes
        this.nodeElements = this.networkContainer.selectAll(".network-node")
            .data(this.nodes)
            .enter().append("circle")
            .attr("class", "network-node")
            .attr("r", d => d.radius * this.nodeScale)
            .style("fill", d => this.getNodeColor(d))
            .style("stroke", "#fff")
            .style("stroke-width", 2)
            .style("cursor", "pointer")
            .call(this.createDragBehavior())
            .on("click", (event, d) => this.onNodeClick(event, d))
            .on("mouseover", (event, d) => this.onNodeHover(event, d))
            .on("mouseout", (event, d) => this.onNodeUnhover(event, d));
        
        // Create labels
        this.labelElements = this.networkContainer.selectAll(".network-label")
            .data(this.nodes)
            .enter().append("text")
            .attr("class", "network-label")
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .style("font-family", "Arial, sans-serif")
            .style("fill", "#333")
            .style("pointer-events", "none")
            .style("font-weight", "500")
            .text(d => d.name);
        
        // Start simulation
        this.simulation.alpha(1).restart();
    }
    
    getNodeColor(d) {
        const colors = {
            1: "#d62728", // Major - Red
            2: "#ff7f0e", // Supporting - Orange  
            3: "#2ca02c", // Minor - Green
            4: "#1f77b4"  // Background - Blue
        };
        return colors[d.group] || "#1f77b4";
    }
    
    createDragBehavior() {
        return d3.drag()
            .on("start", (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.1);
                d.fx = null;
                d.fy = null;
            });
    }
    
    tick() {
        if (this.linkElements) {
            this.linkElements
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
        }
        
        if (this.nodeElements) {
            this.nodeElements
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }
        
        if (this.labelElements && this.showLabels) {
            this.labelElements
                .attr("x", d => d.x)
                .attr("y", d => d.y + 4);
        }
    }
    
    onNodeClick(event, d) {
        event.stopPropagation();
        this.selectNode(d);
        /*
        // Show character detail modal
        if (typeof openCharacterModal === 'function') {
            openCharacterModal(d.name);
        }*/
    }
    
    onNodeHover(event, d) {
        this.highlightConnectedNodes(d);
        this.showNodeTooltip(event, d);
    }
    
    onNodeUnhover(event, d) {
        this.clearHighlight();
        this.hideTooltip();
    }
    
    showNodeTooltip(event, d) {
        const connections = this.getNodeConnections(d);
        const totalLines = this.getTotalSpeakingLines();
        const linePercentage = totalLines > 0 ? ((d.lineCount / totalLines) * 100).toFixed(1) : 0;
        
        this.tooltip
            .style("visibility", "visible")
            .html(`
                <strong>${d.name}</strong><br>
                Scenes: ${d.sceneCount}<br>
                Lines: ${d.lineCount} (${linePercentage}%)<br>
                Connections: ${connections.length}<br>
                Group: ${this.getGroupName(d.group)}
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }
    
    showLinkTooltip(event, d) {
        this.tooltip
            .style("visibility", "visible")
            .html(`
                <strong>${d.source.name}</strong> ↔ <strong>${d.target.name}</strong><br>
                Shared scenes: ${d.value}<br>
                ${d.sharedScenes.join(', ')}
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }
    
    hideTooltip() {
        this.tooltip.style("visibility", "hidden");
    }
    
    getGroupName(group) {
        const names = {
            1: "Major Character",
            2: "Supporting Character", 
            3: "Minor Character",
            4: "Background Character"
        };
        return names[group] || "Unknown";
    }
    
    selectNode(d) {
        const connections = this.getNodeConnections(d);
        const connectedNames = connections.map(c => c.name).join(', ') || 'None';
        const totalLines = this.getTotalSpeakingLines();
        const linePercentage = totalLines > 0 ? ((d.lineCount / totalLines) * 100).toFixed(1) : 0;
        
        const selectedCharacterInfo = document.getElementById('selectedCharacterInfo');
        if (selectedCharacterInfo) {
            selectedCharacterInfo.innerHTML = `
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <p class="h4 mb-0">${d.name}</p>
                    <button class="btn btn-primary btn-sm" onclick="openCharacterModal('${d.name.replace(/'/g, "\\'")}')">
                        View More Details
                    </button>
                </div>
                <p><strong>Type:</strong> ${this.getGroupName(d.group)}</p>
                <p><strong>Scenes:</strong> ${d.sceneCount}</p>
                <p><strong>Lines:</strong> ${d.lineCount} (${linePercentage}% of dialogue)</p>
                <p><strong>Connections:</strong> ${connections.length}</p>
                <p><strong>Connected to:</strong> ${connectedNames}</p>
            `;
        }
    }
    
    getNodeConnections(node) {
        const connections = [];
        this.links.forEach(link => {
            if (link.source.id === node.id) {
                connections.push(link.target);
            } else if (link.target.id === node.id) {
                connections.push(link.source);
            }
        });
        return connections;
    }
    
    highlightConnectedNodes(d) {
        const connectedIds = new Set([d.id]);
        
        // Find all connected nodes
        this.links.forEach(link => {
            if (link.source.id === d.id) {
                connectedIds.add(link.target.id);
            } else if (link.target.id === d.id) {
                connectedIds.add(link.source.id);
            }
        });
        
        // Highlight nodes
        this.nodeElements
            .style("opacity", node => connectedIds.has(node.id) ? 1 : 0.3)
            .style("stroke-width", node => connectedIds.has(node.id) ? 3 : 2);
        
        // Highlight links
        this.linkElements
            .style("opacity", link => 
                (link.source.id === d.id || link.target.id === d.id) ? 1 : 0.1)
            .style("stroke-width", link => 
                (link.source.id === d.id || link.target.id === d.id) ? 
                Math.max(2, Math.sqrt(link.value) * 3) : Math.sqrt(link.value) * 2);
        
        // Highlight labels
        if (this.labelElements) {
            this.labelElements
                .style("opacity", node => connectedIds.has(node.id) ? 1 : 0.3)
                .style("font-weight", node => connectedIds.has(node.id) ? "bold" : "normal");
        }
    }
    
    clearHighlight() {
        if (this.nodeElements) {
            this.nodeElements
                .style("opacity", 1)
                .style("stroke-width", 2);
        }
        
        if (this.linkElements) {
            this.linkElements
                .style("opacity", 0.6)
                .style("stroke-width", d => Math.max(1, Math.sqrt(d.value) * 2));
        }
        
        if (this.labelElements) {
            this.labelElements
                .style("opacity", 1)
                .style("font-weight", "500");
        }
    }
    
    clearSelection() {
        this.clearHighlight();
        const selectedCharacterInfo = document.getElementById('selectedCharacterInfo');
        if (selectedCharacterInfo) {
            selectedCharacterInfo.innerHTML = 
                '<p class="text-muted">Click on a character node to see details</p>';
        }
    }
    
    toggleLabels() {
        this.showLabels = !this.showLabels;
        if (this.labelElements) {
            this.labelElements.style("display", this.showLabels ? "block" : "none");
        }
    }
    
    adjustNodeSize(scale = 1) {
        this.nodeScale = Math.max(0.5, Math.min(2, scale));
        if (this.nodeElements) {
            this.nodeElements.attr("r", d => d.radius * this.nodeScale);
        }
        if (this.simulation) {
            this.simulation.force("collision").radius(d => (d.radius * this.nodeScale) + 5);
            this.simulation.alpha(0.3).restart();
        }
    }
    
    resetView() {
        console.log("resetView called, svg:", this.svg, "zoom:", this.zoom);
        if (this.svg && this.zoom) {
            console.log("Applying zoom reset");
            this.svg.transition().duration(750)
                .call(this.zoom.transform, d3.zoomIdentity);
        } else {
            console.warn("SVG or zoom not available for reset");
        }
        this.clearSelection();
    }
    
    updateStatistics() {
        const characterCountEl = document.getElementById('characterCount');
        const connectionCountEl = document.getElementById('connectionCount');
        const sceneCountEl = document.getElementById('sceneCount');
        
        if (characterCountEl) characterCountEl.textContent = this.nodes.length;
        if (connectionCountEl) connectionCountEl.textContent = this.links.length;
        
        // Calculate unique scenes
        const allScenes = new Set();
        this.nodes.forEach(node => {
            node.scenes.forEach(scene => allScenes.add(scene));
        });
        if (sceneCountEl) sceneCountEl.textContent = allScenes.size;
    }
}

// Global network instance
let characterNetworkInstance = null;

// Initialize network when DOM is ready and data is available
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('networkVisualization')) {
        initializeCharacterNetworkD3();
    }
});

function initializeCharacterNetworkD3() {
    if (typeof dd_characters !== 'undefined' && dd_characters.length > 0) {
        characterNetworkInstance = new CharacterNetworkD3('networkVisualization');
    } else {
        // Wait for session data to load
        setTimeout(initializeCharacterNetworkD3, 1000);
    }
}

// Global control functions
function resetNetworkView() {
    console.log("resetNetworkView called, characterNetworkInstance:", characterNetworkInstance);
    if (characterNetworkInstance) {
        characterNetworkInstance.resetView();
    } else {
        console.warn("No characterNetworkInstance available");
    }
}

function toggleLabels() {
    if (characterNetworkInstance) {
        characterNetworkInstance.toggleLabels();
    }
}

function adjustNodeSize() {
    if (characterNetworkInstance) {
        const scale = prompt("Enter node size scale (0.5 - 2.0):", characterNetworkInstance.nodeScale);
        if (scale && !isNaN(scale)) {
            characterNetworkInstance.adjustNodeSize(parseFloat(scale));
        }
    }
}
