---
title: Troubleshooting
nav_order: 5
---

# Troubleshooting

This page is intended to provide solutions to common problems encountered while setting up or using your Digital Dramaturgy site.

**Common Issues & Solutions:**

*   **(Placeholder)** *Issue: My Google Sheet data is not appearing on the site.*
    *   **Solution Check 1:** Ensure you have published your Google Sheet to the web as a CSV, selecting the correct sheet (not the entire document). See the "[Publishing Your Site](publishing-site.md)" guide.
    *   **Solution Check 2:** Double-check the URL in your `_config.yml` (for self-hosted sites) or the URL used for testing on the main Digital Dramaturgy site. It must be the direct CSV link from Google Sheets.
    *   **Solution Check 3:** Wait a few minutes. Sometimes there's a slight delay for Google Sheets to update its published version. You can also try the "Refresh Playscript Data" button if available on the site.

*   **(Placeholder)** *Issue: My GitHub Pages site is not building or shows a 404 error.*
    *   **Solution Check 1:** Verify that you have selected "GitHub Actions" as the source in your repository's **Settings > Pages**.
    *   **Solution Check 2:** Check the **Actions** tab in your repository for any build errors. Click on the failed workflow run to see the logs, which might indicate the problem (e.g., incorrect `_config.yml` formatting).
    *   **Solution Check 3:** Ensure your repository is public, as private repositories might have different behaviors with GitHub Pages.
    *   **Solution Check 4:** Confirm the URL you are using is correct: `https://<your-username>.github.io/<repository-name>/`.

---

*This section is under development. If you encounter issues not listed here, or have solutions to common problems, please consider [opening an issue](https://github.com/thecdil/dramabase/issues) on our GitHub repository to help us improve this documentation.*
