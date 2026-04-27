from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import connect_db, close_db, get_pool
from models import (
    ExpenseCreate,
    ExpenseResponse,
    ChatRequest,
    ChatResponse,
    SummaryResponse,
    CategoryBreakdown,
    DailyExpense,
)


# ─── Lifespan: DB connect/disconnect ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(title="Expense Tracker API", version="1.0.0", lifespan=lifespan)

# ─── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── POST /expense/add ───────────────────────────────────────────
@app.post("/expense/add", response_model=ExpenseResponse)
async def add_expense(expense: ExpenseCreate):
    pool = get_pool()
    try:
        row = await pool.fetchrow(
            """INSERT INTO expenses (amount, category, date, description)
               VALUES ($1, $2, $3, $4)
               RETURNING id, amount, category, date, description""",
            expense.amount,
            expense.category,
            expense.date,
            expense.description or "",
        )
        return ExpenseResponse(
            id=row["id"],
            amount=float(row["amount"]),
            category=row["category"],
            date=row["date"],
            description=row["description"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add expense: {str(e)}")


# ─── GET /expense/all ────────────────────────────────────────────
@app.get("/expense/all", response_model=list[ExpenseResponse])
async def get_all_expenses():
    pool = get_pool()
    try:
        rows = await pool.fetch("SELECT * FROM expenses ORDER BY date DESC, id DESC")
        return [
            ExpenseResponse(
                id=row["id"],
                amount=float(row["amount"]),
                category=row["category"],
                date=row["date"],
                description=row["description"],
            )
            for row in rows
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch expenses: {str(e)}"
        )


# ─── DELETE /expense/{id} ────────────────────────────────────────
@app.delete("/expense/{expense_id}")
async def delete_expense(expense_id: int):
    pool = get_pool()
    try:
        row = await pool.fetchrow(
            "DELETE FROM expenses WHERE id = $1 RETURNING *", expense_id
        )
        if row is None:
            raise HTTPException(status_code=404, detail="Expense not found")
        return {
            "message": "Expense deleted",
            "expense": {
                "id": row["id"],
                "amount": float(row["amount"]),
                "category": row["category"],
                "date": str(row["date"]),
                "description": row["description"],
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete expense: {str(e)}"
        )


# ─── GET /expense/summary ────────────────────────────────────────
@app.get("/expense/summary", response_model=SummaryResponse)
async def get_summary():
    pool = get_pool()
    try:
        # Total spent this month
        total_row = await pool.fetchrow("""
            SELECT COALESCE(SUM(amount), 0) as total
            FROM expenses
            WHERE date >= date_trunc('month', CURRENT_DATE)
              AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
        """)

        # Highest spending category this month
        cat_row = await pool.fetchrow("""
            SELECT category, SUM(amount) as total
            FROM expenses
            WHERE date >= date_trunc('month', CURRENT_DATE)
              AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
            GROUP BY category
            ORDER BY total DESC
            LIMIT 1
        """)

        # Transaction count this month
        count_row = await pool.fetchrow("""
            SELECT COUNT(*) as count
            FROM expenses
            WHERE date >= date_trunc('month', CURRENT_DATE)
              AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
        """)

        # Category breakdown
        breakdown_rows = await pool.fetch("""
            SELECT category, SUM(amount) as total
            FROM expenses
            WHERE date >= date_trunc('month', CURRENT_DATE)
              AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
            GROUP BY category
            ORDER BY total DESC
        """)

        # Daily expenses
        daily_rows = await pool.fetch("""
            SELECT date::text, SUM(amount) as total
            FROM expenses
            WHERE date >= date_trunc('month', CURRENT_DATE)
              AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
            GROUP BY date
            ORDER BY date
        """)

        return SummaryResponse(
            totalSpent=float(total_row["total"]),
            highestCategory=cat_row["category"] if cat_row else "N/A",
            highestCategoryAmount=float(cat_row["total"]) if cat_row else 0,
            transactionCount=int(count_row["count"]),
            categoryBreakdown=[
                CategoryBreakdown(category=r["category"], total=float(r["total"]))
                for r in breakdown_rows
            ],
            dailyExpenses=[
                DailyExpense(date=r["date"], total=float(r["total"]))
                for r in daily_rows
            ],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch summary: {str(e)}"
        )


# ─── POST /chat ──────────────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    pool = get_pool()
    try:
        lower_msg = request.message.lower()

        # Get all current month expenses
        expenses = await pool.fetch("""
            SELECT * FROM expenses
            WHERE date >= date_trunc('month', CURRENT_DATE)
              AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
            ORDER BY amount DESC
        """)

        # Category totals
        categories = await pool.fetch("""
            SELECT category, SUM(amount) as total, COUNT(*) as count
            FROM expenses
            WHERE date >= date_trunc('month', CURRENT_DATE)
              AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
            GROUP BY category
            ORDER BY total DESC
        """)

        # Total spent
        total_row = await pool.fetchrow("""
            SELECT COALESCE(SUM(amount), 0) as total FROM expenses
            WHERE date >= date_trunc('month', CURRENT_DATE)
              AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'
        """)
        total_spent = float(total_row["total"])

        if len(expenses) == 0:
            reply = "You haven't recorded any expenses this month yet. Start by adding some expenses!"
        elif any(w in lower_msg for w in ["most", "highest", "top"]):
            top = categories[0]
            reply = f"Your highest spending category this month is **{top['category']}** with ₹{float(top['total']):.2f} across {top['count']} transaction(s). "
            if len(categories) > 1:
                reply += f"Followed by {categories[1]['category']} (₹{float(categories[1]['total']):.2f})."
        elif any(w in lower_msg for w in ["total", "how much", "spent"]):
            reply = f"You've spent a total of **₹{total_spent:.2f}** this month across {len(expenses)} transaction(s). "
            if len(categories) > 0:
                breakdown = ", ".join(
                    f"{c['category']}: ₹{float(c['total']):.2f}" for c in categories
                )
                reply += f"Breakdown: {breakdown}."
        elif any(w in lower_msg for w in ["save", "saving", "reduce", "tip"]):
            top = categories[0]
            reply = f"💡 Your biggest expense category is **{top['category']}** (₹{float(top['total']):.2f}). Consider setting a budget limit for this category. "
            reply += "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings!"
        elif any(w in lower_msg for w in ["category", "breakdown", "categories"]):
            reply = "📊 Here's your spending breakdown this month:\n"
            for c in categories:
                pct = (float(c["total"]) / total_spent) * 100 if total_spent > 0 else 0
                reply += f"• {c['category']}: ₹{float(c['total']):.2f} ({pct:.1f}%)\n"
        elif any(w in lower_msg for w in ["recent", "last", "latest"]):
            recent = expenses[:5]
            reply = "📋 Your latest expenses:\n"
            for e in recent:
                reply += f"• ₹{float(e['amount']):.2f} on {e['category']} ({e['date']}) - {e['description'] or 'No description'}\n"
        elif any(w in lower_msg for w in ["hello", "hi", "hey"]):
            reply = '👋 Hello! I\'m your Finance Assistant. Ask me about your spending! Try:\n• "Where am I spending most?"\n• "How much have I spent?"\n• "Give me saving tips"\n• "Show category breakdown"'
        else:
            reply = 'I can help you understand your finances! Try asking:\n• "Where am I spending most?"\n• "How much have I spent this month?"\n• "Show me a category breakdown"\n• "Give me saving tips"\n• "Show recent expenses"'

        return ChatResponse(reply=reply)
    except Exception as e:
        return ChatResponse(reply="Sorry, I encountered an error. Please try again.")


# ─── Root ─────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "Expense Tracker API is running 🚀"}
