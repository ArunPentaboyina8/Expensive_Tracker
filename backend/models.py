from pydantic import BaseModel
from typing import Optional
from datetime import date


# ─── Request Models ───────────────────────────────────────────────
class ExpenseCreate(BaseModel):
    amount: float
    category: str
    date: date
    description: Optional[str] = ""


class ChatRequest(BaseModel):
    message: str


# ─── Response Models ──────────────────────────────────────────────
class ExpenseResponse(BaseModel):
    id: int
    amount: float
    category: str
    date: date
    description: Optional[str] = ""


class ChatResponse(BaseModel):
    reply: str


class CategoryBreakdown(BaseModel):
    category: str
    total: float


class DailyExpense(BaseModel):
    date: str
    total: float


class SummaryResponse(BaseModel):
    totalSpent: float
    highestCategory: str
    highestCategoryAmount: float
    transactionCount: int
    categoryBreakdown: list[CategoryBreakdown]
    dailyExpenses: list[DailyExpense]
