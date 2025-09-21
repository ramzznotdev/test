// Profile specific functionality
class ProfileManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProfileData();
    }

    bindEvents() {
        // Avatar upload
        const avatarUpload = document.getElementById('avatarUpload');
        const avatarOverlay = document.getElementById('avatarOverlay');
        
        if (avatarUpload && avatarOverlay) {
            avatarOverlay.addEventListener('click', () => {
                avatarUpload.click();
            });
            
            avatarUpload.addEventListener('change', (e) => {
                this.handleAvatarUpload(e.target.files[0]);
            });
        }

        // Change password button
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.changePassword();
            });
        }

        // Delete account button
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.deleteAccount();
            });
        }
    }

    loadProfileData() {
        // Load user data from localStorage
        const userData = localStorage.getItem('ramzzUser');
        if (userData) {
            const user = JSON.parse(userData);
            
            // Set form values
            const profileName = document.getElementById('profileName');
            const profileEmail = document.getElementById('profileEmail');
            const profileBio = document.getElementById('profileBio');
            
            if (profileName) profileName.value = user.name || '';
            if (profileEmail) profileEmail.value = user.email || '';
            if (profileBio) profileBio.value = user.bio || '';
            
            // Set avatar if exists
            if (user.avatar) {
                const avatarImage = document.getElementById('avatarImage');
                if (avatarImage) {
                    avatarImage.src = user.avatar;
                }
            }
        }
    }

    handleAvatarUpload(file) {
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            if (window.ramzzApp) {
                window.ramzzApp.showNotification('Harap pilih file gambar', 'error');
            }
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            if (window.ramzzApp) {
                window.ramzzApp.showNotification('Ukuran file maksimal 5MB', 'error');
            }
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            // Update avatar image
            const avatarImage = document.getElementById('avatarImage');
            if (avatarImage) {
                avatarImage.src = e.target.result;
            }
            
            // Save to user data
            const userData = localStorage.getItem('ramzzUser');
            if (userData) {
                const user = JSON.parse(userData);
                user.avatar = e.target.result;
                localStorage.setItem('ramzzUser', JSON.stringify(user));
                
                if (window.ramzzApp) {
                    window.ramzzApp.showNotification('Foto profil berhasil diubah', 'success');
                }
            }
        };
        
        reader.readAsDataURL(file);
    }

    changePassword() {
        const currentPassword = prompt('Masukkan password saat ini:');
        if (!currentPassword) return;
        
        const newPassword = prompt('Masukkan password baru:');
        if (!newPassword) return;
        
        const confirmPassword = prompt('Konfirmasi password baru:');
        if (!confirmPassword) return;
        
        if (newPassword !== confirmPassword) {
            alert('Password baru dan konfirmasi password tidak sama');
            return;
        }
        
        if (newPassword.length < 8) {
            alert('Password baru minimal 8 karakter');
            return;
        }
        
        // Simulate password change
        if (window.ramzzApp) {
            window.ramzzApp.showLoading(true);
        }
        
        setTimeout(() => {
            if (window.ramzzApp) {
                window.ramzzApp.showLoading(false);
                window.ramzzApp.showNotification('Password berhasil diubah', 'success');
            }
        }, 1000);
    }

    deleteAccount() {
        if (!confirm('Apakah Anda yakin ingin menghapus akun? Semua data akan dihapus permanen dan tidak dapat dikembalikan.')) {
            return;
        }
        
        const confirmation = prompt('Ketik "HAPUS" untuk mengonfirmasi penghapusan akun:');
        if (confirmation !== 'HAPUS') {
            alert('Penghapusan akun dibatalkan');
            return;
        }
        
        // Simulate account deletion
        if (window.ramzzApp) {
            window.ramzzApp.showLoading(true);
        }
        
        setTimeout(() => {
            // Clear all user data
            localStorage.removeItem('ramzzUser');
            localStorage.removeItem('riibotConversations');
            localStorage.removeItem('groqApiKey');
            
            if (window.ramzzApp) {
                window.ramzzApp.showLoading(false);
                window.ramzzApp.showNotification('Akun berhasil dihapus', 'success');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        }, 2000);
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});