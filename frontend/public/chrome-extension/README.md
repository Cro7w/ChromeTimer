# Study Focus Timer - Chrome Extension

A Pomodoro timer Chrome extension to help students stay focused while studying online.

## Features

- ⏱️ **Pomodoro Timer**: Classic 25-min focus / 5-min short break / 15-min long break
- 🔔 **Notifications**: Both sound and browser notifications when timer ends
- 📊 **Session History**: Detailed tracking with start/end times, duration, daily/weekly stats
- 🌙 **Dark Mode**: Beautiful dark theme for comfortable viewing
- 💾 **Chrome Storage**: All your data synced locally
- 📈 **Statistics**: Track your focus time, sessions completed, and day streaks

## Installation

### Method 1: Load as Unpacked Extension (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `/app/chrome-extension` folder
5. The extension will appear in your toolbar!

### Method 2: Manual Installation

1. Download or clone this repository
2. Follow the steps above to load the extension

## Usage

1. **Click the extension icon** in your Chrome toolbar to open the popup
2. **Select session type**: Focus, Short Break, or Long Break
3. **Click the play button** to start the timer
4. **Track your progress**: View today's focus time and sessions at the bottom
5. **View statistics**: Click the chart icon to see detailed stats and session history

## Timer Settings

| Session Type | Duration |
|-------------|----------|
| Focus | 25 minutes |
| Short Break | 5 minutes |
| Long Break | 15 minutes |

- After every 4 focus sessions, a long break is automatically suggested
- Auto-transitions between focus and break sessions

## Permissions

- `storage`: Save your session history and preferences
- `alarms`: Keep timer running in background
- `notifications`: Alert you when timer completes

## File Structure

```
chrome-extension/
├── manifest.json      # Extension configuration
├── popup.html         # Main popup UI
├── popup.css          # Styling (dark theme)
├── popup.js           # Popup functionality
├── background.js      # Service worker for timer
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Tips for Best Focus

1. 🎯 Set a clear goal before starting each focus session
2. 📱 Put your phone on silent or in another room
3. 🚫 Close unnecessary browser tabs
4. 💧 Stay hydrated during breaks
5. 🚶 Take a short walk during long breaks

---

Built with ❤️ for focused studying
