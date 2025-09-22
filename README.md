# 📊 Personal Dashboard

![JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript&logoColor=black)
![MIT License](https://img.shields.io/badge/MIT-black?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-blue?style=for-the-badge)

A modern **Personal Dashboard Web App** built with **HTML, CSS, and JavaScript**.  
Features **profile management, notes/to-do with IndexedDB, lazy-loaded posts, media upload, cookie handling, service workers, theme toggle, and offline detection**.

---

## 🚀 Features

- 👤 **Profile Section** – Save and load name, age, and country with `localStorage`.
- 📝 **Notes / To-Do Manager** – Add, edit, delete notes using **IndexedDB**.
- 📜 **Lazy Loaded Posts** – Fetch posts via API and auto-load on scroll.
- 📂 **Media Upload** – Drag-and-drop or select files, with preview and validation.
- 🍪 **Cookie Manager** – Set, view, and clear cookies (`document.cookie` + `cookieStore` API).
- ⚡ **Web Worker** – Demonstrates background task execution.
- 🔄 **Service Worker** – Offline caching and PWA support.
- 🎨 **Theme Toggle** – Switch between light and dark mode with persistence.
- 🌐 **Online/Offline Status** – Real-time network detection with notifications.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)  
- **Storage**: LocalStorage + IndexedDB  
- **API**: JSONPlaceholder (for posts)  
- **Web APIs**: CookieStore API, Web Workers, Service Workers, Notifications, IntersectionObserver  

---

## 📦 Installation

```bash
git clone https://github.com/youngberry1/Personal-Dashboard.git
cd personal-dashboard




  <h2>🚀 Key Features</h2>
  <ul>
    <li>👤 <strong>Profile Management</strong> – Save and load user info with <code>localStorage</code>.</li>
    <li>📝 <strong>Notes / To-Do Manager</strong> – Add, edit, delete notes using <strong>IndexedDB</strong> with
      persistence.</li>
    <li>📜 <strong>Lazy-Loaded Posts</strong> – Fetch posts via <a href="https://jsonplaceholder.typicode.com/"
        target="_blank">JSONPlaceholder API</a> and auto-load as you scroll using <code>IntersectionObserver</code>.
    </li>
    <li>📂 <strong>Media Upload & Canvas</strong> – Drag-and-drop or click-to-upload images, preview, rotate, scale, and
      download using <code>Canvas API</code>.</li>
    <li>🍪 <strong>Cookie Manager</strong> – Set, view, and clear cookies with <code>document.cookie</code> &
      <code>cookieStore</code> API.
    </li>
    <li>⚡ <strong>Web Worker</strong> – Background task execution without blocking UI.</li>
    <li>🔄 <strong>Service Worker</strong> – Offline caching and PWA support.</li>
    <li>🎨 <strong>Theme Toggle</strong> – Light/dark mode saved across sessions.</li>
    <li>🌐 <strong>Network Detection</strong> – Real-time online/offline status with notifications.</li>
  </ul>

  <h2>🛠️ Tech Stack & Web APIs</h2>
  <ul>
    <li><strong>Frontend:</strong> HTML5, CSS3, JavaScript ES6+</li>
    <li><strong>Storage:</strong> localStorage + IndexedDB</li>
    <li><strong>API:</strong> JSONPlaceholder (REST)</li>
    <li><strong>Advanced Web APIs:</strong> CookieStore API, Web Workers, Service Workers, Notifications,
      IntersectionObserver, Canvas API</li>
  </ul>

  <h2>📦 Installation</h2>
  <pre><code>git clone https://github.com/youngberry1/Personal-Dashboard.git
cd personal-dashboard
</code></pre>
  <p>Open <code>index.html</code> in your browser 🚀</p>

  <h2>⚙️ Usage</h2>
  <ol>
    <li>Fill profile info → saved locally via <code>localStorage</code>.</li>
    <li>Manage notes → persistent storage with <code>IndexedDB</code>, edit/delete options included.</li>
    <li>Upload media → drag-drop or select files → preview & edit using Canvas.</li>
    <li>Manage cookies → set, view, and clear easily using both traditional & modern API.</li>
    <li>Load posts → lazy-load more as you scroll with smooth performance.</li>
    <li>Toggle theme → light/dark mode saved across sessions.</li>
    <li>Go offline → service worker + banner notifies status.</li>
  </ol>

personal-dashboard/
│── index.html
│── style.css
│── script.js
│── worker.js
│── service-worker.js
│── README.md


  <h2>💡 Future Improvements</h2>
  <ul>
    <li>🔑 Add user authentication</li>
    <li>📱 Make it fully mobile-first PWA</li>
    <li>📊 Add charts for user activity and analytics</li>
    <li>☁️ Sync notes with cloud storage</li>
  </ul>

  <h2>🤝 Contributing</h2>
  <p>Contributions, issues, and feature requests are welcome!
    Fork the project and submit a PR.</p>

  <h2>📜 License</h2>
  <p>MIT License — free to use, modify, and distribute with attribution.</p>

  <h2>👨‍💻 Author</h2>
  <p><strong>Your Name</strong><br>
    🌍 GitHub: <a href="https://github.com/youngberry1">@Youngberry1</a><br>
    📧 Email: circuitlab@gmail.com</p>
