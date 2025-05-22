---
title: Preparing Your Content
nav_order: 3
layout: docs_page
---

# Preparing Your Content

The core of your Digital Dramaturgy project is a playscript structured as a CSV (Comma Separated Values) file, which you will typically manage using Google Sheets.

## Using Google Sheets

Google Sheets provides a user-friendly interface for creating and managing your playscript data.

### Options for Starting Your Script:

1.  **Use a Prepared Shakespeare Play:**
    We offer starter sheets for all of Shakespeare's plays. These are pre-formatted and ready for you to copy and customize. You can find these options in the "Step 1: Prepare your Script" section of the [Quickstart Guide](quickstart.md).
    These are based on [a dataset found on Kaggle.com](https://www.kaggle.com/datasets/kingburrito666/shakespeare-plays).

2.  **Prepare Your Own Script with a Template:**
    If you are working with a play other than Shakespeare's, or prefer to start from scratch, we provide two starter templates:
    *   [Starter Template with Notes and Examples](https://docs.google.com/spreadsheets/d/1poB0eUjzNKAul30uNSSTJWgduVcUKohb8CH2fKxypK8/copy): This template includes example lines from *Measure for Measure* and notes about each field. Remember to delete these example rows before publishing!
    *   [Blank Starter Template](https://docs.google.com/spreadsheets/d/1OD4D9xQe59fCAxJN0Aag30BkbKDPHXbM5J_m_hvhTAk/copy): This is a clean slate for your data.

## Required Fields

For the Digital Dramaturgy platform to correctly process and display your playscript, your Google Sheet (or CSV file) **must** include the following columns/fields:

*   `playerline` (or `line_number`): This field contains the actual text of the character's line or stage direction.
*   `player` (or `speaker`): This field indicates the character speaking the line. For stage directions or non-dialogue text, you might leave this blank or use a consistent term like "Stage Direction".
*   `act`: The act number in which the line appears (e.g., `1`, `2`).
*   `scene`: The scene number within the act (e.g., `1`, `2a`).
*   `lineID` (or `newlinenum` or `scene_line_number`): A unique identifier for each line within its scene (e.g., `1.1.1`, `1.1.2` for Act 1, Scene 1, Lines 1 and 2; or simply `1`, `2`, `3` sequentially within each scene). This is crucial for linking annotations and other features.

**Note:** The alternative column names in parentheses (e.g., `line_number` for `playerline`) are also recognized by the platform for flexibility with different data sources. However, it's recommended to stick to one set of names for consistency. The "Starter Template with Notes and Examples" provides further guidance on these fields.

## Adding Annotations and Other Information

Beyond these required fields, you can add more columns to your spreadsheet to include annotations, notes, character information, or any other relevant data. These additional columns can then be configured to display on your Digital Dramaturgy site. Refer to the CollectionBuilder documentation for more advanced customization options.
