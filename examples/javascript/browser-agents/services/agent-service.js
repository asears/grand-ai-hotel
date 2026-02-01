/**
 * Agent Service
 * 
 * Manages agent lifecycle, state, and communication.
 * Implements the service layer for agent operations.
 * Uses modern JavaScript patterns including Map for efficient lookups.
 * 
 * Features:
 * - Agent registration and management
 * - Message routing and handling
 * - State persistence coordination
 * - Event-driven architecture support
 * - Simulated AI responses (can be replaced with real API)
 */

export class AgentService {
    #agents = new Map();
    #eventTarget = new EventTarget();

    constructor() {
        // Initialize with empty agent registry
        this.#agents = new Map();
    }

    /**
     * Add a new agent to the registry
     * @param {Object} agentConfig - Agent configuration
     * @returns {string} Agent ID
     */
    addAgent(agentConfig) {
        const agent = {
            id: agentConfig.id || crypto.randomUUID(),
            name: agentConfig.name || 'Unnamed Agent',
            description: agentConfig.description || '',
            status: agentConfig.status || 'offline',
            avatar: agentConfig.avatar || '🤖',
            capabilities: agentConfig.capabilities || [],
            metadata: agentConfig.metadata || {},
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };

        this.#agents.set(agent.id, agent);
        this.#dispatchEvent('agent-added', { agent });
        
        return agent.id;
    }

    /**
     * Remove an agent from the registry
     * @param {string} agentId - Agent ID to remove
     * @returns {boolean} Success status
     */
    removeAgent(agentId) {
        const agent = this.#agents.get(agentId);
        if (!agent) return false;

        this.#agents.delete(agentId);
        this.#dispatchEvent('agent-removed', { agentId });
        
        return true;
    }

    /**
     * Get agent by ID
     * @param {string} agentId - Agent ID
     * @returns {Object|null} Agent object or null
     */
    getAgent(agentId) {
        return this.#agents.get(agentId) || null;
    }

    /**
     * Get all agents
     * @returns {Array} Array of agent objects
     */
    getAgents() {
        return Array.from(this.#agents.values());
    }

    /**
     * Update agent status
     * @param {string} agentId - Agent ID
     * @param {string} status - New status (online, offline, idle, busy)
     */
    updateAgentStatus(agentId, status) {
        const agent = this.#agents.get(agentId);
        if (!agent) return;

        agent.status = status;
        agent.lastActive = new Date().toISOString();
        this.#agents.set(agentId, agent);
        
        this.#dispatchEvent('agent-status-changed', { agentId, status });
    }

    /**
     * Send message to agent and get response
     * @param {string} agentId - Target agent ID
     * @param {string} message - Message content
     * @returns {Promise<string>} Agent response
     */
    async sendMessage(agentId, message) {
        const agent = this.#agents.get(agentId);
        if (!agent) {
            throw new Error(`Agent ${agentId} not found`);
        }

        // Update last active timestamp
        agent.lastActive = new Date().toISOString();
        this.#agents.set(agentId, agent);

        // Dispatch message sent event
        this.#dispatchEvent('message-sending', { agentId, message });

        try {
            // Simulate AI response (replace with actual API call)
            const response = await this.#generateResponse(agent, message);
            
            this.#dispatchEvent('message-sent', { agentId, message, response });
            
            return response;
        } catch (error) {
            this.#dispatchEvent('message-error', { agentId, message, error });
            throw error;
        }
    }

    /**
     * Generate simulated agent response
     * Replace this with actual API integration
     * @private
     */
    async #generateResponse(agent, message) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        // Simulated responses based on agent type
        const responses = {
            assistant: [
                `I understand you're asking about "${message}". Let me help you with that.`,
                `That's an interesting question. Based on "${message}", I'd suggest...`,
                `I can help with that. Regarding "${message}", here's what I know...`
            ],
            coder: [
                `For the coding question "${message}", I recommend using modern ES2023+ syntax.`,
                `Looking at "${message}", here's a clean implementation approach...`,
                `Great question! For "${message}", consider these best practices...`
            ],
            analyst: [
                `Analyzing "${message}"... The data shows interesting patterns.`,
                `From a data perspective on "${message}", we should consider...`,
                `The metrics for "${message}" indicate...`
            ],
            default: [
                `Thank you for your message: "${message}". I'm processing this now.`,
                `I've received your request about "${message}". Let me analyze that.`,
                `Regarding "${message}", I can provide some insights.`
            ]
        };

        const agentResponses = responses[agent.id] || responses.default;
        const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];

        return randomResponse;
    }

    /**
     * Search agents by name or capabilities
     * @param {string} query - Search query
     * @returns {Array} Matching agents
     */
    searchAgents(query) {
        const lowerQuery = query.toLowerCase();
        return this.getAgents().filter(agent => 
            agent.name.toLowerCase().includes(lowerQuery) ||
            agent.description.toLowerCase().includes(lowerQuery) ||
            agent.capabilities.some(cap => cap.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Get agents by status
     * @param {string} status - Status to filter by
     * @returns {Array} Filtered agents
     */
    getAgentsByStatus(status) {
        return this.getAgents().filter(agent => agent.status === status);
    }

    /**
     * Clear all agents
     */
    clearAgents() {
        this.#agents.clear();
        this.#dispatchEvent('agents-cleared', {});
    }

    /**
     * Get agent statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const agents = this.getAgents();
        const statusCounts = agents.reduce((acc, agent) => {
            acc[agent.status] = (acc[agent.status] || 0) + 1;
            return acc;
        }, {});

        return {
            total: agents.length,
            byStatus: statusCounts,
            mostRecentlyActive: agents
                .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))[0] || null
        };
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     */
    addEventListener(event, callback) {
        this.#eventTarget.addEventListener(event, callback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     */
    removeEventListener(event, callback) {
        this.#eventTarget.removeEventListener(event, callback);
    }

    /**
     * Dispatch custom event
     * @private
     */
    #dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        this.#eventTarget.dispatchEvent(event);
    }

    /**
     * Export agents data for backup/migration
     * @returns {Object} Serializable agents data
     */
    exportData() {
        return {
            agents: this.getAgents(),
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    /**
     * Import agents data from backup/migration
     * @param {Object} data - Exported data
     */
    importData(data) {
        if (!data.agents || !Array.isArray(data.agents)) {
            throw new Error('Invalid import data format');
        }

        this.clearAgents();
        data.agents.forEach(agent => this.addAgent(agent));
        
        this.#dispatchEvent('data-imported', { count: data.agents.length });
    }
}
