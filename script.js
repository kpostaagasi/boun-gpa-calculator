/**
 * BOUN GPA Calculator - Modern Version
 * Complete rewrite with new features
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // Internationalization (i18n)
    // ============================================
    const translations = {
        tr: {
            // Navigation
            'nav.menu': 'Menü',
            'nav.dashboard': 'Dashboard',
            'nav.calculator': 'Hesaplayıcı',
            'nav.goal': 'Hedef GPA',
            'nav.history': 'Geçmiş',
            'nav.statistics': 'İstatistikler',
            'nav.tools': 'Araçlar',
            'nav.export': 'Dışa Aktar',
            'nav.help': 'Yardım',
            'nav.clearData': 'Verileri Temizle',
            
            // Dashboard
            'dashboard.gpa': 'Genel Ortalama',
            'dashboard.semesterGpa': 'Dönem Ortalaması',
            'dashboard.totalCredits': 'Toplam Kredi',
            'dashboard.activeSemester': 'Aktif Dönem',
            'dashboard.quickStart': 'Hızlı Başlangıç',
            'dashboard.quickStartDesc': 'GPA hesaplamaya başlamak için bir seçenek seçin',
            'dashboard.addCourse': 'Ders Ekle',
            'dashboard.addCourseDesc': 'Manuel olarak ders ekleyerek başla',
            'dashboard.templates': 'Şablonlar',
            'dashboard.templatesDesc': 'Hazır ders şablonlarından seç',
            'dashboard.setGoal': 'Hedef Belirle',
            'dashboard.setGoalDesc': 'İstediğin GPA\'ya nasıl ulaşırsın?',
            
            // Calculator
            'calc.previousInfo': 'Önceki Dönem Bilgileri',
            'calc.previousInfoDesc': 'Varsa önceki dönemlerden gelen bilgilerinizi girin',
            'calc.previousGpa': 'Önceki GPA',
            'calc.previousCredits': 'Önceki Toplam Kredi',
            'calc.selectSemester': 'Dönem Seçimi',
            'calc.selectSemesterPlaceholder': 'Dönem Seçin',
            'calc.courses': 'Dersler',
            'calc.coursesDesc': 'Bu dönem aldığınız dersleri ekleyin',
            'calc.addCourse': 'Ders Ekle',
            'calc.noCourses': 'Henüz ders eklenmedi',
            'calc.noCoursesDesc': 'GPA hesaplamaya başlamak için "Ders Ekle" butonuna tıklayın veya şablonlardan seçin.',
            'calc.semesterGpa': 'Dönem Ortalaması',
            'calc.overallGpa': 'Genel Ortalama',
            'calc.totalCredits': 'Toplam Kredi',
            'calc.courseName': 'Ders Adı',
            'calc.isRetake': 'Tekrar mı?',
            'calc.previousGrade': 'Önceki Not',
            'calc.credit': 'Kredi',
            'calc.grade': 'Not',
            
            // Semesters
            'semester.fall': 'Güz',
            'semester.spring': 'Bahar',
            'semester.format': '{n}. Dönem',
            'semester.formatWithSeason': '{n}. Dönem ({season})',
            
            // Goal Calculator
            'goal.title': 'Hedef GPA Hesaplayıcı',
            'goal.desc': 'İstediğiniz GPA\'ya ulaşmak için gereken notu hesaplayın',
            'goal.currentGpa': 'Mevcut GPA',
            'goal.currentCredits': 'Mevcut Toplam Kredi',
            'goal.targetGpa': 'Hedef GPA',
            'goal.plannedCredits': 'Alınacak Kredi',
            'goal.calculate': 'Hesapla',
            'goal.requiredGrade': 'Gereken Ortalama Not',
            'goal.enterInfo': 'Hesaplamak için bilgileri girin',
            'goal.enterCredits': 'Alınacak krediyi girin',
            'goal.enterTargetGpa': 'Hedef GPA girin',
            'goal.impossible': 'Bu hedefe ulaşmak için {credits} kredide {gpa} ortalama gerekiyor. Mümkün değil (max 4.00).',
            'goal.alreadyAchieved': 'Şu anki ortalamanız zaten hedefinizin üzerinde! Tebrikler 🎉',
            'goal.difficult': 'Hedefinize ulaşmak için {credits} kredide {grade} veya üstü almalısınız. Zor ama imkansız değil!',
            'goal.achievable': 'Hedefinize ulaşmak için {credits} kredide {grade} veya üstü almanız yeterli.',
            
            // History
            'history.title': 'Dönem Geçmişi',
            'history.desc': 'Geçmiş dönemlerinizi görüntüleyin',
            'history.newSemester': 'Yeni Dönem',
            'history.noRecords': 'Dönem kaydı bulunamadı',
            'history.noRecordsDesc': 'Hesaplayıcıdan ders ekleyip kaydettiğinizde dönemler burada görünecektir.',
            'history.semesterGpa': 'Dönem Ortalaması',
            'history.semesterCredits': 'Dönem Kredisi',
            'history.courseCount': 'Ders Sayısı',
            'history.course': 'Ders',
            'history.unnamed': 'İsimsiz Ders',
            
            // Charts
            'charts.gradeDistribution': 'Not Dağılımı (Genel & Dönem)',
            'charts.gpaTrend': 'GPA & SPA Trendi',
            'charts.creditDistribution': 'Kredi Dağılımı',
            'charts.overall': 'Genel (Tüm Dönemler)',
            'charts.thisSemester': 'Bu Dönem',
            'charts.gpaCumulative': 'GPA (Kümülatif)',
            'charts.spaSemester': 'SPA (Dönemlik)',
            'charts.credits': 'Kredi',
            
            // Export
            'export.title': 'Dışa Aktar',
            'export.desc': 'Verilerinizi farklı formatlarda kaydedin veya paylaşın',
            'export.png': 'PNG Görsel',
            'export.pngDesc': 'Sonuçlarınızı görsel olarak kaydedin',
            'export.pdf': 'PDF Yazdır',
            'export.pdfDesc': 'Yazdırmaya hazır PDF oluşturun',
            'export.share': 'Paylaş',
            'export.shareDesc': 'Sosyal medyada paylaşın',
            'export.preview': 'Önizleme',
            'export.copied': 'Sonuçlar panoya kopyalandı!',
            
            // Templates Modal
            'templates.title': 'Ders Şablonları',
            'templates.search': 'Ders ara...',
            'templates.notFound': 'Ders bulunamadı',
            'templates.credit': 'Kredi',
            
            // Template Categories
            'templates.cat.cmpe': 'Bilgisayar Mühendisliği',
            'templates.cat.math': 'Matematik',
            'templates.cat.phys': 'Fizik',
            'templates.cat.eng': 'İngilizce',
            'templates.cat.turk': 'Türkçe ve Tarih',
            'templates.cat.econ': 'Ekonomi ve İşletme',
            'templates.cat.ee': 'Elektrik-Elektronik',
            
            // Help Modal
            'help.title': 'Nasıl Kullanılır?',
            'help.dashboard': 'Dashboard',
            'help.dashboardDesc': 'Ana sayfada genel istatistiklerinizi görüntüleyebilir ve hızlıca işlem yapabilirsiniz.',
            'help.calculator': 'Hesaplayıcı',
            'help.calculatorDesc': 'Önceki GPA ve kredi bilgilerinizi girin, ardından bu dönem aldığınız dersleri ekleyin. Her ders için:',
            'help.calculatorList1': 'Ders adını girin (isteğe bağlı)',
            'help.calculatorList2': 'Dersin kredisini seçin',
            'help.calculatorList3': 'Aldığınız notu seçin',
            'help.retake': 'Tekrar Ders',
            'help.retakeDesc': 'Daha önce FF, DD veya DC aldığınız bir dersi tekrar alıyorsanız "Tekrar mı?" kutucuğunu işaretleyin ve önceki notunuzu seçin.',
            'help.goal': 'Hedef GPA',
            'help.goalDesc': 'İstediğiniz GPA\'ya ulaşmak için hangi notları almanız gerektiğini hesaplayın.',
            'help.templates': 'Ders Şablonları',
            'help.templatesDesc': 'BOUN\'da sık alınan dersler için hazır şablonları kullanarak hızlıca ders ekleyebilirsiniz.',
            'help.statistics': 'İstatistikler',
            'help.statisticsDesc': 'Not dağılımınızı ve GPA trendinizi grafiklerle görüntüleyin.',
            'help.export': 'Dışa Aktarma',
            'help.exportDesc': 'Sonuçlarınızı PNG görsel veya PDF olarak kaydedin, sosyal medyada paylaşın.',
            
            // Alerts
            'alert.clearConfirm': 'Tüm kaydedilmiş verileri silmek istediğinize emin misiniz?',
            'alert.exportError': 'Dışa aktarma sırasında bir hata oluştu.',
            
            // Theme & Language
            'theme.toggle': 'Tema Değiştir',
            'lang.toggle': 'Dil Değiştir',
            
            // Misc
            'misc.delete': 'Sil',
            'misc.noCourseRecords': 'Bu dönemde ders kaydı yok.',
        },
        en: {
            // Navigation
            'nav.menu': 'Menu',
            'nav.dashboard': 'Dashboard',
            'nav.calculator': 'Calculator',
            'nav.goal': 'Goal GPA',
            'nav.history': 'History',
            'nav.statistics': 'Statistics',
            'nav.tools': 'Tools',
            'nav.export': 'Export',
            'nav.help': 'Help',
            'nav.clearData': 'Clear Data',
            
            // Dashboard
            'dashboard.gpa': 'Overall GPA',
            'dashboard.semesterGpa': 'Semester GPA',
            'dashboard.totalCredits': 'Total Credits',
            'dashboard.activeSemester': 'Active Semester',
            'dashboard.quickStart': 'Quick Start',
            'dashboard.quickStartDesc': 'Choose an option to start calculating your GPA',
            'dashboard.addCourse': 'Add Course',
            'dashboard.addCourseDesc': 'Start by adding courses manually',
            'dashboard.templates': 'Templates',
            'dashboard.templatesDesc': 'Choose from ready-made course templates',
            'dashboard.setGoal': 'Set Goal',
            'dashboard.setGoalDesc': 'How can you reach your target GPA?',
            
            // Calculator
            'calc.previousInfo': 'Previous Semester Info',
            'calc.previousInfoDesc': 'Enter your cumulative information from previous semesters if applicable',
            'calc.previousGpa': 'Previous GPA',
            'calc.previousCredits': 'Previous Total Credits',
            'calc.selectSemester': 'Semester Selection',
            'calc.selectSemesterPlaceholder': 'Select Semester',
            'calc.courses': 'Courses',
            'calc.coursesDesc': 'Add the courses you are taking this semester',
            'calc.addCourse': 'Add Course',
            'calc.noCourses': 'No courses added yet',
            'calc.noCoursesDesc': 'Click "Add Course" button to start calculating your GPA or select from templates.',
            'calc.semesterGpa': 'Semester GPA',
            'calc.overallGpa': 'Overall GPA',
            'calc.totalCredits': 'Total Credits',
            'calc.courseName': 'Course Name',
            'calc.isRetake': 'Retake?',
            'calc.previousGrade': 'Previous Grade',
            'calc.credit': 'Credits',
            'calc.grade': 'Grade',
            
            // Semesters
            'semester.fall': 'Fall',
            'semester.spring': 'Spring',
            'semester.format': 'Semester {n}',
            'semester.formatWithSeason': 'Semester {n} ({season})',
            
            // Goal Calculator
            'goal.title': 'Goal GPA Calculator',
            'goal.desc': 'Calculate the grade you need to reach your target GPA',
            'goal.currentGpa': 'Current GPA',
            'goal.currentCredits': 'Current Total Credits',
            'goal.targetGpa': 'Target GPA',
            'goal.plannedCredits': 'Planned Credits',
            'goal.calculate': 'Calculate',
            'goal.requiredGrade': 'Required Average Grade',
            'goal.enterInfo': 'Enter information to calculate',
            'goal.enterCredits': 'Enter planned credits',
            'goal.enterTargetGpa': 'Enter target GPA',
            'goal.impossible': 'To reach this goal, you need {gpa} average in {credits} credits. Not possible (max 4.00).',
            'goal.alreadyAchieved': 'Your current GPA is already above your target! Congratulations 🎉',
            'goal.difficult': 'To reach your goal, you need {grade} or higher in {credits} credits. Difficult but not impossible!',
            'goal.achievable': 'To reach your goal, getting {grade} or higher in {credits} credits is sufficient.',
            
            // History
            'history.title': 'Semester History',
            'history.desc': 'View your past semesters',
            'history.newSemester': 'New Semester',
            'history.noRecords': 'No semester records found',
            'history.noRecordsDesc': 'Semesters will appear here when you add and save courses from the calculator.',
            'history.semesterGpa': 'Semester GPA',
            'history.semesterCredits': 'Semester Credits',
            'history.courseCount': 'Course Count',
            'history.course': 'Course',
            'history.unnamed': 'Unnamed Course',
            
            // Charts
            'charts.gradeDistribution': 'Grade Distribution (Overall & Semester)',
            'charts.gpaTrend': 'GPA & SPA Trend',
            'charts.creditDistribution': 'Credit Distribution',
            'charts.overall': 'Overall (All Semesters)',
            'charts.thisSemester': 'This Semester',
            'charts.gpaCumulative': 'GPA (Cumulative)',
            'charts.spaSemester': 'SPA (Semester)',
            'charts.credits': 'Credits',
            
            // Export
            'export.title': 'Export',
            'export.desc': 'Save or share your data in different formats',
            'export.png': 'PNG Image',
            'export.pngDesc': 'Save your results as an image',
            'export.pdf': 'Print PDF',
            'export.pdfDesc': 'Create a print-ready PDF',
            'export.share': 'Share',
            'export.shareDesc': 'Share on social media',
            'export.preview': 'Preview',
            'export.copied': 'Results copied to clipboard!',
            
            // Templates Modal
            'templates.title': 'Course Templates',
            'templates.search': 'Search courses...',
            'templates.notFound': 'No courses found',
            'templates.credit': 'Credits',
            
            // Template Categories
            'templates.cat.cmpe': 'Computer Engineering',
            'templates.cat.math': 'Mathematics',
            'templates.cat.phys': 'Physics',
            'templates.cat.eng': 'English',
            'templates.cat.turk': 'Turkish and History',
            'templates.cat.econ': 'Economics and Business',
            'templates.cat.ee': 'Electrical-Electronics',
            
            // Help Modal
            'help.title': 'How to Use?',
            'help.dashboard': 'Dashboard',
            'help.dashboardDesc': 'View your overall statistics and quickly perform actions from the main page.',
            'help.calculator': 'Calculator',
            'help.calculatorDesc': 'Enter your previous GPA and credits, then add your courses for this semester. For each course:',
            'help.calculatorList1': 'Enter the course name (optional)',
            'help.calculatorList2': 'Select the course credits',
            'help.calculatorList3': 'Select the grade you received',
            'help.retake': 'Retake Course',
            'help.retakeDesc': 'If you are retaking a course you previously got FF, DD, or DC in, check the "Retake?" box and select your previous grade.',
            'help.goal': 'Goal GPA',
            'help.goalDesc': 'Calculate what grades you need to reach your desired GPA.',
            'help.templates': 'Course Templates',
            'help.templatesDesc': 'Use ready-made templates for commonly taken courses at BOUN to quickly add courses.',
            'help.statistics': 'Statistics',
            'help.statisticsDesc': 'View your grade distribution and GPA trend with charts.',
            'help.export': 'Export',
            'help.exportDesc': 'Save your results as PNG image or PDF, share on social media.',
            
            // Alerts
            'alert.clearConfirm': 'Are you sure you want to delete all saved data?',
            'alert.exportError': 'An error occurred during export.',
            
            // Theme & Language
            'theme.toggle': 'Toggle Theme',
            'lang.toggle': 'Change Language',
            
            // Misc
            'misc.delete': 'Delete',
            'misc.noCourseRecords': 'No course records for this semester.',
        }
    };

    // Current language state
    let currentLanguage = localStorage.getItem('language') || 'tr';

    // Translation helper function
    function t(key, params = {}) {
        let text = translations[currentLanguage][key] || translations['tr'][key] || key;
        // Replace placeholders like {credits}, {gpa}, etc.
        Object.entries(params).forEach(([param, value]) => {
            text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
        });
        return text;
    }

    // Apply translations to all elements with data-i18n attribute
    function translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = t(key);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = currentLanguage;
        
        // Update dynamic content
        updateDynamicTranslations();
    }

    // Update dynamic content that can't use data-i18n
    function updateDynamicTranslations() {
        // Update view titles
        if (elements.pageTitle) {
            const currentView = state.currentView;
            elements.pageTitle.textContent = viewTitles[currentView] || 'Dashboard';
        }
        
        // Update semester options
        const semesterSelect = elements.semesterSelect;
        if (semesterSelect) {
            const currentValue = semesterSelect.value;
            const options = semesterSelect.querySelectorAll('option');
            options.forEach((option, index) => {
                if (index === 0) {
                    option.textContent = t('calc.selectSemesterPlaceholder');
                } else {
                    const semNum = option.value;
                    const season = semNum % 2 === 1 ? t('semester.fall') : t('semester.spring');
                    option.textContent = t('semester.formatWithSeason', { n: semNum, season });
                }
            });
            semesterSelect.value = currentValue;
        }
        
        // Update dashboard semester display
        const semesterValue = elements.semesterSelect?.value;
        if (elements.dashboardSemester) {
            elements.dashboardSemester.textContent = semesterValue ? t('semester.format', { n: semesterValue }) : '-';
        }
        
        // Reinitialize charts with new labels if on charts view
        if (state.currentView === 'charts') {
            initializeCharts();
        }
        
        // Update semester history if on history view
        if (state.currentView === 'history') {
            renderSemesterHistory();
        }
    }

    // Set language and persist
    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        translatePage();
        updateLangToggle();
    }

    // Toggle between languages
    function toggleLanguage() {
        const newLang = currentLanguage === 'tr' ? 'en' : 'tr';
        setLanguage(newLang);
    }

    // Update language toggle button appearance
    function updateLangToggle() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            const flag = langToggle.querySelector('.lang-flag');
            const code = langToggle.querySelector('.lang-code');
            if (flag) flag.textContent = currentLanguage === 'tr' ? '🇹🇷' : '🇬🇧';
            if (code) code.textContent = currentLanguage.toUpperCase();
        }
    }

    // ============================================
    // Grade System Configuration
    // ============================================
    const gradePoints = {
        'AA': 4.0,
        'BA': 3.5,
        'BB': 3.0,
        'CB': 2.5,
        'CC': 2.0,
        'DC': 1.5,
        'DD': 1.0,
        'FF': 0.0
    };

    const retakeableGrades = ['FF', 'DD', 'DC'];

    // HTML escape utility to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // Course Templates
    // ============================================
    // Template categories use translation keys
    const courseTemplatesData = {
        'cmpe': [
            { code: 'CMPE 150', name: 'Introduction to Computing', credit: 4 },
            { code: 'CMPE 160', name: 'Introduction to OOP', credit: 4 },
            { code: 'CMPE 220', name: 'Discrete Computational Structures', credit: 4 },
            { code: 'CMPE 230', name: 'Systems Programming', credit: 4 },
            { code: 'CMPE 240', name: 'Digital Systems', credit: 4 },
            { code: 'CMPE 250', name: 'Data Structures and Algorithms', credit: 4 },
            { code: 'CMPE 300', name: 'Analysis of Algorithms', credit: 4 },
            { code: 'CMPE 322', name: 'Operating Systems', credit: 4 },
            { code: 'CMPE 343', name: 'Introduction to Probability', credit: 4 },
            { code: 'CMPE 344', name: 'Computer Organization', credit: 4 },
            { code: 'CMPE 350', name: 'Formal Languages and Automata Theory', credit: 3 },
            { code: 'CMPE 352', name: 'Fundamentals of Software Engineering', credit: 3 },
        ],
        'math': [
            { code: 'MATH 101', name: 'Calculus I', credit: 4 },
            { code: 'MATH 102', name: 'Calculus II', credit: 4 },
            { code: 'MATH 201', name: 'Matrix Theory', credit: 4 },
            { code: 'MATH 202', name: 'Differential Equations', credit: 4 },
            { code: 'MATH 203', name: 'Linear Algebra', credit: 4 },
        ],
        'phys': [
            { code: 'PHYS 101', name: 'General Physics I', credit: 4 },
            { code: 'PHYS 102', name: 'General Physics II', credit: 4 },
            { code: 'PHYS 130', name: 'General Physics Lab', credit: 2 },
        ],
        'eng': [
            { code: 'ENG 101', name: 'Academic Writing I', credit: 3 },
            { code: 'ENG 102', name: 'Academic Writing II', credit: 3 },
            { code: 'ENG 201', name: 'Themes in Literature', credit: 3 },
        ],
        'turk': [
            { code: 'TK 101', name: 'Türkçe I', credit: 2 },
            { code: 'TK 102', name: 'Türkçe II', credit: 2 },
            { code: 'HTR 311', name: 'History of the Turkish Republic I', credit: 2 },
            { code: 'HTR 312', name: 'History of the Turkish Republic II', credit: 2 },
        ],
        'econ': [
            { code: 'EC 101', name: 'Principles of Economics I', credit: 3 },
            { code: 'EC 102', name: 'Principles of Economics II', credit: 3 },
            { code: 'AD 303', name: 'Principles of Management', credit: 3 },
        ],
        'ee': [
            { code: 'EE 210', name: 'Circuit Theory', credit: 4 },
            { code: 'EE 212', name: 'Electronics', credit: 4 },
            { code: 'EE 241', name: 'Signals and Systems', credit: 4 },
        ],
    };
    
    // Get course templates with translated category names
    function getCourseTemplates() {
        const templates = {};
        Object.entries(courseTemplatesData).forEach(([key, courses]) => {
            templates[t(`templates.cat.${key}`)] = courses;
        });
        return templates;
    }

    // ============================================
    // State Management
    // ============================================
    let state = {
        currentView: 'dashboard',
        courses: [],
        previousGPA: 0,
        previousCredits: 0,
        semester: '',
        semesters: {},
        currentSemesterId: null,
        charts: {},
        // Base values: the semester user started with and their cumulative GPA/credits before that
        baseSemester: null,  // The first semester user started using the app
        baseGPA: 0,          // Cumulative GPA before baseSemester
        baseCredits: 0       // Total credits before baseSemester
    };

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
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

    // ============================================
    // Navigation & Views
    // ============================================
    // View titles are now dynamic based on language
    const viewTitles = {
        get dashboard() { return t('nav.dashboard'); },
        get calculator() { return t('nav.calculator'); },
        get goal() { return t('nav.goal'); },
        get history() { return t('nav.history'); },
        get charts() { return t('nav.statistics'); },
        get export() { return t('nav.export'); }
    };

    function switchView(viewId) {
        // Update nav items
        elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewId);
        });
        
        // Update views
        elements.views.forEach(view => {
            view.classList.toggle('active', view.id === `${viewId}View`);
        });
        
        // Update title
        elements.pageTitle.textContent = viewTitles[viewId] || 'Dashboard';
        
        // Close mobile menu
        closeMobileMenu();
        
        // Update state
        state.currentView = viewId;
        
        // Initialize view-specific content
        if (viewId === 'charts') {
            initializeCharts();
        } else if (viewId === 'history') {
            renderSemesterHistory();
        } else if (viewId === 'goal') {
            syncGoalInputsFromCalculator();
        }
    }

    function initNavigation() {
        elements.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const viewId = item.dataset.view;
                if (viewId) {
                    switchView(viewId);
                }
            });
        });
        
        // Mobile menu
        elements.mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
        elements.sidebarOverlay?.addEventListener('click', closeMobileMenu);
        
        // Dashboard quick actions
        document.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', () => {
                const action = el.dataset.action;
                if (action === 'go-calculator') {
                    switchView('calculator');
                } else if (action === 'open-templates') {
                    switchView('calculator');
                    setTimeout(() => openTemplatesModal(), 300);
                } else if (action === 'go-goal') {
                    switchView('goal');
                }
            });
        });
    }

    function toggleMobileMenu() {
        elements.sidebar?.classList.toggle('open');
        elements.sidebarOverlay?.classList.toggle('active');
    }

    function closeMobileMenu() {
        elements.sidebar?.classList.remove('open');
        elements.sidebarOverlay?.classList.remove('active');
    }

    // ============================================
    // Theme Management
    // ============================================
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Reinitialize charts with new theme colors
        if (state.currentView === 'charts') {
            initializeCharts();
        }
    }

    function updateThemeIcon(theme) {
        const sunIcon = elements.themeToggle?.querySelector('.sun-icon');
        const moonIcon = elements.themeToggle?.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            sunIcon.style.display = theme === 'light' ? 'block' : 'none';
            moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
        }
    }

    // ============================================
    // Course Management
    // ============================================
    function createCourseEntry(courseData = {}) {
        const courseEntry = document.createElement('div');
        courseEntry.className = 'course-entry';
        
        // Escape course name for safe HTML attribute insertion
        const escapedName = escapeHtml(courseData.name || '').replace(/"/g, '&quot;');
        
        courseEntry.innerHTML = `
            <div class="course-name-group">
                <input type="text" placeholder="${t('calc.courseName')}" class="form-input course-name" value="${escapedName}" aria-label="${t('calc.courseName')}">
                <div class="course-retake-row">
                    <label class="retake-checkbox">
                        <input type="checkbox" class="is-retake" ${courseData.isRetake ? 'checked' : ''}>
                        <span>${t('calc.isRetake')}</span>
                    </label>
                    <select class="form-select retake-select previous-grade" style="display: ${courseData.isRetake ? 'block' : 'none'}; max-width: 140px;" aria-label="${t('calc.previousGrade')}">
                        <option value="" disabled ${!courseData.previousGrade ? 'selected' : ''}>${t('calc.previousGrade')}</option>
                        ${retakeableGrades.map(grade => 
                            `<option value="${grade}" ${courseData.previousGrade === grade ? 'selected' : ''}>${grade} (${gradePoints[grade]})</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <select class="form-select course-credit" aria-label="${t('calc.credit')}">
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(credit => 
                    `<option value="${credit}" ${(courseData.credit || 3) == credit ? 'selected' : ''}>${credit}</option>`
                ).join('')}
            </select>
            <select class="form-select course-grade" aria-label="${t('calc.grade')}">
                <option value="" disabled ${!courseData.grade ? 'selected' : ''}>${t('calc.grade')}</option>
                ${Object.entries(gradePoints).map(([grade, point]) => 
                    `<option value="${grade}" ${courseData.grade === grade ? 'selected' : ''}>${grade}</option>`
                ).join('')}
            </select>
            <button class="delete-course-btn" aria-label="${t('misc.delete')}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        addCourseEventListeners(courseEntry);
        return courseEntry;
    }

    function addCourseEventListeners(entry) {
        // All inputs trigger recalculation
        entry.querySelectorAll('select, input').forEach(el => {
            el.addEventListener('change', () => {
                calculateGPA();
                saveCourses();
            });
        });
        
        // Retake checkbox toggle
        const retakeCheckbox = entry.querySelector('.is-retake');
        const previousGradeSelect = entry.querySelector('.previous-grade');
        
        retakeCheckbox?.addEventListener('change', () => {
            previousGradeSelect.style.display = retakeCheckbox.checked ? 'block' : 'none';
            if (!retakeCheckbox.checked) {
                previousGradeSelect.value = '';
            }
            calculateGPA();
            saveCourses();
        });
        
        // Delete button
        entry.querySelector('.delete-course-btn')?.addEventListener('click', () => {
            entry.classList.add('removing');
            setTimeout(() => {
                entry.remove();
                calculateGPA();
                saveCourses();
                updateCoursesEmptyState();
            }, 150);
        });
    }

    function addCourse(courseData = {}) {
        const entry = createCourseEntry(courseData);
        elements.courseList.appendChild(entry);
        updateCoursesEmptyState();
        calculateGPA();
        
        // Focus on name input if empty
        if (!courseData.name) {
            entry.querySelector('.course-name')?.focus();
        }
    }

    function updateCoursesEmptyState() {
        const hasCourses = elements.courseList.children.length > 0;
        elements.emptyCoursesState.style.display = hasCourses ? 'none' : 'flex';
        elements.resultsGrid.style.display = hasCourses ? 'grid' : 'none';
    }

    // ============================================
    // GPA Calculation
    // ============================================
    function calculateGPA() {
        let semesterPoints = 0;
        let semesterCredits = 0;
        let retakeCredits = 0;
        let retakeOldPoints = 0;
        
        // Calculate current semester
        document.querySelectorAll('.course-entry').forEach(entry => {
            const credit = parseFloat(entry.querySelector('.course-credit').value);
            const grade = entry.querySelector('.course-grade').value;
            const isRetake = entry.querySelector('.is-retake').checked;
            const previousGrade = entry.querySelector('.previous-grade').value;
            
            if (credit && grade) {
                semesterPoints += credit * gradePoints[grade];
                semesterCredits += credit;
                
                if (isRetake && previousGrade) {
                    retakeCredits += credit;
                    retakeOldPoints += credit * gradePoints[previousGrade];
                }
            }
        });
        
        // Get previous values
        const previousGPA = parseFloat(elements.previousGPAInput.value) || 0;
        const previousCredits = parseFloat(elements.previousCreditsInput.value) || 0;
        const previousPoints = previousGPA * previousCredits;
        
        // Calculate semester GPA
        const semesterGPA = semesterCredits > 0 ? (semesterPoints / semesterCredits) : 0;
        
        // Calculate cumulative GPA (with retake adjustment)
        const adjustedPreviousCredits = Math.max(0, previousCredits - retakeCredits);
        const adjustedPreviousPoints = Math.max(0, previousPoints - retakeOldPoints);
        const totalCredits = semesterCredits + adjustedPreviousCredits;
        const totalPoints = semesterPoints + adjustedPreviousPoints;
        const cumulativeGPA = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
        
        // Update displays with animation
        animateValue(elements.semesterGPA, semesterGPA.toFixed(2));
        animateValue(elements.gpa, cumulativeGPA.toFixed(2));
        animateValue(elements.totalCredits, totalCredits);
        
        // Update dashboard
        animateValue(elements.dashboardSemesterGPA, semesterGPA.toFixed(2));
        animateValue(elements.dashboardGPA, cumulativeGPA.toFixed(2));
        animateValue(elements.dashboardCredits, totalCredits);
        
        // Update export preview
        if (elements.exportSemesterGPA) elements.exportSemesterGPA.textContent = semesterGPA.toFixed(2);
        if (elements.exportGPA) elements.exportGPA.textContent = cumulativeGPA.toFixed(2);
        if (elements.exportCredits) elements.exportCredits.textContent = totalCredits;
        
        // Update semester display
        const semesterValue = elements.semesterSelect.value;
        elements.dashboardSemester.textContent = semesterValue ? t('semester.format', { n: semesterValue }) : '-';
        
        // Color coding for GPA
        applyGPAColorCoding(elements.gpa, cumulativeGPA);
        applyGPAColorCoding(elements.semesterGPA, semesterGPA);
        
        // Store state
        state.previousGPA = previousGPA;
        state.previousCredits = previousCredits;
        state.semester = semesterValue;
        
        return { semesterGPA, cumulativeGPA, totalCredits };
    }

    function applyGPAColorCoding(element, gpa) {
        element.classList.remove('success', 'warning', 'danger');
        if (gpa >= 3.0) {
            element.classList.add('success');
        } else if (gpa >= 2.0) {
            element.classList.add('warning');
        } else if (gpa > 0) {
            element.classList.add('danger');
        }
    }

    function animateValue(element, newValue) {
        if (!element) return;
        
        const currentValue = element.textContent;
        if (currentValue !== String(newValue)) {
            element.classList.add('animate-count-up');
            element.textContent = newValue;
            setTimeout(() => element.classList.remove('animate-count-up'), 150);
        }
    }

    // ============================================
    // Templates
    // ============================================
    function renderTemplates(filter = '') {
        const filterLower = filter.toLowerCase();
        let html = '';
        const courseTemplates = getCourseTemplates();
        
        for (const [category, courses] of Object.entries(courseTemplates)) {
            const filteredCourses = courses.filter(c => 
                c.code.toLowerCase().includes(filterLower) ||
                c.name.toLowerCase().includes(filterLower) ||
                category.toLowerCase().includes(filterLower)
            );
            
            if (filteredCourses.length > 0) {
                html += `
                    <div class="template-category">
                        <div class="template-category-title">${category}</div>
                        ${filteredCourses.map(course => `
                            <div class="template-item" data-code="${course.code}" data-name="${course.name}" data-credit="${course.credit}">
                                <div class="template-item-info">
                                    <div class="template-item-name">${course.code}</div>
                                    <div class="template-item-meta">${course.name} • ${course.credit} ${t('templates.credit')}</div>
                                </div>
                                <button class="template-item-add">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
        
        elements.templateList.innerHTML = html || `<p style="text-align: center; color: var(--text-secondary);">${t('templates.notFound')}</p>`;
        
        // Add click handlers
        elements.templateList.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', () => {
                const code = item.dataset.code;
                const name = item.dataset.name;
                const credit = item.dataset.credit;
                
                addCourse({
                    name: `${code} - ${name}`,
                    credit: credit
                });
                
                closeTemplatesModal();
            });
        });
    }

    function openTemplatesModal() {
        elements.templatesModal.classList.add('active');
        renderTemplates();
        elements.templateSearch.value = '';
        elements.templateSearch.focus();
    }

    function closeTemplatesModal() {
        elements.templatesModal.classList.remove('active');
    }

    // ============================================
    // Goal Calculator
    // ============================================
    function calculateGoal() {
        const currentGPA = parseFloat(elements.goalCurrentGPA.value) || 0;
        const currentCredits = parseFloat(elements.goalCurrentCredits.value) || 0;
        const targetGPA = parseFloat(elements.goalTargetGPA.value) || 0;
        const plannedCredits = parseFloat(elements.goalPlannedCredits.value) || 0;
        
        if (plannedCredits <= 0) {
            showGoalResult('danger', '-', t('goal.enterCredits'));
            return;
        }
        
        if (targetGPA <= 0) {
            showGoalResult('danger', '-', t('goal.enterTargetGpa'));
            return;
        }
        
        // Calculate required GPA for planned credits
        // targetGPA = (currentGPA * currentCredits + requiredGPA * plannedCredits) / (currentCredits + plannedCredits)
        // requiredGPA = (targetGPA * (currentCredits + plannedCredits) - currentGPA * currentCredits) / plannedCredits
        
        const targetTotalPoints = targetGPA * (currentCredits + plannedCredits);
        const currentPoints = currentGPA * currentCredits;
        const requiredPoints = targetTotalPoints - currentPoints;
        const requiredGPA = requiredPoints / plannedCredits;
        
        let status, description;
        
        if (requiredGPA > 4.0) {
            status = 'danger';
            description = t('goal.impossible', { credits: plannedCredits, gpa: requiredGPA.toFixed(2) });
        } else if (requiredGPA < 0) {
            status = 'success';
            description = t('goal.alreadyAchieved');
        } else if (requiredGPA >= 3.5) {
            status = 'warning';
            description = t('goal.difficult', { credits: plannedCredits, grade: getGradeForGPA(requiredGPA) });
        } else {
            status = 'success';
            description = t('goal.achievable', { credits: plannedCredits, grade: getGradeForGPA(requiredGPA) });
        }
        
        const displayGPA = requiredGPA < 0 ? '✓' : requiredGPA > 4 ? '4.00+' : requiredGPA.toFixed(2);
        showGoalResult(status, displayGPA, description);
        
        // Progress bar (targetGPA is guaranteed > 0 from validation above)
        const progress = Math.min(100, Math.max(0, (currentGPA / targetGPA) * 100));
        elements.goalProgressBar.style.display = 'block';
        elements.goalProgressFill.style.width = `${progress}%`;
        elements.goalProgressFill.classList.remove('success', 'warning', 'danger');
        elements.goalProgressFill.classList.add(status);
    }

    function showGoalResult(status, value, description) {
        elements.goalResultIcon.classList.remove('success', 'warning', 'danger');
        elements.goalResultIcon.classList.add(status);
        elements.goalResultValue.textContent = value;
        elements.goalResultDesc.textContent = description;
    }

    function getGradeForGPA(gpa) {
        if (gpa >= 4.0) return 'AA (4.0)';
        if (gpa >= 3.5) return 'BA (3.5)';
        if (gpa >= 3.0) return 'BB (3.0)';
        if (gpa >= 2.5) return 'CB (2.5)';
        if (gpa >= 2.0) return 'CC (2.0)';
        if (gpa >= 1.5) return 'DC (1.5)';
        if (gpa >= 1.0) return 'DD (1.0)';
        return 'FF (0.0)';
    }

    function syncGoalInputsFromCalculator() {
        // Sync current values from calculator to goal inputs
        const { cumulativeGPA, totalCredits } = calculateGPA();
        elements.goalCurrentGPA.value = cumulativeGPA.toFixed(2);
        elements.goalCurrentCredits.value = totalCredits;
    }

    // ============================================
    // Charts
    // ============================================
    function initializeCharts() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#e2e8f0' : '#334155';
        const gridColor = isDark ? '#334155' : '#e2e8f0';
        
        // Destroy existing charts
        Object.values(state.charts).forEach(chart => chart?.destroy());
        state.charts = {};
        
        // Grade Distribution Chart (Current Semester vs Overall)
        if (elements.gradeDistributionChart) {
            const gradeData = getGradeDistributionData();
            
            // Color mapping for grades
            const gradeColors = {
                'AA': '#10b981', 'BA': '#34d399', 'BB': '#6ee7b7',
                'CB': '#fbbf24', 'CC': '#fcd34d',
                'DC': '#f97316', 'DD': '#fb923c',
                'FF': '#ef4444'
            };
            
            state.charts.gradeDistribution = new Chart(elements.gradeDistributionChart, {
                type: 'bar',
                data: {
                    labels: gradeData.labels,
                    datasets: [
                        {
                            label: t('charts.overall'),
                            data: gradeData.overallValues,
                            backgroundColor: gradeData.labels.map(g => gradeColors[g] || '#3b82f6'),
                            borderRadius: 6,
                            barPercentage: 0.8,
                            categoryPercentage: 0.7,
                        },
                        {
                            label: t('charts.thisSemester'),
                            data: gradeData.currentValues,
                            backgroundColor: gradeData.labels.map(g => {
                                const color = gradeColors[g] || '#3b82f6';
                                return color + '80'; // Add transparency
                            }),
                            borderColor: gradeData.labels.map(g => gradeColors[g] || '#3b82f6'),
                            borderWidth: 2,
                            borderRadius: 6,
                            barPercentage: 0.8,
                            categoryPercentage: 0.7,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { 
                                stepSize: 1,
                                color: textColor, 
                                font: { family: 'DM Sans' } 
                            },
                            grid: { color: gridColor }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: textColor, font: { family: 'DM Sans', weight: '600' } }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: { 
                                color: textColor, 
                                font: { family: 'DM Sans', size: 12 },
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    }
                }
            });
        }
        
        // GPA & SPA Trend Chart
        if (elements.gpaTrendChart) {
            const semesterData = getSemesterTrendData();
            state.charts.gpaTrend = new Chart(elements.gpaTrendChart, {
                type: 'line',
                data: {
                    labels: semesterData.labels,
                    datasets: [
                        {
                            label: t('charts.gpaCumulative'),
                            data: semesterData.gpaValues,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3,
                            pointBackgroundColor: '#3b82f6',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 5,
                        },
                        {
                            label: t('charts.spaSemester'),
                            data: semesterData.spaValues,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: false,
                            tension: 0.4,
                            borderWidth: 3,
                            borderDash: [5, 5],
                            pointBackgroundColor: '#10b981',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 5,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            min: 0,
                            max: 4,
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'DM Sans' } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: textColor, font: { family: 'DM Sans' } }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: textColor,
                                font: { family: 'DM Sans', size: 12 },
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    }
                }
            });
        }
        
        // Credit Distribution Chart
        if (elements.creditDistributionChart) {
            const creditData = getCreditDistribution();
            state.charts.creditDistribution = new Chart(elements.creditDistributionChart, {
                type: 'bar',
                data: {
                    labels: creditData.labels,
                    datasets: [{
                        label: t('charts.credits'),
                        data: creditData.values,
                        backgroundColor: '#3b82f6',
                        borderRadius: 6,
                        barThickness: 40,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'DM Sans' } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: textColor, font: { family: 'DM Sans' } }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }

    function getCoursesData() {
        const courses = [];
        document.querySelectorAll('.course-entry').forEach(entry => {
            const credit = parseFloat(entry.querySelector('.course-credit').value);
            const grade = entry.querySelector('.course-grade').value;
            if (credit && grade) {
                courses.push({ credit, grade });
            }
        });
        return courses;
    }

    function getGradeDistribution(courses) {
        const distribution = {};
        Object.keys(gradePoints).forEach(g => distribution[g] = 0);
        courses.forEach(c => {
            if (distribution.hasOwnProperty(c.grade)) {
                distribution[c.grade]++;
            }
        });
        // Remove zeros
        Object.keys(distribution).forEach(k => {
            if (distribution[k] === 0) delete distribution[k];
        });
        return distribution;
    }

    function getAllCoursesFromHistory() {
        const allCourses = [];
        Object.values(state.semesters).forEach(semester => {
            if (semester.courses) {
                semester.courses.forEach(course => {
                    allCourses.push(course);
                });
            }
        });
        return allCourses;
    }

    function getGradeDistributionData() {
        const grades = ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF'];
        
        // Current semester courses
        const currentCourses = getCoursesData();
        const currentDistribution = {};
        grades.forEach(g => currentDistribution[g] = 0);
        currentCourses.forEach(c => {
            if (currentDistribution.hasOwnProperty(c.grade)) {
                currentDistribution[c.grade]++;
            }
        });
        
        // All semesters courses (from history)
        const allCourses = getAllCoursesFromHistory();
        const overallDistribution = {};
        grades.forEach(g => overallDistribution[g] = 0);
        allCourses.forEach(c => {
            if (overallDistribution.hasOwnProperty(c.grade)) {
                overallDistribution[c.grade]++;
            }
        });
        
        // Only include grades that have at least one occurrence
        const activeGrades = grades.filter(g => 
            currentDistribution[g] > 0 || overallDistribution[g] > 0
        );
        
        return {
            labels: activeGrades,
            currentValues: activeGrades.map(g => currentDistribution[g]),
            overallValues: activeGrades.map(g => overallDistribution[g])
        };
    }

    function getSemesterTrendData() {
        // Use saved semesters if available, otherwise use current
        const semesters = Object.entries(state.semesters);
        
        if (semesters.length > 0) {
            // Sort semesters by number
            const sorted = semesters.sort((a, b) => {
                const numA = parseInt(a[0]) || 0;
                const numB = parseInt(b[0]) || 0;
                return numA - numB;
            });
            
            const labels = sorted.map(s => s[0]);
            const spaValues = sorted.map(s => s[1].gpa || 0); // Semester GPA
            
            // Calculate cumulative GPA for each semester
            let cumulativePoints = state.baseGPA * state.baseCredits;
            let cumulativeCredits = state.baseCredits;
            const gpaValues = sorted.map(s => {
                const semData = s[1];
                const semPoints = (semData.gpa || 0) * (semData.credits || 0);
                cumulativePoints += semPoints;
                cumulativeCredits += semData.credits || 0;
                return cumulativeCredits > 0 ? cumulativePoints / cumulativeCredits : 0;
            });
            
            return { labels, spaValues, gpaValues };
        }
        
        // Fallback to current semester
        const { semesterGPA, cumulativeGPA } = calculateGPA();
        const currentSem = elements.semesterSelect.value || '1';
        return {
            labels: [t('semester.format', { n: currentSem })],
            spaValues: [semesterGPA],
            gpaValues: [cumulativeGPA]
        };
    }

    function getCreditDistribution() {
        const courses = getCoursesData();
        const creditCounts = {};
        courses.forEach(c => {
            const key = `${c.credit} ${t('calc.credit')}`;
            creditCounts[key] = (creditCounts[key] || 0) + 1;
        });
        return {
            labels: Object.keys(creditCounts),
            values: Object.values(creditCounts)
        };
    }

    // ============================================
    // Export Functions
    // ============================================
    async function exportAsPNG() {
        try {
            const canvas = await html2canvas(elements.exportPreview, {
                backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1e293b' : '#ffffff',
                scale: 2
            });
            
            const link = document.createElement('a');
            link.download = `boun-gpa-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Export error:', error);
            alert(t('alert.exportError'));
        }
    }

    function exportAsPDF() {
        window.print();
    }

    async function shareResults() {
        const { cumulativeGPA, totalCredits } = calculateGPA();
        const gpaLabel = currentLanguage === 'tr' ? 'GPA\'m' : 'My GPA';
        const creditsLabel = t('calc.totalCredits');
        const shareData = {
            title: 'BOUN GPA Calculator',
            text: `${gpaLabel}: ${cumulativeGPA.toFixed(2)} | ${creditsLabel}: ${totalCredits}`,
            url: window.location.href
        };
        
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            const text = `${shareData.text}\n${shareData.url}`;
            await navigator.clipboard.writeText(text);
            alert(t('export.copied'));
        }
    }

    // ============================================
    // Semester History
    // ============================================
    function renderSemesterHistory() {
        const semesters = Object.entries(state.semesters);
        
        if (semesters.length === 0) {
            elements.emptySemesterState.style.display = 'flex';
            elements.semesterTabs.innerHTML = '';
            return;
        }
        
        elements.emptySemesterState.style.display = 'none';
        
        // Render tabs with translated semester names
        elements.semesterTabs.innerHTML = semesters.map(([id, sem], index) => `
            <button class="semester-tab ${index === 0 ? 'active' : ''}" data-semester-id="${id}">
                ${t('semester.format', { n: id })}
            </button>
        `).join('');
        
        // Tab click handlers
        elements.semesterTabs.querySelectorAll('.semester-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                elements.semesterTabs.querySelectorAll('.semester-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderSemesterContent(tab.dataset.semesterId);
            });
        });
        
        // Render first semester content
        if (semesters.length > 0) {
            renderSemesterContent(semesters[0][0]);
        }
    }

    function renderSemesterContent(semesterId) {
        const semester = state.semesters[semesterId];
        if (!semester) return;
        
        const content = `
            <div class="card" style="margin-top: var(--space-4);">
                <div class="results-grid" style="border: none; padding: 0; margin: 0 0 var(--space-6) 0;">
                    <div class="result-item">
                        <div class="result-label">${t('history.semesterGpa')}</div>
                        <div class="result-value">${semester.gpa?.toFixed(2) || '0.00'}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">${t('history.semesterCredits')}</div>
                        <div class="result-value">${semester.credits || 0}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">${t('history.courseCount')}</div>
                        <div class="result-value">${semester.courses?.length || 0}</div>
                    </div>
                </div>
                ${semester.courses?.length > 0 ? `
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <th style="text-align: left; padding: var(--space-3); color: var(--text-secondary); font-weight: 500;">${t('history.course')}</th>
                                <th style="text-align: center; padding: var(--space-3); color: var(--text-secondary); font-weight: 500;">${t('calc.credit')}</th>
                                <th style="text-align: center; padding: var(--space-3); color: var(--text-secondary); font-weight: 500;">${t('calc.grade')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${semester.courses.map(course => `
                                <tr style="border-bottom: 1px solid var(--border-color);">
                                    <td style="padding: var(--space-3);">${escapeHtml(course.name) || t('history.unnamed')}</td>
                                    <td style="text-align: center; padding: var(--space-3);">${escapeHtml(String(course.credit))}</td>
                                    <td style="text-align: center; padding: var(--space-3); font-weight: 600;">${escapeHtml(course.grade)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : `<p style="text-align: center; color: var(--text-secondary);">${t('misc.noCourseRecords')}</p>`}
            </div>
        `;
        
        elements.semesterContent.innerHTML = content;
    }

    function saveSemester() {
        const semesterValue = elements.semesterSelect.value;
        if (!semesterValue) return;
        
        // Use semester number as key (language-agnostic)
        const semesterId = semesterValue;
        const courses = [];
        let totalPoints = 0;
        let totalCredits = 0;
        
        document.querySelectorAll('.course-entry').forEach(entry => {
            const name = entry.querySelector('.course-name').value.trim();
            const credit = parseFloat(entry.querySelector('.course-credit').value);
            const grade = entry.querySelector('.course-grade').value;
            
            if (credit && grade) {
                courses.push({ name, credit, grade });
                totalPoints += credit * gradePoints[grade];
                totalCredits += credit;
            }
        });
        
        if (courses.length > 0) {
            // Save base semester info before first save
            saveBaseSemesterInfo();
            
            state.semesters[semesterId] = {
                courses,
                gpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
                credits: totalCredits
            };
            saveToLocalStorage();
        }
    }

    // Calculate cumulative GPA/credits from base + all saved semesters before current one
    function calculatePreviousSemestersStats(currentSemesterNum) {
        // Start with base values (semesters before user started using the app)
        let totalPoints = state.baseGPA * state.baseCredits;
        let totalCredits = state.baseCredits;
        
        // Add all saved semesters before current one
        Object.entries(state.semesters).forEach(([semesterId, semesterData]) => {
            // Extract semester number from id like "3. Dönem" -> 3
            const semNum = parseInt(semesterId);
            if (!isNaN(semNum) && semNum < currentSemesterNum) {
                totalPoints += (semesterData.gpa || 0) * (semesterData.credits || 0);
                totalCredits += semesterData.credits || 0;
            }
        });
        
        const cumulativeGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
        return { gpa: cumulativeGPA, credits: totalCredits };
    }

    // Update previous GPA/credits inputs from semester history (only if we have saved data)
    function updatePreviousFromHistory(currentSemesterNum) {
        // Check if we have any saved semesters before current one
        const hasPreviousSemesters = Object.keys(state.semesters).some(semesterId => {
            const semNum = parseInt(semesterId);
            return !isNaN(semNum) && semNum < currentSemesterNum;
        });
        
        // Only update if we have base data OR saved semester history
        // Otherwise keep user's manual input untouched
        if (state.baseSemester !== null || hasPreviousSemesters) {
            const stats = calculatePreviousSemestersStats(currentSemesterNum);
            // Always show calculated values if we have history (even if 0)
            elements.previousGPAInput.value = stats.credits > 0 ? stats.gpa.toFixed(2) : '';
            elements.previousCreditsInput.value = stats.credits > 0 ? stats.credits : '';
        }
        // If no history and no base, don't touch the fields - user may have entered values manually
    }

    // Save base semester info when user first enters data
    function saveBaseSemesterInfo() {
        const currentSemesterNum = parseInt(elements.semesterSelect.value) || 0;
        
        // Only set base if not already set and we have a semester selected
        if (state.baseSemester === null && currentSemesterNum > 0) {
            state.baseSemester = currentSemesterNum;
            state.baseGPA = parseFloat(elements.previousGPAInput.value) || 0;
            state.baseCredits = parseFloat(elements.previousCreditsInput.value) || 0;
        }
    }

    // ============================================
    // Data Persistence
    // ============================================
    function saveCourses() {
        const courses = [];
        document.querySelectorAll('.course-entry').forEach(entry => {
            const name = entry.querySelector('.course-name').value.trim();
            const credit = entry.querySelector('.course-credit').value;
            const grade = entry.querySelector('.course-grade').value;
            const isRetake = entry.querySelector('.is-retake').checked;
            const previousGrade = entry.querySelector('.previous-grade').value;
            
            if (credit && grade) {
                courses.push({ name, credit, grade, isRetake, previousGrade });
            }
        });
        
        state.courses = courses;
        saveSemester();
        saveToLocalStorage();
    }

    function saveToLocalStorage() {
        const saveData = {
            courses: state.courses,
            semester: elements.semesterSelect.value,
            previousGPA: elements.previousGPAInput.value,
            previousCredits: elements.previousCreditsInput.value,
            semesters: state.semesters,
            // Base semester info for cumulative calculation
            baseSemester: state.baseSemester,
            baseGPA: state.baseGPA,
            baseCredits: state.baseCredits
        };
        
        localStorage.setItem('gpaSaveData', JSON.stringify(saveData));
    }

    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('gpaSaveData');
        if (!savedData) return;
        
        try {
            const data = JSON.parse(savedData);
            
            // Load base semester info first
            if (data.baseSemester !== undefined) state.baseSemester = data.baseSemester;
            if (data.baseGPA !== undefined) state.baseGPA = data.baseGPA;
            if (data.baseCredits !== undefined) state.baseCredits = data.baseCredits;
            
            // Load semester and history
            if (data.semester) elements.semesterSelect.value = data.semester;
            if (data.semesters) state.semesters = data.semesters;
            
            // Load previous GPA/credits
            const currentSemesterNum = parseInt(data.semester) || 0;
            
            // If we have base info or saved semesters, calculate cumulative
            if (state.baseSemester !== null || Object.keys(state.semesters).length > 0) {
                updatePreviousFromHistory(currentSemesterNum);
            } else {
                // Fallback to saved values (for backward compatibility)
                if (data.previousGPA) elements.previousGPAInput.value = data.previousGPA;
                if (data.previousCredits) elements.previousCreditsInput.value = data.previousCredits;
            }
            
            // Load courses
            elements.courseList.innerHTML = '';
            if (data.courses && data.courses.length > 0) {
                data.courses.forEach(course => addCourse(course));
            }
            
            updateCoursesEmptyState();
            calculateGPA();
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    function clearAllData() {
        if (confirm(t('alert.clearConfirm'))) {
            localStorage.removeItem('gpaSaveData');
            location.reload();
        }
    }

    // ============================================
    // Help Modal
    // ============================================
    function initHelpModal() {
        const closeBtn = elements.helpModal?.querySelector('.close');
        
        elements.helpBtn?.addEventListener('click', () => {
            elements.helpModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn?.addEventListener('click', closeHelpModal);
        
        elements.helpModal?.addEventListener('click', (e) => {
            if (e.target === elements.helpModal) {
                closeHelpModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.helpModal?.classList.contains('active')) {
                closeHelpModal();
            }
        });
    }

    function closeHelpModal() {
        elements.helpModal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // Event Listeners Setup
    // ============================================
    function initEventListeners() {
        // Add course button
        elements.addCourseBtn?.addEventListener('click', () => addCourse());
        
        // Previous GPA/Credits inputs
        elements.previousGPAInput?.addEventListener('input', () => {
            let value = parseFloat(elements.previousGPAInput.value);
            if (value < 0) elements.previousGPAInput.value = 0;
            else if (value > 4) elements.previousGPAInput.value = 4;
            calculateGPA();
            saveCourses();
        });
        
        elements.previousCreditsInput?.addEventListener('input', () => {
            let value = parseInt(elements.previousCreditsInput.value);
            if (value < 0) elements.previousCreditsInput.value = 0;
            else if (value > 300) elements.previousCreditsInput.value = 300;
            calculateGPA();
            saveCourses();
        });
        
        elements.semesterSelect?.addEventListener('change', () => {
            // Clear existing courses when semester changes
            elements.courseList.innerHTML = '';
            addCourse(); // Add one empty course entry
            updateCoursesEmptyState();
            
            // Update previous GPA/credits from semester history
            const currentSemesterNum = parseInt(elements.semesterSelect.value) || 0;
            updatePreviousFromHistory(currentSemesterNum);
            
            calculateGPA();
            saveCourses();
        });
        
        // Templates
        elements.openTemplatesBtn?.addEventListener('click', openTemplatesModal);
        elements.closeTemplatesModal?.addEventListener('click', closeTemplatesModal);
        elements.templatesModal?.addEventListener('click', (e) => {
            if (e.target === elements.templatesModal) closeTemplatesModal();
        });
        elements.templateSearch?.addEventListener('input', (e) => renderTemplates(e.target.value));
        
        // Goal calculator
        elements.calculateGoalBtn?.addEventListener('click', calculateGoal);
        [elements.goalCurrentGPA, elements.goalCurrentCredits, elements.goalTargetGPA, elements.goalPlannedCredits].forEach(el => {
            el?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') calculateGoal();
            });
        });
        
        // Export
        elements.exportPNG?.addEventListener('click', exportAsPNG);
        elements.exportPDF?.addEventListener('click', exportAsPDF);
        elements.exportShare?.addEventListener('click', shareResults);
        
        // Theme
        elements.themeToggle?.addEventListener('click', toggleTheme);
        
        // Language toggle
        document.getElementById('langToggle')?.addEventListener('click', toggleLanguage);
        
        // Clear data
        elements.clearDataBtn?.addEventListener('click', clearAllData);
        
        // Add semester
        elements.addSemesterBtn?.addEventListener('click', () => {
            switchView('calculator');
        });
    }

    // ============================================
    // Initialization
    // ============================================
    function initLanguage() {
        currentLanguage = localStorage.getItem('language') || 'tr';
        translatePage();
        updateLangToggle();
    }

    function init() {
        initTheme();
        initLanguage();
        initNavigation();
        initEventListeners();
        initHelpModal();
        loadFromLocalStorage();
        updateCoursesEmptyState();
        calculateGPA();
    }

    init();
});
