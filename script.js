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
            <button class="btn delete-btn">×</button>
        `;

        courseEntry.querySelector('.delete-btn').addEventListener('click', () => {
            courseEntry.remove();
            calculateGPA();
        });

        courseEntry.querySelectorAll('select, input').forEach(element => {
            element.addEventListener('change', calculateGPA);
        });

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
        courseList.appendChild(createCourseEntry());
        calculateGPA();
    });

    previousGPAInput.addEventListener('input', calculateGPA);
    previousCreditsInput.addEventListener('input', calculateGPA);
    semesterSelect.addEventListener('change', () => {
        // You can add semester-specific logic here if needed
        calculateGPA();
    });

    // Add first course entry by default
    courseList.appendChild(createCourseEntry());
}); 