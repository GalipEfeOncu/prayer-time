# Huzur Vakti - Modern Ezan Vakti Uygulaması

Huzur Vakti, modern, şık ve kullanıcı dostu bir arayüzle namaz vakitlerini takip etmenizi sağlayan bir web uygulamasıdır. React ve Vite kullanılarak geliştirilen bu proje, Diyanet İşleri Başkanlığı'nın verileriyle uyumlu olarak çalışır.

## 🌟 Özellikler

*   **Detaylı Konum Desteği:** 
    *   Türkiye için il ve ilçe bazında detaylı seçim.
    *   Dünya genelindeki tüm ülkeler ve şehirler için destek.
    *   Otomatik konum algılama özelliği.
*   **Anlık Vakit Takibi:**
    *   Bulunduğunuz konuma göre anlık namaz vakitleri.
    *   Bir sonraki vakte kalan süreyi gösteren geri sayım sayacı.
    *   Vakti gelen namazın vurgulanması.
*   **Dini İçerikler:**
    *   Her gün için rastgele bir Ayet-i Kerime.
    *   2026 yılı için önemliini günler ve geceler takvimi.
    *   Hicri takvim desteği.
*   **Modern Tasarım:**
    *   Göz yormayan karanlık mod (Dark Mode).
    *   Turuncu renk paleti ile sıcak ve samimi bir görünüm.
    *   Glassmorphism (buzlu cam) efektleri ve akıcı animasyonlar.
    *   Mobil ve masaüstü uyumlu (Responsive) tasarım.

## 🛠️ Teknolojiler

Bu proje aşağıdaki teknolojiler kullanılarak geliştirilmiştir:

*   **[React](https://react.dev/):** Kullanıcı arayüzü kütüphanesi.
*   **[Vite](https://vitejs.dev/):** Hızlı geliştirme ve derleme aracı.
*   **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework'ü.
*   **[Lucide React](https://lucide.dev/):** Modern ikon seti.
*   **[React Window](https://github.com/bvaughn/react-window):** Performanslı liste görünümleri için.
*   **API'ler:** Aladhan (Namaz Vakitleri), TurkiyeAPI (İl/İlçe Verileri), CountriesNow, BigDataCloud (Konum), AlQuran Cloud.

## 🚀 Kurulum ve Çalıştırma

Projesi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu klonlayın:**
    ```bash
    git clone https://github.com/kullaniciadi/prayer-time.git
    cd prayer-time
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme sunucusunu başlatın:**
    ```bash
    npm run dev
    ```

4.  **Uygulamayı tarayıcıda açın:**
    Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı görüntüleyebilirsiniz.

## 🏗️ Derleme (Build)

Projeyi canlı ortam için derlemek isterseniz:

```bash
npm run build
```

Bu komut `dist` klasörü altında optimize edilmiş üretim dosyalarını oluşturacaktır.

## 📝 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakabilirsiniz.