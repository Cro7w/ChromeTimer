// Background Service Worker for Pomodoro Timer

let timerState = {
  isRunning: false,
  timeRemaining: 25 * 60,
  currentType: 'work',
  pomodorosCompleted: 0,
  intervalId: null
};

// Timer Configuration
const TIMER_CONFIG = {
  work: { duration: 25 * 60, label: 'Focus Time' },
  shortBreak: { duration: 5 * 60, label: 'Short Break' },
  longBreak: { duration: 15 * 60, label: 'Long Break' }
};

// Load saved state on startup
chrome.storage.local.get(['pomodoroState'], (result) => {
  if (result.pomodoroState) {
    timerState.currentType = result.pomodoroState.currentType || 'work';
    timerState.timeRemaining = result.pomodoroState.timeRemaining || TIMER_CONFIG.work.duration;
    timerState.pomodorosCompleted = result.pomodoroState.pomodorosCompleted || 0;
  }
});

// Message Handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startTimer':
      startTimer(message.duration, message.sessionType, message.pomodorosCompleted);
      sendResponse({ success: true });
      break;
      
    case 'pauseTimer':
      pauseTimer();
      sendResponse({ success: true });
      break;
      
    case 'resetTimer':
      resetTimer();
      sendResponse({ success: true });
      break;
      
    case 'getState':
      sendResponse({
        isRunning: timerState.isRunning,
        timeRemaining: timerState.timeRemaining,
        currentType: timerState.currentType,
        pomodorosCompleted: timerState.pomodorosCompleted
      });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  return true;
});

// Timer Functions
function startTimer(duration, sessionType, pomodorosCompleted) {
  timerState.isRunning = true;
  timerState.timeRemaining = duration;
  timerState.currentType = sessionType;
  timerState.pomodorosCompleted = pomodorosCompleted;
  
  // Clear any existing interval
  if (timerState.intervalId) {
    clearInterval(timerState.intervalId);
  }
  
  // Start countdown
  timerState.intervalId = setInterval(() => {
    if (timerState.timeRemaining > 0) {
      timerState.timeRemaining--;
      
      // Update badge with time remaining
      updateBadge();
      
      // Notify popup of update
      chrome.runtime.sendMessage({
        action: 'timerUpdate',
        timeRemaining: timerState.timeRemaining,
        isRunning: timerState.isRunning
      }).catch(() => {}); // Ignore if popup is closed
      
    } else {
      // Timer complete
      handleTimerComplete();
    }
  }, 1000);
  
  updateBadge();
}

function pauseTimer() {
  timerState.isRunning = false;
  
  if (timerState.intervalId) {
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
  }
  
  updateBadge();
}

function resetTimer() {
  pauseTimer();
  timerState.timeRemaining = TIMER_CONFIG[timerState.currentType].duration;
  chrome.action.setBadgeText({ text: '' });
}

function handleTimerComplete() {
  pauseTimer();
  
  const completedType = timerState.currentType;
  
  // Play notification sound
  playNotificationSound();
  
  // Show notification
  showNotification(completedType);
  
  // Notify popup
  chrome.runtime.sendMessage({
    action: 'sessionComplete',
    sessionType: completedType
  }).catch(() => {});
  
  // Clear badge
  chrome.action.setBadgeText({ text: '' });
}

function updateBadge() {
  if (timerState.isRunning) {
    const minutes = Math.ceil(timerState.timeRemaining / 60);
    chrome.action.setBadgeText({ text: minutes.toString() });
    chrome.action.setBadgeBackgroundColor({ 
      color: timerState.currentType === 'work' ? '#22c55e' : '#3b82f6'
    });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Notification Functions
function showNotification(sessionType) {
  let title, message;
  
  if (sessionType === 'work') {
    title = '🎉 Focus Session Complete!';
    message = 'Great work! Time for a well-deserved break.';
  } else if (sessionType === 'shortBreak') {
    title = '⏰ Break Over!';
    message = 'Ready to get back to focused work?';
  } else {
    title = '☕ Long Break Over!';
    message = "You're doing amazing! Let's keep going.";
  }
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: title,
    message: message,
    priority: 2,
    requireInteraction: true
  });
}

function playNotificationSound() {
  // Create an offscreen document to play audio
  // Note: In a real extension, you'd include an audio file
  // For now, we use system notification sound
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onpyfl5KNkZOXm5mVko+MjY+Sk5WUkY6LiouOkZSVlJKPjIqKjI+Sk5SUko+MiomKjI+RkpKRj4yKiYmLjY+QkJCOjIqIiIqMjo+PjoyKiYiIioyOjo6NjIqJiImKjI2NjYyLiomIiYqLjIyMi4qJiIiJiouLi4uKiYiIiImKioqKiomIiIiIiYqKioqJiYiIiIiJiYmJiYmIiIiIiIiJiYmJiImIiIiIiIiIiImJiYiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIh4eHiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiA==');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {
    // Fallback: notification sound handled by system
  }
}

// Handle extension install/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default state
    chrome.storage.local.set({
      pomodoroState: {
        currentType: 'work',
        timeRemaining: TIMER_CONFIG.work.duration,
        pomodorosCompleted: 0,
        sessions: []
      }
    });
  }
});

// Keep service worker alive
chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    // Just keeping the service worker active
  }
});