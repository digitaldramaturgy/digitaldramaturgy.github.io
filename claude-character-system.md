## Task: Character System

**Command:** `claude-code create-character-system`

**Description:** Build character pages and network visualization extending CollectionBuilder's visualization and card systems.

Use existing papa-parse structures and local session storage as defined in _includes/dramaturgy/js/session-constants-js.html -- specifically the dd_characters_store array 
 
The visualization should be based solely on whether a character appears in the same scene or act with another character. 

**Files to Create:**

```
_layouts/
├── character-network.html          # Network visualization page


_includes/feature/
├── character-cards.html            # Grid of character cards
├── character-network.html          # D3.js network graph
└── character-connections.html      # Relationship list
└── character-detail.html          # Individual character modal that pops up when clicked showing connections specific to character

pages/
├── characters.md                   # Character list page
└── character-network.md           # Network visualization page

assets/js/
├── character-network.js           # D3.js network code
└── character-interactions.js      # Card interactions
```

**Key Features:**
- Interactive network visualization using D3.js
- Character card grid with search/filter
- Individual character detail modals
- Relationship mapping and connections
- Integration with script line references
- Mobile-responsive network visualization

**Data Integration:**
- Read from `characters.csv` and if present and character name matches character in dd_characters, use either of the other fields description, notes, or image in the modal
- Support character images and descriptions
- Link to script annotations
- Enable cross-referencing between characters
