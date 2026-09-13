/**
 * PROFICIO THERAPY SERVICES — AUTOMATION SERVICE (CLIENT)
 * 
 * Provides client-side interface to:
 * 1. Fetch, save, and delete automated deadline reminder definitions
 * 2. Retrieve execution audit history & idempotency records
 * 3. Trigger manual and dry-run deadline checks
 * 4. Send targeted test reminders through Resend
 * 5. Monitor Resend delivery status & engine health
 */

import { AutomationRule, AutomationExecutionLog, DeadlineEvaluationReport } from '../types';

export interface AutomationSystemStatus {
  resend: {
    configured: boolean;
    fromEmail: string;
    mode: 'LIVE_DELIVERY' | 'SIMULATION_MODE';
    provider: string;
  };
  activeRulesCount: number;
  totalRulesCount: number;
  totalExecutionsLogged: number;
  lastExecution: string | null;
}

export async function fetchAutomationStatus(): Promise<AutomationSystemStatus | null> {
  try {
    const res = await fetch('/api/automations/status');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[AutomationService] Could not fetch automation status:', err);
    return null;
  }
}

export async function fetchAutomationRules(): Promise<AutomationRule[]> {
  try {
    const res = await fetch('/api/automations/definitions');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.rules || [];
  } catch (err) {
    console.warn('[AutomationService] Could not fetch automation rules:', err);
    return [];
  }
}

export async function saveAutomationRule(rule: Partial<AutomationRule>): Promise<{ success: boolean; rule?: AutomationRule; error?: string }> {
  try {
    const res = await fetch('/api/automations/definitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return { success: true, rule: data.rule };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save rule' };
  }
}

export async function deleteAutomationRule(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/automations/definitions/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete rule' };
  }
}

export async function fetchAutomationExecutions(limit = 100): Promise<AutomationExecutionLog[]> {
  try {
    const res = await fetch(`/api/automations/executions?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.executions || [];
  } catch (err) {
    console.warn('[AutomationService] Could not fetch executions:', err);
    return [];
  }
}

export async function runDeadlineCheck(options: {
  dryRun?: boolean;
  forceDaysBefore?: number;
} = {}): Promise<{ success: boolean; report?: DeadlineEvaluationReport; error?: string }> {
  try {
    const res = await fetch('/api/automations/run-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return { success: true, report: data.report };
  } catch (err: any) {
    return { success: false, error: err.message || 'Deadline check failed' };
  }
}

export async function sendTestReminder(
  ruleId: string,
  recordId: string,
  targetEmail: string
): Promise<{ success: boolean; log?: AutomationExecutionLog; error?: string }> {
  try {
    const res = await fetch('/api/automations/test-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId, recordId, targetEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Test send failed' };
  }
}
