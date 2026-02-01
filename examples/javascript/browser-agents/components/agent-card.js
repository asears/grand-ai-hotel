/**
 * Agent Card Web Component
 * 
 * Displays individual agent information in a card format.
 * Supports click events to select the agent for chat.
 * Uses vanilla Web Components API (no framework) for maximum compatibility.
 * 
 * Features:
 * - Status indicators (online, offline, idle)
 * - Hover effects
 * - Click to select
 * - Accessible keyboard navigation
 */

class AgentCard extends HTMLElement {
    static get observedAttributes() {
        return ['agent-id', 'agent-name', 'agent-description', 'agent-status', 'agent-avatar'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._agentId = '';
        this._agentName = '';
        this._agentDescription = '';
        this._agentStatus = 'offline';
        this._agentAvatar = '🤖';
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case 'agent-id':
                this._agentId = newValue;
                break;
            case 'agent-name':
                this._agentName = newValue;
                break;
            case 'agent-description':
                this._agentDescription = newValue;
                break;
            case 'agent-status':
                this._agentStatus = newValue;
                break;
            case 'agent-avatar':
                this._agentAvatar = newValue;
                break;
        }

        this.render();
    }

    setupEventListeners() {
        const card = this.shadowRoot.querySelector('.card');
        if (!card) return;

        card.addEventListener('click', () => this.handleSelect());
        
        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleSelect();
            }
        });
    }

    handleSelect() {
        // Dispatch custom event for parent to handle
        const event = new CustomEvent('agent-selected', {
            detail: {
                agentId: this._agentId,
                agentName: this._agentName
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);

        // Visual feedback
        const card = this.shadowRoot.querySelector('.card');
        card?.classList.add('selected');
        
        // Remove selection from siblings
        this.parentElement?.querySelectorAll('agent-card').forEach(el => {
            if (el !== this) {
                el.shadowRoot?.querySelector('.card')?.classList.remove('selected');
            }
        });
    }

    getStatusColor(status) {
        const colors = {
            online: '#10b981',
            offline: '#94a3b8',
            idle: '#f59e0b',
            busy: '#ef4444'
        };
        return colors[status] || colors.offline;
    }

    getStatusLabel(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    render() {
        const statusColor = this.getStatusColor(this._agentStatus);
        const statusLabel = this.getStatusLabel(this._agentStatus);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 0.75rem;
                }

                .card {
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                }

                .card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: ${statusColor};
                    transform: scaleY(0);
                    transition: transform 0.2s ease;
                }

                .card:hover {
                    border-color: #667eea;
                    transform: translateX(4px);
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                }

                .card:hover::before {
                    transform: scaleY(1);
                }

                .card.selected {
                    border-color: #667eea;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                }

                .card.selected::before {
                    transform: scaleY(1);
                    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
                }

                .card:focus {
                    outline: 2px solid #667eea;
                    outline-offset: 2px;
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }

                .avatar {
                    font-size: 2rem;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    border-radius: 0.5rem;
                }

                .info {
                    flex: 1;
                    min-width: 0;
                }

                .name {
                    font-weight: 600;
                    font-size: 1rem;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .status {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${statusColor};
                }

                .status-dot.online {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .description {
                    font-size: 0.875rem;
                    color: #64748b;
                    line-height: 1.4;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                @media (prefers-reduced-motion: reduce) {
                    .card,
                    .card::before,
                    .status-dot {
                        transition: none;
                        animation: none;
                    }
                }
            </style>

            <div class="card" tabindex="0" role="button" aria-label="Select ${this._agentName}">
                <div class="card-header">
                    <div class="avatar">${this._agentAvatar}</div>
                    <div class="info">
                        <h3 class="name">${this._agentName}</h3>
                        <div class="status">
                            <span class="status-dot ${this._agentStatus}"></span>
                            <span>${statusLabel}</span>
                        </div>
                    </div>
                </div>
                <p class="description">${this._agentDescription}</p>
            </div>
        `;

        // Re-setup event listeners after re-render
        if (this.isConnected) {
            this.setupEventListeners();
        }
    }
}

customElements.define('agent-card', AgentCard);

export { AgentCard };
