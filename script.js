// script.js

// Profile DOM references
const profileForm = document.getElementById('profileForm');
const infoDiv = document.getElementById('info');

profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value.trim();
  const country = document.getElementById('country').value.trim();

  if (!name || !age || !country) {
    infoDiv.textContent = `Please fill out all fields.`;
    return;
  }

  localStorage.setItem('name', name);
  localStorage.setItem('age', age);
  localStorage.setItem('country', country);

  // Display basic info
  infoDiv.textContent = `Hello, ${name} from ${country}, age ${age}!`;


  profileForm.reset();
})

// Helper function to normalize spaces
function normalizeString(str) {
  return str.trim().replace(/\s+/g, ' ');
}

// Load saved profile on page load
window.addEventListener('DOMContentLoaded', () => {
  let savedName = localStorage.getItem('name') || '';
  let savedAge = localStorage.getItem('age') || '';
  let savedCountry = localStorage.getItem('country') || '';

  savedName = normalizeString(savedName);
  savedAge = normalizeString(savedAge);
  savedCountry = normalizeString(savedCountry);

  if (savedName && savedAge && savedCountry) {
    infoDiv.textContent = `Hello, ${savedName} from ${savedCountry}, age ${savedAge}!`;
    document.getElementById('name').value = savedName;
    document.getElementById('age').value = savedAge;
    document.getElementById('country').value = savedCountry;
  }
});

// Notes DOM references
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');


// === SAVING NOTES TO INDEXDB ===
// --- IndexedDB Setup ---
let db;
const request = indexedDB.open('dashboardDB', 1);

request.onerror = (event) => console.error('DB error', event.target.error);
request.onsuccess = (event) => {
  db = event.target.result;
  loadNotesFromDB();
};
request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('text', 'text', { unique: false });
};

// --- Add Note ---
function addNote() {
  if (!db) return;

  const noteText = noteInput.value.trim();
  if (!noteText) return;

  const transaction = db.transaction(['notes'], 'readwrite');
  const store = transaction.objectStore('notes');
  store.add({ text: noteText });

  transaction.oncomplete = () => {
    noteInput.value = '';
    loadNotesFromDB();
  };
}

//=== ADDING NOTE EVENT HANDLERS ===
addNoteBtn.addEventListener('click', addNote);

// Attach to Enter key in input
noteInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addNote();
  }
});


// --- Load Notes ---
function loadNotesFromDB() {
  const transaction = db.transaction(['notes'], 'readonly');
  const store = transaction.objectStore('notes');
  const request = store.getAll();

  request.onsuccess = () => {
    notesList.innerHTML = '';
    request.result.forEach(note => {
      const li = document.createElement('li');
      li.setAttribute('data-id', note.id);

      // Note text
      const span = document.createElement('span');
      span.textContent = note.text;
      li.appendChild(span);

      // Edit Button
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = note.text;
        li.insertBefore(input, span);
        li.removeChild(span);
        input.focus();

        // Save on blur or Enter
        input.addEventListener('blur', () => saveEdit(note.id, input.value, li, input));
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') input.blur();
        });
      });

      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => deleteNoteDB(note.id);

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      notesList.appendChild(li);
    });
  };
}

// --- Save Edit ---
function saveEdit(id, newText, li, input) {
  newText = newText.trim();
  if (!newText) {
    alert('Note cannot be empty.');
    input.focus();
    return;
  }

  const transaction = db.transaction(['notes'], 'readwrite');
  const store = transaction.objectStore('notes');
  store.put({ id, text: newText });

  transaction.oncomplete = () => {
    const span = document.createElement('span');
    span.textContent = newText;
    li.insertBefore(span, input);
    li.removeChild(input);
  };
}

// --- Delete Note ---
function deleteNoteDB(id) {
  const transaction = db.transaction(['notes'], 'readwrite');
  const store = transaction.objectStore('notes');
  store.delete(id);
  transaction.oncomplete = () => loadNotesFromDB();
}


//=== LOADING POSTS HANDLER ===
let start = 0;
const limit = 10;

const loadPostsBtn = document.getElementById('loadPostsBtn');
const postsList = document.getElementById('posts');

function loadPostsLazy() {
  fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
    .then(res => res.json())
    .then(posts => {
      posts.forEach(post => {
        const li = document.createElement('li');
        li.className = 'post';
        li.innerHTML = `<strong>${post.title}</strong><p>${post.body}</p>`;
        postsList.appendChild(li);
      });
      start += limit;

      // Observe last post for lazy loading
      const lastPost = postsList.lastElementChild;
      if (lastPost) observer.observe(lastPost);
    })
    .catch(err => console.error(err));
}

// IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      loadPostsLazy();
    }
  });
}, { root: postsList, threshold: 1.0 });

loadPostsBtn.addEventListener('click', loadPostsLazy);


//=== Media Upload ===
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

// Allowed file types
const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];

// Function to handle file upload
function handleFiles(files) {
  preview.innerHTML = '';

  Array.from(files).forEach(file => {
    if (!allowedTypes.includes(file.type)) {
      const msg = document.createElement('p');
      msg.style.color = 'red';
      msg.textContent = `File "${file.name}" is not a valid image type.`;
      preview.appendChild(msg);
      return;
    }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  });
}

// Click on drop zone triggers file input
dropZone.addEventListener('click', () => fileInput.click());

// Handle file input change
fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});



//=== COOKIES SECTION ===

// == Helper function to show modal ===
const cookieModal = document.getElementById('cookieModal');

function showModal(message, duration = 2500) {
  cookieModal.textContent = message;
  cookieModal.style.display = 'block';

  setTimeout(() => {
    cookieModal.style.display = 'none';
  }, duration);
}

async function setCookie(name, value, days) {
  if (!name || !value) {
    showModal('Please enter both Name and Value!');
    return;
  }

  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);

  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = `${encodedName}=${encodedValue}${expires}; path=/`;


  //=== NEW API IF AVAILABLE IN BROWSER ===
  if ('cookieStore' in window) {
    try {
      await cookieStore.set({
        name: name,
        value: value,
        expires: days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : undefined,
        path: '/'
      })
    } catch (error) {
      console.error('cookieStore error', error);
    }
  }
  showCookies();
}

// === SHOW ALL COOKIES ===
async function showCookies() {
  const cookieList = document.getElementById('cookieList');

  cookieList.innerHTML = '';

  //NEW API
  if ('cookieStore' in window) {
    try {
      const cookies = await cookieStore.getAll();
      if (cookies.length === 0) cookieList.textContent = 'No cookies found.';
      cookies.forEach(cookie => {
        const li = document.createElement('div');
        li.textContent = `${cookie.name} = ${cookie.value}`;
        cookieList.appendChild(li);
      })
      return;
    } catch (error) {
      console.error('cookieStore getAll error', error);
    }
  }
  //OLD API FALLBACK
  const allCookies = ';' + document.cookie;
  const parts = allCookies.split(/;\s*/).filter(c => c !== '');
  parts.forEach(cookieStr => {
    const eqPos = cookieStr.indexOf('=');
    if (eqPos === -1) return; // skip invalid cookies
    const name = decodeURIComponent(cookieStr.substring(0, eqPos).trim());
    const value = decodeURIComponent(cookieStr.substring(eqPos + 1));
    console.log(name, value);
  });
}

//=== CLEARING COOKIES === 
async function clearCookies() {
  //NEW API
  if ('cookieStore' in window) {
    try {
      const cookies = await cookieStore.getAll();

      for (const c of cookies) {
        await cookieStore.delete(c.name, { path: '/' });
      }
    } catch (error) {
      console.error(error);
    }
  }
  //OLD API fallback
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = encodeURIComponent(name) + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });
  showCookies();
}

//=== COOKIES EVENT HANDLERS ===
document.getElementById('setCookieBtn').addEventListener('click', () => {
  const name = document.getElementById('cookieName').value.trim();
  const value = document.getElementById('cookieValue').value.trim();
  const days = parseInt(document.getElementById('cookieDays').value);

  setCookie(name, value, days);
  document.getElementById('cookieName').value = '';
  document.getElementById('cookieValue').value = '';
  document.getElementById('cookieDays').value = '';
});

document.getElementById('showCookiesBtn').addEventListener('click', showCookies);
document.getElementById('clearCookiesBtn').addEventListener('click', clearCookies);

// Show cookies on page load
window.addEventListener('DOMContentLoaded', showCookies);


// WEB WORKER HANDLER ===
const startWorkerBtn = document.getElementById('startWorkerBtn');
const workerOutput = document.getElementById('workerOutput');

startWorkerBtn.addEventListener('click', () => {
  workerOutput.textContent = 'Worker started…';
  startWorkerBtn.disabled = true;

  const worker = new Worker('/worker.js');

  worker.postMessage('start');

  worker.onmessage = (e) => {
    const data = e.data;
    if (data.type === 'progress') {
      workerOutput.textContent = `Progress ${data.value}%`;
    } else if (data.type === 'done') {
      workerOutput.textContent = data.value;
      startWorkerBtn.disabled = false;
    }
  }

});

// === SERVICE WORKER HANDLING ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}


//=== THEME TOGGLE ===
const themeToggle = document.createElement('button');
themeToggle.textContent = 'Toggle Theme';
document.querySelector('header nav').appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

//=== APPLYING THEME ON PAGE LOAD ===
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
});


// === Detect online/offline status & show notifications ===
const statusBanner = document.getElementById('statusBanner');

function showStatus(message, isOnline) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(message);
  } else {
    // Show banner instead
    statusBanner.textContent = message;
    statusBanner.style.backgroundColor = isOnline ? 'green' : 'red';
    statusBanner.style.display = 'block';

    // Hide after 3 seconds
    setTimeout(() => {
      statusBanner.style.display = 'none';
    }, 3000);
  }
}

// Ask permission on page load
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// Listen for offline/online events
window.addEventListener('offline', () => {
  showStatus('You are offline! Some features may not work.', false);
});

window.addEventListener('online', () => {
  showStatus('Back online! Dashboard is fully functional.', true);
});
