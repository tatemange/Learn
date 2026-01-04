// CONFIG is now loaded from config.js

const state = {
    subject: 'english', // english, math, physics, general
    currentContent: null,
    isLoading: false,
    chatHistory: [],
    stats: {
        comprehension: 5,
        reasoning: 3,
        vocabulary: 4,
        memory: 2,
        application: 3
    }
};

let skillsChart;

// --- CHART ---
function initChart() {
    const ctx = document.getElementById('skillsChart').getContext('2d');
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    Chart.defaults.color = isDark ? '#94a3b8' : '#64748b';
    Chart.defaults.borderColor = isDark ? '#334155' : '#e2e8f0';

    skillsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Compréhension', 'Raisonnement', 'Vocabulaire', 'Mémoire', 'Application'],
            datasets: [{
                label: 'Niveau',
                data: [state.stats.comprehension, state.stats.reasoning, state.stats.vocabulary, state.stats.memory, state.stats.application],
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: '#8b5cf6',
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0, max: 10,
                    ticks: { display: false },
                    grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// --- SUBJECT MANAGEMENT ---
const SUBJECTS = {
    english: {
        btnText: "Générer une phrase",
        icon: "languages",
        prompt: "Génère une phrase en anglais (B2) avec sa traduction.",
        jsonInstruct: '{ "main": "Sentence in English", "sub": "Traduction en Français", "type": "english" }',
        actions: [
            { id: 'grammar', label: 'Grammaire', icon: 'book' },
            { id: 'vocab', label: 'Vocabulaire', icon: 'search' },
            { id: 'pronun', label: 'Prononciation', icon: 'mic' },
            { id: 'quiz', label: 'Quiz Rapide', icon: 'help-circle' }
        ]
    },
    math: {
        btnText: "Générer un problème",
        icon: "sigma",
        prompt: "Génère une équation mathématique ou un court problème de niveau Lycée (LaTeX format pour les maths).",
        jsonInstruct: '{ "main": "Equation (LaTeX) or Problem", "sub": "Indice ou contexte simple", "type": "math" }',
        actions: [
            { id: 'solve', label: 'Solution', icon: 'check-circle' },
            { id: 'step', label: 'Pas à pas', icon: 'list' },
            { id: 'formula', label: 'Formules clés', icon: 'function-square' },
            { id: 'similar', label: 'Ex. Similaire', icon: 'copy' }
        ]
    },
    physics: {
        btnText: "Générer un concept",
        icon: "atom",
        prompt: "Génère une loi physique ou un mini-problème de physique (LaTeX pour formules).",
        jsonInstruct: '{ "main": "Loi ou Problème", "sub": "Brève explication intuitive", "type": "physics" }',
        actions: [
            { id: 'explain', label: 'Explication', icon: 'lightbulb' },
            { id: 'units', label: 'Unités', icon: 'ruler' },
            { id: 'history', label: 'Historique', icon: 'history' },
            { id: 'app', label: 'Application', icon: 'hammer' }
        ]
    },
    code: {
        btnText: "Générer un snippet",
        icon: "code-2",
        prompt: "Génère un snippet de code intéressant en Python ou JavaScript (Algo ou Pattern).",
        jsonInstruct: '{ "main": "Le code (Markdown)", "sub": "Ce que ça fait", "type": "code" }',
        actions: [
            { id: 'debug', label: 'Optimiser', icon: 'zap' },
            { id: 'explain', label: 'Expliquer', icon: 'info' },
            { id: 'convert', label: 'Typer', icon: 'file-code' },
            { id: 'bugs', label: 'Bugs potentiels', icon: 'bug' }
        ]
    },
    history: {
        btnText: "Générer un événement",
        icon: "scroll",
        prompt: "Génère un événement historique marquant (Antiquité à nos jours).",
        jsonInstruct: '{ "main": "L\'événement et la date", "sub": "Pourquoi c\'est majeur", "type": "history" }',
        actions: [
            { id: 'causes', label: 'Causes', icon: 'arrow-left' },
            { id: 'consequences', label: 'Conséquences', icon: 'arrow-right' },
            { id: 'people', label: 'Personnages', icon: 'users' },
            { id: 'date', label: 'Timeline', icon: 'calendar' }
        ]
    },
    biology: {
        btnText: "Générer un concept bio",
        icon: "dna",
        prompt: "Génère un concept de biologie (Cellule, ADN, Évolution...).",
        jsonInstruct: '{ "main": "Le concept", "sub": "Définition simple", "type": "biology" }',
        actions: [
            { id: 'function', label: 'Fonction', icon: 'activity' },
            { id: 'location', label: 'Localisation', icon: 'map-pin' },
            { id: 'diagram', label: 'Structure', icon: 'box' },
            { id: 'disease', label: 'Pathologies', icon: 'alert-triangle' }
        ]
    },
    chemistry: {
        btnText: "Générer une réaction",
        icon: "flask-conical",
        prompt: "Génère une réaction chimique ou une molécule intéressante.",
        jsonInstruct: '{ "main": "Formule (LaTeX)", "sub": "Nom commun/IUPAC", "type": "chemistry" }',
        actions: [
            { id: 'balance', label: 'Équilibrer', icon: 'scale' },
            { id: 'products', label: 'Produits', icon: 'arrow-right-circle' },
            { id: 'risk', label: 'Dangers', icon: 'skull' },
            { id: 'use', label: 'Usage', icon: 'factory' }
        ]
    },
    economy: {
        btnText: "Générer un principe",
        icon: "trending-up",
        prompt: "Génère un principe économique ou un biais cognitif lié à l'argent.",
        jsonInstruct: '{ "main": "Le principe", "sub": "En une phrase", "type": "economy" }',
        actions: [
            { id: 'example', label: 'Exemple', icon: 'pie-chart' },
            { id: 'history', label: 'Origine', icon: 'history' },
            { id: 'impact', label: 'Impact', icon: 'globe' },
            { id: 'critic', label: 'Critiques', icon: 'message-square' }
        ]
    },
    philosophy: {
        btnText: "Générer une pensée",
        icon: "brain-circuit",
        prompt: "Génère une citation philosophique ou un concept célèbre.",
        jsonInstruct: '{ "main": "La citation/concept", "sub": "Auteur et École", "type": "philosophy" }',
        actions: [
            { id: 'analyze', label: 'Analyser', icon: 'zoom-in' },
            { id: 'context', label: 'Contexte', icon: 'book-open' },
            { id: 'counter', label: 'Réfutation', icon: 'shield' },
            { id: 'today', label: 'Actuel ?', icon: 'clock' }
        ]
    },
    geography: {
        btnText: "Générer un lieu",
        icon: "map",
        prompt: "Génère un fait géographique sur un pays, une ville ou un phénomène naturel.",
        jsonInstruct: '{ "main": "Le lieu/phénomène", "sub": "Localisation", "type": "geography" }',
        actions: [
            { id: 'climate', label: 'Climat', icon: 'sun' },
            { id: 'pop', label: 'Population', icon: 'users' },
            { id: 'geo', label: 'Géopolitique', icon: 'flag' },
            { id: 'fun', label: 'Fun Fact', icon: 'star' }
        ]
    },
    literature: {
        btnText: "Générer une oeuvre",
        icon: "book-open",
        prompt: "Génère un titre d'oeuvre littéraire classique ou un incipit célèbre.",
        jsonInstruct: '{ "main": "Titre/Incipit", "sub": "Auteur", "type": "literature" }',
        actions: [
            { id: 'style', label: 'Style', icon: 'pen-tool' },
            { id: 'meaning', label: 'Sens', icon: 'eye' },
            { id: 'era', label: 'Époque', icon: 'calendar' },
            { id: 'similar', label: 'A lire aussi', icon: 'copy' }
        ]
    },
    general: {
        btnText: "Fait intéressant",
        icon: "globe",
        prompt: "Génère un fait de culture générale fascinant (Histoire, Science, Géo).",
        jsonInstruct: '{ "main": "Le fait principal", "sub": "Pourquoi c\'est important", "type": "general" }',
        actions: [
            { id: 'more', label: 'En savoir plus', icon: 'plus' },
            { id: 'quiz', label: 'Vrai/Faux', icon: 'help-circle' },
            { id: 'context', label: 'Contexte', icon: 'map' },
            { id: 'source', label: 'Source', icon: 'link' }
        ]
    }
};

function setSubject(subj) {
    state.subject = subj;

    // UI Update Tabs
    document.querySelectorAll('.subject-tab').forEach(btn => {
        btn.classList.remove('tab-active', 'bg-violet-600', 'text-white');
        btn.classList.add('hover:bg-white/50');

        // Robust check: see if the button's onclick contains the subject key
        if (btn.getAttribute('onclick').includes(`'${subj}'`)) {
            btn.classList.add('tab-active');
            btn.classList.remove('hover:bg-white/50');
        }
    });

    // Update Generate Button
    const conf = SUBJECTS[subj];
    document.getElementById('btnText').textContent = conf.btnText;

    // Clear content if switching
    document.getElementById('welcomeState').classList.remove('hidden');
    document.getElementById('contentContainer').classList.add('hidden');
    document.getElementById('analysisResult').classList.add('hidden');

    lucide.createIcons();
}

function renderActionButtons() {
    const container = document.getElementById('actionButtons');
    container.innerHTML = '';

    const actions = SUBJECTS[state.subject].actions;
    actions.forEach(act => {
        const btn = document.createElement('button');
        btn.className = "flex flex-col items-center justify-center p-3 rounded-xl bg-white/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-700 border border-white/50 dark:border-white/10 transition-all hover:scale-105 group";
        btn.onclick = () => analyze(act.id);
        btn.innerHTML = `
                    <i data-lucide="${act.icon}" class="w-6 h-6 text-violet-600 dark:text-violet-400 mb-1 group-hover:text-violet-500"></i>
                    <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">${act.label}</span>
                `;
        container.appendChild(btn);
    });
    lucide.createIcons();
}

// --- API & GENERATION ---
async function callHuggingFace(messages) {
    // OpenAI-compatible format for Hugging Face Router
    const url = "https://router.huggingface.co/v1/chat/completions";

    const formattedMessages = messages.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.parts[0].text
    }));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: CONFIG.model,
                messages: formattedMessages,
                max_tokens: 1024,
                temperature: 0.7
            })
        });

        const result = await response.json();
        if (result.error) throw new Error(result.error.message || result.error);
        if (!result.choices || !result.choices.length) throw new Error("Réponse vide ou malformée");

        return result.choices[0].message.content.trim();

    } catch (e) { console.error(e); throw e; }
}

async function generateContent() {
    setLoading(true);
    const conf = SUBJECTS[state.subject];

    const prompt = `${conf.prompt} 
            Retourne STRICTEMENT un JSON valide (sans markdown) : ${conf.jsonInstruct}.
            Important: Pour les Maths/Physique, utilise le format LaTeX standard (ex: $$ x^2 $$ ou \\( x \\)).`;

    try {
        // Mimic the parts structure for internal consistency
        let text = await callHuggingFace([{ role: 'user', parts: [{ text: prompt }] }]);

        // Cleanup JSON if LLM adds markdown
        text = text.replace(/```json|```/g, '').trim();

        // Basic attempt to find JSON if surrounded by text
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            text = text.substring(jsonStart, jsonEnd + 1);
        }

        const data = JSON.parse(text);

        state.currentContent = data;
        displayContent(data);

        // Add to Chat Context
        state.chatHistory.push({ role: 'user', parts: [{ text: `Context: ${data.main}` }] });
        state.chatHistory.push({ role: 'model', parts: [{ text: "Bien reçu." }] });

    } catch (e) {
        alert("Erreur de génération (API ou JSON): " + e.message);
    } finally {
        setLoading(false);
    }
}

async function analyze(actionId) {
    if (!state.currentContent) return;
    setLoading(true);

    const context = state.currentContent.main;
    const prompt = `Agis en tant que prof de ${state.subject}.
            Contexte: "${context}".
            Action demandée: "${actionId}" (Explique, Résous, ou Analyse).
            Utilise LaTeX pour les formules. Sois pédagogue et clair.`;

    try {
        const res = await callHuggingFace([{ role: 'user', parts: [{ text: prompt }] }]);
        const container = document.getElementById('analysisResult');
        container.classList.remove('hidden');

        const contentDiv = document.getElementById('analysisContent');
        contentDiv.innerHTML = marked.parse(res);
        renderMath(contentDiv); // Render KaTeX

        updateStats(); // Fake stat update

    } catch (e) { console.error(e); alert("Erreur: " + e.message); }
    finally { setLoading(false); }
}

async function sendChatMessage() {
    const el = document.getElementById('chatInput');
    const msg = el.value.trim();
    if (!msg) return;

    addMessage('user', msg);
    el.value = '';
    handleInputResize(el); // Reset height and icons

    try {
        const history = [...state.chatHistory, { role: 'user', parts: [{ text: msg }] }];
        const res = await callHuggingFace(history);

        addMessage('bot', res);
        state.chatHistory.push({ role: 'user', parts: [{ text: msg }] });
        state.chatHistory.push({ role: 'model', parts: [{ text: res }] });
    } catch (e) { addMessage('bot', "Erreur de connexion: " + e.message); }
}

// --- UTILS ---
function displayContent(data) {
    document.getElementById('welcomeState').classList.add('hidden');
    document.getElementById('contentContainer').classList.remove('hidden');

    const main = document.getElementById('mainContent');
    const sub = document.getElementById('subContent');

    main.innerHTML = marked.parse(data.main);
    sub.innerHTML = marked.parse(data.sub);

    renderMath(main);
    renderMath(sub);

    renderActionButtons();
}

function renderMath(element) {
    renderMathInElement(element, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
    });
}

function addMessage(role, text) {
    const box = document.getElementById('chatHistory');
    const div = document.createElement('div');
    div.className = `flex items-start gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`;
    const icon = role === 'bot' ? 'bot' : 'user';

    div.innerHTML = `
                <div class="w-8 h-8 rounded-full ${role === 'bot' ? 'bg-violet-100 dark:bg-violet-900' : 'bg-slate-200'} flex items-center justify-center flex-shrink-0">
                    <i data-lucide="${icon}" class="w-4 h-4"></i>
                </div>
                <div class="${role === 'bot' ? 'bg-white/60 dark:bg-slate-700/60 rounded-tl-none' : 'bg-violet-500 text-white rounded-tr-none'} p-3 rounded-2xl text-sm max-w-[85%]">
                     <div class="prose prose-xs ${role === 'bot' ? 'prose-slate dark:prose-invert' : 'prose-invert'} max-w-none message-content">
                        ${role === 'user' ? marked.parse(text) : ''}
                    </div>
                </div>
            `;
    box.appendChild(div);
    lucide.createIcons();
    box.scrollTop = box.scrollHeight;

    if (role === 'bot') {
        const contentDiv = div.querySelector('.message-content');
        typeText(contentDiv, text, box);
    } else {
        renderMath(div);
    }
}

function typeText(element, text, scrollContainer) {
    // Escape LaTeX delimiters to prevent Marked from eating backslashes
    // \[ -> $$
    // \] -> $$
    // \( -> $
    // \) -> $
    // and protect general backslashes
    // Simple heuristic: If we see \[ ... \], treat as block math.
    // NOTE: Qwen output usually uses \[ and \].

    // We will type raw chars but parse full Markdown at end.
    // For intermediate steps, we can just show raw text? No, user wants animation.
    // Best compromise: Accumulate raw text, parse Markdown on every frame.
    // To fix flashing: Protection is key.

    let safeText = text
        .replace(/\\\[/g, '$$$$') // Replace \[ with $$
        .replace(/\\\]/g, '$$$$')
        .replace(/\\\(/g, '$')    // Replace \( with $
        .replace(/\\\)/g, '$');

    let index = 0;
    const speed = 20; // Slower for readability (20ms)

    function type() {
        if (index < safeText.length) {
            const chunk = safeText.substr(index, Math.floor(Math.random() * 2) + 1);
            index += chunk.length;
            const currentRaw = safeText.substring(0, index);

            element.innerHTML = marked.parse(currentRaw);
            // We usually don't renderMath during typing to avoid heavy flicker.

            if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
            setTimeout(type, speed);
        } else {
            element.innerHTML = marked.parse(safeText);
            renderMath(element);
            if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
    type();
}

function updateStats() {
    // Randomly increment a stat for visual feedback
    const keys = [0, 1, 2, 3, 4];
    const r = keys[Math.floor(Math.random() * keys.length)];
    skillsChart.data.datasets[0].data[r] += 0.5;
    skillsChart.update();
}

function setLoading(b) {
    document.getElementById('btnGenerate').disabled = b;
    document.getElementById('loadingIndicator').classList.toggle('hidden', !b);
    state.isLoading = b;
}

function closeAnalysis() {
    document.getElementById('analysisResult').classList.add('hidden');
}

function handleChatEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
}

function handleInputResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';

    const val = el.value.trim();
    const iconVoice = document.getElementById('iconVoice');
    const iconSend = document.getElementById('iconSend');

    if (val.length > 0) {
        iconVoice.classList.add('hidden');
        iconSend.classList.remove('hidden');
    } else {
        iconVoice.classList.remove('hidden');
        iconSend.classList.add('hidden');
    }
}

// --- DRAGGABLE CHAT WINDOW ---
function initDraggable() {
    const chatWindow = document.getElementById('chatWindow');
    const handle = document.getElementById('chatHeader');

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Get current computed position
        const rect = chatWindow.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        chatWindow.classList.remove('animate-fade-in-up'); // Remove animation to prevent conflict
        handle.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Boundary checks
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const boxWidth = chatWindow.offsetWidth;
        const boxHeight = chatWindow.offsetHeight;

        // Keep within screen
        if (newLeft < 0) newLeft = 0;
        if (newLeft + boxWidth > winWidth) newLeft = winWidth - boxWidth;
        if (newTop < 0) newTop = 0;
        if (newTop + boxHeight > winHeight) newTop = winHeight - boxHeight;

        // Apply new position (using fixed positioning)
        chatWindow.style.left = `${newLeft}px`;
        chatWindow.style.top = `${newTop}px`;
        chatWindow.style.bottom = 'auto';
        chatWindow.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        handle.style.cursor = 'grab';
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const rect = chatWindow.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            chatWindow.style.left = (window.innerWidth - chatWindow.offsetWidth - 20) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            chatWindow.style.top = (window.innerHeight - chatWindow.offsetHeight - 20) + 'px';
        }
    });
}

// --- RESIZABLE CHAT WINDOW ---
function initResizable() {
    const chatWindow = document.getElementById('chatWindow');
    const handle = document.getElementById('resizeHandle');

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(chatWindow).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(chatWindow).height, 10);
        e.stopPropagation(); // Prevent drag conflict
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        // Min dimensions
        if (newWidth > 300) chatWindow.style.width = newWidth + 'px';
        if (newHeight > 400) chatWindow.style.height = newHeight + 'px';
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}

// --- CHAT TOGGLE ---
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const fab = document.getElementById('chatFab');

    chatWindow.classList.toggle('chat-hidden');
    fab.classList.toggle('visible');

    // Optional: Reset position if it gets lost off-screen (basic safeguard)
    if (!chatWindow.classList.contains('chat-hidden')) {
        const rect = chatWindow.getBoundingClientRect();
        if (rect.top < 0 || rect.left < 0 || rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
            chatWindow.style.top = 'auto';
            chatWindow.style.left = 'auto';
            chatWindow.style.bottom = '20px';
            chatWindow.style.right = '20px';
        }
    }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initChart();
    renderActionButtons(); // Initial render for default subject
    initDraggable();
    initResizable();
});
