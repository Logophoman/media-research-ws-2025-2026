// session3.js - Interactivity for literature review, theories, and process models.

document.addEventListener('DOMContentLoaded', function () {
    setupCollapsibleSections();
    setupProcessModelTabs();
    setupTheoryRecommender();
    setupInquiryBuilder();
});

/**
 * Sets up the expand/collapse functionality for the theory toolkit.
 */
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
 * Manages the tab navigation and SVG interactivity for the research process models.
 */
function setupProcessModelTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const svgs = {
        'content-analysis': document.getElementById('roessler-svg'),
        'survey': document.getElementById('scholl-svg'),
        'experiment': document.getElementById('brosius-svg')
    };
    let currentTooltip = null;

    // --- General Explanations for SVG elements ---
    const generalExplanations = {
        'roessler-erkenntnisinteresse': "Ausgangspunkt jeder Forschung. Was soll warum untersucht werden? Kann theoretisch motiviert (Wissenslücke schließen) oder praktisch (konkretes Problem lösen) sein.",
        'roessler-fundierung': "Einordnung der Fragestellung in bestehende Theorien. Welche theoretischen Konzepte sind relevant?",
        'roessler-forschungsstand': "Sichtung und Darstellung bisheriger Forschung zum Thema. Was ist bereits bekannt, wo gibt es Lücken?",
        'roessler-begriffe': "Klare Definition der zentralen Konzepte, die in der Untersuchung verwendet werden.",
        'roessler-hypothesen': "Formulierung von überprüfbaren Annahmen über Zusammenhänge, basierend auf Theorie und Forschungsstand. In der qualitativen Inhaltsanalyse oft offener formuliert oder erst im Prozess generiert.",
        'roessler-problemstellung': "Konkretisierung der Forschungsfrage für die Inhaltsanalyse.",
        'roessler-projektplanung': "Organisation der Analyse: Ressourcen (Geld, Zeit), Personal (Codierer), Zeitplan.",
        'roessler-material': "Auswahl und Beschaffung des zu analysierenden Materials (Texte, Bilder, Videos etc.). Ggf. Anpassung/Bildung von Hypothesen basierend auf erstem Materialkontakt.",
        'roessler-analyseeinheiten': "Festlegung, was genau die Einheiten sind, die codiert werden (z.B. Artikel, Szene, Tweet, Satz).",
        'roessler-kategorien': "Entwicklung des Kategoriensystems zur Erfassung der relevanten Merkmale. Kann deduktiv (theoriegeleitet) oder induktiv (empiriegeleitet) erfolgen.",
        'roessler-probecodierung': "Test des Kategoriensystems an einem kleinen Teil des Materials, um Verständlichkeit und Anwendbarkeit zu prüfen.",
        'roessler-codierschulung': "Training der Codierer, um eine einheitliche Anwendung des Kategoriensystems sicherzustellen.",
        'roessler-codebuch': "Finale Version des Kategoriensystems mit genauen Definitionen, Beispielen und Codieranweisungen.",
        'roessler-codierung': "Systematische Anwendung des Codebuchs auf das gesamte Untersuchungsmaterial.",
        'roessler-auswertung': "Dateneingabe, -aufbereitung und statistische Analyse der codierten Daten (bei quantitativer IA) oder qualitative Interpretation (bei qualitativer IA).",
        'roessler-interpretation': "Deutung der Ergebnisse im Lichte der Forschungsfrage, Hypothesen und Theorie.",
        'roessler-darstellung': "Aufbereitung und Präsentation der Ergebnisse (Tabellen, Grafiken, Berichte).",
        'roessler-publikation': "Veröffentlichung der Ergebnisse in wissenschaftlichen Journalen, Büchern etc.",
        'roessler-forschungsbericht': "Umfassende Dokumentation des gesamten Forschungsprozesses und der Ergebnisse.",
        'scholl-fragestellung': "Die klare Formulierung des Forschungsproblems oder der Frage, die beantwortet werden soll.",
        'scholl-konzeptualisierung': "Definition der theoretischen Konzepte und ggf. Ableitung von Hypothesen oder Bezug zu einer Theorie.",
        'scholl-methode': "Auswahl der Befragung als Methode (z.B. online, telefonisch, persönlich).",
        'scholl-operationalisierung': "Übersetzung der theoretischen Konzepte in messbare Fragen (Erstellung des Fragebogens).",
        'scholl-grundgesamtheit': "Definition der Population, über die eine Aussage getroffen werden soll.",
        'scholl-auswahl': "Auswahl der Stichprobe (Teilnehmende) aus der Grundgesamtheit (z.B. Zufallsstichprobe, Quotenstichprobe).",
        'scholl-pretest': "Test des Fragebogens mit einer kleinen Gruppe, um Verständlichkeit, Länge und technische Funktion zu prüfen.",
        'scholl-hauptuntersuchung': "Durchführung der eigentlichen Befragung mit der ausgewählten Stichprobe (Datenerhebung).",
        'scholl-aufbereitung': "Eingabe der Daten in eine Datenbank, Prüfung auf Fehler und Bereinigung des Datensatzes.",
        'scholl-auswertung': "Statistische Analyse der erhobenen Daten zur Beantwortung der Forschungsfrage und Überprüfung der Hypothesen.",
        'scholl-datenpraesentation': "Darstellung und Veröffentlichung der Ergebnisse.",
        'brosius-phaenomen': "Beobachtung eines Phänomens in der Realität oder einer Wissenslücke, die untersucht werden soll.",
        'brosius-auftrag': "Der Anlass der Forschung kann ein externer Auftrag oder eigenes wissenschaftliches Interesse sein.",
        'brosius-fragestellung': "Präzise Formulierung der wissenschaftlichen Frage, oft nach einem Ursache-Wirkungs-Zusammenhang.",
        'brosius-fundierung': "Theoretische Einbettung der Fragestellung, Begründung der Relevanz, Darstellung des Forschungsstands.",
        'brosius-begriffe': "Klare Definition aller relevanten Konstrukte und Variablen (unabhängige, abhängige, Kontrollvariablen).",
        'brosius-hypothesen': "Formulierung spezifischer, testbarer Kausalhypothesen (Wenn X, dann Y).",
        'brosius-konzeption': "Detaillierte Planung des Experiments: Wahl des Designs (z.B. Between-Subjects, Within-Subjects), Festlegung der Manipulation (UV), Wahl der Messinstrumente (AV), Wahl der Untersuchungsanlage.",
        'brosius-indikatoren': "Konkrete Messvorschriften für die abhängigen Variablen (Operationalisierung der AV).",
        'brosius-datenerhebung': "Durchführung des Experiments unter kontrollierten Bedingungen, Messung der abhängigen Variablen.",
        'brosius-datenanalyse': "Statistische Auswertung der Daten, um den Effekt der Manipulation (UV) auf die Messung (AV) zu prüfen (z.B. T-Test, ANOVA).",
        'brosius-ergebnisdarstellung': "Zusammenfassung und Visualisierung der Ergebnisse.",
        'brosius-bericht': "Verfassen eines Forschungsberichts oder einer Publikation, die den Prozess und die Ergebnisse dokumentiert."
    };

    // --- Tooltip Functions ---
    function showTooltip(boxElement, text) {
        hideTooltip();
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = text;
        document.body.appendChild(tooltip);
        currentTooltip = tooltip;

        const boxRect = boxElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top = boxRect.top + window.scrollY - tooltipRect.height - 10;
        let left = boxRect.left + window.scrollX + (boxRect.width / 2) - (tooltipRect.width / 2);

        if (left < 5) left = 5;
        if (left + tooltipRect.width > window.innerWidth - 5) {
            left = window.innerWidth - tooltipRect.width - 5;
        }
        if (top < window.scrollY + 5) {
            top = boxRect.bottom + window.scrollY + 10;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        requestAnimationFrame(() => tooltip.classList.add('visible'));
    }

    function hideTooltip() {
        if (currentTooltip) {
            currentTooltip.remove();
            currentTooltip = null;
        }
    }

    // --- Event Listeners ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tabContents.forEach(content => {
                content.classList.toggle('active', content.id === `tab-${targetTab}`);
            });
            resetInteractionState();
        });
    });

    Object.values(svgs).forEach(svg => {
        if (svg) {
            svg.querySelectorAll('.process-box:not(.dashed-border)').forEach(box => {
                box.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const clickedBox = event.currentTarget;
                    const stepId = clickedBox.id;
                    const isAlreadyHighlighted = clickedBox.classList.contains('highlighted');

                    resetInteractionState(svg);

                    if (!isAlreadyHighlighted && stepId) {
                        clickedBox.classList.add('highlighted');
                        const description = generalExplanations[stepId] || "Keine Erklärung hinterlegt.";
                        showTooltip(clickedBox, description);
                    }
                });
            });
        }
    });

    // Toggle for AI-generated help sections
    document.querySelectorAll('.toggle-help-button').forEach(button => {
        button.addEventListener('click', () => {
            const helpContent = button.nextElementSibling;
            if (helpContent && helpContent.classList.contains('specific-help-content')) {
                const isHidden = helpContent.style.display === 'none' || helpContent.style.display === '';
                helpContent.style.display = isHidden ? 'block' : 'none';
                button.textContent = isHidden ? button.textContent.replace('anzeigen', 'verbergen') : button.textContent.replace('verbergen', 'anzeigen');
            }
        });
    });

    function resetInteractionState(currentSvg = null) {
        hideTooltip();
        const svgsToReset = currentSvg ? [currentSvg] : Object.values(svgs);
        svgsToReset.forEach(svg => {
            if (svg) {
                svg.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
            }
        });
    }

    window.addEventListener('scroll', hideTooltip, true);
    window.addEventListener('resize', hideTooltip, true);
}

function setupTheoryRecommender() {
    const quizForm = document.getElementById('recommender-quiz');
    const resultsContainer = document.getElementById('recommendation-results');

    if (!quizForm || !resultsContainer) return;

    // --- Data: Expanded list of theories ---
    const theories = {
        ug: { title: "Uses & Gratifications", reason: "Ideal for understanding <strong>why</strong> people actively choose specific podcasts to satisfy needs like information or entertainment." },
        psi: { title: "Parasocial Interaction (PSI)", reason: "Perfect for analyzing the <strong>one-sided bond</strong> between hosts and listeners, explaining loyalty and trust." },
        framing: { title: "Framing Theory", reason: "Use this to analyze <strong>how the presentation</strong> of an issue influences audience interpretation." },
        elm: { title: "Elaboration Likelihood Model (ELM)", reason: "A strong framework for exploring <strong>how listeners are persuaded</strong> by logical arguments or peripheral cues." },
        cultivation: { title: "Cultivation Theory", reason: "Suited for investigating the <strong>long-term effects</strong> of heavy, genre-specific listening on listeners' perceptions of reality." },
        sit: { title: "Social Identity Theory", reason: "A great lens for analyzing how niche podcasts create a sense of <strong>community and 'in-group' identity</strong> among listeners." },
        narrative: { title: "Narrative Transportation", reason: "A must-have for story-driven content (like True Crime), explaining persuasion through <strong>immersion in a story</strong>." },
        sdt: { title: "Self-Determination Theory", reason: "Analyzes how podcasts fulfill core needs for <strong>autonomy, competence, and relatedness</strong> (great for loneliness/learning topics)." },
        mood: { title: "Mood Management", reason: "Explains how listeners select podcasts to <strong>regulate their emotional state</strong>, like listening to comedy to feel better." },
        diffusion: { title: "Diffusion of Innovations", reason: "Use this to understand how new ideas or podcasts <strong>spread through a population</strong> over time." },
        'two-step': { title: "Two-Step Flow", reason: "Examines hosts as influential <strong>'opinion leaders'</strong> who filter and disseminate media messages to an audience." },
        tam: { title: "Technology Acceptance Model", reason: "Excellent for understanding why people <strong>adopt or reject</strong> podcasting platforms based on usability and usefulness." }
    };

    quizForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(quizForm);
        const focus = formData.get('focus');
        const process = formData.get('process');
        const method = formData.get('method');

        if (!focus || !process || !method) {
            alert('Please answer all three questions.');
            return;
        }

        // --- V2 Scoring Logic: More nuanced and complete ---
        let scores = { ug: 0, psi: 0, framing: 0, elm: 0, cultivation: 0, sit: 0, narrative: 0, sdt: 0, mood: 0, diffusion: 0, 'two-step': 0, tam: 0 };

        // 1. Score based on FOCUS
        if (focus === 'listener') { scores.ug += 2; scores.sdt += 2; scores.mood++; scores.tam++; }
        if (focus === 'content') { scores.framing += 3; scores.agenda++; }
        if (focus === 'effects') { scores.cultivation += 2; scores.elm++; scores.narrative += 2; }
        if (focus === 'relationship') { scores.psi += 3; scores.sit += 2; scores['two-step']++; }

        // 2. Score based on PROCESS
        if (process === 'persuasion') { scores.elm += 3; scores.narrative += 3; scores.psi++; }
        if (process === 'shaping_view') { scores.cultivation += 3; scores.agenda += 2; }
        if (process === 'highlighting') { scores.framing += 3; }
        if (process === 'identity') { scores.sit += 3; scores.sdt += 2; }
        if (process === 'spread') { scores.diffusion += 3; scores['two-step'] += 3; }

        // 3. Score based on METHOD
        if (method === 'survey') { scores.ug += 2; scores.cultivation += 2; scores.psi++; scores.sdt++; scores.mood++; }
        if (method === 'content-analysis') { scores.framing += 3; scores.agenda++; }
        if (method === 'experiment') { scores.elm += 3; scores.narrative += 2; scores.psi++; }

        // --- Generate and Display Results ---
        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

        // DYNAMIC RESULTS: Show all theories with a score > 2. If none, show the top 2.
        let recommendations = sortedScores.filter(score => score[1] > 2);
        if (recommendations.length === 0) {
            recommendations = sortedScores.slice(0, 2);
        }

        displayResults(recommendations);
    });

    function displayResults(recommendations) {
        const topScore = recommendations.length > 0 ? recommendations[0][1] : 0;

        let resultsHTML = `
            <div class="results-header">
                <h3>Your Theory Recommendations</h3>
                <p>Based on your answers, these theories are a great starting point for your literature review.</p>
            </div>
            <div class="results-container">
        `;

        if (topScore === 0) {
            resultsHTML += '<p style="text-align:center; width: 100%;">This combination is very unique! Try exploring the full list below or adjust your answers.</p>';
        } else {
            recommendations.forEach(([key, score]) => {
                const theory = theories[key];
                const percentage = Math.round((score / topScore) * 100);
                const cardClass = (percentage > 80) ? 'primary' : 'secondary';

                resultsHTML += `
                    <div class="theory-card ${cardClass}">
                        <div class="score-bar-container">
                            <div class="score-bar" style="width: ${percentage}%;"></div>
                            <span>${percentage}% Match</span>
                        </div>
                        <h5>${theory.title}</h5>
                        <p class="reason">${theory.reason}</p>
                        <a href="#s3-theory-toolkit" data-link-id="${key}" class="read-more-btn">Scroll to Details ▼</a>
                    </div>
                `;
            });
        }

        resultsHTML += `
            </div>
            <div class="results-footer">
                <button class="reset-button">Start Over</button>
            </div>
        `;
        resultsContainer.innerHTML = resultsHTML;

        resultsContainer.classList.remove('results-hidden');
        resultsContainer.style.opacity = 1;
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add event listeners for the new buttons
        resultsContainer.querySelector('.reset-button').addEventListener('click', () => {
            resultsContainer.classList.add('results-hidden');
            quizForm.reset();
            quizForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        resultsContainer.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const theoryId = e.target.dataset.linkId;
                const targetTrigger = document.querySelector(`.collapsible-trigger[data-theory-id="${theoryId}"]`);

                if (targetTrigger) {
                    targetTrigger.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    targetTrigger.style.transition = 'background-color 0.3s';
                    targetTrigger.style.backgroundColor = '#fff3cd';
                    setTimeout(() => { targetTrigger.style.backgroundColor = ''; }, 2000);

                    const content = targetTrigger.nextElementSibling;
                    if (!content.style.maxHeight || content.style.maxHeight === "0px") {
                        setTimeout(() => { targetTrigger.click(); }, 300);
                    }
                }
            });
        });
    }
}

function setupInquiryBuilder() {
    const pathBtnExplore = document.getElementById('path-btn-explore');
    const pathBtnTest = document.getElementById('path-btn-test');
    const builderRq = document.getElementById('builder-container-rq');
    const builderH = document.getElementById('builder-container-h');

    if (!pathBtnExplore || !pathBtnTest || !builderRq || !builderH) return;

    // --- Path Selection Logic ---
    pathBtnExplore.addEventListener('click', () => {
        pathBtnExplore.classList.add('selected');
        pathBtnTest.classList.remove('selected');
        builderH.style.display = 'none';
        builderRq.style.display = 'block';
        updateRQPreview(); // Initial update
    });

    pathBtnTest.addEventListener('click', () => {
        pathBtnTest.classList.add('selected');
        pathBtnExplore.classList.remove('selected');
        builderRq.style.display = 'none';
        builderH.style.display = 'block';
        updateHypothesisPreview(); // Initial update
    });

    // --- Research Question (RQ) Builder Logic ---
    const rqFormElements = document.querySelectorAll('#rq-form select, #rq-form input');
    const rqPreview = document.getElementById('rq-preview');

    function updateRQPreview() {
        const starter = document.getElementById('rq-starter').value;
        const concept = document.getElementById('rq-concept').value || "[central concept]";
        const context = document.getElementById('rq-context').value || "[context]";
        const focus = document.getElementById('rq-focus').value || "[specific focus]";

        rqPreview.innerHTML = `RQ: ${starter} is the central concept of <strong>${concept}</strong> constructed, portrayed, or experienced in the context of <strong>${context}</strong>, focusing on <strong>${focus}</strong>?`;
    }

    rqFormElements.forEach(el => el.addEventListener('keyup', updateRQPreview));
    rqFormElements.forEach(el => el.addEventListener('change', updateRQPreview));

    // --- Hypothesis (H) Builder Logic ---
    const hFormElements = document.querySelectorAll('#h-form select, #h-form input');
    const hPreview = document.getElementById('h-preview');

    function updateHypothesisPreview() {
        const iv = document.getElementById('h-iv').value || "[Independent Variable]";
        const relation = document.getElementById('h-relation').value;
        const dv = document.getElementById('h-dv').value || "[Dependent Variable]";
        const population = document.getElementById('h-population').value;

        let sentence = `H1: An increase/presence of <strong>${iv}</strong> is associated with ${relation} level/likelihood of <strong>${dv}</strong>`;
        if (population) {
            sentence += ` among the population of <strong>${population}</strong>.`;
        } else {
            sentence += '.';
        }
        hPreview.innerHTML = sentence;
    }

    hFormElements.forEach(el => el.addEventListener('keyup', updateHypothesisPreview));
    hFormElements.forEach(el => el.addEventListener('change', updateHypothesisPreview));
}