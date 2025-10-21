// pitchboard-tool.js (Revised for Stable Layout)

document.addEventListener('DOMContentLoaded', () => {
    const toolContainer = document.getElementById('pitchboard-tool');
    if (!toolContainer) return;

    const slider = document.getElementById('pitchboard-slider');
    const addBoardBtn = document.getElementById('add-board-btn');
    const exportBtn = document.getElementById('export-boards-btn');
    const importInput = document.getElementById('import-boards-input');

    let boards = [];
    const colorPalette = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];

    // --- Core Functions ---

    const saveState = () => localStorage.setItem('pitchBoardsData', JSON.stringify(boards));
    const generateColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)];

    function render() {
        slider.innerHTML = '';
        boards.forEach((board, boardIndex) => {
            const boardEl = document.createElement('div');
            boardEl.className = 'pitch-board';
            boardEl.dataset.index = boardIndex;

            // The board-canvas is now a UL for a structured list
            boardEl.innerHTML = `
                <div class="board-header">
                    <h4 class="board-title" contenteditable="true">${escapeHTML(board.title)}</h4>
                    <div class="board-actions">
                        <button class="export-board-png-btn" title="Export as Image">🖼️</button>
                        <button class="delete-board-btn" title="Delete Board">🗑️</button>
                    </div>
                </div>
                <ul class="board-canvas"></ul> 
                <div class="board-input-area">
                    <input type="text" class="idea-input" placeholder="Add a keyword or idea...">
                    <button class="add-idea-btn">Add</button>
                </div>
            `;
            
            const canvas = boardEl.querySelector('.board-canvas');

            // Render ideas into the UL
            if (board.ideas.length > 0) {
                board.ideas.forEach((idea, ideaIndex) => {
                    const ideaEl = document.createElement('li'); // Ideas are now LI elements
                    ideaEl.className = 'idea-bubble';
                    ideaEl.dataset.index = ideaIndex;
                    ideaEl.style.backgroundColor = idea.color; // Use the saved color
                    ideaEl.innerHTML = `${escapeHTML(idea.text)} <span class="delete-idea" title="Delete Idea">×</span>`;
                    canvas.appendChild(ideaEl);
                });
            } else {
                canvas.innerHTML = '<li class="empty-canvas-msg">No ideas yet...</li>';
            }

            slider.appendChild(boardEl);
        });
        saveState();
    }

    // --- Event Handlers using Delegation ---

    toolContainer.addEventListener('click', e => {
        const boardEl = e.target.closest('.pitch-board');
        const boardIndex = boardEl ? parseInt(boardEl.dataset.index) : -1;
        if (boardIndex === -1) return;

        // Add Idea
        if (e.target.matches('.add-idea-btn')) {
            const input = boardEl.querySelector('.idea-input');
            const text = input.value.trim();
            if (text) {
                // Assign color ONCE at creation
                boards[boardIndex].ideas.push({ text, color: generateColor() });
                input.value = '';
                render();
            }
        }

        // Delete Idea
        if (e.target.matches('.delete-idea')) {
            const ideaEl = e.target.closest('.idea-bubble');
            const ideaIndex = parseInt(ideaEl.dataset.index);
            boards[boardIndex].ideas.splice(ideaIndex, 1);
            render();
        }

        // Delete Board
        if (e.target.matches('.delete-board-btn')) {
            if (confirm(`Are you sure you want to delete "${boards[boardIndex].title}"?`)) {
                boards.splice(boardIndex, 1);
                render();
            }
        }
        
        // Export Board as PNG
        if (e.target.matches('.export-board-png-btn')) {
            if (typeof html2canvas !== 'function') {
                alert('Error: html2canvas library not found.');
                return;
            }
            html2canvas(boardEl, { backgroundColor: '#ffffff' }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `${boards[boardIndex].title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                link.click();
            });
        }
    });
    
    // Handle title edits
    toolContainer.addEventListener('focusout', e => {
        if (e.target.matches('.board-title')) {
            const boardEl = e.target.closest('.pitch-board');
            const boardIndex = parseInt(boardEl.dataset.index);
            boards[boardIndex].title = e.target.textContent.trim();
            saveState();
        }
    });
    
    // Handle 'Enter' key in input fields
    toolContainer.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            if (e.target.matches('.idea-input')) {
                e.preventDefault();
                e.target.nextElementSibling.click(); // Click the 'Add' button
            }
            if (e.target.matches('.board-title')) {
                e.preventDefault();
                e.target.blur(); // Save the title
            }
        }
    });

    // --- Main Controls ---

    addBoardBtn.addEventListener('click', () => {
        boards.push({
            title: `Group ${boards.length + 1}: New Idea`,
            ideas: []
        });
        render();
        slider.scrollLeft = slider.scrollWidth; // Auto-scroll to the new board
    });

    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(boards, null, 2);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([dataStr], { type: 'application/json' }));
        link.download = 'pitchboards.json';
        link.click();
    });

    importInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const importedBoards = JSON.parse(event.target.result);
                    if (Array.isArray(importedBoards)) {
                        boards = importedBoards;
                        render();
                    } else { throw new Error('Invalid format'); }
                } catch (err) {
                    alert('Failed to import file. Please ensure it is a valid JSON export from this tool.');
                }
            };
            reader.readAsText(file);
        }
    });
    
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }

    // --- Initial Load ---

    function loadState() {
        const savedData = localStorage.getItem('pitchBoardsData');
        if (savedData) {
            try { boards = JSON.parse(savedData); } catch (e) { console.error('Could not parse saved data.'); }
        }
        render();
    }
    
    loadState();
});