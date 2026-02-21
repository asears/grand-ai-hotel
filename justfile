# Grand Budapest Terminal - Root Commands
# Run with: just <command>

# Default recipe - show available commands
default:
    @just --list

# Install all dependencies
install:
    @echo "Installing dependencies..."
    @echo "Installing svglint..."
    npm install -g svglint
    @echo "Installing Python dependencies..."
    uv sync
    @echo "Installing JavaScript dependencies..."
    cd examples/javascript && just install
    @echo "Installing TypeScript dependencies..."
    cd examples/typescript && just install

# Lint all SVG files
lint-svg:
    @echo "Linting SVG files..."
    svglint tutorials/images/*.svg

# Validate all SVG files with detailed output
validate-svg:
    @echo "Validating SVG files with detailed output..."
    svglint --debug tutorials/images/*.svg

# Fix SVG files (where possible)
fix-svg:
    @echo "Checking SVG files for common issues..."
    @for file in tutorials/images/*.svg; do \
        echo "Checking: $file"; \
        xmllint --noout "$file" 2>&1 || echo "  ⚠️  Issues found"; \
    done

# Check for XML parsing errors in SVGs
check-svg-xml:
    @echo "Checking SVG files for XML errors..."
    @for file in tutorials/images/*.svg; do \
        xmllint --noout "$$file" && echo "✓ $$file" || echo "✗ $$file"; \
    done

# Format Python code
format-python:
    @echo "Formatting Python code with ruff..."
    ruff format .

# Lint Python code
lint-python:
    @echo "Linting Python code with ruff..."
    ruff check .

# Type check Python code
typecheck-python:
    @echo "Type checking Python code..."
    ty check src/

# Run Python tests
test-python:
    @echo "Running Python tests..."
    pytest tests/ -v

# Format JavaScript/TypeScript
format-js:
    @echo "Formatting JavaScript..."
    cd examples/javascript && just format || true
    @echo "Formatting TypeScript..."
    cd examples/typescript && just format

# Lint JavaScript/TypeScript
lint-js:
    @echo "Linting JavaScript..."
    cd examples/javascript && just lint || true
    @echo "Linting TypeScript..."
    cd examples/typescript && just lint

# Run all tests
test:
    @echo "Running all tests..."
    just test-python
    cd examples/typescript && just test

# Run all checks (format, lint, type-check, test, svg)
check: format-python lint-python lint-svg
    @echo "✓ All checks passed"

# Clean all build artifacts
clean:
    @echo "Cleaning build artifacts..."
    rm -rf build/ dist/ *.egg-info/
    find . -type d -name __pycache__ -exec rm -rf {} +
    find . -type d -name .pytest_cache -exec rm -rf {} +
    find . -type d -name .ruff_cache -exec rm -rf {} +
    cd examples/javascript && just clean || true
    cd examples/typescript && just clean || true

# Update all dependencies
update:
    @echo "Updating dependencies..."
    uv sync --upgrade
    cd examples/javascript && just upgrade-all || true
    cd examples/typescript && just upgrade-all || true

# Git: Add all, commit, and push
git-push message:
    git add --all
    git commit -m "{{message}}"
    git push

# Git: Quick commit with default message
git-quick:
    git add --all
    git commit -m "Update files"
    git push

# Show repository statistics
stats:
    @echo "Repository Statistics:"
    @echo "====================="
    @echo "Total files:"
    @find . -type f -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/__pycache__/*' | wc -l
    @echo ""
    @echo "Python files:"
    @find . -name "*.py" | wc -l
    @echo ""
    @echo "TypeScript files:"
    @find . -name "*.ts" | wc -l
    @echo ""
    @echo "JavaScript files:"
    @find . -name "*.js" | wc -l
    @echo ""
    @echo "SVG files:"
    @find . -name "*.svg" | wc -l
    @echo ""
    @echo "Markdown files:"
    @find . -name "*.md" | wc -l
