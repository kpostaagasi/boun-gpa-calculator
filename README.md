# BOUN Pusula 🧭

Boğaziçi Üniversitesi öğrencileri için **çevrimdışı çalışan günlük öğrenci uygulaması**. GPA hesaplama tek başına bir araç olmaktan çıktı; artık günlük hayatını yöneten modüllerden biri.

🌐 **Web sitesi:** [https://kpostaagasi.github.io/boun-gpa-calculator](https://kpostaagasi.github.io/boun-gpa-calculator)

## Modüller

### Günlük
- **Bugün (Ana Sayfa):** Günün özeti tek ekranda — bugünkü dersler, en yakın sınav geri sayımı, yaklaşan teslimler, GPA özeti ve sonraki ring/servis. Modüllere hızlı erişim.
- **Ders Programı:** Derslerini gün ve saatleriyle ekle, haftalık programını renkli ızgarada gör, çakışmaları yakala.
- **Sınav & Ödev Planı:** Sınav, ödev, quiz ve projeleri canlı geri sayımla takip et. `.ics` olarak takvime aktar.
- **Notlar & Görevler:** Hızlı notlar (sabitleme + arama) ve basit yapılacaklar listesi.
- **Kampüs:** Resmi BOUN bağlantıları, ring/servis saatleri (sonraki kalkış) ve acil numaralar — tamamen çevrimdışı.

### Akademik
- **GPA Hesaplayıcı:** Boğaziçi not sistemine (AA–FF) uygun dönem ve genel ortalama hesabı, tekrar ders desteği, dönem geçmişi, hedef GPA, simülasyon, mezuniyet ve rozetler.
- **Not Sistemi Rehberi:** Not–katsayı tablosu, onur eşikleri, tekrar kuralları ve sık sorulanlar.

## Öne Çıkanlar

- Açık/koyu tema, Türkçe/İngilizce dil desteği
- Otomatik kaydetme (LocalStorage), JSON yedekleme/geri yükleme
- Tam çevrimdışı PWA (telefona kurulabilir)
- Build adımı yok — saf HTML/CSS/JS (ES modülleri)

## Geliştirme

ES modülleri bir HTTP sunucusu gerektirir (`file://` ile açılmaz):

```bash
git clone https://github.com/kpostaagasi/boun-gpa-calculator.git
cd boun-gpa-calculator
python3 -m http.server 8000
# http://localhost:8000 adresini aç

# Regresyon testleri
node tests/tests.js
```

> Kampüs bağlantıları, ulaşım saatleri ve numaralar topluluk tarafından derlenmiş **resmi olmayan** verilerdir; lütfen güncel bilgiyi resmi BOUN kaynaklarından doğrulayın.

## İletişim

Sorularınız için bir Issue açabilirsiniz.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakınız.

---

Made with ❤️ for Boğaziçi University students
