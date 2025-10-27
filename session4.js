// session4.js - Interactivity for the Self-Guided Research Lab

document.addEventListener('DOMContentLoaded', function () {
    setupCollapsibleSections();
    setupVariableDeconstructor();
    setupItemChecker();
    setupMeasurementClinic();
    setupSamplingGuide();
    setupInquiryDesignLab();
});

function setupCollapsibleSections() {
    const triggers = document.querySelectorAll('.collapsible-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            if (content && content.classList.contains('collapsible-content')) {
                const isExpanded = content.style.maxHeight && content.style.maxHeight !== "0px";
                if (isExpanded) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    });
}

/**
 * UPGRADED: Manages the new three-column operationalization canvas.
 */
function setupVariableDeconstructor() {
    const conceptInput = document.getElementById('concept-input');
    const startBtn = document.getElementById('start-deconstruction-btn');
    const canvas = document.getElementById('deconstruction-canvas');
    const canvasTitle = document.getElementById('canvas-title');

    // Get all column elements
    const dimensionInput = document.getElementById('dimension-input');
    const indicatorInput = document.getElementById('indicator-input');
    const itemInput = document.getElementById('item-input');
    const dimensionsList = document.getElementById('dimensions-list');
    const indicatorsList = document.getElementById('indicators-list');
    const itemsList = document.getElementById('items-list');

    // Generic function to create a removable tag
    const createTag = (text, listElement) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = text;
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-tag';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => tag.remove();
        tag.appendChild(deleteBtn);
        listElement.appendChild(tag);
    };

    // Pre-canned examples for guided learning
    const guidedExamples = {
        'credibility': {
            dims: ['Expertise', 'Trustworthiness'],
            inds: ["Host's qualifications", "Host's perceived honesty"],
            items: ["How qualified is the host to speak on this topic? (1-5 scale)", "I feel the host is honest in their opinions. (1-5 scale)"]
        },
        'purchase intent': {
            dims: ['Consideration', 'Likelihood'],
            inds: ['Willingness to learn more', 'Stated probability of buying'],
            items: ['How likely are you to search for this product online? (1-5 scale)', 'The next time I need a product like this, I will consider buying this brand. (1-5 scale)']
        }
    };

    startBtn.addEventListener('click', () => {
        const concept = conceptInput.value.trim().toLowerCase();
        if (concept) {
            canvasTitle.innerHTML = `Operationalization Canvas for: <span>${conceptInput.value.trim()}</span>`;
            canvas.classList.remove('canvas-hidden');
            // Clear all lists
            dimensionsList.innerHTML = '';
            indicatorsList.innerHTML = '';
            itemsList.innerHTML = '';

            // Populate with guided examples if a match is found
            if (guidedExamples[concept]) {
                const example = guidedExamples[concept];
                example.dims.forEach(t => createTag(t, dimensionsList));
                example.inds.forEach(t => createTag(t, indicatorsList));
                example.items.forEach(t => createTag(t, itemsList));
            }

        } else {
            alert('Please enter a concept to deconstruct.');
        }
    });

    // Add event listeners for all three input columns
    dimensionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && dimensionInput.value.trim()) {
            e.preventDefault();
            createTag(dimensionInput.value.trim(), dimensionsList);
            dimensionInput.value = '';
        }
    });

    indicatorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && indicatorInput.value.trim()) {
            e.preventDefault();
            createTag(indicatorInput.value.trim(), indicatorsList);
            indicatorInput.value = '';
        }
    });

    itemInput.addEventListener('keydown', (e) => {
        // We use Shift+Enter for new lines, Enter to submit
        if (e.key === 'Enter' && !e.shiftKey && itemInput.value.trim()) {
            e.preventDefault();
            createTag(itemInput.value.trim(), itemsList);
            itemInput.value = '';
        }
    });
}

function setupItemChecker() {
    const input = document.getElementById('item-checker-input');
    const feedbackEl = document.getElementById('item-checker-feedback');

    if (!input) return;

    // A more comprehensive and intelligent list of checks
    const checks = [
        {
            name: 'Double-Barreled Question',
            type: 'error',
            regex: /\s(and|or)\s/gi,
            feedback: (match) => `Contains <strong>'${match.trim()}'</strong>. This likely asks about two separate ideas in one question (e.g., "funny and trustworthy"). This can confuse respondents. <strong>Action:</strong> Split it into two distinct questions.`
        },
        {
            name: 'Leading Phrasing',
            type: 'warning',
            regex: /^(Don't you agree|Wouldn't you say|Isn't it true|Surely|Obviously|Clearly|Of course)/i,
            feedback: (match) => `The phrase <strong>'${match}'</strong> strongly suggests a desired answer, which biases the results. <strong>Action:</strong> Rephrase neutrally. For example, use "To what extent do you agree..."`
        },
        {
            name: 'Vague Quantifier',
            type: 'warning',
            regex: /\b(often|usually|regularly|frequently|sometimes|rarely|occasionally)\b/gi,
            feedback: (match) => `The word <strong>'${match}'</strong> is subjective and means different things to different people. <strong>Action:</strong> Use a concrete, objective timeframe. Instead of 'Do you listen often?', try 'How many days per week do you listen?'`
        },
        {
            name: 'Absolute Language',
            type: 'error',
            regex: /\b(always|never|all|every|none|every time)\b/gi,
            feedback: (match) => `Absolute words like <strong>'${match}'</strong> are extreme and can force respondents to give an inaccurate answer (e.g., few people 'always' do something). <strong>Action:</strong> Soften the language with options like 'Almost always' or use a frequency scale.`
        },
        {
            name: 'Loaded/Emotional Word',
            type: 'warning',
            regex: /\b(amazing|awful|terrible|horrible|fantastic|brilliant|stupid|disgusting|ridiculous)\b/gi,
            feedback: (match) => `The word <strong>'${match}'</strong> is highly emotional and can bias the response. <strong>Action:</strong> Replace it with a more neutral term. Instead of 'Was the episode awful?', try 'How would you rate the quality of the episode?'`
        },
        {
            name: 'Potential Germanism: "make to"',
            type: 'error',
            regex: /\bmake(s)?\s(you|one|listeners)\s(to)\s\w+/i,
            feedback: (match) => `The structure <strong>'${match}'</strong> is a common Germanism (machen zu). The verb 'make' doesn't use 'to' in this way. <strong>Correction:</strong> "Does the host make you <strong>feel</strong>..." instead of "...make you <strong>to feel</strong>..."`
        },
        {
            name: 'Potential Germanism: "since when"',
            type: 'warning',
            regex: /^since when/i,
            feedback: (match) => `<strong>'${match}'</strong> is a direct translation of "seit wann". A more natural English phrasing is "<strong>How long have you...</strong>" or "<strong>When did you start...</strong>".`
        },
        {
            name: 'Opinion as Yes/No',
            type: 'warning',
            regex: /^(Are you|Do you feel|Do you find|Is it)\s.*\b(satisfied|happy|interested|engaging|important|difficult)\b/i,
            feedback: () => `This question asks for an opinion or feeling but is phrased as a simple Yes/No. This loses valuable detail. <strong>Action:</strong> Consider using a Likert scale (e.g., "How satisfied are you with X, on a scale of 1 to 5?").`
        },
        {
            name: 'Jargon/Acronym',
            type: 'warning',
            regex: /\b(PSR|U&G|ELM|TAM|SDT)\b/g,
            feedback: (match) => `Contains the acronym <strong>'${match}'</strong>. While clear to you, this may be confusing for participants. <strong>Action:</strong> Ensure all acronyms and technical terms are either avoided or clearly defined.`
        }
    ];

    input.addEventListener('input', () => {
        const value = input.value.trim();
        feedbackEl.innerHTML = '';

        if (!value) return;

        let issuesFound = 0;
        checks.forEach(check => {
            // Use match with global flag to find all instances of a pattern
            const matches = value.match(check.regex);
            if (matches) {
                issuesFound += matches.length;
                // We only need to show the feedback once per rule, using the first match for context
                const firstMatch = matches[0];
                const feedbackSpan = document.createElement('span');
                feedbackSpan.className = 'feedback-warn';
                feedbackSpan.innerHTML = `<strong>${check.name}:</strong> ${check.feedback(firstMatch)}`;
                feedbackEl.appendChild(feedbackSpan);
            }
        });

        if (issuesFound === 0) {
            const feedbackSpan = document.createElement('span');
            feedbackSpan.className = 'feedback-ok';
            feedbackSpan.textContent = "✅ Looks good! No common structural issues detected.";
            feedbackEl.appendChild(feedbackSpan);
        }
    });
}

function setupMeasurementClinic() {
    const clinicExamples = document.querySelectorAll('.bad-good-example');

    clinicExamples.forEach(example => {
        const button = example.querySelector('.fix-it-btn');
        button.addEventListener('click', () => {
            const isRevealed = example.classList.toggle('is-revealed');
            button.textContent = isRevealed ? 'Hide Fix' : 'Show Fix';
        });
    });
}

function setupSamplingGuide() {
    // --- Part 1: Decision Tree Logic ---
    const treeContainer = document.getElementById('sampling-tree');
    const allNodes = treeContainer.querySelectorAll('.tree-node');
    const allRecommendations = treeContainer.querySelectorAll('.tree-recommendation');
    const optionButtons = treeContainer.querySelectorAll('.tree-options button');
    const resetButton = document.getElementById('reset-tree-btn');

    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextNodeId = button.dataset.next;
            const currentNode = button.closest('.tree-node');

            // Hide all nodes
            allNodes.forEach(node => node.classList.add('hidden'));

            // Show the next node or recommendation
            const nextElement = document.getElementById(nextNodeId);
            if (nextElement) {
                nextElement.classList.remove('hidden');
            }

            resetButton.classList.remove('hidden');
        });
    });

    resetButton.addEventListener('click', () => {
        allNodes.forEach((node, index) => {
            node.classList.toggle('hidden', index !== 0);
        });
        allRecommendations.forEach(rec => rec.classList.add('hidden'));
        resetButton.classList.add('hidden');
    });

    // --- Part 2: Sample Size Estimator Logic ---
    const studyTypeSelect = document.getElementById('study-type');
    const effectSizeSelect = document.getElementById('effect-size');
    const resultDiv = document.getElementById('sample-size-result');
    const outputP = document.getElementById('sample-size-output');

    // Conventional sample sizes for medium effect (most common assumption), power=.80, alpha=.05
    const sizeLookup = {
        corr: { small: 783, medium: 85, large: 28 },
        't-test': { small: 788, medium: 128, large: 52 },
        anova: { small: 969, medium: 159, large: 66 }
    };

    const perGroupText = {
        't-test': (n) => `~${n} total (${n / 2} per group)`,
        anova: (n) => `~${n} total (${Math.ceil(n / 3)} per group)`,
        corr: (n) => `~${n} total`
    };

    function updateSampleSize() {
        const studyType = studyTypeSelect.value;
        const effectSize = effectSizeSelect.value;

        if (studyType && effectSize) {
            const requiredN = sizeLookup[studyType][effectSize];
            outputP.textContent = perGroupText[studyType](requiredN);
            resultDiv.classList.remove('hidden');
        } else {
            resultDiv.classList.add('hidden');
        }
    }

    studyTypeSelect.addEventListener('change', updateSampleSize);
    effectSizeSelect.addEventListener('change', updateSampleSize);
}

function setupInquiryDesignLab() {
    const pathBtnTest = document.getElementById('path-btn-test');
    const builderContainer = document.getElementById('quantitative-builder');
    const outputContainer = document.getElementById('generator-output');
    const generateBtn = document.getElementById('generate-blueprint-btn');

    // Form Elements
    const hType = document.getElementById('h-type');
    const hIv = document.getElementById('h-iv');
    const hDv = document.getElementById('h-dv');
    const ivMeasure = document.getElementById('iv-measure');
    const dvMeasure = document.getElementById('dv-measure');
    const population = document.getElementById('population');
    const samplingStrategy = document.getElementById('sampling-strategy');

    // Path selection logic
    pathBtnTest.addEventListener('click', () => {
        pathBtnTest.classList.add('selected');
        builderContainer.style.display = 'block';
    });

    // Hypothesis type switcher logic
    hType.addEventListener('change', () => {
        const isCorr = hType.value === 'corr';
        document.getElementById('h-relation-corr').classList.toggle('hidden', !isCorr);
        document.getElementById('h-relation-corr-end').classList.toggle('hidden', !isCorr);
        document.getElementById('h-relation-diff').classList.toggle('hidden', isCorr);
        document.getElementById('h-relation-diff-end').classList.toggle('hidden', isCorr);
    });

    // Main generator logic
    generateBtn.addEventListener('click', () => {
        const data = {
            type: hType.value,
            iv: hIv.value || '[Independent Variable]',
            dv: hDv.value || '[Dependent Variable]',
            ivMeasure: ivMeasure.value || '[Description of how IV will be measured/manipulated]',
            dvMeasure: dvMeasure.value || '[Description of how DV will be measured]',
            population: population.value || '[Target Population]',
            sampling: samplingStrategy.value,
        };

        generateBlueprintText(data);
        generateVisualization(data);

        outputContainer.classList.remove('hidden');
        outputContainer.scrollIntoView({ behavior: 'smooth' });
    });

    function generateBlueprintText(data) {
        let hypothesis = '';
        if (data.type === 'corr') {
            hypothesis = `The more a listener perceives ${data.iv}, the more/less they will report ${data.dv}.`;
        } else {
            hypothesis = `A group exposed to ${data.iv} will report a higher/lower ${data.dv} than a group not exposed to it.`;
        }

        const blueprint = `
METHODOLOGY PLAN:

Our study will employ a quantitative design to test the following hypothesis: "${hypothesis}"

Independent Variable (IV): Our independent variable is "${data.iv}". We will operationalize this by ${data.ivMeasure}.

Dependent Variable (DV): Our dependent variable is "${data.dv}". This will be measured by ${data.dvMeasure}.

Sampling: Our target population is "${data.population}". We will employ a ${data.sampling} strategy to recruit participants. We acknowledge that as a non-probability sampling method, this limits the generalizability of our findings.
        `.trim();

        document.getElementById('blueprint-textarea').value = blueprint;
    }

    function generateVisualization(data) {
        const visContainer = document.getElementById('blueprint-visualization');
        let chartHTML = '';
        let findingHTML = '';

        if (data.type === 'corr') {
            // For now, we use a placeholder image for the scatter plot
            chartHTML = `<p style="text-align:center; color: #555;">[A scatter plot would be generated here, showing the relationship between '${data.iv}' (X-axis) and '${data.dv}' (Y-axis)]</p>`;
            findingHTML = `A mock finding could be: "A significant positive correlation was found between ${data.iv} and ${data.dv} (r = .45, p < .05), suggesting that as [IV] increases, so does [DV]."`;
        } else {
            const groupA_height = Math.random() > 0.5 ? 140 : 80;
            const groupB_height = 220 - groupA_height;
            chartHTML = `
                <div class="mock-chart-container">
                    <div class="mock-bar-chart">
                        <div class="mock-bar-group">
                             <div class="mock-bar" style="height: ${groupA_height}px;"></div>
                             <div class="mock-bar-label">Group A (High ${data.iv})</div>
                        </div>
                        <div class="mock-bar-group">
                             <div class="mock-bar" style="height: ${groupB_height}px;"></div>
                             <div class="mock-bar-label">Group B (Low ${data.iv})</div>
                        </div>
                    </div>
                </div>
            `;
            findingHTML = `A mock finding could be: "The group with high ${data.iv} reported a significantly higher ${data.dv} (M=4.5, SD=0.8) than the group with low ${data.iv} (M=3.2, SD=0.9), t(126) = 5.43, p < .001."`;
        }

        visContainer.innerHTML = `
            ${chartHTML}
            <p class="mock-finding">${findingHTML}</p>
        `;
    }
}