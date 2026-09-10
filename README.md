# BOUN GPA Calculator

> [!IMPORTANT]
> **Bu proje arşivlendi; artık geliştirilmiyor.**
>
> GPA hesabı **[BOUN Course Planner](https://kpostaagasi.github.io/boun-course-planner)** içine
> **Not Ortalaması** sekmesi olarak taşındı. Orada dersleri elle girmenize gerek yok: ders
> programınızı kurduğunuz sekmedeki şubeler, kredileriyle birlikte doğrudan hesaba geliyor.
>
> - **Site:** <https://kpostaagasi.github.io/boun-course-planner>
> - **Kaynak kod:** <https://github.com/kpostaagasi/boun-course-planner>
>
> **Taşınanlar:** BOUN not sistemi (AA–FF), dönem ortalaması, kümülatif ortalama ve ders
> tekrarı kuralı (FF/DD/DC).
>
> **Taşınmayanlar:** final notu hesaplayıcı, hedef GPA, GPA simülasyonu, dönem geçmişi ve
> grafikler, mezuniyet/onur durumu ve rozetler, JSON yedekleme. Bunlar yalnızca burada var
> ve bu depo salt okunur olduğu için yeni sürüm almayacak.
>
> **Verileriniz:** bu sitede girdikleriniz tarayıcınızın bu adrese ait deposunda kalır ve
> planlayıcıya aktarılmaz — planlayıcı ayrı bir adres, dolayısıyla orada sıfırdan başlarsınız.
> Buradaki geçmişinizi saklamak istiyorsanız arşivlemeden önce JSON olarak dışa aktarın.

---

*Aşağıdakiler arşivlenen sürümü anlatır ve tarihsel kayıt olarak bırakılmıştır.*

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

Depo arşivli olduğu için yeni Issue açılamaz; planlayıcıyla ilgili konuları
[boun-course-planner](https://github.com/kpostaagasi/boun-course-planner/issues) altında
açabilirsiniz. Bu proje MIT lisansı altında dağıtılır; ayrıntılar için `LICENSE` dosyasına
bakınız.
