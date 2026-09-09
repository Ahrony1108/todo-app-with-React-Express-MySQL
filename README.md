# Todo Application

React + Node.js/Express + MySQL Todo CRUD application.

## Run

```bash
docker compose up -d --build
```

Open:

http://localhost:3000

API:

GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
DELETE /api/todos/:id

Backend health:

http://localhost:5000/health

## Stop

```bash
docker compose down
```

To also delete database data:

```bash
docker compose down -v
```

## Architecture

Browser -> Nginx/React -> /api -> Express -> MySQL

Inside Docker, the backend uses `mysql` as the MySQL hostname.
