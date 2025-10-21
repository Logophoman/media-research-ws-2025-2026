// literature-matrix-tool.js (FINAL, ROBUST VERSION)

document.addEventListener('DOMContentLoaded', () => {
    const toolContainer = document.getElementById('lit-matrix-tool');
    if (!toolContainer) return;

    const tableBody = document.getElementById('lit-matrix-body');
    const addRowBtn = document.getElementById('matrix-add-row-btn');
    const exportCsvBtn = document.getElementById('matrix-export-csv-btn');
    const importInput = document.getElementById('matrix-import-csv-input');

    let matrixData = [];
    const columns = ['author', 'title', 'theory', 'method', 'findings', 'notes'];

    // --- Core Functions ---
    const saveState = () => localStorage.setItem('literatureMatrixData', JSON.stringify(matrixData));

    function render() {
        tableBody.innerHTML = '';
        matrixData.forEach((rowData, index) => {
            const tr = document.createElement('tr');
            tr.dataset.index = index;

            columns.forEach(col => {
                const td = document.createElement('td');
                td.setAttribute('contenteditable', 'true');
                td.dataset.col = col;
                td.textContent = rowData[col] || '';
                tr.appendChild(td);
            });

            const actionsTd = document.createElement('td');
            actionsTd.className = 'row-actions';
            actionsTd.innerHTML = `<button class="delete-row-btn" title="Delete Row">🗑️</button>`;
            tr.appendChild(actionsTd);

            tableBody.appendChild(tr);
        });
        saveState();
    }

    // --- Event Handlers (using delegation) ---
    addRowBtn.addEventListener('click', () => {
        const newRow = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
        matrixData.push(newRow);
        render();
    });

    tableBody.addEventListener('click', (e) => {
        if (e.target.matches('.delete-row-btn')) {
            const tr = e.target.closest('tr');
            const index = parseInt(tr.dataset.index);
            if (confirm('Are you sure you want to delete this row?')) {
                matrixData.splice(index, 1);
                render();
            }
        }
    });

    tableBody.addEventListener('focusout', (e) => {
        if (e.target.matches('td[contenteditable="true"]')) {
            const tr = e.target.closest('tr');
            const index = parseInt(tr.dataset.index);
            const col = e.target.dataset.col;
            matrixData[index][col] = e.target.textContent;
            saveState();
        }
    });

    // --- CORRECTED EXPORT FUNCTION ---
    exportCsvBtn.addEventListener('click', () => {
        const headers = ["Author(s) & Year", "Title", "Theory/Framework", "Method", "Key Findings", "Your Notes & Relevance"];

        const processRow = (row) => row.map(field => {
            const data = String(field || '').replace(/"/g, '""');
            return `"${data}"`;
        }).join(',');

        let csvContent = processRow(headers) + '\r\n';

        matrixData.forEach(row => {
            const rowData = columns.map(col => row[col]);
            csvContent += processRow(rowData) + '\r\n';
        });

        const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "literature_matrix.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // --- CORRECTED IMPORT FUNCTION ---
    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csv = event.target.result;
                const lines = csv.split(/\r\n|\n/).filter(line => line.trim() !== ''); // Filter out empty lines

                // Remove header line
                lines.shift();

                const importedData = lines.map(line => {
                    const values = parseCsvLine(line);
                    return {
                        author: values[0] || '',
                        title: values[1] || '',
                        theory: values[2] || '',
                        method: values[3] || '',
                        findings: values[4] || '',
                        notes: values[5] || '',
                    };
                });

                if (confirm('This will overwrite the current matrix with the imported data. Proceed?')) {
                    matrixData = importedData;
                    render();
                }

            } catch (error) {
                alert(`Import failed: ${error.message}`);
                console.error("CSV Import Error:", error);
            } finally {
                importInput.value = '';
            }
        };
        reader.readAsText(file);
    });

    /**
     * A robust CSV line parser that correctly handles quoted fields and empty values.
     * This is the key to fixing the "shift left" problem.
     */
    function parseCsvLine(line) {
        const fields = [];
        let currentField = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    currentField += '"'; // It's an escaped quote
                    i++; // Skip the next character
                } else {
                    inQuotes = !inQuotes; // It's a starting or ending quote
                }
            } else if (char === ',' && !inQuotes) {
                fields.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        fields.push(currentField); // Add the last field
        return fields;
    }

    // --- Initial Load ---
    function loadState() {
        const savedData = localStorage.getItem('literatureMatrixData');
        if (savedData) {
            try {
                matrixData = JSON.parse(savedData);
            } catch (e) {
                console.error('Could not parse saved literature matrix data.');
                matrixData = [];
            }
        }

        // If storage is empty (first time user), pre-populate with the example.
        if (matrixData.length === 0) {
            const exampleRow = {
                author: 'Schlütz, D., & Hedder, I. (2021)',
                title: 'Aural Parasocial Relations: Host–Listener Relationships in Podcasts.',
                theory: 'Parasocial Interaction (PSI) & Relationships (PSR)',
                method: 'Exploratory online survey of German podcast listeners (n = 804).',
                findings: 'Host characteristics (authenticity, competence, unpredictability) and PSI behaviors (e.g., self-disclosure) positively predict the strength of PSR. Stronger PSR, in turn, correlates with persuasive effects on listeners\' attitudes and behaviors.',
                notes: 'PERFECT for our topic! Uses a German sample. Confirms that host traits are key for building relationships. The main gap: It\'s a general survey and doesn\'t compare specific formats (solo vs. interview) or genres (like comedy). We can build directly on their findings by adding a comparative design.'
            };
            matrixData.push(exampleRow);
        }
        render();
    }

    loadState();
});