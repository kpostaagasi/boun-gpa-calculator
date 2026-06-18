/**
 * BOUN GPA Calculator — Charts Module
 *
 * Chart.js initialization and data preparation for grade distribution,
 * GPA/SPA trend, and credit distribution charts.
 */
import { state, elements } from './state.js';
import { t, registerViewRefresh } from './i18n.js';
import { gradePoints, getGradeLabels } from './grades.js';
import { registerViewInit, calculateGPA } from './ui.js';

// ============================================
// Registration
// ============================================
registerViewInit('charts', initializeCharts);
registerViewRefresh('charts', initializeCharts);

// ============================================
// Chart Initialization
// ============================================
export function initializeCharts() {
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
            'DC': '#f97316', 'DD': '#fb923c', 'FD': '#fb7185',
            'FF': '#ef4444', 'U': '#ef4444', 'F': '#ef4444',
            'A': '#10b981', 'A-': '#34d399',
            'B+': '#6ee7b7', 'B': '#fbbf24', 'B-': '#fcd34d',
            'C+': '#f59e0b', 'C': '#f97316', 'C-': '#fb923c',
            'D+': '#f87171', 'D': '#ef4444',
            'P': '#3b82f6', 'S': '#3b82f6', 'G': '#3b82f6'
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

// ============================================
// Data Helper Functions
// ============================================
export function getCoursesData() {
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

export function getGradeDistribution(courses) {
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

export function getAllCoursesFromHistory() {
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

export function getGradeDistributionData() {
    const grades = getGradeLabels();

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

export function getSemesterTrendData() {
    // Use saved semesters if available, otherwise use current
    const semesters = Object.entries(state.semesters);

    if (semesters.length > 0) {
        // Sort semesters by number
        const sorted = semesters.sort((a, b) => {
            const numA = parseInt(a[0], 10) || 0;
            const numB = parseInt(b[0], 10) || 0;
            return numA - numB;
        });

        const labels = sorted.map(s => t('semester.format', { n: s[0] }));
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

export function getCreditDistribution() {
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
