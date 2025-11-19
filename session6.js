/**
 * Session 6: The Design Audit Engine
 * Handles the dynamic rendering of group feedback and shared methodological wisdom.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSession6();
});

function initSession6() {
    const container = document.getElementById('audit-dashboard');
    if (!container) return;

    // Clear loading message
    container.innerHTML = '';

    // 1. Render Groups
    renderAudits(container);
}

/* ==========================================================================
   DATA ARCHITECTURE (TODO: To be populated in next steps)
   ========================================================================== */

/**
 * Shared Wisdom Libraries
 * Reusable blocks of feedback based on method type.
 */
const commonLib = {
    survey: {
        // TODO: Define reusable survey tips (e.g., Social Desirability, Scale types)
    },
    contentAnalysis: {
        // TODO: Define reusable coding tips (e.g., Inter-Coder Reliability, Unit of Analysis)
    },
    experiment: {
        // TODO: Define reusable experiment tips (e.g., Manipulation Checks, Ethics)
    }
};

commonLib.survey = [
    {
        id: "srv_desirability",
        icon: "🎭",
        title: "The 'Social Desirability' Shield",
        content: "You are researching sensitive topics (Loneliness, Trust, Fear). Participants often subconsciously answer in a way that makes them look 'good' or 'normal' rather than truthful.",
        action: "<strong>The Fix:</strong> Add a 'face-saving' introduction to sensitive questions. <br><em>Example:</em> Instead of 'How lonely are you?', try: 'Many people feel disconnected these days. In the last two weeks, how often have you felt...'"
    },
    {
        id: "srv_scales",
        icon: "⚖️",
        title: "The 'Middle Category' Decision",
        content: "Should you use an even (4, 6) or odd (5, 7) point scale? <br><strong>Odd (1-5):</strong> Allows a 'Neutral' position. Good for attitudes where 'I don't care' is a valid opinion. <br><strong>Even (1-4):</strong> Forces a choice. Good for 'Fear' or 'Agreement' where you want to avoid fence-sitting.",
        action: "<strong>Recommendation:</strong> For standard scales (Likert), stick to <strong>5 points</strong> (Strongly Disagree to Strongly Agree) to allow for nuance. Only use 4 points if you suspect participants are being lazy (Satisficing)."
    },
    {
        id: "srv_attention",
        icon: "👀",
        title: "The Speeding Ticket (Attention Check)",
        content: "Online respondents often click through surveys without reading. This creates 'noise' in your data.",
        action: "<strong>The Fix:</strong> Ask one question multiple times. <br><em>But:</em> Code the question in one direction and another direction to catch speeders that just click 7,7,7,7..."
    },
    {
        id: "srv_doublebarrel",
        icon: "🔫",
        title: "The Double-Barrel Trap",
        content: "Avoid asking two things in one question. <br><em>Example:</em> 'Do you trust the police to be fair and effective?'",
        action: "<strong>The Fix:</strong> Split this! A respondent might think the police are 'effective' (catch criminals) but NOT 'fair' (discriminatory). If you combine them, you can't interpret the answer. <br><a href='session5.html#item-writing-clinic' target='_blank'>👉 Review Session 5 Item Clinic</a>"
    },
    {
        id: "srv_sampling",
        icon: "❄️",
        title: "The Snowball Reality Check",
        content: "You are using 'Snowball Sampling' via social media. Your sample will likely be WEIRD (Western, Educated, Industrialized, Rich, Democratic) and young.",
        action: "<strong>The Strategy:</strong> Do not hide this. In your final report, do not claim your results apply to 'All Women' or 'The General Public.' Explicitly define your population as 'Tech-savvy podcast listeners within [Your Network].' This honesty increases your scientific credibility."
    },
    {
        id: "srv_cleaning",
        icon: "🧹",
        title: "The 'Straight-Liner' Trap",
        content: "Some participants will click the same answer (e.g., '3') for every single question just to finish quickly. This destroys your data quality.",
        action: "<strong>The Fix:</strong> Calculate the 'Standard Deviation' of a participant's answers. If it is 0 (meaning no variation at all), exclude that participant from your final dataset."
    },
    {
        id: "srv_resources",
        icon: "🧰",
        title: "Platform & Sampling Toolkit",
        content: "Don't reinvent the wheel. Use these standard tools to build and validate your instrument.",
        action: `
            <ul style="margin-top:0.5rem; padding-left:1.2rem;">
                <li><strong>SoSci Survey:</strong> <a href="https://www.soscisurvey.de/help/doku.php/en:start" target="_blank">The Official Manual</a>. Use this for logic filters and randomization.</li>
                <li><strong>Sample Size Calculator:</strong> <a href="https://www.gigacalculator.com/calculators/power-sample-size-calculator.php" target="_blank">Check your Power</a>. Ensure your N is large enough for your population.</li>
                <li><strong>Scales:</strong> <a href="https://zis.gesis.org/en/search" target="_blank">GESIS ZIS</a>. Search here for validated German scales (e.g., 'Vertrauen', 'Einsamkeit').</li>
            </ul>
        `
    }
];

/* ==========================================================================
   ACTION PACKAGE 2: THE CODEBOOK ARCHITECT (Content Analysis Wisdom)
   Target Groups: 4, 8
   ========================================================================== */

commonLib.contentAnalysis = [
    {
        id: "ca_manifest",
        icon: "🧊",
        title: "The Iceberg Rule (Manifest vs. Latent)",
        content: "<strong>Manifest Content</strong> is what is explicitly said/shown (e.g., 'The host said the word <em>murder</em>'). <br><strong>Latent Content</strong> is the underlying meaning/tone (e.g., 'The host was <em>sarcastic</em>'). Latent content is much harder to code reliably.",
        action: "<strong>The Strategy:</strong> Whenever possible, turn Latent concepts into Manifest indicators. Don't just ask 'Was the tone empathetic?'. Ask: 'Did the host use specific humanizing words (e.g., mother, daughter, loved one)?'."
    },
    {
        id: "ca_reliability",
        icon: "🤝",
        title: "The 'Mind-Meld' (Inter-Coder Reliability)",
        content: "The biggest risk in Content Analysis: Coder A thinks a segment is 'Neutral', but Coder B thinks it is 'Critical'. If you split the work without checking this, your data is invalid.",
        action: "<strong>The Fix:</strong> You must conduct a <strong>Pilot Phase</strong>. All group members code the <em>same</em> 3 episodes independently. Compare results. If you disagree, update the Codebook rules until you agree. Only then split the sample."
    },
    {
        id: "ca_unit",
        icon: "⏱️",
        title: "Defining the Unit of Analysis",
        content: "What exactly are you coding? The whole episode? A specific segment? A single sentence?",
        action: "<strong>The Fix:</strong> Be precise with timestamps. <br>For <strong>Group 4 (CTAs):</strong> The unit is the 'Call to Action instance'. One episode might have 3 units (Pre-roll, Mid-roll, Post-roll). <br>For <strong>Group 8 (Empathy):</strong> The unit might be 'The Character Profile Segment'."
    },
    {
        id: "ca_other",
        icon: "🗑️",
        title: "The 'Other' Bucket",
        content: "Reality is always messier than your categories. You will encounter content that doesn't fit your codebook.",
        action: "<strong>The Fix:</strong> Every categorical variable must have an <strong>'Other / Miscellaneous'</strong> option with a text field. This prevents you from forcing data into the wrong box just to make it fit."
    },
    {
        id: "ca_forge_link",
        icon: "🛠️",
        title: "Refine Your Rules",
        content: "Are your category definitions watertight? Use the tool from Session 5 to stress-test them.",
        action: "<a href='session5.html#codebook-crucible' target='_blank'>👉 Return to the Codebook Crucible (Session 5)</a>"
    },
    {
        id: "ca_sampling_bias",
        icon: "📉",
        title: "The 'Top Charts' Bias",
        content: "If you only analyze the 'Top 100' podcasts, you are only studying highly professional, commercialized content. You miss the indie/amateur landscape.",
        action: "<strong>The Strategy:</strong> Be honest about your scope. Title your study '...in <em>Popular</em> German Podcasts', not just 'in German Podcasts'. Alternatively, randomly sample 5 episodes from page 10 of the search results to compare."
    },
    {
        id: "ca_resources",
        icon: "🧰",
        title: "The Coding Suite",
        content: "You need a clean environment to input your data. Do not just type into a blank Excel sheet without structure.",
        action: `
            <ul style="margin-top:0.5rem; padding-left:1.2rem;">
                <li><strong>Structure:</strong> Your Excel columns should be: <em>Coder_ID, Case_ID, Link, Timestamp, [Var1], [Var2]... [Notes]</em>.</li>
                <li><strong>Transcription:</strong> <a href="https://openai.com/research/whisper" target="_blank">OpenAI Whisper</a> or <a href="https://colab.research.google.com/" target="_blank">Google Colab</a> for automated text generation.</li>
            </ul>
        `
    }
];

/* ==========================================================================
   ACTION PACKAGE 3: THE LAB COMMANDER (Experimental Wisdom)
   Target Group: 1
   ========================================================================== */

commonLib.experiment = [
    {
        id: "exp_manipulation",
        icon: "✅",
        title: "The 'Did It Work?' Check (Manipulation Check)",
        content: "You are assuming your audio clip causes fear. But what if it's just boring? If participants don't get scared, you can't test desensitization.",
        action: "<strong>The Fix:</strong> Add a single question <em>immediately</em> after the clip: 'On a scale of 1-10, how disturbing did you find this audio?'. If a participant answers '1', you might need to exclude them from the analysis because the 'treatment' failed."
    },
    {
        id: "exp_baseline",
        icon: "📉",
        title: "Measuring Change (Pre-Test/Post-Test)",
        content: "To measure a change in State Anxiety (Desensitization), you must know where they started. Some people are just naturally anxious.",
        action: "<strong>The Strategy:</strong> Measure State Anxiety TWICE. <br><strong>T1 (Baseline):</strong> At the very start of the survey. <br><strong>T2 (Reaction):</strong> Immediately after the audio clip. <br>Your DV is the <em>difference</em> between T2 and T1."
    },
    {
        id: "exp_ethics",
        icon: "🛡️",
        title: "The Safety Net (Ethics & Debriefing)",
        content: "You are intentionally inducing negative emotions (fear/anxiety). This requires strict ethical safeguards.",
        action: "<strong>Mandatory:</strong> <br>1. <strong>Trigger Warning:</strong> Clear warning at the start about violent/disturbing content. <br>2. <strong>Mood Repair:</strong> Do not let them leave the survey scared. Show a 'palate cleanser' at the end (e.g., a cute animal video or a calming image) to restore their baseline mood."
    },
    {
        id: "exp_environment",
        icon: "🎧",
        title: "The 'Headphone' Variable",
        content: "Since this is likely an online experiment, you can't control where they are. Listening to a horror clip on a bus is different than listening alone in the dark.",
        action: "<strong>The Fix:</strong> Add a control question: 'How did you listen to the clip?' (Headphones vs. Speakers) and 'Where are you right now?' (Public vs. Private). You may need to control for this in your analysis."
    },
    {
        id: "exp_exclusion",
        icon: "🚫",
        title: "The 'Trash Bin' Protocol (Exclusion Criteria)",
        content: "What do you do with a participant who failed the manipulation check (e.g., said the horror clip was 'funny')?",
        action: "<strong>The Rule:</strong> You must define this <em>before</em> you analyze the data. Write it down now: 'We will treat any participant who rates the stimulus fear level below 4 on a 7-point scale as such and such. Or exclude these and those people.' This prevents p-hacking (cheating) later."
    },
    {
        id: "exp_resources",
        icon: "🎛️",
        title: "Experimental Control Toolkit",
        content: "Running an experiment requires precise control over the stimulus presentation.",
        action: `
            <ul style="margin-top:0.5rem; padding-left:1.2rem;">
                <li><strong>Audio Normalization:</strong> Use <a href="https://www.audacityteam.org/" target="_blank">Audacity (Free)</a> to ensure your 'Scary' clip and 'Neutral' clip are exactly the same volume (Loudness Normalization).</li>
                <li><strong>Randomization:</strong> In SoSci Survey, use the <a href="https://www.soscisurvey.de/help/doku.php/en:create:randomization" target="_blank">Random Generator</a> feature to assign participants to groups automatically.</li>
            </ul>
        `
    }
];

/* ==========================================================================
   ACTION PACKAGE 4: THE PROJECT STRATEGIST (General Wisdom for All)
   Target Groups: All (1, 2, 4, 5, 6, 8)
   ========================================================================== */

commonLib.general = [
    {
        id: "gen_alignment",
        icon: "🔗",
        title: "The Methodological Alignment Check",
        content: "Does your Method actually produce the data needed to answer your Hypothesis? <br><em>Common Error:</em> Hypothesizing a causal effect ('Listening causes fear') but using a cross-sectional survey (which only shows 'Listening is related to fear').",
        action: "<strong>The Fix:</strong> Review your wording. If you are doing a Survey, use words like 'associated with', 'related to', or 'predicts'. Avoid 'leads to' or 'causes' unless you are doing an Experiment."
    },
    {
        id: "gen_gdpr",
        icon: "🔒",
        title: "The 'Anonymous' Promise (GDPR/DSGVO)",
        content: "As university researchers, you must strictly adhere to data privacy. There is a difference between <strong>Anonymous</strong> (no identifiers exist) and <strong>Confidential</strong> (identifiers exist but are kept secret).",
        action: "<strong>The Rule:</strong> Do not collect IP addresses or Email addresses within your main dataset. If you need emails for a raffle/incentive, collect them in a <em>separate</em>, disconnected survey link at the end."
    },
    {
        id: "gen_bias",
        icon: "🎓",
        title: "The 'WEIRD' Sample Reality",
        content: "Most student projects rely on 'WEIRD' samples: <strong>W</strong>estern, <strong>E</strong>ducated, <strong>I</strong>ndustrialized, <strong>R</strong>ich, <strong>D</strong>emocratic. Your participants are likely other students.",
        action: "<strong>The Strategy:</strong> This is acceptable for a course project, <em>but you must acknowledge it</em>. In your limitations section, state clearly that your results may not generalize to the broader, older, or less-educated population."
    },
    {
        id: "gen_pretest",
        icon: "🚦",
        title: "The 'Dress Rehearsal' (Pre-Test)",
        content: "You cannot fix a survey or codebook once data collection starts. A confusing question or a missing category can ruin your entire dataset.",
        action: "<strong>Mandatory Step:</strong> Before you launch, find <strong>3 people</strong> outside your group to take your survey or test your codebook. Ask them to 'Think Aloud' while they do it. If they hesitate or ask 'What does this mean?', you need to rewrite that item."
    }
];

/**
 * Group Specific Data
 * Stores the unique analysis for each group.
 */
const groupData = [
    // GROUP 1 (TODO: Generate Deep Dive)
    {
        id: "1",
        title: "True Crime & Anxiety: Desensitization Experiment",
        method: "experiment",
        audit: {
            strengths: "The distinction between <strong>Trait-Anxiety</strong> (general personality) and <strong>State-Anxiety</strong> (momentary reaction) is excellent and theoretically sound. Your literature base (Fanti et al., Krahé et al.) strongly supports the desensitization hypothesis.",
            adjustments: "<strong>The 'Quasi' Reality:</strong> You cannot 'manipulate' habitual consumption. You are comparing pre-existing groups. <br><strong>The Priming Problem:</strong> If you measure baseline anxiety immediately before the clip, you flag the purpose of the study. Participants might 'help' you by reporting higher fear later. <strong>Recommendation:</strong> Use a 'Washout Task' (e.g., 3 demographic questions or a simple logic puzzle) between the Pre-test and the Stimulus to reset their mental focus.",
            risks: "<strong>The 'Floor Effect':</strong> If your audio clip isn't scary enough, <em>no one</em> will show increased anxiety. High and Low consumers will both rate it a '2/10'. You won't find any difference, not because the theory is wrong, but because the stimulus was weak."
        },
        fieldKit: [], // (This gets filled automatically by the render function with commonLib)
        reflection: [
            {
                q: "The Baseline Necessity",
                why: "If a 'High Consumer' reports low anxiety after the clip, is it because they are desensitized, or because they were just having a really relaxing day? You <strong>must</strong> measure their emotional state <em>before</em> they press play to calculate the change."
            },
            {
                q: "The 'Familiarity' Confound",
                why: "Heavy listeners know many cases. If your clip is from a famous case (e.g., Ted Bundy) and a 'High Consumer' recognizes it, their fear might drop simply because they <em>know the ending</em>. How will you ensure the clip is novel to them?"
            },
            {
                q: "Sensation Seeking vs. Desensitization",
                why: "High consumers might not be 'numb'—they might just be 'Sensation Seekers' who <em>enjoy</em> the rush of fear. If they rate the clip as 'Exciting' rather than 'Scary', does that count as desensitization? Should you measure 'Enjoyment' as a control variable?"
            },
            {
                q: "The 'Dropout' Bias",
                why: "In online experiments, the most anxious people might simply close the browser when the clip gets scary. If you only analyze the people who finished, you are analyzing the 'bravest' survivors. How will you track 'Dropouts'?"
            },
            {
                q: "The 'Headphone' Factor",
                why: "Sound design relies on immersion. A participant listening on a laptop speaker in a sunny kitchen will feel less fear than one listening with noise-canceling headphones in the dark. You could ask about their listening environment."
            },
            {
                q: "Defining 'Heavy' Consumption",
                why: "Is a 'Heavy User' someone who listens <em>frequently</em> (every day) or <em>intensely</em> (only the most violent shows)? Someone who listens to 'comedy true crime' daily might be less desensitized than someone who listens to 'hardcore forensic' podcasts once a week."
            },
            {
                q: "The Attention Check",
                why: "Since this is an online experiment, how will you ensure they actually listened to the audio? (e.g., Include a simple content question at the end: 'What specific weapon was mentioned?')."
            },
            {
                q: "Ethical Safety (Mandatory)",
                why: "You are intentionally inducing fear. Do you have a 'Mood Repair' plan (e.g., a cute animal video) at the end to ensure participants don't leave the experiment in a state of distress?"
            }
        ]
    },
{
        id: "2",
        title: "Feminism vs. Misandry: Attitudes in German Podcasts",
        method: "contentAnalysis",
        audit: {
            strengths: "Addressing the 'Misandry Myth' (Hopkins-Doyle et al.) within the German podcast landscape is a timely and socially relevant project. The theoretical distinction between <strong>'Systemic Critique'</strong> (attacking Patriarchy) and <strong>'Individual Derogation'</strong> (attacking Men) is excellent. If you can operationalize this distinction reliably, your study will provide valuable empirical evidence to a heated public debate.",
            adjustments: "<strong>Operationalizing 'Derogatory':</strong> This is your hardest challenge. When does a joke become an insult? Is 'Men are trash' (a meme) coded as 'Derogatory towards individuals' or 'Systemic frustration'? You need an extremely precise codebook with 'Anchor Examples' for every level of your scale, or your Inter-Coder Reliability will be zero. <br><strong>Sampling Bias:</strong> You limit yourself to the '10 most popular' podcasts. These are professional media products that are likely highly curated and moderate to appeal to the masses. You might miss the more radical/authentic discourse found in niche indie podcasts, skewing your results towards 'No Misandry'.",
            risks: "<strong>Context Collapse:</strong> Podcasts are conversational and ironic. A host might say something 'sexist' as a joke or to mock a sexist person. If you code keywords (Manifest content) without context, you will misinterpret irony. You must code for <strong>Speaker Intent/Tone</strong> (Latent content), which is subjective and requires rigorous pilot testing."
        },
        fieldKit: [], 
        reflection: [
            {
                q: "System vs. Individual",
                why: "Your entire study rests on this distinction. How do you code a statement like 'Men are annoying'? Is that a systemic critique of male socialization, or a personal insult? You need a 'Tie-Breaker Rule' for ambiguous statements."
            },
            {
                q: "The 'Irony' Variable",
                why: "Feminist discourse often uses irony/sarcasm to cope with sexism. If a host says 'Oh sure, because men are so rational,' and you code this literally, your data is wrong. You should include a variable for 'Modality': Serious vs. Humorous/Ironic."
            },
            {
                q: "Defining 'Feminist' (The Inclusion Criteria)",
                why: "How do you define a 'Feminist Podcast'? Is it self-labeling? Is it the topic? What about a True Crime podcast hosted by feminists? You need a strict inclusion rule (e.g., 'Must have 'Feminism' in the Spotify description or category tags')."
            },
            {
                q: "The 'Men' Category",
                why: "Are they criticizing 'All Men', 'Specific Men' (e.g., a politician), or 'The Concept of Masculinity'? Attacking a specific abuser is not misandry. Attacking 'All Men' is. Your codebook must distinguish the <strong>Target of Criticism</strong>."
            },
            {
                q: "The 'Popularity' Bias",
                why: "By choosing only the Top 10, you are studying 'Mainstream Corporate Feminism'. These shows have advertisers and PR teams. They are *least* likely to be radical. Acknowledge this limitation: You are measuring 'Mainstream Discourse', not 'Radical Activism'."
            },
            {
                q: "Coding 'Patriarchy'",
                why: "How do you identify 'System Critique'? Does the word 'Patriarchy' need to be used? Or do you code descriptions of 'Structural Inequality' (pay gap, violence stats) as system critique even if the buzzwords aren't used?"
            },
            {
                q: "The 'Host Gender' Hypothesis (H3)",
                why: "You want to compare male vs. female hosts (H3). Do you actually have enough male-hosted feminist podcasts in the Top 10 to make this comparison statistically valid? If you only have 1 male podcast vs. 9 female, you cannot test this hypothesis reliably."
            },
            {
                q: "Unit of Analysis",
                why: "Are you coding the *entire* episode? That is very long. Or are you coding specific 'Segments'? Or every 'Mention of Men'? We recommend 'Time Sampling' (e.g., 1st, middle, and last 10 mins) or 'Keyword Sampling' (coding the 2 minutes surrounding every use of the word 'Men/Männer')."
            }
        ]
    },

    // GROUP 3 (TODO: Generate Deep Dive)
    {
        id: "3",
        title: "Listening to Combat Loneliness (Survey)",
        method: "survey",
        audit: {
            strengths: "The theoretical model connecting <strong>Podcast Usage</strong>, <strong>Parasocial Relationships (PSR)</strong>, and <strong>Loneliness</strong> is sophisticated and highly relevant. Choosing <strong>Comedy and Lifestyle</strong> genres is a brilliant strategic move, as these formats rely heavily on host personality and 'chatty' intimacy, making them the most likely drivers of PSR.",
            adjustments: "<strong>The Causality Trap:</strong> Your Research Question asks if listening <em>'leads to'</em> reduced loneliness. A cross-sectional survey cannot prove this. It is equally plausible that lonely people listen <em>more</em> to fill the silence (The Compensation Hypothesis). You must adjust your hypotheses to reflect <strong>correlation</strong> (e.g., 'is associated with') rather than causation, or include questions that specifically ask about 'relief' provided by listening.",
            risks: "<strong>Mediation vs. Moderation:</strong> You hypothesize that PSR 'reinforces' the effect. Statistical testing for this (Moderation Analysis) requires a robust sample size (N > 150) and a wide range of data. If you only survey 'Superfans', you will lack the variance needed to find an effect."
        },
        fieldKit: [],
        reflection: [
            {
                q: "The 'Chicken-and-Egg' Problem",
                why: "Does listening cure loneliness, or do lonely people seek out podcasts as a coping mechanism? Your current design might find a positive correlation (More Listening = More Loneliness) simply because lonely people use media more. How will you interpret such a result?"
            },
            {
                q: "Active vs. Passive Listening",
                why: "Does having a podcast on as 'background noise' while cleaning count the same as sitting down and 'actively listening'? Background listening might soothe immediate silence but fail to build the deep PSR necessary for combating social loneliness. You should measure 'Attention' as a variable."
            },
            {
                q: "The Displacement Hypothesis",
                why: "Could heavy podcast listening actually <em>increase</em> loneliness by replacing real-world social interactions? If someone stays home to listen rather than meeting friends, the effect flips. You need to ask about their 'Real-Life Social Interactions' to control for this."
            },
            {
                q: "Comedy vs. Lifestyle (The Envy Gap)",
                why: "You group these genres, but they work differently. Comedy usually improves mood. 'Lifestyle' (influencers) can sometimes <em>increase</em> loneliness via Social Comparison ('Their life is perfect, mine is not'). You should analyze these genres as separate Independent Variables to see if the effects diverge."
            },
            {
                q: "Social vs. Emotional Loneliness",
                why: "Weiss (1973) distinguishes between <em>Social Loneliness</em> (lack of a network) and <em>Emotional Loneliness</em> (lack of an intimate attachment). Podcasts likely simulate a 'friend' (addressing Social Loneliness) but might not fix Emotional Loneliness. Does your scale distinguish between these types?"
            },
            {
                q: "The 'Genre' Confound",
                why: "You focus on Comedy/Lifestyle. But what if your participant also listens to 10 hours of 'True Crime' or 'News'? Those might induce anxiety or anger, counteracting the benefits of the comedy. How will you isolate the effect of the <em>specific</em> genre?"
            },
            {
                q: "Measuring 'Regularity'",
                why: "Is 'Regularity' measured by <em>frequency</em> (days per week) or <em>duration</em> (minutes per session)? A daily 10-minute news brief is 'regular' but builds little PSR. A weekly 3-hour deep dive builds strong PSR. Ensure your 'Usage' variable captures depth, not just frequency."
            },
            {
                q: "The 'I Don't Know' Problem",
                why: "When asking about PSR, some listeners might realize for the first time that their relationship is one-sided, which can feel embarrassing. How will you phrase these questions to be non-judgmental and avoid Social Desirability bias?"
            }
        ]
    },

    // GROUP 4 (TODO: Generate Deep Dive)
    {
        id: "4",
        title: "Like, Share, Buy: Genre Differences in CTAs",
        method: "contentAnalysis",
        audit: {
            strengths: "The application of the <strong>Uses and Gratifications (U&G)</strong> approach to explain <em>why</em> CTAs differ by genre is a strong theoretical link. Your proposed codebook structure (measuring Position, Function, and Form of Address) is logical and well-aligned with your hypotheses.",
            adjustments: "<strong>The 'Dynamic Ad' Danger:</strong> Modern podcasts use 'Dynamic Ad Insertion' (DAI). If you listen to an episode today, you might hear an ad for a German car. If I listen tomorrow, I might hear an ad for a dating app. These are not part of the creative content; they are algorithmic. You must decide: Are you analyzing <strong>Host-Read</strong> (baked-in) CTAs only, or algorithmic spots too? I strongly recommend focusing <em>only</em> on Host-Reads to ensure consistency.",
            risks: "<strong>The 'Hybrid' Genre Problem:</strong> Spotify categories are messy. A 'True Crime' podcast is often also 'Comedy'. A 'Business' podcast is often 'Educational'. If you force hybrid shows into single boxes based on gut feeling, your genre comparison becomes invalid. You need a strict external rule (e.g., 'We use the <em>primary</em> category listed in the RSS feed')."
        },
        fieldKit: [],
        reflection: [
            {
                q: "Dynamic vs. Baked-In Ads",
                why: "Crucial distinction: 'Baked-in' ads are part of the file. 'Dynamic' ads are inserted by servers. If two group members listen to the same episode at different times, they might hear different dynamic ads. <strong>Rule:</strong> If the audio quality/volume changes drastically, it's likely Dynamic. Will you code these?"
            },
            {
                q: "The 'Endorsement Strength' Variable",
                why: "Does the host read a script ('Sponsor X is great') or do they improvise a personal story ('I used this yesterday and...')? Research shows personal testimonials have much higher persuasion effects. Your codebook should capture this 'Degree of Endorsement'."
            },
            {
                q: "Persuasion Tactics (Cialdini)",
                why: "Beyond just 'Selling', what psychological trigger is used? <br><strong>Scarcity:</strong> 'Only for this week'? <br><strong>Authority:</strong> 'Doctor recommended'? <br><strong>Liking:</strong> 'My favorite thing'? <br>Coding these rhetorical strategies would add significant depth to H2 (Function)."
            },
            {
                q: "Defining the 'Action' Boundary",
                why: "What strictly counts as a CTA? <br>A) 'Check out our Patreon' (Direct Imperative) <br>B) 'Our Patreon supporters get bonus episodes' (Implicit Incentive) <br>C) 'Thanks to our sponsor, KoRo' (Brand Mention) <br>You need a linguistic rule: Does it require an <em>imperative verb</em> to be coded?"
            },
            {
                q: "The 'Skipping' Reality",
                why: "You hypothesize that position matters (H3). However, mid-rolls are the most skipped content. Consider coding for <strong>'Segue Quality'</strong>: Does the host transition smoothly into the CTA (making it harder to skip), or is there a jarring 'Ad Break' sound effect?"
            },
            {
                q: "Handling 'Hybrid' Genres",
                why: "If a podcast is 'News' but the host makes jokes, does it go into 'Comedy'? You need a strict decision rule. Recommendation: Use the official <em>primary</em> category tag from the RSS feed/Apple Podcasts, do not classify based on your own listening impression."
            },
            {
                q: "Self-Promotion vs. Third-Party",
                why: "Are you distinguishing between the host selling <em>themselves</em> ('Rate us 5 stars') and selling <em>others</em> ('Buy this mattress')? These serve very different functions (Community vs. Monetization). Your codebook should separate these into different variables."
            },
            {
                q: "The 'Offer' Value",
                why: "Are there differences in the *incentives*? Do Business podcasts offer 'Free Trials' (high value) while Comedy podcasts offer '10% off' (low value)? coding the explicit offer could reveal interesting genre patterns."
            },
            {
                q: "Mapping TPB to Your Codebook",
                why: "You cite the Theory of Planned Behavior. You should code CTAs based on TPB elements: <br>1. <strong>Attitude:</strong> Does the host praise the product? <br>2. <strong>Subjective Norm:</strong> 'Everyone is using this'? <br>3. <strong>Control:</strong> 'It's easy to sign up'? <br>This connects your data directly to your theory."
            }
        ]
    },

    // GROUP 5 (TODO: Generate Deep Dive)
    {
        id: "5",
        title: "Influence of True Crime on Perceptions of Violence",
        method: "survey",
        audit: {
            strengths: "Your differentiation between <strong>H2 (Desensitization/Severity)</strong> and <strong>H3 (Sensitization/Fear)</strong> is excellent. This captures the complexity of the 'Mean World Syndrome' perfectly—suggesting listeners might be simultaneously scared (Fear) yet emotionally numb to the details (Severity). This is a sophisticated theoretical stance.",
            adjustments: "<strong>The 'Reality Benchmark' Requirement:</strong> For H1 (Perceived Frequency), asking 'How common is murder?' is meaningless on its own. To prove <em>distortion</em> (Cultivation), you must compare the respondent's estimate to the <strong>Actual Reality</strong> (e.g., Official Police Crime Statistics / PKS). Your variable isn't just 'Estimate', it is the 'Error Score' (Estimate minus Reality). <strong>The 'Reality Benchmark' Requirement:</strong> To prove distortion, you must compare estimates to Reality (PKS Stats). <br><strong>Specific vs. General Fear:</strong> True Crime focuses on interpersonal violence. If your survey asks about 'Burglary' or 'Car Theft', you likely won't find a Cultivation effect. You should measure fear of <strong>Interpersonal/Sexual Violence</strong> specifically, as this is the 'Mean World' narrative podcasts amplify.",
            risks: "<strong>The Ceiling Effect (H2):</strong> You hypothesize that frequent listening reduces perceived severity. However, on a standard scale, almost everyone will rate Murder/Rape as 'Extremely Severe' (5/5). You will likely get zero variance. You might need to measure <strong>'Emotional Numbness'</strong> or <strong>'Shock Value'</strong> instead of moral severity."
        },
        fieldKit: [],
        reflection: [
            {
                q: "The 'Reality Gap' (H1)",
                why: "Cultivation Theory is about the <em>distortion</em> of reality. If a listener estimates '100 murders a year' and the reality is '100 murders', there is no cultivation effect. You need to ask for concrete numbers (e.g., 'What % of crimes involve violence?') and compare them to the PKS (Polizeiliche Kriminalstatistik)."
            },
            {
                q: "Defining 'Common' vs. 'Sensational' (H2/H3)",
                why: "This distinction is the core of your logic, but it's slippery. Is 'Serial Killing' defined as 'Common' because it appears in every podcast? Or 'Rare' because it's statistically unlikely? You must define this categorization based on <em>Reality</em>, not Podcast frequency, to test the distortion."
            },
            {
                q: "The Ceiling Effect Problem",
                why: "If you ask 'How severe is murder?', 99% of people will say 'Very Severe'. You won't find a difference between heavy and light listeners. Consider changing the variable to <strong>'Physiological/Emotional Reaction'</strong>: 'How much does hearing about a murder upset you?' This allows for the desensitization variance you are looking for."
            },
            {
                q: "The 'News' Confound",
                why: "TV News is the original driver of the Mean World Syndrome. A heavy True Crime listener might also be a heavy News watcher. If you don't measure and control for 'General News Consumption', you might be attributing the fear to podcasts when it actually comes from the Tagesschau."
            },
            {
                q: "Fear vs. Risk Assessment",
                why: "There is a difference between <strong>Affective Fear</strong> ('I feel scared walking home') and <strong>Cognitive Risk</strong> ('I estimate my chance of being attacked is 10%'). Cultivation theory traditionally affects the Cognitive Risk estimate first. Are you measuring feelings or estimates?"
            },
            {
                q: "The 'Victim' Identification",
                why: "Say women listen to learn survival strategies. Does identifying with the victim <em>increase</em> fear (because it feels personal) or <em>decrease</em> fear (because they feel prepared/empowered)? You should ask about their motivation: 'Education/Safety' vs. 'Entertainment'."
            },
            {
                q: "Matrix Question Fatigue",
                why: "If you ask about Frequency, Severity, and Fear for 5 different crime types, that is 15 complex questions. Respondents might 'straight-line' (click the same answer) to get through it. How will you design the survey to keep them engaged?"
            },
            {
                q: "Reverse Causality",
                why: "Do podcasts make people view the world as dangerous, or do people who already view the world as dangerous seek out these podcasts to validate their worldview (Echo Chamber)? A cross-sectional survey cannot distinguish this, so be careful with your 'Influence' language."
            },
        ]
    },

    // GROUP 6 (TODO: Generate Deep Dive)
    {
        id: "6",
        title: "True Crime, True Doubt: Trust in Police",
        method: "survey",
        audit: {
            strengths: "The integration of <strong>Behavioral Outcomes (H3: Safety Measures)</strong> is the strongest element of this design. Most student surveys only measure abstract attitudes (feelings). By asking about actual defensive habits (e.g., changing routes, carrying keys), you create a tangible 'Reality Check' for your trust variables, allowing you to analyze if media consumption actually translates into real-world action.",
            adjustments: "<strong>The 'Generic Trust' Dead End:</strong> As discussed, general 'Trust in Police' is often low and static in this specific demographic (Floor Effect). If everyone says 'Low Trust', you cannot find a correlation with podcasts. <br><strong>The Fix:</strong> Do not measure 'Trust' as a monolith. Measure <strong>'Perceived Competence'</strong> (Do they have the skills to solve crimes?) vs. <strong>'Perceived Integrity'</strong> (Are they honest?). True Crime often attacks Competence (cold cases) while leaving Integrity intact, or vice versa.",
            risks: "<strong>The 'US Transfer' Effect:</strong> Most popular True Crime is American. US policing issues (systemic racism, corruption) are major themes. You are surveying German women. You run the risk of measuring how much they project <em>American</em> problems onto <em>German</em> officials, rather than measuring their actual local trust."
        },
        fieldKit: [],
        reflection: [
            {
                q: "Competence vs. Benevolence",
                why: "Trust is not one thing. A listener might believe the police are <em>Benevolent</em> (want to help) but <em>Incompetent</em> (can't solve the case). True Crime narratives specifically highlight investigational failures. You must measure these dimensions separately to see the real effect."
            },
            {
                q: "The 'US vs. Germany' Confound",
                why: "If your participants listen to 'Serial' or 'My Favorite Murder' (US content), they are consuming critiques of the American justice system. Does this lower their trust in the <em>German</em> Polizei? You need to ask: 'What % of your True Crime consumption is US-based vs. German-based?'"
            },
            {
                q: "Solved vs. Unsolved (The Content Variable)",
                why: "H1 assumes podcasts lower trust. But what if they listen to 'Forensic Files' (where science catches the killer)? That might <em>increase</em> trust in police competence. Listening to 'Cold Cases' (failures) likely decreases it. You must measure the <em>type</em> of content they consume."
            },
            {
                q: "Safety = Distrust? (Challenging H3)",
                why: "You hypothesize that listening for 'Safety' relates to lower trust. Is that true? A woman might learn self-defense (Safety) because she knows the police can't be everywhere instantly, not because she thinks they are corrupt. How will you distinguish 'Realism' from 'Distrust'?"
            },
            {
                q: "The 'CSI Effect' (Expectation Gap)",
                why: "Does True Crime give listeners unrealistic expectations of forensic science (e.g., 'DNA results in 1 hour')? Their 'distrust' might actually be 'disappointment' that real police work is slower than a podcast. Consider measuring 'Unrealistic Expectations' as a mediator."
            },
            {
                q: "The Political Confound",
                why: "Political orientation is the strongest predictor of trust in the police. A left-leaning sample will have lower trust regardless of podcast habits. If you don't measure and control for 'Political Orientation', your results might be spurious."
            },
            {
                q: "Personal Victimization History",
                why: "Has the respondent (or a friend) actually had a negative experience with the police? A single real-world event outweighs 1,000 hours of podcasts. You must ask about 'Personal Contact with Police' as a control variable."
            },
            {
                q: "General vs. Specific Cynicism",
                why: "Are you measuring specific distrust of the police, or a general 'Institutional Cynicism'? Young people currently show lower trust in <em>all</em> institutions (Media, Gov, Church). You might want to include a 'Trust in Media' question to see if the police distrust is unique or part of a general worldview."
            },
            {
                q: "Pivot Option 1: The 'Vigilante' Shift",
                why: "<strong>Alternative DV:</strong> Instead of measuring Trust in Police (which is boring), measure <strong>'Trust in Amateurs.'</strong> Does True Crime make listeners believe that 'Internet Sleuths' or Podcasters are better at solving crimes than the police? This 'Vigilante Effect' might be a stronger, more interesting finding."
            },
            {
                q: "Pivot Option 2: Punitive Attitudes",
                why: "<strong>Alternative DV:</strong> Does listening to graphic violence make women support harsher punishments (e.g., longer prison sentences, less rehabilitation)? This measures the 'Mean World' reaction not as fear, but as a demand for <strong>Retributive Justice</strong>."
            },
            {
                q: "Pivot Option 3: Judicial Skepticism",
                why: "<strong>Alternative DV:</strong> Often, the police catch the guy, but the <em>Court</em> lets him go on a technicality. Maybe the distrust isn't with the Police (Executive), but with the <strong>Courts (Judiciary)</strong>? Distinguishing between these institutions would add significant nuance."
            }
        ]
    },
    // GROUP 8 (TODO: Generate Deep Dive)
    {
        id: "8",
        title: "Empathy for Perpetrators? Content Analysis",
        method: "contentAnalysis",
        audit: {
            strengths: "The integration of <strong>Auditory Intimacy (Pâquet)</strong> alongside Narrative structure is a sophisticated, modern approach. Most student content analyses ignore the 'Audio' part of podcasts. By analyzing sound design and vocal delivery as empathy drivers, you are tapping into the unique affordances of the medium, which strengthens your theoretical contribution significantly.",
            adjustments: "<strong>Variable Naming (Validity):</strong> You cannot measure 'Empathy' (a listener's internal feeling) via Content Analysis. You are measuring <strong>'Sympathetic Framing'</strong> or <strong>'Humanizing Cues'</strong>. Change your codebook labels to reflect the <em>stimulus</em>, not the <em>effect</em>. <br><strong>Unit of Analysis:</strong> Coding an entire 45-minute episode as 'Sympathetic' is too blunt. You need to segment it. Code the 'Childhood Backstory' segment separately from the 'Crime Commission' segment. The framing often shifts dramatically between these.",
            risks: "<strong>Interpretation Drift:</strong> When is a mention of a 'difficult childhood' a <em>fact</em> and when is it an <em>excuse</em>? This line is subjective. Without extremely precise definitions (Anchor Examples), your coders will disagree, and your Kappa score (Reliability) will be too low to publish."
        },
        fieldKit: [],
        reflection: [
            {
                q: "The Zero-Sum Game",
                why: "Does humanizing the perpetrator necessarily dehumanize the victim? Or can a host be empathetic to both? You should code for the <strong>'Sympathy Ratio'</strong>: How much time is spent on the Perp's trauma vs. the Victim's life? This is a quantitative measure of 'Balance'."
            },
            {
                q: "Context vs. Excuse",
                why: "How do you distinguish between providing 'Context' (neutral facts about poverty) and offering an 'Excuse' (mitigating responsibility)? You need a linguistic rule: Does the host use causal language? (e.g., 'He killed <em>because</em> he was abused' vs. 'He was abused. Later, he killed.')."
            },
            {
                q: "The Soundtrack of Sympathy",
                why: "Sound design is your secret weapon. Do you code the <strong>background music</strong>? A sad piano track under a killer's backstory is a stronger 'Empathy Cue' than words alone. A dissonant drone implies 'Monster'. This <em>must</em> be in your codebook."
            },
            {
                q: "Adjective Analysis (Computational Opportunity)",
                why: "Empathy often lives in adjectives. 'The <em>lonely</em> boy' vs. 'The <em>creepy</em> loner'. You could use a Sentiment Toolkit like SentiWS to extract all adjectives used to describe the perpetrator and analyze their sentiment. This removes human coding bias and handles large volumes of text."
            },
            {
                q: "The 'Monster' Baseline",
                why: "To measure empathy, you need a baseline for 'No Empathy'. What does a 'Monster Frame' look like? (e.g., 'Evil', 'Psychopath', 'Cold'). You need clear Anchor Examples for the bottom of your scale (1) to accurately measure the top (5)."
            },
            {
                q: "Structural Priming",
                why: "Where does the empathy happen? If the 'Sad Backstory' is told <em>before</em> the crime details, it primes the listener to forgive. If it comes <em>after</em>, it feels like an excuse. Code the <strong>Order of Information</strong> to capture this narrative strategy."
            },
            {
                q: "Vocal Intimacy Operationalization",
                why: "You mention 'Auditory Intimacy'. How do you code this objectively? Is it 'Vocal Fry'? 'Whispering'? 'Proximity to Mic'? You need to operationalize 'Intimate Voice' into observable acoustic characteristics, or it remains a subjective 'vibe' that is impossible to verify."
            },
            {
                q: "The 'Ideal Victim' Theory",
                why: "Criminology theory (Christie) suggests empathy is reserved for 'Ideal Victims' (weak, blameless, respectable). Does the podcast strip empathy from victims who don't fit this mold (e.g., sex workers, drug users)? Coding for 'Victim Lifestyle Judgments' would be a powerful addition to your Intersectionality analysis."
            }
        ]
    }
];


/* ==========================================================================
   UPDATED LOGIC: TABBED RENDERING ENGINE (With Automation Lab)
   ========================================================================== */

function renderAudits(container) {
    if (!groupData || groupData.length === 0) {
        container.innerHTML = "<p>No audit data available.</p>";
        return;
    }

    // Clear Loading
    container.innerHTML = '';

    groupData.forEach(group => {
        // 1. Create Accordion Shell
        const details = document.createElement('details');
        details.className = 'audit-accordion';

        // 2. Create Header
        const summary = document.createElement('summary');
        summary.className = 'audit-header';
        summary.innerHTML = `<span><span class="group-badge">Group ${group.id}</span> <span class="project-title">${group.title}</span></span>`;

        // 3. Create Body Container
        const body = document.createElement('div');
        body.className = 'audit-body';

        // 4. Build Tabs Navigation
        // Check if this group gets the Automation Lab (Content Analysis only)
        const showAutoLab = group.method === 'contentAnalysis';

        const tabNav = document.createElement('nav');
        tabNav.className = 'tab-nav';
        tabNav.innerHTML = `
            <button class="tab-btn active" onclick="switchTab(event, 'analysis-${group.id}')">📊 Analysis</button>
            <button class="tab-btn" onclick="switchTab(event, 'fieldkit-${group.id}')">🧰 Field Kit</button>
            <button class="tab-btn" onclick="switchTab(event, 'mirror-${group.id}')">❓ Reflection</button>
            ${showAutoLab ? `<button class="tab-btn tab-btn-special" onclick="switchTab(event, 'auto-${group.id}')">🤖 Automation Lab</button>` : ''}
        `;

        // 5. Build Tab Content Wrapper
        const contentArea = document.createElement('div');
        contentArea.className = 'tab-content-area';

        // --- TAB 1: ANALYSIS ---
        const tAnalysis = document.createElement('div');
        tAnalysis.id = `analysis-${group.id}`;
        tAnalysis.className = 'tab-pane active';
        tAnalysis.innerHTML = renderAnalysisTab(group.audit);

        // --- TAB 2: FIELD KIT (Merged Wisdom) ---
        const tFieldKit = document.createElement('div');
        tFieldKit.id = `fieldkit-${group.id}`;
        tFieldKit.className = 'tab-pane';
        const specificWisdom = commonLib[group.method] || [];
        const generalWisdom = commonLib.general || [];
        const fullKit = [...specificWisdom, ...generalWisdom];
        tFieldKit.innerHTML = renderFieldKitTab(fullKit);

        // --- TAB 3: REFLECTION ---
        const tMirror = document.createElement('div');
        tMirror.id = `mirror-${group.id}`;
        tMirror.className = 'tab-pane';
        tMirror.innerHTML = renderReflectionTab(group.reflection);

        // --- TAB 4: AUTOMATION LAB (Conditional) ---
        if (showAutoLab) {
            const tAuto = document.createElement('div');
            tAuto.id = `auto-${group.id}`;
            tAuto.className = 'tab-pane';
            tAuto.innerHTML = renderAutomationTab();
            contentArea.appendChild(tAuto);
        }

        // Assemble
        contentArea.prepend(tAnalysis); // Ensure analysis is first
        contentArea.appendChild(tFieldKit);
        contentArea.appendChild(tMirror);

        body.appendChild(tabNav);
        body.appendChild(contentArea);
        details.appendChild(summary);
        details.appendChild(body);
        container.appendChild(details);
    });
}

/* --- New Helper: Render Automation Lab --- */
function renderAutomationTab() {
    return `
        <div class="auto-lab-container">
            <div class="auto-header">
                <h4>🚀 Accelerate Your Content Analysis</h4>
                <p>Don't listen to silence. Use modern tools to pre-sift your data and find the relevant segments instantly. <strong>Note:</strong> You must still verify everything manually.</p>
            </div>
            
            <div class="auto-grid">
                <!-- Tool 1: Transcription -->
                <div class="auto-card">
                    
                    <h3>📝1. Get the Text</h3>
                    <p>Audio is hard to search. Text is easy. Use tools to get transcripts of your episodes.</p>
                    <ul class="auto-list">
                        <li><strong>YouTube:</strong> If the podcast is on YouTube, copy the auto-generated transcript.</li>
                        <li><strong>ListenNotes:</strong> Some podcasts have transcripts available here.</li>
                        <li><strong>OpenAI Whisper:</strong> A free, powerful AI tool to transcribe audio files yourself (requires some Python knowledge (well AI knows Python 🤖) or  - i have sent you an email with a colab).</li>
                    </ul>
                </div>

                <!-- Tool 2: LLM Sifting -->
                <div class="auto-card">
                    
                    <h3>🤖 2. The LLM Assistant</h3>
                    <p>Use Gemini, ChatGPT or Claude to find the needle in the haystack.</p>
                    <strong>Start with this base Prompt</strong> and edit it until it fits your needs (adding the codebook may help):<br>
                    <div class="prompt-box">
                        "I am analyzing podcast ads. Here is the transcript of an episode. Please identify all segments that appear to be advertisements or calls-to-action. For each, provide the <em>Start Time</em>, the <em>Product/Topic</em>, and the <em>Exact Quote</em>. Output as a table."
                    </div>
                </div>

                <!-- Tool 3: The Human Loop -->
                <div class="auto-card warning-card">
                    
                    <h3>⚠️ 3. The "Human-in-the-Loop" Rule</h3>
                    <p><strong>AI Hallucinates.</strong> It might invent an ad that isn't there, or miss a subtle one.</p>
                    <p><strong>The Workflow:</strong> Use the AI to find the <em>best episodes for your fit and the timestamps</em>. Then, jump to that exact second in the audio file and listen/code it yourself. This saves you from listening to the 40 minutes of irrelevant content in between.</p>
                    <p><strong>Still listen to the full final sample.</strong> But not during the preperation phase.</p>
                </div>
            </div>
            
            <div class="auto-footer">
                 <p>💡 <strong>Pro Tip:</strong> If you are analyzing YouTube-hosted podcasts, ask for help with the <strong>Collab Notebook</strong> to automate comment/transcript downloading if you get stuck.</p>
            </div>
        </div>
    `;
}

/* --- Helper: Tab Switcher --- */
window.switchTab = function (event, tabId) {
    // Find the parent container (.audit-body)
    const body = event.target.closest('.audit-body');

    // 1. Deactivate all buttons in this nav
    const buttons = body.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 2. Hide all panes in this content area
    const panes = body.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.remove('active'));

    // 3. Activate clicked button and target pane
    event.target.classList.add('active');
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
};

/* --- Helper: Content Renderers --- */

function renderAnalysisTab(audit) {
    // Fallback if empty
    if (!audit || !audit.strengths) return "<p>Pending Analysis...</p>";

    return `
        <div class="analysis-grid">
            <div class="feedback-card fb-strength">
                <div class="card-head">🟢 Foundation Strength</div>
                <p>${audit.strengths}</p>
            </div>
            <div class="feedback-card fb-adjust">
                <div class="card-head">🟡 Critical Adjustment</div>
                <p>${audit.adjustments}</p>
            </div>
            <div class="feedback-card fb-risk">
                <div class="card-head">🔴 Feasibility Risk</div>
                <p>${audit.risks}</p>
            </div>
        </div>
    `;
}

function renderFieldKitTab(kitArray) {
    if (!kitArray || kitArray.length === 0) return "<p>No tools available.</p>";

    let html = '<div class="wisdom-grid">';
    kitArray.forEach(item => {
        html += `
            <div class="wisdom-card">
                <span class="wisdom-icon">${item.icon}</span>
                <span class="wisdom-title">${item.title}</span>
                <p class="wisdom-text">${item.content}</p>
                <div class="wisdom-action">${item.action}</div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function renderReflectionTab(questions) {
    if (!questions || questions.length === 0) return "<p>No reflection questions generated.</p>";

    let html = '<ul class="reflection-list">';
    questions.forEach(q => {
        html += `
            <li class="reflection-item">
                <input type="checkbox" class="reflection-checkbox">
                <div class="reflection-text">
                    <strong>${q.q}</strong>
                    <p>${q.why}</p>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    return html;
}