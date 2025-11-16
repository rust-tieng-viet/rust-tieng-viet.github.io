/**
 * Rust Tiếng Việt - Custom JavaScript
 * Enhancements for UX, accessibility, and analytics
 */

(function() {
  'use strict';

  // ============================================
  // Cookie Consent Management
  // ============================================
  const COOKIE_CONSENT_KEY = 'rust-vi-cookie-consent';

  function getCookieConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  }

  function setCookieConsent(value) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  }

  function initializeCookieConsent() {
    const consent = getCookieConsent();

    // Create cookie consent banner
    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.innerHTML = `
      <div class="cookie-consent-content">
        <p>
          <strong>🍪 Cookies và Quyền riêng tư</strong><br>
          Chúng tôi sử dụng cookies để phân tích lưu lượng truy cập và cải thiện trải nghiệm người dùng.
          Dữ liệu được thu thập hoàn toàn ẩn danh (IP được ẩn danh hóa).
          <a href="privacy.html">Xem chính sách bảo mật</a>
        </p>
        <div class="cookie-consent-buttons">
          <button id="accept-cookies" class="btn-primary">Chấp nhận</button>
          <button id="decline-cookies" class="btn-secondary">Từ chối</button>
        </div>
      </div>
    `;

    // Show banner only if no consent decision yet
    if (consent === null) {
      document.body.appendChild(banner);

      // Setup event listeners
      document.getElementById('accept-cookies').addEventListener('click', function() {
        setCookieConsent('accepted');
        banner.style.display = 'none';
        enableAnalytics();
      });

      document.getElementById('decline-cookies').addEventListener('click', function() {
        setCookieConsent('declined');
        banner.style.display = 'none';
        disableAnalytics();
      });
    } else if (consent === 'accepted') {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
  }

  function enableAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  function disableAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    window['ga-disable-G-88RKF7DLPY'] = true;
  }

  // ============================================
  // Lazy Loading Images
  // ============================================
  function initializeLazyLoading() {
    // Use native lazy loading if supported
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    } else {
      // Fallback for older browsers
      const images = document.querySelectorAll('img');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // ============================================
  // Reading Progress Indicator
  // ============================================
  function initializeReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      progressBar.style.width = progress + '%';
    });
  }

  // ============================================
  // Skip to Content (Accessibility)
  // ============================================
  function initializeSkipToContent() {
    const skipLink = document.createElement('a');
    skipLink.href = '#content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Bỏ qua đến nội dung chính';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // ============================================
  // External Link Indicators
  // ============================================
  function initializeExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      // Check if link is external
      if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        // Add aria-label for screen readers
        const currentLabel = link.getAttribute('aria-label') || link.textContent;
        link.setAttribute('aria-label', currentLabel + ' (mở trong tab mới)');
      }
    });
  }

  // ============================================
  // Copy Code Button
  // ============================================
  function initializeCopyCodeButtons() {
    const codeBlocks = document.querySelectorAll('pre > code');
    codeBlocks.forEach(codeBlock => {
      const pre = codeBlock.parentElement;
      const button = document.createElement('button');
      button.className = 'copy-code-button';
      button.textContent = 'Sao chép';
      button.setAttribute('aria-label', 'Sao chép code');

      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeBlock.textContent);
          button.textContent = 'Đã sao chép!';
          setTimeout(() => {
            button.textContent = 'Sao chép';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
          button.textContent = 'Lỗi!';
        }
      });

      // Only add if mdBook hasn't already added one
      if (!pre.querySelector('.copy-code-button')) {
        pre.style.position = 'relative';
        button.style.position = 'absolute';
        button.style.top = '0.5rem';
        button.style.right = '0.5rem';
        button.style.padding = '0.25rem 0.5rem';
        button.style.fontSize = '0.8rem';
        button.style.cursor = 'pointer';
        button.style.border = '1px solid var(--theme-hover)';
        button.style.background = 'var(--bg)';
        button.style.color = 'var(--fg)';
        button.style.borderRadius = '3px';
        pre.appendChild(button);
      }
    });
  }

  // ============================================
  // Table of Contents Enhancement
  // ============================================
  function initializeTableOfContents() {
    const content = document.querySelector('#content, main, .content');
    if (!content) return;

    const headings = content.querySelectorAll('h1, h2, h3');
    if (headings.length < 3) return; // Only show TOC if there are enough headings

    const toc = document.createElement('nav');
    toc.className = 'page-toc';
    toc.setAttribute('aria-label', 'Mục lục trang');

    const tocTitle = document.createElement('h4');
    tocTitle.textContent = 'Trong trang này';
    toc.appendChild(tocTitle);

    const tocList = document.createElement('ul');

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }

      const li = document.createElement('li');
      li.className = 'toc-' + heading.tagName.toLowerCase();

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;

      li.appendChild(link);
      tocList.appendChild(li);
    });

    toc.appendChild(tocList);

    // Insert TOC after first paragraph or heading
    const firstP = content.querySelector('p');
    if (firstP) {
      firstP.parentNode.insertBefore(toc, firstP.nextSibling);
    }
  }

  // ============================================
  // Performance: Preload Important Resources
  // ============================================
  function initializeResourcePreloading() {
    // Preload fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preconnect';
    fontPreload.href = 'https://fonts.googleapis.com';
    document.head.appendChild(fontPreload);
  }

  // ============================================
  // Keyboard Shortcuts
  // ============================================
  function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('#searchbar, .search-input');
        if (searchInput) searchInput.focus();
      }

      // Ctrl/Cmd + /: Show keyboard shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        showKeyboardShortcutsHelp();
      }
    });
  }

  function showKeyboardShortcutsHelp() {
    alert(`
Phím tắt:
- Ctrl/Cmd + K: Tìm kiếm
- Ctrl/Cmd + /: Hiện trợ giúp phím tắt
- Tab: Di chuyển giữa các liên kết
- Esc: Đóng hộp thoại
    `.trim());
  }

  // ============================================
  // Service Worker Registration (PWA)
  // ============================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registered:', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  }

  // ============================================
  // Initialize All Features
  // ============================================
  function initialize() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
      return;
    }

    // Initialize all features
    try {
      initializeCookieConsent();
      initializeLazyLoading();
      initializeReadingProgress();
      initializeSkipToContent();
      initializeExternalLinks();
      initializeCopyCodeButtons();
      initializeResourcePreloading();
      initializeKeyboardShortcuts();
      registerServiceWorker();
      // initializeTableOfContents(); // Commented out as mdBook has its own TOC
    } catch (error) {
      console.error('Error initializing custom scripts:', error);
    }
  }

  // Start initialization
  initialize();

})();
