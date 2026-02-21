# TypeScript Examples - Just Commands
# Run with: just <command>

# Default recipe - show available commands
default:
    @just --list

# Install dependencies
install:
    npm install

# Install vite
install-vite:
    npm install -D vite

# Audit dependencies for vulnerabilities
audit:
    npm audit

# Audit and fix dependencies
audit-fix:
    npm audit fix

# Check for outdated dependencies
outdated:
    npm outdated

# Check for latest available versions (detailed)
check-latest:
    npx npm-check-updates

# Upgrade dependencies to latest versions (interactive)
upgrade:
    npx npm-check-updates -i

# Upgrade all dependencies to latest versions
upgrade-all:
    npx npm-check-updates -u
    npm install

# Type check
type-check:
    npm run type-check

# Lint
lint:
    npm run lint

# Lint and fix
lint-fix:
    npm run lint:fix

# Format code
format:
    npm run format

# Run tests
test:
    npm run test

# Run tests with UI
test-ui:
    npm run test:ui

# Run tests with coverage
test-coverage:
    npm run test:coverage

# Build the project
build:
    npm run build

# Run development server
dev:
    npm run dev

# Full check: lint, type-check, test
check: lint type-check test

# Clean and reinstall dependencies
clean:
    rm -rf node_modules package-lock.json
    npm install

# Update all and verify
update-verify: upgrade-all check build
    @echo "✓ Dependencies updated and verified"
