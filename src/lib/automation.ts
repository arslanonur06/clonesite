import { EventEmitter } from 'events';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface ScheduledScan {
  id: string;
  brand: string;
  baseUrl?: string;
  features: string[];
  schedule: {
    type: 'interval' | 'cron';
    value: string; // e.g., "24h" or "0 0 * * *"
  };
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  notifications: {
    enabled: boolean;
    channels: string[]; // 'email', 'telegram', 'webhook'
    recipients?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    field: string; // 'highRisk', 'totalDomains', 'clones', etc.
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne';
    value: number;
  }[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notifications: {
    enabled: boolean;
    channels: string[];
    recipients?: string[];
  };
  cooldown: number; // minutes between alerts
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationStats {
  totalScans: number;
  scheduledScans: number;
  activeAlerts: number;
  alertsTriggeredToday: number;
  averageScanTime: number;
  uptime: number;
}

class AutomationManager extends EventEmitter {
  private scheduledScans: Map<string, ScheduledScan> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private scanHistory: Map<string, any[]> = new Map();
  private automationStats: AutomationStats;
  private isRunning: boolean = false;
  private scanTimer?: NodeJS.Timeout;
  private alertTimer?: NodeJS.Timeout;

  constructor() {
    super();
    this.automationStats = {
      totalScans: 0,
      scheduledScans: 0,
      activeAlerts: 0,
      alertsTriggeredToday: 0,
      averageScanTime: 0,
      uptime: 0
    };
    this.loadConfiguration();
  }

  // Scheduled Scan Management
  async createScheduledScan(scan: Omit<ScheduledScan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newScan: ScheduledScan = {
      ...scan,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.scheduledScans.set(id, newScan);
    await this.saveConfiguration();

    this.emit('scheduled-scan-created', newScan);
    return id;
  }

  async updateScheduledScan(id: string, updates: Partial<ScheduledScan>): Promise<boolean> {
    const scan = this.scheduledScans.get(id);
    if (!scan) return false;

    const updatedScan = {
      ...scan,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.scheduledScans.set(id, updatedScan);
    await this.saveConfiguration();

    this.emit('scheduled-scan-updated', updatedScan);
    return true;
  }

  async deleteScheduledScan(id: string): Promise<boolean> {
    const deleted = this.scheduledScans.delete(id);
    if (deleted) {
      await this.saveConfiguration();
      this.emit('scheduled-scan-deleted', id);
    }
    return deleted;
  }

  getScheduledScans(): ScheduledScan[] {
    return Array.from(this.scheduledScans.values());
  }

  getScheduledScan(id: string): ScheduledScan | undefined {
    return this.scheduledScans.get(id);
  }

  // Alert Rule Management
  async createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newRule: AlertRule = {
      ...rule,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.alertRules.set(id, newRule);
    await this.saveConfiguration();

    this.emit('alert-rule-created', newRule);
    return id;
  }

  async updateAlertRule(id: string, updates: Partial<AlertRule>): Promise<boolean> {
    const rule = this.alertRules.get(id);
    if (!rule) return false;

    const updatedRule = {
      ...rule,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.alertRules.set(id, updatedRule);
    await this.saveConfiguration();

    this.emit('alert-rule-updated', updatedRule);
    return true;
  }

  async deleteAlertRule(id: string): Promise<boolean> {
    const deleted = this.alertRules.delete(id);
    if (deleted) {
      await this.saveConfiguration();
      this.emit('alert-rule-deleted', id);
    }
    return deleted;
  }

  getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values());
  }

  getAlertRule(id: string): AlertRule | undefined {
    return this.alertRules.get(id);
  }

  // Scan Execution
  async executeScheduledScan(scanId: string): Promise<any> {
    const scan = this.scheduledScans.get(scanId);
    if (!scan || !scan.enabled) return null;

    console.log(`🔄 Executing scheduled scan: ${scanId} for ${scan.brand}`);

    try {
      // Update last run time
      scan.lastRun = new Date().toISOString();
      this.scheduledScans.set(scanId, scan);

      // Here you would integrate with your existing scan functionality
      // For now, we'll simulate a scan result
      const scanResult = await this.simulateScanExecution(scan);

      // Check alert conditions
      await this.checkAlertConditions(scanResult);

      // Update scan history
      this.addScanHistory(scanId, scanResult);

      // Update statistics
      this.updateAutomationStats(scanResult);

      this.emit('scan-completed', { scanId, result: scanResult });
      return scanResult;

    } catch (error) {
      console.error(`Scheduled scan ${scanId} failed:`, error);
      this.emit('scan-failed', { scanId, error });
      throw error;
    }
  }

  private async simulateScanExecution(scan: ScheduledScan): Promise<any> {
    // Simulate scan execution - replace with actual scan logic
    return {
      scanId: scan.id,
      brand: scan.brand,
      timestamp: new Date().toISOString(),
      summary: {
        totalDomains: Math.floor(Math.random() * 100) + 50,
        activeDomains: Math.floor(Math.random() * 20) + 10,
        clones: Math.floor(Math.random() * 5),
        highRisk: Math.floor(Math.random() * 3)
      },
      executionTime: Math.floor(Math.random() * 30000) + 10000 // 10-40 seconds
    };
  }

  // Alert System
  private async checkAlertConditions(scanResult: any): Promise<void> {
    for (const rule of this.alertRules.values()) {
      if (!rule.enabled) continue;

      const shouldTrigger = this.evaluateAlertRule(rule, scanResult);

      if (shouldTrigger) {
        await this.triggerAlert(rule, scanResult);
      }
    }
  }

  private evaluateAlertRule(rule: AlertRule, scanResult: any): boolean {
    return rule.conditions.every(condition => {
      const fieldValue = this.getFieldValue(scanResult, condition.field);
      const conditionValue = condition.value;

      switch (condition.operator) {
        case 'gt': return fieldValue > conditionValue;
        case 'gte': return fieldValue >= conditionValue;
        case 'lt': return fieldValue < conditionValue;
        case 'lte': return fieldValue <= conditionValue;
        case 'eq': return fieldValue === conditionValue;
        case 'ne': return fieldValue !== conditionValue;
        default: return false;
      }
    });
  }

  private getFieldValue(obj: any, fieldPath: string): any {
    return fieldPath.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async triggerAlert(rule: AlertRule, scanResult: any): Promise<void> {
    // Check cooldown period
    if (rule.lastTriggered) {
      const lastTriggered = new Date(rule.lastTriggered);
      const minutesSince = (Date.now() - lastTriggered.getTime()) / (1000 * 60);

      if (minutesSince < rule.cooldown) {
        return; // Still in cooldown period
      }
    }

    // Update last triggered time
    rule.lastTriggered = new Date().toISOString();
    this.alertRules.set(rule.id, rule);

    // Send notifications
    if (rule.notifications.enabled) {
      await this.sendAlertNotifications(rule, scanResult);
    }

    // Update statistics
    this.automationStats.alertsTriggeredToday++;

    this.emit('alert-triggered', { rule, scanResult });
  }

  private async sendAlertNotifications(rule: AlertRule, scanResult: any): Promise<void> {
    const alertData = {
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      scanResult,
      timestamp: new Date().toISOString()
    };

    for (const channel of rule.notifications.channels) {
      switch (channel) {
        case 'telegram':
          await this.sendTelegramAlert(alertData, rule.notifications.recipients);
          break;
        case 'webhook':
          await this.sendWebhookAlert(alertData, rule.notifications.recipients);
          break;
        case 'email':
          await this.sendEmailAlert(alertData, rule.notifications.recipients);
          break;
      }
    }
  }

  private async sendTelegramAlert(alertData: any, recipients?: string[]): Promise<void> {
    // Implement Telegram notification
    console.log('📱 Sending Telegram alert:', alertData);
  }

  private async sendWebhookAlert(alertData: any, recipients?: string[]): Promise<void> {
    // Implement webhook notification
    console.log('🔗 Sending webhook alert:', alertData);
  }

  private async sendEmailAlert(alertData: any, recipients?: string[]): Promise<void> {
    // Implement email notification
    console.log('📧 Sending email alert:', alertData);
  }

  // Scan History Management
  private addScanHistory(scanId: string, result: any): void {
    if (!this.scanHistory.has(scanId)) {
      this.scanHistory.set(scanId, []);
    }

    const history = this.scanHistory.get(scanId)!;
    history.unshift(result);

    // Keep only last 100 entries
    if (history.length > 100) {
      history.pop();
    }
  }

  getScanHistory(scanId: string, limit: number = 50): any[] {
    return this.scanHistory.get(scanId)?.slice(0, limit) || [];
  }

  // Statistics and Monitoring
  private updateAutomationStats(scanResult: any): void {
    this.automationStats.totalScans++;
    this.automationStats.scheduledScans++;

    // Update average scan time
    const currentAvg = this.automationStats.averageScanTime;
    const newTime = scanResult.executionTime;
    this.automationStats.averageScanTime = (currentAvg * (this.automationStats.totalScans - 1) + newTime) / this.automationStats.totalScans;
  }

  getAutomationStats(): AutomationStats {
    return { ...this.automationStats };
  }

  // Automation Control
  startAutomation(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startScanScheduler();
    this.startAlertChecker();

    console.log('🚀 Automation system started');
    this.emit('automation-started');
  }

  stopAutomation(): void {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.scanTimer) {
      clearInterval(this.scanTimer);
      this.scanTimer = undefined;
    }

    if (this.alertTimer) {
      clearInterval(this.alertTimer);
      this.alertTimer = undefined;
    }

    console.log('⏹️ Automation system stopped');
    this.emit('automation-stopped');
  }

  private startScanScheduler(): void {
    // Check for scheduled scans every minute
    this.scanTimer = setInterval(async () => {
      const now = new Date();

      for (const scan of this.scheduledScans.values()) {
        if (!scan.enabled || !scan.nextRun) continue;

        const nextRun = new Date(scan.nextRun);
        if (now >= nextRun) {
          try {
            await this.executeScheduledScan(scan.id);
            this.scheduleNextRun(scan);
          } catch (error) {
            console.error(`Failed to execute scheduled scan ${scan.id}:`, error);
          }
        }
      }
    }, 60000); // Every minute
  }

  private scheduleNextRun(scan: ScheduledScan): void {
    const now = new Date();
    let nextRun: Date;

    if (scan.schedule.type === 'interval') {
      const interval = this.parseInterval(scan.schedule.value);
      nextRun = new Date(now.getTime() + interval);
    } else if (scan.schedule.type === 'cron') {
      // For cron expressions, we'd need a cron parser library
      // For now, default to daily
      nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else {
      // Default to daily for any other type
      nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    scan.nextRun = nextRun.toISOString();
    this.scheduledScans.set(scan.id, scan);
  }

  private parseInterval(interval: string): number {
    const match = interval.match(/^(\d+)([smhd])$/);
    if (!match) return 24 * 60 * 60 * 1000; // Default to 1 day

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  }

  private startAlertChecker(): void {
    // Check alert conditions every 5 minutes
    this.alertTimer = setInterval(async () => {
      // This would check current system status against alert rules
      // For now, it's handled in scan execution
    }, 300000); // Every 5 minutes
  }

  // Configuration Management
  private async loadConfiguration(): Promise<void> {
    try {
      const configPath = path.join(process.cwd(), 'automation-config.json');
      const config = await fs.readFile(configPath, 'utf8');
      const data = JSON.parse(config);

      if (data.scheduledScans) {
        this.scheduledScans = new Map(Object.entries(data.scheduledScans));
      }

      if (data.alertRules) {
        this.alertRules = new Map(Object.entries(data.alertRules));
      }

      if (data.stats) {
        this.automationStats = { ...this.automationStats, ...data.stats };
      }
    } catch (error) {
      // Configuration file doesn't exist or is invalid, start fresh
      console.log('📋 No existing automation configuration found, starting fresh');
    }
  }

  private async saveConfiguration(): Promise<void> {
    try {
      const configPath = path.join(process.cwd(), 'automation-config.json');
      const config = {
        scheduledScans: Object.fromEntries(this.scheduledScans),
        alertRules: Object.fromEntries(this.alertRules),
        stats: this.automationStats,
        lastSaved: new Date().toISOString()
      };

      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to save automation configuration:', error);
    }
  }

  // Batch Processing
  async executeBatchScans(scanConfigs: Omit<ScheduledScan, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    const scanIds: string[] = [];

    for (const config of scanConfigs) {
      try {
        const scanId = await this.createScheduledScan(config);
        scanIds.push(scanId);

        // Execute immediately if requested
        if (config.schedule && (config.schedule as any).type === 'immediate') {
          await this.executeScheduledScan(scanId);
        }
      } catch (error) {
        console.error(`Failed to create batch scan:`, error);
      }
    }

    return scanIds;
  }

  // Health Monitoring
  getSystemHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    activeScans: number;
    activeAlerts: number;
    lastError?: string;
  } {
    const now = Date.now();
    const uptime = this.automationStats.uptime;

    // Simple health check based on recent activity
    const isHealthy = uptime > 0 && this.scheduledScans.size > 0;

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      uptime,
      activeScans: this.scheduledScans.size,
      activeAlerts: this.alertRules.size
    };
  }
}

export function createAutomationManager(): AutomationManager {
  return new AutomationManager();
}

export { AutomationManager };