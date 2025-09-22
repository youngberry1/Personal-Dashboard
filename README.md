# 📊 Personal Dashboard

![JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript&logoColor=black)
![MIT License](https://img.shields.io/badge/MIT-black?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-blue?style=for-the-badge)

A modern **Personal Dashboard Web App** built with **HTML, CSS, and JavaScript**.  
Features **profile management, notes/to-do with IndexedDB, lazy-loaded posts, media upload, cookie handling, service workers, theme toggle, and offline detection**.

---

## 🚀 Key Features

- 👤 **Profile Management** – Save and load user info with `localStorage`.
- 📝 **Notes / To-Do Manager** – Add, edit, delete notes using **IndexedDB** with persistence.
- 📜 **Lazy-Loaded Posts** – Fetch posts via [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) and auto-load as you scroll using `IntersectionObserver`.
- 📂 **Media Upload & Canvas** – Drag-and-drop or click-to-upload images, preview, rotate, scale, and download using `Canvas API`.
- 🍪 **Cookie Manager** – Set, view, and clear cookies with `document.cookie` & `cookieStore` API.
- ⚡ **Web Worker** – Background task execution without blocking UI.
- 🔄 **Service Worker** – Offline caching and PWA support.
- 🎨 **Theme Toggle** – Light/dark mode saved across sessions.
- 🌐 **Network Detection** – Real-time online/offline status with notifications.

---

## 🛠️ Tech Stack & Web APIs

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Storage:** `localStorage` + `IndexedDB`
- **API:** JSONPlaceholder (REST)
- **Advanced Web APIs:** CookieStore API, Web Workers, Service Workers, Notifications, IntersectionObserver, Canvas API

---

## 📦 Installation

```bash
git clone https://github.com/youngberry1/Personal-Dashboard.git
cd personal-dashboard

---

## ⚙️ Usage

1. Fill profile info → saved locally via `localStorage`.
2. Manage notes → persistent storage with `IndexedDB`, edit/delete options included.
3. Upload media → drag-drop or select files → preview & edit using Canvas.
4. Manage cookies → set, view, and clear easily using both traditional & modern API.
5. Load posts → lazy-load more as you scroll with smooth performance.
6. Toggle theme → light/dark mode saved across sessions.
7. Go offline → service worker + banner notifies status.

---

## Project Structure
personal-dashboard/
│── index.html
│── style.css
│── script.js
│── worker.js
│── service-worker.js
│── README.md

---

## 💡 Future Improvements

- 🔑 Add user authentication
- 📱 Make it fully mobile-first PWA
- 📊 Add charts for user activity and analytics
- ☁️ Sync notes with cloud storage

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Fork the project and submit a PR.

---

## 📜 License

MIT License — free to use, modify, and distribute with attribution.

---

## 👨‍💻 Author
 
🌍 GitHub: [@Youngberry1](https://github.com/youngberry1)
