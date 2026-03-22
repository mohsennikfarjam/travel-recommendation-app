// Travel Recommendation Web Application Logic

const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

// Timezone mapping for demonstration purposes
const timezoneMap = {
    "sydney, australia": "Australia/Sydney",
    "melbourne, australia": "Australia/Melbourne",
    "tokyo, japan": "Asia/Tokyo",
    "kyoto, japan": "Asia/Tokyo",
    "rio de janeiro, brazil": "America/Sao_Paulo",
    "sao paulo, brazil": "America/Sao_Paulo",
    "angkor wat, cambodia": "Asia/Phnom_Penh",
    "taj mahal, india": "Asia/Kolkata",
    "bora bora, french polynesia": "Pacific/Tahiti",
    "copacabana, brazil": "America/Sao_Paulo"
};

function getLocalTime(locationName) {
    const key = locationName.toLowerCase();
    const timezone = timezoneMap[key] || 'UTC';
    const options = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
}

async function searchRecommendations() {
    const keyword = searchInput.value.toLowerCase().trim();
    if (!keyword) return;

    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        
        resultsContainer.innerHTML = '';
        let results = [];

        // Check for keywords: beach, temple, country
        if (keyword.includes('beach')) {
            results = data.beaches;
        } else if (keyword.includes('temple')) {
            results = data.temples;
        } else if (keyword.includes('countr')) {
            // If "country" is typed, show all cities from all countries
            data.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        } else {
            // Check for specific country names
            const foundCountry = data.countries.find(c => c.name.toLowerCase().includes(keyword));
            if (foundCountry) {
                results = foundCountry.cities;
            }
        }

        if (results.length > 0) {
            displayResults(results);
        } else {
            resultsContainer.innerHTML = '<p class="no-results">No results found for your search. Try "beach", "temple", or a country name.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = '<p class="error">An error occurred while fetching recommendations.</p>';
    }
}

function displayResults(results) {
    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        const localTime = getLocalTime(item.name);

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="time-display">Current Local Time: ${localTime}</div>
                <a href="#" class="btn-visit">Visit</a>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

function clearResults() {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
}

// Event Listeners
if (btnSearch) btnSearch.addEventListener('click', searchRecommendations);
if (btnClear) btnClear.addEventListener('click', clearResults);

// Contact Form Handling (for contact.html)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        contactForm.reset();
    });
}

// Initial check for search input Enter key
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchRecommendations();
        }
    });
}
