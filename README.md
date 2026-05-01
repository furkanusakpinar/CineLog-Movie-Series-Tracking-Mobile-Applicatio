<div align="center">

# 🎬 CineLog Movie & Series Tracking Mobile Application

**Track Your Movies and TV Series Smartly**<br />
Posters, Cast, and Private Comments All in One App!

<br />

![React Native](https://img.shields.io/badge/React%20Native-0.7x-blue?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK-black?style=for-the-badge&logo=expo)
![AsyncStorage](https://img.shields.io/badge/Storage-AsyncStorage-orange?style=for-the-badge)
![API](https://img.shields.io/badge/API-TMDB-yellow?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

<br />

---

## 📱 About the App

This application is developed to allow users to log and track the movies and TV series they have watched or want to watch, wrapped in a modern, premium dark-themed interface.  
Thanks to real-time **TMDB API** integration, posters, lead actors, release years, and season details are fetched instantly and displayed elegantly alongside the viewer's personal notes.

---

## ✨ Key Features

🎬 **Movie and TV Show Management**: Add titles to your list, view details, and delete entries.

🤖 **TMDB API Integration**: Automatically fetches posters, synopses, and lead actors in seconds just by typing the title.

🎥 **Extended Details Screen**: Features director info, season details, runtime, and a visually appealing horizontally scrollable cast list of top 10 actors.

📝 **Personal Comments**: Add private notes and reviews up to 300 characters for each log.

🎨 **Premium UI/UX**: Indigo & Zinc color palette, cinematic blurred background effects, and modern card designs.

💾 **Local Storage**: Safely stores data locally on the device using AsyncStorage, working seamlessly even offline.

🔎 **Smart Search List**: Fast, clean, and interactive search results directly from the API.

---

## 🛠️ Technology Stack

- **Framework**: React Native (Expo)
- **Local Database**: AsyncStorage
- **Data Provider API**: TMDB (The Movie Database) API
- **HTTP Client**: Axios
- **Design Concept**: Modern Corporate Dark Theme (Zinc & Indigo)

---

## 🚀 Installation & Setup

**1. Clone the project**
```bash
git clone https://github.com/furkanusakpinar/CineLog-Movie-Series-Tracking-Mobile-Application.git
cd CineLog
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment Variables (.env)**
Create a `.env` file in the root directory of the project and add your own TMDB API key:
```env
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```
*(You can get a free API key by creating an account on TMDB.)*

**4. Start the Application**
```bash
npx expo start --clear
```

**5. Test It**
You can test the app live on your phone by scanning the terminal QR code with the **Expo Go** app.

---

*This product uses the TMDb API but is not endorsed or certified by TMDb.*

</div>
