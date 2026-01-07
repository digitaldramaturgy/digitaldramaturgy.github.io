---
layout: docs
title: Digital Dramaturgy Documentation
permalink: /docs.html
modal: false
---

# Digital Dramaturgy Documentation

Welcome to the comprehensive reference guide for Digital Dramaturgy features. This documentation covers the unique features specific to this platform. For general CollectionBuilder features (browse, maps, timelines, data tables, etc.), please refer to the [CollectionBuilder Documentation](https://collectionbuilder.github.io/cb-docs/){:target="_blank" rel="noopener"}.

---

## How Digital Dramaturgy Works {#overview}

Digital Dramaturgy transforms a simple spreadsheet of playscript data into an interactive, annotated digital edition with filtering, search, and visualization capabilities.

**The Platform Architecture:**

Digital Dramaturgy pulls playscript data from a CSV source—either a published Google Sheet or a static CSV file—and renders it as an interactive web experience. 

Your spreadsheet becomes the database: each row represents a line of dialogue or stage direction, with columns for act, scene, character, text, and optional annotations, revisions, or cuts. When the site loads, it reads this data and generates a filterable, searchable script view along with automatic character network visualizations.

**The Workflow:**

Users typically start by creating their annotated playscript in Google Sheets, which offers real-time collaboration and easy editing. By publishing the sheet as CSV, you can immediately connect it to the main Digital Dramaturgy site to preview how it will appear—no installation required, and any changes to your spreadsheet update the preview automatically.

When you're ready to publish your work permanently, you copy the Digital Dramaturgy GitHub template repository to your own account. This creates your own independent site with custom branding, navigation, and features. Point your new site's configuration at your published Google Sheet (or a local CSV file), enable GitHub Pages, and your annotated edition goes live as a free, fast static website.

**The Flexibility:**

Because Digital Dramaturgy is built on [CollectionBuilder](https://collectionbuilder.github.io/), a static site framework for digital collections, you can extend your playscript with supplementary materials: production photos, historical documents, interpretive essays, timelines, and more. Everything is version-controlled, preservable, and runs without a database or server-side processing.

**For complete step-by-step setup instructions, see the [Quick Start Guide]({{ '/directions.html' | relative_url }}).**

---

## Quick Reference {#quick-reference}

**Essential Links:**
- [Quick Start Guide]({{ '/directions.html' | relative_url }}) - Get started in 5 steps
- [CollectionBuilder Docs](https://collectionbuilder.github.io/cb-docs/){:target="_blank" rel="noopener"} - General features documentation
- [GitHub Repository](https://github.com/digitaldramaturgy/digitaldramaturgy.github.io){:target="_blank" rel="noopener"} - Source code and template to start your own project

**Common Tasks:**
- [Setting up a playscript](#playscripts)
- [Configuring cover pages](#cover-pages)
- [Creating character networks](#character-network)
- [Customizing your About page](#about-page)
- [Updating the navigation menu](#navigation)
- [Adding essay pages](#essays)
- [Building production timelines](#timeline)
- [Publishing your site](#publishing)
- [CollectionBuilder Options](#collections)
- [Config Files](#configuration)

---

## Annotated Playscripts {#playscripts}

The annotated playscript feature is the core of Digital Dramaturgy, allowing you to publish line-by-line annotated scripts with powerful filtering and search capabilities.

### Required Data Fields

Your playscript CSV/Google Sheet **must include** these four core fields:

| Field | Description | Example |
|-------|-------------|---------|
| `act` | Act number | `1`, `2`, `3` |
| `scene` | Scene number | `1`, `2`, `3` |
| `player` | Character speaking the line (or `StageDirection`) | `HAMLET`, `OPHELIA`, `StageDirection` |
| `text` | The actual line text or stage direction | `To be, or not to be, that is the question` |

### Optional Enhancement Fields

| Field | Description | Example |
|-------|-------------|---------|
| `annotation` | Line-by-line annotation text (can use markdown) | `A **gawd** is an ornament or a trinket.` |
| `highlight` | Highlighting/emphasis marker | the word or phrase to highlight in the script (must match with string in "text" field) | `gawd`
| `cutting` | Cut the line | enter `True` if you'd like to cut the line |
| `revision` | Revise the line | `To Beat or not to Beat` |

### Optional Metadata Fields (First Row)

You can include metadata about the play in the first row:

| Field | Description | Example |
|-------|-------------|---------|
| `play` | Play title | `A Midsummer Night's Dream` |
| `author` | Playwright name | `William Shakespeare` |
| `description` | Brief description | `An annotated playscript created by...` |

### Playscript Features

#### Annotations:
- Hover over highlighted text to view annotations
- Annotations appear in tooltips or sidebar (depending on theme)
- Link to collection items or external resources from annotations

#### Filters

Filters can be seen by clicking the `Filters` button at the top right of the playscript. All of these filters are enabled by your spreadsheet.

**Dropdown:**
- **By Scene:** Dropdown menu to view specific acts/scenes
- **By Character:** Dropdown menu to view only lines from selected characters

**Search:**
- Full-text search across all lines
- Instant highlighting of search results

**Versions/Cuttings Buttons:**
- Buttons to help compare play versions
- These only appears if:
  - you've added a `True` value in `cutting`
  - put a revision value in the `revision` column
  - added a new line by
    - adding a line to the CSV/spreadsheet
    - entering a value in `revision` but not having a value in `text`
- Cut/Revised button:
  - The default.
  - when selected will show the main version appearing on the site
- Original:
  - When selected, shows the original version without any cuttings or revisions
- Compare Both:
  - When selected, this will show the cut (red highlight), revised (yellow highlight), and added lines (green highlight)

### Connecting Your Annotated Playscript to the site

If you're using your own reporistory, you'll set your playscript data source in `_config.yml`:

```yaml
# Google Sheets URL (published as CSV)
play: https://docs.google.com/spreadsheets/d/...

# OR local CSV file
play: /assets/data/my-play.csv

# OR external CSV URL
play: https://example.com/my-play.csv
```

You can also configure, publish and check your annotation by connecting a google sheet to the digital dramaturgy home page by adding the link like so:


### Google Sheets URL (published as CSV)
`https://docs.google.com/spreadsheets/d/e/2PACX-1vTR-PrLzlbvViHiBNVdkzUZ8iPjkw-LMmugCYpNYs0QWkvLmpi6hWXc9_edxYx5D7vAUoG369W4-5wo/pub?output=csv`

### OR external CSV URL
`https://digitaldramaturgy.github.io?play=https://example.com/my-play.csv`

---

## Cover Pages {#cover-pages}

Digital Dramaturgy offers **five unique cover page styles** to make a striking first impression for your project.

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
| `2010` | Retro-styled design | Period-appropriate presentations |

### Customizing Cover Content

You can edit the the title, author, and description of your play by [adding that info to the first line of your spreadsheet](optional-metadata-fields-first-row).

Of if you're using your own GitHub repository, you can edit this data by editing the Site Settings portion of your `_config.yml` file, which can be found at the root of your repostitory.

```yaml
# Site SETTINGS
# Site
title: Measure for Measure
# description appears in meta tags and other locations
# this description might appear in search result lists, keep around 160 characters max
description: A revised version of Shakespeare's famous play
# keywords, a short list of subjects describing the collection, separated by semicolon, to appear in rich markup
keywords: shakesepare; measure for measure; annotation; digital dramaturgy; digital humanities; theater;
# creator of the digital collection, to appear in meta tags; we typically use our GitHub usernames but feel free to just use your name
author: Your-GITHub-username
```

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

### Requirements

- Playscript CSV with `player` and `actscene` fields

The network page is created automatically. To customize the text at the top of the page, edit `pages/character-network.md` adding your text below the `---` that ends the page's frontmatter:

```markdown
---
layout: character-network
title: Character Network
permalink: /character-network.html
---

Optional description text about the network visualization...
```

### Edit the Character's descriptions (optional)

For those using your own repository, you can edit the descriptions of your characters and add images. If you edit the `characters.csv` file in your _data folder, as long as those character names match those in your playscript, new data will show.

You can see how this works in Measure for Measure:

{% include feature/button.html text="See an Enhanced Character Network Page" link="https://digitaldramaturgy.github.io/character-network.html?play=https://docs.google.com/spreadsheets/d/e/2PACX-1vQna6SB4jJeyPY5MOH3BSHh53Ja3Njwfk_Zkxr7EGtU7xkn1juhUbEXduy6Ycbi6ayOg33a_NjjFqC_/pub?output=csv" color="info"%}



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

## Customizing the About Page {#about-page}

The About page is where you'll add information about your specific project, production, or annotation. Replacing the default content with your own is simple.

### Editing the About Page

1. Open the file `pages/about.md` in your repository
2. Delete everything **below** the closing `---` of the front matter
3. Write your content using Markdown

**Example:**

```markdown
---
layout: page-narrow
title: About Digital Dramaturgy
order: 1
object-id: about
permalink: /about.html
---

## About This Production

This annotated edition of *Measure for Measure* was created by students in
THEA 351: Dramaturgy at the University of Idaho in Fall 2024.

### Our Approach

We focused on exploring themes of justice, mercy, and power through a
contemporary lens...

### The Team

- **Director:** Dr. Sarah Fogarty-Morrison
- **Dramaturgs:** [Student names]
- **Research Assistants:** [Student names]

### Acknowledgments

We would like to thank...
```

### Content Tips

- Use Markdown for formatting (headings, lists, links, etc.)
- Add images using CollectionBuilder includes: `{% raw %}{% include feature/image.html objectid="photo001" %}{% endraw %}`
- Keep it concise - this is an overview, not a full history
- Link to essay pages for more detailed analysis

For more about Markdown syntax, see the [Markdown Guide](https://www.markdownguide.org/){:target="_blank" rel="noopener"}.

---

## Updating the Navigation Menu {#navigation}

The navigation menu is controlled by the `_data/config-nav.csv` file. Edit this file to add, remove, or reorganize menu items.

### Navigation File Structure

The CSV has three columns:

| Column | Description | Required |
|--------|-------------|----------|
| `display_name` | Text shown in the menu | Yes |
| `stub` | Page URL (relative to site root) | Yes |
| `dropdown_parent` | Parent menu item for dropdowns | No |

### Examples

**Simple top-level menu:**

```csv
display_name,stub,dropdown_parent
Home,/,
Read the Play,/script.html,
Character Network,/character-network.html,
Timeline,/timeline.html,
About,/about.html,
```

**Menu with dropdown:**

```csv
display_name,stub,dropdown_parent
Home,/,
Read the Play,/script.html,
Essays,/essays.html,
Introduction,/introduction.html,Essays
Historical Context,/context.html,Essays
Character Analysis,/characters-essay.html,Essays
Timeline,/timeline.html,
About,/about.html,
```

### Tips

- Keep menu items to 5-7 for best usability
- Use clear, concise names for menu items
- Group related pages under dropdown menus
- The `stub` must match the `permalink` in your page's front matter
- Leave `dropdown_parent` empty for top-level items
- For dropdown items, put the parent's `display_name` in `dropdown_parent`

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

**1. Object ID (from your CollectionBuilder collection):**
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
- [CollectionBuilder feature includes](https://collectionbuilder.github.io/cb-docs/docs/pages/features/#feature-includes) (alerts, cards, buttons)
  - For an overview of all of these, with code, see our [Includes Bonanza Page](https://collectionbuilder.github.io/collectionbuilder-gh/feature_options.html)


---

## Production Timeline {#timeline}

Create interactive production timelines using [TimelineJS](https://timeline.knightlab.com/) to document the historical performances of your play, track production history, or showcase important dates related to your project.

### How It Works

The timeline feature uses the **TimelineJS** library from Knight Lab to create a scrollable, interactive timeline. The data is pulled from `_data/production-timeline.csv` and automatically converted to TimelineJS format via `assets/data/timelinejs.json`.

### Timeline Data

Create a CSV file at `_data/production-timeline.csv` with the following fields:

**Required Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Event title | `First Performance at the Globe` |
| `date` | Event date (YYYY, YYYY-MM-DD, or YYYY/MM/DD) | `1603-07-02` or `1603` |
| `description` | Event description (supports markdown) | `First known performance at the Globe Theatre` |

**Optional Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `media` | Path to image/media file | `/objects/performance-photo.jpg` |
| `objectid` | Reference to collection item (alternative to `media`) | `photo001` |
| `link` | External link for the event | `https://example.com/article` |
| `adaptor-translator` | Adaptor or translator name | `John Smith` |
| `key-personnel` | Key people involved | `Director: Jane Doe` |

**Notes:**
- If you provide an `objectid`, the timeline will use the image from your collection metadata
- If you provide a `media` path, it will use that image directly
- Dates can be just a year (YYYY), month and year (YYYY-MM), or full date (YYYY-MM-DD)
- The `description` field supports basic markdown formatting

### Example CSV

```csv
objectid,title,description,date,media,link,adaptor-translator,key-personnel
,First Production,First known performance at the Globe Theatre,1603-07-02,/objects/globe.jpg,,Original Cast
,Broadway Premiere,Opened at the Imperial Theatre,1957-03-21,,https://ibdb.com/...,John Gielgud,Director: Peter Hall
photo001,2024 Revival,Modern interpretation set in a dystopian future,2024-09-15,,,Sarah Johnson,
```

### Timeline Page

The timeline page is located at `pages/timeline.md`:

```markdown
---
layout: production-timeline
title: Production Timeline
permalink: /timeline.html
---

## Collection Timeline

Add optional introductory text here about your production history...
```

### Customization

You can customize the timeline's title card by editing `_data/theme.yml`:

```yaml
# Timeline title card settings
timeline-title: "Production History of Hamlet"
timeline-featured-img: /objects/your-image.jpg
timeline-featured-img-caption: "A caption for your featured image"
```

### Features

- **Interactive scrolling:** Navigate chronologically through events
- **Rich media support:** Images, videos, and embedded content
- **Responsive design:** Works on all screen sizes
- **Automatic date parsing:** Handles various date formats
- **Collection integration:** Reference items from your collection via objectid

For more information about TimelineJS capabilities, see the [TimelineJS documentation](https://timeline.knightlab.com/docs/index.html){:target="_blank" rel="noopener"}.

---

## Publishing Your Annotation {#publishing}

Once you've finalized your annotation and customized your site, you'll want to publish it online. GitHub Pages provides free hosting for your Digital Dramaturgy site.

### Prerequisites

- A GitHub account
- Your own copy of the Digital Dramaturgy repository (see [Quick Start Guide]({{ '/directions.html' | relative_url }}))

### Deployment Steps

1. **Open Settings**
   - Go to your repository on GitHub
   - Click the "Settings" tab (right side of the top menu)

2. **Navigate to Pages**
   - In the left sidebar, click "Pages"

3. **Configure GitHub Actions**
   - Under "Build and Deployment", find "Source"
   - Select "GitHub Actions" from the dropdown menu
   - A "GitHub Pages Jekyll" option will appear
   - Click the "Configure" button

4. **Commit the Workflow**
   - A new page will open with a workflow file (you don't need to edit it)
   - Click the green "Commit changes..." button
   - In the dialog, click "Commit changes" again

5. **Wait for Build**
   - GitHub will start building your site (typically 2-5 minutes)
   - Check progress on your repository's main page
   - Green checkmark = success; yellow circle = building; red X = error

### Your Site URL

Once deployed, your site will be available at:

```
https://[your-username].github.io/[repository-name]/
```

For example: `https://johndoe.github.io/hamlet-annotation/`

### Updating Your Site

After the initial deployment, any changes you push to GitHub will automatically trigger a rebuild. Just edit files and commit changes - your site updates automatically within a few minutes.

### Troubleshooting Deployment

- **Build failing?** Check the Actions tab for error messages
- **Pages not showing up?** Verify `permalink` in front matter matches `stub` in config-nav.csv
- **Images not loading?** Check file paths are correct and files are in the repository

For more deployment options and custom domains, see the [GitHub Pages documentation](https://docs.github.com/en/pages){:target="_blank" rel="noopener"}.

---

## Collections & References {#collections}

Digital Dramaturgy is built on CollectionBuilder, which allows you to create a collection of digital objects (images, PDFs, videos, etc.) alongside your playscript. You can then reference these collection items in your annotations and essays.

### How Collections Work

**Collection = Playscript + Digital Objects**

1. **Playscript:** Your play script data (defined by the `play:` setting in `_config.yml`), or by the link you've added to the digitaldramaturgy.github.io site.
2. **Collection Items:** Supplementary materials like photos, programs, documents, videos (defined by the `metadata:` setting in `_config.yml`)
- note this only applies to those using their own repository

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

## Configuration {#configuration}

Digital Dramaturgy is built on CollectionBuilder and uses similar configuration files. This section covers the essential settings specific to Digital Dramaturgy. **For comprehensive CollectionBuilder configuration options, see the [CollectionBuilder Configuration Documentation](https://collectionbuilder.github.io/cb-docs/docs/config/){:target="_blank" rel="noopener"}.**

### Essential Files

```
your-project/
├── _config.yml                 # Main site configuration
├── _data/
│   ├── config-nav.csv          # Navigation menu (see below)
│   ├── theme.yml               # Theme settings
│   ├── production-timeline.csv # Timeline data (see above)
│   └── characters.csv          # Character data (optional)
├── pages/                      # Page content (.md files)
└── objects/                    # Media files (images, PDFs, etc.)
```

### Key Settings in _config.yml

**Digital Dramaturgy-Specific Settings:**

```yaml
# Playscript Source (choose one option)
# Google Sheets published CSV:
play: https://docs.google.com/spreadsheets/d/.../pub?output=csv
# OR Local file:
# play: /assets/data/hamlet.csv
# OR External URL:
# play: https://example.com/hamlet.csv

# Development Mode (enables testing with different play URLs)
development-mode: true
```

**Standard Site Settings:**

```yaml
# Site Information
title: Your Play Title
description: A brief description of your project
author: your-name

# Collection metadata (if using CollectionBuilder features)
# Use CSV filename without .csv extension
metadata: your-collection-name
```

### Cover Page Styles in _data/theme.yml

The most important Digital Dramaturgy-specific theme setting is the cover page style:

```yaml
# Cover Page Style (see Cover Pages section above)
cover-style: minimal  # Options: minimal, minimal-movement, dramatists, cyberpunk, 2010
```

**For all other theme.yml options (colors, fonts, navigation styles, etc.), see the [CollectionBuilder Theme Documentation](https://collectionbuilder.github.io/cb-docs/docs/theme/){:target="_blank" rel="noopener"}.**

---

## Troubleshooting {#troubleshooting}

### Common Issues and Solutions

#### Playscript Not Loading

**Symptoms:** Blank playscript page or "No data" message

**Solutions:**
1. Check `_config.yml` - is the `play` URL correct?
2. If using Google Sheets, ensure it's published as CSV (not just "shared")
3. Verify required fields: `act`, `scene`, `player`, `text`
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
