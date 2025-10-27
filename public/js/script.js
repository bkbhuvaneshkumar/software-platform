

// Image optimization and error handling
function optimizeImageLoading() {
    // Preload critical images
    const criticalImages = [
        '/default/photo-editor.jpg',
        '/default/video-converter.jpg',
        '/default/audio-studio.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Enhanced image error handler
function handleImageError(img) {
    console.warn('Image failed to load:', img.src);
    img.src = 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Software+Image';
    img.classList.add('fallback-image');
}

// Load default applications with optimized image handling
function loadDefaultApps() {
    const container = document.getElementById('default-apps');
    if (!container) {
        console.error('Default apps container not found');
        return;
    }

    try {
        container.innerHTML = defaultApplications.map((app, index) => `
            <div class="app-card" style="animation-delay: ${index * 0.1}s" onclick="openAppDetail(${app.id}, true)">
                <img src="${app.image_path}" 
                     alt="${app.title}" 
                     class="app-card-image"
                     loading="lazy"
                     onerror="handleImageError(this)"
                     onload="this.classList.add('loaded')">
                <div class="app-card-content">
                    <div class="app-card-header">
                        <h3>${app.title}</h3>
                    </div>
                    <p>${app.description}</p>
                    <div class="app-card-meta">
                        <span class="days-ago">${app.days_ago}</span>
                        ${Math.random() > 0.7 ? '<span class="app-badge">Featured</span>' : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Add animation after DOM update
        setTimeout(() => {
            const cards = container.querySelectorAll('.app-card');
            cards.forEach(card => {
                card.style.animation = 'slideUp 0.6s ease-out forwards';
                card.style.opacity = '0';
            });
        }, 50);

    } catch (error) {
        console.error('Error loading default apps:', error);
        container.innerHTML = '<div class="error-message">Failed to load featured applications.</div>';
    }
}

// Enhanced application loading with better error handling
async function loadAllApps() {
    const loadingSection = document.getElementById('loading-section');
    const container = document.getElementById('all-apps');
    
    if (!container) {
        console.error('All apps container not found');
        return;
    }

    // Show loading animation
    if (loadingSection) loadingSection.classList.add('active');
    container.innerHTML = '';

    try {
        const response = await fetch('/api/applications');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apps = await response.json();
        
        // Hide loading animation
        if (loadingSection) loadingSection.classList.remove('active');
        
        // Render apps with optimized image handling
        container.innerHTML = apps.map((app, index) => `
            <div class="app-card" style="animation-delay: ${index * 0.1}s" onclick="openAppDetail(${app.id}, false)">
                <img src="${app.image_path}" 
                     alt="${app.title}" 
                     class="app-card-image"
                     loading="lazy"
                     onerror="handleImageError(this)"
                     onload="this.classList.add('loaded')">
                <div class="app-card-content">
                    <div class="app-card-header">
                        <h3>${app.title}</h3>
                    </div>
                    <p>${app.description}</p>
                    <div class="app-card-meta">
                        <span class="days-ago">${app.days_ago}</span>
                        ${Math.random() > 0.7 ? '<span class="app-badge">Popular</span>' : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Add staggered animations
        setTimeout(() => {
            const cards = container.querySelectorAll('.app-card');
            cards.forEach(card => {
                card.style.animation = 'slideUp 0.6s ease-out forwards';
                card.style.opacity = '0';
            });
        }, 50);

    } catch (error) {
        console.error('Error loading applications:', error);
        if (loadingSection) loadingSection.classList.remove('active');
        container.innerHTML = `
            <div class="error-message">
                <p>Failed to load applications. Please try again later.</p>
                <button onclick="loadAllApps()" class="btn btn-secondary">Retry</button>
            </div>
        `;
    }
}

// Enhanced modal with better performance
async function openAppDetail(appId, isDefault) {
    let app;
    
    try {
        if (isDefault) {
            app = defaultApplications.find(a => a.id === appId);
        } else {
            const response = await fetch(`/api/application/${appId}`);
            if (!response.ok) throw new Error('Failed to fetch app details');
            app = await response.json();
        }
        
        if (!app) {
            throw new Error('Application not found');
        }
        
        await showAppModal(app);
        
    } catch (error) {
        console.error('Error opening app detail:', error);
        showNotification('Failed to load application details', 'error');
    }
}

// Separate modal display function for better performance
async function showAppModal(app) {
    const modal = document.getElementById('appModal');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalContent) {
        console.error('Modal elements not found');
        return;
    }

    // Preload modal image
    const modalImage = new Image();
    modalImage.src = app.image_path;
    modalImage.onerror = function() {
        this.src = 'https://via.placeholder.com/800x400/6366f1/ffffff?text=Software+Image';
    };

    modalContent.innerHTML = `
        <div class="app-detail-modal">
            <div class="app-detail-hero">
                <img src="${app.image_path}" 
                     alt="${app.title}" 
                     class="app-detail-image"
                     onerror="this.src='https://via.placeholder.com/800x400/6366f1/ffffff?text=Software+Image'">
                <div class="app-detail-overlay">
                    <div class="app-basic-info">
                        <h1>${app.title}</h1>
                        <div class="app-meta-info">
                            <span class="days-ago-large">${app.days_ago}</span>
                            <span class="app-category">Software Application</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="app-detail-content">
                <div class="app-description-section">
                    <h2>About This Application</h2>
                    <p class="app-full-description">${app.description}</p>
                </div>
                
                <div class="app-features-section">
                    <h3>Key Features</h3>
                    <div class="features-grid">
                        <div class="feature-item">
                            <div class="feature-icon">🚀</div>
                            <div class="feature-text">
                                <strong>High Performance</strong>
                                <span>Optimized for speed and efficiency</span>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🛡️</div>
                            <div class="feature-text">
                                <strong>100% Secure</strong>
                                <span>Virus-free and safe to use</span>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">⚡</div>
                            <div class="feature-text">
                                <strong>Instant Download</strong>
                                <span>Get started immediately</span>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🎯</div>
                            <div class="feature-text">
                                <strong>User-Friendly</strong>
                                <span>Easy to install and use</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="app-requirements">
                    <h3>System Requirements</h3>
                    <div class="requirements-list">
                        <div class="requirement">
                            <span class="req-icon">💻</span>
                            <span>Windows 10/11, macOS, or Linux</span>
                        </div>
                        <div class="requirement">
                            <span class="req-icon">🧠</span>
                            <span>2GB RAM minimum</span>
                        </div>
                        <div class="requirement">
                            <span class="req-icon">💾</span>
                            <span>500MB available storage</span>
                        </div>
                        <div class="requirement">
                            <span class="req-icon">🌐</span>
                            <span>Internet connection for download</span>
                        </div>
                    </div>
                </div>
                
               <div class="download-section">
    <div class="download-info">
        <h3>Join telegram & Download</h3>
        <p>Click the button below to get the direct download link.</p>
    </div>
   <button onclick="window.location.href='https://t.me/freesoftwareadmin?text=Hello!%20%F0%9F%91%8B%0AI%20need%20software%20support.%20Please%20check%20my%20choices%20below%20%F0%9F%91%87%0A%0A%F0%9F%8E%A8%20Photoshop%0A%F0%9F%8E%A5%20Premiere%20Pro%0A%E2%9C%A8%20After%20Effects%0A%F0%9F%96%8C%EF%B8%8F%20Illustrator%0A%F0%9F%93%B7%20Lightroom%0A%F0%9F%8E%AC%20CapCut%0A%F0%9F%8E%9B%EF%B8%8F%20DaVinci%20Resolve%0A%F0%9F%92%BB%20Other%20software%0A%0AMy%20request%20is%3A%20________';" 
class="btn btn-primary btn-large download-btn">
    <span>Get Download Link</span>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</button>

    
</div>

            </div>
        </div>
    `;
    
    // Show modal with animation
    modal.style.display = 'block';
    setTimeout(() => {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
}

// Enhanced download function
function downloadApp(appName) {
    try {
        // Close modal first for better UX
        const modal = document.getElementById('appModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Show download notification
        showNotification(`Opening direct chat for ${appName}...`, 'info');
        
        // Simulate download process before redirecting
        setTimeout(() => {
            window.open('http://t.me/freesoftwareadmin', '_blank');
            showNotification(`Download completed! Opening ${appName}...`, 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Error in download process:', error);
        showNotification('Download failed. Please try again.', 'error');
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `download-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'error' ? '❌' : type === 'success' ? '✅' : '📥'}
            </span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class with slight delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Robust modal setup
function setupModal() {
    const modal = document.getElementById('appModal');
    const closeBtn = document.querySelector('.close');
    
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    // Close button event
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }
    }
    
    // Click outside to close
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
    
    // Escape key to close
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Lazy load images when scrolling stops
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (isElementInViewport(img) && !img.classList.contains('loaded')) {
                img.src = img.src;
            }
        });
    }, 100);
});

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize with error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        optimizeImageLoading();
        loadDefaultApps();
        loadAllApps();
        setupModal();
        
        // Add CSS for image transitions
        const style = document.createElement('style');
        style.textContent = `
            .app-card-image {
                transition: opacity 0.3s ease;
                opacity: 0;
            }
            .app-card-image.loaded {
                opacity: 1;
            }
            .fallback-image {
                background: #f3f4f6;
            }
            .download-notification {
                transition: all 0.3s ease;
            }
            .download-notification.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Export functions for global access (if needed)
window.loadDefaultApps = loadDefaultApps;
window.loadAllApps = loadAllApps;
window.openAppDetail = openAppDetail;
window.downloadApp = downloadApp;
window.handleImageError = handleImageError;
