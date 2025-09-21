// Documentation specific functionality
class DocsManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.highlightCodeBlocks();
        this.handleAnchorLinks();
    }

    bindEvents() {
        // Smooth scrolling for documentation links
        const docsLinks = document.querySelectorAll('.docs-link');
        docsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                
                // Update active link
                docsLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Copy code buttons
        const copyButtons = document.querySelectorAll('.copy-code-btn');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const codeBlock = button.closest('.code-block-container').querySelector('code');
                this.copyCodeToClipboard(codeBlock);
            });
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    handleAnchorLinks() {
        // Check if URL has hash and scroll to section
        if (window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            setTimeout(() => {
                this.scrollToSection(sectionId);
                
                // Update active link
                const docsLinks = document.querySelectorAll('.docs-link');
                docsLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }, 100);
        }
    }

    highlightCodeBlocks() {
        // This would typically use a library like Highlight.js
        // For now, we'll just ensure proper formatting
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            // Basic formatting - in a real app, you'd use a syntax highlighter
            block.innerHTML = block.innerHTML.trim();
        });
    }

    copyCodeToClipboard(codeElement) {
        if (!codeElement) return;

        const text = codeElement.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            const copyBtn = codeElement.closest('.code-block-container').querySelector('.copy-code-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#10b981';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy code:', err);
            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                textArea.setSelectionRange(0, 99999);
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const copyBtn = codeElement.closest('.code-block-container').querySelector('.copy-code-btn');
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.style.background = '#10b981';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            } catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError);
                alert('Copy failed. Please select and copy the code manually.');
            }
        });
    }
}

// Initialize docs manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.docsManager = new DocsManager();
});