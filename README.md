# React CRUD App (TypeScript)

A sample React 18 + TypeScript CRUD application with a mock API service. It demonstrates a clean architecture, reusable components, and a scalable folder layout.

## Project structure

```
src/
  app/
  components/
    UserList.tsx
    UserForm.tsx
    Input.tsx
    Button.tsx
  hooks/
    useUsers.ts
  services/
    userService.ts
  types/
    user.ts
  utils/
  index.tsx
  App.tsx
```

## Setup

1. Clone repository
   ```bash
   git clone <repo-url>
   cd my-app
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start app
   ```bash
   npm start
   ```
4. Open `http://localhost:3000`

## Features

- CRUD user management (create/edit/delete)
- `useUsers` custom hook
- mock API service (`userService`)
- form validation with errors
- mobile-first responsive UI
- accessible components (ARIA, keyboard friendly)

## Available scripts

- `npm start` – start dev server
- `npm run build` – production build
- `npm test` – run tests

## Usage

- Add a user via form
- Edit by clicking row Edit button
- Delete with Delete button

## Notes

- Replace mock service with real API as needed
- Keep `useUsers` as single source of truth
- Add tests and e2e coverage for production readiness

