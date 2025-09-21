// Dashboard specific functionality
class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCharts();
        this.loadUserData();
    }

    bindEvents() {
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

    loadCharts() {
        // Activity chart
        const activityCtx = document.getElementById('activityChart');
        if (activityCtx) {
            this.createActivityChart(activityCtx);
        }

        // Request type chart
        const requestTypeCtx = document.getElementById('requestTypeChart');
        if (requestTypeCtx) {
            this.createRequestTypeChart(requestTypeCtx);
        }
    }

    createActivityChart(ctx) {
        // Sample data for activity chart
        const data = {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [{
                label: 'Percakapan',
                data: [12, 19, 8, 15, 22, 18, 11],
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                borderColor: 'rgba(124, 58, 237, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
    }

    createRequestTypeChart(ctx) {
        // Sample data for request type chart
        const data = {
            labels: ['Pemrograman', 'Tugas', 'Umum', 'Analisis File'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgba(124, 58, 237, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(6, 214, 160, 0.8)',
                    'rgba(0, 245, 255, 0.8)'
                ],
                borderWidth: 0
            }]
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
    }

    loadUserData() {
        // Load user data from localStorage
        const userData = localStorage.getItem('ramzzUser');
        if (userData) {
            const user = JSON.parse(userData);
            
            // Update user name if element exists
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = user.name;
            }
            
            // Update user email if element exists
            const userEmailElement = document.getElementById('userEmail');
            if (userEmailElement) {
                userEmailElement.textContent = user.email;
            }
            
            // Update join date if element exists
            const joinDateElement = document.getElementById('joinDate');
            if (joinDateElement && user.joined) {
                const joinDate = new Date(user.joined);
                joinDateElement.textContent = joinDate.toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long'
                });
            }
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

// Initialize dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});