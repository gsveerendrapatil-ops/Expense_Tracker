# Expense Tracker - Part 3

This version keeps the existing Login, Signup, Dashboard, Income, Expense and Profile routing from the uploaded project.

## Changes made
- MongoDB Community Server configuration:
  - `mongodb://127.0.0.1:27017/expense_tracker`
- Removed the animated/colored page backgrounds. Pages now use a clean light background.
- Income Edit now loads the selected transaction into the existing Add Income card at the top.
- Expense Edit now loads the selected transaction into the existing Add Expense card at the top.
- No bottom edit form and no edit modal.
- Added Edit and Delete controls to Income/Expense transaction rows.
- Profile now displays all income and expense transactions together, sorted newest first.
- Existing Login, Signup, Dashboard, Sidebar and protected routes were preserved.

## Run

### 1. Start MongoDB Community Server
Make sure the MongoDB Community Server service is running.

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs on:
`http://localhost:4000`

### 3. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite URL, normally:
`http://localhost:5173`

### 4. Test flow
1. Open the frontend URL.
2. You should see Login when there is no token.
3. Create an account using Signup if needed.
4. Login.
5. Dashboard opens after login.
6. Go to Income or Expenses.
7. Add a transaction.
8. Click Edit. The transaction data appears in the top Add card.
9. Click Update to save or Cancel to return to Add mode.
10. Open Profile to see all income and expense transactions together.
