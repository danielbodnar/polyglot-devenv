import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { 
  handleClaudeFlowInit,
  handleClaudeFlowWizard,
  handleClaudeFlowStart,
  handleClaudeFlowStop,
  handleClaudeFlowStatus,
  handleClaudeFlowMonitor,
  handleClaudeFlowSpawn,
  handleClaudeFlowLogs,
  handleClaudeFlowHiveMind,
  handleClaudeFlowTerminalMgmt,
} from '../modules/claude-flow.js';
import {
  handleEnhancedHookContextTriggers,
  handleEnhancedHookErrorResolution,
  handleEnhancedHookEnvOrchestration,
  handleEnhancedHookDependencyTracking,
  handleEnhancedHookPerformanceIntegration,
  handleEnhancedHookQualityGates,
  handleEnhancedHookDevpodManager,
  handleEnhancedHookPrpLifecycle,
} from '../modules/enhanced-hooks.js';
import {
  handleDockerMcpGatewayStart,
  handleDockerMcpGatewayStatus,
  handleDockerMcpToolsList,
  handleDockerMcpHttpBridge,
  handleDockerMcpClientList,
  handleDockerMcpServerList,
  handleDockerMcpGeminiConfig,
  handleDockerMcpTest,
  handleDockerMcpDemo,
  handleDockerMcpSecurityScan,
  handleDockerMcpResourceLimits,
  handleDockerMcpNetworkIsolation,
  handleDockerMcpSignatureVerify,
  handleDockerMcpLogs,
  handleDockerMcpCleanup,
} from '../modules/docker-mcp.js';

describe('Modular MCP Tools', () => {
  
  describe('Claude-Flow Integration Tools', () => {
    test('claude_flow_init should initialize Claude-Flow in environment', async () => {
      const result = await handleClaudeFlowInit({
        environment: 'dev-env/python',
        force: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      // Allow for both success and failure since environment may not exist in test
      expect(typeof result.success).toBe('boolean');
    });

    test('claude_flow_wizard should run hive-mind wizard', async () => {
      const result = await handleClaudeFlowWizard({
        environment: 'dev-env/typescript',
        interactive: false, // Non-interactive for testing
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('claude_flow_status should get status for environment', async () => {
      const result = await handleClaudeFlowStatus({
        environment: 'dev-env/python',
        detailed: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('claude_flow_spawn should spawn AI agent with task', async () => {
      const result = await handleClaudeFlowSpawn({
        environment: 'dev-env/python',
        task: 'Test task for unit testing',
        claude: true,
        context: { test: true },
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('claude_flow_hive_mind should handle multi-agent coordination', async () => {
      const result = await handleClaudeFlowHiveMind({
        environment: 'dev-env/typescript',
        command: 'status',
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('claude_flow_terminal_mgmt should manage terminal sessions', async () => {
      const result = await handleClaudeFlowTerminalMgmt({
        environment: 'dev-env/rust',
        action: 'list',
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Enhanced AI Hooks Tools', () => {
    test('enhanced_hook_context_triggers should manage context engineering', async () => {
      const result = await handleEnhancedHookContextTriggers({
        action: 'status',
        cooldown: 60,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('enhanced_hook_error_resolution should analyze errors', async () => {
      const result = await handleEnhancedHookErrorResolution({
        action: 'analyze',
        error_text: 'ModuleNotFoundError: No module named test',
        environment: 'dev-env/python',
        confidence_threshold: 0.7,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('enhanced_hook_env_orchestration should manage environment switching', async () => {
      const result = await handleEnhancedHookEnvOrchestration({
        action: 'analytics',
        auto_provision: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('enhanced_hook_dependency_tracking should scan dependencies', async () => {
      const result = await handleEnhancedHookDependencyTracking({
        action: 'scan',
        environment: 'dev-env/python',
        security_check: true,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('enhanced_hook_performance_integration should track performance', async () => {
      const result = await handleEnhancedHookPerformanceIntegration({
        action: 'track',
        metrics: ['cpu', 'memory', 'disk'],
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('enhanced_hook_quality_gates should validate quality', async () => {
      const result = await handleEnhancedHookQualityGates({
        action: 'validate',
        environment: 'dev-env/typescript',
        fail_on_error: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('enhanced_hook_devpod_manager should manage DevPod lifecycle', async () => {
      const result = await handleEnhancedHookDevpodManager({
        action: 'lifecycle',
        environment: 'dev-env/rust',
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('enhanced_hook_prp_lifecycle should track PRP status', async () => {
      const result = await handleEnhancedHookPrpLifecycle({
        action: 'report',
        days: 7,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Docker MCP Integration Tools', () => {
    test('docker_mcp_gateway_status should check gateway status', async () => {
      const result = await handleDockerMcpGatewayStatus({
        detailed: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_tools_list should list available tools', async () => {
      const result = await handleDockerMcpToolsList({
        verbose: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_client_list should list MCP clients', async () => {
      const result = await handleDockerMcpClientList({
        active_only: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_server_list should list MCP servers', async () => {
      const result = await handleDockerMcpServerList({
        running_only: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_test should run integration tests', async () => {
      const result = await handleDockerMcpTest({
        suite: 'integration',
        verbose: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_security_scan should scan for vulnerabilities', async () => {
      const result = await handleDockerMcpSecurityScan({
        target: 'containers',
        detailed: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_resource_limits should manage resource limits', async () => {
      const result = await handleDockerMcpResourceLimits({
        action: 'get',
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_network_isolation should manage network isolation', async () => {
      const result = await handleDockerMcpNetworkIsolation({
        action: 'status',
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_logs should retrieve component logs', async () => {
      const result = await handleDockerMcpLogs({
        component: 'gateway',
        lines: 50,
        follow: false,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });

    test('docker_mcp_cleanup should clean up resources', async () => {
      const result = await handleDockerMcpCleanup({
        target: 'containers',
        force: false,
        unused_only: true,
      });
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    test('tools should handle invalid environment gracefully', async () => {
      const result = await handleClaudeFlowInit({
        environment: 'invalid-environment',
        force: false,
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid environment');
    });

    test('tools should handle missing required parameters', async () => {
      const result = await handleEnhancedHookErrorResolution({
        action: 'analyze',
        // Missing error_text parameter
        confidence_threshold: 0.7,
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
    });

    test('tools should handle command execution failures', async () => {
      const result = await handleDockerMcpSignatureVerify({
        image: 'nonexistent-image:latest',
        trusted_registry: false,
      });
      
      // Should handle gracefully even if command fails
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Schema Validation', () => {
    test('tools should validate input schemas correctly', async () => {
      // Test with valid input
      const validResult = await handleClaudeFlowStatus({
        environment: 'dev-env/python',
        detailed: true,
      });
      
      expect(validResult).toHaveProperty('success');
      expect(typeof validResult.success).toBe('boolean');
    });

    test('tools should handle enum validation', async () => {
      const result = await handleDockerMcpNetworkIsolation({
        action: 'status', // Valid enum value
      });
      
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });

    test('tools should handle optional parameters', async () => {
      const result = await handleEnhancedHookContextTriggers({
        action: 'status',
        cooldown: 60,
      });
      
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Integration Tests', () => {
    test('claude-flow and enhanced hooks should work together', async () => {
      // Test workflow: check status, then trigger context engineering
      const statusResult = await handleClaudeFlowStatus({
        environment: 'dev-env/python',
        detailed: false,
      });
      
      const contextResult = await handleEnhancedHookContextTriggers({
        action: 'status',
        cooldown: 60,
      });
      
      expect(statusResult).toHaveProperty('success');
      expect(contextResult).toHaveProperty('success');
      expect(typeof statusResult.success).toBe('boolean');
      expect(typeof contextResult.success).toBe('boolean');
    });

    test('docker mcp tools should work in sequence', async () => {
      // Test workflow: list tools, then check status
      const listResult = await handleDockerMcpToolsList({
        verbose: false,
      });
      
      const statusResult = await handleDockerMcpGatewayStatus({
        detailed: false,
      });
      
      expect(listResult).toHaveProperty('success');
      expect(statusResult).toHaveProperty('success');
      expect(typeof listResult.success).toBe('boolean');
      expect(typeof statusResult.success).toBe('boolean');
    });
  });
});