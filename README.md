# 📊 Personal Dashboard

[![JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MIT License](https://img.shields.io/badge/MIT-black?style=for-the-badge)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-blue?style=for-the-badge)](https://web.dev/progressive-web-apps/)

A modern, feature-rich Personal Dashboard Web App built with vanilla **HTML, CSS, and JavaScript**. Organize your digital life with profile management, notes, to-do lists, media handling, and more—all with offline capability and PWA support.

---

## ✨ Key Features

- 👤 **Profile Management** – Save and load user information using `localStorage`
- 📝 **Notes & To-Do Manager** – Add, edit, and delete notes with persistent storage via **IndexedDB**
- 📜 **Lazy-Loaded Posts** – Fetch posts from [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) with automatic loading on scroll using `IntersectionObserver`
- 📂 **Media Upload & Canvas Editing** – Drag-and-drop or click-to-upload images with preview, rotation, scaling, and download capabilities using the `Canvas API`
- 🍪 **Cookie Manager** – Set, view, and clear cookies using both traditional `document.cookie` and modern `cookieStore` API
- ⚡ **Web Worker Support** – Execute background tasks without blocking the UI thread
- 🔄 **Service Worker Implementation** – Offline caching and Progressive Web App functionality
- 🎨 **Theme Toggle** – Switch between light and dark modes with preference persistence
- 🌐 **Network Status Detection** – Real-time online/offline monitoring with visual notifications

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Storage:** `localStorage` (profile data), `IndexedDB` (notes)
- **API Integration:** JSONPlaceholder (REST API)
- **Advanced Web APIs:**
  - CookieStore API
  - Web Workers
  - Service Workers
  - Notifications API
  - IntersectionObserver API
  - Canvas API

---

## 📦 Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/youngberry1/Personal-Dashboard.git
cd Personal-Dashboard
```

2. Serve the files using a local server (required for Service Worker functionality):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
http-server -p 8000
```

3. Open your browser and navigate to `http://localhost:8000`

---

## 🚀 Usage Guide

- **Profile Management**: Enter your information in the profile section—it automatically saves to your browser's local storage
- **Notes & To-Dos**: Add new notes, edit existing ones, or delete entries—all persisted in IndexedDB
- **Media Handling**: Drag images onto the upload area or click to select files, then use the canvas tools to edit before downloading
- **Cookie Management**: Set new cookies, view existing ones, or clear all cookies using the dedicated interface
- **Content Browsing**: Scroll through the posts section—new content loads automatically as you reach the bottom
- **Theme Switching**: Toggle between light and dark mode using the theme switch—your preference is remembered
- **Offline Usage**: The app works offline thanks to service worker caching—observe the network status indicator

---

## 📁 Project Structure

```
personal-dashboard/
│
├── index.html          # Main application page
├── style.css           # All styling and responsive design
├── script.js           # Primary application logic
├── worker.js           # Web worker implementation
├── service-worker.js   # Service worker for caching and offline functionality
└── README.md           # Project documentation
```

---

## 🔮 Future Enhancements

- 🔐 **User Authentication** – Secure login system with personalized dashboards
- 📱 **Enhanced Mobile Experience** – Fully mobile-first PWA with additional touch gestures
- 📊 **Data Visualization** – Charts and graphs for user activity and analytics
- ☁️ **Cloud Synchronization** – Sync notes and data across devices with cloud storage
- 🔔 **Notification System** – Custom reminders and alerts for tasks
- 🗃️ **Data Export** – Export notes and data in various formats (JSON, CSV, PDF)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read the [CONTRIBUTING](CONTRIBUTING.md) guidelines for details on our code of conduct and the submission process.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

- **Youngberry** - [GitHub](https://github.com/youngberry1)

---

<div align="center">
Made with ❤️ using vanilla HTML, CSS, and JavaScript
</div>
