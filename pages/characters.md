---
title: Characters
layout: page
permalink: /characters.html
# add custom CSS for characters page
custom-foot: dramaturgy/js/character-interactions-js.html
---

## Characters

Explore the characters in this dramatic work through interactive cards and detailed character information.

{% include dramaturgy/js/character-csv-data.html %}
{% include dramaturgy/feature/character-cards.html %}
{% include dramaturgy/feature/character-detail.html %}


<!-- Character Detail Modal -->
<div class="modal fade" id="characterDetailModal" tabindex="-1" aria-labelledby="characterDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="characterDetailModalLabel">Character Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="cleanupCharacterModal()"></button>
            </div>
            <div class="modal-body" id="characterDetailContent">
                <!-- Content will be populated by JavaScript -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="cleanupCharacterModal()">Close</button>
            </div>
        </div>
    </div>
</div>
