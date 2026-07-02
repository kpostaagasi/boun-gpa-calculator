/**
 * BOUN Pusula — Static Campus Reference Data (Seed)
 *
 * Bundled, offline-first reference data for the Campus module and the Home
 * "next ring/shuttle" widget. This is NEVER fetched at runtime — it ships with
 * the app so everything works fully offline.
 *
 * IMPORTANT: This is unofficial, curated data that can go stale (timetables,
 * phone numbers, links change). Every consumer surfaces `sourceNote` + `updatedAt`
 * and tells the user to verify against the official source. Update the arrays
 * below and bump `updatedAt` when refreshing.
 *
 * Display strings are stored as { tr, en } pairs; modules pick the active
 * language via the `pickLang` helper (see store.js / module code).
 */

const campusSeed = {
    updatedAt: '2026-06-30',
    sourceNote: {
        tr: 'Bilgiler topluluk tarafından derlenmiştir, resmi değildir. Lütfen güncel bilgiyi resmi BOUN kaynaklarından doğrulayın.',
        en: 'Community-curated, unofficial data. Always verify current information from official BOUN sources.'
    },

    // Campuses (for reference / location tagging)
    campuses: [
        { id: 'guney', name: { tr: 'Güney Kampüs', en: 'South Campus' } },
        { id: 'kuzey', name: { tr: 'Kuzey Kampüs', en: 'North Campus' } },
        { id: 'hisar', name: { tr: 'Hisar Kampüs', en: 'Hisar Campus' } },
        { id: 'kandilli', name: { tr: 'Kandilli Kampüs', en: 'Kandilli Campus' } },
        { id: 'kilyos', name: { tr: 'Kilyos (Sarıtepe) Kampüs', en: 'Kilyos (Sarıtepe) Campus' } },
        { id: 'ucaksavar', name: { tr: 'Uçaksavar Kampüs', en: 'Uçaksavar Campus' } }
    ],

    // Official BOUN service links (the list itself works offline; opening a link needs connectivity)
    links: [
        { id: 'obikas', name: { tr: 'OByS / Kayıt (Registration)', en: 'Registration (OByS)' }, url: 'https://registration.boun.edu.tr/', category: 'academic' },
        { id: 'moodle', name: { tr: 'Moodle', en: 'Moodle' }, url: 'https://moodle.boun.edu.tr/', category: 'academic' },
        { id: 'library', name: { tr: 'Kütüphane', en: 'Library' }, url: 'https://www.library.boun.edu.tr/', category: 'academic' },
        { id: 'webmail', name: { tr: 'Webmail', en: 'Webmail' }, url: 'https://webmail.boun.edu.tr/', category: 'academic' },
        { id: 'sis', name: { tr: 'Öğrenci Bilgi Sistemi', en: 'Student Information System' }, url: 'https://www.boun.edu.tr/tr-TR/Content/Ogrenciler', category: 'academic' },
        { id: 'mediko', name: { tr: 'Mediko (Sağlık Merkezi)', en: 'Health Center (Mediko)' }, url: 'https://salikkultur.boun.edu.tr/', category: 'life' },
        { id: 'yemekhane', name: { tr: 'Yemekhane / Yemek Listesi', en: 'Dining / Menu' }, url: 'https://yemekhane.boun.edu.tr/', category: 'life' },
        { id: 'spor', name: { tr: 'Spor (BÜMED / Tesisler)', en: 'Sports Facilities' }, url: 'https://www.boun.edu.tr/', category: 'life' },
        { id: 'kyk', name: { tr: 'KYK / Yurtlar', en: 'KYK / Dormitories' }, url: 'https://kygm.gsb.gov.tr/', category: 'life' },
        { id: 'main', name: { tr: 'BOUN Ana Sayfa', en: 'BOUN Homepage' }, url: 'https://www.boun.edu.tr/', category: 'general' }
    ],

    // Transport: ring (campus shuttle bus) departure times as 'HH:MM' strings.
    // Representative static schedule — verify with the official ring timetable.
    transport: {
        ring: {
            label: { tr: 'Ring (Kampüsler Arası)', en: 'Ring (Inter-campus)' },
            weekday: [
                '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
                '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
                '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
                '20:00', '21:00', '22:00'
            ],
            weekend: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
        },
        shuttle: {
            label: { tr: 'Kilyos Servisi', en: 'Kilyos Shuttle' },
            weekday: ['07:45', '09:15', '12:30', '15:30', '17:30', '19:30'],
            weekend: ['10:00', '14:00', '18:00']
        }
    },

    // Emergency & key contacts (tap-to-call via tel: links)
    contacts: [
        { id: 'security', name: { tr: 'Kampüs Güvenlik', en: 'Campus Security' }, tel: '+902123596161' },
        { id: 'mediko', name: { tr: 'Mediko (Sağlık)', en: 'Health Center' }, tel: '+902123597030' },
        { id: 'emergency', name: { tr: 'Acil (112)', en: 'Emergency (112)' }, tel: '112' },
        { id: 'psych', name: { tr: 'Psikolojik Danışmanlık (BÜREM)', en: 'Counseling (BÜREM)' }, tel: '+902123597078' },
        { id: 'it', name: { tr: 'BT Yardım Masası', en: 'IT Helpdesk' }, tel: '+902123597070' }
    ],

    // Academic calendar key dates (term/week label on Home derives from these).
    // ISO dates; update each academic year.
    academicCalendar: [
        { id: 'fall-start', label: { tr: 'Güz Dönemi Başlangıcı', en: 'Fall Term Begins' }, dateISO: '2026-09-21' },
        { id: 'fall-midterms', label: { tr: 'Güz Ara Sınavları', en: 'Fall Midterms' }, dateISO: '2026-11-09' },
        { id: 'fall-finals', label: { tr: 'Güz Final Sınavları', en: 'Fall Finals' }, dateISO: '2027-01-11' },
        { id: 'spring-start', label: { tr: 'Bahar Dönemi Başlangıcı', en: 'Spring Term Begins' }, dateISO: '2027-02-08' },
        { id: 'spring-finals', label: { tr: 'Bahar Final Sınavları', en: 'Spring Finals' }, dateISO: '2027-05-31' }
    ],

    // Optional class-period bell times the Schedule module can snap blocks to.
    ringBellPeriods: [
        { period: 1, start: '09:00', end: '09:50' },
        { period: 2, start: '10:00', end: '10:50' },
        { period: 3, start: '11:00', end: '11:50' },
        { period: 4, start: '12:00', end: '12:50' },
        { period: 5, start: '13:00', end: '13:50' },
        { period: 6, start: '14:00', end: '14:50' },
        { period: 7, start: '15:00', end: '15:50' },
        { period: 8, start: '16:00', end: '16:50' },
        { period: 9, start: '17:00', end: '17:50' }
    ]
};

export default campusSeed;
