---
layout: docs
title: Digital Dramaturgy Documentation
permalink: /docs.html
---

# Digital Dramaturgy Documentation

Welcome to the comprehensive reference guide for Digital Dramaturgy features. This documentation covers the unique features specific to this platform. For general CollectionBuilder features (browse, maps, timelines, data tables, etc.), please refer to the [CollectionBuilder Documentation](https://collectionbuilder.github.io/cb-docs/){:target="_blank" rel="noopener"}.

---

## Quick Reference {#quick-reference}

**Essential Links:**
- [Quick Start Guide]({{ '/directions.html' | relative_url }}) - Get started in 5 steps
- [CollectionBuilder Docs](https://collectionbuilder.github.io/cb-docs/){:target="_blank" rel="noopener"} - General features documentation
- [GitHub Repository](https://github.com/digitaldramaturgy/digitaldramaturgy.github.io){:target="_blank" rel="noopener"} - Source code and templates

**Common Tasks:**
- [Setting up a playscript](#playscripts)
- [Configuring cover pages](#cover-pages)
- [Creating character networks](#character-network)
- [Adding essay pages](#essays)
- [Building production timelines](#timeline)

---

## Cover Pages {#cover-pages}

Digital Dramaturgy offers **six unique cover page styles** to make a striking first impression for your project.

### Available Styles

Configure your cover page style in `_data/theme.yml`:

```yaml
cover-style: minimal
```

**Available Options:**

| Style | Description | Best For |
|-------|-------------|----------|
| `minimal` | Clean, centered text design | Modern, professional projects |
| `minimal-movement` | Minimal with subtle animations | Adding visual interest |
| `dramatists` | Theater-focused aesthetic | Classical or theatrical productions |
| `cyberpunk` | Bold, stylized design | Contemporary or experimental work |
| `notebook` | Handwritten notebook aesthetic | Educational or collaborative projects |
| `2010` | Retro-styled design | Period-appropriate presentations |

### Customizing Cover Content

Edit `pages/index.md` to customize your cover page text:

```markdown
---
layout: home-cover
title: Your Play Title
---

# Your Play Title

By Your Name

Additional subtitle or description text...
```

**Accessibility Note:** All cover styles include proper heading hierarchy and semantic HTML for screen readers.

---

## Annotated Playscripts {#playscripts}

The annotated playscript feature is the core of Digital Dramaturgy, allowing you to publish line-by-line annotated scripts with powerful filtering and search capabilities.

### Required Data Fields

Your playscript CSV/Google Sheet **must include** these four core fields:

| Field | Description | Example |
|-------|-------------|---------|
| `act` | Act number (Roman numeral recommended) | `I`, `II`, `III` |
| `scene` | Scene number (Roman numeral recommended) | `I`, `II`, `III` |
| `player` | Character speaking the line (or `StageDirection`) | `HAMLET`, `OPHELIA`, `StageDirection` |
| `text` | The actual line text or stage direction | `To be, or not to be, that is the question` |

### Optional Enhancement Fields

| Field | Description | Example |
|-------|-------------|---------|
| `annotation` | Line-by-line annotation text | `Hamlet's famous soliloquy on mortality` |
| `highlight` | Highlighting/emphasis marker | `yes` or custom value |
| `cutting` | Track cuts in production | `cut`, `original` |
| `revision` | Track revisions or versions | `first`, `second`, `final` |

### Optional Metadata Fields (First Row)

You can include metadata about the play in the first row:

| Field | Description | Example |
|-------|-------------|---------|
| `play` | Play title | `A Midsummer Night's Dream` |
| `author` | Playwright name | `William Shakespeare` |
| `description` | Brief description | `An annotated playscript created by...` |

### Playscript Features

**Filtering:**
- **By Scene:** Dropdown menu to view specific acts/scenes
- **By Character:** Filter to show only lines from selected characters
- **By Version:** Compare original vs. cut text, or multiple editions

**Search:**
- Full-text search across all lines
- Instant highlighting of search results
- Navigate between search results with arrow buttons

**Annotations:**
- Hover over highlighted text to view annotations
- Annotations appear in tooltips or sidebar (depending on theme)
- Link to collection items or external resources from annotations

**Navigation:**
- Scene navigation sidebar (desktop)
- Previous/Next scene buttons
- Jump to specific line numbers

### Configuration

Set your playscript data source in `_config.yml`:

```yaml
# Google Sheets URL (published as CSV)
play: https://docs.google.com/spreadsheets/d/...

# OR local CSV file
play: /assets/data/my-play.csv

# OR external CSV URL
play: https://example.com/my-play.csv
```

### Example Playscript Structure

**Basic Example:**
```csv
act,scene,player,text
III,I,HAMLET,"To be, or not to be, that is the question"
III,I,HAMLET,"Whether 'tis nobler in the mind to suffer"
III,I,OPHELIA,"Good my lord, how does your honour for this many a day?"
```

**With Annotations:**
```csv
act,scene,player,text,annotation
III,I,HAMLET,"To be, or not to be, that is the question","Hamlet's famous soliloquy on existence and mortality"
III,I,HAMLET,"Whether 'tis nobler in the mind to suffer","Contemplating passive vs active response to suffering"
III,I,OPHELIA,"Good my lord, how does your honour for this many a day?","Ophelia interrupts his meditation"
```

**With Full Metadata (first row contains play info):**
```csv
play,author,description,act,scene,player,text,annotation
Hamlet,William Shakespeare,"Annotated by Professor Smith's class",,,,
,,,I,I,StageDirection,"Enter HAMLET"
,,,I,I,HAMLET,"O, that this too too solid flesh would melt"
```

**Accessibility:** The playscript viewer includes:
- Semantic HTML with proper heading hierarchy
- ARIA labels for filter controls
- Keyboard navigation support
- Screen reader announcements for filter changes

---

## Character System {#characters}

Digital Dramaturgy includes a sophisticated character tracking system using a dedicated `characters.csv` file.

### Creating characters.csv

Create a file at `_data/characters.csv` with these fields:

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `character` | Yes | Character name (must match `player` in playscript) | `HAMLET` |
| `full_name` | No | Full character name | `Prince Hamlet of Denmark` |
| `description` | No | Character description | `Prince of Denmark, son of the late king` |
| `role` | No | Character role/category | `protagonist`, `antagonist`, `minor` |
| `actor` | No | Actor name (for production docs) | `John Smith` |
| `image` | No | Character image (objectid or path) | `/images/hamlet.jpg` |

### Example characters.csv

```csv
character,full_name,description,role,image
HAMLET,Prince Hamlet,Prince of Denmark seeking revenge,protagonist,hamlet-portrait
CLAUDIUS,King Claudius,Current king and Hamlet's uncle,antagonist,claudius-portrait
OPHELIA,Ophelia,Daughter of Polonius,supporting,ophelia-portrait
HORATIO,Horatio,Hamlet's loyal friend,supporting,
```

### Using Character Data

Character data automatically powers:
- Character network visualizations
- Character card displays
- Character filtering in playscript viewer
- Character relationship tracking

---

## Character Network {#character-network}

The character network feature creates an **interactive D3.js visualization** showing relationships between characters based on shared scenes.

### How It Works

The network graph automatically analyzes your playscript to:
1. Identify which characters appear in which scenes
2. Calculate character importance (based on number of appearances)
3. Determine relationships (characters who share scenes)
4. Generate an interactive force-directed graph

### Network Features

**Visual Encoding:**
- **Node size:** Larger = more scene appearances
- **Node color:** Color-coded by importance tier (4 tiers)
- **Edge connections:** Lines between characters who share scenes
- **Edge thickness:** Thicker = more scenes together

**Interactions:**
- **Click node:** View detailed character information
- **Drag nodes:** Rearrange the layout
- **Hover:** Highlight connections
- **Zoom/Pan:** Explore large networks

### Configuration

The network page is created automatically. To customize, edit `pages/character-network.md`:

```markdown
---
layout: character-network
title: Character Network
permalink: /character-network.html
---

Optional description text about the network visualization...
```

### Requirements

- Playscript CSV with `player` and `actscene` fields
- Optional: `characters.csv` for enhanced character details

### Technical Details

**Data Processing:**
- Network data is generated from `/assets/data/characters.json`
- JSON is auto-generated from your playscript CSV
- D3.js force simulation for layout
- Responsive SVG rendering

**Accessibility:**
- Character list alternative view (for screen readers)
- Keyboard navigation between character cards
- Text descriptions of relationships
- ARIA labels on interactive elements

---

## Essay Pages {#essays}

Essay pages allow you to create beautiful interpretive content with **three header style options**.

### Header Styles

#### Full Header (full-width background image)

```markdown
---
layout: essay
title: Essay Title
header-image-type: full
header-image: objectid-or-path
header-title: Display Title
header-subtitle: Optional subtitle
---

Your essay content here...
```

**Result:** Full-width background image with overlay text

#### Half Header (split image/text layout)

```markdown
---
layout: essay
title: Essay Title
header-image-type: half
header-image: objectid-or-path
header-title: Display Title
header-subtitle: Optional subtitle
---

Your essay content here...
```

**Result:** Two-column layout with text on left, image on right

#### No Header (text only)

```markdown
---
layout: essay
title: Essay Title
header-image-type: none
header-title: Display Title
header-subtitle: Optional subtitle
---

Your essay content here...
```

**Result:** Simple text header without image

### Header Image Options

You can specify images in two ways:

**1. Object ID (from your collection):**
```yaml
header-image: demo_001
```

**2. Direct path:**
```yaml
header-image: /objects/my-image.jpg
```

### Essay Content

Essay content uses standard Markdown with support for:
- Headings, paragraphs, lists
- Images, videos, embeds
- Blockquotes and code blocks
- CollectionBuilder feature includes (alerts, cards, buttons)

### Accessibility Features

All essay header styles include:
- Proper heading hierarchy (h1, h2, h3)
- Alt text for images
- Sufficient color contrast for overlay text (full header)
- Responsive image sizing
- Semantic HTML structure

---

## Production Timeline {#timeline}

Create beautiful production timelines to document rehearsals, performances, or historical context.

### Timeline Data

The timeline uses your main metadata CSV. Ensure these fields are present:

| Field | Description | Example |
|-------|-------------|---------|
| `date` | Event date | `1603-07-02` or `1603` |
| `title` | Event title | `First Performance` |
| `description` | Event description | `First known performance at the Globe Theatre` |
| `image` | Event image (optional) | `objectid` or image path |

### Timeline Configuration

Edit `_data/theme.yml` to configure timeline display:

```yaml
# Timeline Settings
year-navigation: true
year-nav-increment: 10
```

**Options:**
- `year-navigation`: Enable/disable year dropdown (true/false)
- `year-nav-increment`: Group years by increments (5, 10, 25, 50)

### Timeline Page

The timeline page is at `pages/timeline.md`:

```markdown
---
layout: production-timeline
title: Production Timeline
permalink: /timeline.html
---

Optional introduction text about your production timeline...
```

### Features

- **Year-based navigation:** Jump to specific year ranges
- **Chronological display:** Events sorted by date
- **Rich media support:** Images, videos, links
- **Responsive grid:** Adapts to screen size
- **Lazy loading:** Images load as you scroll

### TimelineJS Integration

For more advanced timelines with TimelineJS features, see the [CollectionBuilder Timeline documentation](https://collectionbuilder.github.io/cb-docs/docs/theme/timeline/){:target="_blank" rel="noopener"}.

---

## Collections & References {#collections}

Digital Dramaturgy is built on CollectionBuilder, which allows you to create a collection of digital objects (images, PDFs, videos, etc.) alongside your playscript. You can then reference these collection items in your annotations and essays.

### How Collections Work

**Collection = Playscript + Digital Objects**

1. **Playscript:** Your play script data (defined by the `play:` setting in `_config.yml`)
2. **Collection Items:** Supplementary materials like photos, programs, documents, videos (defined by the `metadata:` setting in `_config.yml`)

### Setting Up Your Collection

**1. Create collection metadata CSV:**

Create a CSV file in `_data/` directory (e.g., `_data/hamlet-collection.csv`):

```csv
objectid,title,description,date,format,subject,object_location,image_small,image_thumb
photo001,Act 1 Opening Scene,The ghost appears to Hamlet,2024-03-15,image/jpeg,production photos; act 1,/objects/hamlet-01.jpg,/objects/small/hamlet-01_sm.jpg,/objects/thumbs/hamlet-01_th.jpg
photo002,Ophelia's Mad Scene,Ophelia in Act 4 Scene 5,2024-03-20,image/jpeg,production photos; act 4,/objects/hamlet-02.jpg,/objects/small/hamlet-02_sm.jpg,/objects/thumbs/hamlet-02_th.jpg
program01,Opening Night Program,Program from March 15 performance,2024-03-15,application/pdf,programs,/objects/hamlet-program.pdf,/objects/small/hamlet-program_sm.jpg,/objects/thumbs/hamlet-program_th.jpg
```

**Important Notes:**
- Paths start with `/` and are relative to your repository root
- `object_location` = full-size downloadable file
- `image_small` = small image for display on item pages
- `image_thumb` = thumbnail for Browse, Map, Timeline pages
- For PDFs and audio/video, you still need image derivatives for thumbnails

**2. Configure the collection in `_config.yml`:**

```yaml
# Set the metadata for your collection
# Use the filename of your CSV without the .csv extension
metadata: hamlet-collection
```

**3. Add your object files:**

Place your files in the `/objects/` directory with derivatives:
```
/objects/
  hamlet-01.jpg              (original full-size)
  hamlet-02.jpg
  hamlet-program.pdf
  small/                     (small versions for item pages)
    hamlet-01_sm.jpg
    hamlet-02_sm.jpg
    hamlet-program_sm.jpg    (preview image for PDF)
  thumbs/                    (thumbnails for browse/map)
    hamlet-01_th.jpg
    hamlet-02_th.jpg
    hamlet-program_th.jpg
```

### Referencing Collection Items in Annotations

You can link to collection items from your playscript annotations using HTML links:

```csv
act,scene,player,text,annotation
III,I,HAMLET,"To be, or not to be","Hamlet's famous soliloquy. <a href='/items/photo001.html'>See our production photo</a> of this moment."
III,I,OPHELIA,"Good my lord","Ophelia's tentative approach. View the <a href='/items/program01.html'>opening night program</a> for director's notes on this scene."
```

**How it works:**
- Each collection item gets its own page at `/items/[objectid].html`
- Link to these pages from your annotations using standard HTML `<a>` tags
- The annotation text supports HTML formatting (links, bold, italics, etc.)

### Referencing in Essay Pages

In your essay Markdown files, you can embed collection items:

{% raw %}
```markdown
## Analysis of Act 3, Scene 1

Hamlet's famous soliloquy...

{% include feature/image.html objectid="photo001" width="75" caption="Our production of this scene" %}

{% include feature/card.html objectid="photo002" %}
```
{% endraw %}

### Available Includes for Collections

{% raw %}
- `{% include feature/image.html objectid="..." %}` - Embed image
- `{% include feature/card.html objectid="..." %}` - Display item card
- `{% include feature/item-figure.html objectid="..." %}` - Figure with caption
- `{% include feature/pdf.html objectid="..." %}` - Embed PDF viewer
- `{% include feature/video.html objectid="..." %}` - Embed video
{% endraw %}

**See the [CollectionBuilder Includes documentation](https://collectionbuilder.github.io/cb-docs/docs/theme/features/){:target="_blank" rel="noopener"} for complete details.**

### Collection Metadata Fields Reference

**Required Fields:**

| Field | Description |
|-------|-------------|
| `objectid` | Unique identifier - lowercase, no spaces, use hyphens/underscores only |
| `title` | Display title for the item |

**Object Location Fields (for displaying items):**

| Field | Description |
|-------|-------------|
| `object_location` | Full URL or relative path to the full-size object file |
| `image_small` | Path to small image (for item page display) |
| `image_thumb` | Path to thumbnail image (for Browse, Map, Timeline) |
| `image_alt_text` | Descriptive alt text for accessibility |
| `format` | MIME type (e.g., `image/jpeg`, `application/pdf`) - used to select icons if no thumbnails |

**Recommended Fields:**

| Field | Description |
|-------|-------------|
| `description` | Description of the item |
| `date` | Date in YYYY-MM-DD format |
| `subject` | Semicolon-separated subjects (e.g., `theater; production; Act 1`) |
| `creator` | Creator/photographer/author |
| `location` | Place name |
| `source` | Source institution or collection |

**Notes:**
- Items without `objectid` will not be displayed
- Items without `object_location` become metadata-only records (no download)
- If `image_thumb` is blank, icons are used based on `format` field
- Paths starting with `/` are relative to repository root (e.g., `/objects/photo.jpg`)
- Full URLs work for externally hosted objects

See the [CollectionBuilder metadata documentation](https://collectionbuilder.github.io/cb-docs/docs/metadata/csv_metadata/){:target="_blank" rel="noopener"} for complete field options and examples.

### Use Cases for Collections

- **Production documentation:** Photos from rehearsals and performances
- **Historical context:** Programs, reviews, historical documents
- **Multimedia essays:** Videos, audio recordings, interviews
- **Scholarly apparatus:** Critical sources, manuscript images
- **Educational resources:** Supplementary learning materials

---

## Data Structure {#data-structure}

Understanding the data structure helps you customize and extend Digital Dramaturgy.

### File Organization

```
your-project/
├── _config.yml                 # Main site configuration
├── _data/
│   ├── config-nav.csv          # Navigation menu
│   ├── theme.yml               # Theme settings
│   ├── characters.csv          # Character data (optional)
│   ├── your-collection.csv     # Collection metadata
│   └── config-theme-colors.csv # Color scheme
├── objects/                    # Media files (images, PDFs, etc.)
├── pages/                      # Page content (.md files)
└── _layouts/                   # Page templates (.html files)
```

**Note:** Your playscript CSV can be:
- Hosted on Google Sheets (published as CSV)
- Stored locally in `/assets/data/` or `/_data/`
- Hosted externally on any accessible URL

### Key Configuration Files

#### _config.yml

```yaml
# Site Settings
title: Digital Dramaturgy
description: An annotated edition of [Play Name]
author: your-name

# Playscript Source (choose one option)
# Option 1: Google Sheets published CSV
play: https://docs.google.com/spreadsheets/d/.../pub?output=csv
# Option 2: Local file
# play: /assets/data/hamlet.csv
# Option 3: External URL
# play: https://example.com/hamlet.csv

# Collection metadata (CSV filename without .csv extension)
metadata: your-collection

# Development Mode (enables testing with different play URLs)
development-mode: true
```

#### _data/theme.yml

```yaml
# Cover Page
cover-style: minimal

# Typography
base-font-size: 1.2em
text-color: "#191919"

# Navigation
navbar-color: dark
navbar-background: dark

# Features
year-navigation: true
```

#### _data/config-nav.csv

```csv
display_name,stub,dropdown_parent
Home,/,
Features,/features.html,
Documentation,/docs.html,
Read the Play,/script.html,
Essays,/essays.html,
Essay 1,/essay-1.html,Essays
Essay 2,/essay-2.html,Essays
```

**Navigation Structure:**
- First two columns required: `display_name`, `stub`
- Third column optional: `dropdown_parent` (for nested menus)
- Leave `dropdown_parent` empty for top-level items

### CSV Data Guidelines

**Best Practices:**
- Use UTF-8 encoding for special characters
- Enclose fields with commas in quotes: `"Hamlet, Prince of Denmark"`
- Use consistent formatting for dates: `YYYY-MM-DD`
- Keep objectids simple: lowercase, no spaces, use hyphens

**Required vs Optional Fields:**
- **Required:** Only what your specific feature needs (see each section above)
- **Optional:** Any additional metadata you want to track

---

## Troubleshooting {#troubleshooting}

### Common Issues and Solutions

#### Playscript Not Loading

**Symptoms:** Blank playscript page or "No data" message

**Solutions:**
1. Check `_config.yml` - is the `play` URL correct?
2. If using Google Sheets, ensure it's published as CSV (not just "shared")
3. Verify required fields: `player`, `playerline`, `actscene`, `linenumber`
4. Check CSV encoding (must be UTF-8)
5. Try the "Refresh Playscript Data" button in development mode

#### Character Network Not Displaying

**Symptoms:** Blank network page

**Solutions:**
1. Ensure your playscript has `player` and `actscene` fields
2. Check that `/assets/data/characters.json` exists and is valid
3. Verify at least 2 characters share scenes
4. Check browser console for JavaScript errors
5. Try regenerating the site (`jekyll build`)

#### Essay Header Images Not Showing

**Symptoms:** Missing or broken images in essay headers

**Solutions:**
1. Check `header-image` path is correct
2. If using objectid, verify item exists in metadata
3. Ensure image file exists in `/objects/` directory
4. Check image file extension matches (case-sensitive)
5. Verify `header-image-type` is set correctly (`full`, `half`, or `none`)

#### Navigation Menu Not Updating

**Symptoms:** New pages don't appear in menu

**Solutions:**
1. Edit `_data/config-nav.csv` to add your page
2. Format: `Display Name,/page-url.html,`
3. For dropdown: add parent name in third column
4. Save and rebuild site
5. Clear browser cache

#### Site Build Failures

**Symptoms:** GitHub Pages build failing, or local Jekyll errors

**Solutions:**
1. Check YAML front matter has valid syntax (no tabs, proper indentation)
2. Verify all referenced files exist
3. Check for special characters in filenames (use hyphens, not spaces)
4. Review build logs for specific error messages
5. Try local build: `jekyll build --verbose`

#### Google Sheets Connection Issues

**Symptoms:** Data not updating, connection errors

**Solutions:**
1. Re-publish your Google Sheet (File > Share > Publish to web > CSV)
2. Copy the new URL and update `_config.yml`
3. Use the "Refresh Playscript Data" button
4. Check if Google Sheets is accessible (not private/restricted)
5. Try downloading CSV and hosting it locally as fallback

### Getting Help

**When You're Stuck:**

1. **Check this documentation** for your specific feature
2. **Review [CollectionBuilder docs](https://collectionbuilder.github.io/cb-docs/)** for general features
3. **Examine example files** in the `/pages/` directory
4. **Open an issue** on [GitHub](https://github.com/digitaldramaturgy/digitaldramaturgy.github.io/issues){:target="_blank" rel="noopener"}
5. **Contact us** at <dbecker@uidaho.edu>

**When Opening an Issue, Include:**
- What you're trying to do
- What's happening instead
- Your configuration (relevant parts of `_config.yml`, `theme.yml`)
- Browser/device information
- Screenshots if applicable

---

## External Resources {#external-resources}

### CollectionBuilder Documentation

Digital Dramaturgy is built on CollectionBuilder-CSV. For features not unique to Digital Dramaturgy, refer to these excellent resources:

- **[CollectionBuilder Docs](https://collectionbuilder.github.io/cb-docs/){:target="_blank" rel="noopener"}** - Complete documentation
- **[Configuration](https://collectionbuilder.github.io/cb-docs/docs/config/){:target="_blank" rel="noopener"}** - Site and theme configuration
- **[Metadata](https://collectionbuilder.github.io/cb-docs/docs/metadata/){:target="_blank" rel="noopener"}** - Working with collection metadata
- **[Feature Includes](https://collectionbuilder.github.io/cb-docs/docs/theme/features/){:target="_blank" rel="noopener"}** - Embeddable components
- **[Pages](https://collectionbuilder.github.io/cb-docs/docs/pages/){:target="_blank" rel="noopener"}** - Creating custom pages
- **[Deploy](https://collectionbuilder.github.io/cb-docs/docs/deploy/){:target="_blank" rel="noopener"}** - Publishing your site

### Related Technologies

- **[Jekyll Documentation](https://jekyllrb.com/docs/){:target="_blank" rel="noopener"}** - Static site generator
- **[Bootstrap 5](https://getbootstrap.com/docs/5.1/){:target="_blank" rel="noopener"}** - CSS framework
- **[Markdown Guide](https://www.markdownguide.org/){:target="_blank" rel="noopener"}** - Markdown syntax
- **[D3.js](https://d3js.org/){:target="_blank" rel="noopener"}** - Data visualization library
- **[GitHub Pages](https://docs.github.com/en/pages){:target="_blank" rel="noopener"}** - Free hosting

### Sample Projects

Explore these example Digital Dramaturgy projects:

- **[Digital Dramaturgy Demo](https://digitaldramaturgy.github.io/){:target="_blank" rel="noopener"}** - This site, demonstrating all features
- More examples coming soon!

### Community & Support

- **GitHub:** [digitaldramaturgy organization](https://github.com/digitaldramaturgy){:target="_blank" rel="noopener"}
- **Issues:** [Report bugs or request features](https://github.com/digitaldramaturgy/digitaldramaturgy.github.io/issues){:target="_blank" rel="noopener"}
- **Email:** <dbecker@uidaho.edu>

---

<div class="alert alert-info mt-5" role="alert">
<h4 class="alert-heading">Need More Help?</h4>
<p>This documentation is continuously updated. If you can't find what you're looking for:</p>
<ul class="mb-0">
<li>Check the <a href="{{ '/directions.html' | relative_url }}">Quick Start Guide</a> for setup help</li>
<li>Browse the <a href="https://collectionbuilder.github.io/cb-docs/" target="_blank" rel="noopener">CollectionBuilder Documentation</a> for general features</li>
<li>Open an issue on <a href="https://github.com/digitaldramaturgy/digitaldramaturgy.github.io/issues" target="_blank" rel="noopener">GitHub</a></li>
<li>Email us at <a href="mailto:dbecker@uidaho.edu">dbecker@uidaho.edu</a></li>
</ul>
</div>
