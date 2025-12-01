document.addEventListener('DOMContentLoaded', function() {
    setupWisdomModules();
});

/**
 * Handles the Accordion logic for the Shared Wisdom Modules.
 * Toggles the 'open' class and animates max-height for smooth transitions.
 */
function setupWisdomModules() {
    const headers = document.querySelectorAll('.module-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const module = header.parentElement;
            const content = module.querySelector('.module-content');
            
            if (!content) return;

            // Check if this module is already open
            const isOpen = module.classList.contains('open');
            
            // 1. Close all other modules (Accordion behavior)
            // If you want them to stay open independently, remove this block.
            document.querySelectorAll('.wisdom-module').forEach(otherModule => {
                if (otherModule !== module && otherModule.classList.contains('open')) {
                    otherModule.classList.remove('open');
                    otherModule.querySelector('.module-content').style.maxHeight = null;
                }
            });

            // 2. Toggle the clicked module
            if (isOpen) {
                // Close
                module.classList.remove('open');
                content.style.maxHeight = null;
            } else {
                // Open
                module.classList.add('open');
                // We set a specific pixel height to allow CSS transition to animate
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupAuditAccordion();
    setupGenericValidators();
});

/**
 * Handles the expansion of the individual group feedback cards.
 */
function setupAuditAccordion() {
    const cards = document.querySelectorAll('.audit-card');

    cards.forEach(card => {
        const header = card.querySelector('.audit-summary');
        
        header.addEventListener('click', () => {
            const details = card.querySelector('.audit-details');
            const isExpanded = card.classList.contains('expanded');

            // Optional: Close others (Focus Mode)
            cards.forEach(c => {
                if (c !== card && c.classList.contains('expanded')) {
                    c.classList.remove('expanded');
                    c.querySelector('.audit-details').style.maxHeight = null;
                }
            });

            if (isExpanded) {
                card.classList.remove('expanded');
                details.style.maxHeight = null;
            } else {
                card.classList.add('expanded');
                details.style.maxHeight = details.scrollHeight + "px";
            }
        });
    });
}
function setupGenericValidators() {
    // Find all distinct group IDs present on the page
    const groups = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g8'];

    groups.forEach(groupId => {
        const checks = document.querySelectorAll(`.audit-check[data-group="${groupId}"], .${groupId}-check`); // Support both data-attr and class naming
        const progressBar = document.getElementById(`${groupId}-progress`);
        const statusMessage = document.getElementById(`${groupId}-message`);

        // Skip if this group doesn't exist on page yet
        if (!checks.length || !progressBar || !statusMessage) return;

        function updateGroupStatus() {
            let totalWeight = 0;
            let currentWeight = 0;

            checks.forEach(check => {
                const weight = parseInt(check.dataset.weight || 100 / checks.length);
                totalWeight += weight;
                if (check.checked) {
                    currentWeight += weight;
                }
            });

            // Calculate percentage (capped at 100)
            const percent = Math.min(100, Math.round((currentWeight / totalWeight) * 100));

            // Update UI
            progressBar.style.width = `${percent}%`;

            if (percent === 0) {
                statusMessage.textContent = "Awaiting Check...";
                statusMessage.style.color = "#666";
            } else if (percent < 100) {
                statusMessage.textContent = `${percent}% Ready - Keep Checking`;
                statusMessage.style.color = "#d9a406"; // Yellow
            } else {
                statusMessage.textContent = "🚀 Ready for Next Step";
                statusMessage.style.color = "#28a745"; // Green
            }
        }

        // Attach listeners
        checks.forEach(check => {
            check.addEventListener('change', updateGroupStatus);
        });
    });
}