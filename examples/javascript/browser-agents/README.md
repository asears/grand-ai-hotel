# Browser Agents Example

Modern vanilla JavaScript example demonstrating browser-based agent interaction with Web Components, state management, and progressive enhancement.

## Features

### 🎨 Web Components
- **Custom Elements**: Built with Lit and vanilla Web Components API
- **Shadow DOM**: Encapsulated styles and markup
- **Reactive Updates**: Efficient re-rendering with Lit
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation

### 💾 State Management
- **LocalStorage Persistence**: Conversations and agent data persist across sessions
- **Cross-tab Synchronization**: Storage events keep multiple tabs in sync
- **Data Versioning**: Automatic migration support for schema changes
- **Export/Import**: Full data backup and restore functionality

### 🔄 Communication Patterns
- **Custom Events**: Loose coupling between components
- **Event Bubbling**: Component-to-parent communication
- **Service Layer**: Centralized business logic
- **Fetch API**: Modern promise-based HTTP requests (ready for API integration)

### 🧪 Testing
- **Vitest**: Fast unit tests with ES modules support
- **happy-dom**: Lightweight DOM implementation
- **Component Testing**: Full lifecycle and interaction tests
- **Service Testing**: Business logic validation

## Architecture

```
browser-agents/
├── components/          # Web Components
│   ├── agent-chat.js   # Chat interface (Lit)
│   ├── agent-card.js   # Agent selection card (vanilla)
│   └── message-list.js # Message display (vanilla)
├── services/           # Business Logic
│   ├── agent-service.js    # Agent management
│   └── storage-service.js  # Storage abstraction
├── tests/              # Test Suite
│   └── components.test.js
├── index.html          # Main application
├── package.json
└── README.md
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Build

```bash
npm run build
```

Production files will be in `dist/`.

## Usage Examples

### Creating a Custom Agent

```javascript
import { AgentService } from './services/agent-service.js';

const agentService = new AgentService();

// Add custom agent
const agentId = agentService.addAgent({
    name: 'Custom Agent',
    description: 'Specialized for custom tasks',
    status: 'online',
    avatar: '🎯',
    capabilities: ['task1', 'task2']
});
```

### Sending Messages

```javascript
// Send message and get response
const response = await agentService.sendMessage(agentId, 'Hello!');
console.log(response);
```

### Listening to Events

```javascript
// Listen for agent selection
document.addEventListener('agent-selected', (event) => {
    const { agentId, agentName } = event.detail;
    console.log(`Selected: ${agentName}`);
});

// Listen for messages
document.addEventListener('message-sent', async (event) => {
    const { message, agentId } = event.detail;
    // Handle message
});
```

### Using Storage Service

```javascript
import { StorageService } from './services/storage-service.js';

const storage = new StorageService();

// Store data
storage.set('settings', { theme: 'dark', notifications: true });

// Retrieve data
const settings = storage.get('settings', { theme: 'light' });

// Create namespaced storage
const userStorage = storage.namespace('user');
userStorage.set('preferences', { language: 'en' });
```

### Custom Component Integration

```javascript
// Create agent chat component
const chat = document.createElement('agent-chat');
chat.setAttribute('current-agent', JSON.stringify(agent));
document.body.appendChild(chat);

// Listen for messages
chat.addEventListener('message-sent', (event) => {
    console.log('Message sent:', event.detail);
});
```

## Web Components API

### `<agent-chat>`

Chat interface component with message history and input.

**Properties:**
- `current-agent` (Object): Currently selected agent

**Events:**
- `message-sent`: Fired when user sends a message
  - `detail.message` (string): Message content
  - `detail.agentId` (string): Target agent ID

**Methods:**
- None (controlled via attributes)

### `<agent-card>`

Agent selection card component.

**Attributes:**
- `agent-id` (string): Agent identifier
- `agent-name` (string): Display name
- `agent-description` (string): Description text
- `agent-status` (string): Status (online, offline, idle, busy)
- `agent-avatar` (string): Emoji avatar

**Events:**
- `agent-selected`: Fired when card is clicked
  - `detail.agentId` (string): Selected agent ID
  - `detail.agentName` (string): Selected agent name

### `<message-list>`

Message display component with auto-scroll and grouping.

**Properties:**
- `messages` (Array): Array of message objects

**Events:**
- `message-visible`: Fired when message becomes visible
  - `detail.messageId` (string): Visible message ID

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14.1+

Uses modern ES2023 features:
- Private class fields (`#property`)
- `crypto.randomUUID()`
- Top-level `await`
- Optional chaining (`?.`)
- Nullish coalescing (`??`)

## Progressive Enhancement

The application works without JavaScript with graceful degradation:
- Content remains accessible
- Forms submit via standard HTTP
- Semantic HTML structure maintained

## Performance Optimizations

1. **Lazy Loading**: Components loaded on-demand
2. **Event Delegation**: Efficient event handling
3. **Shadow DOM**: Style scoping without overhead
4. **Virtual Scrolling**: Planned for large message lists
5. **Intersection Observer**: Visibility tracking

## Security Considerations

- XSS protection via sanitized input
- No `eval()` or `Function()` constructor usage
- CSP-compatible (no inline scripts)
- LocalStorage encryption ready
- Secure message handling

## Customization

### Theming

Edit CSS custom properties in `index.html`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    --success-color: #10b981;
    /* ... */
}
```

### Adding Agent Types

Extend `agent-service.js`:

```javascript
async #generateResponse(agent, message) {
    const responses = {
        // Add your custom agent type
        myCustomAgent: [
            'Custom response 1',
            'Custom response 2'
        ]
    };
    // ...
}
```

## Troubleshooting

### Storage Not Persisting

Check browser storage settings and quota:

```javascript
const remaining = await storage.getRemainingQuota();
console.log(`Remaining: ${remaining} bytes`);
```

### Components Not Rendering

Ensure modules are loaded:

```html
<script type="module" src="./components/agent-chat.js"></script>
```

### Events Not Firing

Check event bubbling and composed flags:

```javascript
new CustomEvent('event-name', {
    bubbles: true,
    composed: true  // Required for Shadow DOM
});
```

## Contributing

Follow modern JavaScript best practices:
- ES2023+ syntax
- JSDoc comments
- Unit tests for new features
- Semantic HTML
- Accessible components

## License

MIT

## Resources

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Lit](https://lit.dev/)
- [Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Vitest](https://vitest.dev/)
