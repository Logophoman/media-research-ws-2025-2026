// session1.js - The Research Expedition Interactive Logic (Enhanced & Upgraded)

document.addEventListener('DOMContentLoaded', function () {
    const stages = document.querySelectorAll('.expedition-stage');
    const detailsContainer = document.querySelector('.expedition-details-container');
    const detailsContent = document.querySelector('.expedition-details-content');
    const textContainer = detailsContainer.querySelector('.details-text');
    const animationContainer = detailsContainer.querySelector('.details-animation');
    let activeStage = null;

    // A central place to define our animations
    const animations = {
        'stage-1': buildBlueprintAnimation,
        'stage-2': buildGearingUpAnimation, // Placeholder for future animation
        'stage-3': buildDataCollectionAnimation, // Placeholder for future animation
        'stage-4': buildAnalysisAnimation, // Placeholder for future animation
        'stage-5': buildPresentationAnimation  // Placeholder for future animation
    };

    stages.forEach(stage => {
        stage.addEventListener('click', () => {
            const stageId = stage.id;

            if (activeStage && activeStage.id === stageId) {
                activeStage.classList.remove('active');
                detailsContainer.style.maxHeight = null;
                detailsContainer.classList.remove('show');
                activeStage = null;
                return;
            }

            if (activeStage) {
                activeStage.classList.remove('active');
            }

            stage.classList.add('active');
            activeStage = stage;

            const title = stage.dataset.title;
            const text = stage.dataset.text;
            textContainer.innerHTML = `<h4>${title}</h4><p>${text}</p><p style="font-size: 0.9em; color: #555; font-style: italic;">Click a topic in the animation to see it become the focus!</p>`;

            animationContainer.innerHTML = '';
            if (animations[stageId]) {
                animations[stageId](animationContainer);
            }

            detailsContainer.classList.add('show');
            // We set maxHeight after the content (especially the animation) is built and rendered
            // A small timeout ensures the browser has time to calculate the correct height
            setTimeout(() => {
                if (detailsContainer.classList.contains('show')) {
                    detailsContainer.style.maxHeight = detailsContent.scrollHeight + 'px';
                }
            }, 50);

            // Show the corresponding detailed content block
            const targetContentId = `content-${stageId}`;
            document.querySelectorAll('.phase-content-block').forEach(block => {
                if (block.id === targetContentId) {
                    block.style.display = 'block';
                } else {
                    block.style.display = 'none';
                }
            });
        });
    });

    // --- Animation Builder Functions ---

    /**
     * UPGRADED Animation for Stage 1: From broad topics to a user-selected focused question.
     */
    function buildBlueprintAnimation(container) {
        container.id = "blueprint-animation";
        const topics = ["Parasocial Relations", "Podcast Ads", "True Crime", "News Framing", "Host Credibility", "Audience Engagement", "Political Podcasts", "Misinformation"];
        let isFocused = false;
        const allWordElements = [];

        // Helper to check for overlaps
        function isOverlapping(rect1, rect2, padding) {
            return !(rect1.right + padding < rect2.left ||
                rect1.left > rect2.right + padding ||
                rect1.bottom + padding < rect2.top ||
                rect1.top > rect2.bottom + padding);
        }

        const placedRects = [];
        const maxRetries = 100;
        const padding = 10;

        // Use a short timeout to ensure the container has its final dimensions before we calculate positions
        setTimeout(() => {
            const containerRect = container.getBoundingClientRect();
            if (containerRect.width === 0) return; // Failsafe if container is not visible

            topics.forEach(topic => {
                const word = document.createElement('div');
                word.className = 'blueprint-word';
                word.textContent = topic;
                container.appendChild(word);
                allWordElements.push(word);

                const wordWidth = word.offsetWidth;
                const wordHeight = word.offsetHeight;

                let hasPlaced = false;
                for (let i = 0; i < maxRetries; i++) {
                    // **FIX 1: Ensure positions are within bounds**
                    const newRect = {
                        left: Math.random() * (containerRect.width - wordWidth - padding * 2) + padding,
                        top: Math.random() * (containerRect.height - wordHeight - padding * 2) + padding,
                        right: 0, bottom: 0
                    };
                    newRect.right = newRect.left + wordWidth;
                    newRect.bottom = newRect.top + wordHeight;

                    let hasOverlap = false;
                    for (const placed of placedRects) {
                        if (isOverlapping(newRect, placed, padding)) {
                            hasOverlap = true;
                            break;
                        }
                    }

                    if (!hasOverlap) {
                        word.style.left = `${newRect.left}px`;
                        word.style.top = `${newRect.top}px`;
                        placedRects.push(newRect);
                        hasPlaced = true;
                        break;
                    }
                }
                if (!hasPlaced) {
                    word.style.display = 'none';
                }
            });

            // Add click listeners after all words are placed
            allWordElements.forEach(word => {
                word.addEventListener('click', (event) => {
                    if (isFocused) return;
                    isFocused = true;

                    const clickedWord = event.currentTarget;
                    container.classList.add('focused');
                    clickedWord.classList.add('final-question');

                    // **FIX 2: Calculate the absolute center of the container**
                    const centerX = containerRect.width / 2;
                    const centerY = containerRect.height / 2;

                    // Move the clicked word to the center
                    clickedWord.style.left = `${(centerX - clickedWord.offsetWidth / 2) - 20}px`;
                    clickedWord.style.top = `${(centerY - clickedWord.offsetHeight / 2) - 15}px`;

                    // Move all other words to the same center point
                    allWordElements.forEach(otherWord => {
                        if (otherWord !== clickedWord) {
                            otherWord.style.left = `${(centerX - otherWord.offsetWidth / 2)}px`;
                            otherWord.style.top = `${centerY - otherWord.offsetHeight / 2}px`;
                        }
                    });
                });
            });

            // Trigger initial fade-in animation
            container.classList.add('run-animation');

        }, 50); // Small delay to let CSS render
    }

    /**
     * Animation for Stage 2: Gearing Up - The Research Design Toolkit.
     */
    function buildGearingUpAnimation(container) {
        container.id = "gearing-up-animation";

        const designChoices = [
            {
                id: 'survey',
                goal: 'Listener Opinions & Habits',
                toolIcon: '📋',
                toolName: 'Survey',
                instrumentIcon: '📄',
                instrumentName: 'Questionnaire',
                description: 'To understand attitudes, motivations, and self-reported behaviors of a larger group, a survey is the ideal tool. Your instrument is a carefully crafted questionnaire.'
            },
            {
                id: 'content-analysis',
                goal: 'Podcast Content & Frames',
                toolIcon: '🔎',
                toolName: 'Content Analysis',
                instrumentIcon: '📖',
                instrumentName: 'Codebook',
                description: 'To systematically analyze the themes, frames, or language within podcast episodes, a content analysis is the right method. Your instrument is a precise codebook.'
            },
            {
                id: 'experiment',
                goal: 'Causal Effects of Listening',
                toolIcon: '🧪',
                toolName: 'Experiment',
                instrumentIcon: '💡',
                instrumentName: 'Stimulus',
                description: 'To determine if listening to a podcast causes a specific effect (e.g., on attitude), an experiment provides the highest control. Your key instrument is the manipulated stimulus (e.g., two versions of an audio clip).'
            }
        ];

        // Build the HTML structure
        container.innerHTML = `
            <div class="toolkit-prompt">What do you want to find out?</div>
            <div class="toolkit-workbench"></div>
            <div class="toolkit-controls"></div>
            <div class="toolkit-description">Select a research goal above.</div>
        `;

        const workbench = container.querySelector('.toolkit-workbench');
        const controls = container.querySelector('.toolkit-controls');
        const description = container.querySelector('.toolkit-description');

        designChoices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'toolkit-button';
            button.dataset.choiceId = choice.id;
            button.textContent = choice.goal;
            controls.appendChild(button);

            button.addEventListener('click', () => {
                // Clear previous state
                workbench.innerHTML = '';
                controls.querySelectorAll('.toolkit-button').forEach(btn => btn.classList.remove('active'));

                // Set active state
                button.classList.add('active');
                description.textContent = choice.description;

                // Create and animate in the tool
                const toolEl = document.createElement('div');
                toolEl.className = 'toolkit-item tool';
                toolEl.innerHTML = `<div class="item-icon">${choice.toolIcon}</div><div class="item-name">${choice.toolName}</div>`;
                workbench.appendChild(toolEl);

                // Create and animate in the instrument
                const instrumentEl = document.createElement('div');
                instrumentEl.className = 'toolkit-item instrument';
                instrumentEl.innerHTML = `<div class="item-icon">${choice.instrumentIcon}</div><div class="item-name">${choice.instrumentName}</div>`;
                workbench.appendChild(instrumentEl);

                // Trigger the animation by adding the 'visible' class after a short delay
                setTimeout(() => {
                    toolEl.classList.add('visible');
                    instrumentEl.classList.add('visible');
                }, 50);
            });
        });
    }

    function buildDataCollectionAnimation(container) {
        container.id = "data-collection-animation";

        const methods = [
            { id: 'survey', name: 'Run Survey', tool: '📝', target: '🧑' },
            { id: 'content', name: 'Analyze Content', tool: '🔎', target: '📄' },
            { id: 'scraping', name: 'Scrape Web', tool: '🎣', target: '🌐' }
        ];

        // Build the HTML structure
        container.innerHTML = `
            <div class="collection-source"></div>
            <div class="collection-controls"></div>
            <div class="collection-path">
                <div class="collection-researcher">🧑‍🔬</div>
                <div class="collection-storage">
                    <div class="storage-label">Raw Data</div>
                    <div class="storage-bin"></div>
                </div>
            </div>
            <div class="collection-status">Select a method to begin collecting data.</div>
        `;

        const source = container.querySelector('.collection-source');
        const controls = container.querySelector('.collection-controls');
        const researcher = container.querySelector('.collection-researcher');
        const storageBin = container.querySelector('.storage-bin');
        const status = container.querySelector('.collection-status');

        // 1. Create the flowing stream of potential data
        const sourceIcons = ['🧑', '📄', '🎬', '🌐', '💬'];
        const streamInterval = setInterval(() => {
            const icon = document.createElement('div');
            icon.className = 'source-item';
            icon.textContent = sourceIcons[Math.floor(Math.random() * sourceIcons.length)];
            icon.style.left = `${Math.random() * 90}%`;
            icon.style.animationDuration = `${3 + Math.random() * 3}s`;
            source.appendChild(icon);
            setTimeout(() => icon.remove(), 6000); // Cleanup
        }, 500);

        // 2. Create control buttons
        methods.forEach(method => {
            const button = document.createElement('button');
            button.className = 'collection-button';
            button.textContent = method.name;
            controls.appendChild(button);

            button.addEventListener('click', () => {
                if (container.classList.contains('collecting')) return; // Prevent spamming

                controls.querySelectorAll('.collection-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                researcher.textContent = method.tool;
                status.textContent = `Using ${method.name} to gather specific data...`;
                container.classList.add('collecting');

                // 3. Animate data points flying to the bin
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const dataPoint = document.createElement('div');
                        dataPoint.className = 'data-point';
                        dataPoint.textContent = method.target;
                        container.appendChild(dataPoint);

                        // Set start position near the researcher tool
                        dataPoint.style.top = '45%';
                        dataPoint.style.left = '35%';

                        // After animation ends, add to bin and remove element
                        setTimeout(() => {
                            const collectedDot = document.createElement('div');
                            collectedDot.className = 'collected-dot';
                            storageBin.appendChild(collectedDot);
                            dataPoint.remove();
                        }, 1450);
                    }, i * 200);
                }

                // Reset state after animation burst
                setTimeout(() => {
                    researcher.textContent = '🧑‍🔬';
                    status.textContent = 'Data collected! Select another method to continue.';
                    container.classList.remove('collecting');
                }, 2500);
            });
        });

        // Make sure to clear the interval if the user clicks to another stage
        // This is a robust way to handle cleanup
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && container.innerHTML === '') {
                    clearInterval(streamInterval);
                    observer.disconnect();
                }
            });
        });
        observer.observe(container.parentNode, { childList: true });
    }

    function buildAnalysisAnimation(container) {
        container.id = "analysis-animation";

        // Build the HTML structure
        container.innerHTML = `
            <div class="engine-input">
                <div class="engine-data-label">Raw Data</div>
                <div class="engine-data-pile"></div>
            </div>
            <div class="engine-body">
                <div class="engine-stage" id="stage-clean">
                    <div class="stage-icon">🧼</div>
                    <div class="stage-name">Cleaning</div>
                    <div class="stage-gears">⚙️⚙️</div>
                </div>
                <div class="engine-arrow">→</div>
                <div class="engine-stage" id="stage-analyze">
                    <div class="stage-icon">🔬</div>
                    <div class="stage-name">Analyzing</div>
                    <div class="stage-gears">⚙️⚙️</div>
                </div>
                 <div class="engine-arrow">→</div>
                <div class="engine-stage" id="stage-visualize">
                    <div class="stage-icon">📈</div>
                    <div class="stage-name">Visualizing</div>
                    <div class="stage-gears">⚙️⚙️</div>
                </div>
            </div>
            <div class="engine-output">
                <div class="engine-data-label">Insights</div>
                <div class="engine-chart-container"></div>
            </div>
            <button class="engine-button">Start Analysis</button>
        `;

        const dataPile = container.querySelector('.engine-data-pile');
        const chartContainer = container.querySelector('.engine-chart-container');
        const startButton = container.querySelector('.engine-button');
        const engineStages = container.querySelectorAll('.engine-stage');
        let isRunning = false;

        // Populate the initial raw data pile
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.className = 'raw-dot';
            dot.style.setProperty('--rand-x', `${(Math.random() - 0.5) * 60}px`);
            dot.style.setProperty('--rand-y', `${(Math.random() - 0.5) * 30}px`);
            dataPile.appendChild(dot);
        }

        startButton.addEventListener('click', () => {
            if (isRunning) return;
            isRunning = true;

            startButton.textContent = 'Processing...';
            startButton.disabled = true;
            chartContainer.innerHTML = ''; // Clear previous chart

            // 1. Animate raw data flying into the machine
            container.classList.add('processing');

            // 2. Animate stages sequentially
            setTimeout(() => { engineStages[0].classList.add('active'); }, 500);
            setTimeout(() => { engineStages[0].classList.remove('active'); engineStages[1].classList.add('active'); }, 1500);
            setTimeout(() => { engineStages[1].classList.remove('active'); engineStages[2].classList.add('active'); }, 2500);

            // 3. Build and show the final chart
            setTimeout(() => {
                engineStages[2].classList.remove('active');
                container.classList.remove('processing');

                // Create a simple bar chart
                const chart = document.createElement('div');
                chart.className = 'insight-chart';
                chart.innerHTML = `
                    <div class="bar" style="height: 60%;"></div>
                    <div class="bar" style="height: 30%;"></div>
                    <div class="bar" style="height: 80%;"></div>
                `;
                chartContainer.appendChild(chart);

                // Animate bars growing
                setTimeout(() => chart.querySelectorAll('.bar').forEach(bar => bar.classList.add('visible')), 50);

                startButton.textContent = 'Run Again';
                startButton.disabled = false;
                isRunning = false;
            }, 3500);
        });
    }
    function buildPresentationAnimation(container) {
        container.id = "presentation-animation";

        container.innerHTML = `
            <div class="summit-audiences">
                <div class="audience" id="audience-academic" style="top: 10%; left: 5%;">
                    <div class="audience-icon">🧑‍🏫</div><span class="audience-label">University</span>
                </div>
                <div class="audience" id="audience-public" style="top: 10%; right: 42%;">
                    <div class="audience-icon">🌍</div><span class="audience-label">Public</span>
                </div>
                <div class="audience" id="audience-stakeholder" style="top: 10%; left: 70%;">
                    <div class="audience-icon">🏢</div><span class="audience-label">Journals</span>
                </div>
            </div>
            <div class="summit-platform">
                <div class="summit-researcher" style="bottom: 10%;">🧑‍🔬</div>
            </div>
            <button class="summit-button">Present Findings</button>
        `;

        const button = container.querySelector('.summit-button');
        const researcher = container.querySelector('.summit-researcher');
        const audiences = container.querySelectorAll('.audience');
        let isPresenting = false;

        button.addEventListener('click', () => {
            if (isPresenting) return;
            isPresenting = true;

            button.disabled = true;
            button.textContent = 'Presenting...';
            researcher.classList.add('presenting');

            // Clear any previous 'received' state
            audiences.forEach(audience => audience.classList.remove('received'));

            // Fire an "insight packet" towards each audience
            audiences.forEach((audience, index) => {
                const packet = document.createElement('div');
                packet.className = 'insight-packet';
                container.appendChild(packet);

                // Calculate positions
                const researcherRect = researcher.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const audienceRect = audience.getBoundingClientRect();

                const startX = researcherRect.left + (researcherRect.width / 2) - containerRect.left;
                const startY = researcherRect.top + (researcherRect.height / 2) - containerRect.top;

                const endX = audienceRect.left + (audienceRect.width / 2) - containerRect.left;
                const endY = audienceRect.top + (audienceRect.height / 2) - containerRect.top;

                // Set start position and custom properties for the animation
                packet.style.left = `${startX}px`;
                packet.style.top = `${startY}px`;
                packet.style.setProperty('--end-x', `${endX - startX}px`);
                packet.style.setProperty('--end-y', `${endY - startY}px`);

                // Add a slight delay for each packet
                packet.style.animationDelay = `${index * 0.2}s`;
                packet.classList.add('fire');

                // When the packet animation is nearly done, highlight the audience
                setTimeout(() => {
                    audience.classList.add('received');
                }, 800 + (index * 200));

                // Clean up the packet element after animation
                packet.addEventListener('animationend', () => packet.remove());
            });

            // Reset the whole animation state
            setTimeout(() => {
                button.disabled = false;
                button.textContent = 'Present Again';
                researcher.classList.remove('presenting');
                isPresenting = false;
            }, 2500);
        });
    }

    const timelineContainer = document.getElementById('stats-timeline-container');
    if (timelineContainer) {
        const progress = timelineContainer.querySelector('.timeline-progress');
        const milestones = timelineContainer.querySelectorAll('.timeline-milestone');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 1. Start the progress bar animation
                    progress.style.width = '100%';

                    // 2. Trigger milestones to appear with a delay
                    milestones.forEach((milestone, index) => {
                        // Delay is based on the animation duration of the progress bar
                        const delay = (index + 1) * 700; // Staggered appearance
                        setTimeout(() => {
                            milestone.classList.add('visible');
                        }, delay);
                    });

                    // 3. Stop observing after the animation has been triggered once
                    observer.unobserve(timelineContainer);
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of the element is visible
        });

        observer.observe(timelineContainer);
    }

    const gameContainer = document.getElementById('group-former-container');
    if (gameContainer) {
        // Data Source
        const questions = [
            {
                question: "It's Sunday evening. Your ideal way to listen to a podcast is:",
                options: {
                    A: { emoji: '🛋️', text: 'Relaxing on the sofa' },
                    B: { emoji: '🍳', text: 'While doing chores' },
                    C: { emoji: '🏃‍♂️', text: 'During a workout or walk' },
                    D: { emoji: '🤔', text: 'I rarely listen on Sundays' }
                }
            },
            {
                question: "Which primary research method sounds most appealing to you?",
                options: {
                    A: { emoji: '📋', text: 'Surveying hundreds of people' },
                    B: { emoji: '🔎', text: 'Analyzing text & content deeply' },
                    C: { emoji: '🧪', text: 'Running a controlled experiment' },
                    D: { emoji: '✨', text: 'I like combining all of them!' }
                }
            },
            {
                question: "When you get a new dataset, you are most excited about:",
                options: {
                    A: { emoji: '📊', text: 'Finding patterns in the numbers' },
                    B: { emoji: '💬', text: 'Reading the qualitative responses' },
                    C: { emoji: '📈', text: 'Creating powerful visualizations' },
                    D: { emoji: '🗂️', text: 'Just organizing the data neatly' }
                }
            },
            {
                question: "In a group project, you naturally take the role of the:",
                options: {
                    A: { emoji: '🗺️', text: 'The big-picture planner' },
                    B: { emoji: '⚙️', text: 'The detailed analyst' },
                    C: { emoji: '✍️', text: 'The final report writer' },
                    D: { emoji: '🤝', text: 'The team coordinator' }
                }
            },
            {
                question: "A new topic lands on your desk. You start by:",
                options: {
                    A: { emoji: '📚', text: 'Diving into papers — you love exploring details' },          // lit recherche
                    B: { emoji: '🤔', text: 'Questioning what it could really mean' },                    // ergebnisinterpretation
                    C: { emoji: '✍️', text: 'Sketching how to tell its story' },                          // verschriftlichung
                    D: { emoji: '🎨', text: 'Visualizing how to present it beautifully' }                 // präsentation/layout
                }
            },
            {
                question: "Your strength in research shows when you:",
                options: {
                    A: { emoji: '🔎', text: 'Dig deep and find hidden connections in literature' },       // lit recherche
                    B: { emoji: '🧩', text: 'Spot what the data really says — and what it doesn’t' },     // ergebnisinterpretation
                    C: { emoji: '🖋️', text: 'Turn findings into a clear, engaging story' },              // verschriftlichung
                    D: { emoji: '🖼️', text: 'Make results look sharp and intuitive' }                    // präsentation/layout
                }
            },
            {
                question: "In a research team, others rely on you to:",
                options: {
                    A: { emoji: '📖', text: 'Know every detail from the background readings' },           // lit recherche
                    B: { emoji: '🧠', text: 'Think critically about what results mean' },                 // ergebnisinterpretation
                    C: { emoji: '💬', text: 'Write and shape the report’s story' },                       // verschriftlichung
                    D: { emoji: '🎞️', text: 'Design slides and layouts that wow' }                       // präsentation/layout
                }
            },
            {
                question: "The part of research you secretly enjoy most:",
                options: {
                    A: { emoji: '🧾', text: 'Reading, highlighting, and connecting ideas' },              // lit recherche
                    B: { emoji: '📊', text: 'Figuring out what’s really behind the numbers' },            // ergebnisinterpretation
                    C: { emoji: '🗒️', text: 'Writing up results in your own words' },                    // verschriftlichung
                    D: { emoji: '🪄', text: 'Crafting a beautiful final presentation' }                   // präsentation/layout
                }
            },
            {
                question: "Which podcast research topic sparks your immediate interest?",
                options: {
                    A: { emoji: '👥', text: 'The listeners & community' },
                    B: { emoji: '🎙️', text: 'The hosts & content strategies' },
                    C: { emoji: '🧠', text: 'The psychological effects' },
                    D: { emoji: '💰', text: 'The industry & monetization' }
                }
            }
        ];

        // Element Hooks
        const overlay = document.getElementById('game-overlay');
        const overlayTitle = document.getElementById('overlay-title');
        const startGameBtn = document.getElementById('start-game-btn');
        const nextQuestionBtn = document.getElementById('next-question-btn');
        const cards = document.querySelectorAll('.tribe-card');
        const questionText = document.getElementById('question-text');
        const questionCounter = document.getElementById('question-counter');
        const timerText = document.getElementById('timer-text');
        const timerBar = document.getElementById('timer-bar');

        // State
        let currentQuestionIndex = -1;
        let timerInterval;
        const TIMER_DURATION = 30;

        function initGame() {
            startGameBtn.addEventListener('click', () => {
                overlay.classList.remove('visible');
                currentQuestionIndex = 0;
                startRound(currentQuestionIndex);
            });
            nextQuestionBtn.addEventListener('click', handleNextQuestion);
            cards.forEach(card => card.addEventListener('click', handleCardClick));
        }

        function startRound(index) {
            const questionData = questions[index];

            // Reset UI
            nextQuestionBtn.disabled = true;
            questionCounter.textContent = `Round ${index + 1} / ${questions.length}`;
            questionText.textContent = questionData.question;
            cards.forEach(card => {
                const option = card.dataset.option;
                card.querySelector('.card-emoji').textContent = questionData.options[option].emoji;
                card.querySelector('.card-text').textContent = questionData.options[option].text;
                card.classList.remove('selected');
                card.classList.remove('disabled');
                card.querySelector('.peer-count').textContent = '0';
            });

            // Start Timer
            let secondsLeft = TIMER_DURATION;
            timerText.textContent = `0:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
            timerBar.style.transition = 'none'; // Reset transition for immediate effect
            timerBar.style.width = '100%';
            timerBar.style.backgroundColor = '#28a745';

            void timerBar.offsetWidth; // Force reflow
            timerBar.style.transition = `width ${TIMER_DURATION}s linear, background-color 0.5s ease`;

            timerInterval = setInterval(() => {
                secondsLeft--;
                timerText.textContent = `0:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
                if (secondsLeft <= 10) {
                    timerBar.style.backgroundColor = '#ffc107'; // Yellow
                }
                if (secondsLeft <= 5) {
                    timerBar.style.backgroundColor = '#dc3545'; // Red
                }
                if (secondsLeft <= 0) {
                    endRound();
                }
            }, 1000);

            timerBar.style.width = '0%';
        }

        function handleCardClick(event) {
            const selectedCard = event.currentTarget;
            if (selectedCard.classList.contains('disabled')) return;

            cards.forEach(card => card.classList.remove('selected'));
            selectedCard.classList.add('selected');

            // SIMULATION: On your screen, it shows you've made a choice.
            // In class, students see their choice highlighted on the main screen.
            const peerCountEl = selectedCard.querySelector('.peer-count');
            peerCountEl.textContent = '1';
        }

        function endRound() {
            clearInterval(timerInterval);
            timerText.textContent = "Time's up!";
            cards.forEach(card => card.classList.add('disabled'));
            nextQuestionBtn.disabled = false;
        }

        function handleNextQuestion() {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                startRound(currentQuestionIndex);
            } else {
                showEndScreen();
            }
        }

        function showEndScreen() {
            clearInterval(timerInterval);
            overlayTitle.innerHTML = 'Great! Now look around...<br><small>I hope you\'ve found your potential research tribe. Use this as a starting point to form your groups!</small>';
            startGameBtn.textContent = 'Play Again';
            overlay.classList.add('visible');
            nextQuestionBtn.disabled = true;
        }

        initGame();
    }

    function buildPlaceholderAnimation(container) {
        container.innerHTML = `<p style="color: #888; font-style: italic;">Interactive element coming soon!</p>`;
        container.id = '';
    }

    document.querySelector('#stage-1').click();
});