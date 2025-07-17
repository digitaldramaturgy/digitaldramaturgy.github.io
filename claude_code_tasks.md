# Claude Code Task - Essay Layout System

## Task: Create Flexible Essay Layout

**Command:** `claude-code create-essay-layout`

**Description:** Create a single `essay.html` layout with flexible header options controlled by front matter, following CollectionBuilder patterns.

## Files to Create

```
_layouts/
└── essay.html                     # Single flexible layout

_includes/feature/
├── essay-header-full.html         # Full-width image header
├── essay-header-half.html         # Split image/text header  
└── essay-header-none.html         # Text-only header

_sass/
└── _essay-headers.scss            # Header styles
```

## Front Matter Configuration

**Full Image Header:**
```yaml
---
title: "About The Tempest"
layout: essay
header-image-type: full
header-image: "/assets/img/tempest-storm.jpg"
header-image-alt: "Storm clouds over a dark sea"
header-title: "The Tempest" 
header-subtitle: "Shakespeare's Final Solo-Authored Play"
header-overlay-opacity: 0.6        # Optional, defaults to 0.5
---
```

**Half Image Header:**
```yaml
---
title: "Production History"
layout: essay
header-image-type: half
header-image: "/assets/img/tempest-production.jpg"
header-image-alt: "Historical theater production"
header-title: "Performance Legacy"
header-subtitle: "400 Years of Interpretations"
---
```

**Text Only Header:**
```yaml
---
title: "Character Analysis"
layout: essay
header-image-type: none
header-title: "Dramatis Personae"
header-subtitle: "Character Relationships in The Tempest"
header-accent-color: "primary"     # Optional Bootstrap color
---
```

## Layout Logic Structure

**essay.html should:**
1. Extend CollectionBuilder's base layout structure
2. Include conditional logic for header type
3. Use existing CollectionBuilder navigation/footer
4. Support existing feature includes in content

**Header selection logic:**
```liquid
{% if page.header-image-type == "full" %}
  {% include feature/essay-header-full.html %}
{% elsif page.header-image-type == "half" %}
  {% include feature/essay-header-half.html %}
{% else %}
  {% include feature/essay-header-none.html %}
{% endif %}
```

## Include File Specifications

### essay-header-full.html
- Full viewport width image background
- Centered title/subtitle overlay
- Configurable overlay opacity
- Responsive typography scaling
- Accessibility: proper contrast, alt text

### essay-header-half.html  
- Bootstrap two-column grid (col-md-6 each)
- Image on right, text on left (or configurable)
- Responsive stacking on mobile
- Maintains aspect ratio for image

### essay-header-none.html
- Clean typography-focused header
- Optional accent color from Bootstrap palette
- Proper heading hierarchy (h1/h2)
- Minimal, elegant spacing

## CSS Requirements

**_sass/_essay-headers.scss should include:**
- Responsive image handling
- Typography scaling across devices
- Overlay effects for full image headers
- Consistent spacing and alignment
- Dark/light text contrast handling
- Mobile-first responsive design

## Integration with CollectionBuilder

**Maintain compatibility with:**
- Existing navigation includes
- Bootstrap grid system and utilities
- CollectionBuilder's responsive patterns
- Existing feature includes for page content
- Search functionality and meta tags

**Content area should:**
- Support all existing CollectionBuilder feature includes
- Use standard prose styling
- Maintain reading flow after header
- Support rich media embeds

## Example Usage in Page Content

After the front matter, page content can use existing CollectionBuilder features:

```markdown
---
title: "About The Tempest"
layout: essay
header-image-type: full
header-image: "/assets/img/tempest.jpg"
header-title: "The Tempest"
header-subtitle: "Shakespeare's final play"
---

## Introduction

The Tempest represents Shakespeare's final solo-authored work...

{% include feature/item-figure.html objectid="demo_001" width="50" caption="First Folio title page" %}

## Historical Context

{% include feature/card.html header="Performance History" text="Over 400 years of adaptations..." %}

```

## Technical Specifications

**Responsive Breakpoints:**
- Mobile: header stacks vertically, full-width images
- Tablet: half headers maintain side-by-side layout
- Desktop: all headers optimized for wide viewing

**Performance Considerations:**
- Lazy loading for header images
- Optimized image sizes with srcset
- Minimal additional CSS overhead
- Fast loading on mobile connections

**Accessibility Features:**
- Proper heading structure (h1, h2 hierarchy)
- Alt text for all images
- Sufficient color contrast ratios
- Screen reader friendly navigation
- Keyboard navigation support

## Default Values

If front matter values are not provided:
- `header-image-type`: defaults to "none"
- `header-overlay-opacity`: defaults to 0.5
- `header-accent-color`: defaults to "primary"
- `header-title`: falls back to page.title
- Missing images: graceful degradation to text-only

