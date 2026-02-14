


https://github.com/user-attachments/assets/58f4b8bc-59bc-4764-9d40-917f8b031222


# To-Do Task Manager (Full Stack)

This project is a small production-leaning MVP task manager built with:

- Backend: ASP.NET Core Web API + EF Core + SQLite
- Frontend: React + TypeScript + styled-components + React Query

It includes filtering, sorting, pagination, status workflow, optimistic updates, validation, tests, and setup documentation.

## Project Structure

- `backend/` ASP.NET Core API and SQLite persistence
- `backend/tests/` xUnit unit and integration tests
- `frontend/` React application (Vite)
- `CONVENTIONS.md` frontend coding conventions applied in `frontend/src`

## Prerequisites

- .NET SDK 6+
- Node.js 18+
- npm 10+

## Backend Setup

From repo root:

```bash
cd backend
dotnet restore
```

### Create SQLite database and tables

Install EF tooling (once):

```bash
dotnet tool install --global dotnet-ef --version 6.0.36
```

Add tool path to shell session if needed:

```bash
export PATH="$PATH:$HOME/.dotnet/tools"
```

Create migration (already included in this repo, shown for reference):

```bash
dotnet ef migrations add InitialCreate
```

Apply migration:

```bash
dotnet ef database update
```

This creates `backend/todo.db` and the `Tasks` table with indexes.

### Run backend API

```bash
dotnet run
```

Default endpoints:

- `GET /health`
- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`

Swagger is enabled in development.

## Frontend Setup

From repo root:

```bash
cd frontend
npm install
```

Create `.env` in `frontend/`:

```bash
VITE_API_BASE_URL=http://localhost:5215
```

Run frontend:

```bash
npm run dev
```

Build frontend:

```bash
npm run build
```

## Test Commands

Backend:

```bash
cd backend
dotnet test tests/tests.csproj
```

Frontend:

```bash
cd frontend
npm run test:run
```

## API Query Features

`GET /api/tasks` supports:

- `search` (title/description)
- `status`
- `priority`
- `sortBy` (`createdAt`, `dueDate`, `priority`, `status`, `title`)
- `sortDirection` (`asc`, `desc`)
- `page`
- `pageSize`

## Assumptions

- Single-user task manager (no auth/identity in MVP).
- SQLite chosen for portability and simple local setup.
- Server stores UTC timestamps.
- Task status lifecycle is `Todo -> InProgress -> Completed` in UI toggle flow.

## Trade-offs

- SQLite is simple and fast to bootstrap, but not ideal for high write concurrency.
- Layered monolith keeps complexity low for this scope, but is less independently scalable than separated services.
- Optimistic UI for status updates improves responsiveness but can require conflict handling in multi-user environments.

## Scalability and Production Notes

- Add authentication/authorization and task ownership (`UserId` foreign key).
- Add structured logging + tracing (OpenTelemetry) and centralized metrics.
- Add rate limiting, retry/backoff, and API versioning.
- Add background jobs/reminders for due tasks.
- Add CI/CD pipeline with lint, test, build, and migration checks.
- Consider moving from SQLite to PostgreSQL for concurrent production workloads.

## Future Improvements

- Task labels/tags and saved filter views.
- Bulk actions and drag-and-drop prioritization.
- Real-time sync via SignalR/WebSockets.
- Audit trail/history for task changes.

