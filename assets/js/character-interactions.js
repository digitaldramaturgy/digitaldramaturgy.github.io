/* Character Interactions JavaScript
 * Handles character card interactions and character detail functionality
 * Integrates with CollectionBuilder session storage system
 */

// Character interactions and utilities
const CharacterInteractions = {
    // Character data cache
    charactersData: [],
    csvCharacterData: new Map(),
    
    // Initialize when DOM is ready
    init: function() {
        this.loadCharacterData();
        this.setupEventListeners();
        this.loadCharacterCSVData();
    },
    
    // Load character data from session storage
    loadCharacterData: function() {
        if (typeof dd_characters !== 'undefined' && dd_characters.length > 0) {
            this.charactersData = dd_characters;
            console.log(`Loaded ${this.charactersData.length} characters from session storage`);
        } else {
            console.warn('No character data available in session storage');
            // Retry after a delay
            setTimeout(() => this.loadCharacterData(), 1000);
        }
    },
    
    // Setup global event listeners
    setupEventListeners: function() {
        // Handle character card clicks
        document.addEventListener('click', (event) => {
            if (event.target.closest('.character-card')) {
                const characterName = event.target.closest('.character-card').dataset.character;
                if (characterName) {
                    this.showCharacterDetail(characterName);
                }
            }
        });
        
        // Handle search functionality
        const searchInput = document.getElementById('characterFilterInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(() => {
                this.filterCharacters();
            }, 300));
        }
    },
    
    // Load character data from CSV (if available)
    loadCharacterCSVData: function() {
        // Check if Papa Parse is available for CSV parsing
        if (typeof Papa !== 'undefined') {
            // Try to load from Jekyll data first, fallback to CSV file
            if (typeof window.characterCSVData !== 'undefined' && window.characterCSVData.length > 0) {
                window.characterCSVData.forEach(row => {
                    if (row.character) {
                        this.csvCharacterData.set(row.character, {
                            description: row.description || '',
                            image: row.image || '',
                            notes: row.notes || ''
                        });
                    }
                });
                console.log(`Loaded CSV data for ${this.csvCharacterData.size} characters from Jekyll data`);
                return;
            }
            
            // Fallback to CSV file loading - adjust path as needed
            const csvUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '')}/assets/data/characters.csv`;
            
            Papa.parse(csvUrl, {
                download: true,
                header: true,
                complete: (results) => {
                    results.data.forEach(row => {
                        if (row.character) {
                            this.csvCharacterData.set(row.character, {
                                description: row.description || '',
                                image: row.image || '',
                                notes: row.notes || ''
                            });
                        }
                    });
                    console.log(`Loaded CSV data for ${this.csvCharacterData.size} characters from CSV file`);
                },
                error: (error) => {
                    console.log('CSV file not available, using Jekyll data only:', error);
                }
            });
        } else {
            console.log('Papa Parse not available, using Jekyll data only');
        }
    },
    
    // Get character data by name
    getCharacterData: function(characterName) {
        return this.charactersData.find(char => char.name === characterName);
    },
    
    // Get CSV data for character
    getCharacterCSVData: function(characterName) {
        return this.csvCharacterData.get(characterName) || null;
    },
    
    // Calculate character connections
    calculateCharacterConnections: function(character) {
        const connections = [];
        const characterScenes = character.scenesList || [];
        
        this.charactersData.forEach(otherCharacter => {
            if (otherCharacter.name === character.name) return;
            
            const otherScenes = otherCharacter.scenesList || [];
            const sharedScenes = characterScenes.filter(scene => otherScenes.includes(scene));
            
            if (sharedScenes.length > 0) {
                connections.push({
                    character: otherCharacter.name,
                    sharedScenes: sharedScenes,
                    connectionStrength: sharedScenes.length
                });
            }
        });
        
        return connections.sort((a, b) => b.connectionStrength - a.connectionStrength);
    },
    
    // Show character detail modal
    showCharacterDetail: function(characterName) {
        const character = this.getCharacterData(characterName);
        if (!character) {
            console.error('Character not found:', characterName);
            return;
        }
        
        const csvData = this.getCharacterCSVData(characterName);
        const connections = this.calculateCharacterConnections(character);
        const sceneAnalysis = this.analyzeCharacterScenes(character);
        
        this.populateCharacterModal(character, csvData, connections, sceneAnalysis);
        this.showModal();
    },
    
    // Analyze character scenes
    analyzeCharacterScenes: function(character) {
        const scenes = character.scenesList || [];
        const acts = [...new Set(scenes.map(scene => scene.split('.')[0]))].sort();
        
        let sceneRange = 'N/A';
        if (scenes.length > 0) {
            const sortedScenes = scenes.sort((a, b) => {
                const [actA, sceneA] = a.split('.').map(Number);
                const [actB, sceneB] = b.split('.').map(Number);
                if (actA !== actB) return actA - actB;
                return sceneA - sceneB;
            });
            
            sceneRange = scenes.length === 1 ? 
                sortedScenes[0] : 
                `${sortedScenes[0]} - ${sortedScenes[sortedScenes.length - 1]}`;
        }
        
        return {
            acts: acts,
            sceneRange: sceneRange,
            totalScenes: scenes.length
        };
    },
    
    // Populate character modal with data
    populateCharacterModal: function(character, csvData, connections, sceneAnalysis) {
        const modalTitle = document.getElementById('characterDetailModalLabel');
        const modalContent = document.getElementById('characterDetailContent');
        
        if (modalTitle) {
            modalTitle.textContent = character.name;
        }
        
        if (modalContent) {
            modalContent.innerHTML = this.generateCharacterDetailHTML(
                character, csvData, connections, sceneAnalysis
            );
        }
    },
    
    // Generate HTML for character detail modal
    generateCharacterDetailHTML: function(character, csvData, connections, sceneAnalysis) {
        const hasImage = csvData && csvData.image;
        const hasDescription = csvData && csvData.description;
        const hasNotes = csvData && csvData.notes;

        // Calculate line count and percentage
        const lineCount = this.calculateLineCount(character.name);
        const totalLines = this.getTotalSpeakingLines();
        const linePercentage = totalLines > 0 ? ((lineCount / totalLines) * 100).toFixed(1) : 0;

        return `
            <!-- Title Page Style -->
            <div class="character-info-header">
                <h2>${character.name}</h2>
                <p class="character-info-subtitle">A Character of the Play</p>
            </div>

            <div class="ornamental-divider">❦</div>

            <!-- Statistics Section -->
            <div class="character-info-section">
                <h3>Character Statistics</h3>
                <ul class="character-stat-list">
                    <li><span class="character-stat-label">Total Scenes</span> ${character.scenesList ? character.scenesList.length : 0} scene${character.scenesList && character.scenesList.length !== 1 ? 's' : ''}</li>
                    <li><span class="character-stat-label">Speaking Lines</span> ${lineCount} lines (${linePercentage}% of the play)</li>
                    <li><span class="character-stat-label">Character Connections</span> ${connections.length} character${connections.length !== 1 ? 's' : ''}</li>
                    <li><span class="character-stat-label">Acts Appeared</span> ${sceneAnalysis.acts.map(a => 'Act ' + a).join(', ') || 'None'}</li>
                    <li><span class="character-stat-label">Scene Range</span> ${sceneAnalysis.sceneRange}</li>
                </ul>
            </div>

            ${hasDescription ? `
                <div class="ornamental-divider">❦</div>
                <div class="character-info-section">
                    <h3>Description</h3>
                    <p style="font-family: 'Garamond', 'Georgia', serif; font-size: 1.1rem; line-height: 1.8; text-align: justify;">
                        ${csvData.description}
                    </p>
                </div>
            ` : ''}

            <div class="ornamental-divider">❦</div>

            <!-- Scene Appearances -->
            <div class="character-info-section">
                <h3>Scene Appearances</h3>
                <div style="line-height: 2;">
                    ${this.generateSceneLinks(character.scenesList || [])}
                </div>
            </div>

            <div class="ornamental-divider">❦</div>

            <!-- Character Connections -->
            <div class="character-info-section">
                <h3>Character Connections</h3>
                ${this.generateConnectionsText(connections)}
            </div>

            ${hasNotes ? `
                <div class="ornamental-divider">❦</div>
                <div class="character-info-section">
                    <h3>Notes</h3>
                    <p style="font-family: 'Garamond', 'Georgia', serif; font-size: 1rem; line-height: 1.8; text-align: justify;">
                        ${csvData.notes}
                    </p>
                </div>
            ` : ''}

            <div class="ornamental-divider">❦</div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <a href="/script.html?player=${character.name.replace(/\s+/g, '')}" class="btn-1600s" style="text-decoration: none;">
                    View Lines in Script
                </a>
            </div>
        `;
    },
    
    // Generate scene links HTML
    generateSceneLinks: function(scenes) {
        if (!scenes || scenes.length === 0) {
            return '<p style="font-family: \'Garamond\', \'Georgia\', serif; font-style: italic;">No scenes found</p>';
        }

        return scenes.map(scene => {
            const [act, sceneNum] = scene.split('.');
            const sceneClass = `act${act}scene${sceneNum}`;
            return `<a href="/script.html?scene=${sceneClass}" class="scene-link">Act ${act}, Scene ${sceneNum}</a>`;
        }).join('\n');
    },

    // Generate scene grid HTML (kept for backward compatibility)
    generateSceneGrid: function(scenes) {
        if (!scenes || scenes.length === 0) {
            return '<div class="col-12"><p class="text-muted">No scenes found</p></div>';
        }

        return scenes.map(scene =>
            `<div class="col-auto mb-2">
                <span class="badge bg-primary">${scene}</span>
            </div>`
        ).join('');
    },
    
    // Generate connections text (1600s style)
    generateConnectionsText: function(connections) {
        if (!connections || connections.length === 0) {
            return '<p style="font-family: \'Garamond\', \'Georgia\', serif; font-style: italic;">No connections found</p>';
        }

        const categorized = this.categorizeConnections(connections);
        let html = '';

        if (categorized.strong.length > 0) {
            html += `
                <div class="mb-4">
                    <h4 style="font-family: 'Garamond', 'Georgia', serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">Strong Connections</h4>
                    <p style="font-family: 'Garamond', 'Georgia', serif; font-size: 1rem; line-height: 1.8; text-align: justify;">
                        ${categorized.strong.map(conn =>
                            `<strong>${conn.character}</strong> (${conn.connectionStrength} shared scene${conn.connectionStrength !== 1 ? 's' : ''}: ${conn.sharedScenes.map(s => {
                                const [act, sceneNum] = s.split('.');
                                return `<a href="/script.html?scene=act${act}scene${sceneNum}" class="scene-link" style="font-size: 0.85rem;">${s}</a>`;
                            }).join(', ')})`
                        ).join('; ')}
                    </p>
                </div>
            `;
        }

        if (categorized.medium.length > 0) {
            html += `
                <div class="mb-4">
                    <h4 style="font-family: 'Garamond', 'Georgia', serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">Medium Connections</h4>
                    <p style="font-family: 'Garamond', 'Georgia', serif; font-size: 1rem; line-height: 1.8; text-align: justify;">
                        ${categorized.medium.map(conn =>
                            `<strong>${conn.character}</strong> (${conn.sharedScenes.map(s => {
                                const [act, sceneNum] = s.split('.');
                                return `<a href="/script.html?scene=act${act}scene${sceneNum}" class="scene-link" style="font-size: 0.85rem;">${s}</a>`;
                            }).join(', ')})`
                        ).join('; ')}
                    </p>
                </div>
            `;
        }

        if (categorized.weak.length > 0) {
            html += `
                <div class="mb-4">
                    <h4 style="font-family: 'Garamond', 'Georgia', serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">Weak Connections</h4>
                    <p style="font-family: 'Garamond', 'Georgia', serif; font-size: 1rem; line-height: 1.8;">
                        ${categorized.weak.map(conn => {
                            const [act, sceneNum] = conn.sharedScenes[0].split('.');
                            return `<strong>${conn.character}</strong> (<a href="/script.html?scene=act${act}scene${sceneNum}" class="scene-link" style="font-size: 0.85rem;">${conn.sharedScenes[0]}</a>)`;
                        }).join('; ')}
                    </p>
                </div>
            `;
        }

        return html;
    },

    // Generate connections HTML (kept for backward compatibility)
    generateConnectionsHTML: function(connections) {
        if (!connections || connections.length === 0) {
            return '<p class="text-muted">No connections found</p>';
        }

        const categorized = this.categorizeConnections(connections);
        let html = '';

        ['strong', 'medium', 'weak'].forEach(type => {
            if (categorized[type].length > 0) {
                const badgeClass = type === 'strong' ? 'success' : type === 'medium' ? 'warning' : 'secondary';
                const label = type === 'strong' ? 'Strong Connections (3+ scenes)' :
                             type === 'medium' ? 'Medium Connections (2 scenes)' :
                             'Weak Connections (1 scene)';

                html += `
                    <div class="mb-3">
                        <h6 class="text-${badgeClass}">${label}</h6>
                        <div class="row">
                            ${categorized[type].map(conn =>
                                `<div class="col-md-6 mb-2">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span><strong>${conn.character}</strong></span>
                                        <span class="badge bg-${badgeClass}">${conn.connectionStrength}</span>
                                    </div>
                                    <small class="text-muted">Scenes: ${conn.sharedScenes.join(', ')}</small>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }
        });

        return html;
    },
    
    // Categorize connections by strength
    categorizeConnections: function(connections) {
        return {
            strong: connections.filter(c => c.connectionStrength >= 3),
            medium: connections.filter(c => c.connectionStrength === 2),
            weak: connections.filter(c => c.connectionStrength === 1)
        };
    },
    
    // Show modal using Bootstrap
    showModal: function() {
        const modalElement = document.getElementById('characterDetailModal');
        if (modalElement && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    },
    
    // Filter characters (for use with character cards)
    filterCharacters: function() {
        // This function can be called from character cards
        const input = document.getElementById('characterFilterInput');
        if (input && typeof filterCharacters === 'function') {
            filterCharacters();
        }
    },
    
    // Calculate line count for a character
    calculateLineCount: function(characterName) {
        // Check if dd_items is available
        if (typeof dd_items === 'undefined' || dd_items.length === 0) {
            return 0;
        }

        return dd_items.filter(item =>
            item.player &&
            item.player.trim() === characterName &&
            item.player.trim() !== 'StageDirection'
        ).length;
    },

    // Get total speaking lines in the play
    getTotalSpeakingLines: function() {
        if (typeof dd_items === 'undefined' || dd_items.length === 0) {
            return 1; // Avoid division by zero
        }

        return dd_items.filter(item =>
            item.player &&
            item.player.trim() !== '' &&
            item.player.trim() !== 'StageDirection'
        ).length;
    },

    // Get character statistics
    getCharacterStatistics: function() {
        const stats = {
            totalCharacters: this.charactersData.length,
            totalConnections: 0,
            averageScenes: 0,
            charactersByType: { major: 0, supporting: 0, minor: 0, background: 0 }
        };
        
        let totalScenes = 0;
        
        this.charactersData.forEach(character => {
            const sceneCount = character.scenesList ? character.scenesList.length : 0;
            totalScenes += sceneCount;
            
            // Calculate connections for this character
            const connections = this.calculateCharacterConnections(character);
            stats.totalConnections += connections.length;
            
            // Categorize character
            if (sceneCount >= 15) stats.charactersByType.major++;
            else if (sceneCount >= 8) stats.charactersByType.supporting++;
            else if (sceneCount >= 3) stats.charactersByType.minor++;
            else stats.charactersByType.background++;
        });
        
        stats.averageScenes = stats.totalCharacters > 0 ? 
            (totalScenes / stats.totalCharacters).toFixed(1) : 0;
        
        // Divide by 2 since each connection is counted twice
        stats.totalConnections = stats.totalConnections / 2;
        
        return stats;
    }
};

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Global function for opening character modal (used by other components)
function openCharacterModal(characterName) {
    CharacterInteractions.showCharacterDetail(characterName);
}

// Global function for showing character detail (used by character cards)
function showCharacterDetail(characterName) {
    CharacterInteractions.showCharacterDetail(characterName);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    CharacterInteractions.init();
});

// Export for use in other modules
window.CharacterInteractions = CharacterInteractions;
window.openCharacterModal = openCharacterModal;
