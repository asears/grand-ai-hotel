"""
Python AST Analyzer for WASM Playground

Provides AST parsing and analysis capabilities for Python code in the browser.
Designed to run in Pyodide WebAssembly environment.

Author: Grand Budapest Terminal
License: CC0-1.0
"""

import ast
import json
from typing import Any, Dict, List, Optional


class ASTAnalyzer:
    """Main AST analysis class for Python code."""

    def __init__(self, source_code: str) -> None:
        """
        Initialize analyzer with Python source code.

        Args:
            source_code: Python code to analyze

        Raises:
            SyntaxError: If code cannot be parsed
        """
        self.source_code = source_code
        self.tree: Optional[ast.AST] = None
        self.errors: List[str] = []

    def parse(self) -> bool:
        """
        Parse source code into AST.

        Returns:
            True if parsing successful, False otherwise
        """
        try:
            self.tree = ast.parse(self.source_code)
            return True
        except SyntaxError as e:
            self.errors.append(f"Syntax error at line {e.lineno}: {e.msg}")
            return False
        except Exception as e:
            self.errors.append(f"Parse error: {str(e)}")
            return False

    def get_structure(self) -> Dict[str, Any]:
        """
        Extract code structure (functions, classes, imports).

        Returns:
            Dictionary containing code structure information
        """
        if not self.tree:
            return {"error": "No AST available. Call parse() first."}

        structure = {
            "functions": [],
            "classes": [],
            "imports": [],
            "globals": [],
        }

        for node in ast.walk(self.tree):
            if isinstance(node, ast.FunctionDef):
                structure["functions"].append({
                    "name": node.name,
                    "lineno": node.lineno,
                    "args": [arg.arg for arg in node.args.args],
                    "returns": ast.unparse(node.returns) if node.returns else None,
                    "decorators": [ast.unparse(d) for d in node.decorator_list],
                    "has_docstring": ast.get_docstring(node) is not None,
                })

            elif isinstance(node, ast.ClassDef):
                structure["classes"].append({
                    "name": node.name,
                    "lineno": node.lineno,
                    "bases": [ast.unparse(base) for base in node.bases],
                    "methods": [
                        item.name
                        for item in node.body
                        if isinstance(item, ast.FunctionDef)
                    ],
                    "has_docstring": ast.get_docstring(node) is not None,
                })

            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        structure["imports"].append({
                            "module": alias.name,
                            "alias": alias.asname,
                            "lineno": node.lineno,
                        })
                else:
                    for alias in node.names:
                        structure["imports"].append({
                            "module": f"{node.module}.{alias.name}",
                            "alias": alias.asname,
                            "lineno": node.lineno,
                        })

        return structure

    def get_metrics(self) -> Dict[str, Any]:
        """
        Calculate code metrics.

        Returns:
            Dictionary of code metrics
        """
        if not self.tree:
            return {"error": "No AST available"}

        metrics = {
            "total_lines": len(self.source_code.splitlines()),
            "code_lines": self._count_code_lines(),
            "comment_lines": self._count_comment_lines(),
            "blank_lines": self._count_blank_lines(),
            "function_count": 0,
            "class_count": 0,
            "import_count": 0,
            "max_nesting_depth": 0,
        }

        for node in ast.walk(self.tree):
            if isinstance(node, ast.FunctionDef):
                metrics["function_count"] += 1
            elif isinstance(node, ast.ClassDef):
                metrics["class_count"] += 1
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                metrics["import_count"] += 1

        # Calculate max nesting depth
        metrics["max_nesting_depth"] = self._calculate_max_depth(self.tree)

        return metrics

    def get_ast_json(self) -> str:
        """
        Convert AST to JSON representation.

        Returns:
            JSON string of AST structure
        """
        if not self.tree:
            return json.dumps({"error": "No AST available"})

        return json.dumps(self._ast_to_dict(self.tree), indent=2)

    def _ast_to_dict(self, node: ast.AST) -> Dict[str, Any]:
        """Convert AST node to dictionary recursively."""
        result: Dict[str, Any] = {"type": node.__class__.__name__}

        if hasattr(node, "lineno"):
            result["lineno"] = node.lineno
        if hasattr(node, "col_offset"):
            result["col_offset"] = node.col_offset

        for field, value in ast.iter_fields(node):
            if isinstance(value, list):
                result[field] = [
                    self._ast_to_dict(item) if isinstance(item, ast.AST) else item
                    for item in value
                ]
            elif isinstance(value, ast.AST):
                result[field] = self._ast_to_dict(value)
            else:
                result[field] = str(value) if value is not None else None

        return result

    def _count_code_lines(self) -> int:
        """Count non-comment, non-blank lines."""
        lines = self.source_code.splitlines()
        return sum(
            1
            for line in lines
            if line.strip() and not line.strip().startswith("#")
        )

    def _count_comment_lines(self) -> int:
        """Count comment lines."""
        lines = self.source_code.splitlines()
        return sum(1 for line in lines if line.strip().startswith("#"))

    def _count_blank_lines(self) -> int:
        """Count blank lines."""
        lines = self.source_code.splitlines()
        return sum(1 for line in lines if not line.strip())

    def _calculate_max_depth(self, node: ast.AST, current_depth: int = 0) -> int:
        """Calculate maximum nesting depth."""
        max_depth = current_depth

        for child in ast.iter_child_nodes(node):
            # Count control flow structures
            if isinstance(
                child,
                (ast.If, ast.For, ast.While, ast.With, ast.Try, ast.FunctionDef, ast.ClassDef),
            ):
                child_depth = self._calculate_max_depth(child, current_depth + 1)
                max_depth = max(max_depth, child_depth)
            else:
                child_depth = self._calculate_max_depth(child, current_depth)
                max_depth = max(max_depth, child_depth)

        return max_depth


def analyze_code(source_code: str) -> str:
    """
    Main entry point for code analysis from JavaScript.

    Args:
        source_code: Python code to analyze

    Returns:
        JSON string with analysis results
    """
    analyzer = ASTAnalyzer(source_code)

    if not analyzer.parse():
        return json.dumps({"success": False, "errors": analyzer.errors})

    try:
        results = {
            "success": True,
            "structure": analyzer.get_structure(),
            "metrics": analyzer.get_metrics(),
            "ast": json.loads(analyzer.get_ast_json()),
        }
        return json.dumps(results)
    except Exception as e:
        return json.dumps({"success": False, "errors": [str(e)]})
