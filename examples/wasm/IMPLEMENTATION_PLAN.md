# WASM Playground Implementation Plan - Issues & Improvements

**Date:** January 29, 2026  
**Status:** In Progress  
**Owner:** M. Gustave & Dmitri

---

## 🔍 Current Issues

### 1. NPM Audit Vulnerabilities

**Severity:** Moderate (5 vulnerabilities)

**Affected Packages:**
- `esbuild` ≤0.24.2 - Development server SSRF vulnerability
  - CVE: GHSA-67mh-4wv8-2f99
  - Impact: Any website can send requests to dev server and read responses
  - Affects: `vite`, `vite-node`, `vitest`, `@vitest/ui`

**Initial Package Versions:**
```json
"vite": "^5.0.0",
"vitest": "^1.0.0",
"@vitest/ui": "^1.0.0"
```

**Recommended Versions:**
```json
"vite": "^6.1.7",
"vitest": "^2.1.8",
"@vitest/ui": "^2.1.8"
```

**Fix Strategy:**
1. Update `package.json` to use Vite 6.x and Vitest 2.x
2. Test for breaking changes (Vite 6 has new features)
3. Run `npm audit` to verify fixes
4. Update CI/CD workflows if needed

**Breaking Changes to Test:**
- Vite 6.x may have different config options
- Vitest 2.x API changes for test configuration
- Monaco Editor compatibility with new Vite

---

### 2. Missing Python Modules

**Status:** Not Yet Implemented

Three Python analyzer modules referenced in JavaScript but not created:

1. **`complexity_analyzer.py`** (Serge X. - Performance Analyst)
   - Cyclomatic complexity calculation
   - Time complexity estimation
   - Nesting depth analysis
   - Function length metrics

2. **`quality_checker.py`** (M. Gustave - Quality Auditor)
   - PEP 8 compliance checking
   - Docstring validation
   - Variable naming conventions
   - Function length limits
   - Code organization patterns

3. **`test_hints.py`** (Agatha - Testing Specialist)
   - Identify untested functions
   - Suggest edge cases
   - Test coverage gap analysis
   - Example test case generation

**Impact:**
- JavaScript tries to load these modules → 404 errors
- Agent analysis incomplete
- User experience degraded

**Priority:** HIGH

---

### 3. Vite Configuration Missing

**Status:** Not Created

`vite.config.js` referenced in tutorial but not created.

**Required Configuration:**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/grand-ai-hotel/wasm-playground/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 8080,
    open: true,
  },
  optimizeDeps: {
    exclude: ['pyodide'],
  },
});
```

**Purpose:**
- Set correct base URL for GitHub Pages
- Configure dev server port
- Exclude Pyodide from optimization (already WASM)
- Enable source maps for debugging

**Priority:** HIGH

---

### 4. Monaco Editor Theme Customization

**Status:** Referenced but Not Created

`src/styles/monaco.css` mentioned in architecture but not implemented.

**Required Styling:**
- Custom Wes Anderson color scheme for Monaco
- Burgundy/pink syntax highlighting
- Match main.css color palette
- Override Monaco's default dark theme

**Priority:** MEDIUM

---

### 5. TypeScript Configuration

**Status:** Missing

`package.json` includes TypeScript but no `tsconfig.json` exists.

**Purpose:**
- Type checking for JavaScript (JSDoc comments)
- Better IDE support
- Catch type errors before runtime

**Required Config:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM"],
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Priority:** MEDIUM

---

### 6. ESLint Configuration

**Status:** Missing

`package.json` includes ESLint but no `.eslintrc.json` exists.

**Purpose:**
- Code quality enforcement
- Consistent style
- Catch common errors

**Required Config:**
```json
{
  "env": {
    "browser": true,
    "es2022": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-eval": "error",
    "no-implied-eval": "error"
  }
}
```

**Priority:** MEDIUM

---

### 7. Prettier Configuration

**Status:** Missing

`package.json` includes Prettier but no `.prettierrc` exists.

**Required Config:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

**Priority:** LOW

---

### 8. Playwright Configuration

**Status:** Missing

E2E tests referenced but no `playwright.config.js` exists.

**Required for:**
- E2E test execution
- Browser automation
- CI/CD integration

**Priority:** MEDIUM

---

### 9. Test Files

**Status:** Not Created

No test files exist for JavaScript or Python code.

**Needed:**
- `tests/js/*.spec.js` - Vitest unit tests
- `tests/python/test_*.py` - Pytest unit tests
- `tests/e2e/*.spec.js` - Playwright E2E tests

**Priority:** MEDIUM

---

## 📋 Implementation Checklist

### Phase 1: Critical Fixes (Immediate)
- [ ] Update `package.json` with Vite 6.x and Vitest 2.x
- [ ] Run `npm install` to update dependencies
- [ ] Run `npm audit` to verify vulnerability fixes
- [ ] Create `vite.config.js` with correct settings
- [ ] Create missing Python modules:
  - [ ] `complexity_analyzer.py`
  - [ ] `quality_checker.py`
  - [ ] `test_hints.py`

### Phase 2: Configuration (High Priority)
- [ ] Create `tsconfig.json`
- [ ] Create `.eslintrc.json`
- [ ] Create `.prettierrc`
- [ ] Create `playwright.config.js`
- [ ] Add `.prettierignore` and `.eslintignore`

### Phase 3: Styling (Medium Priority)
- [ ] Create `src/styles/monaco.css`
- [ ] Implement custom Monaco theme
- [ ] Test color scheme consistency

### Phase 4: Testing (Medium Priority)
- [ ] Create Python unit tests
- [ ] Create JavaScript unit tests
- [ ] Create E2E tests
- [ ] Configure test coverage reporting
- [ ] Add test documentation

### Phase 5: Documentation (Low Priority)
- [ ] Update tutorial with configuration steps
- [ ] Add troubleshooting section
- [ ] Document npm scripts
- [ ] Create contributing guide
- [ ] Add architecture diagrams

---

## 🔧 NPM Scripts Usage

After configuration is complete:

```bash
# Development
npm run dev              # Start dev server (localhost:8080)
npm run build            # Build production bundle
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # Run TypeScript checks

# Deployment
npm run deploy           # Build and deploy to GitHub Pages
```

---

## 🚨 Known Risks

1. **Vite 6 Breaking Changes**: May require code updates
2. **Vitest 2 API Changes**: Test configuration may need updates
3. **Monaco Editor Size**: Large bundle size (~8MB with Pyodide)
4. **Browser Compatibility**: WASM requires modern browsers
5. **Pyodide Load Time**: Initial load is 8MB (cached after)

---

## 📊 Success Metrics

- [ ] `npm audit` shows 0 vulnerabilities
- [ ] All tests pass (unit + E2E)
- [ ] Bundle size < 500KB (excluding Pyodide)
- [ ] Dev server starts without errors
- [ ] Production build succeeds
- [ ] GitHub Pages deployment works
- [ ] All 5 agents return analysis results

---

## 🔗 Related Files

- `package.json` - Dependency configuration
- `tutorials/wasm-python-playground.md` - Tutorial documentation
- `examples/wasm/README.md` - Project documentation
- `.github/workflows/deploy-wasm-playground.yml` - Deployment workflow
- `.github/workflows/test-wasm-playground.yml` - Test workflow

---

**Next Steps:**
1. Create GitHub issue from this plan
2. Update package.json dependencies
3. Create missing Python modules
4. Create configuration files
5. Run tests and validate

**Estimated Time:**
- Phase 1: 2-3 hours
- Phase 2: 1-2 hours
- Phase 3: 1 hour
- Phase 4: 3-4 hours
- Phase 5: 2 hours

**Total:** 9-12 hours for complete implementation

---

**Author:** M. Gustave (Architect), Dmitri (Security), Henckels (CI/CD)  
**Last Updated:** January 29, 2026  
**Status:** Ready for GitHub Issue Creation
