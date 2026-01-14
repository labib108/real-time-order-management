# Real-time Order Management

## Authentication
This project uses **JWT-based authentication** with a **MySQL** database (via Prisma).

### Features
- **Login**: Users can sign in using their email and password.
- **Protected Routes**: Dashboard routes are protected and redirect to login if unauthenticated.
- **Logout**: Users can log out from the dashboard.

### Setup
1.  **Database**: Ensure a MySQL database is running.
2.  **Environment**: Configure `.env` with `DATABASE_URL` and `JWT_SECRET`.
    ```env
    DATABASE_URL="mysql://user:password@localhost:3306/mydb"
    JWT_SECRET="your-secret-key"
    ```
3.  **Seed**: Run `npx tsx scripts/seed-admin.ts` to create the initial admin user.
    - Default Admin: `admin@example.com` / `securepassword123`

### Architecture
- **API**: `app/api/auth/login` handles credentials validation and JWT issuance.
- **Frontend**: `useAuth` hook manages token storage and user state.
- **Protection**: `app/dashboard/layout.tsx` checks for auth state.

## Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS v4
- Shadcn UI
- Prisma ORM
- TanStack Query
- Socket.IO (Coming soon)
