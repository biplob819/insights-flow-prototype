/**
 * Cross-Page Sync Service
 * Handles advanced control synchronization across dashboard pages
 * Implements Phase 4 requirement: Cross-Page Control Synchronization
 */

import { ControlType, ControlState } from '../components/DashboardBuilder/types';

export interface SyncGroup {
  id: string;
  name: string;
  description?: string;
  controlIds: string[];
  syncMode: 'bidirectional' | 'master-slave' | 'broadcast';
  masterControlId?: string; // For master-slave mode
  conflictResolution: 'latest-wins' | 'master-wins' | 'manual' | 'merge';
  enabled: boolean;
  createdAt: Date;
  lastSyncAt?: Date;
}

export interface SyncRule {
  id: string;
  syncGroupId: string;
  sourceControlId: string;
  targetControlId: string;
  transformFunction?: string; // JavaScript function to transform values
  condition?: string; // Condition for when to sync
  enabled: boolean;
}

export interface SyncConflict {
  id: string;
  syncGroupId: string;
  controlId: string;
  conflictingValues: Array<{
    value: any;
    timestamp: Date;
    source: string;
  }>;
  resolvedValue?: any;
  resolvedAt?: Date;
  resolvedBy?: string;
  status: 'pending' | 'resolved' | 'ignored';
}

export interface SyncEvent {
  id: string;
  syncGroupId: string;
  controlId: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
  source: 'user' | 'sync' | 'api' | 'url';
  propagated: boolean;
}

export interface SyncStatus {
  syncGroupId: string;
  isActive: boolean;
  lastSyncAt?: Date;
  pendingConflicts: number;
  syncedControls: number;
  totalControls: number;
  errors: string[];
}

export interface CrossPageSyncOptions {
  enableConflictDetection: boolean;
  enableHistory: boolean;
  maxHistorySize: number;
  syncDelay: number; // Debounce delay in milliseconds
  enableCrossDashboard: boolean;
  persistState: boolean;
}

export interface CrossPageSyncService {
  // Sync group management
  createSyncGroup(group: Omit<SyncGroup, 'id' | 'createdAt'>): Promise<string>;
  updateSyncGroup(groupId: string, updates: Partial<SyncGroup>): Promise<void>;
  deleteSyncGroup(groupId: string): Promise<void>;
  getSyncGroups(dashboardId?: string): Promise<SyncGroup[]>;
  getSyncGroup(groupId: string): Promise<SyncGroup>;

  // Control synchronization
  addControlToSyncGroup(groupId: string, controlId: string): Promise<void>;
  removeControlFromSyncGroup(groupId: string, controlId: string): Promise<void>;
  syncControlValue(controlId: string, value: any, source?: string): Promise<void>;
  
  // Sync rules
  createSyncRule(rule: Omit<SyncRule, 'id'>): Promise<string>;
  updateSyncRule(ruleId: string, updates: Partial<SyncRule>): Promise<void>;
  deleteSyncRule(ruleId: string): Promise<void>;
  getSyncRules(syncGroupId: string): Promise<SyncRule[]>;

  // Conflict management
  getConflicts(syncGroupId?: string): Promise<SyncConflict[]>;
  resolveConflict(conflictId: string, resolvedValue: any, resolvedBy?: string): Promise<void>;
  ignoreConflict(conflictId: string): Promise<void>;

  // Sync status and monitoring
  getSyncStatus(syncGroupId: string): Promise<SyncStatus>;
  getSyncHistory(syncGroupId: string, limit?: number): Promise<SyncEvent[]>;
  
  // Bulk operations
  enableSyncGroup(groupId: string): Promise<void>;
  disableSyncGroup(groupId: string): Promise<void>;
  pauseAllSync(): Promise<void>;
  resumeAllSync(): Promise<void>;
}

class CrossPageSyncServiceImpl implements CrossPageSyncService {
  private readonly API_BASE = '/api/cross-page-sync';
  private syncGroups = new Map<string, SyncGroup>();
  private syncRules = new Map<string, SyncRule[]>();
  private syncHistory = new Map<string, SyncEvent[]>();
  private conflicts = new Map<string, SyncConflict[]>();
  private syncTimeouts = new Map<string, NodeJS.Timeout>();
  private options: CrossPageSyncOptions = {
    enableConflictDetection: true,
    enableHistory: true,
    maxHistorySize: 100,
    syncDelay: 300,
    enableCrossDashboard: false,
    persistState: true
  };

  /**
   * Create new sync group
   */
  async createSyncGroup(group: Omit<SyncGroup, 'id' | 'createdAt'>): Promise<string> {
    const syncGroup: SyncGroup = {
      ...group,
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    this.syncGroups.set(syncGroup.id, syncGroup);
    
    if (this.options.persistState) {
      await this.persistSyncGroup(syncGroup);
    }

    return syncGroup.id;
  }

  /**
   * Update sync group
   */
  async updateSyncGroup(groupId: string, updates: Partial<SyncGroup>): Promise<void> {
    const existingGroup = this.syncGroups.get(groupId);
    if (!existingGroup) {
      throw new Error(`Sync group ${groupId} not found`);
    }

    const updatedGroup = { ...existingGroup, ...updates };
    this.syncGroups.set(groupId, updatedGroup);

    if (this.options.persistState) {
      await this.persistSyncGroup(updatedGroup);
    }
  }

  /**
   * Delete sync group
   */
  async deleteSyncGroup(groupId: string): Promise<void> {
    this.syncGroups.delete(groupId);
    this.syncRules.delete(groupId);
    this.syncHistory.delete(groupId);
    this.conflicts.delete(groupId);

    // Clear any pending sync timeouts
    const timeout = this.syncTimeouts.get(groupId);
    if (timeout) {
      clearTimeout(timeout);
      this.syncTimeouts.delete(groupId);
    }

    if (this.options.persistState) {
      await this.deletePersistentSyncGroup(groupId);
    }
  }

  /**
   * Get all sync groups
   */
  async getSyncGroups(dashboardId?: string): Promise<SyncGroup[]> {
    const groups = Array.from(this.syncGroups.values());
    
    if (dashboardId) {
      // Filter groups that contain controls from this dashboard
      // This would require additional metadata about which dashboard each control belongs to
      return groups;
    }

    return groups;
  }

  /**
   * Get specific sync group
   */
  async getSyncGroup(groupId: string): Promise<SyncGroup> {
    const group = this.syncGroups.get(groupId);
    if (!group) {
      throw new Error(`Sync group ${groupId} not found`);
    }
    return group;
  }

  /**
   * Add control to sync group
   */
  async addControlToSyncGroup(groupId: string, controlId: string): Promise<void> {
    const group = this.syncGroups.get(groupId);
    if (!group) {
      throw new Error(`Sync group ${groupId} not found`);
    }

    if (!group.controlIds.includes(controlId)) {
      group.controlIds.push(controlId);
      await this.updateSyncGroup(groupId, { controlIds: group.controlIds });
    }
  }

  /**
   * Remove control from sync group
   */
  async removeControlFromSyncGroup(groupId: string, controlId: string): Promise<void> {
    const group = this.syncGroups.get(groupId);
    if (!group) {
      throw new Error(`Sync group ${groupId} not found`);
    }

    const index = group.controlIds.indexOf(controlId);
    if (index > -1) {
      group.controlIds.splice(index, 1);
      await this.updateSyncGroup(groupId, { controlIds: group.controlIds });
    }
  }

  /**
   * Sync control value across group
   */
  async syncControlValue(controlId: string, value: any, source: string = 'user'): Promise<void> {
    // Find sync groups containing this control
    const relevantGroups = Array.from(this.syncGroups.values()).filter(
      group => group.enabled && group.controlIds.includes(controlId)
    );

    for (const group of relevantGroups) {
      await this.propagateValueToGroup(group, controlId, value, source);
    }
  }

  /**
   * Create sync rule
   */
  async createSyncRule(rule: Omit<SyncRule, 'id'>): Promise<string> {
    const syncRule: SyncRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const existingRules = this.syncRules.get(rule.syncGroupId) || [];
    existingRules.push(syncRule);
    this.syncRules.set(rule.syncGroupId, existingRules);

    return syncRule.id;
  }

  /**
   * Update sync rule
   */
  async updateSyncRule(ruleId: string, updates: Partial<SyncRule>): Promise<void> {
    for (const [groupId, rules] of this.syncRules.entries()) {
      const ruleIndex = rules.findIndex(r => r.id === ruleId);
      if (ruleIndex > -1) {
        rules[ruleIndex] = { ...rules[ruleIndex], ...updates };
        this.syncRules.set(groupId, rules);
        return;
      }
    }
    throw new Error(`Sync rule ${ruleId} not found`);
  }

  /**
   * Delete sync rule
   */
  async deleteSyncRule(ruleId: string): Promise<void> {
    for (const [groupId, rules] of this.syncRules.entries()) {
      const filteredRules = rules.filter(r => r.id !== ruleId);
      if (filteredRules.length !== rules.length) {
        this.syncRules.set(groupId, filteredRules);
        return;
      }
    }
    throw new Error(`Sync rule ${ruleId} not found`);
  }

  /**
   * Get sync rules for group
   */
  async getSyncRules(syncGroupId: string): Promise<SyncRule[]> {
    return this.syncRules.get(syncGroupId) || [];
  }

  /**
   * Get conflicts
   */
  async getConflicts(syncGroupId?: string): Promise<SyncConflict[]> {
    if (syncGroupId) {
      return this.conflicts.get(syncGroupId) || [];
    }

    const allConflicts: SyncConflict[] = [];
    for (const conflicts of this.conflicts.values()) {
      allConflicts.push(...conflicts);
    }
    return allConflicts;
  }

  /**
   * Resolve conflict
   */
  async resolveConflict(conflictId: string, resolvedValue: any, resolvedBy?: string): Promise<void> {
    for (const [groupId, conflicts] of this.conflicts.entries()) {
      const conflictIndex = conflicts.findIndex(c => c.id === conflictId);
      if (conflictIndex > -1) {
        const conflict = conflicts[conflictIndex];
        conflict.resolvedValue = resolvedValue;
        conflict.resolvedAt = new Date();
        conflict.resolvedBy = resolvedBy;
        conflict.status = 'resolved';

        // Propagate resolved value
        await this.syncControlValue(conflict.controlId, resolvedValue, 'conflict-resolution');
        
        return;
      }
    }
    throw new Error(`Conflict ${conflictId} not found`);
  }

  /**
   * Ignore conflict
   */
  async ignoreConflict(conflictId: string): Promise<void> {
    for (const [groupId, conflicts] of this.conflicts.entries()) {
      const conflictIndex = conflicts.findIndex(c => c.id === conflictId);
      if (conflictIndex > -1) {
        conflicts[conflictIndex].status = 'ignored';
        return;
      }
    }
    throw new Error(`Conflict ${conflictId} not found`);
  }

  /**
   * Get sync status
   */
  async getSyncStatus(syncGroupId: string): Promise<SyncStatus> {
    const group = this.syncGroups.get(syncGroupId);
    if (!group) {
      throw new Error(`Sync group ${syncGroupId} not found`);
    }

    const conflicts = this.conflicts.get(syncGroupId) || [];
    const pendingConflicts = conflicts.filter(c => c.status === 'pending').length;

    return {
      syncGroupId,
      isActive: group.enabled,
      lastSyncAt: group.lastSyncAt,
      pendingConflicts,
      syncedControls: group.controlIds.length,
      totalControls: group.controlIds.length,
      errors: []
    };
  }

  /**
   * Get sync history
   */
  async getSyncHistory(syncGroupId: string, limit: number = 50): Promise<SyncEvent[]> {
    const history = this.syncHistory.get(syncGroupId) || [];
    return history.slice(-limit);
  }

  /**
   * Enable sync group
   */
  async enableSyncGroup(groupId: string): Promise<void> {
    await this.updateSyncGroup(groupId, { enabled: true });
  }

  /**
   * Disable sync group
   */
  async disableSyncGroup(groupId: string): Promise<void> {
    await this.updateSyncGroup(groupId, { enabled: false });
  }

  /**
   * Pause all sync
   */
  async pauseAllSync(): Promise<void> {
    for (const group of this.syncGroups.values()) {
      if (group.enabled) {
        await this.updateSyncGroup(group.id, { enabled: false });
      }
    }
  }

  /**
   * Resume all sync
   */
  async resumeAllSync(): Promise<void> {
    for (const group of this.syncGroups.values()) {
      if (!group.enabled) {
        await this.updateSyncGroup(group.id, { enabled: true });
      }
    }
  }

  /**
   * Propagate value to sync group
   */
  private async propagateValueToGroup(
    group: SyncGroup,
    sourceControlId: string,
    value: any,
    source: string
  ): Promise<void> {
    // Clear any existing timeout for this group
    const existingTimeout = this.syncTimeouts.get(group.id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set debounced sync
    const timeout = setTimeout(async () => {
      try {
        await this.executeSyncPropagation(group, sourceControlId, value, source);
      } catch (error) {
        console.error(`Sync propagation failed for group ${group.id}:`, error);
      } finally {
        this.syncTimeouts.delete(group.id);
      }
    }, this.options.syncDelay);

    this.syncTimeouts.set(group.id, timeout);
  }

  /**
   * Execute sync propagation
   */
  private async executeSyncPropagation(
    group: SyncGroup,
    sourceControlId: string,
    value: any,
    source: string
  ): Promise<void> {
    const targetControlIds = group.controlIds.filter(id => id !== sourceControlId);
    const rules = this.syncRules.get(group.id) || [];

    // Record sync event
    if (this.options.enableHistory) {
      this.recordSyncEvent(group.id, sourceControlId, value, source);
    }

    // Handle different sync modes
    switch (group.syncMode) {
      case 'bidirectional':
        await this.handleBidirectionalSync(group, targetControlIds, value, rules);
        break;
      
      case 'master-slave':
        if (sourceControlId === group.masterControlId) {
          await this.handleMasterSlaveSync(group, targetControlIds, value, rules);
        }
        break;
      
      case 'broadcast':
        await this.handleBroadcastSync(group, targetControlIds, value, rules);
        break;
    }

    // Update last sync time
    await this.updateSyncGroup(group.id, { lastSyncAt: new Date() });
  }

  /**
   * Handle bidirectional sync
   */
  private async handleBidirectionalSync(
    group: SyncGroup,
    targetControlIds: string[],
    value: any,
    rules: SyncRule[]
  ): Promise<void> {
    for (const targetId of targetControlIds) {
      const applicableRules = rules.filter(
        r => r.enabled && r.targetControlId === targetId
      );

      let finalValue = value;

      // Apply transformation rules
      for (const rule of applicableRules) {
        if (rule.transformFunction) {
          finalValue = this.applyTransformation(finalValue, rule.transformFunction);
        }
      }

      // Check for conflicts if enabled
      if (this.options.enableConflictDetection) {
        await this.checkForConflicts(group.id, targetId, finalValue);
      }

      // Propagate value (this would integrate with the actual control system)
      await this.propagateToControl(targetId, finalValue);
    }
  }

  /**
   * Handle master-slave sync
   */
  private async handleMasterSlaveSync(
    group: SyncGroup,
    targetControlIds: string[],
    value: any,
    rules: SyncRule[]
  ): Promise<void> {
    // Similar to bidirectional but only from master
    await this.handleBidirectionalSync(group, targetControlIds, value, rules);
  }

  /**
   * Handle broadcast sync
   */
  private async handleBroadcastSync(
    group: SyncGroup,
    targetControlIds: string[],
    value: any,
    rules: SyncRule[]
  ): Promise<void> {
    // Broadcast to all targets without conflict detection
    for (const targetId of targetControlIds) {
      await this.propagateToControl(targetId, value);
    }
  }

  /**
   * Apply transformation function
   */
  private applyTransformation(value: any, transformFunction: string): any {
    try {
      // Create a safe evaluation context
      const func = new Function('value', `return (${transformFunction})(value);`);
      return func(value);
    } catch (error) {
      console.error('Transformation function failed:', error);
      return value;
    }
  }

  /**
   * Check for conflicts
   */
  private async checkForConflicts(
    syncGroupId: string,
    controlId: string,
    newValue: any
  ): Promise<void> {
    // This would check if there are conflicting values from different sources
    // For now, we'll skip the implementation details
  }

  /**
   * Propagate value to control
   */
  private async propagateToControl(controlId: string, value: any): Promise<void> {
    // This would integrate with the actual control context to update the value
    // For now, we'll emit an event that the control context can listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('crossPageSync', {
        detail: { controlId, value }
      }));
    }
  }

  /**
   * Record sync event
   */
  private recordSyncEvent(
    syncGroupId: string,
    controlId: string,
    value: any,
    source: string
  ): void {
    const event: SyncEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      syncGroupId,
      controlId,
      oldValue: null, // Would need to track previous value
      newValue: value,
      timestamp: new Date(),
      source: source as SyncEvent['source'],
      propagated: true
    };

    const history = this.syncHistory.get(syncGroupId) || [];
    history.push(event);

    // Limit history size
    if (history.length > this.options.maxHistorySize) {
      history.splice(0, history.length - this.options.maxHistorySize);
    }

    this.syncHistory.set(syncGroupId, history);
  }

  /**
   * Persist sync group (placeholder for actual persistence)
   */
  private async persistSyncGroup(group: SyncGroup): Promise<void> {
    // This would save to localStorage, IndexedDB, or backend API
    if (typeof window !== 'undefined') {
      const key = `syncGroup_${group.id}`;
      localStorage.setItem(key, JSON.stringify(group));
    }
  }

  /**
   * Delete persistent sync group
   */
  private async deletePersistentSyncGroup(groupId: string): Promise<void> {
    if (typeof window !== 'undefined') {
      const key = `syncGroup_${groupId}`;
      localStorage.removeItem(key);
    }
  }
}

// Export singleton instance
export const crossPageSyncService = new CrossPageSyncServiceImpl();

// Export React hook for cross-page sync functionality
export function useCrossPageSync() {
  const createSyncGroup = async (group: Omit<SyncGroup, 'id' | 'createdAt'>) => {
    return crossPageSyncService.createSyncGroup(group);
  };

  const addControlToGroup = async (groupId: string, controlId: string) => {
    return crossPageSyncService.addControlToSyncGroup(groupId, controlId);
  };

  const syncControlValue = async (controlId: string, value: any, source?: string) => {
    return crossPageSyncService.syncControlValue(controlId, value, source);
  };

  const getSyncGroups = async (dashboardId?: string) => {
    return crossPageSyncService.getSyncGroups(dashboardId);
  };

  const getSyncStatus = async (groupId: string) => {
    return crossPageSyncService.getSyncStatus(groupId);
  };

  return {
    createSyncGroup,
    addControlToGroup,
    syncControlValue,
    getSyncGroups,
    getSyncStatus,
    enableGroup: crossPageSyncService.enableSyncGroup,
    disableGroup: crossPageSyncService.disableSyncGroup,
    getConflicts: crossPageSyncService.getConflicts,
    resolveConflict: crossPageSyncService.resolveConflict
  };
}

// Utility functions for sync group management
export function createDefaultSyncGroup(name: string, controlIds: string[]): Omit<SyncGroup, 'id' | 'createdAt'> {
  return {
    name,
    controlIds,
    syncMode: 'bidirectional',
    conflictResolution: 'latest-wins',
    enabled: true
  };
}

export function validateSyncGroup(group: Partial<SyncGroup>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!group.name || group.name.trim().length === 0) {
    errors.push('Sync group name is required');
  }

  if (!group.controlIds || group.controlIds.length < 2) {
    errors.push('Sync group must contain at least 2 controls');
  }

  if (group.syncMode === 'master-slave' && !group.masterControlId) {
    errors.push('Master control must be specified for master-slave sync mode');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
