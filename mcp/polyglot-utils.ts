/**
 * Utilities for the Polyglot Development Environment MCP Server
 */

import { spawn } from "cross-spawn";
import pkg from "fs-extra";
const { readFile, pathExists, readdir, stat } = pkg;
import { join, basename } from "path";
import { CommandResult, EnvironmentInfo, DevboxConfig, ValidationResult, ValidationCheck, SecurityFinding } from "./polyglot-types.js";

// Workspace root - detect from current working directory
export function getWorkspaceRoot(): string {
  // Look for polyglot project indicators
  const cwd = process.cwd();
  if (cwd.includes("polyglot-devenv")) {
    return cwd.split("polyglot-devenv")[0] + "polyglot-devenv";
  }
  return cwd;
}

// Environment paths
export const ENVIRONMENTS = ["python-env", "typescript-env", "rust-env", "go-env", "nushell-env"] as const;

export function getEnvironmentPath(environment: string): string {
  const workspaceRoot = getWorkspaceRoot();
  return join(workspaceRoot, environment);
}

export function isValidEnvironment(environment: string): environment is typeof ENVIRONMENTS[number] {
  return ENVIRONMENTS.includes(environment as typeof ENVIRONMENTS[number]);
}

// Execute commands with proper error handling
export async function executeCommand(
  command: string,
  args: string[] = [],
  options: { cwd?: string; timeout?: number } = {}
): Promise<CommandResult> {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: "pipe",
      shell: true,
    });

    let stdout = "";
    let stderr = "";
    let killed = false;

    // Timeout handling
    const timeout = options.timeout || 30000; // 30 seconds default
    const timeoutId = setTimeout(() => {
      killed = true;
      child.kill("SIGKILL");
    }, timeout);

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      
      resolve({
        success: code === 0 && !killed,
        output: stdout,
        error: stderr,
        exitCode: killed ? -1 : (code || 0),
        duration,
      });
    });

    child.on("error", (error) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      
      resolve({
        success: false,
        output: "",
        error: error.message,
        exitCode: -1,
        duration,
      });
    });
  });
}

// Environment detection and analysis
export async function detectEnvironments(): Promise<EnvironmentInfo[]> {
  const workspaceRoot = getWorkspaceRoot();
  const environments: EnvironmentInfo[] = [];

  for (const envName of ENVIRONMENTS) {
    const envPath = join(workspaceRoot, envName);
    
    if (await pathExists(envPath)) {
      try {
        const info = await analyzeEnvironment(envPath, envName);
        environments.push(info);
      } catch (error) {
        environments.push({
          name: envName,
          path: envPath,
          type: getEnvironmentType(envName),
          status: "error",
        });
      }
    }
  }

  return environments;
}

export async function analyzeEnvironment(envPath: string, envName: string): Promise<EnvironmentInfo> {
  const devboxConfigPath = join(envPath, "devbox.json");
  let devboxConfig: DevboxConfig | undefined;
  let status: "active" | "inactive" | "error" = "inactive";

  if (await pathExists(devboxConfigPath)) {
    try {
      const configContent = await readFile(devboxConfigPath, "utf-8");
      devboxConfig = JSON.parse(configContent) as DevboxConfig;
      status = "active";
    } catch (error) {
      status = "error";
    }
  }

  const stats = await stat(envPath);

  return {
    name: envName,
    path: envPath,
    type: getEnvironmentType(envName),
    status,
    devboxConfig,
    lastModified: stats.mtime,
  };
}

export function getEnvironmentType(envName: string): EnvironmentInfo["type"] {
  if (envName.includes("python")) return "python";
  if (envName.includes("typescript")) return "typescript";
  if (envName.includes("rust")) return "rust";
  if (envName.includes("go")) return "go";
  if (envName.includes("nushell")) return "nushell";
  return "python"; // fallback
}

// DevBox utilities
export async function runDevboxCommand(
  environment: string,
  command: string,
  args: string[] = []
): Promise<CommandResult> {
  const envPath = getEnvironmentPath(environment);
  return executeCommand("devbox", [command, ...args], { cwd: envPath });
}

export async function runDevboxScript(
  environment: string,
  script: string
): Promise<CommandResult> {
  const envPath = getEnvironmentPath(environment);
  return executeCommand("devbox", ["run", script], { cwd: envPath });
}

// Dynamic environment startup utilities
export async function startDevboxEnvironment(environment: string): Promise<CommandResult> {
  const envPath = getEnvironmentPath(environment);
  
  // First ensure devbox is initialized
  const initResult = await executeCommand("devbox", ["init"], { 
    cwd: envPath,
    timeout: 10000 
  });
  
  // Then start the environment
  return executeCommand("devbox", ["shell", "--print-env"], { 
    cwd: envPath,
    timeout: 30000 
  });
}

export async function getEnvironmentScripts(environment: string): Promise<Record<string, string>> {
  const envPath = getEnvironmentPath(environment);
  const devboxConfigPath = join(envPath, "devbox.json");
  
  try {
    if (await pathExists(devboxConfigPath)) {
      const configContent = await readFile(devboxConfigPath, "utf-8");
      const config = JSON.parse(configContent) as DevboxConfig;
      return config.shell?.scripts || {};
    }
  } catch (error) {
    // Config not readable, return empty scripts
  }
  
  return {};
}

export async function getDefaultSetupScript(environment: string): Promise<string | null> {
  const scripts = await getEnvironmentScripts(environment);
  const envType = getEnvironmentType(environment);
  
  // Priority order for setup scripts by environment type
  const setupPriority: Record<string, string[]> = {
    python: ["setup", "install", "sync", "init"],
    typescript: ["install", "setup", "build", "init"],
    rust: ["build", "setup", "init"],
    go: ["build", "setup", "init"],
    nushell: ["setup", "init"]
  };
  
  const priorities = setupPriority[envType] || ["setup", "install", "init"];
  
  for (const script of priorities) {
    if (scripts[script]) {
      return script;
    }
  }
  
  return null;
}

export async function getCommonCommands(environment: string): Promise<Record<string, string>> {
  const scripts = await getEnvironmentScripts(environment);
  const envType = getEnvironmentType(environment);
  
  // Common commands by environment type
  const commonByType: Record<string, string[]> = {
    python: ["test", "lint", "format", "type-check", "build", "dev", "run"],
    typescript: ["test", "lint", "build", "dev", "format", "type-check"],
    rust: ["test", "build", "run", "lint", "format", "check", "doc"],
    go: ["test", "build", "run", "lint", "format", "clean"],
    nushell: ["test", "check", "format", "validate", "run"]
  };
  
  const common = commonByType[envType] || ["test", "build", "run", "lint"];
  const result: Record<string, string> = {};
  
  common.forEach(cmd => {
    if (scripts[cmd]) {
      result[cmd] = scripts[cmd];
    }
  });
  
  return result;
}

// DevPod utilities
export async function listDevPodWorkspaces(): Promise<any[]> {
  const result = await executeCommand("devpod", ["list", "--output", "json"]);
  if (result.success) {
    try {
      return JSON.parse(result.output) as any[];
    } catch {
      return [];
    }
  }
  return [];
}

export async function provisionDevPodWorkspace(
  environment: string,
  count: number = 1
): Promise<CommandResult[]> {
  const results: CommandResult[] = [];
  const envPath = getEnvironmentPath(environment);
  
  for (let i = 1; i <= count; i++) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15);
    const workspaceName = `polyglot-${environment.replace("-env", "")}-devpod-${timestamp}-${i}`;
    
    const result = await executeCommand("devpod", [
      "up",
      envPath,
      "--id", workspaceName,
      "--ide", "vscode",
      "--provider", "docker"
    ], { timeout: 120000 }); // 2 minutes timeout
    
    results.push(result);
    
    // Small delay between provisions
    if (i < count) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
}

// Validation utilities
export async function validateEnvironment(environment: string): Promise<ValidationResult> {
  const checks: any[] = [];
  const envPath = getEnvironmentPath(environment);

  // Check if environment exists
  if (!(await pathExists(envPath))) {
    return {
      environment,
      checks: [{
        name: "Environment exists",
        status: "failed",
        message: `Environment directory not found: ${envPath}`
      }],
      overallStatus: "failed",
      summary: "Environment directory not found"
    };
  }

  // Check devbox.json
  const devboxPath = join(envPath, "devbox.json");
  if (await pathExists(devboxPath)) {
    checks.push({
      name: "DevBox configuration",
      status: "passed",
      message: "devbox.json found and valid"
    });
  } else {
    checks.push({
      name: "DevBox configuration",
      status: "failed",
      message: "devbox.json not found"
    });
  }

  // Run devbox status check
  const statusResult = await runDevboxCommand(environment, "info");
  if (statusResult.success) {
    checks.push({
      name: "DevBox status",
      status: "passed",
      message: "DevBox environment is functional"
    });
  } else {
    checks.push({
      name: "DevBox status",
      status: "warning",
      message: "DevBox environment may have issues"
    });
  }

  const failedChecks = checks.filter(c => c.status === "failed");
  const warningChecks = checks.filter(c => c.status === "warning");
  
  const overallStatus = failedChecks.length > 0 ? "failed" : 
                       warningChecks.length > 0 ? "warnings" : "passed";

  return {
    environment,
    checks,
    overallStatus,
    summary: `${checks.length} checks run, ${failedChecks.length} failed, ${warningChecks.length} warnings`
  };
}

// Performance utilities
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export function formatBytes(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)}${sizes[i]}`;
}

// Security utilities
export async function scanForSecrets(filePath: string): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = [];
  
  try {
    const content = await readFile(filePath, "utf-8");
    const lines = content.split("\n");
    
    // Simple secret patterns
    const secretPatterns = [
      { pattern: /api[_-]?key[_-]?=.+/i, type: "API Key" },
      { pattern: /password[_-]?=.+/i, type: "Password" },
      { pattern: /secret[_-]?=.+/i, type: "Secret" },
      { pattern: /token[_-]?=.+/i, type: "Token" },
      { pattern: /[a-f0-9]{32,}/i, type: "Hash/Key" },
    ];
    
    lines.forEach((line, index) => {
      secretPatterns.forEach(({ pattern, type }) => {
        if (pattern.test(line)) {
          findings.push({
            type: "secret",
            severity: "high",
            message: `Potential ${type} detected`,
            file: basename(filePath),
            line: index + 1,
            suggestion: "Move sensitive data to environment variables"
          });
        }
      });
    });
  } catch (error) {
    // File not readable, skip
  }
  
  return findings;
}