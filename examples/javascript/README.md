# Modern Vanilla JavaScript Examples

Production-ready JavaScript examples demonstrating modern web platform APIs, best practices, and progressive enhancement patterns.

## 📂 Examples

### 1. [Browser Agents](./browser-agents/)

Browser-based agent interaction with Web Components and state management.

**Technologies:**
- Web Components (Lit + Vanilla)
- Shadow DOM
- LocalStorage with versioning
- Custom Events
- Fetch API

**Features:**
- 🎨 Modern Web Components with encapsulation
- 💾 Persistent state across sessions
- 🔄 Event-driven architecture
- 📱 Responsive design
- ♿ Accessible (WCAG 2.1)
- 🧪 Vitest + happy-dom testing

**Quick Start:**
```bash
cd browser-agents
npm install
npm run dev
```

**Use Cases:**
- Chat interfaces
- Agent management systems
- Real-time collaboration tools
- Component-based applications

---

### 2. [Service Worker PWA](./service-worker/)

Progressive Web App with advanced caching strategies and offline support.

**Technologies:**
- Service Worker API
- Workbox integration
- Cache API
- Push API
- Background Sync

**Features:**
- 🔌 Full offline functionality
- 🚀 Multiple caching strategies
- 🔄 Background synchronization
- 🔔 Push notifications
- 💾 Intelligent cache management
- 📊 Performance monitoring

**Quick Start:**
```bash
cd service-worker
npm install
npm run dev
```

**Use Cases:**
- Offline-first applications
- Mobile-responsive web apps
- News/content platforms
- E-commerce sites
- Social media apps

---

## 🎯 Common Patterns

### Modern ES2023+ Features

All examples use cutting-edge JavaScript:

```javascript
// Private fields
class MyClass {
    #privateField = 'secret';
    
    getPrivate() {
        return this.#privateField;
    }
}

// Optional chaining
const value = obj?.prop?.nested?.value;

// Nullish coalescing
const result = input ?? defaultValue;

// Top-level await
const data = await fetch('/api/data').then(r => r.json());

// Numeric separators
const million = 1_000_000;

// Logical assignment
obj ??= { default: true };
```

### Web Components Pattern

```javascript
// Vanilla Web Component
class MyElement extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>/* Scoped styles */</style>
            <div>Content</div>
        `;
    }
}

customElements.define('my-element', MyElement);

// Lit Web Component
import { LitElement, html, css } from 'lit';

class MyLitElement extends LitElement {
    static styles = css`/* Scoped styles */`;
    static properties = {
        count: { type: Number }
    };
    
    render() {
        return html`<div>Count: ${this.count}</div>`;
    }
}

customElements.define('my-lit-element', MyLitElement);
```

### Event-Driven Communication

```javascript
// Dispatch custom event
const event = new CustomEvent('data-changed', {
    detail: { value: 'new data' },
    bubbles: true,
    composed: true  // Cross shadow DOM boundary
});
element.dispatchEvent(event);

// Listen for custom event
element.addEventListener('data-changed', (event) => {
    console.log('Data:', event.detail.value);
});
```

### Storage Abstraction

```javascript
class StorageService {
    #prefix = 'app';
    
    get(key, defaultValue = null) {
        const item = localStorage.getItem(`${this.#prefix}:${key}`);
        return item ? JSON.parse(item) : defaultValue;
    }
    
    set(key, value) {
        localStorage.setItem(
            `${this.#prefix}:${key}`,
            JSON.stringify(value)
        );
    }
    
    // Namespaced storage
    namespace(ns) {
        return new StorageService(`${this.#prefix}:${ns}`);
    }
}
```

### Service Worker Strategies

```javascript
// Network-First
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open('v1');
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        return await caches.match(request);
    }
}

// Cache-First
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    const response = await fetch(request);
    const cache = await caches.open('v1');
    cache.put(request, response.clone());
    return response;
}

// Stale-While-Revalidate
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);
    
    const fetchPromise = fetch(request).then(response => {
        const cache = await caches.open('v1');
        cache.put(request, response.clone());
        return response;
    });
    
    return cached || await fetchPromise;
}
```

## 🧪 Testing

All examples include comprehensive test suites:

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

**Testing Stack:**
- **Vitest**: Fast unit test framework
- **happy-dom**: Lightweight DOM implementation
- **service-worker-mock**: Service Worker testing utilities

## 🎨 Code Quality

### Standards Applied

✅ **Modern JavaScript (ES2023+)**
- Private class fields
- Optional chaining
- Nullish coalescing
- Top-level await
- Numeric separators

✅ **Type Safety**
- JSDoc type annotations
- Type inference where possible
- Runtime validation

✅ **Code Style**
- Consistent formatting
- Comprehensive comments
- Semantic naming
- Self-documenting code

✅ **Performance**
- Efficient DOM manipulation
- Lazy loading
- Event delegation
- Memory leak prevention

✅ **Accessibility**
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support

## 📖 Documentation

Each example includes:

1. **README.md**: Full documentation with examples
2. **Inline Comments**: JSDoc and explanatory comments
3. **Type Annotations**: JSDoc type hints
4. **Usage Examples**: Copy-paste ready code snippets

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for ES modules support)
- Modern browser (Chrome 90+, Firefox 88+, Safari 14.1+)
- Basic understanding of JavaScript

### Installation

```bash
# Clone repository
git clone <repo-url>

# Navigate to example
cd examples/javascript/browser-agents

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes**: Edit source files
3. **Hot reload**: Browser auto-refreshes
4. **Run tests**: `npm test`
5. **Build**: `npm run build`

## 🔧 Configuration

### Vite Configuration

All examples use Vite for development:

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        target: 'es2020',
        outDir: 'dist'
    }
});
```

### Vitest Configuration

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            reporter: ['text', 'html']
        }
    }
});
```

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Components | 90+ | 88+ | 14.1+ | 90+ |
| Service Worker | 90+ | 88+ | 14.1+ | 90+ |
| ES2023 | 90+ | 88+ | 14.1+ | 90+ |
| Private Fields | 90+ | 90+ | 14.1+ | 90+ |

## 📝 Best Practices

### 1. Progressive Enhancement

```javascript
// Check for feature support
if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('/sw.js');
}

// Provide fallback
const storage = 'localStorage' in window 
    ? localStorage 
    : new InMemoryStorage();
```

### 2. Error Handling

```javascript
try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
} catch (error) {
    console.error('Fetch failed:', error);
    // Provide fallback or cached data
    return getCachedData();
}
```

### 3. Performance

```javascript
// Lazy load components
const component = await import('./components/heavy-component.js');

// Use Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadContent(entry.target);
        }
    });
});

// Debounce expensive operations
const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};
```

### 4. Security

```javascript
// Sanitize user input
function sanitize(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Use Content Security Policy
// In HTML: <meta http-equiv="Content-Security-Policy" content="...">

// Validate data
function validateData(data) {
    if (typeof data !== 'object') {
        throw new Error('Invalid data type');
    }
    // Additional validation
}
```

## 🤝 Contributing

Contributions welcome! Please follow:

1. Modern JavaScript (ES2023+)
2. Comprehensive documentation
3. Unit tests for new features
4. Accessibility standards
5. Performance optimization

## 📚 Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Tools
- [Lit](https://lit.dev/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Workbox](https://developers.google.com/web/tools/workbox)

### Standards
- [Web Platform APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [JavaScript ES2023](https://tc39.es/ecma262/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 License

MIT

---

**Built with modern JavaScript and web platform APIs.**
