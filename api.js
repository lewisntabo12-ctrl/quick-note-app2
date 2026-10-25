const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.getElementById('load-btn');
const statusText = document.getElementById('status');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const submitBtn = document.getElementById('submit-btn');
const notesList = document.getElementById('notes-list');

// Reusable async function that calls fetch, checks response, and throws errors
async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Handle empty JSON responses safely (e.g., DELETE returns empty)
    const data = await response.json().catch(() => ({}));
    return { data, status: response.status };
}

// Helper to display distinct success and error messages
function showStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.className = isError ? 'error' : 'success';
}

// TASK 1: GET (Load notes)
loadBtn.addEventListener('click', async () => {
    loadBtn.disabled = true;
    showStatus('Loading notes...', false);
    notesList.innerHTML = '';

    try {
        const { data } = await request(`${API_URL}?_limit=10`);
        
        if (data.length === 0) {
            showStatus('No notes found in the directory.', false);
            return;
        }

        data.forEach(note => addNoteToDOM(note, false));
        showStatus('Loaded 10 notes from the server.', false);
    } catch (error) {
        showStatus('Failed to load notes.', true);
    } finally {
        loadBtn.disabled = false;
    }
});

// TASK 2: POST (Create note)
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validation
    if (!title) {
        showStatus('Title is required.', true);
        return;
    }
    if (title.length > 100) {
        showStatus('Title must be 100 characters or fewer.', true);
        return;
    }

    submitBtn.disabled = true;
    showStatus('Creating note...', false);

    try {
        const { data, status } = await request(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });

        addNoteToDOM(data, true); // Add returned note to top of list
        showStatus(`Note created (status ${status}, id ${data.id}).`, false);
        noteForm.reset();
    } catch (error) {
        showStatus('Failed to create note.', true);
    } finally {
        submitBtn.disabled = false;
    }
});

// Helper function to render a note (Handles TASK 3: DELETE)
function addNoteToDOM(note, prepend = false) {
    const li = document.createElement('li');
    li.className = 'note-card';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = note.title; // User text inserted with textContent only
    
    const bodyEl = document.createElement('p');
    bodyEl.textContent = note.body || ''; // User text inserted with textContent only

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    
    // TASK 3: DELETE logic
    deleteBtn.addEventListener('click', async () => {
        deleteBtn.disabled = true;
        showStatus('Deleting note...', false);
        
        try {
            /* 
             * APPROACH EXPLANATION: 
             * JSONPlaceholder does not actually store the notes you create via POST. 
             * Therefore, if you try to send a DELETE request for a newly created note 
             * (e.g., ID 101), JSONPlaceholder will return a 404 error because it 
             * doesn't exist on their server. We catch that error below.
             */
            await request(`${API_URL}/${note.id}`, { method: 'DELETE' });
            li.remove();
            showStatus('Note deleted successfully.', false);
        } catch (error) {
            // Even if JSONPlaceholder throws a 404 for a fake ID, we remove it from the screen
            // so the user experience feels complete, but log the failure status.
            li.remove();
            showStatus(`Note removed locally (Server delete failed: ${error.message}).`, true);
        }
    });

    li.appendChild(titleEl);
    li.appendChild(bodyEl);
    li.appendChild(deleteBtn);

    if (prepend) {
        notesList.prepend(li);
    } else {
        notesList.appendChild(li);
    }
}