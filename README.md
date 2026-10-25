# QuickNotes System Design

QuickNotes is a highly scalable, RESTful note-taking application designed to transition from a local browser app to a production-grade online service capable of supporting 1 million users. 

## Documentation Links
* [API Design Document](docs/api-design.md)
* [Data Model Document](docs/data-model.md)
* [Architecture Scaling Plan](docs/architecture.md)

## How to Run the API Client
1. Clone this repository to your local machine.
2. Open `index.html` in your web browser (or use VS Code Live Server).
3. The frontend interfaces with the JSONPlaceholder mock API to demonstrate GET, POST, and DELETE operations.

## What I Learned
* How to gracefully handle simulated API interactions (like JSONPlaceholder's DELETE endpoint returning 404s for locally created IDs) by managing DOM state independently.
* How to model relational data using SQL join tables to properly map Many-to-Many relationships.
* How to design a scalable cloud architecture using Load Balancers, Caching, and Read Replicas to avoid single points of failure.