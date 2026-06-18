/**
 * BOUN GPA Calculator — Application State & DOM Elements
 *
 * Central state object and DOM element references.
 * ES modules are deferred, so document.getElementById() works at module load time.
 */

// ============================================
// Application State
// ============================================
export const state = {
    currentView: 'dashboard',
    courses: [],
    previousGPA: 0,
    previousCredits: 0,
    semester: '',        // ID of the currently active semester (synced to semesterSelect.value)
    semesters: {},
    charts: {},
    // Base values: the semester user started with and their cumulative GPA/credits before that
    baseSemester: null,  // The first semester user started using the app
    baseGPA: 0,          // Cumulative GPA before baseSemester
    baseCredits: 0,      // Total credits before baseSemester
    achievements: {},    // Unlocked achievements
    scenarios: [],       // Simulation scenarios
    // Last calculated values (single source of truth for GPA-related views)
    lastCalculatedGPA: 0,
    lastCalculatedSemesterGPA: 0,
    lastCalculatedCreditsForGPA: 0,
    lastCalculatedTotalCredits: 0
};

// ============================================
// View Initialization Flags
// ============================================
export const viewInitFlags = {
    simulation: false,
    graduation: false
};

// ============================================
// DOM Elements
// ============================================
export const elements = {
    // Navigation
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    navItems: document.querySelectorAll('.nav-item[data-view]'),
    pageTitle: document.getElementById('pageTitle'),

    // Views
    views: document.querySelectorAll('.view'),

    // Dashboard
    dashboardGPA: document.getElementById('dashboardGPA'),
    dashboardSemesterGPA: document.getElementById('dashboardSemesterGPA'),
    dashboardCredits: document.getElementById('dashboardCredits'),
    dashboardSemester: document.getElementById('dashboardSemester'),

    // Calculator
    courseList: document.getElementById('courseList'),
    addCourseBtn: document.getElementById('addCourse'),
    previousGPAInput: document.getElementById('previousGPA'),
    previousCreditsInput: document.getElementById('previousCredits'),
    semesterSelect: document.getElementById('semesterSelect'),
    semesterNotesInput: document.getElementById('semesterNotes'),
    autoSaveIndicator: document.getElementById('autoSaveIndicator'),
    resultsGrid: document.getElementById('resultsGrid'),
    emptyCoursesState: document.getElementById('emptyCoursesState'),
    semesterGPA: document.getElementById('semesterGPA'),
    gpa: document.getElementById('gpa'),
    totalCredits: document.getElementById('totalCredits'),

    // Templates
    templatesModal: document.getElementById('templatesModal'),
    openTemplatesBtn: document.getElementById('openTemplatesBtn'),
    closeTemplatesModal: document.getElementById('closeTemplatesModal'),
    templateList: document.getElementById('templateList'),
    templateSearch: document.getElementById('templateSearch'),

    // Goal Calculator
    goalCurrentGPA: document.getElementById('goalCurrentGPA'),
    goalCurrentCredits: document.getElementById('goalCurrentCredits'),
    goalTargetGPA: document.getElementById('goalTargetGPA'),
    goalPlannedCredits: document.getElementById('goalPlannedCredits'),
    calculateGoalBtn: document.getElementById('calculateGoalBtn'),
    goalResultSection: document.getElementById('goalResultSection'),
    goalResultIcon: document.getElementById('goalResultIcon'),
    goalResultValue: document.getElementById('goalResultValue'),
    goalResultDesc: document.getElementById('goalResultDesc'),
    goalProgressBar: document.getElementById('goalProgressBar'),
    goalProgressFill: document.getElementById('goalProgressFill'),

    // History
    semesterTabs: document.getElementById('semesterTabs'),
    semesterContent: document.getElementById('semesterContent'),
    addSemesterBtn: document.getElementById('addSemesterBtn'),
    emptySemesterState: document.getElementById('emptySemesterState'),

    // Charts
    gradeDistributionChart: document.getElementById('gradeDistributionChart'),
    gpaTrendChart: document.getElementById('gpaTrendChart'),
    creditDistributionChart: document.getElementById('creditDistributionChart'),

    // Export
    exportPNG: document.getElementById('exportPNG'),
    exportPDF: document.getElementById('exportPDF'),
    exportShare: document.getElementById('exportShare'),
    exportPreview: document.getElementById('exportPreview'),
    exportSemesterGPA: document.getElementById('exportSemesterGPA'),
    exportGPA: document.getElementById('exportGPA'),
    exportCredits: document.getElementById('exportCredits'),

    // Theme
    themeToggle: document.getElementById('themeToggle'),

    // Help
    helpBtn: document.getElementById('helpBtn'),
    helpModal: document.getElementById('helpModal'),

    // Clear Data
    clearDataBtn: document.getElementById('clearDataBtn'),
};
