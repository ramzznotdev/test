// API Key management
class ApiKeyManager {
    constructor() {
        this.apiKey = '';
        this.init();
    }

    init() {
        this.loadApiKey();
        this.bindEvents();
    }

    bindEvents() {
        // Save API key button
        const saveApiKeyBtn = document.getElementById('saveApiKey');
        if (saveApiKeyBtn) {
            saveApiKeyBtn.addEventListener('click', () => {
                this.saveApiKey();
            });
        }

        // Test API key button
        const testApiKeyBtn = document.getElementById('testApiKey');
        if (testApiKeyBtn) {
            testApiKeyBtn.addEventListener('click', () => {
                this.testApiKey();
            });
        }

        // API key input change
        const apiKeyInput = document.getElementById('apiKey');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('input', (e) => {
                this.apiKey = e.target.value;
            });
        }

        // Temperature slider
        const temperatureSlider = document.getElementById('temperatureSlider');
        if (temperatureSlider) {
            temperatureSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                document.getElementById('temperatureValue').textContent = value;
                localStorage.setItem('aiTemperature', value);
            });
        }

        // Model selection
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => {
                localStorage.setItem('aiModel', e.target.value);
            });
        }

        // Max tokens selection
        const maxTokensSelect = document.getElementById('maxTokensSelect');
        if (maxTokensSelect) {
            maxTokensSelect.addEventListener('change', (e) => {
                localStorage.setItem('aiMaxTokens', e.target.value);
            });
        }
    }

    loadApiKey() {
        const savedApiKey = localStorage.getItem('groqApiKey');
        if (savedApiKey) {
            this.apiKey = savedApiKey;
            
            // Set value in input field if it exists
            const apiKeyInput = document.getElementById('apiKey');
            if (apiKeyInput) {
                apiKeyInput.value = savedApiKey;
            }
        }

        // Load other AI settings
        this.loadAISettings();
    }

    loadAISettings() {
        // Temperature
        const savedTemperature = localStorage.getItem('aiTemperature');
        const temperatureSlider = document.getElementById('temperatureSlider');
        const temperatureValue = document.getElementById('temperatureValue');
        
        if (savedTemperature && temperatureSlider && temperatureValue) {
            temperatureSlider.value = savedTemperature;
            temperatureValue.textContent = savedTemperature;
        }

        // Model
        const savedModel = localStorage.getItem('aiModel');
        const modelSelect = document.getElementById('modelSelect');
        
        if (savedModel && modelSelect) {
            modelSelect.value = savedModel;
        }

        // Max tokens
        const savedMaxTokens = localStorage.getItem('aiMaxTokens');
        const maxTokensSelect = document.getElementById('maxTokensSelect');
        
        if (savedMaxTokens && maxTokensSelect) {
            maxTokensSelect.value = savedMaxTokens;
        }
    }

    saveApiKey() {
        const apiKeyInput = document.getElementById('apiKey');
        if (apiKeyInput) {
            this.apiKey = apiKeyInput.value.trim();
        }

        if (!this.apiKey) {
            if (window.ramzzApp) {
                window.ramzzApp.showNotification('API Key tidak boleh kosong', 'error');
            }
            return;
        }

        localStorage.setItem('groqApiKey', this.apiKey);
        
        if (window.ramzzApp) {
            window.ramzzApp.showNotification('API Key berhasil disimpan', 'success');
        }
    }

    async testApiKey() {
        const apiKeyInput = document.getElementById('apiKey');
        if (apiKeyInput) {
            this.apiKey = apiKeyInput.value.trim();
        }

        if (!this.apiKey) {
            if (window.ramzzApp) {
                window.ramzzApp.showNotification('API Key tidak boleh kosong', 'error');
            }
            return;
        }

        if (window.ramzzApp) {
            window.ramzzApp.showLoading(true);
        }

        try {
            // Test the API key by making a simple request
            const response = await fetch('https://api.groq.com/openai/v1/models', {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (response.ok) {
                if (window.ramzzApp) {
                    window.ramzzApp.showNotification('API Key valid! Koneksi berhasil.', 'success');
                }
            } else {
                throw new Error(`API returned ${response.status}`);
            }
        } catch (error) {
            console.error('API Key test failed:', error);
            if (window.ramzzApp) {
                window.ramzzApp.showNotification('API Key tidak valid atau terjadi kesalahan', 'error');
            }
        } finally {
            if (window.ramzzApp) {
                window.ramzzApp.showLoading(false);
            }
        }
    }

    getApiKey() {
        return this.apiKey;
    }

    getAISettings() {
        return {
            model: localStorage.getItem('aiModel') || 'llama',
            temperature: parseFloat(localStorage.getItem('aiTemperature')) || 0.7,
            maxTokens: parseInt(localStorage.getItem('aiMaxTokens')) || 1024
        };
    }
}

// Initialize API key manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.apiKeyManager = new ApiKeyManager();
});