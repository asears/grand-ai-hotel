"""
Security Scanner for Python Code

Detects common security vulnerabilities and anti-patterns.
Implements Dmitri's security analysis patterns.

Author: Dmitri (Security Auditor)
License: CC0-1.0
"""

import ast
import re
from typing import Any, Dict, List


class SecurityScanner:
    """Security vulnerability scanner for Python code."""

    # Security issue severity levels
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"

    def __init__(self, source_code: str, tree: ast.AST) -> None:
        """
        Initialize security scanner.

        Args:
            source_code: Python source code
            tree: Parsed AST
        """
        self.source_code = source_code
        self.tree = tree
        self.issues: List[Dict[str, Any]] = []

    def scan(self) -> List[Dict[str, Any]]:
        """
        Perform complete security scan.

        Returns:
            List of security issues found
        """
        self.issues = []

        # Run all security checks
        self._check_dangerous_functions()
        self._check_sql_injection()
        self._check_path_traversal()
        self._check_unsafe_deserialization()
        self._check_hardcoded_secrets()
        self._check_weak_crypto()
        self._check_shell_injection()

        # Sort by severity
        severity_order = [self.CRITICAL, self.HIGH, self.MEDIUM, self.LOW, self.INFO]
        self.issues.sort(key=lambda x: severity_order.index(x["severity"]))

        return self.issues

    def _add_issue(
        self,
        severity: str,
        title: str,
        description: str,
        lineno: int,
        recommendation: str,
    ) -> None:
        """Add security issue to list."""
        self.issues.append({
            "severity": severity,
            "title": title,
            "description": description,
            "lineno": lineno,
            "recommendation": recommendation,
        })

    def _check_dangerous_functions(self) -> None:
        """Check for dangerous built-in functions."""
        dangerous_funcs = {
            "eval": (self.HIGH, "Arbitrary code execution risk"),
            "exec": (self.HIGH, "Arbitrary code execution risk"),
            "compile": (self.MEDIUM, "Dynamic code compilation"),
            "__import__": (self.MEDIUM, "Dynamic import can load malicious code"),
        }

        for node in ast.walk(self.tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    func_name = node.func.id
                    if func_name in dangerous_funcs:
                        severity, desc = dangerous_funcs[func_name]
                        self._add_issue(
                            severity=severity,
                            title=f"Dangerous function: {func_name}()",
                            description=desc,
                            lineno=node.lineno,
                            recommendation=f"Avoid using {func_name}(). "
                            "Consider safer alternatives like ast.literal_eval() for eval(), "
                            "or refactor to eliminate dynamic code execution.",
                        )

    def _check_sql_injection(self) -> None:
        """Check for potential SQL injection vulnerabilities."""
        for node in ast.walk(self.tree):
            # Check for string formatting in SQL-like strings
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Attribute):
                    # Check for .execute() calls
                    if node.func.attr == "execute" and node.args:
                        first_arg = node.args[0]

                        # Check for f-strings or % formatting
                        if isinstance(first_arg, ast.JoinedStr):
                            self._add_issue(
                                severity=self.HIGH,
                                title="SQL Injection: f-string in SQL query",
                                description="Using f-strings for SQL queries allows injection attacks",
                                lineno=node.lineno,
                                recommendation="Use parameterized queries with placeholders: "
                                "execute('SELECT * FROM users WHERE id = ?', [user_id])",
                            )

                        # Check for string concatenation
                        elif isinstance(first_arg, ast.BinOp) and isinstance(
                            first_arg.op, ast.Add
                        ):
                            if self._contains_string(first_arg):
                                self._add_issue(
                                    severity=self.HIGH,
                                    title="SQL Injection: String concatenation in query",
                                    description="String concatenation in SQL queries is unsafe",
                                    lineno=node.lineno,
                                    recommendation="Use parameterized queries instead of concatenation",
                                )

    def _check_path_traversal(self) -> None:
        """Check for path traversal vulnerabilities."""
        for node in ast.walk(self.tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    # Check for file operations
                    if node.func.id in ("open", "read", "write"):
                        if node.args and isinstance(node.args[0], (ast.Name, ast.BinOp)):
                            self._add_issue(
                                severity=self.MEDIUM,
                                title="Potential path traversal",
                                description="User-controlled file paths can lead to unauthorized access",
                                lineno=node.lineno,
                                recommendation="Validate and sanitize file paths. Use os.path.basename() "
                                "or pathlib.Path.resolve() to prevent directory traversal.",
                            )

    def _check_unsafe_deserialization(self) -> None:
        """Check for unsafe deserialization (pickle)."""
        for node in ast.walk(self.tree):
            if isinstance(node, ast.Call):
                # Check for pickle.loads()
                if isinstance(node.func, ast.Attribute):
                    if (
                        isinstance(node.func.value, ast.Name)
                        and node.func.value.id == "pickle"
                        and node.func.attr in ("loads", "load")
                    ):
                        self._add_issue(
                            severity=self.HIGH,
                            title="Unsafe deserialization: pickle",
                            description="pickle.loads() can execute arbitrary code from untrusted data",
                            lineno=node.lineno,
                            recommendation="Use JSON or other safe serialization formats. "
                            "If pickle is required, ensure data source is trusted and verified.",
                        )

    def _check_hardcoded_secrets(self) -> None:
        """Check for hardcoded secrets in source code."""
        # Patterns for common secrets
        secret_patterns = [
            (r"password\s*=\s*['\"][\w!@#$%^&*]+['\"]", "Password"),
            (r"api[_-]?key\s*=\s*['\"][\w-]+['\"]", "API Key"),
            (r"secret[_-]?key\s*=\s*['\"][\w-]+['\"]", "Secret Key"),
            (r"token\s*=\s*['\"][\w.-]+['\"]", "Token"),
            (r"aws[_-]?secret\s*=\s*['\"][\w/+]+['\"]", "AWS Secret"),
        ]

        lines = self.source_code.splitlines()
        for lineno, line in enumerate(lines, start=1):
            for pattern, secret_type in secret_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    self._add_issue(
                        severity=self.CRITICAL,
                        title=f"Hardcoded secret: {secret_type}",
                        description=f"{secret_type} found in source code",
                        lineno=lineno,
                        recommendation="Move secrets to environment variables or secure vault. "
                        "Use os.getenv() or python-dotenv to load from .env files.",
                    )

    def _check_weak_crypto(self) -> None:
        """Check for weak cryptographic practices."""
        weak_algorithms = {"md5", "sha1"}

        for node in ast.walk(self.tree):
            if isinstance(node, ast.Call):
                # Check for hashlib weak algorithms
                if isinstance(node.func, ast.Attribute):
                    if (
                        isinstance(node.func.value, ast.Name)
                        and node.func.value.id == "hashlib"
                        and node.func.attr in weak_algorithms
                    ):
                        self._add_issue(
                            severity=self.MEDIUM,
                            title=f"Weak cryptographic algorithm: {node.func.attr}",
                            description=f"{node.func.attr.upper()} is cryptographically weak",
                            lineno=node.lineno,
                            recommendation="Use stronger algorithms like SHA-256 or SHA-512 "
                            "for cryptographic purposes.",
                        )

    def _check_shell_injection(self) -> None:
        """Check for shell injection vulnerabilities."""
        for node in ast.walk(self.tree):
            if isinstance(node, ast.Call):
                # Check for os.system, subprocess with shell=True
                if isinstance(node.func, ast.Attribute):
                    if (
                        isinstance(node.func.value, ast.Name)
                        and node.func.value.id == "os"
                        and node.func.attr == "system"
                    ):
                        self._add_issue(
                            severity=self.HIGH,
                            title="Shell injection risk: os.system()",
                            description="os.system() with user input can execute arbitrary commands",
                            lineno=node.lineno,
                            recommendation="Use subprocess.run() with shell=False and argument list. "
                            "Validate and sanitize all user input.",
                        )

                # Check for subprocess with shell=True
                elif isinstance(node.func, ast.Attribute) and node.func.attr in (
                    "call",
                    "run",
                    "Popen",
                ):
                    for keyword in node.keywords:
                        if keyword.arg == "shell" and isinstance(keyword.value, ast.Constant):
                            if keyword.value.value is True:
                                self._add_issue(
                                    severity=self.HIGH,
                                    title="Shell injection risk: shell=True",
                                    description="subprocess with shell=True is vulnerable to injection",
                                    lineno=node.lineno,
                                    recommendation="Set shell=False and pass command as list of arguments",
                                )

    def _contains_string(self, node: ast.AST) -> bool:
        """Check if node contains string constants."""
        for child in ast.walk(node):
            if isinstance(child, ast.Constant) and isinstance(child.value, str):
                return True
        return False


def scan_security(source_code: str, tree: ast.AST) -> List[Dict[str, Any]]:
    """
    Main entry point for security scanning.

    Args:
        source_code: Python source code
        tree: Parsed AST

    Returns:
        List of security issues
    """
    scanner = SecurityScanner(source_code, tree)
    return scanner.scan()
