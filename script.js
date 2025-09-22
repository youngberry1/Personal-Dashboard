// script.js — Refactored & fixed
// Assumes the HTML you provided earlier (no duplicate created buttons)

// ===== UTILITY =====
function showToast(message, duration = 2500) {
  const toast = document.getElementById('cookieModal');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => { toast.hidden = true; }, duration);
}

function showNoteToast(message, duration = 2500) {
  const toast = document.getElementById('noteModal');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => { toast.hidden = true; }, duration);
}

function normalizeString(str = '') {
  return String(str).trim().replace(/\s+/g, ' ');
}

// ===== PROFILE FORM HANDLING =====
const profileForm = document.getElementById('profileForm');
const infoDiv = document.getElementById('info');

if (profileForm) {
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = normalizeString(document.getElementById('name')?.value || '');
    const age = normalizeString(document.getElementById('age')?.value || '');
    const country = normalizeString(document.getElementById('country')?.value || '');

    if (!name || !age || !country) {
      infoDiv.textContent = 'Please fill out all fields.';
      return;
    }

    localStorage.setItem('name', name);
    localStorage.setItem('age', age);
    localStorage.setItem('country', country);

    infoDiv.textContent = `Hello, ${name} from ${country}, age ${age}!`;
    showToast('Profile saved successfully!');

    // Notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Profile Updated', { body: `Your profile has been updated, ${name}!` });
    }
  });
}

// Load saved profile on page load (done later in DOMContentLoaded handler)

// ===== NOTES (IndexedDB) =====
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');

let db = null;
let notesSortOrder = 'default'; // 'default' | 'az' | 'date'
let showCompleted = true;

const DB_NAME = 'dashboardDB';
const DB_VERSION = 2;
const STORE_NAME = 'notes';

const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

openRequest.onerror = (e) => {
  console.error('IndexedDB open error', e.target.error);
  showToast('Database error');
};

openRequest.onupgradeneeded = (e) => {
  const database = e.target.result;
  if (!database.objectStoreNames.contains(STORE_NAME)) {
    const store = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    store.createIndex('text', 'text', { unique: false });
    store.createIndex('completed', 'completed', { unique: false });
    store.createIndex('created', 'created', { unique: false });
  }
};

openRequest.onsuccess = (e) => {
  db = e.target.result;
  loadNotesFromDB();
};

// Add note
function addNote() {
  if (!db) {
    showToast('Database not available');
    return;
  }

  const text = normalizeString(noteInput?.value || '');
  if (!text) {
    showNoteToast('Note cannot be empty!');
    return;
  }

  const tx = db.transaction([STORE_NAME], 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const newNote = { text, completed: false, created: new Date().toISOString() };
  store.add(newNote);

  tx.oncomplete = () => {
    noteInput.value = '';
    loadNotesFromDB();
    showNoteToast('Note added successfully!');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Note Added', { body: 'Your note was saved.' });
    }
  };

  tx.onerror = () => showToast('Error adding note');
}

// Load notes
function loadNotesFromDB() {
  if (!db) return;
  const tx = db.transaction([STORE_NAME], 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const req = store.getAll();

  req.onsuccess = () => {
    let notes = req.result || [];

    if (!showCompleted) notes = notes.filter(n => !n.completed);

    if (notesSortOrder === 'az') {
      notes.sort((a, b) => a.text.localeCompare(b.text));
    } else if (notesSortOrder === 'date') {
      notes.sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    renderNotes(notes);
  };

  req.onerror = () => showToast('Error loading notes');
}

function renderNotes(notes = []) {
  if (!notesList) return;
  notesList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    li.dataset.id = note.id;

    const span = document.createElement('span');
    span.textContent = note.text;
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => toggleNoteCompleted(note.id, !note.completed));
    if (note.completed) {
      span.style.opacity = '0.7';
      span.style.textDecoration = 'line-through';
    }

    // Buttons container for layout
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '0.4rem';
    actions.style.marginLeft = '0.5rem';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = note.completed ? 'Undo' : 'Complete';
    completeBtn.className = 'small';
    completeBtn.addEventListener('click', () => toggleNoteCompleted(note.id, !note.completed));

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'small';
    editBtn.addEventListener('click', () => editNoteUI(note, li, span));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'small';
    deleteBtn.addEventListener('click', () => deleteNoteDB(note.id));

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    notesList.appendChild(li);
  });
}

// Show edit UI — replace span with input
function editNoteUI(note, li, span) {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = note.text;
  input.style.flex = '1';
  li.insertBefore(input, span);
  li.removeChild(span);
  input.focus();

  function commit() {
    saveEdit(note.id, input.value, li, input);
  }
  input.addEventListener('blur', commit, { once: true });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
}

// Save edited note (preserve other fields)
function saveEdit(id, newText, li, input) {
  newText = normalizeString(newText || '');
  if (!newText) {
    showNoteToast('Note cannot be empty.');
    input.focus();
    return;
  }

  const tx = db.transaction([STORE_NAME], 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const getReq = store.get(id);

  getReq.onsuccess = () => {
    const note = getReq.result;
    note.text = newText;
    // keep completed & created intact
    const putReq = store.put(note);
    putReq.onsuccess = () => {
      loadNotesFromDB();
      showNoteToast('Note updated successfully!');
    };
    putReq.onerror = () => showToast('Error updating note');
  };

  getReq.onerror = () => showToast('Error updating note');
}

// Toggle completed
function toggleNoteCompleted(id, completed) {
  const tx = db.transaction([STORE_NAME], 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const req = store.get(id);

  req.onsuccess = () => {
    const note = req.result;
    if (!note) return;
    note.completed = !!completed;
    const putReq = store.put(note);
    putReq.onsuccess = () => {
      loadNotesFromDB();
      showNoteToast(note.completed ? 'Note completed!' : 'Note marked active');
    };
    putReq.onerror = () => showToast('Error updating note');
  };

  req.onerror = () => showToast('Error updating note');
}

// Delete note
function deleteNoteDB(id) {
  const tx = db.transaction([STORE_NAME], 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const req = store.delete(id);

  req.onsuccess = () => {
    loadNotesFromDB();
    showNoteToast('Note deleted successfully!');
  };

  req.onerror = () => showToast('Error deleting note');
}

// Attach note event handlers (if present)
if (addNoteBtn) addNoteBtn.addEventListener('click', addNote);
if (noteInput) {
  noteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addNote(); }
  });
}

// Optional sort/filter UI (guarded)
const sortNotesBtn = document.getElementById('sortNotesBtn');
const filterCompletedBtn = document.getElementById('filterCompletedBtn');
if (sortNotesBtn) {
  sortNotesBtn.addEventListener('click', () => {
    if (notesSortOrder === 'default') { notesSortOrder = 'az'; sortNotesBtn.textContent = 'Sort Newest'; }
    else if (notesSortOrder === 'az') { notesSortOrder = 'date'; sortNotesBtn.textContent = 'Sort Default'; }
    else { notesSortOrder = 'default'; sortNotesBtn.textContent = 'Sort A-Z'; }
    loadNotesFromDB();
  });
}
if (filterCompletedBtn) {
  filterCompletedBtn.addEventListener('click', () => {
    showCompleted = !showCompleted;
    filterCompletedBtn.textContent = showCompleted ? 'Hide Completed' : 'Show Completed';
    loadNotesFromDB();
  });
}

// ===== POSTS (fetch + lazy load) =====
const loadPostsBtn = document.getElementById('loadPostsBtn');
const postsList = document.getElementById('posts');
let postsStart = 0;
const postsLimit = 10;
let postsLoading = false;

function loadPostsLazy() {
  if (postsLoading) return;
  postsLoading = true;
  if (loadPostsBtn) { loadPostsBtn.disabled = true; loadPostsBtn.textContent = 'Loading...'; }

  fetch(`https://jsonplaceholder.typicode.com/posts?_start=${postsStart}&_limit=${postsLimit}`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(posts => {
      if (!posts || posts.length === 0) {
        if (loadPostsBtn) loadPostsBtn.textContent = 'No more posts';
        postsLoading = false;
        return;
      }

      posts.forEach(post => {
        const li = document.createElement('li');
        li.className = 'post';
        li.innerHTML = `<strong>${post.title}</strong><p>${post.body}</p>`;
        postsList.appendChild(li);
      });

      postsStart += postsLimit;
      if (loadPostsBtn) { loadPostsBtn.disabled = false; loadPostsBtn.textContent = 'Load More Posts'; }
      postsLoading = false;

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Posts Loaded', { body: `${posts.length} new posts loaded.` });
      }

      // Observe last element for lazy loading
      if (postsList.children.length > 0) observer.observe(postsList.lastElementChild);
    })
    .catch(err => {
      console.error(err);
      showToast('Error loading posts');
      if (loadPostsBtn) { loadPostsBtn.disabled = false; loadPostsBtn.textContent = 'Load Posts'; }
      postsLoading = false;
    });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      loadPostsLazy();
    }
  });
}, { threshold: 0.5 });

if (loadPostsBtn) loadPostsBtn.addEventListener('click', loadPostsLazy);

// ===== MEDIA UPLOAD & CANVAS =====
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const canvas = document.getElementById('canvas');
const ctx = canvas?.getContext ? canvas.getContext('2d') : null;
let currentImage = null;
let rotation = 0;
let scale = 1;
const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

function handleFiles(files) {
  if (!preview) return;
  preview.innerHTML = '';
  if (!files || files.length === 0) return;

  Array.from(files).forEach(file => {
    if (!allowedTypes.includes(file.type)) {
      const msg = document.createElement('p');
      msg.style.color = 'red';
      msg.textContent = `File "${file.name}" is not a valid image type.`;
      preview.appendChild(msg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgEl = document.createElement('img');
      imgEl.src = e.target.result;
      imgEl.alt = file.name;
      imgEl.style.cursor = 'pointer';
      imgEl.addEventListener('click', () => drawImageOnCanvas(e.target.result));
      preview.appendChild(imgEl);
    };
    reader.readAsDataURL(file);
  });
}

function drawImageOnCanvas(src) {
  if (!ctx || !canvas) return;
  const img = new Image();
  img.onload = () => {
    currentImage = img;
    rotation = 0;
    scale = 1;

    // fit canvas to image but constrain to sensible max
    const maxW = 800;
    const maxH = 600;
    let w = img.width, h = img.height;
    const ratio = Math.min(maxW / w, maxH / h, 1);
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    redrawCanvas();
  };
  img.src = src;
}

function redrawCanvas() {
  if (!ctx || !canvas || !currentImage) return;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // compute draw size preserving aspect ratio to canvas
  const scaleToFit = Math.min(canvas.width / currentImage.width, canvas.height / currentImage.height);
  const drawW = currentImage.width * scaleToFit * scale;
  const drawH = currentImage.height * scaleToFit * scale;

  // translate to center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(currentImage, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

if (dropZone) {
  dropZone.addEventListener('click', () => fileInput && fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer) handleFiles(e.dataTransfer.files);
  });
}
if (fileInput) fileInput.addEventListener('change', () => handleFiles(fileInput.files));

// Canvas control buttons (guarded)
const rotateLeftBtn = document.getElementById('rotateLeft');
const rotateRightBtn = document.getElementById('rotateRight');
const resizeSmallBtn = document.getElementById('resizeSmall');
const resizeResetBtn = document.getElementById('resizeReset');
const downloadImageBtn = document.getElementById('downloadImage');

if (rotateLeftBtn) rotateLeftBtn.addEventListener('click', () => { rotation -= 90; redrawCanvas(); });
if (rotateRightBtn) rotateRightBtn.addEventListener('click', () => { rotation += 90; redrawCanvas(); });
if (resizeSmallBtn) resizeSmallBtn.addEventListener('click', () => { scale *= 0.5; redrawCanvas(); });
if (resizeResetBtn) resizeResetBtn.addEventListener('click', () => { scale = 1; rotation = 0; redrawCanvas(); });
if (downloadImageBtn) downloadImageBtn.addEventListener('click', () => {
  if (!canvas) { showToast('No image to download'); return; }
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// ===== COOKIES =====
async function setCookie(name, value, days) {
  if (!name || !value) { showToast('Please enter both name and value'); return; }

  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);
  let expires = '';
  if (days && !Number.isNaN(days) && days > 0) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = `${encodedName}=${encodedValue}${expires}; path=/`;

  if ('cookieStore' in window) {
    try {
      await cookieStore.set({ name, value, expires: days ? new Date(Date.now() + days * 86400000) : undefined, path: '/' });
    } catch (err) {
      console.error('cookieStore set error', err);
    }
  }

  showCookies();
  showToast(`Cookie "${name}" set`);
}

async function showCookies() {
  const list = document.getElementById('cookieList');
  if (!list) return;
  list.innerHTML = '';

  if ('cookieStore' in window) {
    try {
      const cookies = await cookieStore.getAll();
      if (!cookies.length) { list.textContent = 'No cookies found.'; return; }
      cookies.forEach(c => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${c.name}</strong>: ${c.value} <button class="delete-cookie" data-name="${c.name}">Delete</button>`;
        list.appendChild(div);
      });
      document.querySelectorAll('.delete-cookie').forEach(btn => btn.addEventListener('click', () => deleteCookie(btn.dataset.name)));
      return;
    } catch (err) { console.error(err); }
  }

  const all = document.cookie ? document.cookie.split(';') : [];
  if (all.length === 0 || (all.length === 1 && all[0] === '')) { list.textContent = 'No cookies found.'; return; }
  all.forEach(c => {
    const eq = c.indexOf('=');
    if (eq === -1) return;
    const name = decodeURIComponent(c.substring(0, eq).trim());
    const value = decodeURIComponent(c.substring(eq + 1));
    const div = document.createElement('div');
    div.innerHTML = `<strong>${name}</strong>: ${value} <button class="delete-cookie" data-name="${name}">Delete</button>`;
    list.appendChild(div);
  });
  document.querySelectorAll('.delete-cookie').forEach(btn => btn.addEventListener('click', () => deleteCookie(btn.dataset.name)));
}

async function deleteCookie(name) {
  if (!name) return;
  if ('cookieStore' in window) {
    try { await cookieStore.delete(name); } catch (err) { console.error(err); }
  }
  document.cookie = encodeURIComponent(name) + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  showCookies();
  showToast(`Cookie "${name}" deleted`);
}

async function clearCookies() {
  if ('cookieStore' in window) {
    try {
      const cookies = await cookieStore.getAll();
      for (const c of cookies) await cookieStore.delete(c.name);
    } catch (err) { console.error(err); }
  }
  const arr = document.cookie ? document.cookie.split(';') : [];
  arr.forEach(c => {
    const eq = c.indexOf('=');
    const name = eq > -1 ? c.substr(0, eq).trim() : c.trim();
    document.cookie = encodeURIComponent(name) + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });
  showCookies();
  showToast('All cookies cleared');
}

// cookie UI event listeners
const setCookieBtn = document.getElementById('setCookieBtn');
if (setCookieBtn) setCookieBtn.addEventListener('click', () => {
  const name = normalizeString(document.getElementById('cookieName')?.value || '');
  const value = normalizeString(document.getElementById('cookieValue')?.value || '');
  const days = parseInt(document.getElementById('cookieDays')?.value, 10) || 0;
  setCookie(name, value, days);
  document.getElementById('cookieName').value = '';
  document.getElementById('cookieValue').value = '';
  document.getElementById('cookieDays').value = '';
});
const showCookiesBtn = document.getElementById('showCookiesBtn');
if (showCookiesBtn) showCookiesBtn.addEventListener('click', showCookies);
const clearCookiesBtn = document.getElementById('clearCookiesBtn');
if (clearCookiesBtn) clearCookiesBtn.addEventListener('click', clearCookies);

// Show cookies on load (once DOM is ready — we'll call in DOMContentLoaded)

// ===== WEB WORKER (Blob) =====
const startWorkerBtn = document.getElementById('startWorkerBtn');
const workerOutput = document.getElementById('workerOutput');
const progressBar = document.getElementById('progressBar');

if (startWorkerBtn && progressBar) {
  const worker = new Worker('worker.js');

  startWorkerBtn.addEventListener('click', () => {
    workerOutput.textContent = 'Worker started…';
    startWorkerBtn.disabled = true;
    progressBar.style.width = '0%';

    worker.postMessage('start');

    worker.onmessage = (e) => {
      const data = e.data;
      if (data.type === 'progress') {
        progressBar.style.width = data.value + '%';
        workerOutput.textContent = `Progress: ${data.value}%`;
      } else if (data.type === 'done') {
        workerOutput.textContent = data.value;
        startWorkerBtn.disabled = false;
        progressBar.style.width = '100%';
      }
    };

    worker.onerror = (error) => {
      workerOutput.textContent = 'Worker error: ' + error.message;
      startWorkerBtn.disabled = false;
    };
  });

  // ===== THEME (settings modal toggle inside modal) =====
  // ===== THEME =====
  function applySavedTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.body.classList.add('dark');
  }
  applySavedTheme();

  // Centralized toggle function
  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(`Switched to ${isDark ? 'dark' : 'light'} theme`);
  }

  // Attach to both buttons if they exist
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const modalToggleThemeBtn = document.getElementById('modalToggleThemeBtn');

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (modalToggleThemeBtn) modalToggleThemeBtn.addEventListener('click', toggleTheme);


  // ===== MODALS: settings & profile =====
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');

  const profileBtn = document.getElementById('profileBtn');
  const profileModal = document.getElementById('profileModal');
  const closeProfileBtn = document.getElementById('closeProfileBtn');

  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => { settingsModal.hidden = false; });
  }
  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => { settingsModal.hidden = true; });
  }

  if (profileBtn && profileModal) {
    profileBtn.addEventListener('click', () => { profileModal.hidden = false; });
  }
  if (closeProfileBtn && profileModal) {
    closeProfileBtn.addEventListener('click', () => { profileModal.hidden = true; });
  }

  // Close modal by clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.hidden = true;
    if (e.target === profileModal) profileModal.hidden = true;
  });

  // Close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (settingsModal && !settingsModal.hidden) settingsModal.hidden = true;
      if (profileModal && !profileModal.hidden) profileModal.hidden = true;
    }
  });

  // ===== STATUS BANNER & NOTIFICATIONS =====
  function showStatus(message, isOnline) {
    const statusBanner = document.getElementById('statusBanner');
    if (!statusBanner) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message);
    } else {
      statusBanner.textContent = message;
      statusBanner.style.backgroundColor = isOnline ? 'var(--success)' : 'var(--danger)';
      statusBanner.hidden = false;
      setTimeout(() => { statusBanner.hidden = true; }, 3000);
    }
  }

  // Ask permission (only if default)
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(p => { if (p === 'granted') console.log('Notifications allowed'); });
  }
  window.addEventListener('offline', () => showStatus('You are offline! Some features may not work.', false));
  window.addEventListener('online', () => showStatus('Back online! Dashboard is fully functional.', true));

  // ===== SERVICE WORKER registration (if present) =====
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.error('Service Worker registration failed', err));
    });
  }

  // ===== DOMContentLoaded final init =====
  window.addEventListener('DOMContentLoaded', () => {
    // populate profile (if saved)
    const savedName = localStorage.getItem('name') || '';
    const savedAge = localStorage.getItem('age') || '';
    const savedCountry = localStorage.getItem('country') || '';

    if (savedName && savedAge && savedCountry) {
      infoDiv && (infoDiv.textContent = `Hello, ${savedName} from ${savedCountry}, age ${savedAge}!`);
      document.getElementById('name') && (document.getElementById('name').value = savedName);
      document.getElementById('age') && (document.getElementById('age').value = savedAge);
      document.getElementById('country') && (document.getElementById('country').value = savedCountry);
    }

    // populate cookies and notes UI
    showCookies();
    loadNotesFromDB();
  })
};
