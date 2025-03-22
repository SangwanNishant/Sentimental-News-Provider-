// State management
let state = {
    articles: [],
    preferences: {
        categories: [],
        frequency: 'daily'
    },
    savedArticles: []
};

// DOM Elements
const preferencesBtn = document.getElementById('preferencesBtn');
const preferencesModal = document.getElementById('preferences');
const savePreferencesBtn = document.getElementById('savePreferences');
const articlesFeed = document.getElementById('articlesFeed');
const searchInput = document.getElementById('searchInput');
const sentimentFilter = document.getElementById('sentimentFilter');

// Event Listeners
preferencesBtn.addEventListener('click', togglePreferences);
savePreferencesBtn.addEventListener('click', savePreferences);
searchInput.addEventListener('input', debounce(filterArticles, 300));
sentimentFilter.addEventListener('change', filterArticles);

// Mock data for demonstration
const mockArticles = [
    {
        id: 1,
        title: "AI Breakthrough in Quantum Computing",
        summary: "Scientists achieve major milestone in quantum computing, demonstrating successful error correction in quantum bits.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
        sentiment: "positive",
        category: "technology",
        date: "2024-03-10"
    },
    {
        id: 2,
        title: "Global Markets React to Economic Policy Changes",
        summary: "Markets show mixed reactions as central banks announce new monetary policies aimed at controlling inflation.",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
        sentiment: "neutral",
        category: "business",
        date: "2024-03-09"
    },
    {
        id: 3,
        title: "Climate Change Impact Worse Than Expected",
        summary: "New research indicates climate change effects are accelerating faster than previous models predicted.",
        image: "https://images.unsplash.com/photo-1611048267451-e6ed903d4a38",
        sentiment: "negative",
        category: "science",
        date: "2024-03-08"
    }
];

// Initialize the app
function init() {
    state.articles = mockArticles;
    renderArticles(state.articles);
}

// Toggle preferences modal
function togglePreferences() {
    preferencesModal.classList.toggle('hidden');
}

// Save user preferences
function savePreferences() {
    const categories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const frequency = document.getElementById('frequency').value;

    state.preferences = {
        categories,
        frequency
    };

    localStorage.setItem('newsPreferences', JSON.stringify(state.preferences));
    togglePreferences();
    filterArticles();
}

// Render articles to the DOM
function renderArticles(articles) {
    articlesFeed.innerHTML = articles.map(article => `
        <article class="article-card">
            <img src="${article.image}" alt="${article.title}" class="article-image">
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-summary">${article.summary}</p>
                <div class="article-meta">
                    <span class="sentiment-indicator sentiment-${article.sentiment}">
                        ${article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                    </span>
                    <span>${article.date}</span>
                </div>
                <div class="article-actions">
                    <button onclick="saveArticle(${article.id})">Save</button>
                    <button onclick="shareArticle(${article.id})">Share</button>
                </div>
            </div>
        </article>
    `).join('');
}

// Filter articles based on search and sentiment
function filterArticles() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSentiment = sentimentFilter.value;

    const filtered = state.articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                            article.summary.toLowerCase().includes(searchTerm);
        const matchesSentiment = selectedSentiment === 'all' || article.sentiment === selectedSentiment;
        return matchesSearch && matchesSentiment;
    });

    renderArticles(filtered);
}

// Save article to user's saved articles
function saveArticle(articleId) {
    const article = state.articles.find(a => a.id === articleId);
    if (article && !state.savedArticles.some(a => a.id === articleId)) {
        state.savedArticles.push(article);
        localStorage.setItem('savedArticles', JSON.stringify(state.savedArticles));
        alert('Article saved successfully!');
    }
}

// Share article functionality
function shareArticle(articleId) {
    const article = state.articles.find(a => a.id === articleId);
    if (article && navigator.share) {
        navigator.share({
            title: article.title,
            text: article.summary,
            url: window.location.href
        });
    } else {
        alert('Sharing is not supported on this browser');
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application
init();