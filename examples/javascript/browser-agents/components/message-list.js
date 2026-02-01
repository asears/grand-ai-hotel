/**
 * Message List Web Component
 * 
 * A reusable component for displaying a list of messages.
 * Can be used independently or as part of a larger chat interface.
 * Implements virtual scrolling for large message lists (future enhancement).
 * 
 * Features:
 * - Auto-scroll to new messages
 * - Message grouping by sender
 * - Timestamp formatting
 * - Infinite scroll support (placeholder)
 * - Intersection Observer for visibility tracking
 */

class MessageList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._messages = [];
        this._observer = null;
    }

    connectedCallback() {
        this.render();
        this.setupIntersectionObserver();
    }

    disconnectedCallback() {
        if (this._observer) {
            this._observer.disconnect();
        }
    }

    /**
     * Setup Intersection Observer for lazy loading and visibility tracking
     */
    setupIntersectionObserver() {
        const options = {
            root: this.shadowRoot.querySelector('.messages'),
            rootMargin: '0px',
            threshold: 0.1
        };

        this._observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Mark message as read when it becomes visible
                    const messageId = entry.target.dataset.messageId;
                    this.dispatchEvent(new CustomEvent('message-visible', {
                        detail: { messageId },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
        }, options);
    }

    /**
     * Set messages to display
     */
    set messages(value) {
        this._messages = Array.isArray(value) ? value : [];
        this.render();
        this.observeMessages();
    }

    get messages() {
        return this._messages;
    }

    /**
     * Observe messages for intersection
     */
    observeMessages() {
        if (!this._observer) return;

        const messageElements = this.shadowRoot.querySelectorAll('.message');
        messageElements.forEach(el => this._observer.observe(el));
    }

    /**
     * Format timestamp
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than a minute
        if (diff < 60000) {
            return 'Just now';
        }

        // Less than an hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes}m ago`;
        }

        // Same day
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Different day
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Group consecutive messages from same sender
     */
    getMessageGroups() {
        const groups = [];
        let currentGroup = null;

        this._messages.forEach((message, index) => {
            if (!currentGroup || currentGroup.sender !== message.sender) {
                currentGroup = {
                    sender: message.sender,
                    messages: [message],
                    timestamp: message.timestamp
                };
                groups.push(currentGroup);
            } else {
                currentGroup.messages.push(message);
            }
        });

        return groups;
    }

    /**
     * Scroll to bottom
     */
    scrollToBottom() {
        const container = this.shadowRoot.querySelector('.messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    render() {
        const groups = this.getMessageGroups();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    height: 100%;
                }

                .messages {
                    height: 100%;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .message-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .message-group.user {
                    align-items: flex-end;
                }

                .message-group.agent {
                    align-items: flex-start;
                }

                .message {
                    max-width: 70%;
                    padding: 0.75rem 1rem;
                    border-radius: 1rem;
                    word-wrap: break-word;
                    animation: fadeIn 0.3s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .message.user {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-bottom-right-radius: 0.25rem;
                }

                .message.agent {
                    background: white;
                    border: 1px solid #e2e8f0;
                    color: #1e293b;
                    border-bottom-left-radius: 0.25rem;
                }

                .message-group .message:first-child {
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                }

                .timestamp {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    padding: 0 1rem;
                    margin-top: 0.25rem;
                }

                .empty-state {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #94a3b8;
                    font-style: italic;
                }

                /* Scrollbar styling */
                .messages::-webkit-scrollbar {
                    width: 8px;
                }

                .messages::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }

                .messages::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }

                .messages::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                @media (prefers-reduced-motion: reduce) {
                    .message {
                        animation: none;
                    }
                }
            </style>

            <div class="messages">
                ${groups.length === 0 ? `
                    <div class="empty-state">
                        No messages yet
                    </div>
                ` : groups.map(group => `
                    <div class="message-group ${group.sender}">
                        ${group.messages.map(msg => `
                            <div 
                                class="message ${msg.sender}" 
                                data-message-id="${msg.id}"
                            >
                                ${msg.content}
                            </div>
                        `).join('')}
                        <div class="timestamp">
                            ${this.formatTimestamp(group.messages[group.messages.length - 1].timestamp)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Auto-scroll to bottom after render
        requestAnimationFrame(() => this.scrollToBottom());
    }
}

customElements.define('message-list', MessageList);

export { MessageList };
