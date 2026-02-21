# JavaScript Examples - Just Commands
# Run with: just <command>

# Default recipe - show available commands
default:
    @just --list

# Install dependencies in all subprojects
install:
    @echo "Installing dependencies in browser-agents..."
    cd browser-agents && npm install
    @echo "Installing dependencies in service-worker..."
    cd service-worker && npm install

# Install vite in all subprojects
install-vite:
    @echo "Installing vite in browser-agents..."
    cd browser-agents && npm install -D vite
    @echo "Installing vite in service-worker..."
    cd service-worker && npm install -D vite

# Audit dependencies for vulnerabilities in all subprojects
audit:
    @echo "Auditing browser-agents..."
    cd browser-agents && npm audit
    @echo "Auditing service-worker..."
    cd service-worker && npm audit

# Audit and fix dependencies in all subprojects
audit-fix:
    @echo "Fixing browser-agents..."
    cd browser-agents && npm audit fix
    @echo "Fixing service-worker..."
    cd service-worker && npm audit fix

# Check for outdated dependencies
outdated:
    @echo "Checking browser-agents..."
    cd browser-agents && npm outdated
    @echo "Checking service-worker..."
    cd service-worker && npm outdated

# Check for latest available versions (detailed)
check-latest:
    @echo "Checking browser-agents..."
    cd browser-agents && npx npm-check-updates
    @echo "Checking service-worker..."
    cd service-worker && npx npm-check-updates

# Upgrade dependencies to latest versions (interactive)
upgrade:
    @echo "Upgrading browser-agents..."
    cd browser-agents && npx npm-check-updates -i
    @echo "Upgrading service-worker..."
    cd service-worker && npx npm-check-updates -i

# Upgrade all dependencies to latest versions
upgrade-all:
    @echo "Upgrading browser-agents..."
    cd browser-agents && npx npm-check-updates -u && npm install
    @echo "Upgrading service-worker..."
    cd service-worker && npx npm-check-updates -u && npm install

# Run tests in browser-agents
test-browser:
    cd browser-agents && npm run test

# Run tests in service-worker
test-service-worker:
    cd service-worker && npm run test

# Run all tests
test:
    @echo "Testing browser-agents..."
    cd browser-agents && npm run test
    @echo "Testing service-worker..."
    cd service-worker && npm run test

# Run tests with UI
test-ui-browser:
    cd browser-agents && npm run test:ui

test-ui-service-worker:
    cd service-worker && npm run test:ui

# Run tests with coverage
test-coverage:
    @echo "Coverage for browser-agents..."
    cd browser-agents && npm run test:coverage
    @echo "Coverage for service-worker..."
    cd service-worker && npm run test:coverage

# Build browser-agents
build-browser:
    cd browser-agents && npm run build

# Build service-worker
build-service-worker:
    cd service-worker && npm run build

# Build all projects
build:
    @echo "Building browser-agents..."
    cd browser-agents && npm run build
    @echo "Building service-worker..."
    cd service-worker && npm run build

# Run dev server for browser-agents
dev-browser:
    cd browser-agents && npm run dev

# Run dev server for service-worker
dev-service-worker:
    cd service-worker && npm run dev

# Clean and reinstall dependencies
clean:
    @echo "Cleaning browser-agents..."
    cd browser-agents && rm -rf node_modules package-lock.json && npm install
    @echo "Cleaning service-worker..."
    cd service-worker && rm -rf node_modules package-lock.json && npm install

# Update all and verify with tests
update-verify: upgrade-all test
    @echo "✓ Dependencies updated and verified"
