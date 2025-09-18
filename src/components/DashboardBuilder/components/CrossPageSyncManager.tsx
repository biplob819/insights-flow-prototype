/**
 * Cross-Page Sync Manager Component
 * Provides interface for managing control synchronization across dashboard pages
 * Implements Phase 4 requirement: Cross-Page Control Synchronization
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Link, 
  Users, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Play, 
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';
import { useCrossPageSync, createDefaultSyncGroup, validateSyncGroup } from '../../../services/CrossPageSyncService';
import { useControlContext } from '../contexts/ControlContext';
import type { 
  SyncGroup, 
  SyncStatus, 
  SyncConflict,
  SyncEvent
} from '../../../services/CrossPageSyncService';

interface CrossPageSyncManagerProps {
  className?: string;
}

export default function CrossPageSyncManager({ className = "" }: CrossPageSyncManagerProps) {
  const [syncGroups, setSyncGroups] = useState<SyncGroup[]>([]);
  const [syncStatuses, setSyncStatuses] = useState<Record<string, SyncStatus>>({});
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SyncGroup | null>(null);

  const { state } = useControlContext();
  const { getSyncGroups, getSyncStatus, getConflicts } = useCrossPageSync();

  // Load sync data
  const loadSyncData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [groups, allConflicts] = await Promise.all([
        getSyncGroups(),
        getConflicts()
      ]);
      
      setSyncGroups(groups);
      setConflicts(allConflicts);

      // Load status for each group
      const statuses: Record<string, SyncStatus> = {};
      for (const group of groups) {
        try {
          const status = await getSyncStatus(group.id);
          statuses[group.id] = status;
        } catch (error) {
          console.error(`Failed to load status for group ${group.id}:`, error);
        }
      }
      setSyncStatuses(statuses);
      
    } catch (error) {
      console.error('Failed to load sync data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getSyncGroups, getSyncStatus, getConflicts]);

  // Load data on mount
  useEffect(() => {
    loadSyncData();
  }, [loadSyncData]);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Link className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cross-Page Sync</h3>
            <p className="text-sm text-gray-500">Manage control synchronization across pages</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Sync Group</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading sync groups...</p>
          </div>
        ) : syncGroups.length === 0 ? (
          <div className="text-center py-8">
            <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Sync Groups</h4>
            <p className="text-gray-600 mb-4">Create your first sync group to synchronize controls across pages</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Sync Group</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Conflicts Alert */}
            {conflicts.filter(c => c.status === 'pending').length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    {conflicts.filter(c => c.status === 'pending').length} pending conflicts require attention
                  </span>
                </div>
              </div>
            )}

            {/* Sync Groups */}
            {syncGroups.map((group) => (
              <SyncGroupCard
                key={group.id}
                group={group}
                status={syncStatuses[group.id]}
                conflicts={conflicts.filter(c => c.syncGroupId === group.id)}
                onEdit={setEditingGroup}
                onRefresh={loadSyncData}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingGroup) && (
        <SyncGroupModal
          isOpen={true}
          onClose={() => {
            setShowCreateModal(false);
            setEditingGroup(null);
          }}
          group={editingGroup}
          onSave={loadSyncData}
        />
      )}
    </div>
  );
}

// Sync Group Card Component
interface SyncGroupCardProps {
  group: SyncGroup;
  status?: SyncStatus;
  conflicts: SyncConflict[];
  onEdit: (group: SyncGroup) => void;
  onRefresh: () => void;
}

function SyncGroupCard({ group, status, conflicts, onEdit, onRefresh }: SyncGroupCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const { enableGroup, disableGroup } = useCrossPageSync();

  const toggleGroup = useCallback(async () => {
    setIsToggling(true);
    try {
      if (group.enabled) {
        await disableGroup(group.id);
      } else {
        await enableGroup(group.id);
      }
      onRefresh();
    } catch (error) {
      console.error('Failed to toggle sync group:', error);
    } finally {
      setIsToggling(false);
    }
  }, [group.id, group.enabled, enableGroup, disableGroup, onRefresh]);

  const pendingConflicts = conflicts.filter(c => c.status === 'pending').length;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-medium text-gray-900">{group.name}</h4>
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${group.enabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
              }
            `}>
              {group.enabled ? 'Active' : 'Paused'}
            </span>
            
            {pendingConflicts > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                {pendingConflicts} conflicts
              </span>
            )}
          </div>

          {group.description && (
            <p className="text-sm text-gray-600 mb-2">{group.description}</p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{group.controlIds.length} controls</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Settings className="w-4 h-4" />
              <span>{group.syncMode}</span>
            </div>
            
            {status?.lastSyncAt && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Last sync: {status.lastSyncAt.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {/* Control List */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {group.controlIds.slice(0, 5).map((controlId) => (
                <span key={controlId} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {controlId}
                </span>
              ))}
              {group.controlIds.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{group.controlIds.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={toggleGroup}
            disabled={isToggling}
            className={`
              p-2 rounded-lg transition-colors disabled:opacity-50
              ${group.enabled 
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
              }
            `}
            title={group.enabled ? 'Pause sync' : 'Resume sync'}
          >
            {group.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onEdit(group)}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Edit sync group"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            title="Delete sync group"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <div className="flex items-center space-x-2">
              {status.isActive ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Pause className="w-4 h-4 text-gray-600" />
              )}
              <span className={status.isActive ? 'text-green-600' : 'text-gray-600'}>
                {status.isActive ? 'Syncing' : 'Paused'}
              </span>
            </div>
          </div>
          
          {status.pendingConflicts > 0 && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Conflicts:</span>
              <span className="text-yellow-600 font-medium">{status.pendingConflicts} pending</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Sync Group Modal Component
interface SyncGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: SyncGroup | null;
  onSave: () => void;
}

function SyncGroupModal({ isOpen, onClose, group, onSave }: SyncGroupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    controlIds: [] as string[],
    syncMode: 'bidirectional' as SyncGroup['syncMode'],
    masterControlId: '',
    conflictResolution: 'latest-wins' as SyncGroup['conflictResolution'],
    enabled: true
  });
  const [selectedControls, setSelectedControls] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { state } = useControlContext();
  const { createSyncGroup } = useCrossPageSync();

  // Initialize form data
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || '',
        controlIds: group.controlIds,
        syncMode: group.syncMode,
        masterControlId: group.masterControlId || '',
        conflictResolution: group.conflictResolution,
        enabled: group.enabled
      });
      setSelectedControls(group.controlIds);
    } else {
      setFormData({
        name: '',
        description: '',
        controlIds: [],
        syncMode: 'bidirectional',
        masterControlId: '',
        conflictResolution: 'latest-wins',
        enabled: true
      });
      setSelectedControls([]);
    }
  }, [group]);

  // Handle form field changes
  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle control selection
  const handleControlSelection = useCallback((controlId: string, selected: boolean) => {
    const newSelection = selected 
      ? [...selectedControls, controlId]
      : selectedControls.filter(id => id !== controlId);
    
    setSelectedControls(newSelection);
    setFormData(prev => ({ ...prev, controlIds: newSelection }));
  }, [selectedControls]);

  // Save sync group
  const handleSave = useCallback(async () => {
    const validation = validateSyncGroup(formData);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }

    setIsSaving(true);
    try {
      if (group) {
        // Update existing group (would need updateSyncGroup method)
        console.log('Update sync group:', formData);
      } else {
        await createSyncGroup(formData);
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save sync group:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, group, createSyncGroup, onSave, onClose]);

  if (!isOpen) return null;

  const availableControls = Object.keys(state.controls);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {group ? 'Edit Sync Group' : 'New Sync Group'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Mode
              </label>
              <select
                value={formData.syncMode}
                onChange={(e) => handleFieldChange('syncMode', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bidirectional">Bidirectional</option>
                <option value="master-slave">Master-Slave</option>
                <option value="broadcast">Broadcast</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the purpose of this sync group"
            />
          </div>

          {/* Master Control (for master-slave mode) */}
          {formData.syncMode === 'master-slave' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Master Control *
              </label>
              <select
                value={formData.masterControlId}
                onChange={(e) => handleFieldChange('masterControlId', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select master control...</option>
                {selectedControls.map((controlId) => (
                  <option key={controlId} value={controlId}>
                    {controlId}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Conflict Resolution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conflict Resolution
            </label>
            <select
              value={formData.conflictResolution}
              onChange={(e) => handleFieldChange('conflictResolution', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest-wins">Latest Wins</option>
              <option value="master-wins">Master Wins</option>
              <option value="manual">Manual Resolution</option>
              <option value="merge">Merge Values</option>
            </select>
          </div>

          {/* Control Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Controls to Sync *
            </label>
            
            {availableControls.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-sm text-gray-500">No controls available</p>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                {availableControls.map((controlId) => (
                  <label
                    key={controlId}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedControls.includes(controlId)}
                      onChange={(e) => handleControlSelection(controlId, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900">{controlId}</div>
                      <div className="text-xs text-gray-500">
                        {state.controls[controlId]?.type}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            <div className="mt-2 text-sm text-gray-500">
              Selected: {selectedControls.length} controls
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !formData.name || selectedControls.length < 2}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{group ? 'Update' : 'Create'} Group</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
