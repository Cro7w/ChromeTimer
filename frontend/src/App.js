import { useState } from "react";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

const InstallStep = ({ number, title, description }) => (
  <div className="install-step">
    <div className="step-number">{number}</div>
    <div className="step-content">
      <h4 className="step-title">{title}</h4>
      <p className="step-description">{description}</p>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#22c55e"/>
            <circle cx="16" cy="16" r="11" fill="#0f0f14"/>
            <path d="M16 8V16L21 19" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span>Study Focus Timer</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
          <a href="#install">Install</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Chrome Extension</div>
          <h1 className="hero-title">
            Stay Focused.<br/>
            <span className="gradient-text">Study Smarter.</span>
          </h1>
          <p className="hero-description">
            A beautiful Pomodoro timer that helps students maintain focus while studying online. 
            Track your sessions, earn streaks, and boost your productivity.
          </p>
          <div className="hero-buttons">
            <a href="#install" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Install Extension
            </a>
            <a href="#preview" className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Live Preview
            </a>
          </div>
        </div>
        <div className="hero-preview">
          <div className="browser-frame">
            <div className="browser-header">
              <div className="browser-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
            </div>
            <iframe 
              src="/chrome-extension/popup.html" 
              title="Extension Preview"
              className="preview-frame"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Why Study Focus Timer?</h2>
        <p className="section-subtitle">Everything you need to supercharge your study sessions</p>
        
        <div className="features-grid">
          <FeatureCard 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            }
            title="Pomodoro Technique"
            description="Classic 25-minute focus sessions with automatic short and long breaks to maximize productivity."
          />
          <FeatureCard 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            }
            title="Smart Notifications"
            description="Get alerted with sound and browser notifications when your timer ends. Never miss a break!"
          />
          <FeatureCard 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10"/>
                <path d="M12 20V4"/>
                <path d="M6 20v-6"/>
              </svg>
            }
            title="Detailed Statistics"
            description="Track your focus time, completed sessions, and maintain study streaks with beautiful analytics."
          />
          <FeatureCard 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            }
            title="Dark Mode Design"
            description="Easy on the eyes with a beautiful dark theme perfect for late-night study sessions."
          />
          <FeatureCard 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
            }
            title="Auto-Save Progress"
            description="All your sessions are saved automatically using Chrome storage. Never lose your progress."
          />
          <FeatureCard 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            }
            title="Session History"
            description="Review all your past study sessions with timestamps, durations, and session types."
          />
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview" className="preview-section">
        <h2 className="section-title">See It In Action</h2>
        <p className="section-subtitle">Interactive preview of the extension</p>
        
        <div className="preview-container">
          <div className="preview-tabs">
            <button 
              className={`preview-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Timer View
            </button>
            <button 
              className={`preview-tab ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Features List
            </button>
          </div>
          
          {activeTab === 'preview' && (
            <div className="live-preview">
              <div className="extension-wrapper">
                <iframe 
                  src="/chrome-extension/popup.html" 
                  title="Extension Preview"
                  className="extension-frame"
                />
              </div>
              <div className="preview-info">
                <h3>Try it out!</h3>
                <ul>
                  <li>Click the play button to start the timer</li>
                  <li>Switch between Focus, Short Break, and Long Break modes</li>
                  <li>Click the chart icon to view statistics</li>
                  <li>Reset or skip sessions using the control buttons</li>
                </ul>
                <p className="preview-note">
                  <strong>Note:</strong> This is a live preview. For full functionality including 
                  background timer and notifications, install the extension in Chrome.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'features' && (
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>25-minute focus sessions</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>5-minute short breaks</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>15-minute long breaks (after 4 pomodoros)</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Sound notifications</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Browser notifications</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Session history with timestamps</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Daily/Weekly/All-time statistics</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Study streak tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <span>Persistent storage</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Installation Section */}
      <section id="install" className="install-section">
        <h2 className="section-title">Installation Guide</h2>
        <p className="section-subtitle">Get started in under a minute</p>
        
        <div className="install-steps">
          <InstallStep 
            number="1"
            title="Open Chrome Extensions"
            description="Navigate to chrome://extensions/ in your Chrome browser"
          />
          <InstallStep 
            number="2"
            title="Enable Developer Mode"
            description="Toggle the 'Developer mode' switch in the top-right corner"
          />
          <InstallStep 
            number="3"
            title="Load Extension"
            description="Click 'Load unpacked' and select the chrome-extension folder"
          />
          <InstallStep 
            number="4"
            title="Start Focusing!"
            description="Click the extension icon in your toolbar to begin"
          />
        </div>

        <div className="download-box">
          <h3>Extension Location</h3>
          <code>/app/chrome-extension</code>
          <p>The extension files are ready to be loaded into Chrome!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#22c55e"/>
              <circle cx="16" cy="16" r="11" fill="#0f0f14"/>
              <path d="M16 8V16L21 19" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span>Study Focus Timer</span>
          </div>
          <p className="footer-text">Built with ❤️ for focused studying</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
