document.addEventListener('DOMContentLoaded', () => {
    setupChainOfCommand();
    setupVariableHealthCheck();
    setupInstrumentForge();
    setupFeasibilityLab();
});

/**
 * REVISED: Sets up the interactive reveal and adds hover tooltips
 * for the "Chain of Command" flowchart.
 */
function setupChainOfCommand() {
    const visualContainer = document.getElementById('chain-of-command-visual');
    const revealBtn = document.getElementById('reveal-chain-btn');
    const contentContainer = document.querySelector('.chain-content');
    const stepsAndArrows = document.querySelectorAll('.chain-step, .chain-arrow');

    if (!visualContainer || !revealBtn || !contentContainer || stepsAndArrows.length === 0) {
        console.error('Chain of Command elements not found. Aborting setup.');
        return;
    }

    let currentTooltip = null;

    // --- REVEAL LOGIC (unchanged) ---
    revealBtn.addEventListener('click', () => {
        revealBtn.classList.add('is-hidden');
        contentContainer.classList.add('is-visible');
        stepsAndArrows.forEach((element, index) => {
            const delay = (index + 1) * 350;
            setTimeout(() => {
                element.classList.add('is-visible');
            }, delay);
        });
    }, { once: true });

    // --- REVISED: TOOLTIP LOGIC for Mouse Following ---

    // Listen for mouse movement over the entire component
    visualContainer.addEventListener('mousemove', (event) => {
        const step = event.target.closest('.chain-step[data-tooltip]');

        // If we are over a step with a tooltip...
        if (step) {
            // ...and there isn't already a tooltip, create one.
            if (!currentTooltip) {
                const tooltipText = step.dataset.tooltip;
                currentTooltip = document.createElement('div');
                currentTooltip.className = 'tooltip-element';
                currentTooltip.textContent = tooltipText;
                visualContainer.appendChild(currentTooltip); // Append to container, not the element

                // Add class to trigger animation
                requestAnimationFrame(() => {
                    if (currentTooltip) currentTooltip.classList.add('is-visible');
                });
            }

            // Update the tooltip's position to follow the mouse
            // We get the mouse position relative to the container itself
            const containerRect = visualContainer.getBoundingClientRect();
            const x = event.clientX - containerRect.left;
            const y = event.clientY - containerRect.top;

            // Position tooltip above and to the right of the cursor
            currentTooltip.style.left = `${x + 15}px`;
            currentTooltip.style.top = `${y - 30}px`;
        }
        // If we are NOT over a step but a tooltip exists, remove it.
        else if (currentTooltip) {
            currentTooltip.remove();
            currentTooltip = null;
        }
    });

    // A final check to remove the tooltip if the mouse leaves the whole container
    visualContainer.addEventListener('mouseleave', () => {
        if (currentTooltip) {
            currentTooltip.remove();
            currentTooltip = null;
        }
    });
}

// Add this new function to session5.js

/**
 * Sets up the "Variable Health Check" diagnostic tool.
 */
function setupVariableHealthCheck() {
    // --- Get all DOM Elements ---
    const toolContainer = document.getElementById('variable-health-check');
    const intakeForm = document.getElementById('health-check-intake');
    const diagnosticsForm = document.getElementById('health-check-diagnostics');
    const reportCard = document.getElementById('health-check-report');

    const startBtn = document.getElementById('hc-start-btn');
    const reportBtn = document.getElementById('hc-report-btn');
    const resetBtn = document.getElementById('hc-reset-btn');

    const varNameInput = document.getElementById('hc-var-name');
    const diagnosticTitle = document.getElementById('hc-title').querySelector('span');
    const reportTitle = document.getElementById('health-check-report').querySelector('h4 span');

    const radioGroups = ['clarity', 'level', 'grounding'];

    if (!startBtn) return; // Failsafe

    // --- Event Listeners ---
    startBtn.addEventListener('click', startDiagnostics);
    varNameInput.addEventListener('keydown', (e) => { // ADDED: Enter key functionality
        if (e.key === 'Enter') {
            e.preventDefault();
            startBtn.click();
        }
    });
    diagnosticsForm.addEventListener('change', checkCompletion);
    reportBtn.addEventListener('click', generateReport);
    resetBtn.addEventListener('click', resetTool);

    // --- Functions ---
    function startDiagnostics() {
        const varName = varNameInput.value.trim();
        if (!varName) {
            alert('Please provide a variable name to diagnose.');
            varNameInput.focus();
            return;
        }
        diagnosticTitle.textContent = `"${varName}"`;
        reportTitle.textContent = `"${varName}"`;

        intakeForm.classList.add('hidden');
        diagnosticsForm.classList.remove('hidden');
        diagnosticsForm.scrollIntoView({ behavior: 'smooth', block: 'center' }); // ADDED: Scroll into view
    }

    function checkCompletion() {
        const allAnswered = radioGroups.every(groupName => {
            return diagnosticsForm.querySelector(`input[name="${groupName}"]:checked`);
        });
        reportBtn.disabled = !allAnswered;
    }

    function generateReport(event) {
        event.preventDefault();
        // 1. Gather scores and choices
        const clarityScore = parseInt(document.querySelector('input[name="clarity"]:checked').value);
        const clarityChoice = document.querySelector('input[name="clarity"]:checked').parentElement.textContent.trim();
        const groundingScore = parseInt(document.querySelector('input[name="grounding"]:checked').value);
        const groundingChoice = document.querySelector('input[name="grounding"]:checked').parentElement.textContent.trim();
        const levelChoice = document.querySelector('input[name="level"]:checked').value;

        // 2. Calculate overall score (weighted slightly towards grounding)
        const totalScore = ((clarityScore * 0.45) + (groundingScore * 0.55)) * 10;

        // 3. Render the gauge (animation logic remains the same)
        const gaugeBar = document.querySelector('.gauge-bar');
        const gaugeValue = document.querySelector('.gauge-value');
        let gaugeColor = '#28a745'; // Green
        if (totalScore < 75) gaugeColor = '#ffc107'; // Yellow
        if (totalScore < 50) gaugeColor = '#dc3545'; // Red
        gaugeBar.style.setProperty('--gauge-color', gaugeColor);
        gaugeBar.style.background = `conic-gradient(${gaugeColor} ${totalScore * 3.6}deg, #e9ecef 0deg)`;

        let start = 0;
        const finalScore = Math.round(totalScore);
        const duration = 1000;
        const stepTime = Math.max(1, Math.floor(duration / finalScore));
        const timer = setInterval(() => {
            start++;
            gaugeValue.textContent = `${start}%`;
            if (start >= finalScore) {
                clearInterval(timer);
            }
        }, stepTime);
        if (finalScore === 0) gaugeValue.textContent = '0%';

        // 4. Generate more nuanced feedback messages
        const feedbackList = document.getElementById('feedback-list');
        feedbackList.innerHTML = '';
        const addFeedback = (icon, type, message) => {
            const li = document.createElement('li');
            li.className = `feedback-${type}`;
            li.innerHTML = `<div class="icon">${icon}</div><div>${message}</div>`;
            feedbackList.appendChild(li);
        };

        // --- REVISED & MORE NUANCED FEEDBACK ---
        // Clarity Feedback
        if (clarityScore <= 2) {
            addFeedback('⚠️', 'weak', '<strong>Clarity - High Risk:</strong> An "Exploratory Inquiry" is excellent for qualitative research but weak for quantitative testing. Its subjectivity makes it difficult to compare answers reliably. <strong>Recommendation:</strong> If you plan to run statistics, try to break the concept down into a structured, scalable format.');
        } else if (clarityScore <= 6) {
            addFeedback('💡', 'fair', '<strong>Clarity - Good:</strong> A "Self-Constructed Scale" or "Structured Observation" gives you control. <strong>Recommendation:</strong> This is a solid starting point. Before collecting data, pre-test your items/rules with 3-5 people to ensure they are interpreted consistently.');
        } else {
            addFeedback('✅', 'strong', '<strong>Clarity - Excellent:</strong> Using an "Established" or "Adapted Instrument" is a highly reliable and defensible approach. Be sure to cite the original authors of the scale properly in your report.');
        }

        // Grounding Feedback
        if (groundingScore <= 4) {
            addFeedback('⚠️', 'weak', '<strong>Grounding - High Risk:</strong> A "Logical Derivation" is a common starting point, but it weakens the scientific contribution of your work. Your findings will be harder to connect to the existing academic conversation. <strong>Recommendation:</strong> Revisit your literature matrix. Is there truly no prior research that has measured a similar concept? Adapting their method, even from a different context, is stronger than starting from scratch.');
        } else if (groundingScore <= 7) {
            addFeedback('💡', 'fair', '<strong>Grounding - Good:</strong> A "Theoretical Synthesis" is a strong approach for innovative research. <strong>Recommendation:</strong> Your report\'s theory section must clearly justify <strong>why</strong> your new measurement approach is a necessary and logical extension of the sources you synthesized.');
        } else {
            addFeedback('✅', 'strong', '<strong>Grounding - Excellent:</strong> Using a "Direct Precedent" is the gold standard. It makes your results directly comparable to previous work and strengthens your argument significantly.');
        }

        // Analysis Mismatch Feedback
        if (levelChoice === 'qualitative') {
            addFeedback('💡', 'fair', '<strong>Data Type - Qualitative:</strong> Excellent for exploring "how" or "why" questions in depth. Remember that this data (text, notes) cannot be used for statistical tests like t-tests or correlations without a rigorous content analysis process to convert it into quantitative data first.');
        } else if (levelChoice === 'nominal' || levelChoice === 'ordinal') {
            addFeedback('💡', 'fair', `<strong>Data Type - Categorical:</strong> This <strong>${levelChoice}</strong> data is perfect for frequencies and group comparisons. Be aware that you cannot use it for more advanced tests like correlation or regression. Ensure this matches your hypotheses.`);
        } else {
            addFeedback('✅', 'strong', `<strong>Data Type - Scale:</strong> Excellent choice. <strong>${levelChoice}</strong> data is highly flexible and allows for the widest range of powerful statistical tests, including t-tests, ANOVA, correlation, and regression.`);
        }

        // 5. Hide diagnostics and show report
        diagnosticsForm.classList.add('hidden');
        reportCard.classList.remove('hidden');
        reportCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); // ADDED: Scroll into view
    }

    function resetTool() {
        varNameInput.value = '';
        diagnosticsForm.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        reportBtn.disabled = true;

        reportCard.classList.add('hidden');
        diagnosticsForm.classList.add('hidden');
        intakeForm.classList.remove('hidden');

        intakeForm.scrollIntoView({ behavior: 'smooth', block: 'center' }); // ADDED: Scroll into view
        varNameInput.focus();
    }
}
// Add this new function to session5.js

/**
 * Sets up the "Instrument Forge" tools for both Survey and Content Analysis.
 */
function setupInstrumentForge() {
    const methodSelector = document.querySelector('.method-selector');
    if (!methodSelector) return;

    const toolButtons = methodSelector.querySelectorAll('.tool-btn');
    const clinicTools = document.querySelectorAll('.clinic-tool');

    // --- Main Method Selector Logic ---
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const targetToolId = button.dataset.tool;
            clinicTools.forEach(tool => {
                // Use the new ID for the codebook tool
                const currentToolId = tool.id === 'codebook-crucible' ? 'codebook-forge' : tool.id;
                tool.classList.toggle('hidden', currentToolId !== targetToolId);
            });
        });
    });

    // --- A) Scale Forge Logic (UNCHANGED) ---
    const sf = {
        varName: document.getElementById('sf-var-name'),
        instruction: document.getElementById('sf-instruction'),
        pointsSlider: document.getElementById('sf-points'),
        pointsValue: document.getElementById('sf-points-value'),
        anchorLeft: document.getElementById('sf-anchor-left'),
        anchorMidContainer: document.getElementById('sf-anchor-mid-container'),
        anchorMid: document.getElementById('sf-anchor-mid'),
        anchorRight: document.getElementById('sf-anchor-right'),
        itemsList: document.getElementById('sf-items-list'),
        itemInput: document.getElementById('sf-item-input'),
        addItemBtn: document.getElementById('sf-add-item-btn'),
        previewArea: document.getElementById('scale-live-preview'),
        proTipsContainer: document.getElementById('sf-pro-tips-container'),
        exportBtn: document.getElementById('sf-export-btn'),
    };

    function renderScalePreview() {
        const varNameText = sf.varName.value.trim() || '[Variable Name]';
        const points = parseInt(sf.pointsSlider.value);
        const instructionText = sf.instruction.value.trim() || '...';
        const leftText = sf.anchorLeft.value.trim() || 'Anchor 1';
        const rightText = sf.anchorRight.value.trim() || `Anchor ${points}`;
        let pointsHTML = '';
        for (let i = 0; i < points; i++) { pointsHTML += '<div class="point"></div>'; }
        let itemsHTML = '';
        const currentItems = sf.itemsList.querySelectorAll('li');
        currentItems.forEach(item => {
            itemsHTML += `<div class="preview-item"><div class="preview-item-text">${item.firstChild.textContent.trim() || '...'}</div><div class="preview-scale"><span class="anchor">${leftText}</span><div class="preview-scale-points">${pointsHTML}</div><span class="anchor">${rightText}</span></div></div>`;
        });
        if (currentItems.length === 0) { itemsHTML = `<p class="helper-text">Add items below to see them here...</p>`; }
        sf.previewArea.innerHTML = `<h5>Measuring: ${varNameText}</h5><p class="preview-instruction">${instructionText}</p>${itemsHTML}`;
        checkProTips(points, currentItems.length);
    }

    function checkProTips(points, itemCount) {
        sf.proTipsContainer.innerHTML = '';
        let tips = [];
        if (points % 2 === 0) { tips.push('💡 You\'ve chosen an even-pointed scale. This forces a choice and removes a neutral middle option. Is this your intention?'); }
        if (itemCount > 0 && itemCount < 3) { tips.push('💡 A strong scale typically uses 3-7 items to reliably measure a complex construct. Consider adding more items.'); }
        if (tips.length > 0) { sf.proTipsContainer.innerHTML = tips.map(tip => `<div class="pro-tip is-visible">${tip}</div>`).join(''); }
    }

    function addScaleItem() {
        const text = sf.itemInput.value.trim();
        if (!text) return;
        const li = document.createElement('li');
        const textNode = document.createTextNode(text);
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'sf-delete-item-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Delete Item';
        li.appendChild(textNode);
        li.appendChild(deleteBtn);
        sf.itemsList.appendChild(li);
        sf.itemInput.value = '';
        sf.itemInput.focus();
        renderScalePreview();
    }

    sf.itemsList.addEventListener('click', (e) => { if (e.target.matches('.sf-delete-item-btn')) { e.target.parentElement.remove(); renderScalePreview(); } });
    [sf.varName, sf.instruction, sf.anchorLeft, sf.anchorMid, sf.anchorRight].forEach(el => el.addEventListener('input', renderScalePreview));
    sf.pointsSlider.addEventListener('input', () => { sf.pointsValue.textContent = sf.pointsSlider.value; sf.anchorMidContainer.classList.toggle('hidden', sf.pointsSlider.value % 2 === 0); renderScalePreview(); });
    sf.addItemBtn.addEventListener('click', addScaleItem);
    sf.itemInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addScaleItem(); } });
    sf.exportBtn.addEventListener('click', () => {
        const varName = sf.varName.value.trim() || '[Variable Name]';
        const instruction = sf.instruction.value.trim() || '[Guiding instruction not provided]';
        const points = sf.pointsSlider.value;
        const anchors = `(1 = ${sf.anchorLeft.value.trim() || '...'}, ${points} = ${sf.anchorRight.value.trim() || '...'})`;
        const items = Array.from(sf.itemsList.querySelectorAll('li')).map(li => `- ${li.firstChild.textContent.trim()}`);
        const summary = `METHODOLOGY PLAN for "${varName}"\n========================================\nThis variable will be measured using a self-devised ${points}-point scale.\n\nGuiding Instruction: "${instruction}"\n\nScale Anchors: ${anchors}\n\nDraft Items:\n${items.join('\n') || '(No items drafted yet)'}`.trim();
        navigator.clipboard.writeText(summary).then(() => alert('Scale blueprint copied to clipboard!'));
    });
    renderScalePreview();

    const cc = {
        varName: document.getElementById('cc-var-name'),
        unit: document.getElementById('cc-unit'),
        goalChecklist: document.getElementById('goal-checklist'),
        catList: document.getElementById('cc-categories-list'),
        catInput: document.getElementById('cc-category-input'),
        generateBtn: document.getElementById('cc-generate-btn'),
        gauntlet: document.getElementById('crucible-gauntlet'),
        challengeContainer: document.getElementById('challenge-container'),
        exportBtn: document.getElementById('cc-export-btn'),
    };

    if (cc.varName) { // Add a check to ensure these elements exist
        // REVISED: Expanded map to include all new goals and challenges.
        const challengeMap = {
            // Foundational Goals
            frequency: ['challenge-synonym'],
            sentiment: ['challenge-sarcasm', 'challenge-mixed-valence'],
            // Interpretive & Thematic Goals
            thematic: ['challenge-boundary', 'challenge-indicator', 'challenge-exclusivity'],
            framing: ['challenge-indicator', 'challenge-exclusivity', 'challenge-absence'],
            // Theory-Driven & Relational Goals
            argument: ['challenge-boundary', 'challenge-absence'],
            psi: ['challenge-indicator', 'challenge-intent'],
            identity: ['challenge-indicator', 'challenge-exclusivity'],
            rhetoric: ['challenge-exclusivity'],
            // New Goals from previous step
            sourcing: ['challenge-boundary', 'challenge-indicator', 'challenge-absence'],
            production: ['challenge-boundary', 'challenge-indicator'],
            claims: ['challenge-boundary', 'challenge-indicator', 'challenge-absence'],
            // Newest Goals
            cta: ['challenge-synonym', 'challenge-specificity'],
            interactivity: ['challenge-indicator', 'challenge-boundary'],
            format: ['challenge-boundary', 'challenge-indicator']
        };

        function addCategoryTag() {
            const text = cc.catInput.value.trim();
            if (!text) return;
            const tag = document.createElement('div');
            tag.className = 'tag';
            const textNode = document.createTextNode(text);
            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-tag';
            deleteBtn.innerHTML = '&times;';
            tag.appendChild(textNode);
            tag.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', () => tag.remove());
            cc.catList.appendChild(tag);
            cc.catInput.value = '';
            cc.catInput.focus();
        }

        cc.catInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addCategoryTag(); } });

        cc.generateBtn.addEventListener('click', () => {
            const selectedGoals = Array.from(cc.goalChecklist.querySelectorAll('input:checked')).map(cb => cb.value);
            if (selectedGoals.length === 0) {
                alert('Please select at least one analytical goal to begin.');
                return;
            }

            // REVISED: Logic to determine which challenges to show
            let challengesToShow = new Set();

            // 1. Add challenges based on the map
            selectedGoals.forEach(goal => {
                if (challengeMap[goal]) {
                    challengeMap[goal].forEach(challengeId => challengesToShow.add(challengeId));
                }
            });

            // 2. Add UNIVERSAL challenges that always appear
            challengesToShow.add('challenge-unit');

            // 3. Add CONDITIONAL challenges based on complexity
            if (selectedGoals.length >= 4 || Array.from(cc.catList.children).length >= 5) {
                challengesToShow.add('challenge-feasibility');
            }

            // Hide all challenges first
            cc.gauntlet.querySelectorAll('.challenge-box').forEach(box => box.classList.add('hidden'));

            // Show and personalize the relevant ones
            challengesToShow.forEach(id => {
                const challenge = document.getElementById(id);
                if (challenge) {
                    challenge.classList.remove('hidden');

                    // Personalize challenges with user's input
                    const cats = Array.from(cc.catList.querySelectorAll('.tag')).map(t => t.firstChild.textContent.trim());

                    // Personalize Boundary & Indicator challenges
                    const userCatSpans = challenge.querySelectorAll('.user-cat');
                    if (userCatSpans.length > 0) userCatSpans[0].textContent = `'${cats[0] || '[Category A]'}'`;
                    if (userCatSpans.length > 1) userCatSpans[1].textContent = `'${cats[1] || '[Category B]'}'`;
                    if (challenge.id === 'challenge-indicator') {
                        userCatSpans[0].textContent = `'${cats[0] || '[Your Abstract Category]'}'`;
                    }

                    // Personalize Unit challenge
                    if (challenge.id === 'challenge-unit') {
                        const unitText = cc.unit.value.trim() || "[user's unit]";
                        challenge.querySelector('p').innerHTML = `You defined your unit as '<em>${unitText}</em>'. In one unit, the host might tell a joke, then read an ad, then state a political opinion. Coding the entire unit for all three things is messy.`;
                    }

                    // Personalize Feasibility challenge
                    if (challenge.id === 'challenge-feasibility') {
                        challenge.querySelector('p').textContent = `Your current plan involves ${cats.length || '[X]'} categories for a sample of [Y units]. A complex codebook can take many minutes per unit to apply reliably.`;
                    }
                }
            });

            cc.gauntlet.classList.remove('hidden');
            cc.gauntlet.scrollIntoView({ behavior: 'smooth' });
        });

        cc.exportBtn.addEventListener('click', () => {
            const varName = cc.varName.value.trim() || '[Variable Name]';
            const unit = cc.unit.value.trim() || '[Unit of analysis not defined]';
            const goals = Array.from(cc.goalChecklist.querySelectorAll('input:checked')).map(cb => cb.parentElement.querySelector('span').textContent.trim());
            const categories = Array.from(cc.catList.querySelectorAll('.tag')).map(t => t.firstChild.textContent.trim()).join(', ');

            let rulesText = '';
            cc.gauntlet.querySelectorAll('.challenge-box:not(.hidden)').forEach(box => {
                const title = box.querySelector('.challenge-title').textContent;
                const rule = box.querySelector('textarea').value.trim();
                if (rule) {
                    rulesText += `- ${title}: ${rule}\n`;
                }
            });

            const summary = `
CODEBOOK ENTRY for "${varName}"
========================================
- Unit of Analysis: ${unit}
- Primary Analytical Goals: ${goals.join('; ')}
- Categories: ${categories || '[Not listed]'}

FORGED DECISION RULES from Crucible Gauntlet:
${rulesText || '(No rules defined yet)'}
            `.trim();
            navigator.clipboard.writeText(summary).then(() => alert('Forged codebook entry copied to clipboard!'));
        });
    }
}


/**
 * FINAL, REPAIRED & REFACTORED VERSION (V4)
 * Sets up the entire interactive "Feasibility Lab" for Station C.
 * This version uses a namespaced ".lab-hidden" class to prevent conflicts and ensure robust state management.
 */
/**
 * FINAL INSTRUMENTED VERSION (V5)
 * Sets up the entire interactive "Feasibility Lab" for Station C.
 * This version is heavily logged to the console to diagnose the persistent rendering bug.
 */
function setupFeasibilityLab() {
    console.log("Feasibility Lab setup initiated.");

    // --- Top-Level DOM Elements ---
    const labContainer = document.getElementById('feasibility-lab');
    if (!labContainer) {
        console.error("CRITICAL ERROR: #feasibility-lab container not found. Aborting setup.");
        return;
    }

    const pathSelection = document.getElementById('lab-path-selection');
    const pathA_Form = document.getElementById('path-a-recruitment');
    const pathB_Form = document.getElementById('path-b-corpus');
    const memoOutput = document.getElementById('lab-memo-output');

    const allViews = [pathSelection, pathA_Form, pathB_Form, memoOutput];
    console.log("Found all view containers:", allViews.map(v => v ? v.id : 'MISSING'));

    const pathButtons = labContainer.querySelectorAll('.path-selector-btn');

    // --- Path B Elements ---
    const tagInput = document.getElementById('tag-input');
    const tagList = document.getElementById('tag-list');
    const pathB_methodRadios = pathB_Form.querySelectorAll('input[name="method"]');
    const justificationBox = pathB_Form.querySelector('.justification-box');

    // --- Memo Elements ---
    const memoTextarea = document.getElementById('memo-textarea');
    const copyMemoBtn = document.getElementById('copy-memo-btn');
    const mitigationList = document.getElementById('mitigation-list');
    const labResetBtn = document.getElementById('lab-reset-btn');

    // --- Data Sources (unchanged) ---
    const pathA_Data = { channels: { uni_email: { biases: ['academic_bias', 'young_bias'], effort: 20 }, social_general: { biases: ['self_selection_bias', 'homogeneity_bias'], effort: 30 }, social_niche: { biases: ['high_interest_bias', 'self_selection_bias'], effort: 60 }, personal: { biases: ['extreme_homogeneity_bias', 'social_desirability_bias'], effort: 10 }, gatekeeper: { biases: ['cluster_bias'], effort: 80 }, snowball: { biases: ['homogeneity_bias', 'self_selection_bias'], effort: 40 } }, mitigation: { academic_bias: { warning: "Your sample will be heavily skewed towards a younger, more educated demographic.", action: "You MUST clearly state these demographic limitations in your methodology and discussion, acknowledging that findings are not generalizable to the broader population." }, young_bias: { warning: "Your sample will likely underrepresent individuals over 30.", action: "Acknowledge this age-related limitation and suggest future research with a more age-diverse sample." }, homogeneity_bias: { warning: "Your sample will likely consist of people who are very similar to you and to each other.", action: "Actively seek out at least one channel that is outside your immediate social circle to increase diversity. Report the lack of diversity as a key limitation." }, extreme_homogeneity_bias: { risk: "high", warning: "Your sample is at high risk of being a monoculture, making it very difficult to draw meaningful conclusions.", action: "This strategy should ONLY be used for exploratory pilots. For a final project, you MUST combine it with other, more diverse recruitment channels." }, self_selection_bias: { warning: "Participants will primarily be those who are already interested in your topic or in participating in research.", action: "Acknowledge that your sample may not represent the 'average' person. Consider adding a question to measure their pre-existing interest level." }, high_interest_bias: { warning: "Participants from niche communities are likely 'superfans' or highly knowledgeable, and their views may not be typical.", action: "Acknowledge that your findings are specific to this highly engaged group. Contrast their potential views with the 'general user' in your discussion." }, social_desirability_bias: { warning: "Participants who know you personally may give answers they think you want to hear.", action: "Ensure anonymity is guaranteed and clearly stated in your introduction. Acknowledge this potential bias if the topic is sensitive." }, cluster_bias: { warning: "By recruiting from one specific group (e.g., a company), your findings are only representative of that group's unique culture.", action: "Clearly define the characteristics of the group and acknowledge that findings cannot be generalized beyond it." } } };
    const pathB_Data = { sources: { charts: { biases: ['popularity_bias', 'platform_bias'] }, search: { biases: ['platform_bias', 'algorithm_bias'] }, specific: { biases: ['specificity_bias'] }, social: { biases: ['self_selection_bias_content', 'platform_bias'] } }, methods: { census: { representativeness: 100, feasibility: 20 }, probabilistic: { representativeness: 90, feasibility: 50 }, purposive: { representativeness: 30, feasibility: 70 }, convenience: { representativeness: 10, feasibility: 90 } }, mitigation: { popularity_bias: { warning: "Your sample overrepresents the most successful content and ignores the 'long tail' of average or niche media.", action: "To mitigate, purposively add 1-2 less popular but relevant examples for comparison. You MUST state that your findings apply primarily to high-performing content." }, platform_bias: { warning: "Your findings are only representative of content on the specific platform(s) you chose (e.g., Spotify), not the entire media ecosystem.", action: "Acknowledge this boundary in your methodology. Suggest future research comparing findings across different platforms." }, algorithm_bias: { warning: "Search results are personalized and non-transparent, making your sampling frame difficult to replicate and potentially skewed.", action: "Document your exact search terms and the date of the search. Acknowledge that the algorithm influenced your sample in ways that cannot be fully known." }, specificity_bias: { warning: "By focusing on specific, pre-defined media, your findings are not generalizable to the wider genre or topic.", action: "This is often a strength, not a weakness. Justify clearly WHY this specific content was chosen and frame your conclusions as a case study." }, self_selection_bias_content: { warning: "Content on social media is created by a vocal minority and is not representative of all listeners or the general population.", action: "Clearly define the platform and community you are analyzing (e.g., the r/podcasts subreddit) and state that your findings reflect the views of that specific online community, not a general audience." }, recency_bias: { warning: "By focusing on the most recent content, your sample may miss long-term trends or be skewed by a single recent event.", action: "Justify why a 'snapshot' in time is sufficient for your RQ, or expand your sampling period to include older, purposively selected 'landmark' examples for context." } } };

    // --- Core Logic ---

    /** 
     * The instrumented "traffic cop" function.
     */
    function showLabView(viewToShow) {
        console.log(`%cshowLabView function started. Target to show: [${viewToShow ? viewToShow.id : 'null'}]`, "color: blue; font-weight: bold;");
        if (!viewToShow) {
            console.error("CRITICAL ERROR: showLabView was called with a null or undefined target.");
            return;
        }

        allViews.forEach(view => {
            const isTarget = view === viewToShow;
            const action = isTarget ? 'block' : 'none';
            console.log(`- Processing [${view.id}]: Setting style.display to '${action}'`);
            view.style.display = action;
        });

        console.log(`Scrolling [${viewToShow.id}] into view.`);
        viewToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.log(`%cshowLabView finished. [${viewToShow.id}] should now be visible.`, "color: blue; font-weight: bold;");
    }

    // 1. Initial Path Selection
    pathButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("--- Path Button Clicked ---");
            pathButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            const selectedPath = button.dataset.path;
            const targetView = selectedPath === 'A' ? pathA_Form : pathB_Form;

            console.log("Selected Path:", selectedPath);
            console.log("Identified Target View Element:", targetView);

            showLabView(targetView);
        });
    });

    // 2. Path A: Logic
    function generateMemoA() {
        console.log("--- Generating Memo A ---");
        const population = pathA_Form.querySelector('#a-population').value.trim() || '[Undefined Population]';
        const sizeInput = pathA_Form.querySelector('input[name="sample-size"]:checked');
        if (!sizeInput) { alert('Please select a target sample size.'); return; }
        const size = sizeInput.parentElement.querySelector('strong').textContent;
        const contexts = Array.from(pathA_Form.querySelectorAll('input[name="context"]:checked')).map(cb => cb.parentElement.querySelector('div').textContent);
        const channels = Array.from(pathA_Form.querySelectorAll('input[name="channel"]:checked')).map(cb => cb.value);

        if (channels.length === 0) { alert('Please select at least one recruitment channel.'); return; }

        const uniqueBiases = new Set();
        channels.forEach(key => pathA_Data.channels[key].biases.forEach(bias => uniqueBiases.add(bias)));

        const memo = `SAMPLING & RECRUITMENT PLAN\n---------------------------\nTarget Population: ${population}\nTarget Sample Size: ${size}\nRecruitment Channels: ${channels.join(', ').replace(/_/g, ' ')}\n\nResearcher Context acknowledged: ${contexts.join(', ') || 'None'}`;

        let mitigationHTML = '';
        uniqueBiases.forEach(key => {
            const data = pathA_Data.mitigation[key];
            const risk = data.risk || 'medium';
            mitigationHTML += `<li class="bias-${risk}"><strong class="warning-label">[WARNING] ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong><p class="warning-text">${data.warning}</p><strong class="action-label">[ACTION PLAN]</strong><p class="action-text">${data.action}</p></li>`;
        });
        displayMemo(memo, mitigationHTML);
    }

    // 3. Path B: Logic
    function setupPathBInteractions() {
        tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && tagInput.value.trim()) {
                e.preventDefault();
                const tag = document.createElement('div');
                tag.className = 'tag';
                tag.textContent = tagInput.value.trim();
                const deleteBtn = document.createElement('span');
                deleteBtn.className = 'delete-tag';
                deleteBtn.onclick = () => tag.remove();
                deleteBtn.innerHTML = '&times;';
                tag.appendChild(deleteBtn);
                tagList.appendChild(tag);
                tagInput.value = '';
            }
        });
        pathB_methodRadios.forEach(radio => radio.addEventListener('change', () => {
            console.log("Justification box triggered to show.");
            justificationBox.style.display = 'block';
        }));
    }

    function generateMemoB() {
        console.log("--- Generating Memo B ---");
        const sources = Array.from(pathB_Form.querySelectorAll('input[name="source"]:checked')).map(cb => cb.parentElement.querySelector('strong').textContent);
        const criteria = Array.from(tagList.querySelectorAll('.tag')).map(tag => tag.firstChild.textContent);
        const methodRadio = pathB_Form.querySelector('input[name="method"]:checked');
        const justification = pathB_Form.querySelector('#b-justification').value.trim();

        if (!methodRadio || !justification) { alert('Please select a sampling method and provide a justification.'); return; }
        const method = methodRadio.parentElement.querySelector('strong').textContent;

        const uniqueBiases = new Set();
        Array.from(pathB_Form.querySelectorAll('input[name="source"]:checked')).forEach(cb => pathB_Data.sources[cb.value].biases.forEach(bias => uniqueBiases.add(bias)));
        if (method.toLowerCase() === 'convenience') { uniqueBiases.add('recency_bias'); }

        const memo = `CORPUS CONSTRUCTION & SAMPLING PLAN\n-----------------------------------\nSampling Frame Definition:\n- Source(s): ${sources.join(', ') || '[Not specified]'}\n- Inclusion Criteria: ${criteria.join('; ') || '[Not specified]'}\n\nSampling Strategy:\n- Method: ${method}\n- Justification: ${justification}`;

        let mitigationHTML = '';
        uniqueBiases.forEach(key => {
            const data = pathB_Data.mitigation[key];
            mitigationHTML += `<li class="bias-medium"><strong class="warning-label">[WARNING] ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong><p class="warning-text">${data.warning}</p><strong class="action-label">[ACTION PLAN]</strong><p class="action-text">${data.action}</p></li>`;
        });
        displayMemo(memo, mitigationHTML);
    }

    // 4. Memo Display & Reset Logic
    function displayMemo(memo, mitigationHTML) {
        console.log("Displaying Memo Output.");
        memoTextarea.value = memo;
        mitigationList.innerHTML = mitigationHTML;
        showLabView(memoOutput);
    }

    function resetLab() {
        console.log("--- Resetting Lab ---");
        pathA_Form.reset();
        pathB_Form.reset();
        tagList.innerHTML = '';
        justificationBox.style.display = 'none';
        pathButtons.forEach(btn => btn.classList.remove('selected'));
        showLabView(pathSelection);
        labContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // --- Attach Event Listeners ---
    document.getElementById('generate-memo-a-btn').addEventListener('click', generateMemoA);
    document.getElementById('generate-memo-b-btn').addEventListener('click', generateMemoB);
    labResetBtn.addEventListener('click', resetLab);
    copyMemoBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(memoTextarea.value).then(() => {
            copyMemoBtn.textContent = '✅ Copied!';
            copyMemoBtn.classList.add('copied');
            setTimeout(() => {
                copyMemoBtn.textContent = '📋 Copy';
                copyMemoBtn.classList.remove('copied');
            }, 2000);
        });
    });

    // --- Final Initialization ---
    console.log("Running final initialization for Feasibility Lab.");
    setupPathBInteractions();

    // Set the initial state of the lab correctly and explicitly
    showLabView(pathSelection);
}