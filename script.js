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
            'calc.previousInfoDesc': 'Varsa önceki dönemlerden gelen GPA’ya dahil kredi ve not bilgilerinizi girin',
            'calc.previousGpa': 'Önceki GPA',
            'calc.previousCredits': 'GPA’ya Dahil Kredi',
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
            'alert.importSuccess': 'Veriler başarıyla içe aktarıldı!',
            'alert.importError': 'İçe aktarma sırasında bir hata oluştu. Geçerli bir JSON dosyası yükleyin.',
            'alert.feedbackSuccess': 'Geri bildiriminiz için teşekkürler!',
            
            // Theme & Language
            'theme.toggle': 'Tema Değiştir',
            'lang.toggle': 'Dil Değiştir',
            
            // Misc
            'misc.delete': 'Sil',
            'misc.noCourseRecords': 'Bu dönemde ders kaydı yok.',
            
            // New features - Navigation
            'nav.import': 'İçe Aktar',
            'nav.feedback': 'Geri Bildirim',
            'nav.shortcuts': 'Kısayollar',
            'nav.universities': 'Üniversite',
            
            // Keyboard Shortcuts
            'shortcuts.title': 'Klavye Kısayolları',
            'shortcuts.addCourse': 'Yeni ders ekle',
            'shortcuts.save': 'Verileri kaydet',
            'shortcuts.export': 'Dışa aktar',
            'shortcuts.dashboard': 'Dashboard\'a git',
            'shortcuts.calculator': 'Hesaplayıcıya git',
            'shortcuts.theme': 'Tema değiştir',
            'shortcuts.language': 'Dil değiştir',
            'shortcuts.help': 'Yardım menüsü',
            'shortcuts.close': 'Modalı kapat',
            
            // Feedback
            'feedback.title': 'Geri Bildirim',
            'feedback.type': 'Geri Bildirim Türü',
            'feedback.bug': 'Hata Bildirimi',
            'feedback.feature': 'Özellik İsteği',
            'feedback.improvement': 'İyileştirme Önerisi',
            'feedback.other': 'Diğer',
            'feedback.message': 'Mesajınız',
            'feedback.email': 'E-posta (İsteğe bağlı)',
            'feedback.submit': 'Gönder',
            
            // Import
            'import.title': 'Veri İçe Aktar',
            'import.desc': 'Daha önce dışa aktardığınız JSON dosyasını yükleyin veya yapıştırın.',
            'import.selectFile': 'Dosya Seç',
            'import.pasteJson': 'veya JSON yapıştırın:',
            'import.import': 'İçe Aktar',
            'import.cancel': 'İptal',
            
            // Export JSON
            'export.json': 'JSON Yedek',
            'export.jsonDesc': 'Verilerinizi JSON olarak yedekleyin',
            
            // New Navigation Items
            'nav.simulation': 'Simülasyon',
            'nav.graduation': 'Mezuniyet',
            'nav.achievements': 'Rozetler',
            'nav.calendar': 'Takvim',
            
            // Simulation
            'simulation.title': 'GPA Simülasyonu',
            'simulation.desc': '"Eğer şu notları alsam..." senaryolarını deneyin',
            'simulation.currentGpa': 'Mevcut GPA',
            'simulation.scenarios': 'Senaryolar',
            'simulation.addScenario': 'Senaryo Ekle',
            'simulation.projectedGpa': 'Tahmini GPA',
            'simulation.quickScenarios': 'Hızlı Senaryolar',
            'simulation.allAA': 'Tüm AA',
            'simulation.allBB': 'Tüm BB',
            'simulation.allCC': 'Tüm CC',
            'simulation.mixed': 'Karışık',
            'simulation.credits': 'Kredi',
            'simulation.grade': 'Not',
            'simulation.remove': 'Kaldır',
            'simulation.gpaUp': '↑ Artış',
            'simulation.gpaDown': '↓ Düşüş',
            'simulation.gpaSame': '→ Aynı',
            
            // Graduation
            'graduation.title': 'Mezuniyet Hesaplayıcı',
            'graduation.desc': 'Mezuniyete ne kadar kaldığınızı hesaplayın',
            'graduation.requiredCredits': 'Gereken Toplam Kredi',
            'graduation.minGpa': 'Minimum GPA',
            'graduation.currentCredits': 'Mevcut Krediniz',
            'graduation.currentGpa': 'Mevcut GPA',
            'graduation.calculate': 'Hesapla',
            'graduation.progress': 'Mezuniyet İlerlemesi',
            'graduation.creditProgress': 'Kredi İlerlemesi',
            'graduation.gpaProgress': 'GPA Durumu',
            'graduation.estimateText': 'Tahmini mezuniyet: Hesapla butonuna tıklayın',
            'graduation.honorStatus': 'Onur Durumu',
            'graduation.honor': 'Onur Öğrencisi',
            'graduation.highHonor': 'Yüksek Onur Öğrencisi',
            'graduation.achieved': '✓ Ulaşıldı',
            'graduation.notAchieved': '✗ Ulaşılmadı',
            'graduation.remaining': 'Kalan: {credits} kredi',
            'graduation.semestersLeft': 'Tahmini {semesters} dönem kaldı',
            'graduation.readyToGraduate': '🎉 Mezuniyete hazırsınız!',
            'graduation.needCredits': '{credits} kredi daha almanız gerekiyor',
            'graduation.needGpa': 'GPA\'nızı {gpa}\'e yükseltmeniz gerekiyor',
            
            // Achievements
            'achievements.title': 'Başarı Rozetleri',
            'achievements.desc': 'Akademik başarılarınızı kutlayın',
            'achievements.streaks': 'Seri Takibi',
            'achievements.successStreak': 'Başarılı Dönem Serisi',
            'achievements.improvementStreak': 'Gelişim Serisi',
            'achievements.perfectStreak': 'Mükemmel Dönem',
            'achievements.locked': 'Kilitli',
            'achievements.unlocked': 'Açıldı!',
            
            // Calendar
            'calendar.title': 'Akademik Takvim',
            'calendar.desc': 'Önemli tarihleri ve hatırlatıcıları yönetin',
            'calendar.addReminder': 'Hatırlatıcı Ekle',
            'calendar.upcoming': 'Yaklaşan Hatırlatıcılar',
            'calendar.noReminders': 'Henüz hatırlatıcı eklenmedi',
            'calendar.quickAdd': 'Hızlı Ekle',
            'calendar.midterm': 'Vize',
            'calendar.final': 'Final',
            'calendar.project': 'Proje',
            'calendar.assignment': 'Ödev',
            'calendar.reminderTitle': 'Başlık',
            'calendar.reminderType': 'Tür',
            'calendar.reminderDate': 'Tarih',
            'calendar.reminderTime': 'Saat',
            'calendar.reminderCourse': 'Ders (İsteğe bağlı)',
            'calendar.reminderNotes': 'Notlar',
            'calendar.saveReminder': 'Kaydet',
            'calendar.today': 'Bugün',
            'calendar.daysLeft': '{days} gün kaldı',
            'calendar.tomorrow': 'Yarın',
            'calendar.delete': 'Sil',
            
            // Months
            'month.0': 'Ocak',
            'month.1': 'Şubat',
            'month.2': 'Mart',
            'month.3': 'Nisan',
            'month.4': 'Mayıs',
            'month.5': 'Haziran',
            'month.6': 'Temmuz',
            'month.7': 'Ağustos',
            'month.8': 'Eylül',
            'month.9': 'Ekim',
            'month.10': 'Kasım',
            'month.11': 'Aralık',
            
            // Additional translations for new features
            'scenario': 'Senaryo',
            'scenarioSaved': 'Senaryo kaydedildi',
            'noSavedScenarios': 'Kayıtlı senaryo yok',
            'load': 'Yükle',
            'course': 'Ders',
            'credits': 'kredi',
            'graduationComplete': 'Tebrikler! Mezuniyet şartlarını tamamladınız!',
            'targetUnreachable': 'Bu hedef mevcut krediyle ulaşılamaz',
            'targetChallenging': 'Zorlu ama imkansız değil!',
            'targetAchievable': 'Hedefinize ulaşabilirsiniz!',
            'achievementUnlocked': 'Rozet Açıldı!',
            'achFirstCourse': 'İlk Ders',
            'achFirstCourseDesc': 'İlk dersinizi eklediniz',
            'achFiveCourses': 'Beş Ders',
            'achFiveCoursesDesc': '5 ders eklediniz',
            'achTwentyCourses': 'Yirmi Ders',
            'achTwentyCoursesDesc': '20 ders eklediniz',
            'achFirstAA': 'İlk AA',
            'achFirstAADesc': 'İlk AA notunuzu aldınız',
            'achHonor': 'Onur Öğrencisi',
            'achHonorDesc': 'GPA 3.00 ve üzeri',
            'achHighHonor': 'Yüksek Onur',
            'achHighHonorDesc': 'GPA 3.50 ve üzeri',
            'achPerfectGPA': 'Mükemmel GPA',
            'achPerfectGPADesc': 'GPA 4.00',
            'achFirstSemester': 'İlk Dönem',
            'achFirstSemesterDesc': 'İlk döneminizi tamamladınız',
            'achFourSemesters': 'Dört Dönem',
            'achFourSemestersDesc': '4 dönemi tamamladınız',
            'achEightSemesters': 'Sekiz Dönem',
            'achEightSemestersDesc': '8 dönemi tamamladınız',
            'achNightOwl': 'Gece Kuşu',
            'achNightOwlDesc': 'Gece yarısından sonra çalışıyorsunuz',
            'achEarlyBird': 'Erken Kuş',
            'achEarlyBirdDesc': 'Sabah erken saatlerde çalışıyorsunuz',
            'achExplorer': 'Kaşif',
            'achExplorerDesc': 'Tüm görünümleri keşfettiniz',
            'noReminders': 'Henüz hatırlatıcı yok',
            'today': 'Bugün',
            'tomorrow': 'Yarın',
            'fillAllFields': 'Lütfen tüm alanları doldurun',
            'reminderAdded': 'Hatırlatıcı eklendi',
            'reminderDeleted': 'Hatırlatıcı silindi',
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
            'calc.previousInfoDesc': 'Enter your GPA-affecting credits and GPA from previous semesters if applicable',
            'calc.previousGpa': 'Previous GPA',
            'calc.previousCredits': 'GPA Credits So Far',
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
            'alert.importSuccess': 'Data imported successfully!',
            'alert.importError': 'An error occurred during import. Please upload a valid JSON file.',
            'alert.feedbackSuccess': 'Thank you for your feedback!',
            
            // Theme & Language
            'theme.toggle': 'Toggle Theme',
            'lang.toggle': 'Change Language',
            
            // Misc
            'misc.delete': 'Delete',
            'misc.noCourseRecords': 'No course records for this semester.',
            
            // New features - Navigation
            'nav.import': 'Import',
            'nav.feedback': 'Feedback',
            'nav.shortcuts': 'Shortcuts',
            'nav.universities': 'University',
            
            // Keyboard Shortcuts
            'shortcuts.title': 'Keyboard Shortcuts',
            'shortcuts.addCourse': 'Add new course',
            'shortcuts.save': 'Save data',
            'shortcuts.export': 'Export',
            'shortcuts.dashboard': 'Go to Dashboard',
            'shortcuts.calculator': 'Go to Calculator',
            'shortcuts.theme': 'Toggle theme',
            'shortcuts.language': 'Change language',
            'shortcuts.help': 'Help menu',
            'shortcuts.close': 'Close modal',
            
            // Feedback
            'feedback.title': 'Feedback',
            'feedback.type': 'Feedback Type',
            'feedback.bug': 'Bug Report',
            'feedback.feature': 'Feature Request',
            'feedback.improvement': 'Improvement Suggestion',
            'feedback.other': 'Other',
            'feedback.message': 'Your Message',
            'feedback.email': 'Email (Optional)',
            'feedback.submit': 'Submit',
            
            // Import
            'import.title': 'Import Data',
            'import.desc': 'Upload or paste a JSON file you previously exported.',
            'import.selectFile': 'Select File',
            'import.pasteJson': 'or paste JSON:',
            'import.import': 'Import',
            'import.cancel': 'Cancel',
            
            // Export JSON
            'export.json': 'JSON Backup',
            'export.jsonDesc': 'Backup your data as JSON',
            
            // New Navigation Items
            'nav.simulation': 'Simulation',
            'nav.graduation': 'Graduation',
            'nav.achievements': 'Achievements',
            'nav.calendar': 'Calendar',
            
            // Simulation
            'simulation.title': 'GPA Simulation',
            'simulation.desc': 'Try "What if I got these grades..." scenarios',
            'simulation.currentGpa': 'Current GPA',
            'simulation.scenarios': 'Scenarios',
            'simulation.addScenario': 'Add Scenario',
            'simulation.projectedGpa': 'Projected GPA',
            'simulation.quickScenarios': 'Quick Scenarios',
            'simulation.allAA': 'All AA',
            'simulation.allBB': 'All BB',
            'simulation.allCC': 'All CC',
            'simulation.mixed': 'Mixed',
            'simulation.credits': 'Credits',
            'simulation.grade': 'Grade',
            'simulation.remove': 'Remove',
            'simulation.gpaUp': '↑ Increase',
            'simulation.gpaDown': '↓ Decrease',
            'simulation.gpaSame': '→ Same',
            
            // Graduation
            'graduation.title': 'Graduation Calculator',
            'graduation.desc': 'Calculate how close you are to graduation',
            'graduation.requiredCredits': 'Required Total Credits',
            'graduation.minGpa': 'Minimum GPA',
            'graduation.currentCredits': 'Your Current Credits',
            'graduation.currentGpa': 'Your Current GPA',
            'graduation.calculate': 'Calculate',
            'graduation.progress': 'Graduation Progress',
            'graduation.creditProgress': 'Credit Progress',
            'graduation.gpaProgress': 'GPA Status',
            'graduation.estimateText': 'Estimated graduation: Click Calculate',
            'graduation.honorStatus': 'Honor Status',
            'graduation.honor': 'Honor Student',
            'graduation.highHonor': 'High Honor Student',
            'graduation.achieved': '✓ Achieved',
            'graduation.notAchieved': '✗ Not Achieved',
            'graduation.remaining': 'Remaining: {credits} credits',
            'graduation.semestersLeft': 'Estimated {semesters} semesters left',
            'graduation.readyToGraduate': '🎉 Ready to graduate!',
            'graduation.needCredits': 'You need {credits} more credits',
            'graduation.needGpa': 'You need to raise GPA to {gpa}',
            
            // Achievements
            'achievements.title': 'Achievement Badges',
            'achievements.desc': 'Celebrate your academic achievements',
            'achievements.streaks': 'Streak Tracking',
            'achievements.successStreak': 'Successful Semester Streak',
            'achievements.improvementStreak': 'Improvement Streak',
            'achievements.perfectStreak': 'Perfect Semester',
            'achievements.locked': 'Locked',
            'achievements.unlocked': 'Unlocked!',
            
            // Calendar
            'calendar.title': 'Academic Calendar',
            'calendar.desc': 'Manage important dates and reminders',
            'calendar.addReminder': 'Add Reminder',
            'calendar.upcoming': 'Upcoming Reminders',
            'calendar.noReminders': 'No reminders added yet',
            'calendar.quickAdd': 'Quick Add',
            'calendar.midterm': 'Midterm',
            'calendar.final': 'Final',
            'calendar.project': 'Project',
            'calendar.assignment': 'Assignment',
            'calendar.reminderTitle': 'Title',
            'calendar.reminderType': 'Type',
            'calendar.reminderDate': 'Date',
            'calendar.reminderTime': 'Time',
            'calendar.reminderCourse': 'Course (Optional)',
            'calendar.reminderNotes': 'Notes',
            'calendar.saveReminder': 'Save',
            'calendar.today': 'Today',
            'calendar.daysLeft': '{days} days left',
            'calendar.tomorrow': 'Tomorrow',
            'calendar.delete': 'Delete',
            
            // Months
            'month.0': 'January',
            'month.1': 'February',
            'month.2': 'March',
            'month.3': 'April',
            'month.4': 'May',
            'month.5': 'June',
            'month.6': 'July',
            'month.7': 'August',
            'month.8': 'September',
            'month.9': 'October',
            'month.10': 'November',
            'month.11': 'December',
            
            // Additional translations for new features
            'scenario': 'Scenario',
            'scenarioSaved': 'Scenario saved',
            'noSavedScenarios': 'No saved scenarios',
            'load': 'Load',
            'course': 'Course',
            'credits': 'credits',
            'graduationComplete': 'Congratulations! You completed graduation requirements!',
            'targetUnreachable': 'This target is unreachable with current credits',
            'targetChallenging': 'Challenging but not impossible!',
            'targetAchievable': 'You can reach your goal!',
            'achievementUnlocked': 'Achievement Unlocked!',
            'achFirstCourse': 'First Course',
            'achFirstCourseDesc': 'Added your first course',
            'achFiveCourses': 'Five Courses',
            'achFiveCoursesDesc': 'Added 5 courses',
            'achTwentyCourses': 'Twenty Courses',
            'achTwentyCoursesDesc': 'Added 20 courses',
            'achFirstAA': 'First AA',
            'achFirstAADesc': 'Got your first AA grade',
            'achHonor': 'Honor Student',
            'achHonorDesc': 'GPA 3.00 and above',
            'achHighHonor': 'High Honor',
            'achHighHonorDesc': 'GPA 3.50 and above',
            'achPerfectGPA': 'Perfect GPA',
            'achPerfectGPADesc': 'GPA 4.00',
            'achFirstSemester': 'First Semester',
            'achFirstSemesterDesc': 'Completed your first semester',
            'achFourSemesters': 'Four Semesters',
            'achFourSemestersDesc': 'Completed 4 semesters',
            'achEightSemesters': 'Eight Semesters',
            'achEightSemestersDesc': 'Completed 8 semesters',
            'achNightOwl': 'Night Owl',
            'achNightOwlDesc': 'Working after midnight',
            'achEarlyBird': 'Early Bird',
            'achEarlyBirdDesc': 'Working early in the morning',
            'achExplorer': 'Explorer',
            'achExplorerDesc': 'Explored all views',
            'noReminders': 'No reminders yet',
            'today': 'Today',
            'tomorrow': 'Tomorrow',
            'fillAllFields': 'Please fill all fields',
            'reminderAdded': 'Reminder added',
            'reminderDeleted': 'Reminder deleted',
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

        if (state.currentView === 'simulation') {
            const currentGrades = Array.from(document.querySelectorAll('.sim-grade-select')).map(s => s.value);
            renderSimulationView();
            if (currentGrades.length > 0) {
                applySimulationGrades(currentGrades);
            }
            renderSavedScenarios();
        }

        if (state.currentView === 'calendar') {
            renderCalendar();
            renderReminders();
        }

        if (state.currentView === 'graduation') {
            calculateGraduationProgress();
        }

        if (state.currentView === 'achievements') {
            renderAchievements();
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
    
    // University grade systems - each university may have different scales
    const universityGradeSystems = {
        boun: {
            name: 'Boğaziçi Üniversitesi',
            grades: {
                'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0,
                'DC': 1.5, 'DD': 1.0, 'FF': 0.0, 'P': null
            },
            retakeable: ['FF', 'DD', 'DC'],
            nonGPA: ['P']
        },
        itu: {
            name: 'İstanbul Teknik Üniversitesi',
            grades: {
                'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0,
                'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0, 'P': null
            },
            retakeable: ['FF', 'FD', 'DD', 'DC'],
            nonGPA: ['P']
        },
        odtu: {
            name: 'Orta Doğu Teknik Üniversitesi',
            grades: {
                'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0,
                'DC': 1.5, 'DD': 1.0, 'FF': 0.0, 'S': null, 'U': 0.0
            },
            retakeable: ['FF', 'DD', 'DC', 'U'],
            nonGPA: ['S']
        },
        koc: {
            name: 'Koç Üniversitesi',
            grades: {
                'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0, 'P': null
            },
            retakeable: ['F', 'D', 'D+'],
            nonGPA: ['P']
        },
        bilkent: {
            name: 'Bilkent Üniversitesi',
            grades: {
                'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0, 'P': null
            },
            retakeable: ['F', 'D', 'D+'],
            nonGPA: ['P']
        },
        sabanci: {
            name: 'Sabancı Üniversitesi',
            grades: {
                'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0, 'P': null
            },
            retakeable: ['F', 'D', 'D+'],
            nonGPA: ['P']
        },
        ytu: {
            name: 'Yıldız Teknik Üniversitesi',
            grades: {
                'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0,
                'DC': 1.5, 'DD': 1.0, 'FF': 0.0, 'G': null
            },
            retakeable: ['FF', 'DD', 'DC'],
            nonGPA: ['G']
        },
        gsu: {
            name: 'Galatasaray Üniversitesi',
            grades: {
                'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5, 'CC': 2.0,
                'DC': 1.5, 'DD': 1.0, 'FF': 0.0, 'P': null
            },
            retakeable: ['FF', 'DD', 'DC'],
            nonGPA: ['P']
        },
        custom: {
            name: 'Özel',
            grades: {
                'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0, 'P': null
            },
            retakeable: ['F', 'D', 'D+'],
            nonGPA: ['P']
        }
    };
    
    // Current university (default: boun)
    let currentUniversity = localStorage.getItem('university') || 'boun';
    
    // Get current grade system
    function getGradeSystem() {
        return universityGradeSystems[currentUniversity] || universityGradeSystems.boun;
    }
    
    // Dynamic grade points based on selected university
    let gradePoints = { ...getGradeSystem().grades };
    let retakeableGrades = [...getGradeSystem().retakeable];
    let nonGPAGrades = [...getGradeSystem().nonGPA];
    
    // Update grade system when university changes
    function updateGradeSystem(universityKey) {
        currentUniversity = universityKey;
        localStorage.setItem('university', universityKey);
        
        const system = getGradeSystem();
        gradePoints = { ...system.grades };
        retakeableGrades = [...system.retakeable];
        nonGPAGrades = [...system.nonGPA];
        
        // Update all course grade selects
        updateAllGradeSelects();
        
        // Recalculate GPA
        calculateGPA();

        // Refresh view-specific content
        if (state.currentView === 'charts') {
            initializeCharts();
        }
        if (state.currentView === 'simulation') {
            initSimulationView();
        }
        if (state.currentView === 'graduation') {
            calculateGraduationProgress();
        }
        if (state.currentView === 'achievements') {
            renderAchievements();
        }
    }
    
    // Update all grade select dropdowns
    function updateAllGradeSelects() {
        document.querySelectorAll('.course-grade').forEach(select => {
            const currentValue = select.value;
            select.innerHTML = `
                <option value="" disabled>${t('calc.grade')}</option>
                ${Object.entries(gradePoints).map(([grade, point]) => 
                    `<option value="${grade}" ${currentValue === grade ? 'selected' : ''}>${grade}</option>`
                ).join('')}
            `;
        });
        
        document.querySelectorAll('.previous-grade').forEach(select => {
            const currentValue = select.value;
            select.innerHTML = `
                <option value="" disabled>${t('calc.previousGrade')}</option>
                ${retakeableGrades.map(grade => 
                    `<option value="${grade}" ${currentValue === grade ? 'selected' : ''}>${grade} (${gradePoints[grade]})</option>`
                ).join('')}
            `;
        });
    }

    function getNumericGradeEntries() {
        return Object.entries(gradePoints).filter(([_, point]) => typeof point === 'number' && !Number.isNaN(point));
    }

    function getSortedNumericGrades(desc = true) {
        const entries = getNumericGradeEntries().sort((a, b) => a[1] - b[1]);
        return desc ? entries.reverse() : entries;
    }

    function formatGradePoint(point) {
        const rounded = Math.round(point * 100) / 100;
        if (Number.isInteger(rounded)) return rounded.toFixed(1);
        return String(rounded);
    }

    function getGradeLabels() {
        const numeric = getSortedNumericGrades(true).map(([grade]) => grade);
        const nonGpa = Object.keys(gradePoints).filter(grade => nonGPAGrades.includes(grade) || gradePoints[grade] === null);
        const labels = [...numeric];
        nonGpa.forEach(grade => {
            if (!labels.includes(grade)) labels.push(grade);
        });
        return labels;
    }

    function getClosestGradeToPoint(targetPoint) {
        const entries = getNumericGradeEntries();
        if (entries.length === 0) return null;
        let closest = entries[0];
        entries.forEach(entry => {
            if (Math.abs(entry[1] - targetPoint) < Math.abs(closest[1] - targetPoint)) {
                closest = entry;
            }
        });
        return closest[0];
    }

    function getGradeAtLeastPoint(targetPoint) {
        const entries = getSortedNumericGrades(false);
        if (entries.length === 0) return null;
        const found = entries.find(([, point]) => point >= targetPoint);
        return (found || entries[entries.length - 1])[0];
    }

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
        baseCredits: 0,      // Total credits before baseSemester
        // New features
        reminders: [],       // Calendar reminders
        achievements: {},    // Unlocked achievements
        scenarios: [],       // Simulation scenarios
        calendarMonth: new Date().getMonth(),
        calendarYear: new Date().getFullYear(),
        // Last calculated values (single source of truth for GPA-related views)
        lastCalculatedGPA: 0,
        lastCalculatedCreditsForGPA: 0,
        lastCalculatedTotalCredits: 0
    };

    const viewInitFlags = {
        simulation: false,
        graduation: false,
        calendar: false
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
        get export() { return t('nav.export'); },
        get simulation() { return t('nav.simulation'); },
        get graduation() { return t('nav.graduation'); },
        get achievements() { return t('nav.achievements'); },
        get calendar() { return t('nav.calendar'); }
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

        // Track views for achievements
        trackViewedView(viewId);
        checkAchievements();
        
        // Initialize view-specific content
        if (viewId === 'charts') {
            initializeCharts();
        } else if (viewId === 'history') {
            renderSemesterHistory();
        } else if (viewId === 'goal') {
            syncGoalInputsFromCalculator();
        } else if (viewId === 'simulation') {
            initSimulationView();
        } else if (viewId === 'graduation') {
            initGraduationView();
        } else if (viewId === 'achievements') {
            initAchievementsView();
        } else if (viewId === 'calendar') {
            initCalendarView();
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
        courseEntry.draggable = true;
        
        // Escape course name for safe HTML attribute insertion
        const escapedName = escapeHtml(courseData.name || '').replace(/"/g, '&quot;');
        
        courseEntry.innerHTML = `
            <div class="drag-handle" title="Sürükle">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="1.5"></circle>
                    <circle cx="15" cy="6" r="1.5"></circle>
                    <circle cx="9" cy="12" r="1.5"></circle>
                    <circle cx="15" cy="12" r="1.5"></circle>
                    <circle cx="9" cy="18" r="1.5"></circle>
                    <circle cx="15" cy="18" r="1.5"></circle>
                </svg>
            </div>
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
        let semesterCreditsForGPA = 0;  // Credits used for GPA calculation (excludes P)
        let totalSemesterCredits = 0;   // All credits including P
        
        document.querySelectorAll('.course-entry').forEach(entry => {
            const credit = parseFloat(entry.querySelector('.course-credit').value);
            const grade = entry.querySelector('.course-grade').value;
            const isRetake = entry.querySelector('.is-retake').checked;
            const previousGrade = entry.querySelector('.previous-grade').value;
            
            if (credit && grade) {
                totalSemesterCredits += credit;
                
                // Handle retake adjustment FIRST (even for P grades, old grade must be removed from cumulative)
                // This ensures that if someone retakes FF and gets P, the FF is still removed
                if (isRetake && previousGrade && !nonGPAGrades.includes(previousGrade)) {
                    retakeCredits += credit;
                    retakeOldPoints += credit * gradePoints[previousGrade];
                }
                
                // P grade doesn't affect GPA but counts as credit
                if (!nonGPAGrades.includes(grade)) {
                    semesterPoints += credit * gradePoints[grade];
                    semesterCreditsForGPA += credit;
                }
            }
        });
        
        semesterCredits = semesterCreditsForGPA;
        
        // Get previous values
        const previousGPA = parseFloat(elements.previousGPAInput.value) || 0;
        const previousCredits = parseFloat(elements.previousCreditsInput.value) || 0;
        const previousPoints = previousGPA * previousCredits;
        
        // Calculate semester GPA
        const semesterGPA = semesterCredits > 0 ? (semesterPoints / semesterCredits) : 0;
        
        // Calculate cumulative GPA (with retake adjustment)
        const adjustedPreviousCredits = Math.max(0, previousCredits - retakeCredits);
        const adjustedPreviousPoints = Math.max(0, previousPoints - retakeOldPoints);
        const creditsForGPA = semesterCredits + adjustedPreviousCredits;
        const totalPoints = semesterPoints + adjustedPreviousPoints;
        const cumulativeGPA = creditsForGPA > 0 ? (totalPoints / creditsForGPA) : 0;
        
        // Total credits includes P grades
        const totalCredits = totalSemesterCredits + adjustedPreviousCredits;
        
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

        state.lastCalculatedGPA = cumulativeGPA;
        state.lastCalculatedCreditsForGPA = creditsForGPA;
        state.lastCalculatedTotalCredits = totalCredits;

        checkAchievements();
        
        // Return both total credits (includes P) and GPA-affecting credits (excludes P)
        return { semesterGPA, cumulativeGPA, totalCredits, creditsForGPA };
    }

    function getCurrentGPAValue() {
        if (typeof state.lastCalculatedGPA === 'number' && !Number.isNaN(state.lastCalculatedGPA)) {
            return state.lastCalculatedGPA;
        }
        return parseFloat(elements.gpa?.textContent) || 0;
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
        const grade = getGradeAtLeastPoint(gpa);
        if (!grade) return '';
        const point = gradePoints[grade];
        if (typeof point !== 'number') return grade;
        return `${grade} (${formatGradePoint(point)})`;
    }

    function syncGoalInputsFromCalculator() {
        // Sync current values from calculator to goal inputs
        // Use creditsForGPA (excludes P) because goal calculation formula requires GPA-affecting credits
        const { cumulativeGPA, creditsForGPA } = calculateGPA();
        elements.goalCurrentGPA.value = cumulativeGPA.toFixed(2);
        elements.goalCurrentCredits.value = creditsForGPA;
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

    function getSemesterTrendData() {
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
                // Share was cancelled by user
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
        let creditsForGPA = 0;
        
        document.querySelectorAll('.course-entry').forEach(entry => {
            const name = entry.querySelector('.course-name').value.trim();
            const credit = parseFloat(entry.querySelector('.course-credit').value);
            const grade = entry.querySelector('.course-grade').value;
            
            if (credit && grade) {
                courses.push({ name, credit, grade });
                // P grade doesn't affect GPA
                if (!nonGPAGrades.includes(grade)) {
                    totalPoints += credit * gradePoints[grade];
                    creditsForGPA += credit;
                }
            }
        });
        
        if (courses.length > 0) {
            // Save base semester info before first save
            saveBaseSemesterInfo();
            
            state.semesters[semesterId] = {
                courses,
                gpa: creditsForGPA > 0 ? totalPoints / creditsForGPA : 0,
                credits: creditsForGPA  // Credits used for GPA calculation (excludes P)
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
            const semNum = parseInt(semesterId, 10);
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
            const semNum = parseInt(semesterId, 10);
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
        const currentSemesterNum = parseInt(elements.semesterSelect.value, 10) || 0;
        
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
            baseCredits: state.baseCredits,
            // New features
            reminders: state.reminders,
            achievements: state.achievements,
            scenarios: state.scenarios,
            calendarMonth: state.calendarMonth,
            calendarYear: state.calendarYear
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
            
            // Load new features data
            if (Array.isArray(data.reminders)) state.reminders = data.reminders;
            if (data.achievements && typeof data.achievements === 'object') state.achievements = data.achievements;
            if (Array.isArray(data.scenarios)) state.scenarios = data.scenarios;
            if (data.calendarMonth !== undefined) {
                const month = parseInt(data.calendarMonth, 10);
                if (!Number.isNaN(month)) state.calendarMonth = month;
            }
            if (data.calendarYear !== undefined) {
                const year = parseInt(data.calendarYear, 10);
                if (!Number.isNaN(year)) state.calendarYear = year;
            }
            
            // Load semester and history
            if (data.semester) elements.semesterSelect.value = data.semester;
            if (data.semesters) state.semesters = data.semesters;
            
            // Load previous GPA/credits
            const currentSemesterNum = parseInt(data.semester, 10) || 0;
            
            // If we have base info or saved semesters, calculate cumulative
            if (state.baseSemester !== null || Object.keys(state.semesters).length > 0) {
                updatePreviousFromHistory(currentSemesterNum);
            } else {
                // Fallback to saved values (for backward compatibility)
                if (data.previousGPA !== undefined) elements.previousGPAInput.value = data.previousGPA;
                if (data.previousCredits !== undefined) elements.previousCreditsInput.value = data.previousCredits;
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
            let value = parseInt(elements.previousCreditsInput.value, 10);
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
            const currentSemesterNum = parseInt(elements.semesterSelect.value, 10) || 0;
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
        document.getElementById('exportJSON')?.addEventListener('click', exportAsJSON);
        
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
        
        // University selector
        const universitySelect = document.getElementById('universitySelect');
        if (universitySelect) {
            universitySelect.value = currentUniversity;
            universitySelect.addEventListener('change', (e) => {
                updateGradeSystem(e.target.value);
            });
        }
        
        // Feedback modal
        const feedbackBtn = document.getElementById('feedbackBtn');
        const feedbackModal = document.getElementById('feedbackModal');
        const feedbackModalClose = document.getElementById('feedbackModalClose');
        const feedbackForm = document.getElementById('feedbackForm');
        
        feedbackBtn?.addEventListener('click', () => {
            feedbackModal?.classList.add('active');
            closeMobileMenu();
        });
        
        feedbackModalClose?.addEventListener('click', () => {
            feedbackModal?.classList.remove('active');
        });
        
        feedbackModal?.addEventListener('click', (e) => {
            if (e.target === feedbackModal) feedbackModal.classList.remove('active');
        });
        
        feedbackForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you'd send this to a server
            const formData = {
                type: document.getElementById('feedbackType').value,
                message: document.getElementById('feedbackMessage').value,
                email: document.getElementById('feedbackEmail').value
            };
            alert(t('alert.feedbackSuccess'));
            feedbackForm.reset();
            feedbackModal?.classList.remove('active');
        });
        
        // Shortcuts modal
        const shortcutsBtn = document.getElementById('shortcutsBtn');
        const shortcutsModal = document.getElementById('shortcutsModal');
        const shortcutsModalClose = document.getElementById('shortcutsModalClose');
        
        shortcutsBtn?.addEventListener('click', () => {
            shortcutsModal?.classList.add('active');
            closeMobileMenu();
        });
        
        shortcutsModalClose?.addEventListener('click', () => {
            shortcutsModal?.classList.remove('active');
        });
        
        shortcutsModal?.addEventListener('click', (e) => {
            if (e.target === shortcutsModal) shortcutsModal.classList.remove('active');
        });
        
        // Import modal
        const importBtn = document.getElementById('importBtn');
        const importModal = document.getElementById('importModal');
        const importModalClose = document.getElementById('importModalClose');
        const importDataBtn = document.getElementById('importDataBtn');
        const importCancelBtn = document.getElementById('importCancelBtn');
        const importFile = document.getElementById('importFile');
        const importFileName = document.getElementById('importFileName');
        
        importBtn?.addEventListener('click', () => {
            importModal?.classList.add('active');
            closeMobileMenu();
        });
        
        importModalClose?.addEventListener('click', () => {
            importModal?.classList.remove('active');
        });
        
        importCancelBtn?.addEventListener('click', () => {
            importModal?.classList.remove('active');
        });
        
        importModal?.addEventListener('click', (e) => {
            if (e.target === importModal) importModal.classList.remove('active');
        });
        
        importFile?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                importFileName.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('importJson').value = event.target.result;
                };
                reader.readAsText(file);
            }
        });
        
        importDataBtn?.addEventListener('click', () => {
            importData();
        });
    }
    
    // ============================================
    // Keyboard Shortcuts
    // ============================================
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                // Only allow Escape in inputs
                if (e.key === 'Escape') {
                    closeAllModals();
                }
                return;
            }
            
            // Ctrl/Cmd + key shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'n':
                        e.preventDefault();
                        if (state.currentView === 'calculator') {
                            addCourse();
                        } else {
                            switchView('calculator');
                            setTimeout(() => addCourse(), 100);
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        saveCourses();
                        // Visual feedback
                        showToast(currentLanguage === 'tr' ? 'Kaydedildi!' : 'Saved!');
                        break;
                    case 'e':
                        e.preventDefault();
                        switchView('export');
                        break;
                    case 'd':
                        e.preventDefault();
                        switchView('dashboard');
                        break;
                    case 'k':
                        e.preventDefault();
                        switchView('calculator');
                        break;
                    case 't':
                        e.preventDefault();
                        toggleTheme();
                        break;
                    case 'l':
                        e.preventDefault();
                        toggleLanguage();
                        break;
                }
            }
            
            // Single key shortcuts
            if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                switch (e.key) {
                    case '?':
                        elements.helpModal?.classList.add('active');
                        break;
                    case 'Escape':
                        closeAllModals();
                        break;
                }
            }
        });
    }
    
    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
    
    function showToast(message, duration = 2000) {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(t => t.remove());
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 12px 24px;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    // ============================================
    // Import/Export Functions
    // ============================================
    function exportAsJSON() {
        const data = {
            version: '2.1',
            exportDate: new Date().toISOString(),
            university: currentUniversity,
            language: currentLanguage,
            courses: state.courses,
            semester: elements.semesterSelect?.value,
            previousGPA: elements.previousGPAInput?.value,
            previousCredits: elements.previousCreditsInput?.value,
            semesters: state.semesters,
            baseSemester: state.baseSemester,
            baseGPA: state.baseGPA,
            baseCredits: state.baseCredits,
            reminders: state.reminders,
            achievements: state.achievements,
            scenarios: state.scenarios,
            calendarMonth: state.calendarMonth,
            calendarYear: state.calendarYear
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `boun-gpa-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }
    
    function importData() {
        const jsonInput = document.getElementById('importJson');
        const jsonText = jsonInput?.value?.trim();
        
        if (!jsonText) {
            alert(t('alert.importError'));
            return;
        }
        
        try {
            const data = JSON.parse(jsonText);
            
            // Validate data structure
            if (!data.courses && !data.semesters) {
                throw new Error('Invalid data structure');
            }
            
            // Import university setting
            if (data.university && universityGradeSystems[data.university]) {
                updateGradeSystem(data.university);
                const universitySelect = document.getElementById('universitySelect');
                if (universitySelect) universitySelect.value = data.university;
            }
            
            // Import language
            if (data.language) {
                setLanguage(data.language);
            }
            
            // Import base semester info
            if (data.baseSemester !== undefined) state.baseSemester = data.baseSemester;
            if (data.baseGPA !== undefined) state.baseGPA = data.baseGPA;
            if (data.baseCredits !== undefined) state.baseCredits = data.baseCredits;
            
            // Import semester and history
            if (data.semester && elements.semesterSelect) {
                elements.semesterSelect.value = data.semester;
            }
            if (data.semesters) state.semesters = data.semesters;
            
            // Import previous GPA/credits
            if (data.previousGPA !== undefined && elements.previousGPAInput) {
                elements.previousGPAInput.value = data.previousGPA;
            }
            if (data.previousCredits !== undefined && elements.previousCreditsInput) {
                elements.previousCreditsInput.value = data.previousCredits;
            }

            // Import reminders and other extras
            if (Array.isArray(data.reminders)) state.reminders = data.reminders;
            if (data.achievements && typeof data.achievements === 'object') state.achievements = data.achievements;
            if (Array.isArray(data.scenarios)) state.scenarios = data.scenarios;
            if (data.calendarMonth !== undefined) {
                const month = parseInt(data.calendarMonth, 10);
                if (!Number.isNaN(month)) state.calendarMonth = month;
            }
            if (data.calendarYear !== undefined) {
                const year = parseInt(data.calendarYear, 10);
                if (!Number.isNaN(year)) state.calendarYear = year;
            }
            
            // Import courses
            if (data.courses && elements.courseList) {
                elements.courseList.innerHTML = '';
                data.courses.forEach(course => addCourse(course));
            }
            
            // Save and update
            saveToLocalStorage();
            updateCoursesEmptyState();
            calculateGPA();

            if (state.currentView === 'calendar') {
                renderCalendar();
                renderReminders();
            }
            if (state.currentView === 'simulation') {
                initSimulationView();
            }
            if (state.currentView === 'achievements') {
                renderAchievements();
            }
            if (state.currentView === 'graduation') {
                calculateGraduationProgress();
            }
            
            // Close modal
            document.getElementById('importModal')?.classList.remove('active');
            
            alert(t('alert.importSuccess'));
            
        } catch (error) {
            console.error('Import error:', error);
            alert(t('alert.importError'));
        }
    }
    
    // ============================================
    // Drag and Drop for Courses
    // ============================================
    function initDragAndDrop() {
        let draggedItem = null;
        
        elements.courseList?.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('course-entry')) {
                draggedItem = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        
        elements.courseList?.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('course-entry')) {
                e.target.classList.remove('dragging');
                draggedItem = null;
                saveCourses();
            }
        });
        
        elements.courseList?.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(elements.courseList, e.clientY);
            const dragging = document.querySelector('.dragging');
            if (dragging) {
                if (afterElement == null) {
                    elements.courseList.appendChild(dragging);
                } else {
                    elements.courseList.insertBefore(dragging, afterElement);
                }
            }
        });
    }
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.course-entry:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // ============================================
    // Initialization
    // ============================================
    function initLanguage() {
        currentLanguage = localStorage.getItem('language') || 'tr';
        translatePage();
        updateLangToggle();
    }
    
    function initUniversity() {
        currentUniversity = localStorage.getItem('university') || 'boun';
        const universitySelect = document.getElementById('universitySelect');
        if (universitySelect) {
            universitySelect.value = currentUniversity;
        }
        // Update grade system
        const system = getGradeSystem();
        gradePoints = { ...system.grades };
        retakeableGrades = [...system.retakeable];
        nonGPAGrades = [...system.nonGPA];
    }

    // ============================================
    // Simulation View Functions
    // ============================================
    function initSimulationView() {
        renderSimulationView();
        renderSavedScenarios();
        if (!viewInitFlags.simulation) {
            setupSimulationEventListeners();
            viewInitFlags.simulation = true;
        }
    }
    
    function renderSimulationView() {
        const container = document.getElementById('simulationCourses');
        if (!container) return;
        
        // Get current courses for simulation
        const courses = state.courses.length > 0 ? state.courses : getSampleCourses();
        const fallbackGrade = getSortedNumericGrades(true)[0]?.[0] || Object.keys(gradePoints)[0] || '';
        
        container.innerHTML = courses.map((course, index) => `
            <div class="simulation-course" data-index="${index}">
                <div class="sim-course-info">
                    <span class="sim-course-name">${course.name || t('course') + ' ' + (index + 1)}</span>
                    <span class="sim-course-credits">${course.credits ?? course.credit ?? 3} ${t('credits')}</span>
                </div>
                <select class="sim-grade-select" data-index="${index}">
                    ${Object.keys(gradePoints).map(grade => 
                        `<option value="${grade}" ${(gradePoints[course.grade] !== undefined ? course.grade : fallbackGrade) === grade ? 'selected' : ''}>${grade}</option>`
                    ).join('')}
                </select>
            </div>
        `).join('');
        
        calculateSimulationGPA();
    }
    
    function getSampleCourses() {
        const targets = [4.0, 3.5, 3.0, 2.5];
        const grades = targets.map(point => getClosestGradeToPoint(point)).filter(Boolean);
        const fallbackGrade = getSortedNumericGrades(true)[0]?.[0] || Object.keys(gradePoints)[0] || '';
        return [
            { name: t('course') + ' 1', credits: 3, grade: grades[0] || fallbackGrade },
            { name: t('course') + ' 2', credits: 3, grade: grades[1] || fallbackGrade },
            { name: t('course') + ' 3', credits: 4, grade: grades[2] || fallbackGrade },
            { name: t('course') + ' 4', credits: 3, grade: grades[3] || fallbackGrade }
        ];
    }
    
    function calculateSimulationGPA() {
        const selects = document.querySelectorAll('.sim-grade-select');
        const courses = state.courses.length > 0 ? state.courses : getSampleCourses();
        
        let totalPoints = 0;
        let totalCredits = 0;
        
        selects.forEach((select, index) => {
            const grade = select.value;
            const credits = parseFloat(courses[index]?.credits ?? courses[index]?.credit) || 3;
            
            if (!nonGPAGrades.includes(grade) && gradePoints[grade] !== undefined) {
                totalPoints += gradePoints[grade] * credits;
                totalCredits += credits;
            }
        });
        
        const simGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
        
        const resultEl = document.getElementById('simulatedGPA');
        const changeEl = document.getElementById('gpaChange');
        
        if (resultEl) resultEl.textContent = simGPA;
        
        if (changeEl) {
            const currentGPA = getCurrentGPAValue();
            const change = (parseFloat(simGPA) - currentGPA).toFixed(2);
            const prefix = change >= 0 ? '+' : '';
            changeEl.textContent = `(${prefix}${change})`;
            changeEl.className = 'gpa-change ' + (change >= 0 ? 'positive' : 'negative');
        }
    }
    
    function setupSimulationEventListeners() {
        // Grade select changes
        document.getElementById('simulationCourses')?.addEventListener('change', (e) => {
            if (e.target.classList.contains('sim-grade-select')) {
                calculateSimulationGPA();
            }
        });
        
        // Quick scenario buttons
        document.querySelectorAll('.quick-scenario-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scenario = btn.dataset.scenario;
                applyQuickScenario(scenario);
            });
        });
        
        // Save scenario button
        document.getElementById('saveScenarioBtn')?.addEventListener('click', saveCurrentScenario);
        
        // Reset simulation
        document.getElementById('resetSimulationBtn')?.addEventListener('click', () => {
            renderSimulationView();
        });

        // Saved scenarios actions
        document.getElementById('savedScenarios')?.addEventListener('click', (e) => {
            const loadBtn = e.target.closest('.load-scenario-btn');
            const deleteBtn = e.target.closest('.delete-scenario-btn');
            if (loadBtn) {
                const id = parseInt(loadBtn.dataset.id, 10);
                loadScenario(id);
            }
            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id, 10);
                deleteScenario(id);
            }
        });
    }
    
    function applyQuickScenario(scenario) {
        const selects = document.querySelectorAll('.sim-grade-select');
        const gradeKeys = Object.keys(gradePoints).filter(g => !nonGPAGrades.includes(g));
        const topGrade = getSortedNumericGrades(true)[0]?.[0] || gradeKeys[0];
        const midGrade = getClosestGradeToPoint(3.0) || topGrade;
        const lowGrade = getClosestGradeToPoint(2.0) || topGrade;

        if (gradeKeys.length === 0) return;
        
        selects.forEach(select => {
            switch(scenario) {
                case 'all-aa':
                    select.value = topGrade;
                    break;
                case 'all-bb':
                    select.value = midGrade;
                    break;
                case 'all-cc':
                    select.value = lowGrade;
                    break;
                case 'random':
                    select.value = gradeKeys[Math.floor(Math.random() * gradeKeys.length)];
                    break;
            }
        });
        
        calculateSimulationGPA();
    }
    
    function saveCurrentScenario() {
        const selects = document.querySelectorAll('.sim-grade-select');
        const grades = Array.from(selects).map(s => s.value);
        const simGPA = document.getElementById('simulatedGPA')?.textContent || '0.00';
        
        const scenario = {
            id: Date.now(),
            name: `${t('scenario')} ${state.scenarios.length + 1}`,
            grades: grades,
            gpa: simGPA,
            date: new Date().toLocaleDateString()
        };
        
        state.scenarios.push(scenario);
        saveToLocalStorage();
        renderSavedScenarios();
        showToast(t('scenarioSaved'));
    }
    
    function renderSavedScenarios() {
        const container = document.getElementById('savedScenarios');
        if (!container) return;
        
        if (state.scenarios.length === 0) {
            container.innerHTML = `<p class="empty-message">${t('noSavedScenarios')}</p>`;
            return;
        }
        
        container.innerHTML = state.scenarios.map(scenario => `
            <div class="scenario-card" data-id="${scenario.id}">
                <div class="scenario-info">
                    <span class="scenario-name">${scenario.name}</span>
                    <span class="scenario-gpa">GPA: ${scenario.gpa}</span>
                </div>
                <div class="scenario-actions">
                    <button class="load-scenario-btn" data-id="${scenario.id}">${t('load')}</button>
                    <button class="delete-scenario-btn" data-id="${scenario.id}">&times;</button>
                </div>
            </div>
        `).join('');
    }

    function applySimulationGrades(grades) {
        const selects = document.querySelectorAll('.sim-grade-select');
        grades.forEach((grade, index) => {
            if (selects[index]) {
                selects[index].value = grade;
            }
        });
        calculateSimulationGPA();
    }

    function loadScenario(id) {
        const scenario = state.scenarios.find(s => s.id === id);
        if (!scenario) return;
        applySimulationGrades(scenario.grades || []);
    }

    function deleteScenario(id) {
        state.scenarios = state.scenarios.filter(s => s.id !== id);
        saveToLocalStorage();
        renderSavedScenarios();
    }

    // ============================================
    // Graduation Calculator Functions
    // ============================================
    function initGraduationView() {
        if (!viewInitFlags.graduation) {
            setupGraduationEventListeners();
            viewInitFlags.graduation = true;
        }
        calculateGraduationProgress();
    }
    
    function setupGraduationEventListeners() {
        document.getElementById('calculateGraduationBtn')?.addEventListener('click', calculateGraduationProgress);
        
        // Auto-calculate on input change
        ['targetCredits', 'targetGPA'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', calculateGraduationProgress);
        });
    }
    
    function calculateGraduationProgress() {
        const targetCreditsInput = document.getElementById('targetCredits');
        const targetGPAInput = document.getElementById('targetGPA');
        
        const targetCredits = parseFloat(targetCreditsInput?.value) || 140;
        const targetGPA = parseFloat(targetGPAInput?.value) || 2.50;
        
        // Calculate current stats
        calculateGPA();
        const currentCredits = calculateTotalCredits();
        const currentGPA = getCurrentGPAValue();
        
        // Remaining credits
        const remainingCredits = Math.max(0, targetCredits - currentCredits);
        
        // Required GPA for remaining courses
        const currentPoints = currentGPA * currentCredits;
        const targetPoints = targetGPA * targetCredits;
        const neededPoints = targetPoints - currentPoints;
        const requiredGPA = remainingCredits > 0 ? (neededPoints / remainingCredits).toFixed(2) : 0;
        
        // Update UI
        updateGraduationUI({
            currentCredits,
            targetCredits,
            remainingCredits,
            currentGPA,
            targetGPA,
            requiredGPA
        });
        
        // Check honor status
        updateHonorStatus(currentGPA);
    }
    
    function calculateTotalCredits() {
        let total = state.baseCredits || 0;
        
        Object.values(state.semesters).forEach(semester => {
            semester.courses.forEach(course => {
                total += parseFloat(course.credits ?? course.credit) || 0;
            });
        });
        
        // Add current semester courses
        state.courses.forEach(course => {
            total += parseFloat(course.credits ?? course.credit) || 0;
        });
        
        return total;
    }
    
    function updateGraduationUI(data) {
        // Credit progress
        const creditProgress = Math.min(100, (data.currentCredits / data.targetCredits) * 100);
        const creditFill = document.getElementById('creditProgressFill');
        const creditText = document.getElementById('creditProgressText');
        
        if (creditFill) creditFill.style.width = `${creditProgress}%`;
        if (creditText) creditText.textContent = `${data.currentCredits} / ${data.targetCredits} ${t('credits')}`;
        
        // GPA progress
        const gpaProgress = Math.min(100, (data.currentGPA / 4.0) * 100);
        const gpaFill = document.getElementById('gpaProgressFill');
        const gpaText = document.getElementById('gpaProgressText');
        
        if (gpaFill) gpaFill.style.width = `${gpaProgress}%`;
        if (gpaText) gpaText.textContent = `${data.currentGPA.toFixed(2)} / 4.00`;
        
        // Required GPA display
        const requiredEl = document.getElementById('requiredGPA');
        if (requiredEl) {
            const reqGPA = parseFloat(data.requiredGPA);
            requiredEl.textContent = data.requiredGPA;
            requiredEl.className = 'required-gpa-value ' + (reqGPA > 4.0 ? 'impossible' : reqGPA > 3.5 ? 'hard' : 'achievable');
        }
        
        // Remaining credits
        const remainingEl = document.getElementById('remainingCredits');
        if (remainingEl) remainingEl.textContent = data.remainingCredits;
        
        // Graduation message
        const messageEl = document.getElementById('graduationMessage');
        if (messageEl) {
            const reqGPA = parseFloat(data.requiredGPA);
            if (data.remainingCredits === 0) {
                messageEl.innerHTML = `<span class="success">🎓 ${t('graduationComplete')}</span>`;
            } else if (reqGPA > 4.0) {
                messageEl.innerHTML = `<span class="warning">⚠️ ${t('targetUnreachable')}</span>`;
            } else if (reqGPA > 3.5) {
                messageEl.innerHTML = `<span class="caution">${t('targetChallenging')}</span>`;
            } else {
                messageEl.innerHTML = `<span class="good">${t('targetAchievable')}</span>`;
            }
        }
    }
    
    function updateHonorStatus(gpa) {
        const badges = document.querySelectorAll('.honor-badge');
        badges.forEach(badge => {
            const minGPA = parseFloat(badge.dataset.mingpa);
            if (gpa >= minGPA) {
                badge.classList.add('achieved');
            } else {
                badge.classList.remove('achieved');
            }
        });
    }

    // ============================================
    // Achievements View Functions
    // ============================================
    const achievementsList = [
        { id: 'first_course', icon: '📚', nameKey: 'achFirstCourse', descKey: 'achFirstCourseDesc', condition: (s) => getTotalCourseCount(s) >= 1 },
        { id: 'five_courses', icon: '📖', nameKey: 'achFiveCourses', descKey: 'achFiveCoursesDesc', condition: (s) => getTotalCourseCount(s) >= 5 },
        { id: 'twenty_courses', icon: '🎒', nameKey: 'achTwentyCourses', descKey: 'achTwentyCoursesDesc', condition: (s) => getTotalCourseCount(s) >= 20 },
        { id: 'first_aa', icon: '⭐', nameKey: 'achFirstAA', descKey: 'achFirstAADesc', condition: (s) => hasGrade(s, 'AA') },
        { id: 'honor_student', icon: '🏆', nameKey: 'achHonor', descKey: 'achHonorDesc', condition: (s) => getCurrentGPA() >= 3.00 },
        { id: 'high_honor', icon: '🥇', nameKey: 'achHighHonor', descKey: 'achHighHonorDesc', condition: (s) => getCurrentGPA() >= 3.50 },
        { id: 'perfect_gpa', icon: '💎', nameKey: 'achPerfectGPA', descKey: 'achPerfectGPADesc', condition: (s) => getCurrentGPA() >= 3.995 },
        { id: 'first_semester', icon: '📅', nameKey: 'achFirstSemester', descKey: 'achFirstSemesterDesc', condition: (s) => Object.keys(s.semesters).length >= 1 },
        { id: 'four_semesters', icon: '🎯', nameKey: 'achFourSemesters', descKey: 'achFourSemestersDesc', condition: (s) => Object.keys(s.semesters).length >= 4 },
        { id: 'eight_semesters', icon: '🎓', nameKey: 'achEightSemesters', descKey: 'achEightSemestersDesc', condition: (s) => Object.keys(s.semesters).length >= 8 },
        { id: 'night_owl', icon: '🦉', nameKey: 'achNightOwl', descKey: 'achNightOwlDesc', condition: () => new Date().getHours() >= 0 && new Date().getHours() < 6 },
        { id: 'early_bird', icon: '🐦', nameKey: 'achEarlyBird', descKey: 'achEarlyBirdDesc', condition: () => new Date().getHours() >= 5 && new Date().getHours() < 8 },
        { id: 'explorer', icon: '🔍', nameKey: 'achExplorer', descKey: 'achExplorerDesc', condition: () => (localStorage.getItem('viewedViews')?.split(',') ?? []).length >= 5 }
    ];
    
    function getTotalCourseCount(s) {
        let count = s.courses.length;
        Object.values(s.semesters).forEach(sem => {
            count += sem.courses.length;
        });
        return count;
    }
    
    function hasGrade(s, grade) {
        if (s.courses.some(c => c.grade === grade)) return true;
        return Object.values(s.semesters).some(sem => sem.courses.some(c => c.grade === grade));
    }
    
    function getCurrentGPA() {
        return getCurrentGPAValue();
    }
    
    function initAchievementsView() {
        checkAchievements();
        renderAchievements();
    }
    
    function checkAchievements() {
        const newlyUnlocked = [];
        
        achievementsList.forEach(ach => {
            const wasUnlocked = state.achievements[ach.id];
            const isNowUnlocked = ach.condition(state);
            
            if (!wasUnlocked && isNowUnlocked) {
                state.achievements[ach.id] = {
                    unlockedAt: new Date().toISOString()
                };
                newlyUnlocked.push(ach);
            }
        });
        
        if (newlyUnlocked.length > 0) {
            saveToLocalStorage();
            newlyUnlocked.forEach(ach => {
                showAchievementNotification(ach);
            });
        }

        if (state.currentView === 'achievements') {
            renderAchievements();
        }
        
        return newlyUnlocked;
    }
    
    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <span class="achievement-title">${t('achievementUnlocked')}</span>
                <span class="achievement-name">${t(achievement.nameKey)}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    function renderAchievements() {
        const container = document.getElementById('achievementsList');
        if (!container) return;
        
        const unlockedCount = Object.keys(state.achievements).length;
        const totalCount = achievementsList.length;
        
        // Update progress
        const progressEl = document.getElementById('achievementProgress');
        if (progressEl) {
            progressEl.textContent = `${unlockedCount} / ${totalCount}`;
        }
        
        const progressFill = document.getElementById('achievementProgressFill');
        if (progressFill) {
            progressFill.style.width = `${(unlockedCount / totalCount) * 100}%`;
        }
        
        // Render badges
        container.innerHTML = achievementsList.map(ach => {
            const isUnlocked = !!state.achievements[ach.id];
            const unlockedDate = isUnlocked ? new Date(state.achievements[ach.id].unlockedAt).toLocaleDateString() : '';
            
            return `
                <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-icon">${isUnlocked ? ach.icon : '🔒'}</div>
                    <div class="badge-info">
                        <span class="badge-name">${t(ach.nameKey)}</span>
                        <span class="badge-desc">${t(ach.descKey)}</span>
                        ${isUnlocked ? `<span class="badge-date">${unlockedDate}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // ============================================
    // Calendar View Functions
    // ============================================
    function initCalendarView() {
        renderCalendar();
        renderReminders();
        if (!viewInitFlags.calendar) {
            setupCalendarEventListeners();
            viewInitFlags.calendar = true;
        }
    }
    
    function renderCalendar() {
        const container = document.getElementById('calendarGrid');
        const monthLabel = document.getElementById('currentMonth');
        if (!container) return;
        
        const year = state.calendarYear;
        const month = state.calendarMonth;
        
        const monthNames = currentLanguage === 'tr' 
            ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
            : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        if (monthLabel) monthLabel.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Day headers
        const dayNames = currentLanguage === 'tr' 
            ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        let html = dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join('');
        
        // Adjust for Monday start
        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        
        // Empty cells before first day
        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }
        
        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = date.toDateString() === today.toDateString();
            const hasReminder = state.reminders.some(r => r.date === dateStr);
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasReminder ? 'has-reminder' : ''}" 
                     data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                    ${hasReminder ? '<span class="reminder-dot"></span>' : ''}
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    function renderReminders() {
        const container = document.getElementById('remindersList');
        if (!container) return;
        
        // Sort by date
        const sortedReminders = [...state.reminders].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA - dateB;
        });
        
        // Filter upcoming
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = sortedReminders.filter(r => new Date(`${r.date}T${r.time || '00:00'}`) >= today);
        
        if (upcoming.length === 0) {
            container.innerHTML = `<p class="empty-message">${t('noReminders')}</p>`;
            return;
        }
        
        container.innerHTML = upcoming.map(reminder => {
            const date = new Date(reminder.date);
            const isToday = date.toDateString() === today.toDateString();
            const isTomorrow = date.toDateString() === new Date(today.getTime() + 86400000).toDateString();
            
            let dateLabel = date.toLocaleDateString();
            if (isToday) dateLabel = t('today');
            if (isTomorrow) dateLabel = t('tomorrow');
            const timeLabel = reminder.time ? ` • ${reminder.time}` : '';
            const normalizedType = normalizeReminderType(reminder.type);
            const safeTitle = escapeHtml(reminder.title);
            const safeCourse = reminder.course ? escapeHtml(reminder.course) : '';
            const safeNotes = reminder.notes ? escapeHtml(reminder.notes) : '';
            
            return `
                <div class="reminder-card ${normalizedType}" data-id="${reminder.id}">
                    <div class="reminder-icon">${getReminderIcon(normalizedType)}</div>
                    <div class="reminder-content">
                        <span class="reminder-title">${safeTitle}</span>
                        <span class="reminder-date">${dateLabel}${timeLabel}</span>
                        ${safeCourse ? `<span class="reminder-meta">${t('calendar.reminderCourse')}: ${safeCourse}</span>` : ''}
                        ${safeNotes ? `<span class="reminder-meta">${t('calendar.reminderNotes')}: ${safeNotes}</span>` : ''}
                    </div>
                    <button class="delete-reminder-btn" data-id="${reminder.id}">&times;</button>
                </div>
            `;
        }).join('');
    }
    
    function getReminderIcon(type) {
        const normalizedType = normalizeReminderType(type);
        const icons = {
            midterm: '📝',
            final: '📋',
            assignment: '📄',
            project: '💻',
            exam: '📝',
            other: '📌'
        };
        return icons[normalizedType] || icons.other;
    }

    function normalizeReminderType(type) {
        if (!type) return 'midterm';
        if (type === 'exam') return 'midterm';
        return type;
    }
    
    function setupCalendarEventListeners() {
        // Month navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            state.calendarMonth--;
            if (state.calendarMonth < 0) {
                state.calendarMonth = 11;
                state.calendarYear--;
            }
            renderCalendar();
            saveToLocalStorage();
        });
        
        document.getElementById('nextMonth')?.addEventListener('click', () => {
            state.calendarMonth++;
            if (state.calendarMonth > 11) {
                state.calendarMonth = 0;
                state.calendarYear++;
            }
            renderCalendar();
            saveToLocalStorage();
        });
        
        // Click on day
        document.getElementById('calendarGrid')?.addEventListener('click', (e) => {
            const dayEl = e.target.closest('.calendar-day:not(.empty)');
            if (dayEl) {
                const date = dayEl.dataset.date;
                openReminderModal(date);
            }
        });
        
        // Add reminder button
        document.getElementById('addReminderBtn')?.addEventListener('click', () => {
            const today = new Date().toISOString().split('T')[0];
            openReminderModal(today);
        });
        
        // Quick add buttons
        document.querySelectorAll('.quick-add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const today = new Date().toISOString().split('T')[0];
                openReminderModal(today, type);
            });
        });
        
        // Reminder modal
        const reminderForm = document.getElementById('reminderForm');
        const reminderModal = document.getElementById('reminderModal');
        const reminderModalClose = document.getElementById('reminderModalClose');

        reminderForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            saveReminder();
        });

        reminderModalClose?.addEventListener('click', closeReminderModal);

        reminderModal?.addEventListener('click', (e) => {
            if (e.target === reminderModal) closeReminderModal();
        });
        
        // Delete reminder
        document.getElementById('remindersList')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-reminder-btn')) {
                const id = parseInt(e.target.dataset.id, 10);
                deleteReminder(id);
            }
        });
    }
    
    function openReminderModal(date, type = 'midterm') {
        const modal = document.getElementById('reminderModal');
        if (!modal) return;
        
        document.getElementById('reminderDate').value = date;
        document.getElementById('reminderType').value = normalizeReminderType(type);
        document.getElementById('reminderTitle').value = '';
        document.getElementById('reminderTime').value = '09:00';
        document.getElementById('reminderCourse').value = '';
        document.getElementById('reminderNotes').value = '';
        
        modal.classList.add('active');
    }
    
    function closeReminderModal() {
        const modal = document.getElementById('reminderModal');
        if (modal) modal.classList.remove('active');
    }
    
    function saveReminder() {
        const title = document.getElementById('reminderTitle')?.value.trim();
        const date = document.getElementById('reminderDate')?.value;
        const type = normalizeReminderType(document.getElementById('reminderType')?.value);
        const time = document.getElementById('reminderTime')?.value || '09:00';
        const course = document.getElementById('reminderCourse')?.value.trim() || '';
        const notes = document.getElementById('reminderNotes')?.value.trim() || '';
        
        if (!title || !date) {
            showToast(t('fillAllFields'));
            return;
        }
        
        const reminder = {
            id: Date.now(),
            title,
            date,
            type,
            time,
            course,
            notes
        };
        
        state.reminders.push(reminder);
        saveToLocalStorage();
        
        closeReminderModal();
        renderCalendar();
        renderReminders();
        showToast(t('reminderAdded'));
    }
    
    function deleteReminder(id) {
        state.reminders = state.reminders.filter(r => r.id !== id);
        saveToLocalStorage();
        renderCalendar();
        renderReminders();
        showToast(t('reminderDeleted'));
    }
    
    // Track viewed views for explorer achievement
    function trackViewedView(view) {
        const viewed = localStorage.getItem('viewedViews')?.split(',') || [];
        if (!viewed.includes(view)) {
            viewed.push(view);
            localStorage.setItem('viewedViews', viewed.join(','));
        }
    }

    function init() {
        initTheme();
        initLanguage();
        initUniversity();
        initNavigation();
        initEventListeners();
        initHelpModal();
        initKeyboardShortcuts();
        initDragAndDrop();
        loadFromLocalStorage();
        updateCoursesEmptyState();
        calculateGPA();
    }

    init();
});
