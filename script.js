document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('courseList');
    const addCourseBtn = document.getElementById('addCourse');
    const gpaDisplay = document.getElementById('gpa');
    const semesterGPADisplay = document.getElementById('semesterGPA');
    const totalCreditsDisplay = document.getElementById('totalCredits');
    const previousGPAInput = document.getElementById('previousGPA');
    const previousCreditsInput = document.getElementById('previousCredits');
    const semesterSelect = document.getElementById('semesterSelect');
    const emptyState = document.getElementById('emptyState');

    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const shareBtn = document.getElementById('shareBtn');

    const calcTargetBtn = document.getElementById('calcTargetBtn');
    const targetGPAInput = document.getElementById('targetGPA');
    const targetResult = document.getElementById('targetResult');

    // Scale modal controls
    const scaleBtn = document.getElementById('scaleBtn');
    const scaleModal = document.getElementById('scaleModal');
    const scaleCloseBtn = scaleModal ? scaleModal.querySelector('.close') : null;
    const scaleInputs = {
        AA: document.getElementById('scaleAA'),
        BA: document.getElementById('scaleBA'),
        BB: document.getElementById('scaleBB'),
        CB: document.getElementById('scaleCB'),
        CC: document.getElementById('scaleCC'),
        DC: document.getElementById('scaleDC'),
        DD: document.getElementById('scaleDD'),
        FF: document.getElementById('scaleFF'),
    };
    const scaleSaveBtn = document.getElementById('scaleSaveBtn');
    const scaleResetBtn = document.getElementById('scaleResetBtn');

    let gradePoints = loadGradeScale();

    const specialGradeOptions = [
        { value: 'P', label: 'P (Geçti - kredi sayılır, puan yok)' },
        { value: 'S', label: 'S (Satisfactory - kredi sayılır, puan yok)' },
        { value: 'U', label: 'U (Unsatisfactory - kredi sayılır, puan yok)' },
        { value: 'W', label: 'W (Çekildi - kredi ve puan yok)' },
        { value: 'I', label: 'I (Eksik - kredi ve puan yok)' },
    ];

    let currentSemesterId = '1';

    function getDefaultSaveData() {
        return {
            version: 2,
            previousGPA: '',
            previousCredits: '',
            semester: '1',
            semesters: {}
        };
    }

    function getSaveData() {
        try {
            const raw = localStorage.getItem('gpaSaveData');
            if (!raw) return getDefaultSaveData();
            const data = JSON.parse(raw);
            // v2 format
            if (data && typeof data === 'object' && data.semesters) {
                return { version: 2, ...data };
            }
            // v1 migration
            if (data && Array.isArray(data.courses)) {
                const migrated = getDefaultSaveData();
                migrated.previousGPA = data.previousGPA || '';
                migrated.previousCredits = data.previousCredits || '';
                const sem = data.semester || '1';
                migrated.semester = sem;
                migrated.semesters[sem] = data.courses;
                return migrated;
            }
            return getDefaultSaveData();
        } catch {
            return getDefaultSaveData();
        }
    }

    function setSaveData(data) {
        localStorage.setItem('gpaSaveData', JSON.stringify({ version: 2, ...data }));
    }

    function loadGradeScale() {
        try {
            const raw = localStorage.getItem('gradeScale');
            if (!raw) return { AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0, FF: 0.0 };
            const parsed = JSON.parse(raw);
            return { AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0, FF: 0.0, ...parsed };
        } catch {
            return { AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0, FF: 0.0 };
        }
    }

    function saveGradeScale(scale) {
        localStorage.setItem('gradeScale', JSON.stringify(scale));
    }

    function populateScaleInputs() {
        if (!scaleInputs.AA) return;
        Object.entries(scaleInputs).forEach(([k, input]) => {
            input.value = gradePoints[k];
        });
    }

    function buildGradeOptionsHtml() {
        const letterOptions = Object.entries(gradePoints).map(([grade, point]) => `<option value="${grade}">${grade} (${point})</option>`);
        const specialOptions = specialGradeOptions.map(({ value, label }) => `<option value="${value}">${label}</option>`);
        return [
            '<option value="" disabled selected>Not Seçin</option>',
            ...letterOptions,
            '<option disabled>──────────</option>',
            ...specialOptions
        ].join('');
    }

    function rebuildAllGradeSelects() {
        const optionsHtml = buildGradeOptionsHtml();
        document.querySelectorAll('.course-entry .course-grade').forEach(sel => {
            const prev = sel.value;
            sel.innerHTML = optionsHtml;
            if (prev) sel.value = prev;
        });
    }

    // Debounce utility
    function debounce(fn, delay = 150) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    // Kaydetme ve yükleme fonksiyonları
    function saveCourses() {
        const data = getSaveData();
        const courses = [];
        document.querySelectorAll('.course-entry').forEach(entry => {
            const courseName = entry.querySelector('.course-name').value.trim();
            const courseCredit = entry.querySelector('.course-credit').value;
            const courseGrade = entry.querySelector('.course-grade').value;
            if (courseCredit && courseGrade) {
                // sanitize name
                const safeName = courseName.replace(/[\n\r\t]+/g, ' ').slice(0, 200);
                courses.push({ name: safeName, credit: courseCredit, grade: courseGrade });
            }
        });
        data.previousGPA = previousGPAInput.value;
        data.previousCredits = previousCreditsInput.value;
        data.semester = currentSemesterId;
        data.semesters[currentSemesterId] = courses;
        setSaveData(data);
    }

    function renderCoursesForSemester(semId) {
        const data = getSaveData();
        courseList.innerHTML = '';
        const list = (data.semesters && data.semesters[semId]) || [];
        list.forEach(course => {
            const entry = createCourseEntry();
            entry.querySelector('.course-name').value = course.name || '';
            entry.querySelector('.course-credit').value = course.credit;
            entry.querySelector('.course-grade').value = course.grade;
            courseList.appendChild(entry);
        });
        updateEmptyState();
        calculateGPA();
    }

    function loadCourses() {
        const data = getSaveData();
        if (data.previousGPA) previousGPAInput.value = data.previousGPA;
        if (data.previousCredits) previousCreditsInput.value = data.previousCredits;
        if (data.semester) {
            currentSemesterId = String(data.semester);
            semesterSelect.value = currentSemesterId;
        }
        renderCoursesForSemester(currentSemesterId);
    }

    // Temizleme fonksiyonu
    function clearSavedData() {
        if (confirm('Tüm kaydedilmiş verileri silmek istediğinize emin misiniz?')) {
            localStorage.removeItem('gpaSaveData');
            location.reload();
        }
    }

    function updateEmptyState() {
        const hasEntries = document.querySelectorAll('.course-entry').length > 0;
        if (emptyState) emptyState.style.display = hasEntries ? 'none' : 'block';
    }

    // Event listener'ları güncelle
    function addEventListeners(entry) {
        entry.querySelectorAll('select, input').forEach(element => {
            element.addEventListener('change', calculateAndSaveDebounced);
            element.addEventListener('input', calculateAndSaveDebounced);
        });

        entry.querySelector('.delete-btn').addEventListener('click', () => {
            entry.remove();
            updateEmptyState();
            calculateAndSaveDebounced();
        });
    }

    function createCourseEntry() {
        const courseEntry = document.createElement('div');
        courseEntry.className = 'course-entry';

        courseEntry.innerHTML = `
            <input type="text" placeholder="Ders Adı" class="course-name" aria-label="Ders Adı">
            <select class="course-credit" aria-label="Ders Kredisi">
                <option value="" disabled selected>Kredi Seçin</option>
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(credit => 
                    `<option value="${credit}">${credit} Kredi</option>`
                ).join('')}
            </select>
            <select class="course-grade" aria-label="Ders Notu">
                ${buildGradeOptionsHtml()}
            </select>
            <button class="btn delete-btn" title="Dersi Sil" aria-label="Dersi Sil">×</button>
        `;

        addEventListeners(courseEntry);
        return courseEntry;
    }

    function getAllSemestersPointsAndCredits() {
        const data = getSaveData();
        let totalPoints = 0;
        let totalCredits = 0;
        Object.values(data.semesters || {}).forEach(courses => {
            (courses || []).forEach(course => {
                const credit = parseFloat(course.credit);
                const grade = course.grade;
                if (credit && grade) {
                    if (grade === 'P' || grade === 'S' || grade === 'U') {
                        totalCredits += credit;
                    } else if (grade === 'W' || grade === 'I') {
                        // ignore
                    } else {
                        totalPoints += credit * (gradePoints[grade] ?? 0);
                        totalCredits += credit;
                    }
                }
            });
        });
        return { totalPoints, totalCredits };
    }

    function calculateGPA() {
        let semesterPoints = 0;
        let semesterCredits = 0;
        let previousPoints = 0;
        
        // Current semester
        document.querySelectorAll('.course-entry').forEach(entry => {
            const credit = parseFloat(entry.querySelector('.course-credit').value);
            const grade = entry.querySelector('.course-grade').value;
            if (credit && grade) {
                if (grade === 'P' || grade === 'S' || grade === 'U') {
                    semesterCredits += credit;
                } else if (grade === 'W' || grade === 'I') {
                    // ignore
                } else {
                    semesterPoints += credit * (gradePoints[grade] ?? 0);
                    semesterCredits += credit;
                }
            }
        });

        // Previous inputs
        const previousGPA = parseFloat(previousGPAInput.value) || 0;
        const previousCredits = parseFloat(previousCreditsInput.value) || 0;
        if (previousGPA && previousCredits) previousPoints = previousGPA * previousCredits;

        // Semester GPA
        const semesterGPA = semesterCredits > 0 ? (semesterPoints / semesterCredits).toFixed(2) : '0.00';
        semesterGPADisplay.textContent = semesterGPA;

        // Cumulative across all semesters + previous
        const all = getAllSemestersPointsAndCredits();
        const cumTotalCredits = all.totalCredits + previousCredits;
        const cumTotalPoints = all.totalPoints + previousPoints;
        const cumulativeGPA = cumTotalCredits > 0 ? (cumTotalPoints / cumTotalCredits).toFixed(2) : '0.00';

        gpaDisplay.textContent = cumulativeGPA;
        totalCreditsDisplay.textContent = cumTotalCredits;

        colorizeGPA('semesterGPAItem', parseFloat(semesterGPA));
        colorizeGPA('cumulativeGPAItem', parseFloat(cumulativeGPA));
    }

    function colorizeGPA(elementId, value) {
        const el = document.getElementById(elementId);
        if (!el || Number.isNaN(value)) return;
        el.style.outline = '';
        if (value >= 3.5) {
            el.style.outline = '2px solid #38a169';
        } else if (value >= 2.0) {
            el.style.outline = '2px solid #d69e2e';
        } else {
            el.style.outline = '2px solid #e53e3e';
        }
    }

    function calculateTargetGPA() {
        targetResult.textContent = '';
        const target = parseFloat(targetGPAInput.value);
        if (Number.isNaN(target) || target < 0 || target > 4) {
            targetResult.textContent = 'Lütfen 0.00 - 4.00 arası bir hedef girin.';
            return;
        }

        let semesterCredits = 0;
        document.querySelectorAll('.course-entry').forEach(entry => {
            const credit = parseFloat(entry.querySelector('.course-credit').value);
            const grade = entry.querySelector('.course-grade').value;
            if (credit && grade) {
                if (grade === 'P' || grade === 'S' || grade === 'U') {
                    semesterCredits += credit;
                } else if (grade === 'W' || grade === 'I') {
                    // ignore
                } else {
                    semesterCredits += credit;
                }
            }
        });
        const prevGPA = parseFloat(previousGPAInput.value) || 0;
        const prevCredits = parseFloat(previousCreditsInput.value) || 0;

        const all = getAllSemestersPointsAndCredits();
        // Replace current semester points with unknown X; others remain
        const otherSemestersPoints = all.totalPoints - (function(){
            // recompute current semester points only
            let pts = 0; let cr = 0;
            document.querySelectorAll('.course-entry').forEach(entry => {
                const credit = parseFloat(entry.querySelector('.course-credit').value);
                const grade = entry.querySelector('.course-grade').value;
                if (credit && grade) {
                    if (grade === 'P' || grade === 'S' || grade === 'U') {
                        cr += credit;
                    } else if (grade === 'W' || grade === 'I') {
                        // ignore
                    } else {
                        cr += credit;
                        pts += credit * (gradePoints[grade] ?? 0);
                    }
                }
            });
            return pts;
        })();
        const otherSemestersCredits = all.totalCredits - (function(){
            let cr = 0;
            document.querySelectorAll('.course-entry').forEach(entry => {
                const credit = parseFloat(entry.querySelector('.course-credit').value);
                const grade = entry.querySelector('.course-grade').value;
                if (credit && grade) {
                    if (grade === 'W' || grade === 'I') {
                        // ignore
                    } else {
                        cr += credit;
                    }
                }
            });
            return cr;
        })();

        const totalCredits = prevCredits + otherSemestersCredits + semesterCredits;
        if (totalCredits === 0) {
            targetResult.textContent = 'Önce kredi ve not giriniz.';
            return;
        }

        // Let X be required current semester points; equation:
        // (prevGPA*prevCredits + otherPts + X) / totalCredits = target
        const requiredCurrentSemesterPoints = target * totalCredits - (prevGPA * prevCredits + otherSemestersPoints);
        const requiredSemesterGPA = semesterCredits > 0 ? (requiredCurrentSemesterPoints / semesterCredits) : NaN;

        if (Number.isNaN(requiredSemesterGPA)) {
            targetResult.textContent = 'Bu dönem için ders ekleyiniz.';
            return;
        }

        const clamped = Math.max(0, Math.min(4, requiredSemesterGPA));
        const rounded = clamped.toFixed(2);

        if (requiredSemesterGPA > 4) {
            targetResult.textContent = `Hedef için bu dönem ortalama en az ${rounded} gerekir (4.00 üstü mümkün değil).`;
        } else if (requiredSemesterGPA < 0) {
            targetResult.textContent = `Mevcut verilerle hedef zaten aşılıyor. Tahmini dönem ortalaması ${rounded}.`;
        } else {
            targetResult.textContent = `Hedefe ulaşmak için bu dönem ortalama en az ${rounded} olmalı.`;
        }
    }

    // Export / Import / Share
    function exportData() {
        const state = { gpaSaveData: getSaveData(), gradeScale: gradePoints };
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'boun-gpa-data.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function importData(file) {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result);
                if (json && json.gpaSaveData) {
                    setSaveData(json.gpaSaveData);
                    if (json.gradeScale) { gradePoints = json.gradeScale; saveGradeScale(gradePoints); }
                } else if (json && typeof json === 'object') {
                    // backward compatibility: raw saveData
                    localStorage.setItem('gpaSaveData', JSON.stringify(json));
                } else {
                    throw new Error('Geçersiz dosya');
                }
                loadCourses();
                rebuildAllGradeSelects();
                alert('Veriler yüklendi.');
            } catch (e) {
                alert('İçe aktarma başarısız: ' + e.message);
            }
        };
        reader.readAsText(file);
    }

    function encodeStateToUrl() {
        try {
            const state = { gpaSaveData: getSaveData(), gradeScale: gradePoints };
            const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
            const url = new URL(window.location.href);
            url.hash = 'state=' + encoded;
            return url.toString();
        } catch (e) {
            return window.location.href;
        }
    }

    function applyStateFromUrl() {
        const hash = window.location.hash;
        const match = hash.match(/state=([^&]+)/);
        if (!match) return;
        try {
            const decoded = decodeURIComponent(escape(atob(match[1])));
            const json = JSON.parse(decoded);
            if (json && json.gpaSaveData) {
                setSaveData(json.gpaSaveData);
                if (json.gradeScale) { gradePoints = json.gradeScale; saveGradeScale(gradePoints); }
            } else {
                localStorage.setItem('gpaSaveData', decoded);
            }
        } catch (_) {
            // ignore
        }
    }

    const calculateAndSave = () => { calculateGPA(); saveCourses(); };
    const calculateAndSaveDebounced = debounce(calculateAndSave, 150);

    // Event Listeners
    addCourseBtn.addEventListener('click', () => {
        const entry = createCourseEntry();
        courseList.appendChild(entry);
        updateEmptyState();
        calculateAndSaveDebounced();
    });

    previousGPAInput.addEventListener('input', () => {
        let value = parseFloat(previousGPAInput.value);
        if (value < 0) {
            previousGPAInput.value = 0;
        } else if (value > 4) {
            previousGPAInput.value = 4;
        }
        calculateAndSaveDebounced();
    });

    previousCreditsInput.addEventListener('input', () => {
        let value = parseInt(previousCreditsInput.value);
        if (value < 0) {
            previousCreditsInput.value = 0;
        } else if (value > 300) {
            previousCreditsInput.value = 300;
        }
        calculateAndSaveDebounced();
    });

    semesterSelect.addEventListener('change', () => {
        // Save current semester data then switch
        saveCourses();
        currentSemesterId = semesterSelect.value || '1';
        renderCoursesForSemester(currentSemesterId);
    });

    // Hedef GPA
    if (calcTargetBtn) {
        calcTargetBtn.addEventListener('click', calculateTargetGPA);
        targetGPAInput && targetGPAInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculateTargetGPA(); });
    }

    // Dışa/İçe aktar ve paylaş
    exportBtn && exportBtn.addEventListener('click', exportData);
    importBtn && importBtn.addEventListener('click', () => importFile.click());
    importFile && importFile.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) importData(file);
        importFile.value = '';
    });
    shareBtn && shareBtn.addEventListener('click', async () => {
        const url = encodeStateToUrl();
        try {
            await navigator.clipboard.writeText(url);
            alert('Bağlantı kopyalandı!');
        } catch (_) {
            prompt('Kopyalayın:', url);
        }
    });

    // Not skalası modalı ve kayıtları
    function openScaleModal() {
        if (!scaleModal) return;
        populateScaleInputs();
        scaleModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        const focusable = scaleModal.querySelector('.modal-content');
        focusable && focusable.focus();
    }
    function closeScaleModal() {
        if (!scaleModal) return;
        scaleModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    scaleBtn && scaleBtn.addEventListener('click', openScaleModal);
    scaleCloseBtn && scaleCloseBtn.addEventListener('click', closeScaleModal);
    window.addEventListener('click', (e) => { if (e.target === scaleModal) closeScaleModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && scaleModal && scaleModal.style.display === 'block') closeScaleModal(); });

    scaleSaveBtn && scaleSaveBtn.addEventListener('click', () => {
        const newScale = {};
        Object.keys(scaleInputs).forEach(k => {
            const v = parseFloat(scaleInputs[k].value);
            newScale[k] = Number.isFinite(v) ? Math.max(0, Math.min(4, v)) : gradePoints[k];
        });
        gradePoints = newScale;
        saveGradeScale(gradePoints);
        rebuildAllGradeSelects();
        calculateAndSaveDebounced();
        closeScaleModal();
    });

    scaleResetBtn && scaleResetBtn.addEventListener('click', () => {
        gradePoints = { AA: 4.0, BA: 3.5, BB: 3.0, CB: 2.5, CC: 2.0, DC: 1.5, DD: 1.0, FF: 0.0 };
        saveGradeScale(gradePoints);
        populateScaleInputs();
        rebuildAllGradeSelects();
        calculateAndSaveDebounced();
    });

    // Temizleme butonu ekle
    const clearButton = document.createElement('button');
    clearButton.className = 'btn clear-btn';
    clearButton.textContent = 'Kaydedilmiş Verileri Temizle';
    clearButton.addEventListener('click', clearSavedData);
    document.querySelector('.calculator').appendChild(clearButton);

    // Sayfa yüklendiğinde URL'den durum uygula ve kaydedilmiş verileri yükle
    applyStateFromUrl();
    loadCourses();

    // Tema değiştirme fonksiyonları
    function initTheme() {
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButton(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    }

    function updateThemeButton(theme) {
        const button = document.getElementById('themeToggle');
        button.innerHTML = theme === 'light' ? '🌙' : '☀️';
        button.setAttribute('title', theme === 'light' ? 'Koyu Temaya Geç' : 'Açık Temaya Geç');
    }

    // Event Listeners
    initTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Modal kontrolleri + erişilebilirlik
    const modal = document.getElementById('helpModal');
    const helpBtn = document.getElementById('helpBtn');
    const closeBtn = document.querySelector('#helpModal .close');

    let lastFocusedElement = null;

    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        const focusable = modal.querySelector('.modal-content');
        focusable && focusable.focus();
        trapFocus(modal);
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        releaseFocusTrap();
        lastFocusedElement && lastFocusedElement.focus();
    }

    helpBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Escape tuşu ile modalı kapatma
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Focus trap
    let focusTrapHandler = null;
    function trapFocus(container) {
        focusTrapHandler = function(e) {
            if (e.key !== 'Tab') return;
            const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';
            const focusables = Array.from(container.querySelectorAll(focusableSelectors)).filter(el => el.offsetParent !== null);
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        container.addEventListener('keydown', focusTrapHandler);
    }

    function releaseFocusTrap() {
        if (focusTrapHandler) {
            modal.removeEventListener('keydown', focusTrapHandler);
            focusTrapHandler = null;
        }
    }

    // Service Worker kaydı
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {/* ignore */});
    }
}); 