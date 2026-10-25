# Data Model

## Entities & Relationships
* **users:** Stores account information. 
* **notes:** Stores the actual text notes. 
  * *Relationship:* **One-to-Many** (One user can have many notes).
* **tags:** Stores categorization labels.
* **note_tags:** A join table connecting notes and tags. 
  * *Relationship:* **Many-to-Many** (A note can have many tags, and a tag can belong to many notes).

## CREATE TABLE Statements
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
## Example SQL Queries

**1. Insert a new note:**

INSERT INTO notes (user_id, title, body) VALUES (1, 'Shopping', 'Buy milk');

**2. Retrieve all note for a specific user:**

SELECT title, body, created_at FROM notes WHERE user_id = 1 ORDER BY created_at DESC;

**3. Retrieve all tags for a specific note(using JOIN):**

SELECT tags.tag_name 
FROM tags
JOIN note_tags ON tags.id = note_tags.tag_id
WHERE note_tags.note_id = 101;

## INDEXING
CREATE INDEX idx_notes_user_id ON notes(user_id);

Reason: When users log in, the most common query is fetching their specific notes. Indexing the user_id foreign key prevents a full table scan and drastically speeds up the GET /notes endpoint.

SQL vs NoSQL Decision

I would choose SQL (a relational database) for this system. Notes, users, and tags have highly structured, predictable relationships. The requirement to support a Many-to-Many relationship between Notes and Tags is natively and cleanly handled by SQL join tables. A NoSQL document store would require duplicating tag data across note documents, making updates (like renaming a tag) unnecessarily complex.