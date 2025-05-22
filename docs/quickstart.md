---
title: Quickstart Guide
nav_order: 2
---

# Quickstart Guide

This guide provides a quick overview of how to get your annotated playscript published using Digital Dramaturgy.

## How it Works: A Broad Overview

Digital Dramaturgy offers a three-part framework that allows users to:

1.  Start building their annotated playscript using a Google Sheet.
2.  Test how the script appears on our site by publishing it via Google Sheets and connecting the link created when you do so to our main Digital Dramaturgy site.
3.  Create their own website by making a copy of the [Digital Dramaturgy GitHub repository](https://github.com/thecdil/dramabase) and then replacing the base information collected with their own.

## Step 1: Prepare your Script

You have two options to prepare your script:

#### Option A: Use a Prepared Shakespeare Play

We have starter sheets prepared for all of Shakespeare's plays. These are based on [a dataset found on Kaggle.com](https://www.kaggle.com/datasets/kingburrito666/shakespeare-plays).
To use one, simply make a copy:
{% include annotate/setup/startershakespeare.html %}

#### Option B: Prepare Your Own Script

Use one of our starter spreadsheets:

-   [Starter Template with Notes and Examples](https://docs.google.com/spreadsheets/d/1poB0eUjzNKAul30uNSSTJWgduVcUKohb8CH2fKxypK8/copy)
-   [Blank Starter Template](https://docs.google.com/spreadsheets/d/1OD4D9xQe59fCAxJN0Aag30BkbKDPHXbM5J_m_hvhTAk/copy)

Ensure your spreadsheet includes the required fields. See the "[Preparing Your Content](preparing-content.md)" section for more details.

## Step 2: Make your Script Publicly Available Using Google Sheets

1.  In your Google Sheet, click "File" and select "Publish to the Web".
2.  In the popup modal, use the dropdowns in the "Link" tab to select the sheet name of your metadata (usually "Sheet 1") and "Comma-separated values (.csv)" options, then click the "Publish" button.
3.  Copy the link that is provided.

## Step 3: View Your Playscript Spreadsheet on Digital Dramaturgy

-   Paste the link you copied in Step 2 into the form on the [Digital Dramaturgy site](https://digitaldramaturgy.github.io/directions.html) (look for the input field under "View Your Playscript Spreadsheet").
-   Click around and check your play. Any edits you make to your Google Sheet will update your site.
-   If you make edits, click the "Refresh Playscript Data" button via the side-nav menu to refresh the website.

#### Share Your Temporary Site

You can share a link to this temporary site by adding your Google Sheet link as a parameter:
`https://digitaldramaturgy.github.io?play={YOUR GOOGLE SHEET LINK HERE}`

## Step 4: Set Up Your Own GitHub Repository

_You will need a GitHub account for this step._

1.  Go to the [Digital Dramaturgy GitHub Repository](https://github.com/thecdil/dramabase).
2.  Click the green "Use this template" button and then "Create a new repository".
3.  Leave the repository as Public. Enter a repository name (use a lowercase name without spaces or odd characters) and click "Create repository from template".
4.  Open the `_config.yml` file in your new repository and find the "play" variable.
5.  Enter your published Google Sheets link, a relative link to a CSV file in the repository (e.g., `/assets/data/play_example.csv`), or a link to an externally hosted CSV file.

## Step 5: Deploy Your Site via GitHub Pages

1.  In your project repository's GitHub page, click "Settings".
2.  Go to "Pages" in the left side menu.
3.  Under "Build and Deployment" > "Source", select "GitHub Actions".
4.  If a "GitHub Pages Jekyll" option appears, click "Configure". A workflow file will open.
5.  Click "Commit changes..." and then "Commit changes" again.

GitHub will build and deploy your site. This usually takes 2-5 minutes for the first build. Your site will be available at: `https://[your-username].github.io/[repository-name]/`.

For more detailed instructions, please refer to the specific documentation sections.
