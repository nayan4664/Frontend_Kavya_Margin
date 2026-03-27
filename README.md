# KavyaMargin - Enterprise Frontend

This is a **frontend-only** implementation of the KavyaMargin enterprise dashboard. All backend dependencies and MongoDB connections have been removed. Data is managed locally via `localStorage`.

## Features
- **Frontend-only architecture**: No backend server or database required.
- **Mock API Services**: Simulated API calls with `localStorage` persistence.
- **Role-based Access**: Hardcoded credentials for different organizational roles.
- **Dark Theme**: Permanent professional dark enterprise aesthetic.

## Authorized Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Super Admin | `nayan@kavyainfoweb.com` | `Nayan@4664` |
| Company Admin | `sushil@kavyainfoweb.com` | `Sushil@4664` |
| Project Manager | `rajni@kavyainfoweb.com` | `Rajni@4664` |
| HR | `raj@kavyainfoweb.com` | `Raj@4664` |
| Team Lead | `priti@kavyainfoweb.com` | `Priti@4664` |
| Viewers | *Any other email* | *Any password* |

## Getting Started
1.  Install dependencies: `npm install`
2.  Run the application: `npm run dev`
3.  The app will be available at `http://localhost:5173/`

## Troubleshooting
### Data Persistence
Since the app uses `localStorage`, clearing your browser cache or site data will reset the mock data (employees, company info, etc.) to their initial states.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


readme file update