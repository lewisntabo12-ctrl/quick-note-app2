# System Architecture

## Requirements
* **Functional:** Users can create, view, update, and delete notes asynchronously.
* **Non-functional:** The system must be highly available (99.9% uptime), offer low latency, and scale to support 1 million users.

## Load Estimates (1 Million Users)
*Assuming 10% Daily Active Users (100,000 DAU) writing 2 notes and reading 10 notes daily:*
* **Reads per second:** ~12 reads/sec (average).
* **Writes per second:** ~2.5 writes/sec (average).
* **Storage per year:** 100,000 users * 2 notes * 2KB per note = 400MB/day * 365 = **~146 GB / year**.

## Architecture Diagram
```text
           [DNS]
             |
          [Client]
             |
           [CDN]
             |
       [Load Balancer]
             |
      +------+------+
      |             |
[App Server 1] [App Server 2]
      |             |
      +------+------+
             |
         +---+---+------------------+
         |       |                  |
      [Cache] [Primary DB]       [Queue]
                 |                  |
             [Read Replica]      [Worker]

## Component Explanations

    DNS: Translates the QuickNotes domain name into the IP address of the Load Balancer.

    CDN: Caches static assets (HTML, CSS, JS) at edge locations near the user to speed up initial page loads.

    Load Balancer: Distributes incoming API traffic evenly across multiple App Servers to prevent overloading.

    App Servers (2+): Handle backend business logic, validation, and route requests to the database or cache.

    Cache (Redis): Stores frequently accessed notes in memory to reduce read pressure on the database.

    Primary DB: Handles all write operations (INSERT, UPDATE, DELETE) securely.

    Read Replica: A synchronized copy of the primary DB that handles all heavy read operations (SELECT).

    Queue: A message broker that holds background tasks temporarily.

    Worker: Processes background tasks from the queue (like sending email summaries or heavy data exports) without making the user wait.

Request Flows

    GET /notes Flow:
    Client requests DNS -> Hits CDN for static assets -> API call hits Load Balancer -> App Server checks Cache. If cache hits, return data. If miss, query Read Replica, save to Cache, return data.

    POST /notes Flow:
    Client sends JSON to Load Balancer -> App Server validates input -> App Server writes to Primary DB -> App Server invalidates old Cache -> Returns 201 Created to Client.

Trade-offs & Single Points of Failure

    Eventual Consistency vs. High Availability: By using a Primary DB and a Read Replica, we remove the database as a bottleneck for reads. The trade-off is eventual consistency; a note created on the Primary might take a few milliseconds to sync to the Replica.

    Avoiding Single Points of Failure (SPOF): By utilizing two or more App Servers behind a Load Balancer, we avoid a SPOF. If App Server 1 crashes, the Load Balancer instantly reroutes traffic to App Server 2, ensuring zero downtime for the user.              