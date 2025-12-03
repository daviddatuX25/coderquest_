/**
 * Logger Utility - Central logging with environment control
 * Consolidates console.log calls for easier management and performance
 */

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const DEBUG_ENABLED = IS_DEVELOPMENT || localStorage.getItem('DEBUG_MODE') === 'true';

export const Logger = {
  /**
   * Log only in development mode
   */
  debug: (message, data = null) => {
    if (DEBUG_ENABLED) {
      console.log(message, data || '');
    }
  },

  /**
   * Log warnings always
   */
  warn: (message, data = null) => {
    console.warn(message, data || '');
  },

  /**
   * Log errors always
   */
  error: (message, data = null) => {
    console.error(message, data || '');
  },

  /**
   * Disable debug logging (for production builds)
   */
  disable: () => {
    localStorage.removeItem('DEBUG_MODE');
  },

  /**
   * Enable debug logging
   */
  enable: () => {
    localStorage.setItem('DEBUG_MODE', 'true');
  }
};
