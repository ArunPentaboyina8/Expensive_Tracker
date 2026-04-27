import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/expense_tracker")

# Global connection pool
pool: asyncpg.Pool = None


async def connect_db():
    """Create the async connection pool and initialize the database."""
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL)
    
    # Create the expenses table if it doesn't exist
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                amount NUMERIC(10, 2) NOT NULL,
                category VARCHAR(50) NOT NULL,
                date DATE NOT NULL DEFAULT CURRENT_DATE,
                description TEXT
            );
        """)
    print("[OK] Database initialized - expenses table ready")


async def close_db():
    """Close the connection pool."""
    global pool
    if pool:
        await pool.close()
        print("[OK] Database connection closed")


def get_pool() -> asyncpg.Pool:
    """Return the current connection pool."""
    return pool
