// Settings specific functionality
class SettingsManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSettings();
    }

    bindEvents() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }

        // Notifications toggle
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.addEventListener('change', (e) => {
                this.toggleNotifications(e.target.checked);
            });
        }

        // Language select
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Clear history button
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }

        // Export data button
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
    }

    loadSettings() {
        // Load dark mode setting
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = darkMode;
        }

        // Load notifications setting
        const notifications = localStorage.getItem('notifications') !== 'false'; // Default to true
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.checked = notifications;
        }

        // Load language setting
        const language = localStorage.getItem('language') || 'id';
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = language;
        }
    }

    toggleDarkMode(enabled) {
        localStorage.setItem('darkMode', enabled);
        
        if (enabled) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        
        if (window.ramzzApp) {
            window.ramzzApp.showNotification(`Mode ${enabled ? 'gelap' : 'terang'} diaktifkan`, 'success');
        }
    }

    toggleNotifications(enabled) {
        localStorage.setItem('notifications', enabled);
        
        if (window.ramzzApp) {
            window.ramzzApp.showNotification(`Notifikasi ${enabled ? 'diaktifkan' : 'dinonaktifkan'}`, 'success');
        }
    }

    changeLanguage(language) {
        localStorage.setItem('language', language);
        
        if (window.ramzzApp) {
            window.ramzzApp.showNotification(`Bahasa diubah ke ${language === 'id' ? 'Indonesia' : 'English'}`, 'success');
        }
    }

    clearHistory() {
        if (confirm('Apakah Anda yakin ingin menghapus semua riwayat percakapan? Tindakan ini tidak dapat dibatalkan.')) {
            localStorage.removeItem('riibotConversations');
            
            if (window.ramzzApp) {
                window.ramzzApp.showNotification('Riwayat percakapan berhasil dihapus', 'success');
            }
        }
    }

    exportData() {
        // Get conversations data
        const conversations = localStorage.getItem('riibotConversations');
        const userData = localStorage.getItem('ramzzUser');
        
        // Prepare export data
        const exportData = {
            exportedAt: new Date().toISOString(),
            user: userData ? JSON.parse(userData) : null,
            conversations: conversations ? JSON.parse(conversations) : []
        };
        
        // Convert to JSON string
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ramzzbotz-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        if (window.ramzzApp) {
            window.ramzzApp.showNotification('Data berhasil diekspor', 'success');
        }
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});