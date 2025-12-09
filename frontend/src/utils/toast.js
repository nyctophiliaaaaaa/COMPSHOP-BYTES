

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success', 'error', 'warning', 'info' (default: 'info')
 * @param {number} duration - Duration in ms (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  const timeoutId = setTimeout(() => removeToast(toast), duration);
  
  toast.dataset.timeoutId = timeoutId;
}

function removeToast(toast) {
  if (toast.dataset.timeoutId) {
    clearTimeout(parseInt(toast.dataset.timeoutId));
  }
  
  toast.classList.remove('toast-show');
  toast.classList.add('toast-hide');
  
  setTimeout(() => {
    toast.remove();
    const container = document.querySelector('.toast-container');
    if (container && container.children.length === 0) {
      container.remove();
    }
  }, 300);
}

/**
 * Show a confirm dialog (replaces native confirm())
 * @param {string} message - The message to display
 * @param {Object} options - Optional settings
 * @returns {Promise<boolean>} - Resolves true if confirmed, false if cancelled
 */
export function showConfirm(message, options = {}) {
  const {
    title = 'Confirm',
    confirmText = 'Yes',
    cancelText = 'Cancel',
    type = 'warning' 
  } = options;

  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    const colors = {
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6'
    };
    
    const iconColor = colors[type] || colors.warning;
    
    const icons = {
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`,
      danger: `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>`
    };

    overlay.innerHTML = `
      <div class="confirm-modal">
        <div class="confirm-icon">${icons[type] || icons.warning}</div>
        <h3 class="confirm-title">${title}</h3>
        <p class="confirm-message">${message}</p>
        <div class="confirm-actions">
          <button class="confirm-btn confirm-btn-cancel">${cancelText}</button>
          <button class="confirm-btn confirm-btn-confirm confirm-btn-${type}">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add('confirm-show');
    });

    const confirmBtn = overlay.querySelector('.confirm-btn-confirm');
    const cancelBtn = overlay.querySelector('.confirm-btn-cancel');

    const close = (result) => {
      overlay.classList.remove('confirm-show');
      overlay.classList.add('confirm-hide');
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 200);
    };

    confirmBtn.addEventListener('click', () => close(true));
    cancelBtn.addEventListener('click', () => close(false));
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(false);
    });
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', handleEscape);
        close(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  warning: (message, duration) => showToast(message, 'warning', duration),
  info: (message, duration) => showToast(message, 'info', duration)
};

export const confirm = showConfirm;

export default toast;
