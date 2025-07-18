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
        
        return `
            <div class="row">
                <div class="col-md-4">
                    ${hasImage ? `
                        <img src="${csvData.image}" class="img-fluid rounded mb-3" alt="${character.name}">
                    ` : `
                        <div class="bg-light rounded p-4 text-center mb-3">
                            <i class="fas fa-user fa-4x text-muted"></i>
                            <p class="mt-2 text-muted">No image available</p>
                        </div>
                    `}
                    
                    <div class="card">
                        <div class="card-header">
                            <h6>Character Statistics</h6>
                        </div>
                        <div class="card-body">
                            <p><strong>Total Scenes:</strong> ${character.scenesList ? character.scenesList.length : 0}</p>
                            <p><strong>Total Connections:</strong> ${connections.length}</p>
                            <p><strong>Acts Appeared:</strong> ${sceneAnalysis.acts.join(', ') || 'None'}</p>
                            <p><strong>Scene Range:</strong> ${sceneAnalysis.sceneRange}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-8">
                    ${hasDescription ? `
                        <div class="card mb-3">
                            <div class="card-header">
                                <h6>Description</h6>
                            </div>
                            <div class="card-body">
                                <p>${csvData.description}</p>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="card mb-3">
                        <div class="card-header">
                            <h6>Scene Appearances</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                ${this.generateSceneGrid(character.scenesList || [])}
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mb-3">
                        <div class="card-header">
                            <h6>Character Connections</h6>
                        </div>
                        <div class="card-body">
                            ${this.generateConnectionsHTML(connections)}
                        </div>
                    </div>
                    
                    ${hasNotes ? `
                        <div class="card">
                            <div class="card-header">
                                <h6>Notes</h6>
                            </div>
                            <div class="card-body">
                                <p>${csvData.notes}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    // Generate scene grid HTML
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
    
    // Generate connections HTML
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
