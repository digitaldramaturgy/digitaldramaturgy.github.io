# Parse Play Script Utility

## Overview

The `parse_play.py` script is a utility for converting Shakespeare play scripts from markdown format to CSV. This tool was created to process Google Docs that have been downloaded as markdown files, transforming them into structured data suitable for use with CollectionBuilder and other data visualization tools.

## Location

**Script:** `/parse_play.py` (in repository root)

## Input/Output Files

### Input
- **File:** `Midsummer_Dream1stCut.md`
- **Location:** Repository root
- **Format:** Markdown file with structured play text

The input markdown file should follow this format:
- Acts marked with: `### **ACT I**`, `### **ACT II**`, etc.
- Scenes marked with: `### **SCENE I.**`, `### **SCENE II.**`, etc.
- Character names in bold: `**CHARACTER NAME**`
- Stage directions in italics: `*Enter HAMLET*` or `*Exeunt*`
- Dialogue as plain text following character names

### Output
- **File:** `midsummer_dream_parsed.csv`
- **Location:** `_data/` directory
- **Format:** CSV with columns: `act`, `scene`, `player`, `text`

Each line of dialogue or stage direction becomes a separate row in the CSV, making it easy to analyze, visualize, or integrate into web-based presentations.

## Usage

To run the script:

```bash
python parse_play.py
```

The script will automatically:
1. Read from `Midsummer_Dream1stCut.md`
2. Parse the markdown structure
3. Output to `_data/midsummer_dream_parsed.csv`
4. Print a summary of processed entries

## How It Works

The script uses regular expressions to identify:
1. **Act markers:** Roman numerals in heading format
2. **Scene markers:** Roman numerals with scene designation
3. **Stage directions:** Text enclosed in single asterisks (italics in markdown)
4. **Character names:** Text in double asterisks (bold in markdown)
5. **Dialogue:** Plain text following a character name

Each element is captured with its act and scene context, creating a structured dataset that preserves the play's organization while making the text analyzable.

## Use Cases

This parsed data can be used for:
- Character network analysis
- Timeline visualizations
- Digital dramaturgy research
- Text analysis and distant reading
- Interactive play script presentations
- Data-driven theatrical insights

## Adapting for Other Plays

To parse a different play:
1. Download your Google Doc as markdown
2. Ensure it follows the formatting conventions above
3. Update the `input_file` variable in `parse_play.py` to point to your new markdown file
4. Optionally update the `output_file` variable to change the output location
5. Run the script

## Example Data Structure

The output CSV has this structure:

```csv
act,scene,player,text
I,I,StageDirection,"Enter THESEUS, HIPPOLYTA, PHILOSTRATE, and Attendants."
I,I,THESEUS,"Now, fair Hippolyta, our nuptial hour"
I,I,THESEUS,Draws on apace; four happy days bring in
I,I,HIPPOLYTA,Four days will quickly steep themselves in night;
```

## Related Documentation

- [Data Documentation](data.md) - Information about data exports and formats
- [Character System](character-system.md) - Using parsed play data for character analysis
- [Metadata](metadata.md) - Working with CollectionBuilder metadata

## Notes

This script is provided as-is for the Digital Dramaturgy project. It's a simple utility designed for a specific workflow (Google Docs → Markdown → CSV), but can be adapted for similar text parsing needs.

If you use or adapt this script for your own project, feel free to modify it to suit your needs. The regular expressions can be adjusted for different markdown formatting conventions.
