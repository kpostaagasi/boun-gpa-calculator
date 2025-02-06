document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('courseList');
    const addCourseBtn = document.getElementById('addCourse');
    const gpaDisplay = document.getElementById('gpa');
    const semesterGPADisplay = document.getElementById('semesterGPA');
    const totalCreditsDisplay = document.getElementById('totalCredits');
    const previousGPAInput = document.getElementById('previousGPA');
    const previousCreditsInput = document.getElementById('previousCredits');
    const semesterSelect = document.getElementById('semesterSelect');

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

    // Kaydetme ve yükleme fonksiyonları
    function saveCourses() {
        const courses = [];
        document.querySelectorAll('.course-entry').forEach(entry => {
            const courseName = entry.querySelector('.course-name').value.trim();
            const courseCredit = entry.querySelector('.course-credit').value;
            const courseGrade = entry.querySelector('.course-grade').value;
            
            // Only save if both credit and grade are filled out (name is optional)
            if (courseCredit && courseGrade) {
                courses.push({
                    name: courseName,
                    credit: courseCredit,
                    grade: courseGrade
                });
            }
        });

        const semester = semesterSelect.value;
        const previousGPA = previousGPAInput.value;
        const previousCredits = previousCreditsInput.value;

        const saveData = {
            courses,
            semester,
            previousGPA,
            previousCredits
        };

        localStorage.setItem('gpaSaveData', JSON.stringify(saveData));
    }

    function loadCourses() {
        const savedData = localStorage.getItem('gpaSaveData');
        if (!savedData) return;

        const data = JSON.parse(savedData);
        
        // Önceki GPA ve kredi bilgilerini yükle
        if (data.previousGPA) previousGPAInput.value = data.previousGPA;
        if (data.previousCredits) previousCreditsInput.value = data.previousCredits;
        if (data.semester) semesterSelect.value = data.semester;

        // Mevcut dersleri temizle
        courseList.innerHTML = '';

        // Kaydedilmiş dersleri yükle
        data.courses.forEach(course => {
            const entry = createCourseEntry();
            entry.querySelector('.course-name').value = course.name;
            entry.querySelector('.course-credit').value = course.credit;
            entry.querySelector('.course-grade').value = course.grade;
            courseList.appendChild(entry);
        });

        // GPA'yı hesapla
        calculateGPA();
    }

    // Temizleme fonksiyonu
    function clearSavedData() {
        if (confirm('Tüm kaydedilmiş verileri silmek istediğinize emin misiniz?')) {
            localStorage.removeItem('gpaSaveData');
            location.reload();
        }
    }

    // Event listener'ları güncelle
    function addEventListeners(entry) {
        entry.querySelectorAll('select, input').forEach(element => {
            element.addEventListener('change', () => {
                calculateGPA();
                saveCourses();
            });
        });

        entry.querySelector('.delete-btn').addEventListener('click', () => {
            entry.remove();
            calculateGPA();
            saveCourses();
        });
    }

    // createCourseEntry fonksiyonunu güncelle
    function createCourseEntry() {
        const courseEntry = document.createElement('div');
        courseEntry.className = 'course-entry';

        courseEntry.innerHTML = `
            <input type="text" placeholder="Ders Adı" class="course-name">
            <select class="course-credit">
                <option value="" disabled selected>Kredi Seçin</option>
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(credit => 
                    `<option value="${credit}">${credit} Kredi</option>`
                ).join('')}
            </select>
            <select class="course-grade">
                <option value="" disabled selected>Not Seçin</option>
                ${Object.entries(gradePoints).map(([grade, point]) => 
                    `<option value="${grade}">${grade} (${point})</option>`
                ).join('')}
            </select>
            <button class="btn delete-btn" title="Dersi Sil">×</button>
        `;

        addEventListeners(courseEntry);
        return courseEntry;
    }

    function calculateGPA() {
        let semesterPoints = 0;
        let semesterCredits = 0;
        let previousPoints = 0;
        
        // Calculate current semester GPA
        document.querySelectorAll('.course-entry').forEach(entry => {
            const credit = parseFloat(entry.querySelector('.course-credit').value);
            const grade = entry.querySelector('.course-grade').value;
            
            if (credit && grade) {
                semesterPoints += credit * gradePoints[grade];
                semesterCredits += credit;
            }
        });

        // Get previous GPA and credits
        const previousGPA = parseFloat(previousGPAInput.value) || 0;
        const previousCredits = parseFloat(previousCreditsInput.value) || 0;
        
        if (previousGPA && previousCredits) {
            previousPoints = previousGPA * previousCredits;
        }

        // Calculate semester GPA
        const semesterGPA = semesterCredits > 0 ? (semesterPoints / semesterCredits).toFixed(2) : '0.00';
        semesterGPADisplay.textContent = semesterGPA;

        // Calculate cumulative GPA
        const totalCredits = semesterCredits + previousCredits;
        const totalPoints = semesterPoints + previousPoints;
        const cumulativeGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
        
        gpaDisplay.textContent = cumulativeGPA;
        totalCreditsDisplay.textContent = totalCredits;
    }

    // Event Listeners
    addCourseBtn.addEventListener('click', () => {
        const entry = createCourseEntry();
        courseList.appendChild(entry);
        calculateGPA();
        saveCourses();
    });

    previousGPAInput.addEventListener('input', () => {
        calculateGPA();
        saveCourses();
    });

    previousCreditsInput.addEventListener('input', () => {
        calculateGPA();
        saveCourses();
    });

    semesterSelect.addEventListener('change', () => {
        calculateGPA();
        saveCourses();
    });

    // Temizleme butonu ekle
    const clearButton = document.createElement('button');
    clearButton.className = 'btn clear-btn';
    clearButton.textContent = 'Kaydedilmiş Verileri Temizle';
    clearButton.addEventListener('click', clearSavedData);
    document.querySelector('.calculator').appendChild(clearButton);

    // Sayfa yüklendiğinde kaydedilmiş verileri yükle
    loadCourses();

    // Tema değiştirme fonksiyonları
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
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

    // Modal kontrolleri
    const modal = document.getElementById('helpModal');
    const helpBtn = document.getElementById('helpBtn');
    const closeBtn = document.querySelector('.close');

    helpBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Arka planı kaydırmayı engelle
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Arka plan kaydırmayı tekrar etkinleştir
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Escape tuşu ile modalı kapatma
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}); 