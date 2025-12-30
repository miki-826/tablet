/**
 * Personal Dashboard - Main Script
 * Handles all widget logic, API calls, and UI interactions
 */

// ========================================
// State Management
// ========================================
const state = {
    currentSlide: 0,
    slideshowInterval: null,
    backgroundInterval: null,
    todos: [],
    currentBgIndex: 0,
    customEvents: [],
    editingEventId: null
};

// ========================================
// DOM Elements
// ========================================
const elements = {
    // Clock
    time: document.getElementById('current-time'),
    date: document.getElementById('current-date'),
    timeSmall: document.getElementById('current-time-small'),
    dateSmall: document.getElementById('current-date-small'),
    timeSmall2: document.getElementById('current-time-small-2'),
    dateSmall2: document.getElementById('current-date-small-2'),

    // Weather
    weatherIcon: document.getElementById('weather-icon'),
    weatherTemp: document.getElementById('weather-temp'),
    weatherDesc: document.getElementById('weather-desc'),
    weatherCity: document.getElementById('weather-city'),
    weatherHumidity: document.getElementById('weather-humidity'),
    weatherWind: document.getElementById('weather-wind'),

    // Calendar
    calendarEvents: document.getElementById('calendar-events'),
    calendarAddBtn: document.getElementById('calendar-add-btn'),

    // Calendar Modal
    calendarModalOverlay: document.getElementById('calendar-modal-overlay'),
    calendarModal: document.getElementById('calendar-modal'),
    calendarModalTitle: document.getElementById('calendar-modal-title'),
    calendarModalClose: document.getElementById('calendar-modal-close'),
    calendarModalCancel: document.getElementById('calendar-modal-cancel'),
    calendarModalSave: document.getElementById('calendar-modal-save'),
    eventTitleInput: document.getElementById('event-title-input'),
    eventDateInput: document.getElementById('event-date-input'),
    eventTimeInput: document.getElementById('event-time-input'),
    eventAllDayInput: document.getElementById('event-allday-input'),
    eventTimeGroup: document.getElementById('event-time-group'),
    eventLinkInput: document.getElementById('event-link-input'),

    // ToDo
    todoInput: document.getElementById('todo-input'),
    todoAddBtn: document.getElementById('todo-add-btn'),
    todoList: document.getElementById('todo-list'),

    // News
    newsList: document.getElementById('news-list'),



    // Background
    bgImage1: document.getElementById('bg-image-1'),
    bgImage2: document.getElementById('bg-image-2'),
    photoCredit: document.getElementById('photo-credit'),

    // Slides
    slides: document.querySelectorAll('.slide'),
    indicators: document.querySelectorAll('.indicator'),

    // Settings
    settingsToggle: document.getElementById('settings-toggle'),
    settingsContent: document.getElementById('settings-content'),
    colorPresets: document.getElementById('color-presets'),
    refreshBgBtn: document.getElementById('refresh-bg')
};

// ========================================
// Clock Functions
// ========================================
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Full time display
    const timeStr = CONFIG.clock.showSeconds
        ? `${hours}:${minutes}:${seconds}`
        : `${hours}:${minutes}`;

    if (elements.time) elements.time.textContent = timeStr;
    if (elements.timeSmall) elements.timeSmall.textContent = `${hours}:${minutes}`;
    if (elements.timeSmall2) elements.timeSmall2.textContent = `${hours}:${minutes}`;

    // Date display
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    const dateStr = now.toLocaleDateString('ja-JP', options);
    if (elements.date) elements.date.textContent = dateStr;

    // Short date for small widget (if exists)
    const shortOptions = { month: 'numeric', day: 'numeric' };
    const shortDateStr = now.toLocaleDateString('ja-JP', shortOptions);
    if (elements.dateSmall) elements.dateSmall.textContent = shortDateStr;
    if (elements.dateSmall2) elements.dateSmall2.textContent = shortDateStr;
}

// ========================================
// Weather Functions
// ========================================
const weatherIcons = {
    '01d': 'fa-sun',
    '01n': 'fa-moon',
    '02d': 'fa-cloud-sun',
    '02n': 'fa-cloud-moon',
    '03d': 'fa-cloud',
    '03n': 'fa-cloud',
    '04d': 'fa-cloud',
    '04n': 'fa-cloud',
    '09d': 'fa-cloud-showers-heavy',
    '09n': 'fa-cloud-showers-heavy',
    '10d': 'fa-cloud-sun-rain',
    '10n': 'fa-cloud-moon-rain',
    '11d': 'fa-bolt',
    '11n': 'fa-bolt',
    '13d': 'fa-snowflake',
    '13n': 'fa-snowflake',
    '50d': 'fa-smog',
    '50n': 'fa-smog'
};

async function fetchWeather() {
    const { apiKey, city, units, lang } = CONFIG.weather;

    // Check if API key is set
    if (!apiKey || apiKey === 'YOUR_OPENWEATHERMAP_API_KEY') {
        displayDemoWeather();
        return;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Weather API error');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Weather fetch error:', error);
        displayDemoWeather();
    }
}

function displayWeather(data) {
    const iconCode = data.weather[0].icon;
    const iconClass = weatherIcons[iconCode] || 'fa-cloud';

    if (elements.weatherIcon) elements.weatherIcon.className = `fas ${iconClass} weather-icon`;
    if (elements.weatherTemp) elements.weatherTemp.textContent = `${Math.round(data.main.temp)}°`;
    if (elements.weatherDesc) elements.weatherDesc.textContent = data.weather[0].description;
    if (elements.weatherCity) elements.weatherCity.textContent = data.name;
    if (elements.weatherHumidity) elements.weatherHumidity.textContent = `${data.main.humidity}%`;
    if (elements.weatherWind) elements.weatherWind.textContent = `${data.wind.speed} m/s`;
}

function displayDemoWeather() {
    if (elements.weatherIcon) elements.weatherIcon.className = 'fas fa-cloud-sun weather-icon';
    if (elements.weatherTemp) elements.weatherTemp.textContent = '18°';
    if (elements.weatherDesc) elements.weatherDesc.textContent = '晴れ時々曇り';
    if (elements.weatherCity) elements.weatherCity.textContent = 'Tokyo';
    if (elements.weatherHumidity) elements.weatherHumidity.textContent = '65%';
    if (elements.weatherWind) elements.weatherWind.textContent = '3.5 m/s';
}

// ========================================
// Calendar Functions
// ========================================
async function fetchCalendar() {
    const { icalUrl, maxEvents } = CONFIG.calendar;

    // If no URL provided, show demo events
    if (!icalUrl) {
        displayDemoCalendar();
        return;
    }

    try {
        // Using CORS proxy for iCal
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(icalUrl)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error('Calendar fetch error');
        }

        const icalData = await response.text();
        const events = parseIcal(icalData, maxEvents);
        displayCalendarEvents(events);
    } catch (error) {
        console.error('Calendar fetch error:', error);
        displayDemoCalendar();
    }
}

function parseIcal(icalData, maxEvents) {
    const events = [];
    const eventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
    const matches = icalData.match(eventRegex) || [];

    const now = new Date();

    for (const eventStr of matches) {
        const summary = eventStr.match(/SUMMARY:(.+)/)?.[1]?.trim() || 'No Title';
        const dtstart = eventStr.match(/DTSTART[^:]*:(\d{8}T?\d{0,6})/)?.[1];

        if (dtstart) {
            const year = parseInt(dtstart.slice(0, 4));
            const month = parseInt(dtstart.slice(4, 6)) - 1;
            const day = parseInt(dtstart.slice(6, 8));
            const hour = dtstart.length >= 11 ? parseInt(dtstart.slice(9, 11)) : 0;
            const minute = dtstart.length >= 13 ? parseInt(dtstart.slice(11, 13)) : 0;

            const eventDate = new Date(year, month, day, hour, minute);

            if (eventDate >= now) {
                events.push({
                    title: summary,
                    date: eventDate,
                    allDay: dtstart.length === 8
                });
            }
        }
    }

    // Sort by date and limit
    return events
        .sort((a, b) => a.date - b.date)
        .slice(0, maxEvents);
}

function displayCalendarEvents(events) {
    if (events.length === 0) {
        elements.calendarEvents.innerHTML = '<div class="empty-message">予定はありません</div>';
        return;
    }

    elements.calendarEvents.innerHTML = events.map(event => {
        const day = event.date.getDate();
        const month = event.date.toLocaleDateString('ja-JP', { month: 'short' });
        const time = event.allDay
            ? '終日'
            : event.date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="calendar-event">
                <div class="event-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="event-info">
                    <div class="event-title">${escapeHtml(event.title)}</div>
                    <div class="event-time">${time}</div>
                </div>
            </div>
        `;
    }).join('');
}

function displayDemoCalendar() {
    const now = new Date();
    const demoEvents = [
        { title: 'チームミーティング', daysFromNow: 0, time: '10:00' },
        { title: 'プロジェクトレビュー', daysFromNow: 1, time: '14:00' },
        { title: '週次報告', daysFromNow: 2, time: '09:30' },
        { title: 'ランチミーティング', daysFromNow: 3, time: '12:00' },
        { title: '月末締め', daysFromNow: 5, allDay: true }
    ];

    const events = demoEvents.map(de => {
        const date = new Date(now);
        date.setDate(date.getDate() + de.daysFromNow);
        if (de.time) {
            const [h, m] = de.time.split(':');
            date.setHours(parseInt(h), parseInt(m));
        }
        return {
            title: de.title,
            date: date,
            allDay: de.allDay || false
        };
    });

    displayCalendarEvents(events);
}

// ========================================
// Custom Calendar Event Functions
// ========================================
function loadCustomEvents() {
    const saved = localStorage.getItem('dashboard_calendar_events');
    state.customEvents = saved ? JSON.parse(saved) : [];
}

function saveCustomEvents() {
    localStorage.setItem('dashboard_calendar_events', JSON.stringify(state.customEvents));
}

function openCalendarModal(eventId = null) {
    // Check if modal elements exist
    if (!elements.calendarModalOverlay) {
        console.warn('Calendar modal not available');
        return;
    }

    state.editingEventId = eventId;

    if (eventId) {
        // Editing existing event
        const event = state.customEvents.find(e => e.id === eventId);
        if (event) {
            if (elements.calendarModalTitle) elements.calendarModalTitle.textContent = '予定を編集';
            if (elements.eventTitleInput) elements.eventTitleInput.value = event.title;
            const eventDate = new Date(event.date);
            if (elements.eventDateInput) elements.eventDateInput.value = eventDate.toISOString().split('T')[0];
            if (elements.eventAllDayInput) elements.eventAllDayInput.checked = event.allDay;
            if (!event.allDay && elements.eventTimeInput) {
                elements.eventTimeInput.value = eventDate.toTimeString().slice(0, 5);
            }
            if (elements.eventTimeGroup) elements.eventTimeGroup.style.display = event.allDay ? 'none' : 'block';
            if (elements.eventLinkInput) elements.eventLinkInput.value = event.link || '';
        }
    } else {
        // Adding new event
        if (elements.calendarModalTitle) elements.calendarModalTitle.textContent = '予定を追加';
        if (elements.eventTitleInput) elements.eventTitleInput.value = '';
        if (elements.eventDateInput) elements.eventDateInput.value = new Date().toISOString().split('T')[0];
        if (elements.eventTimeInput) elements.eventTimeInput.value = '09:00';
        if (elements.eventAllDayInput) elements.eventAllDayInput.checked = false;
        if (elements.eventTimeGroup) elements.eventTimeGroup.style.display = 'block';
        if (elements.eventLinkInput) elements.eventLinkInput.value = '';
    }

    elements.calendarModalOverlay.classList.add('active');
}

function closeCalendarModal() {
    if (elements.calendarModalOverlay) {
        elements.calendarModalOverlay.classList.remove('active');
    }
    state.editingEventId = null;
}

function saveCalendarEvent() {
    // Check if elements exist
    if (!elements.eventTitleInput || !elements.eventDateInput) {
        console.warn('Calendar input elements not available');
        return;
    }

    const title = elements.eventTitleInput.value.trim();
    const dateStr = elements.eventDateInput.value;
    const timeStr = elements.eventTimeInput ? elements.eventTimeInput.value : '';
    const allDay = elements.eventAllDayInput ? elements.eventAllDayInput.checked : false;
    const link = elements.eventLinkInput ? elements.eventLinkInput.value.trim() : '';

    if (!title || !dateStr) {
        alert('タイトルと日付を入力してください');
        return;
    }

    let eventDate = new Date(dateStr);
    if (!allDay && timeStr) {
        const [hours, minutes] = timeStr.split(':');
        eventDate.setHours(parseInt(hours), parseInt(minutes));
    }

    if (state.editingEventId) {
        // Update existing event
        const index = state.customEvents.findIndex(e => e.id === state.editingEventId);
        if (index !== -1) {
            state.customEvents[index] = {
                ...state.customEvents[index],
                title,
                date: eventDate.toISOString(),
                allDay,
                link
            };
        }
    } else {
        // Add new event
        state.customEvents.push({
            id: Date.now(),
            title,
            date: eventDate.toISOString(),
            allDay,
            link
        });
    }

    saveCustomEvents();
    closeCalendarModal();
    displayCustomCalendarEvents();
}

function deleteCalendarEvent(id) {
    if (confirm('この予定を削除しますか？')) {
        state.customEvents = state.customEvents.filter(e => e.id !== id);
        saveCustomEvents();
        displayCustomCalendarEvents();
    }
}

function displayCustomCalendarEvents() {
    // Check if calendar element exists
    if (!elements.calendarEvents) {
        console.warn('Calendar events element not found');
        return;
    }

    // Get the calendar widget element
    const calendarWidget = document.getElementById('calendar-widget');

    const now = new Date();

    // Filter future events with links only and sort by date
    const futureEvents = state.customEvents
        .map(e => ({
            ...e,
            date: new Date(e.date)
        }))
        .filter(e => e.date >= new Date(now.getFullYear(), now.getMonth(), now.getDate()) && e.link && e.link.trim() !== '')
        .sort((a, b) => a.date - b.date)
        .slice(0, CONFIG.calendar.maxEvents);

    if (futureEvents.length === 0) {
        // Hide the entire calendar widget if no events with links
        if (calendarWidget) {
            calendarWidget.style.display = 'none';
        }
        return;
    }

    // Show the calendar widget if there are events
    if (calendarWidget) {
        calendarWidget.style.display = '';
    }

    elements.calendarEvents.innerHTML = futureEvents.map(event => {
        const day = event.date.getDate();
        const month = event.date.toLocaleDateString('ja-JP', { month: 'short' });
        const time = event.allDay
            ? '終日'
            : event.date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="calendar-event" onclick="window.open('${escapeHtml(event.link)}', '_blank')">
                <div class="event-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="event-info">
                    <div class="event-title">${escapeHtml(event.title)}</div>
                    <div class="event-time">${time}</div>
                    <div class="event-link"><i class="fas fa-link"></i></div>
                </div>
                <button class="event-edit" onclick="event.stopPropagation(); openCalendarModal(${event.id})" aria-label="編集">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="event-delete" onclick="event.stopPropagation(); deleteCalendarEvent(${event.id})" aria-label="削除">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function initCalendarModal() {
    // Check if elements exist before adding event listeners
    if (!elements.calendarAddBtn || !elements.calendarModalOverlay) {
        console.warn('Calendar modal elements not found, skipping initialization');
        return;
    }

    // Add button
    elements.calendarAddBtn.addEventListener('click', () => openCalendarModal());

    // Modal controls
    if (elements.calendarModalClose) {
        elements.calendarModalClose.addEventListener('click', closeCalendarModal);
    }
    if (elements.calendarModalCancel) {
        elements.calendarModalCancel.addEventListener('click', closeCalendarModal);
    }
    if (elements.calendarModalSave) {
        elements.calendarModalSave.addEventListener('click', saveCalendarEvent);
    }

    // Close on overlay click
    elements.calendarModalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.calendarModalOverlay) {
            closeCalendarModal();
        }
    });

    // Toggle time input based on all-day checkbox
    if (elements.eventAllDayInput && elements.eventTimeGroup) {
        elements.eventAllDayInput.addEventListener('change', (e) => {
            elements.eventTimeGroup.style.display = e.target.checked ? 'none' : 'block';
        });
    }
}

// ========================================
// ToDo Functions
// ========================================
function loadTodos() {
    const saved = localStorage.getItem('dashboard_todos');
    state.todos = saved ? JSON.parse(saved) : [];
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('dashboard_todos', JSON.stringify(state.todos));
}

function addTodo(text) {
    if (!text.trim()) return;

    state.todos.push({
        id: Date.now(),
        text: text.trim(),
        completed: false
    });

    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = state.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    state.todos = state.todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function renderTodos() {
    // Skip if todoList element doesn't exist
    if (!elements.todoList) {
        return;
    }

    if (state.todos.length === 0) {
        elements.todoList.innerHTML = '<div class="empty-message">タスクを追加してください</div>';
        return;
    }

    // Sort: incomplete first, then by id (newest first)
    const sortedTodos = [...state.todos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.id - a.id;
    });

    elements.todoList.innerHTML = sortedTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                 onclick="toggleTodo(${todo.id})" role="checkbox" 
                 aria-checked="${todo.completed}"></div>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="todo-delete" onclick="deleteTodo(${todo.id})" aria-label="削除">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// ========================================
// News Functions
// ========================================
async function fetchNews() {
    const { feeds, maxItems, proxyUrl } = CONFIG.rss;
    const allNews = [];

    for (const feed of feeds) {
        try {
            const url = `${proxyUrl}${encodeURIComponent(feed.url)}`;
            const response = await fetch(url);

            if (!response.ok) continue;

            const data = await response.json();

            if (data.items) {
                data.items.slice(0, Math.ceil(maxItems / feeds.length)).forEach(item => {
                    allNews.push({
                        source: feed.name,
                        title: item.title,
                        link: item.link,
                        pubDate: new Date(item.pubDate)
                    });
                });
            }
        } catch (error) {
            console.error(`News fetch error for ${feed.name}:`, error);
        }
    }

    // If no news fetched, show demo
    if (allNews.length === 0) {
        displayDemoNews();
        return;
    }

    // Sort by date (newest first) and limit
    const sortedNews = allNews
        .sort((a, b) => b.pubDate - a.pubDate)
        .slice(0, maxItems);

    displayNews(sortedNews);
}

function displayNews(newsItems) {
    if (!elements.newsList) {
        console.warn('News list element not found');
        return;
    }
    elements.newsList.innerHTML = newsItems.map(news => {
        const timeAgo = getTimeAgo(news.pubDate);

        return `
            <div class="news-item" onclick="window.open('${news.link}', '_blank')">
                <div class="news-source">${escapeHtml(news.source)}</div>
                <div class="news-title">${escapeHtml(news.title)}</div>
                <div class="news-date">${timeAgo}</div>
            </div>
        `;
    }).join('');
}

function displayDemoNews() {
    if (!elements.newsList) {
        console.warn('News list element not found');
        return;
    }
    const demoNews = [
        { source: 'テクノロジー', title: '新しいAI技術が日常生活を変革する可能性について研究者が発表', time: '2時間前' },
        { source: '経済', title: '株式市場が過去最高値を更新、投資家の間で楽観的な見方が広がる', time: '3時間前' },
        { source: '科学', title: '宇宙探査ミッションが新たな発見をもたらす', time: '5時間前' },
        { source: 'スポーツ', title: '国際大会で日本チームが歴史的勝利を収める', time: '6時間前' },
        { source: '文化', title: '新しい美術展が話題を呼ぶ、来場者数が記録的に', time: '8時間前' },
        { source: '環境', title: '持続可能なエネルギー技術の進歩が報告される', time: '10時間前' }
    ];

    elements.newsList.innerHTML = demoNews.map(news => `
        <div class="news-item">
            <div class="news-source">${news.source}</div>
            <div class="news-title">${news.title}</div>
            <div class="news-date">${news.time}</div>
        </div>
    `).join('');
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
}

// ========================================
// Background Functions
// ========================================
async function fetchBackground() {
    const { accessKey, query, orientation } = CONFIG.unsplash;

    // Check if API key is set
    if (!accessKey || accessKey === 'YOUR_UNSPLASH_ACCESS_KEY') {
        setDefaultBackground();
        return;
    }

    try {
        const url = `https://api.unsplash.com/photos/random?query=${query}&orientation=${orientation}&client_id=${accessKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Unsplash API error');
        }

        const data = await response.json();
        setBackground(data.urls.regular, data.user.name, data.user.links.html);
    } catch (error) {
        console.error('Background fetch error:', error);
        setDefaultBackground();
    }
}

function setBackground(imageUrl, photographer = null, photographerUrl = null) {
    const currentBg = state.currentBgIndex === 0 ? elements.bgImage1 : elements.bgImage2;
    const nextBg = state.currentBgIndex === 0 ? elements.bgImage2 : elements.bgImage1;

    // Preload image
    const img = new Image();
    img.onload = () => {
        nextBg.style.backgroundImage = `url(${imageUrl})`;

        // Crossfade
        currentBg.classList.remove('active');
        nextBg.classList.add('active');

        state.currentBgIndex = state.currentBgIndex === 0 ? 1 : 0;

        // Update credit
        if (photographer) {
            elements.photoCredit.innerHTML = `Photo by <a href="${photographerUrl}" target="_blank">${photographer}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a>`;
        }
    };
    img.src = imageUrl;
}

function setDefaultBackground() {
    // Use a beautiful gradient as default background
    const gradients = [
        'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #2d1b4e 100%)',
        'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
        'linear-gradient(135deg, #0c0c0c 0%, #1c1c3c 50%, #2c2c4c 100%)'
    ];

    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    elements.bgImage1.style.background = randomGradient;
    elements.bgImage1.classList.add('active');
    elements.photoCredit.innerHTML = '';
}

// ========================================
// Slideshow Functions
// ========================================
function goToSlide(index) {
    if (index < 0 || index >= elements.slides.length) return;

    elements.slides[state.currentSlide].classList.remove('active');
    elements.indicators[state.currentSlide].classList.remove('active');

    state.currentSlide = index;

    elements.slides[state.currentSlide].classList.add('active');
    elements.indicators[state.currentSlide].classList.add('active');
}

function nextSlide() {
    const next = (state.currentSlide + 1) % elements.slides.length;
    goToSlide(next);
}

function startSlideshow() {
    if (state.slideshowInterval) clearInterval(state.slideshowInterval);

    if (CONFIG.slideshow.enabled) {
        state.slideshowInterval = setInterval(nextSlide, CONFIG.slideshow.interval);
    }
}

function stopSlideshow() {
    if (state.slideshowInterval) {
        clearInterval(state.slideshowInterval);
        state.slideshowInterval = null;
    }
}

// ========================================
// Theme Functions
// ========================================
function setAccentColor(hue) {
    document.documentElement.style.setProperty('--accent-hue', hue);
    localStorage.setItem('dashboard_accent_hue', hue);

    // Update active preset
    document.querySelectorAll('.color-preset').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.hue) === hue);
    });
}

function initTheme() {
    // Load saved accent color or use default
    const savedHue = localStorage.getItem('dashboard_accent_hue');
    const hue = savedHue ? parseInt(savedHue) : CONFIG.theme.defaultAccentHue;
    setAccentColor(hue);

    // Create color presets
    elements.colorPresets.innerHTML = CONFIG.theme.presets.map(preset => `
        <button class="color-preset ${preset.hue === hue ? 'active' : ''}" 
                data-hue="${preset.hue}"
                style="background: hsl(${preset.hue}, 80%, 60%)"
                title="${preset.name}"
                aria-label="${preset.name}">
        </button>
    `).join('');

    // Add click handlers
    elements.colorPresets.querySelectorAll('.color-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            setAccentColor(parseInt(btn.dataset.hue));
        });
    });
}

// ========================================
// Settings Functions
// ========================================
function initSettings() {
    // Toggle settings panel
    elements.settingsToggle.addEventListener('click', () => {
        elements.settingsContent.classList.toggle('active');
    });

    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.settingsToggle.contains(e.target) &&
            !elements.settingsContent.contains(e.target)) {
            elements.settingsContent.classList.remove('active');
        }
    });

    // Refresh background button
    elements.refreshBgBtn.addEventListener('click', fetchBackground);
}

// ========================================
// Utility Functions
// ========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// Event Listeners
// ========================================
function initEventListeners() {
    // ToDo input (if exists)
    if (elements.todoAddBtn && elements.todoInput) {
        elements.todoAddBtn.addEventListener('click', () => {
            addTodo(elements.todoInput.value);
            elements.todoInput.value = '';
        });

        elements.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo(elements.todoInput.value);
                elements.todoInput.value = '';
            }
        });
    }

    // Slide indicators
    elements.indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            // Reset slideshow timer
            if (CONFIG.slideshow.enabled) {
                startSlideshow();
            }
        });
    });

    // Touch swipe for slides
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - next slide
                goToSlide((state.currentSlide + 1) % elements.slides.length);
            } else {
                // Swipe right - previous slide
                goToSlide((state.currentSlide - 1 + elements.slides.length) % elements.slides.length);
            }
            if (CONFIG.slideshow.enabled) {
                startSlideshow();
            }
        }
    }
}

// ========================================
// Search Functions
// ========================================
function performSearch() {
    const query = elements.searchInput ? elements.searchInput.value.trim() : '';
    if (query) {
        // Google検索はiframe内では動作しないため、新規タブで開く
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank');
        if (elements.searchInput) {
            elements.searchInput.value = '';
        }
    }
}

function closeSearchIframe() {
    const searchIframe = document.getElementById('search-iframe');
    const searchContainer = document.querySelector('.search-container');
    const closeBtn = document.getElementById('close-iframe-btn');

    if (searchIframe) {
        searchIframe.classList.remove('active');
        searchIframe.src = '';
    }
    if (searchContainer) {
        searchContainer.classList.remove('iframe-active');
    }
    if (closeBtn) {
        closeBtn.style.display = 'none';
    }
}

function initSearch() {
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', performSearch);
    }

    if (elements.searchInput) {
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Close iframe button
    const closeBtn = document.getElementById('close-iframe-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSearchIframe);
    }
}

// ========================================
// Initialization
// ========================================
async function init() {
    console.log('Dashboard initializing...');

    // Initialize theme
    initTheme();

    // Initialize settings panel
    initSettings();

    // Initialize event listeners
    initEventListeners();

    // Initialize calendar modal
    initCalendarModal();

    // Start clock
    updateClock();
    setInterval(updateClock, 1000);

    // Load todos
    loadTodos();

    // Load custom events and display (will hide widget if no events with links)
    loadCustomEvents();

    // Fetch data
    fetchWeather();

    // Display calendar events (will hide widget if no events with links)
    displayCustomCalendarEvents();

    fetchNews();
    fetchBackground();

    // Start slideshow
    startSlideshow();

    // Start background rotation
    state.backgroundInterval = setInterval(fetchBackground, CONFIG.background.updateInterval);

    // Refresh weather every 30 minutes
    setInterval(fetchWeather, 1800000);

    // Refresh news every 15 minutes
    setInterval(fetchNews, 900000);

    console.log('Dashboard initialized successfully!');
}

// Start the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Function to open URL - try iframe first, fall back to new tab for restricted sites
function openInIframe(url) {
    // Sites that block iframe embedding - open in new tab
    const blockedSites = [
        'youtube.com',
        'twitter.com',
        'x.com',
        'mail.google.com',
        'gmail.com',
        'amazon.co.jp',
        'amazon.com',
        'calendar.google.com',
        'facebook.com',
        'instagram.com',
        'linkedin.com'
    ];

    const isBlocked = blockedSites.some(site => url.includes(site));

    if (isBlocked) {
        // Open in new tab for blocked sites
        window.open(url, '_blank');
        return;
    }

    // Try to open in iframe for other sites
    const searchIframe = document.getElementById('search-iframe');
    const searchContainer = document.querySelector('.search-container');
    const closeBtn = document.getElementById('close-iframe-btn');

    if (searchIframe) {
        searchIframe.src = url;
        searchIframe.classList.add('active');
        if (searchContainer) {
            searchContainer.classList.add('iframe-active');
        }
        if (closeBtn) {
            closeBtn.style.display = 'flex';
        }
    }
}

// Make functions globally available for onclick handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.openCalendarModal = openCalendarModal;
window.deleteCalendarEvent = deleteCalendarEvent;
window.openInIframe = openInIframe;
window.closeSearchIframe = closeSearchIframe;
