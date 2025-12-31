// Timer Configuration
const TIMER_CONFIG = {
  work: { duration: 25 * 60, label: 'Focus Time' },
  shortBreak: { duration: 5 * 60, label: 'Short Break' },
  longBreak: { duration: 15 * 60, label: 'Long Break' }
};

// Demo mode detection (for preview outside Chrome extension)
const isDemo = typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id;

// Mock Chrome API for demo mode
if (isDemo) {
  window.chrome = {
    storage: {
      local: {
        get: (keys, callback) => {
          const data = {};
          keys.forEach(key => {
            const stored = localStorage.getItem(key);
            if (stored) data[key] = JSON.parse(stored);
          });
          callback(data);
        },
        set: (data) => {
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
        }
      }
    },
    runtime: {
      sendMessage: (msg, callback) => {
        if (callback) callback(null);
        return Promise.resolve();
      },
      onMessage: {
        addListener: () => {}
      }
    }
  };
}

// State
let state = {
  currentType: 'work',
  timeRemaining: TIMER_CONFIG.work.duration,
  isRunning: false,
  pomodorosCompleted: 0,
  sessions: [],
  currentSessionStart: null
};

// DOM Elements
const elements = {
  timerDisplay: document.getElementById('timerDisplay'),
  sessionLabel: document.getElementById('sessionLabel'),
  timerProgress: document.getElementById('timerProgress'),
  pomodoroCount: document.getElementById('pomodoroCount'),
  startBtn: document.getElementById('startBtn'),
  resetBtn: document.getElementById('resetBtn'),
  skipBtn: document.getElementById('skipBtn'),
  playIcon: document.getElementById('playIcon'),
  pauseIcon: document.getElementById('pauseIcon'),
  todayFocus: document.getElementById('todayFocus'),
  todaySessions: document.getElementById('todaySessions'),
  statsBtn: document.getElementById('statsBtn'),
  backBtn: document.getElementById('backBtn'),
  timerView: document.getElementById('timerView'),
  statsView: document.getElementById('statsView'),
  historyList: document.getElementById('historyList'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  statFocusTime: document.getElementById('statFocusTime'),
  statSessions: document.getElementById('statSessions'),
  statStreak: document.getElementById('statStreak'),
  tabBtns: document.querySelectorAll('.tab-btn'),
  statsTabs: document.querySelectorAll('.stats-tab')
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  updateUI();
  updateTodayProgress();
  setupEventListeners();
  
  // Sync with background timer
  chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
    if (response) {
      state.isRunning = response.isRunning;
      state.timeRemaining = response.timeRemaining;
      state.currentType = response.currentType;
      state.pomodorosCompleted = response.pomodorosCompleted;
      updateUI();
    }
  });
  
  // Listen for timer updates from background
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'timerUpdate') {
      state.timeRemaining = message.timeRemaining;
      state.isRunning = message.isRunning;
      updateTimerDisplay();
      updateProgress();
    } else if (message.action === 'sessionComplete') {
      handleSessionComplete(message.sessionType);
    }
  });
});

// Event Listeners
function setupEventListeners() {
  elements.startBtn.addEventListener('click', toggleTimer);
  elements.resetBtn.addEventListener('click', resetTimer);
  elements.skipBtn.addEventListener('click', skipSession);
  elements.statsBtn.addEventListener('click', showStats);
  elements.backBtn.addEventListener('click', showTimer);
  elements.clearHistoryBtn.addEventListener('click', clearHistory);
  
  // Tab buttons
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchSessionType(btn.dataset.type));
  });
  
  // Stats tabs
  elements.statsTabs.forEach(tab => {
    tab.addEventListener('click', () => switchStatsPeriod(tab.dataset.period));
  });
}

// Timer Functions
function toggleTimer() {
  if (state.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  state.isRunning = true;
  state.currentSessionStart = Date.now();
  
  chrome.runtime.sendMessage({
    action: 'startTimer',
    duration: state.timeRemaining,
    sessionType: state.currentType,
    pomodorosCompleted: state.pomodorosCompleted
  });
  
  updateUI();
  saveState();
}

function pauseTimer() {
  state.isRunning = false;
  chrome.runtime.sendMessage({ action: 'pauseTimer' });
  updateUI();
  saveState();
}

function resetTimer() {
  state.isRunning = false;
  state.timeRemaining = TIMER_CONFIG[state.currentType].duration;
  state.currentSessionStart = null;
  
  chrome.runtime.sendMessage({ action: 'resetTimer' });
  updateUI();
  saveState();
}

function skipSession() {
  if (state.currentType === 'work') {
    // Complete the work session and move to break
    handleSessionComplete('work');
  } else {
    // Skip break and go back to work
    switchSessionType('work');
  }
}

function switchSessionType(type) {
  if (state.isRunning) {
    pauseTimer();
  }
  
  state.currentType = type;
  state.timeRemaining = TIMER_CONFIG[type].duration;
  state.currentSessionStart = null;
  
  // Update active tab
  elements.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });
  
  updateUI();
  saveState();
}

function handleSessionComplete(sessionType) {
  const now = new Date();
  const session = {
    type: sessionType,
    duration: TIMER_CONFIG[sessionType].duration / 60,
    startTime: state.currentSessionStart || (now.getTime() - TIMER_CONFIG[sessionType].duration * 1000),
    endTime: now.getTime(),
    date: now.toDateString()
  };
  
  state.sessions.unshift(session);
  
  if (sessionType === 'work') {
    state.pomodorosCompleted++;
    
    // Determine next break type
    if (state.pomodorosCompleted % 4 === 0) {
      switchSessionType('longBreak');
    } else {
      switchSessionType('shortBreak');
    }
  } else {
    // After break, go back to work
    switchSessionType('work');
  }
  
  updateTodayProgress();
  saveState();
}

// UI Update Functions
function updateUI() {
  updateTimerDisplay();
  updateProgress();
  updateSessionLabel();
  updateControlButtons();
  updatePomodoroCount();
}

function updateTimerDisplay() {
  const minutes = Math.floor(state.timeRemaining / 60);
  const seconds = state.timeRemaining % 60;
  elements.timerDisplay.textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  elements.timerDisplay.classList.toggle('running', state.isRunning);
}

function updateProgress() {
  const totalDuration = TIMER_CONFIG[state.currentType].duration;
  const progress = (totalDuration - state.timeRemaining) / totalDuration;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const offset = circumference * (1 - progress);
  
  elements.timerProgress.style.strokeDashoffset = offset;
  elements.timerProgress.classList.remove('work', 'break');
  elements.timerProgress.classList.add(state.currentType === 'work' ? 'work' : 'break');
}

function updateSessionLabel() {
  elements.sessionLabel.textContent = TIMER_CONFIG[state.currentType].label;
}

function updateControlButtons() {
  if (state.isRunning) {
    elements.playIcon.style.display = 'none';
    elements.pauseIcon.style.display = 'block';
  } else {
    elements.playIcon.style.display = 'block';
    elements.pauseIcon.style.display = 'none';
  }
}

function updatePomodoroCount() {
  elements.pomodoroCount.textContent = state.pomodorosCompleted % 4;
}

function updateTodayProgress() {
  const today = new Date().toDateString();
  const todaySessions = state.sessions.filter(s => s.date === today && s.type === 'work');
  
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const sessionCount = todaySessions.length;
  
  elements.todayFocus.textContent = totalMinutes;
  elements.todaySessions.textContent = sessionCount;
}

// Stats Functions
function showStats() {
  elements.timerView.style.display = 'none';
  elements.statsView.style.display = 'block';
  updateStats('today');
  renderHistory();
}

function showTimer() {
  elements.statsView.style.display = 'none';
  elements.timerView.style.display = 'block';
}

function switchStatsPeriod(period) {
  elements.statsTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.period === period);
  });
  updateStats(period);
}

function updateStats(period) {
  const now = new Date();
  let filteredSessions;
  
  switch (period) {
    case 'today':
      filteredSessions = state.sessions.filter(s => s.date === now.toDateString());
      break;
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredSessions = state.sessions.filter(s => new Date(s.startTime) >= weekAgo);
      break;
    case 'all':
    default:
      filteredSessions = state.sessions;
  }
  
  const workSessions = filteredSessions.filter(s => s.type === 'work');
  const totalMinutes = workSessions.reduce((sum, s) => sum + s.duration, 0);
  const sessionCount = workSessions.length;
  
  elements.statFocusTime.textContent = totalMinutes;
  elements.statSessions.textContent = sessionCount;
  elements.statStreak.textContent = calculateStreak();
}

function calculateStreak() {
  if (state.sessions.length === 0) return 0;
  
  const workSessions = state.sessions.filter(s => s.type === 'work');
  if (workSessions.length === 0) return 0;
  
  // Get unique dates with work sessions
  const dates = [...new Set(workSessions.map(s => s.date))];
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < dates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    if (dates.includes(checkDate.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

function renderHistory() {
  const recentSessions = state.sessions.slice(0, 10);
  
  if (recentSessions.length === 0) {
    elements.historyList.innerHTML = '<div class="empty-history">No sessions recorded yet</div>';
    return;
  }
  
  elements.historyList.innerHTML = recentSessions.map(session => {
    const startTime = new Date(session.startTime);
    const timeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = session.date === new Date().toDateString() ? 'Today' : 
      startTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
    
    const typeLabel = session.type === 'work' ? 'Focus Session' : 
      session.type === 'shortBreak' ? 'Short Break' : 'Long Break';
    
    return `
      <div class="history-item">
        <div class="history-info">
          <span class="history-type">${typeLabel}</span>
          <span class="history-time">${dateStr} at ${timeStr}</span>
        </div>
        <span class="history-duration ${session.type !== 'work' ? 'break' : ''}">
          ${session.duration} min
        </span>
      </div>
    `;
  }).join('');
}

function clearHistory() {
  if (confirm('Are you sure you want to clear all session history?')) {
    state.sessions = [];
    state.pomodorosCompleted = 0;
    saveState();
    updateTodayProgress();
    updateStats('today');
    renderHistory();
  }
}

// Storage Functions
async function loadState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['pomodoroState'], (result) => {
      if (result.pomodoroState) {
        state = { ...state, ...result.pomodoroState };
        
        // Ensure timeRemaining is valid
        if (typeof state.timeRemaining !== 'number' || state.timeRemaining <= 0) {
          state.timeRemaining = TIMER_CONFIG[state.currentType].duration;
        }
      }
      resolve();
    });
  });
}

function saveState() {
  chrome.storage.local.set({
    pomodoroState: {
      currentType: state.currentType,
      timeRemaining: state.timeRemaining,
      pomodorosCompleted: state.pomodorosCompleted,
      sessions: state.sessions.slice(0, 100) // Keep last 100 sessions
    }
  });
}