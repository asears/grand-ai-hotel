/**
 * Agent Chat Web Component
 * 
 * A modern web component for chat interaction with AI agents.
 * Uses Lit for reactive updates and shadow DOM for encapsulation.
 * Implements custom events for loose coupling with parent application.
 * 
 * Features:
 * - Real-time message updates
 * - Message history persistence
 * - Typing indicators
 * - Auto-scroll to latest message
 * - Keyboard shortcuts (Enter to send, Shift+Enter for newline)
 */

import { LitElement, html, css } from 'lit';
import { StorageService } from '../services/storage-service.js';

export class AgentChat extends LitElement {
    static properties = {
        currentAgent: { type: Object, attribute: 'current-agent', converter: (value) => {
            try {
                return value ? JSON.parse(value) : null;
            } catch {
                return null;
            }
        }},
        messages: { type: Array, state: true },
        isTyping: { type: Boolean, state: true },
        inputValue: { type: String, state: true }
    };

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            height: 600px;
            max-height: 70vh;
        }

        .chat-header {
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 0.5rem 0.5rem 0 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .agent-avatar {
            font-size: 2rem;
        }

        .agent-info h3 {
            margin: 0;
            font-size: 1.125rem;
        }

        .agent-info p {
            margin: 0;
            font-size: 0.875rem;
            opacity: 0.9;
        }

        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .message {
            max-width: 80%;
            padding: 0.75rem 1rem;
            border-radius: 1rem;
            word-wrap: break-word;
            animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
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
            align-self: flex-end;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 0.25rem;
        }

        .message.agent {
            align-self: flex-start;
            background: white;
            border: 1px solid #e2e8f0;
            border-bottom-left-radius: 0.25rem;
        }

        .message-meta {
            font-size: 0.75rem;
            opacity: 0.7;
            margin-top: 0.25rem;
        }

        .typing-indicator {
            display: flex;
            gap: 0.25rem;
            padding: 0.75rem 1rem;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 1rem;
            border-bottom-left-radius: 0.25rem;
            width: fit-content;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #94a3b8;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        .input-container {
            padding: 1rem;
            background: white;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 0.5rem;
        }

        textarea {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            font-family: inherit;
            font-size: 0.875rem;
            resize: none;
            min-height: 44px;
            max-height: 120px;
        }

        textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        button {
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.1s, opacity 0.2s;
        }

        button:hover:not(:disabled) {
            transform: translateY(-1px);
        }

        button:active:not(:disabled) {
            transform: translateY(0);
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #94a3b8;
            text-align: center;
            padding: 2rem;
        }

        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar {
            width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
            background: #f1f5f9;
        }

        .messages-container::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    `;

    constructor() {
        super();
        this.currentAgent = null;
        this.messages = [];
        this.isTyping = false;
        this.inputValue = '';
        this.storageService = new StorageService();
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadMessages();
        
        // Listen for agent responses
        document.addEventListener('agent-response', this.handleAgentResponse.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('agent-response', this.handleAgentResponse.bind(this));
    }

    updated(changedProperties) {
        if (changedProperties.has('currentAgent')) {
            this.loadMessages();
        }
        
        if (changedProperties.has('messages')) {
            this.scrollToBottom();
        }
    }

    /**
     * Load messages from storage for current agent
     */
    loadMessages() {
        if (!this.currentAgent) {
            this.messages = [];
            return;
        }

        const conversations = this.storageService.get('conversations') || {};
        this.messages = conversations[this.currentAgent.id] || [];
    }

    /**
     * Save messages to storage
     */
    saveMessages() {
        if (!this.currentAgent) return;

        const conversations = this.storageService.get('conversations') || {};
        conversations[this.currentAgent.id] = this.messages;
        this.storageService.set('conversations', conversations);
    }

    /**
     * Handle agent response from custom event
     */
    handleAgentResponse(event) {
        const { message, agentId } = event.detail;
        
        if (this.currentAgent && agentId === this.currentAgent.id) {
            this.isTyping = false;
            this.addMessage('agent', message);
        }
    }

    /**
     * Add message to conversation
     */
    addMessage(sender, content) {
        const message = {
            id: crypto.randomUUID(),
            sender,
            content,
            timestamp: new Date().toISOString()
        };

        this.messages = [...this.messages, message];
        this.saveMessages();
    }

    /**
     * Send message to agent
     */
    sendMessage() {
        if (!this.inputValue.trim() || !this.currentAgent) return;

        const message = this.inputValue.trim();
        this.addMessage('user', message);

        // Dispatch custom event for parent to handle
        const event = new CustomEvent('message-sent', {
            detail: {
                message,
                agentId: this.currentAgent.id
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);

        this.inputValue = '';
        this.isTyping = true;
    }

    /**
     * Handle keyboard events for better UX
     */
    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    /**
     * Handle input changes
     */
    handleInput(e) {
        this.inputValue = e.target.value;
    }

    /**
     * Scroll to bottom of messages
     */
    async scrollToBottom() {
        await this.updateComplete;
        const container = this.shadowRoot.querySelector('.messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    /**
     * Format timestamp for display
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    render() {
        if (!this.currentAgent) {
            return html`
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>No Agent Selected</h3>
                    <p>Select an agent from the sidebar to start chatting</p>
                </div>
            `;
        }

        return html`
            <div class="chat-header">
                <div class="agent-avatar">${this.currentAgent.avatar}</div>
                <div class="agent-info">
                    <h3>${this.currentAgent.name}</h3>
                    <p>${this.currentAgent.description}</p>
                </div>
            </div>

            <div class="messages-container">
                ${this.messages.length === 0 ? html`
                    <div class="empty-state">
                        <p>Start a conversation with ${this.currentAgent.name}</p>
                    </div>
                ` : ''}
                
                ${this.messages.map(msg => html`
                    <div class="message ${msg.sender}">
                        <div>${msg.content}</div>
                        <div class="message-meta">${this.formatTime(msg.timestamp)}</div>
                    </div>
                `)}
                
                ${this.isTyping ? html`
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                ` : ''}
            </div>

            <div class="input-container">
                <textarea
                    .value=${this.inputValue}
                    @input=${this.handleInput}
                    @keydown=${this.handleKeyDown}
                    placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                    rows="1"
                ></textarea>
                <button
                    @click=${this.sendMessage}
                    ?disabled=${!this.inputValue.trim()}
                >
                    Send
                </button>
            </div>
        `;
    }
}

customElements.define('agent-chat', AgentChat);
