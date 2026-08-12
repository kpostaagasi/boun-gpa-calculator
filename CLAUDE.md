# CLAUDE.md

Bu dosya, repository üzerinde çalışan kod ajanları için kısa proje rehberidir.

## Proje

**BOUN GPA Calculator**, Boğaziçi Üniversitesi BOUN not sistemiyle GPA hesaplayan statik, çevrimdışı destekli bir web uygulamasıdır. Uygulama tek amaçlıdır: dönem ve genel GPA hesabı ile buna doğrudan yardımcı olan akademik araçları sunar.

Canlı site: https://kpostaagasi.github.io/boun-gpa-calculator

## Teknoloji ve yapı

- Vanilla HTML, CSS ve JavaScript; native ES modules
- Build aracı, bundler veya framework yoktur
- GitHub Pages üzerinde statik olarak barındırılır
- Veriler tarayıcı LocalStorage'ında tutulur
- PWA çevrimdışı desteği service worker ile sağlanır

Önemli dosyalar:

```
index.html          # Uygulama arayüzü
styles.css          # Tema ve responsive stiller
service-worker.js   # Çevrimdışı önbellek
src/main.js         # Giriş noktası
src/state.js        # Uygulama durumu ve DOM referansları
src/i18n.js         # Türkçe/İngilizce çeviriler
src/grades.js       # BOUN not sistemi ve yardımcılar
src/gpa.js          # Saf GPA matematiği
src/ui.js           # Hesaplama orkestrasyonu ve arayüz olayları
src/charts.js       # GPA grafiklerini oluşturur
src/features.js     # Hedef, geçmiş, simülasyon, mezuniyet ve dışa aktarma
src/finalGrade.js   # Final notu aracı
src/coursePlanner.js# Ders kayıt planlama aracı
tests/tests.js      # Regresyon testleri
```

## Geliştirme ve test

```bash
python3 -m http.server 8000
node tests/check-i18n.mjs
node tests/tests.js
```

`index.html` doğrudan `file://` üzerinden açılmamalıdır. `tests/tests.js`, DOM bağımlılığı nedeniyle bazı saf mantıkları üretimden bağımsız olarak doğrular; DOM'suz yardımcı modüller doğrudan test edilebilir.

## Kod kuralları

- Kullanıcıya görünen metinleri `src/i18n.js` içindeki `tr` ve `en` bloklarına ekleyin; her iki dilde anahtarlar simetrik olmalıdır.
- HTML'deki mevcut `data-i18n` anahtarlarını silmeden veya yeniden adlandırmadan önce tüm `index.html` ve `src/` referanslarını kontrol edin.
- Kullanıcı metnini DOM'a eklerken `escapeHtml()` kullanın.
- GPA matematiğini DOM'dan bağımsız tutun.
- Gereksiz bağımlılık, build aracı veya mimari katman eklemeyin.
- BOUN not sistemi dışındaki üniversiteler için not eşlemesi eklemeyin.

## Ders tekrarı

FF, DD veya DC ders tekrarı yapılabilir. Yeni not dönem GPA'sına eklenir; kümülatif hesapta eski notun kredi ve puan katkısı çıkarılır, yeni katkı eklenir.
