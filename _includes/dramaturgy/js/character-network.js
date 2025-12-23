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
        // Use Bootstrap theme colors that can be controlled via config-theme-colors.csv
        const colorMap = {
            1: 'primary',    // Major characters - Bootstrap primary
            2: 'success',    // Supporting characters - Bootstrap success
            3: 'info',       // Minor characters - Bootstrap info
            4: 'secondary'   // Background characters - Bootstrap secondary
        };

        const colorClass = colorMap[d.group] || 'secondary';

        // Get color from a hidden element with Bootstrap bg class
        // This reads the actual color set in config-theme-colors.csv
        if (!this.colorCache) {
            this.colorCache = {};
        }

        if (!this.colorCache[colorClass]) {
            // Create temporary element to read the color
            const tempEl = document.createElement('div');
            tempEl.className = `bg-${colorClass}`;
            tempEl.style.display = 'none';
            document.body.appendChild(tempEl);

            const bgColor = getComputedStyle(tempEl).backgroundColor;
            document.body.removeChild(tempEl);

            this.colorCache[colorClass] = bgColor;
        }

        return this.colorCache[colorClass];
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
        // Clear any existing highlight first, then select
        this.clearHighlight();
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
        const categorizedConnections = this.categorizeConnections(connections, d);
        const totalLines = this.getTotalSpeakingLines();
        const linePercentage = totalLines > 0 ? ((d.lineCount / totalLines) * 100).toFixed(1) : 0;

        // Get CSV data if available
        const csvData = this.getCharacterCSVData(d.name);

        // Highlight in network and zoom to node
        this.highlightConnectedNodes(d);
        this.scrollToNode(d);

        // Build featured character content
        const featuredView = document.getElementById('featuredCharacterView');
        if (featuredView) {
            // Generate scene links
            const sceneLinks = d.scenes.map(scene => {
                const [act, sceneNum] = scene.split('.');
                const sceneClass = `act${act}scene${sceneNum}`;
                return `<a href="/script.html?scene=${sceneClass}" class="scene-link">Act ${act}, Scene ${sceneNum}</a>`;
            }).join(' ');

            // Generate connection lists
            const strongList = categorizedConnections.strong.map(c => c.name).join(', ') || 'None';
            const mediumList = categorizedConnections.medium.map(c => c.name).join(', ') || 'None';
            const weakList = categorizedConnections.weak.map(c => c.name).join(', ') || 'None';

            // Build image section if CSV data available
            let imageSection = '';
            if (csvData && csvData.image && csvData.image.trim() !== '') {
                imageSection = `
                    <div class="mb-3 text-center">
                        <img src="${csvData.image}" alt="image of ${d.name}" style="max-width: 200px; border: 1px solid #dee2e6; border-radius: 4px;">
                    </div>
                `;
            }

            // Build character name and description separately
            let characterNameUpper = d.name.toUpperCase();
            let descriptionLine = '';
            if (csvData && csvData.description && csvData.description.trim() !== '') {
                descriptionLine = `<p class="mb-0">${csvData.description}</p>`;
            }

            featuredView.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <a href="javascript:void(0)" class="back-to-list btn-sm btn btn-outline-primary" onclick="characterNetworkInstance.showCharacterList()">
                        <svg class="bi icon-sprite" aria-hidden="true"><use xlink:href="/assets/lib/icons/bootstrap-icons.svg#arrow-left" href="/assets/lib/icons/bootstrap-icons.svg#arrow-left"></use></svg> Back to list
                    </a>
                    <a href="/script.html?player=${d.name.replace(/\s+/g, '')}" class="btn btn-sm btn-primary">
                        View all Lines
                    </a>
                </div>

                ${imageSection}

                <div class="character-info-header">
                    <h2>${characterNameUpper}</h2>
                    ${descriptionLine}
                    <p class="character-info-subtitle">${this.getGroupName(d.group)}</p>
                </div>

                <div class="character-info-section">
                    <ul class="character-stat-list">
                        <li><span class="character-stat-label">Speaking Lines:</span> ${d.lineCount} (${linePercentage}% of dialogue)</li>
                        <li><span class="character-stat-label">Total Connections:</span> ${connections.length} character${connections.length !== 1 ? 's' : ''}</li>
                        <li><span class="character-stat-label">Scene Appearances:</span> ${d.sceneCount}</li>
                    </ul>
                </div>

                <div class="character-info-section">
                    <h3>Scene Appearances</h3>
                    <div style="line-height: 2;">
                        ${sceneLinks || '<p class="text-muted small">No scenes found</p>'}
                    </div>
                </div>

                <div class="character-info-section">
                    <h3>
                        Connections
                        <svg class="bi icon-sprite info-icon" data-bs-toggle="modal" data-bs-target="#connectionInfoModal" title="What do these mean?" role="img" aria-label="What do these mean?"><use xlink:href="/assets/lib/icons/bootstrap-icons.svg#info-circle" href="/assets/lib/icons/bootstrap-icons.svg#info-circle"></use></svg>
                    </h3>
                    <div class="connection-list">
                        <div class="connection-category">
                            <div class="connection-category-title">Strong (3+ scenes):</div>
                            <div>${strongList}</div>
                        </div>
                        <div class="connection-category">
                            <div class="connection-category-title">Medium (2 scenes):</div>
                            <div>${mediumList}</div>
                        </div>
                        <div class="connection-category">
                            <div class="connection-category-title">Weak (1 scene):</div>
                            <div>${weakList}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Show featured character view with transition
        this.showFeaturedCharacter();
    }

    categorizeConnections(connections, sourceNode) {
        const categorized = {
            strong: [],
            medium: [],
            weak: []
        };

        connections.forEach(conn => {
            // Find the link between sourceNode and conn
            const link = this.links.find(l =>
                (l.source.id === sourceNode.id && l.target.id === conn.id) ||
                (l.target.id === sourceNode.id && l.source.id === conn.id)
            );

            const strength = link ? link.value : 0;

            if (strength >= 3) {
                categorized.strong.push(conn);
            } else if (strength === 2) {
                categorized.medium.push(conn);
            } else if (strength === 1) {
                categorized.weak.push(conn);
            }
        });

        return categorized;
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
        this.showCharacterList();
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

        // Populate character list
        this.populateCharacterList();
    }

    getCharacterCSVData(characterName) {
        if (typeof window.characterCSVData === 'undefined' || !window.characterCSVData.length) {
            return null;
        }

        // Only return CSV data if this character actually exists in our network nodes
        const nodeExists = this.nodes.find(n => n.name === characterName);
        if (!nodeExists) {
            return null;
        }

        const nodeName = characterName.trim().toLowerCase();

        // Find matching character with multiple strategies
        const match = window.characterCSVData.find(csv => {
            const csvName = csv.character.trim().toLowerCase();

            // Strategy 1: Exact match
            if (csvName === nodeName) {
                return true;
            }

            // Strategy 2: CSV name starts with node name (e.g., "Duke of Vienna" matches "Duke of Vienna, later...")
            if (csvName.startsWith(nodeName)) {
                return true;
            }

            // Strategy 3: Node name starts with CSV name (inverse)
            if (nodeName.startsWith(csvName)) {
                return true;
            }

            return false;
        });

        return match || null;
    }

    getCharacterDescription(node) {
        // Always generate data-driven description (not CSV description)
        const totalLines = this.getTotalSpeakingLines();
        const linePercentage = totalLines > 0 ? ((node.lineCount / totalLines) * 100).toFixed(1) : 0;
        const connections = this.getNodeConnections(node);

        let desc = `${this.getGroupName(node.group)}`;

        if (node.lineCount > 0) {
            desc += ` · ${node.lineCount} lines (${linePercentage}%)`;
        }

        if (node.sceneCount > 0) {
            desc += ` · ${node.sceneCount} scene${node.sceneCount !== 1 ? 's' : ''}`;
        }

        if (connections.length > 0) {
            desc += ` · ${connections.length} connection${connections.length !== 1 ? 's' : ''}`;
        }

        return desc;
    }

    populateCharacterList() {
        const container = document.getElementById('characterListView');
        if (!container) return;

        // Sort characters by importance (group, then line count)
        const sortedNodes = [...this.nodes].sort((a, b) => {
            if (a.group !== b.group) return a.group - b.group;
            return b.lineCount - a.lineCount;
        });

        // Clear container
        container.innerHTML = '';

        // Create character list items
        sortedNodes.forEach(node => {
            const characterItem = this.createCharacterListItem(node);
            container.appendChild(characterItem);
        });
    }

    createCharacterListItem(node) {
        const item = document.createElement('div');
        item.className = 'character-list-item';
        item.dataset.characterName = node.name;

        // Get CSV data if available
        const csvData = this.getCharacterCSVData(node.name);

        // Build content
        let content = '';

        // Add image if available from CSV
        if (csvData && csvData.image && csvData.image.trim() !== '') {
            content += `<img src="${csvData.image}" class="character-list-item-image" alt="${node.name}">`;
        }

        content += `<div class="character-list-item-content">`;

        // Add character name with CSV description if available
        let characterNameDisplay = node.name.toUpperCase();
        if (csvData && csvData.description && csvData.description.trim() !== '') {
            characterNameDisplay = `${node.name.toUpperCase()} - <span class="small">${csvData.description}</span>`;
        }
        content += `<div class="character-list-item-name">${characterNameDisplay}</div>`;

        // Add auto-generated overview (always use stats, not CSV description)
        const description = this.getCharacterDescription(node);
        if (description) {
            content += `<div class="character-list-item-meta">${description}</div>`;
        }

        content += `</div>`;

        item.innerHTML = content;

        // Add click handler
        item.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectCharacterFromList(node.name);
        });

        return item;
    }

    selectCharacterFromList(characterName) {
        // Find the node
        const node = this.nodes.find(n => n.name === characterName);
        if (!node) return;

        // Update visual selection in list
        document.querySelectorAll('.character-list-item').forEach(item => {
            item.classList.remove('active');
        });
        const selectedItem = document.querySelector(`[data-character-name="${characterName}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }

        // Select in network and show featured view
        this.selectNode(node);
    }

    showCharacterList() {
        const listView = document.getElementById('characterListView');
        const featuredView = document.getElementById('featuredCharacterView');

        if (!listView || !featuredView) return;

        // Remove any existing animation classes first to prevent conflicts
        featuredView.classList.remove('slide-out-right', 'slide-in-from-right');
        listView.classList.remove('slide-out-left', 'slide-in-from-left');

        // Hide featured view immediately
        featuredView.style.display = 'none';

        // Show list view immediately without animation conflicts
        listView.style.display = 'block';

        // Clear list selection
        document.querySelectorAll('.character-list-item').forEach(item => {
            item.classList.remove('active');
        });

        // Clear network highlight
        this.clearHighlight();
    }

    showFeaturedCharacter() {
        const listView = document.getElementById('characterListView');
        const featuredView = document.getElementById('featuredCharacterView');

        if (!listView || !featuredView) return;

        // Remove any existing animation classes first to prevent conflicts
        listView.classList.remove('slide-out-left', 'slide-in-from-left');
        featuredView.classList.remove('slide-out-right', 'slide-in-from-right');

        // Hide list view immediately
        listView.style.display = 'none';

        // Show featured view immediately without animation conflicts
        featuredView.style.display = 'block';
    }

    scrollToNode(node) {
        // Calculate transform to center the node
        const scale = 1.5;
        const translateX = this.options.width / 2 - node.x * scale;
        const translateY = this.options.height / 2 - node.y * scale;

        if (this.svg && this.zoom) {
            this.svg.transition().duration(750)
                .call(this.zoom.transform, d3.zoomIdentity
                    .translate(translateX, translateY)
                    .scale(scale));
        }
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
