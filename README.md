# 🎬 CineLog Mobil Uygulaması

<p align="center">
  <strong>Filmlerini ve Dizilerini Akıllı Takip Et</strong><br />
  Afişler, Oyuncular ve Özel Yorumların Hepsi Tek Uygulamada!
</p>

---

<p align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.7x-blue?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK-black?style=for-the-badge&logo=expo)
![AsyncStorage](https://img.shields.io/badge/Storage-AsyncStorage-orange?style=for-the-badge)
![API](https://img.shields.io/badge/API-TMDB-yellow?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</p>

---

## 📱 Uygulama Hakkında

Bu uygulama, kullanıcıların izledikleri veya izlemek istedikleri film ve dizileri modern, premium karanlık (dark) temalı bir arayüz ile kayıt altına alıp takip edebilmesi için geliştirilmiştir.  
Gerçek zamanlı **TMDB API** entegrasyonu sayesinde afiş, başrol, çıkış yılı ve sezon bilgileri anında çekilir ve izleyicinin kişisel notlarıyla birlikte şık bir düzende sergilenir.

---

## ✨ Temel Özellikler

- 🎬 **Film ve Dizi Yönetimi**: Listeye yapım ekleme, detayları görüntüleme ve silme.
- 🤖 **TMDB API Entegrasyonu**: İsmini yazdığınız yapımın afişini, konusunu ve başrolünü saniyeler içinde otomatik çekme.
- 🎥 **Genişletilmiş Detay Ekranı**: Yönetmen, sezon bilgileri, süre ve popüler 10 oyuncunun görselli yatay kaydırılabilir kadrosu.
- 📝 **Kişisel Yorumlar**: Kayıtlara özel maksimum 300 karakterlik kişisel notlar ekleyebilme.
- 🎨 **Premium UI/UX**: İndigo & Çinko (Zinc) renk paleti, buzlu cam (blur) efektli sinematik arka planlar ve modern kart tasarımları.
- 💾 **Lokal Depolama**: AsyncStorage ile verileri cihaz hafızasında güvenli ve internetsiz çalışabilir şekilde tutma.
- 🔎 **Akıllı Arama Listesi**: API'den gelen hızlı ve temiz arama sonuçları.

---

## 🛠️ Teknoloji Yığını

- **Framework**: React Native (Expo)
- **Lokal Veritabanı**: AsyncStorage
- **Veri Sağlayıcı API**: TMDB (The Movie Database) API
- **Ağ İstekleri**: Axios
- **Tasarım Stili**: Modern Corporate Dark Theme (Zinc & Indigo)

---

## 🚀 Kurulum

1. **Projeyi klonla**
```bash
git clone https://github.com/furkanusakpinar/CineLog.git
cd CineLog
```

2. **Bağımlılıkları yükle**
```bash
npm install
```

3. **Çevresel Değişkenleri Ayarla (.env)**
Proje ana dizininde bir `.env` dosyası oluşturun ve kendi TMDB API anahtarınızı ekleyin:
```env
EXPO_PUBLIC_TMDB_API_KEY=senin_tmdb_api_anahtarin_buraya
```
*(TMDB hesabı açarak ücretsiz bir API key alabilirsiniz.)*

4. **Uygulamayı Başlat**
```bash
npx expo start --clear
```

5. **Test Et**
Telefonunuza indireceğiniz **Expo Go** uygulaması ile terminaldeki QR kodu okutarak uygulamayı canlı test edebilirsiniz.

---

"This product uses the TMDB API but is not endorsed or certified by TMDB."
