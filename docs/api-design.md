# QuickNotes API Design

## REST Endpoints
| Method | Path | Description | Success Status |
|---|---|---|---|
| GET | `/notes` | Retrieve a list of all notes for the authenticated user. | 200 OK |
| GET | `/notes/:id` | Retrieve a specific note by its ID. | 200 OK |
| POST | `/notes` | Create a new note. | 201 Created |
| PUT | `/notes/:id` | Update an existing note's title or body. | 200 OK |
| DELETE | `/notes/:id` | Delete a specific note. | 204 No Content |
| GET | `/tags` | Retrieve all available tags created by the user. | 200 OK |

## JSON Examples

### Creating a Note (POST `/notes`)
**Request Body:**
```json
{
  "title": "Project Meeting",
  "body": "Discuss the new system architecture.",
  "tags": [1, 4]
}
**Response Body(201 created):**
{
  "id": 101,
  "userId": 1,
  "title": "Project Meeting",
  "body": "Discuss the new system architecture.",
  "createdAt": "2026-10-25T10:00:00Z"
}
## Listing Notes (GET /NOTES)
**Response Body(200 OK):**
[
  {
    "id": 101,
    "title": "Project Meeting",
    "body": "Discuss the new system architecture.",
    "createdAt": "2026-10-25T10:00:00Z"
  },
  {
    "id": 102,
    "title": "Grocery List",
    "body": "Milk, Eggs, Bread",
    "createdAt": "2026-10-24T15:30:00Z"
  }
]
Error Codes

The API uses standard HTTP status codes to indicate the success or failure of requests.

    400 Bad Request: The request was malformed or validation failed (e.g., missing title).

    401 Unauthorized: The user is not logged in or the authentication token is missing/invalid.

    403 Forbidden: The user is authenticated but does not have permission to access this specific note.

    404 Not Found: The requested note or endpoint does not exist.

    500 Internal Server Error: An unexpected error occurred on the server database.

Example Error Body (400 Bad Request):
{
  "error": "ValidationFailed",
  "message": "The 'title' field is required and cannot exceed 100 characters."
}
