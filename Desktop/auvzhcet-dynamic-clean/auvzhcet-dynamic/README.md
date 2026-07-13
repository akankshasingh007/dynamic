# MTS AUV-ZHCET Dynamic Website

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set a strong `JWT_SECRET`.
2. Run `npm run install-all` from this folder.
3. Run `npm run dev`, then open the URL reported by Vite (normally `http://localhost:5173`).

The first server start creates and seeds the SQLite database. The default developer account is `developer` / `devpass`; change this credential before deployment.

## Included capabilities

- Public home, About Markdown, vehicle explorer, team and events pages.
- Member portal with internal club files and documents (members, admins, developers).
- Role-aware login, developer approval, audit history, protected admin Markdown editor, and developer database monitor.
- Rate-limited, club-scoped AI helper with a useful offline response when no API key is configured.

## Deployment notes

Use a managed secret store for `JWT_SECRET` and `GEMINI_API_KEY`, enable HTTPS, and configure a persistent volume for the SQLite database. The frontend uses `VITE_API_URL` if the API is deployed on a separate origin.
