# BOUN GPA Calculator

Boğaziçi Üniversitesi öğrencileri için, BOUN not sistemiyle dönem ve genel GPA hesaplayan çevrimdışı bir web uygulaması.

🌐 **Web sitesi:** [https://kpostaagasi.github.io/boun-gpa-calculator](https://kpostaagasi.github.io/boun-gpa-calculator)

## Özellikler

- BOUN not sistemi (AA–FF) ve 4.00 ölçeğinde GPA hesabı
- Önceki dönem GPA/kredi bilgileri ve ders tekrarı desteği
- Dönem geçmişi, hedef GPA ve GPA simülasyonu
- Not dağılımı ve GPA trendi grafikleri
- Mezuniyet, onur durumu ve başarı rozetleri
- Final notu ve ders kayıt planlama araçları
- Türkçe/İngilizce dil desteği, açık/koyu tema
- LocalStorage ile otomatik kayıt ve JSON yedekleme/geri yükleme
- Build adımı olmadan çalışan, çevrimdışı destekli statik PWA

## Geliştirme

ES modülleri bir HTTP sunucusu gerektirir (`file://` ile açılmaz):

```bash
git clone https://github.com/kpostaagasi/boun-gpa-calculator.git
cd boun-gpa-calculator
python3 -m http.server 8000
# http://localhost:8000 adresini aç

node tests/check-i18n.mjs
node tests/tests.js
```

## İletişim ve lisans

Sorularınız için bir Issue açabilirsiniz. Bu proje MIT lisansı altında dağıtılır; ayrıntılar için `LICENSE` dosyasına bakınız.
