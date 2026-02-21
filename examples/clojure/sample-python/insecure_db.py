"""
Database operations module.
WARNING: This file intentionally contains security vulnerabilities for demonstration!
"""
import sqlite3


# SECURITY ISSUE: Hardcoded credentials
DATABASE_PASSWORD = "admin123"
API_KEY = "sk_test_12345abcdef"


def get_user_by_email(email):
    """Get user by email address."""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # SECURITY ISSUE: SQL Injection vulnerability
    query = f"SELECT * FROM users WHERE email = '{email}'"
    cursor.execute(query)
    
    results = cursor.fetchall()
    conn.close()
    return results


def execute_custom_query(user_input):
    """Execute custom database query."""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # SECURITY ISSUE: Unsafe eval
    query = eval(user_input)
    cursor.execute(query)
    
    return cursor.fetchall()


def redirect_user(url):
    """Redirect user to specified URL."""
    # SECURITY ISSUE: Unvalidated redirect
    return f"Location: {url}"


def load_file(filename):
    """Load file from disk."""
    # SECURITY ISSUE: Path traversal
    with open(f"../data/{filename}", 'r') as f:
        return f.read()


# Missing docstrings on some functions
def ProcessData(data):
    res = []
    for item in data:
        if item > 100:
            res.append(item * 2)
    return res
