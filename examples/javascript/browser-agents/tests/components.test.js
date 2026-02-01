/**
 * Tests for Web Components
 * 
 * Comprehensive test suite for browser-agents components.
 * Uses Vitest with happy-dom for browser environment simulation.
 * Tests component lifecycle, events, and DOM manipulation.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentService } from '../services/agent-service.js';
import { StorageService } from '../services/storage-service.js';

describe('AgentService', () => {
    let agentService;

    beforeEach(() => {
        agentService = new AgentService();
    });

    describe('Agent Management', () => {
        it('should add an agent', () => {
            const agentId = agentService.addAgent({
                name: 'Test Agent',
                description: 'Test Description',
                status: 'online'
            });

            expect(agentId).toBeDefined();
            const agent = agentService.getAgent(agentId);
            expect(agent.name).toBe('Test Agent');
            expect(agent.status).toBe('online');
        });

        it('should generate UUID for agent without ID', () => {
            const agentId = agentService.addAgent({
                name: 'Test Agent'
            });

            expect(agentId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        });

        it('should get all agents', () => {
            agentService.addAgent({ name: 'Agent 1' });
            agentService.addAgent({ name: 'Agent 2' });
            agentService.addAgent({ name: 'Agent 3' });

            const agents = agentService.getAgents();
            expect(agents).toHaveLength(3);
        });

        it('should remove an agent', () => {
            const agentId = agentService.addAgent({ name: 'Test Agent' });
            const removed = agentService.removeAgent(agentId);

            expect(removed).toBe(true);
            expect(agentService.getAgent(agentId)).toBeNull();
        });

        it('should return false when removing non-existent agent', () => {
            const removed = agentService.removeAgent('non-existent-id');
            expect(removed).toBe(false);
        });

        it('should clear all agents', () => {
            agentService.addAgent({ name: 'Agent 1' });
            agentService.addAgent({ name: 'Agent 2' });
            
            agentService.clearAgents();
            expect(agentService.getAgents()).toHaveLength(0);
        });
    });

    describe('Agent Status', () => {
        it('should update agent status', () => {
            const agentId = agentService.addAgent({ 
                name: 'Test Agent',
                status: 'offline'
            });

            agentService.updateAgentStatus(agentId, 'online');
            const agent = agentService.getAgent(agentId);
            
            expect(agent.status).toBe('online');
        });

        it('should filter agents by status', () => {
            agentService.addAgent({ name: 'Agent 1', status: 'online' });
            agentService.addAgent({ name: 'Agent 2', status: 'online' });
            agentService.addAgent({ name: 'Agent 3', status: 'offline' });

            const onlineAgents = agentService.getAgentsByStatus('online');
            expect(onlineAgents).toHaveLength(2);
        });
    });

    describe('Message Handling', () => {
        it('should send message to agent', async () => {
            const agentId = agentService.addAgent({
                id: 'assistant',
                name: 'Assistant',
                status: 'online'
            });

            const response = await agentService.sendMessage(agentId, 'Hello');
            expect(response).toBeDefined();
            expect(typeof response).toBe('string');
        });

        it('should throw error when sending to non-existent agent', async () => {
            await expect(
                agentService.sendMessage('non-existent', 'Hello')
            ).rejects.toThrow('Agent non-existent not found');
        });

        it('should update lastActive timestamp after message', async () => {
            const agentId = agentService.addAgent({ 
                id: 'assistant',
                name: 'Test Agent' 
            });
            
            const beforeTimestamp = agentService.getAgent(agentId).lastActive;
            
            // Wait a bit to ensure timestamp difference
            await new Promise(resolve => setTimeout(resolve, 10));
            await agentService.sendMessage(agentId, 'Test message');
            
            const afterTimestamp = agentService.getAgent(agentId).lastActive;
            expect(afterTimestamp).not.toBe(beforeTimestamp);
        });
    });

    describe('Search Functionality', () => {
        beforeEach(() => {
            agentService.addAgent({
                name: 'Code Assistant',
                description: 'Helps with programming',
                capabilities: ['javascript', 'python']
            });
            agentService.addAgent({
                name: 'Data Analyst',
                description: 'Analyzes data patterns',
                capabilities: ['sql', 'analytics']
            });
        });

        it('should search agents by name', () => {
            const results = agentService.searchAgents('Code');
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('Code Assistant');
        });

        it('should search agents by description', () => {
            const results = agentService.searchAgents('programming');
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('Code Assistant');
        });

        it('should search agents by capabilities', () => {
            const results = agentService.searchAgents('python');
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('Code Assistant');
        });

        it('should be case-insensitive', () => {
            const results = agentService.searchAgents('DATA');
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('Data Analyst');
        });
    });

    describe('Statistics', () => {
        it('should return agent statistics', () => {
            agentService.addAgent({ name: 'Agent 1', status: 'online' });
            agentService.addAgent({ name: 'Agent 2', status: 'online' });
            agentService.addAgent({ name: 'Agent 3', status: 'offline' });

            const stats = agentService.getStatistics();
            
            expect(stats.total).toBe(3);
            expect(stats.byStatus.online).toBe(2);
            expect(stats.byStatus.offline).toBe(1);
            expect(stats.mostRecentlyActive).toBeDefined();
        });
    });

    describe('Data Export/Import', () => {
        it('should export agents data', () => {
            agentService.addAgent({ name: 'Agent 1' });
            agentService.addAgent({ name: 'Agent 2' });

            const exported = agentService.exportData();
            
            expect(exported.agents).toHaveLength(2);
            expect(exported.version).toBe('1.0.0');
            expect(exported.exportedAt).toBeDefined();
        });

        it('should import agents data', () => {
            const data = {
                agents: [
                    { name: 'Imported Agent 1', status: 'online' },
                    { name: 'Imported Agent 2', status: 'offline' }
                ],
                version: '1.0.0'
            };

            agentService.importData(data);
            
            expect(agentService.getAgents()).toHaveLength(2);
        });

        it('should throw error on invalid import data', () => {
            expect(() => {
                agentService.importData({ invalid: 'data' });
            }).toThrow('Invalid import data format');
        });
    });

    describe('Event System', () => {
        it('should emit agent-added event', (done) => {
            agentService.addEventListener('agent-added', (event) => {
                expect(event.detail.agent).toBeDefined();
                expect(event.detail.agent.name).toBe('Test Agent');
                done();
            });

            agentService.addAgent({ name: 'Test Agent' });
        });

        it('should emit agent-removed event', (done) => {
            const agentId = agentService.addAgent({ name: 'Test Agent' });

            agentService.addEventListener('agent-removed', (event) => {
                expect(event.detail.agentId).toBe(agentId);
                done();
            });

            agentService.removeAgent(agentId);
        });
    });
});

describe('StorageService', () => {
    let storageService;

    beforeEach(() => {
        storageService = new StorageService('test-prefix');
        storageService.clear();
    });

    describe('Basic Operations', () => {
        it('should set and get string values', () => {
            storageService.set('test-key', 'test-value');
            const value = storageService.get('test-key');
            
            expect(value).toBe('test-value');
        });

        it('should set and get object values', () => {
            const obj = { name: 'Test', count: 42 };
            storageService.set('test-obj', obj);
            const value = storageService.get('test-obj');
            
            expect(value).toEqual(obj);
        });

        it('should set and get array values', () => {
            const arr = [1, 2, 3, 4, 5];
            storageService.set('test-arr', arr);
            const value = storageService.get('test-arr');
            
            expect(value).toEqual(arr);
        });

        it('should return default value for non-existent key', () => {
            const value = storageService.get('non-existent', 'default');
            expect(value).toBe('default');
        });

        it('should remove values', () => {
            storageService.set('test-key', 'test-value');
            storageService.remove('test-key');
            
            expect(storageService.has('test-key')).toBe(false);
        });

        it('should check if key exists', () => {
            storageService.set('test-key', 'test-value');
            
            expect(storageService.has('test-key')).toBe(true);
            expect(storageService.has('non-existent')).toBe(false);
        });

        it('should clear all values with prefix', () => {
            storageService.set('key1', 'value1');
            storageService.set('key2', 'value2');
            storageService.clear();
            
            expect(storageService.keys()).toHaveLength(0);
        });
    });

    describe('Key Management', () => {
        it('should list all keys', () => {
            storageService.set('key1', 'value1');
            storageService.set('key2', 'value2');
            storageService.set('key3', 'value3');
            
            const keys = storageService.keys();
            expect(keys).toHaveLength(3);
            expect(keys).toContain('key1');
            expect(keys).toContain('key2');
            expect(keys).toContain('key3');
        });
    });

    describe('Size Calculation', () => {
        it('should calculate storage size', () => {
            storageService.set('test', 'value');
            const size = storageService.getSize();
            
            expect(size).toBeGreaterThan(0);
        });
    });

    describe('Export/Import', () => {
        it('should export all data', () => {
            storageService.set('key1', 'value1');
            storageService.set('key2', { nested: 'object' });
            
            const exported = storageService.exportAll();
            
            expect(exported.data.key1).toBe('value1');
            expect(exported.data.key2).toEqual({ nested: 'object' });
            expect(exported.version).toBeDefined();
            expect(exported.exportedAt).toBeDefined();
        });

        it('should import data', () => {
            const backup = {
                data: {
                    key1: 'imported1',
                    key2: 'imported2'
                },
                version: '1.0.0'
            };

            storageService.importAll(backup);
            
            expect(storageService.get('key1')).toBe('imported1');
            expect(storageService.get('key2')).toBe('imported2');
        });

        it('should throw error on invalid import', () => {
            expect(() => {
                storageService.importAll({ invalid: 'format' });
            }).toThrow('Invalid backup format');
        });
    });

    describe('Namespacing', () => {
        it('should create namespaced storage', () => {
            const namespaced = storageService.namespace('sub');
            
            namespaced.set('key', 'value');
            
            expect(namespaced.get('key')).toBe('value');
            expect(storageService.get('key')).toBeNull();
        });
    });
});
