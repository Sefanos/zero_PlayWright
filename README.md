Next.js mock app: Destinations + todos

How to run locally:

1. Install deps

   npm install

2. Run dev server

   npm run dev

App endpoints:
- /login : mock login (use user@example.com / password)
- /destinations : view/add destinations
- /destinations/[id] : view destination and add todos

Notes: This uses an in-memory mock API under pages/api and is not persistent across restarts.
