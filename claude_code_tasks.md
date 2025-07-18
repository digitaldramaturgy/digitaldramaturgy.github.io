# Claude Code Tasks - CollectionBuilder Integration

## Task 1: Data Structure Setup

**Command:** `claude-code create-dramaturgy-data`

**Description:** Set up CSV data structures following CollectionBuilder conventions for the dramaturgical page types.

**Leverage CollectionBuilder patterns:**
- Follow existing metadata field naming conventions
- Use CollectionBuilder's CSV parsing patterns
- Include required fields for visualization features
- Support media embedding like existing collections

**Files to Create:**

```
_data/
├── productions.csv              # Production history
├── characters.csv               # Character information  
├── plot_events.csv             # Timeline events
├── themes.csv                  # Theme tags
└── character_relationships.csv  # Network connections
```

**Sample Data Structures:**

**productions.csv:**
```csv
objectid,date,title,author,adapter,key_personnel,reviews,importance,media_url,media_type,description
prod_001,1611,The Tempest,William Shakespeare,,John Shakespeare as Caliban,"'A most delightful comedy' - Court Records",First recorded performance,/assets/img/1611-court.jpg,image,The original court performance
prod_002,1667,The Tempest,William Shakespeare,John Dryden,Thomas Betterton as Prospero,"'Much improved' - Pepys Diary",Restoration adaptation,/assets/img/1667-drury.jpg,image,Dryden and Davenant adaptation
```

**characters.csv:**
```csv
objectid,name,description,character_type,first_appearance,connected_characters,image_url
char_001,Prospero,The rightful Duke of Milan practicing magic,protagonist,Act 1 Scene 1,"Miranda,Ariel,Caliban",/assets/img/prospero.jpg
char_002,Miranda,Prospero's daughter raised on the island,protagonist,Act 1 Scene 2,"Prospero,Ferdinand",/assets/img/miranda.jpg
char_003,Ariel,Air spirit bound to serve Prospero,spirit,Act 1 Scene 2,"Prospero,Caliban",/assets/img/ariel.jpg
```

**plot_events.csv:**
```csv
objectid,event_order,title,description,act_scene,line_numbers,expanded_description,event_type
event_001,1,The Tempest Begins,A ship is wrecked in a magical storm,Act 1 Scene 1,1-67,Detailed description of the opening storm scene,major_event
event_002,2,Miranda Learns Her History,Prospero reveals their past to Miranda,Act 1 Scene 2,36-186,Extended exposition scene,exposition
```

**themes.csv:**
```csv
objectid,theme_name,description,tagged_locations,line_references,significance,color_code
theme_001,Power and Authority,Questions of legitimate rule and control,"Act 1 Scene 2, Act 5 Scene 1","1.2.50-70, 5.1.160-171",Central to Prospero's character arc,#FF6B6B
theme_002,Nature vs Nurture,Caliban's character and education,"Act 1 Scene 2, Act 2 Scene 2","1.2.345-374, 2.2.150-175",Explores colonialism themes,#4ECDC4
```

---

## Task 4: Character System

**Command:** `claude-code create-character-system`

**Description:** Build character pages and network visualization extending CollectionBuilder's visualization and card systems.

Use existing papa-parse structures and local session storage as defined in _includes/annotate/js/session-constants-js.html
 
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

---

## Task 5: Plot Timeline System

**Command:** `claude-code create-plot-timeline`

**Description:** Create vertical plot timeline optimized for mobile, extending CollectionBuilder's existing TimelineJS integration.

**Build on CollectionBuilder timeline features:**
- Extend existing timeline.js integration
- Use Bootstrap accordion components for expandable content
- Follow existing responsive design patterns
- Integrate with search functionality

**Files to Create:**

```
_layouts/
└── plot-timeline.html             # Vertical timeline layout

_includes/feature/
├── timeline-vertical.html         # Custom vertical timeline
├── timeline-event.html           # Individual event component
└── timeline-navigation.html      # Timeline scrubbing

pages/
└── plot-timeline.md              # Timeline page stub

assets/js/
├── timeline-vertical.js          # Custom timeline logic
└── timeline-mobile.js           # Mobile optimizations
```

**Key Features:**
- Vertical orientation for mobile-first design
- Expandable event descriptions
- Act/scene navigation
- Line number references with links
- Responsive design across all devices
- Touch-friendly interactions

**Mobile Optimizations:**
- Vertical scrolling timeline
- Touch gestures for navigation
- Collapsible content sections
- Optimized for portrait orientation
- Fast loading and smooth scrolling

---

## Implementation Priority & Dependencies

1. **Task 1 (Interpretive Layouts)** - Foundation for all content pages
   - No dependencies, can start immediately
   - Required for all other interpretive content

2. **Task 2 (Data Setup)** - Required for all data-driven features
   - Depends on Task 1 for layout testing
   - Enables all subsequent tasks

3. **Task 3 (Production History)** - High user value, relatively simple
   - Depends on Tasks 1 & 2
   - Good proof-of-concept for data-driven pages

4. **Task 4 (Character System)** - Complex visualization, high impact
   - Depends on Tasks 1 & 2
   - Most technically challenging

5. **Task 5 (Plot Timeline)** - Mobile-focused feature
   - Depends on Tasks 1 & 2
   - Can be developed in parallel with Task 4

## Testing Strategy

- Use your existing script data for realistic testing
- Test all three header layouts with different content
- Validate mobile responsiveness across iOS/Android
- Ensure accessibility compliance
- Test with both small and large datasets
- Validate integration with existing CollectionBuilder search/navigation