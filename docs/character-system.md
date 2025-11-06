# Character System Documentation

## Overview

The Character System is a comprehensive feature that extends CollectionBuilder's visualization capabilities to provide interactive character exploration and network analysis for dramatic works. It integrates with the existing session storage system and provides multiple views of character data.

## Features

### 1. Character Cards (`/characters.html`)
- Interactive grid display of all characters
- Search and filter functionality
- Character statistics and scene count
- Click-through to detailed character information

### 2. Character Network Visualization (`/character-network.html`)
- Interactive D3.js network graph showing character relationships
- Nodes sized by scene appearances
- Connections based on shared scenes
- Zoom, pan, and drag interactions
- Real-time statistics display

### 3. Character Connections
- List view of character relationships
- Categorized by connection strength (strong, medium, weak)
- Shared scene information
- Filterable by connection type

### 4. Character Detail Modals
- Comprehensive character information
- Scene appearances breakdown
- Connection analysis
- Integration with CSV character data

## Data Integration

### Session Storage Integration
The character system reads from the `dd_characters_store` array created by the session constants system. This ensures compatibility with any CSV loaded through the existing play loading mechanism.

### Characters.csv Support
Additional character information can be provided through `_data/characters.csv`:
```csv
character,description,image,notes
"Character Name","Character description","path/to/image.jpg","Additional notes"
```

### Character Data Structure
Characters are processed from the main CSV with the following structure:
```javascript
{
    name: "Character Name",
    scenes: ["1.1", "1.2", "2.1"], // Array of scene appearances
    scenesList: ["1.1", "1.2", "2.1"], // Duplicate for compatibility
    scenesString: "1.1;1.2;2.1", // Semicolon-separated string
    connections: [...], // Calculated connections
    connectionCount: 3 // Number of connections
}
```

## File Structure

```
_layouts/
├── character-network.html          # Network visualization layout

_includes/feature/
├── character-cards.html            # Character card grid
├── character-network.html          # D3.js network graph
├── character-connections.html      # Connection list view
└── character-detail.html          # Character detail modal

_includes/js/
├── character-csv-data.html         # Jekyll data loader
├── character-network-js.html       # Network page scripts
└── character-interactions-js.html  # Character page scripts

pages/
├── characters.md                   # Character list page
└── character-network.md           # Network visualization page

assets/js/
├── character-network.js           # D3.js network implementation
└── character-interactions.js      # Character interaction utilities
```

## Usage

### Basic Setup
1. Load a CSV file with character data through the existing session system
2. Navigate to `/characters.html` or `/character-network.html`
3. The system automatically processes character relationships

### Adding Character Images and Descriptions
1. Create or update `_data/characters.csv`
2. Add character information matching names from your main CSV
3. Place images in the `objects/` directory
4. Reference images with relative paths in the CSV

### Customizing the Network Visualization
The network visualization can be customized through various parameters:
- Node size scaling
- Connection strength thresholds
- Color schemes
- Layout forces

### Keyboard Shortcuts (Network Page)
- `R` - Reset network view
- `L` - Toggle character labels
- `H` - Show help modal

## API Reference

### JavaScript Functions

#### Character Data Access
```javascript
// Get character data
CharacterInteractions.getCharacterData(characterName)

// Get CSV character data
CharacterInteractions.getCharacterCSVData(characterName)

// Calculate connections
CharacterInteractions.calculateCharacterConnections(character)
```

#### Network Controls
```javascript
// Reset network view
resetNetworkView()

// Toggle labels
toggleLabels()

// Adjust node size
adjustNodeSize(scale)

// Show character modal
openCharacterModal(characterName)
```

#### Character Statistics
```javascript
// Get comprehensive statistics
CharacterInteractions.getCharacterStatistics()
```

## Integration with CollectionBuilder

The character system is designed to seamlessly integrate with CollectionBuilder's existing architecture:

- Uses the same Bootstrap CSS framework
- Follows CollectionBuilder's file organization patterns
- Integrates with the session storage system
- Maintains responsive design principles
- Uses Jekyll's data loading mechanisms

## Dependencies

- **D3.js v7** - For network visualization
- **Bootstrap 5** - For UI components and responsive layout
- **Papa Parse** - For CSV processing (inherited from CollectionBuilder)
- **Jekyll** - For data processing and template rendering

## Browser Support

The character system supports modern browsers with the following features:
- ES6+ JavaScript support
- SVG rendering capabilities
- CSS Grid and Flexbox support
- WebGL (optional, for enhanced performance)

## Performance Considerations

- Network visualization is optimized for up to 100 characters
- Large datasets may require performance tuning
- Mobile devices use simplified interactions
- Lazy loading for character images

## Troubleshooting

### No Character Data Available
- Ensure a CSV file is loaded through the session system
- Check that the CSV contains 'player' and 'scene' columns
- Verify that `dd_characters` array is populated

### Network Not Displaying
- Check browser console for JavaScript errors
- Ensure D3.js library is loaded
- Verify SVG container is properly initialized

### Images Not Loading
- Check image paths in `characters.csv`
- Ensure images exist in the `objects/` directory
- Verify Jekyll site configuration for asset handling

## Future Enhancements

Potential improvements and extensions:
- Timeline visualization of character appearances
- Character relationship strength metrics
- Export functionality for network data
- Advanced filtering and search capabilities
- Character group/faction analysis
- Integration with script annotation system
