---
title: Publishing Your Site
nav_order: 4
---

# Publishing Your Site

Once you have prepared your playscript content, the next steps involve making it publicly accessible and deploying your own instance of the Digital Dramaturgy site.

## Part 1: Making Your Script Publicly Available via Google Sheets

To allow Digital Dramaturgy (either the main site for testing or your own repository) to access your playscript, you need to publish your Google Sheet to the web as a CSV file.

1.  **Open your Google Sheet.**
2.  Click on **File** in the top menu.
3.  Select **Share**, and then choose **Publish to the web**.
4.  In the dialog box that appears:
    *   Under the **Link** tab.
    *   In the first dropdown, select the specific sheet that contains your playscript data (e.g., `Sheet1`, or whatever you have named it). **Do not select "Entire Document".**
    *   In the second dropdown, select **Comma-separated values (.csv)**.
5.  Click the **Publish** button.
6.  A confirmation box will ask if you're sure. Click **OK**.
7.  A URL will be generated in the dialog box. **Copy this URL.** This is the link to your publicly accessible CSV version of your playscript. You'll need it for testing on the main Digital Dramaturgy site or for configuring your own repository.

**Important Notes:**
*   Any changes you make to your Google Sheet will automatically be reflected in the published CSV, usually within a few minutes.
*   If you later decide to unpublish the sheet, you can do so from the same "Publish to the web" dialog by clicking "Stop publishing".

## Part 2: Viewing Your Playscript on the Main Digital Dramaturgy Site (Optional Testing)

Before setting up your own site, you can test how your playscript looks using the main Digital Dramaturgy platform:

1.  Navigate to the [Digital Dramaturgy site's "Directions" page](https://digitaldramaturgy.github.io/directions.html).
2.  Look for the input field under the section "Step 3: View Your Playscript Spreadsheet on Digital Dramaturgy".
3.  Paste the Google Sheet CSV URL (that you copied in Part 1, Step 7) into this field.
4.  Click **Submit**.
5.  Your playscript should now be displayed. You can click the "Refresh Playscript Data" button in the side-nav menu if you make live updates to your Google Sheet and want to see them immediately.

You can also share this temporary version by constructing a URL like this:
`https://digitaldramaturgy.github.io?play={YOUR GOOGLE SHEET CSV URL HERE}`

## Part 3: Setting Up Your Own GitHub Repository and Deploying via GitHub Pages

To have your own independent, customizable version of the Digital Dramaturgy site:

**Prerequisites:**
*   A [GitHub account](https://github.com/join).

**Steps:**

1.  **Create a New Repository from the Template:**
    *   Go to the [Digital Dramaturgy GitHub Repository](https://github.com/thecdil/dramabase).
    *   Click the green **Use this template** button (usually near the top of the page).
    *   Select **Create a new repository** from the dropdown.
    *   **Owner:** Ensure your GitHub username is selected.
    *   **Repository name:** Choose a name for your project (e.g., `my-play-project`). It's best to use lowercase letters and hyphens instead of spaces.
    *   **Privacy:** Select **Public**. (Private repositories may require different GitHub Pages configurations and might not be free).
    *   Click **Create repository from template**.

2.  **Configure Your Playscript Source:**
    *   In your newly created repository, navigate to the `_config.yml` file (it's in the main/root directory).
    *   Click the pencil icon (Edit this file) to edit it.
    *   Find the line that starts with `play:` (it should be near the top).
    *   Replace the existing example URL with **your published Google Sheet CSV URL** (from Part 1, Step 7).
        *   Alternatively, if you choose to host your CSV file directly within your repository (e.g., in the `/assets/data/` folder), you would put the relative path here (e.g., `/assets/data/my_play.csv`).
    *   Scroll to the bottom of the editing page and click **Commit changes**. You can use the default commit message or add your own.

3.  **Deploy with GitHub Pages:**
    *   In your repository, click on the **Settings** tab (usually on the right side of the top navigation bar within your repository).
    *   In the left sidebar, click on **Pages**.
    *   Under the "Build and deployment" section:
        *   For **Source**, select **GitHub Actions**.
    *   GitHub Actions will now handle the build and deployment. It might take a moment for the system to set up the initial workflow. If you see a prompt to configure a workflow (e.g., "GitHub Pages Jekyll"), click **Configure** or **Commit changes** for the suggested workflow file. This file (usually `jekyll.yml` or similar in `.github/workflows/`) tells GitHub how to build your Jekyll site.
    *   Once the workflow is set up (or if it was automatically configured), GitHub will start building your site. This first build can take 2-5 minutes.
    *   You can monitor the progress by going to the **Actions** tab in your repository. A yellow circle means it's in progress, a green checkmark means success, and a red X means failure.
    *   Once the build is successful, your site will be deployed to `https://<your-username>.github.io/<repository-name>/`. The URL will also be displayed in the **Settings > Pages** section.

Your Digital Dramaturgy site is now live! Any changes you commit to your repository (like updating the `_config.yml` or customizing pages) will trigger a new build and deployment.
