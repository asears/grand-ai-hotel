WASM Playground: Security Vulnerabilities and Missing Files

See examples/wasm/IMPLEMENTATION_PLAN.md for full details.

## Critical Issues

- 5 moderate npm audit vulnerabilities in Vite/Vitest (esbuild SSRF)
- 3 missing Python modules (complexity_analyzer.py, quality_checker.py, test_hints.py)
- Missing configuration files (vite.config.js, tsconfig.json, .eslintrc.json)

## Action Required

1. Update package.json: Vite 5.0 → 6.1.7, Vitest 1.0 → 2.1.8
2. Create missing Python analyzer modules
3. Add configuration files for build/test tools

## NPM Audit Output

```
esbuild  <=0.24.2
Severity: moderate
esbuild enables any website to send any requests to the development server and read the response
https://github.com/advisories/GHSA-67mh-4wv8-2f99
fix available via npm audit fix --force
Will install vite@7.3.1, which is a breaking change

5 moderate severity vulnerabilities
```

## Missing Python Modules

1. `src/python/complexity_analyzer.py` - Cyclomatic complexity, nesting depth
2. `src/python/quality_checker.py` - PEP 8 compliance, docstrings
3. `src/python/test_hints.py` - Test suggestions, coverage gaps

## Missing Configuration

1. `vite.config.js` - Build configuration
2. `tsconfig.json` - TypeScript type checking
3. `.eslintrc.json` - Linting rules
4. `.prettierrc` - Code formatting
5. `playwright.config.js` - E2E test configuration

## Priority

HIGH - Security vulnerabilities should be addressed immediately

## Estimated Time

9-12 hours for complete implementation
