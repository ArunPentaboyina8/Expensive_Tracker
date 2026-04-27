# 💰 Expense Tracker

A modern, full-stack Personal Finance Tracker application built with React, FastAPI, and PostgreSQL. It features a premium dark-mode dashboard, real-time spending analytics, and an integrated AI chat assistant to help you understand your spending habits.

## ✨ Features

- **Dashboard & Analytics:** Real-time data visualization with Recharts (Bar Charts, Pie Charts) showing total spending, top categories, and transaction counts.
- **Expense Management:** Full CRUD operations for tracking expenses seamlessly.
- **AI Chat Assistant:** A smart conversational interface that analyzes your spending queries and provides insights.
- **Premium UI:** A modern dark theme with glassmorphism, responsive design, and smooth animations using Tailwind CSS and standard CSS.
- **Robust API:** Fast and scalable backend powered by FastAPI and async PostgreSQL.

## 🛠️ Technology Stack

**Frontend:**
- React 18
- Vite
- Axios (for API requests)
- Recharts (for data visualization)
- Lucide React (for icons)

**Backend:**
- Python 3.x
- FastAPI
- PostgreSQL (via `asyncpg`)
- Pydantic (data validation)
- Uvicorn (ASGI server)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL Database running locally (port `5433` by default)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Open the App
Visit [http://localhost:5173/](http://localhost:5173/) in your browser to view the application!

## 📸 Application Structure
```text
Expense Tracker/
├── backend/            # FastAPI Python Server
│   ├── main.py         # API Endpoints
│   ├── models.py       # Pydantic Schemas
│   ├── database.py     # DB Connection Pool
│   └── .env            # Environment Variables
└── frontend/           # React App
    ├── src/
    │   ├── api.js      # Axios Interceptors
    │   ├── App.jsx     # Routing
    │   ├── components/ # Reusable UI pieces
    │   └── pages/      # Dashboard, Expenses, Chat
    └── index.html      # App Entry
```
