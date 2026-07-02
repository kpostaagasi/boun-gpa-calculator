/**
 * BOUN GPA Calculator — Internationalization / Translation System
 *
 * Provides translation lookups, language switching, and view refresh registration
 * so feature modules can react to language changes.
 */
import { state, elements } from './state.js';

// ============================================
// Translation Data
// ============================================
export const translations = {
    tr: {
        // ===== BOUN Pusula (SuperApp) =====
        'brand.name': 'Pusula',
        'brand.tagline': 'Boğaziçili öğrencinin günlük pusulası',

        // Nav sections + new modules
        'nav.daily': 'Günlük',
        'nav.academic': 'Akademik',
        'nav.home': 'Bugün',
        'nav.schedule': 'Ders Programı',
        'nav.planner': 'Sınav & Ödev',
        'nav.notes': 'Notlar & Görevler',
        'nav.campus': 'Kampüs',
        'nav.gradeGuide': 'Not Rehberi',

        // Day labels (0 = Monday)
        'day.mon': 'Pzt', 'day.tue': 'Sal', 'day.wed': 'Çar', 'day.thu': 'Per',
        'day.fri': 'Cum', 'day.sat': 'Cmt', 'day.sun': 'Paz',

        // Common
        'common.save': 'Kaydet', 'common.cancel': 'İptal', 'common.delete': 'Sil',
        'common.edit': 'Düzenle', 'common.add': 'Ekle', 'common.close': 'Kapat',

        // Home hub
        'home.greetingMorning': 'Günaydın', 'home.greetingAfternoon': 'İyi günler',
        'home.greetingEvening': 'İyi akşamlar', 'home.greetingNight': 'İyi geceler',
        'home.todayClasses': 'Bugünkü Dersler',
        'home.noClassesToday': 'Bugün dersin yok',
        'home.noClassesTodayCta': 'Ders programını oluştur',
        'home.nextDeadline': 'Sonraki Teslim',
        'home.noDeadlines': 'Yaklaşan teslim yok',
        'home.addDeadlineCta': 'Sınav/ödev ekle',
        'home.dueSoon': 'Yaklaşanlar',
        'home.noDueSoon': 'Yakında teslim yok',
        'home.nextRing': 'Sonraki Ring / Servis',
        'home.gpaSnapshot': 'GPA Özeti',
        'home.launcher': 'Modüller',
        'home.now': 'şimdi',
        'home.startsIn': '{n} dk sonra',
        'home.overdue': 'gecikti',
        'home.dueToday': 'bugün',
        'home.dueTomorrow': 'yarın',
        'home.daysLeft': '{n} gün',
        'home.pinnedNotes': 'Sabit not',
        'home.openTasks': 'Açık görev',

        // Schedule
        'schedule.title': 'Haftalık Ders Programı',
        'schedule.desc': 'Derslerini gün ve saatleriyle ekle, haftalık programını gör',
        'schedule.addCourse': 'Ders Ekle',
        'schedule.name': 'Ders Adı', 'schedule.code': 'Kod',
        'schedule.instructor': 'Öğretim Üyesi', 'schedule.location': 'Derslik',
        'schedule.color': 'Renk', 'schedule.day': 'Gün',
        'schedule.start': 'Başlangıç', 'schedule.end': 'Bitiş',
        'schedule.addBlock': 'Saat Ekle', 'schedule.noBlocks': 'Henüz saat eklenmedi',
        'schedule.showSaturday': 'Cumartesiyi göster',
        'schedule.pullFromGPA': 'GPA dönemimden ders çek',
        'schedule.empty': 'Henüz ders eklenmedi',
        'schedule.emptyDesc': 'Haftalık programını oluşturmak için "Ders Ekle"ye dokun.',
        'schedule.overlap': 'Çakışan dersler var',
        'schedule.saved': 'Ders programı kaydedildi',

        // Planner
        'planner.title': 'Sınav & Ödev Planı',
        'planner.desc': 'Sınav, ödev ve projelerini geri sayımla takip et',
        'planner.add': 'Yeni Ekle',
        'planner.titleField': 'Başlık', 'planner.type': 'Tür',
        'planner.course': 'Ders', 'planner.due': 'Teslim Tarihi',
        'planner.weight': 'Ağırlık (%)', 'planner.location': 'Yer',
        'planner.typeExam': 'Sınav', 'planner.typeAssignment': 'Ödev',
        'planner.typeQuiz': 'Quiz', 'planner.typeProject': 'Proje',
        'planner.markDone': 'Tamamlandı', 'planner.markUndone': 'Geri al',
        'planner.completed': 'Tamamlananlar',
        'planner.overdue': 'gecikti', 'planner.dueToday': 'bugün',
        'planner.dueTomorrow': 'yarın', 'planner.daysLeft': '{n} gün kaldı',
        'planner.hoursLeft': '{n} saat kaldı',
        'planner.empty': 'Planda hiçbir şey yok',
        'planner.emptyDesc': 'Sınav veya ödev eklemek için "Yeni Ekle"ye dokun.',
        'planner.exportIcs': 'Takvime Aktar (.ics)',
        'planner.saved': 'Plan kaydedildi',

        // Notes & Tasks
        'notes.title': 'Notlar & Görevler',
        'notes.desc': 'Hızlı notlar ve yapılacaklar listesi',
        'notes.notesTab': 'Notlar', 'notes.tasksTab': 'Görevler',
        'notes.quickAddNote': 'Hızlı not ekle...',
        'notes.quickAddTask': 'Yeni görev...',
        'notes.noteTitle': 'Başlık', 'notes.noteBody': 'İçerik',
        'notes.search': 'Notlarda ara...',
        'notes.pin': 'Sabitle', 'notes.unpin': 'Sabiti kaldır',
        'notes.emptyNotes': 'Henüz not yok',
        'notes.emptyNotesDesc': 'Yukarıdan hızlıca bir not ekle.',
        'notes.emptyTasks': 'Görev yok',
        'notes.emptyTasksDesc': 'Yukarıdan yapılacak bir görev ekle.',
        'notes.saved': 'Kaydedildi',

        // Campus
        'campus.title': 'Kampüs Servisleri',
        'campus.desc': 'Resmi bağlantılar, ulaşım saatleri ve önemli numaralar',
        'campus.links': 'Resmi Bağlantılar',
        'campus.transport': 'Ulaşım (Ring & Servis)',
        'campus.contacts': 'Acil & Önemli Numaralar',
        'campus.nextDeparture': 'Sonraki kalkış',
        'campus.weekday': 'Hafta içi', 'campus.weekend': 'Hafta sonu',
        'campus.lastUpdated': 'Son güncelleme',
        'campus.call': 'Ara', 'campus.open': 'Aç',

        // Grade Guide
        'guide.title': 'Not Sistemi Rehberi',
        'guide.desc': 'BOUN not sistemi, onur eşikleri ve sık sorulanlar',
        'guide.gradeTable': 'Not - Katsayı Tablosu',
        'guide.grade': 'Not', 'guide.points': 'Katsayı',
        'guide.nonGpa': 'GPA\'ya katılmayan notlar',
        'guide.nonGpaDesc': 'P (Geçer) notu krediye sayılır ama ortalamaya katılmaz.',
        'guide.honorTitle': 'Onur Durumu',
        'guide.honor': 'Onur Öğrencisi (GPA ≥ 3.00)',
        'guide.highHonor': 'Yüksek Onur Öğrencisi (GPA ≥ 3.50)',
        'guide.retakeTitle': 'Tekrar Ders Kuralları',
        'guide.retakeDesc': 'FF, DD veya DC alınan dersler tekrar alınabilir. Tekrarda eski notun katkısı kümülatif GPA\'dan çıkarılır, yeni not eklenir.',
        'guide.faqTitle': 'Sık Sorulanlar',
        'guide.faq1Q': 'GPA nasıl hesaplanır?',
        'guide.faq1A': 'Her dersin kredisi ile not katsayısı çarpılır, toplam kredilere bölünür.',
        'guide.faq2Q': 'P notu ortalamamı etkiler mi?',
        'guide.faq2A': 'Hayır. P notu toplam krediye sayılır ama GPA hesabına girmez.',
        'guide.faq3Q': 'Onur öğrencisi olmak için kaç GPA gerekir?',
        'guide.faq3A': '3.00 ve üzeri Onur, 3.50 ve üzeri Yüksek Onur sayılır.',
        'guide.openCalculator': 'Hesaplayıcıyı Aç',

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
        'calc.previousInfoDesc': 'Varsa önceki dönemlerden gelen GPA\'ya dahil kredi ve not bilgilerinizi girin',
        'calc.previousGpa': 'Önceki GPA',
        'calc.previousCredits': 'GPA\'ya Dahil Kredi',
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
        'fillAllFields': 'Lütfen tüm alanları doldurun',
        'calc.semesterNotes': 'Dönem Notu',
        'calc.semesterNotesPlaceholder': 'Bu dönem için not ekleyin… (Erasmus, yaz dönemi, vb.)',
        'autoSaved': '✓ Kaydedildi',
        'duplicateCourseWarning': 'Aynı isimli ders zaten mevcut',
        // Transcript
        'transcript.title': 'NOT DÖKÜMÜ / ACADEMIC TRANSCRIPT',
        'transcript.generated': 'Oluşturulma tarihi',
        'transcript.summary': 'GENEL ÖZET',
        'transcript.semCount': 'Dönem Sayısı',
        'transcript.honorStatus': 'Öğrenci Durumu',
        'transcript.noHonor': 'Normal Öğrenci',
        'transcript.honor': 'Onur Öğrencisi',
        'transcript.highHonor': 'Yüksek Onur Öğrencisi',
        'transcript.gpaProgress': 'GPA SEYRİ',
        'transcript.semHeader': 'DÖNEM DETAYLARı',
        'transcript.noSemesters': 'Kayıtlı dönem verisi bulunamadı.',
        'transcript.currentSem': 'Mevcut Dönem',
        'transcript.gradeScale': 'NOT SİSTEMİ',
        'shortcut.saved': 'Kaydedildi!',
        'simulation.semesterMismatch': 'Bu senaryo farklı bir dönem için kaydedildi',
        'alert.storageFull': 'Kayıt alanı dolu. Veriler kaydedilemedi.',
    },
    en: {
        // Navigation
        // ===== BOUN Pusula (SuperApp) =====
        'brand.name': 'Pusula',
        'brand.tagline': 'A Boğaziçi student\'s daily compass',

        // Nav sections + new modules
        'nav.daily': 'Daily',
        'nav.academic': 'Academic',
        'nav.home': 'Today',
        'nav.schedule': 'Weekly Schedule',
        'nav.planner': 'Exams & Tasks',
        'nav.notes': 'Notes & Tasks',
        'nav.campus': 'Campus',
        'nav.gradeGuide': 'Grade Guide',

        // Day labels (0 = Monday)
        'day.mon': 'Mon', 'day.tue': 'Tue', 'day.wed': 'Wed', 'day.thu': 'Thu',
        'day.fri': 'Fri', 'day.sat': 'Sat', 'day.sun': 'Sun',

        // Common
        'common.save': 'Save', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
        'common.edit': 'Edit', 'common.add': 'Add', 'common.close': 'Close',

        // Home hub
        'home.greetingMorning': 'Good morning', 'home.greetingAfternoon': 'Good afternoon',
        'home.greetingEvening': 'Good evening', 'home.greetingNight': 'Good night',
        'home.todayClasses': "Today's Classes",
        'home.noClassesToday': 'No classes today',
        'home.noClassesTodayCta': 'Build your schedule',
        'home.nextDeadline': 'Next Deadline',
        'home.noDeadlines': 'No upcoming deadlines',
        'home.addDeadlineCta': 'Add an exam/task',
        'home.dueSoon': 'Due Soon',
        'home.noDueSoon': 'Nothing due soon',
        'home.nextRing': 'Next Ring / Shuttle',
        'home.gpaSnapshot': 'GPA Snapshot',
        'home.launcher': 'Modules',
        'home.now': 'now',
        'home.startsIn': 'in {n} min',
        'home.overdue': 'overdue',
        'home.dueToday': 'today',
        'home.dueTomorrow': 'tomorrow',
        'home.daysLeft': '{n} days',
        'home.pinnedNotes': 'Pinned notes',
        'home.openTasks': 'Open tasks',

        // Schedule
        'schedule.title': 'Weekly Schedule',
        'schedule.desc': 'Add your classes with days and times to see your week',
        'schedule.addCourse': 'Add Class',
        'schedule.name': 'Class Name', 'schedule.code': 'Code',
        'schedule.instructor': 'Instructor', 'schedule.location': 'Room',
        'schedule.color': 'Color', 'schedule.day': 'Day',
        'schedule.start': 'Start', 'schedule.end': 'End',
        'schedule.addBlock': 'Add Time', 'schedule.noBlocks': 'No times added yet',
        'schedule.showSaturday': 'Show Saturday',
        'schedule.pullFromGPA': 'Pull classes from my GPA semester',
        'schedule.empty': 'No classes added yet',
        'schedule.emptyDesc': 'Tap "Add Class" to build your weekly schedule.',
        'schedule.overlap': 'You have overlapping classes',
        'schedule.saved': 'Schedule saved',

        // Planner
        'planner.title': 'Exam & Assignment Planner',
        'planner.desc': 'Track exams, assignments and projects with live countdowns',
        'planner.add': 'Add New',
        'planner.titleField': 'Title', 'planner.type': 'Type',
        'planner.course': 'Course', 'planner.due': 'Due Date',
        'planner.weight': 'Weight (%)', 'planner.location': 'Location',
        'planner.typeExam': 'Exam', 'planner.typeAssignment': 'Assignment',
        'planner.typeQuiz': 'Quiz', 'planner.typeProject': 'Project',
        'planner.markDone': 'Done', 'planner.markUndone': 'Undo',
        'planner.completed': 'Completed',
        'planner.overdue': 'overdue', 'planner.dueToday': 'today',
        'planner.dueTomorrow': 'tomorrow', 'planner.daysLeft': '{n} days left',
        'planner.hoursLeft': '{n} hours left',
        'planner.empty': 'Nothing in your planner',
        'planner.emptyDesc': 'Tap "Add New" to add an exam or assignment.',
        'planner.exportIcs': 'Export to Calendar (.ics)',
        'planner.saved': 'Planner saved',

        // Notes & Tasks
        'notes.title': 'Notes & Tasks',
        'notes.desc': 'Quick notes and a simple to-do list',
        'notes.notesTab': 'Notes', 'notes.tasksTab': 'Tasks',
        'notes.quickAddNote': 'Quick note...',
        'notes.quickAddTask': 'New task...',
        'notes.noteTitle': 'Title', 'notes.noteBody': 'Content',
        'notes.search': 'Search notes...',
        'notes.pin': 'Pin', 'notes.unpin': 'Unpin',
        'notes.emptyNotes': 'No notes yet',
        'notes.emptyNotesDesc': 'Add a quick note from the box above.',
        'notes.emptyTasks': 'No tasks',
        'notes.emptyTasksDesc': 'Add a to-do from the box above.',
        'notes.saved': 'Saved',

        // Campus
        'campus.title': 'Campus Services',
        'campus.desc': 'Official links, transport times and key phone numbers',
        'campus.links': 'Official Links',
        'campus.transport': 'Transport (Ring & Shuttle)',
        'campus.contacts': 'Emergency & Key Numbers',
        'campus.nextDeparture': 'Next departure',
        'campus.weekday': 'Weekday', 'campus.weekend': 'Weekend',
        'campus.lastUpdated': 'Last updated',
        'campus.call': 'Call', 'campus.open': 'Open',

        // Grade Guide
        'guide.title': 'Grade System Guide',
        'guide.desc': 'BOUN grade system, honor thresholds and FAQ',
        'guide.gradeTable': 'Grade - Point Table',
        'guide.grade': 'Grade', 'guide.points': 'Points',
        'guide.nonGpa': 'Grades not counted in GPA',
        'guide.nonGpaDesc': 'A P (Pass) grade counts toward credits but not toward GPA.',
        'guide.honorTitle': 'Honor Status',
        'guide.honor': 'Honor Student (GPA ≥ 3.00)',
        'guide.highHonor': 'High Honor Student (GPA ≥ 3.50)',
        'guide.retakeTitle': 'Course Retake Rules',
        'guide.retakeDesc': 'Courses graded FF, DD or DC can be retaken. On a retake the old grade\'s contribution is removed from the cumulative GPA and the new grade is added.',
        'guide.faqTitle': 'FAQ',
        'guide.faq1Q': 'How is GPA calculated?',
        'guide.faq1A': 'Each course\'s credits are multiplied by its grade points, then divided by total credits.',
        'guide.faq2Q': 'Does a P grade affect my GPA?',
        'guide.faq2A': 'No. A P grade counts toward total credits but is excluded from the GPA calculation.',
        'guide.faq3Q': 'What GPA do I need for honors?',
        'guide.faq3A': '3.00 and above is Honor, 3.50 and above is High Honor.',
        'guide.openCalculator': 'Open Calculator',

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
        'fillAllFields': 'Please fill all fields',
        'calc.semesterNotes': 'Semester Notes',
        'calc.semesterNotesPlaceholder': 'Add a note for this semester… (exchange, summer term, etc.)',
        'autoSaved': '✓ Saved',
        'duplicateCourseWarning': 'A course with this name already exists',
        // Transcript
        'transcript.title': 'NOT DÖKÜMÜ / ACADEMIC TRANSCRIPT',
        'transcript.generated': 'Generated on',
        'transcript.summary': 'SUMMARY',
        'transcript.semCount': 'Semesters',
        'transcript.honorStatus': 'Student Status',
        'transcript.noHonor': 'Regular Student',
        'transcript.honor': 'Honor Student',
        'transcript.highHonor': 'High Honor Student',
        'transcript.gpaProgress': 'GPA PROGRESS',
        'transcript.semHeader': 'SEMESTER DETAILS',
        'transcript.noSemesters': 'No saved semester data found.',
        'transcript.currentSem': 'Current Semester',
        'transcript.gradeScale': 'GRADE SCALE',
        'shortcut.saved': 'Saved!',
        'simulation.semesterMismatch': 'This scenario was saved for a different semester',
        'alert.storageFull': 'Storage full. Data could not be saved.',
    }
};

// ============================================
// Current Language (module-level mutable state)
// ============================================
export let currentLanguage = 'tr';

// ============================================
// Translation Helper
// ============================================
export function t(key, params = {}) {
    let text = translations[currentLanguage][key] || translations['tr'][key] || key;
    // Replace placeholders like {credits}, {gpa}, etc.
    Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
    });
    return text;
}

// ============================================
// View Refresh Registration (replaces updateDynamicTranslations view-specific blocks)
// ============================================
const viewRefreshers = {};

export function registerViewRefresh(viewId, callback) {
    if (!viewRefreshers[viewId]) viewRefreshers[viewId] = [];
    viewRefreshers[viewId].push(callback);
}

function refreshCurrentView() {
    const viewId = state.currentView;
    if (viewId && viewRefreshers[viewId]) {
        viewRefreshers[viewId].forEach(fn => fn());
    }
}

export function refreshView(viewId) {
    if (viewId && viewRefreshers[viewId]) {
        viewRefreshers[viewId].forEach(fn => fn());
    }
}

// ============================================
// Apply translations to DOM
// ============================================
export function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translation;
        } else {
            el.textContent = translation;
        }
    });

    // Handle data-i18n-placeholder (for elements that need both label and placeholder translated)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;

    // Update dynamic content (non-view-specific parts from updateDynamicTranslations)

    // Update view titles
    if (elements.pageTitle) {
        const viewTitles = {
            get home() { return t('nav.home'); },
            get schedule() { return t('nav.schedule'); },
            get planner() { return t('nav.planner'); },
            get notes() { return t('nav.notes'); },
            get campus() { return t('nav.campus'); },
            get gradeGuide() { return t('nav.gradeGuide'); },
            get dashboard() { return t('nav.home'); },
            get calculator() { return t('nav.calculator'); },
            get goal() { return t('goal.title'); },
            get history() { return t('history.title'); },
            get charts() { return t('charts.gradeDistribution'); },
            get export() { return t('export.title'); },
            get simulation() { return t('simulation.title'); },
            get graduation() { return t('graduation.title'); },
            get achievements() { return t('achievements.title'); },
            get help() { return t('help.title'); },
            get import() { return t('import.title'); },
            get feedback() { return t('feedback.title'); },
            get shortcuts() { return t('shortcuts.title'); }
        };
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

    // Refresh current view (replaces view-specific if-blocks from updateDynamicTranslations)
    refreshCurrentView();
}

// ============================================
// Language Switching
// ============================================
export function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    translatePage();
    updateLangToggle();
}

export function toggleLanguage() {
    const newLang = currentLanguage === 'tr' ? 'en' : 'tr';
    setLanguage(newLang);
}

export function updateLangToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const flag = langToggle.querySelector('.lang-flag');
        const code = langToggle.querySelector('.lang-code');
        if (flag) flag.textContent = currentLanguage === 'tr' ? '🇹🇷' : '🇬🇧';
        if (code) code.textContent = currentLanguage.toUpperCase();
    }
}

export function initLanguage() {
    currentLanguage = localStorage.getItem('language') || 'tr';
    translatePage();
    updateLangToggle();
}
