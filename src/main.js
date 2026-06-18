/**
 * BOUN GPA Calculator — Application Entry Point
 *
 * Imports the UI module (which pulls in state, i18n, grades, gpa)
 * and the side-effect modules (charts, features) that register
 * their view-init and view-refresh callbacks.
 *
 * ES modules are deferred by default, so the DOM is parsed before
 * this module executes. The readyState guard handles edge cases.
 */

import { init } from './ui.js';
import './charts.js';   // side-effect: registers 'charts' view init + refresh
import './features.js'; // side-effect: registers view inits + refreshes + event bindings

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
