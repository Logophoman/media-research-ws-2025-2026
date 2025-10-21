// session2.js - Interactivity for the second session with Advanced Group Manager

document.addEventListener('DOMContentLoaded', function() {
    setupCollapsibleSections();
    setupGroupManager();
});

function setupCollapsibleSections() {
    const triggers = document.querySelectorAll('.collapsible-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const isExpanded = content.style.maxHeight && content.style.maxHeight !== "0px";
            if (isExpanded) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

function setupGroupManager() {
    const listElement = document.getElementById('group-list-dynamic');
    const addBtn = document.getElementById('add-new-group-btn');
    const saveBtn = document.getElementById('save-to-browser-btn');
    const exportBtn = document.getElementById('export-json-btn');
    const importInput = document.getElementById('import-json-input');
    const statusEl = document.getElementById('group-tool-status');

    let groups = [];

    // --- Core Functions ---

    /** Renders the entire list based on the 'groups' array */
    function render() {
        listElement.innerHTML = '';
        if (groups.length === 0) {
            listElement.innerHTML = '<li class="empty-list">No groups created yet. Click "Add New Group" to start.</li>';
        } else {
            groups.forEach((groupText, index) => {
                const li = document.createElement('li');
                li.className = 'group-item';
                li.dataset.index = index;
                li.innerHTML = `
                    <strong class="group-label">Group ${index + 1}:</strong>
                    <span class="group-members">${escapeHTML(groupText) || 'Click Edit to add members...'}</span>
                    <input type="text" class="group-edit-input" value="${escapeHTML(groupText)}">
                    <div class="group-item-actions">
                        <button class="action-edit" title="Edit Group">✏️</button>
                        <button class="action-delete" title="Delete Group">🗑️</button>
                        <button class="action-save" title="Save Changes">✔️</button>
                        <button class="action-cancel" title="Cancel Edit">❌</button>
                    </div>
                `;
                listElement.appendChild(li);
            });
        }
    }

    /** Switches a list item to its editing state */
    function enterEditMode(li) {
        li.classList.add('editing');
        const input = li.querySelector('.group-edit-input');
        input.focus();
        input.select();
    }

    /** Updates the status message with timed fade-out */
    function showStatus(message, type = 'info', duration = 2000) {
        statusEl.textContent = message;
        statusEl.className = `group-tool-status ${type}`;
        setTimeout(() => {
            statusEl.textContent = 'Ready';
            statusEl.className = 'group-tool-status';
        }, duration);
    }
    
    // --- Event Handlers ---

    listElement.addEventListener('click', (e) => {
        const li = e.target.closest('.group-item');
        if (!li) return;
        const index = parseInt(li.dataset.index);

        if (e.target.matches('.action-edit')) {
            enterEditMode(li);
        } else if (e.target.matches('.action-delete')) {
            if (confirm(`Are you sure you want to delete Group ${index + 1}?`)) {
                groups.splice(index, 1);
                render();
            }
        } else if (e.target.matches('.action-save')) {
            const newText = li.querySelector('.group-edit-input').value.trim();
            groups[index] = newText;
            render();
        } else if (e.target.matches('.action-cancel')) {
            render(); // Simply re-render to discard changes
        }
    });
    
    listElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.matches('.group-edit-input')) {
            e.target.closest('.group-item').querySelector('.action-save').click();
        } else if (e.key === 'Escape' && e.target.matches('.group-edit-input')) {
             e.target.closest('.group-item').querySelector('.action-cancel').click();
        }
    });

    addBtn.addEventListener('click', () => {
        groups.push('');
        render();
        const lastItem = listElement.querySelector('.group-item:last-child');
        if (lastItem) enterEditMode(lastItem);
    });

    // --- Persistence & File Operations ---

    function saveToBrowser() {
        localStorage.setItem('researchGroups2025', JSON.stringify(groups));
        showStatus('Groups saved to browser!', 'success');
    }
    
    function loadFromBrowser() {
        const savedData = localStorage.getItem('researchGroups2025');
        if (savedData) {
            try {
                groups = JSON.parse(savedData);
                showStatus('Loaded saved groups from browser.');
            } catch (e) {
                console.error('Failed to parse saved groups:', e);
            }
        }
        render();
    }

    saveBtn.addEventListener('click', saveToBrowser);

    exportBtn.addEventListener('click', () => {
        if (groups.length === 0) {
            showStatus('Nothing to export.', 'error');
            return;
        }
        const dataStr = JSON.stringify(groups, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'research-groups-backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showStatus('Exported to file.', 'success');
    });

    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedGroups = JSON.parse(event.target.result);
                if (Array.isArray(importedGroups) && importedGroups.every(item => typeof item === 'string')) {
                    if (confirm('This will overwrite the current group list. Proceed?')) {
                        groups = importedGroups;
                        render();
                        showStatus('Groups imported successfully!', 'success');
                    }
                } else {
                    throw new Error('Invalid file format.');
                }
            } catch (error) {
                showStatus('Import failed. Invalid JSON file.', 'error');
                console.error('Import error:', error);
            } finally {
                importInput.value = ''; // Reset input
            }
        };
        reader.readAsText(file);
    });
    
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"']/g, function(match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match];
        });
    }

    // --- Initial Load ---
    loadFromBrowser();
}