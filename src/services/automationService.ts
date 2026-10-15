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
import { safeFetchJson } from '../utils/safeFetch';

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
    const parsed = await safeFetchJson<AutomationSystemStatus>('/api/automations/status');
    if (!parsed.ok || !parsed.data) {
      console.warn('[AutomationService] Could not fetch automation status:', parsed.error);
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.warn('[AutomationService] Could not fetch automation status:', err);
    return null;
  }
}

export async function fetchAutomationRules(): Promise<AutomationRule[]> {
  try {
    const parsed = await safeFetchJson<{ rules: AutomationRule[] }>('/api/automations/definitions');
    if (!parsed.ok || !parsed.data) {
      console.warn('[AutomationService] Could not fetch automation rules:', parsed.error);
      return [];
    }
    return parsed.data.rules || [];
  } catch (err) {
    console.warn('[AutomationService] Could not fetch automation rules:', err);
    return [];
  }
}

export async function saveAutomationRule(rule: Partial<AutomationRule>): Promise<{ success: boolean; rule?: AutomationRule; error?: string }> {
  try {
    const parsed = await safeFetchJson<{ success: boolean; rule?: AutomationRule; error?: string }>('/api/automations/definitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    });
    if (!parsed.ok || !parsed.data?.success) {
      return { success: false, error: parsed.error || parsed.data?.error || `HTTP ${parsed.status}` };
    }
    return { success: true, rule: parsed.data.rule };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save rule' };
  }
}

export async function deleteAutomationRule(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = await safeFetchJson<{ success: boolean; error?: string }>(`/api/automations/definitions/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!parsed.ok || !parsed.data?.success) {
      return { success: false, error: parsed.error || parsed.data?.error || `HTTP ${parsed.status}` };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete rule' };
  }
}

export async function fetchAutomationExecutions(limit = 100): Promise<AutomationExecutionLog[]> {
  try {
    const parsed = await safeFetchJson<{ executions: AutomationExecutionLog[] }>(`/api/automations/executions?limit=${limit}`);
    if (!parsed.ok || !parsed.data) {
      console.warn('[AutomationService] Could not fetch executions:', parsed.error);
      return [];
    }
    return parsed.data.executions || [];
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
    const parsed = await safeFetchJson<{ success: boolean; report?: DeadlineEvaluationReport; error?: string }>('/api/automations/run-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    if (!parsed.ok || !parsed.data?.success) {
      return { success: false, error: parsed.error || parsed.data?.error || `Deadline check failed (${parsed.status})` };
    }
    return { success: true, report: parsed.data.report };
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
    const parsed = await safeFetchJson<{ success: boolean; log?: AutomationExecutionLog; error?: string }>('/api/automations/test-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId, recordId, targetEmail }),
    });
    if (!parsed.ok || !parsed.data?.success) {
      return { success: false, error: parsed.error || parsed.data?.error || `Test send failed (${parsed.status})` };
    }
    return parsed.data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Test send failed' };
  }
}
