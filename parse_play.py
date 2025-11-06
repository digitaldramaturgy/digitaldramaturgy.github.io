#!/usr/bin/env python3
"""
Parse Play Script from Markdown to CSV

This script converts a Shakespeare play script from markdown format to CSV.
It was created to process a Google Doc that was downloaded as markdown.

INPUT:  Midsummer_Dream1stCut.md
        - Markdown file with play text
        - Acts marked with ### **ACT I**, ### **ACT II**, etc.
        - Scenes marked with ### **SCENE I.**, ### **SCENE II.**, etc.
        - Character names in bold: **CHARACTER NAME**
        - Stage directions in italics: *Enter HAMLET*
        - Dialogue as plain text following character names

OUTPUT: _data/midsummer_dream_parsed.csv
        - CSV with columns: act, scene, player, text
        - Each line of dialogue or stage direction becomes a row
        - Ready for use with CollectionBuilder or other data visualization tools

USAGE:
    python parse_play.py

The script will automatically process Midsummer_Dream1stCut.md and output
to _data/midsummer_dream_parsed.csv.

Author: Digital Dramaturgy Project
Date: 2025
"""

import re
import csv
import sys
import os

def parse_play_markdown(input_file, output_file):
    """Parse a Shakespeare play markdown file and convert to CSV format."""
    
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.", file=sys.stderr)
        print(f"Please ensure the file exists in the current directory.", file=sys.stderr)
        sys.exit(1)
    
    # Initialize variables
    current_act = ""
    current_scene = ""
    current_player = ""
    rows = []
    
    # Patterns for parsing
    act_pattern = r'###\s*\*\*ACT\s+([IVX]+)\*\*'
    scene_pattern = r'###\s*\*\*SCENE\s+([IVX]+)\.'
    character_pattern = r'^\*\*([A-Z][A-Z\s\(\)]+)\*\*\s*$'
    stage_direction_pattern = r'^\*([^*].+?)\*\s*$'
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except IOError as e:
        print(f"Error: Unable to read file '{input_file}': {e}", file=sys.stderr)
        sys.exit(1)
    
    for line in lines:
        line = line.strip()
        
        # Skip empty lines
        if not line:
            continue
            
        # Check for Act
        act_match = re.search(act_pattern, line)
        if act_match:
            current_act = act_match.group(1)
            continue
            
        # Check for Scene
        scene_match = re.search(scene_pattern, line)
        if scene_match:
            current_scene = scene_match.group(1)
            continue
            
        # Check for stage directions (single asterisk italicized text)
        stage_match = re.search(stage_direction_pattern, line)
        if stage_match:
            stage_text = stage_match.group(1)
            rows.append([current_act, current_scene, "StageDirection", stage_text])
            continue
            
        # Check for character name (double asterisk bolded text)
        char_match = re.search(character_pattern, line)
        if char_match:
            current_player = char_match.group(1).strip()
            continue
            
        # If we have a current player and this is regular text (not markdown formatting), it's dialogue
        if current_player and line and not line.startswith('#') and not line.startswith('*'):
            rows.append([current_act, current_scene, current_player, line])
    
    # Write to CSV
    try:
        # Ensure output directory exists
        output_dir = os.path.dirname(output_file)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['act', 'scene', 'player', 'text'])
            writer.writerows(rows)
    except IOError as e:
        print(f"Error: Unable to write to file '{output_file}': {e}", file=sys.stderr)
        sys.exit(1)
    
    print(f"Processed {len(rows)} entries from {input_file}")
    print(f"Output written to {output_file}")

if __name__ == "__main__":
    input_file = "Midsummer_Dream1stCut.md"
    output_file = "_data/midsummer_dream_parsed.csv"
    
    parse_play_markdown(input_file, output_file)