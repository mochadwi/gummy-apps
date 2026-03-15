/**
 * Safety and privacy state management
 */

import { create } from 'zustand';
import { ConsentRecord, SafetyGuardrail, ActivityLog, DataExport, DeletionRequest } from '@types/safety';

interface SafetyStore {
  consents: Map<string, ConsentRecord>; // userId -> ConsentRecord
  guardrails: Map<string, SafetyGuardrail[]>; // childId -> guardrails
  activityLogs: Map<string, ActivityLog[]>; // childId -> logs
  dataExports: Map<string, DataExport[]>; // childId -> exports
  deletionRequests: Map<string, DeletionRequest[]>; // childId -> requests
  
  // Consent actions
  recordConsent: (consent: ConsentRecord) => void;
  hasConsent: (userId: string, policyId: string) => boolean;
  
  // Guardrail actions
  addGuardrail: (guardrail: SafetyGuardrail) => void;
  updateGuardrail: (id: string, updates: Partial<SafetyGuardrail>) => void;
  getGuardrails: (childId: string) => SafetyGuardrail[];
  checkGuardrail: (childId: string, type: string) => SafetyGuardrail | null;
  
  // Activity log actions
  logActivity: (log: ActivityLog) => void;
  getActivityLogs: (childId: string) => ActivityLog[];
  getParentVisibleLogs: (childId: string) => ActivityLog[];
  
  // Data export actions
  createDataExport: (exportData: DataExport) => void;
  getDataExports: (childId: string) => DataExport[];
  
  // Deletion request actions
  createDeletionRequest: (request: DeletionRequest) => void;
  getDeletionRequests: (childId: string) => DeletionRequest[];
  confirmDeletion: (requestId: string) => void;
}

export const useSafetyStore = create<SafetyStore>((set, get) => ({
  consents: new Map(),
  guardrails: new Map(),
  activityLogs: new Map(),
  dataExports: new Map(),
  deletionRequests: new Map(),
  
  // Consent actions
  recordConsent: (consent) => {
    set((state) => {
      const newConsents = new Map(state.consents);
      newConsents.set(consent.userId, consent);
      return { consents: newConsents };
    });
  },
  
  hasConsent: (userId, policyId) => {
    const consent = get().consents.get(userId);
    return consent?.policyId === policyId;
  },
  
  // Guardrail actions
  addGuardrail: (guardrail) => {
    set((state) => {
      const newGuardrails = new Map(state.guardrails);
      const existing = newGuardrails.get(guardrail.childId) ?? [];
      newGuardrails.set(guardrail.childId, [...existing, guardrail]);
      return { guardrails: newGuardrails };
    });
  },
  
  updateGuardrail: (id, updates) => {
    set((state) => {
      const newGuardrails = new Map(state.guardrails);
      
      for (const [childId, gs] of newGuardrails) {
        const updated = gs.map((g) => (g.id === id ? { ...g, ...updates } : g));
        newGuardrails.set(childId, updated);
      }
      
      return { guardrails: newGuardrails };
    });
  },
  
  getGuardrails: (childId) => {
    return get().guardrails.get(childId) ?? [];
  },
  
  checkGuardrail: (childId, type) => {
    const guardrails = get().guardrails.get(childId) ?? [];
    return guardrails.find((g) => g.type === type) ?? null;
  },
  
  // Activity log actions
  logActivity: (log) => {
    set((state) => {
      const newLogs = new Map(state.activityLogs);
      const existing = newLogs.get(log.childId) ?? [];
      newLogs.set(log.childId, [...existing, log]);
      return { activityLogs: newLogs };
    });
  },
  
  getActivityLogs: (childId) => {
    return get().activityLogs.get(childId) ?? [];
  },
  
  getParentVisibleLogs: (childId) => {
    return (get().activityLogs.get(childId) ?? []).filter((log) => log.visibleToParent);
  },
  
  // Data export actions
  createDataExport: (exportData) => {
    set((state) => {
      const newExports = new Map(state.dataExports);
      const existing = newExports.get(exportData.childId) ?? [];
      newExports.set(exportData.childId, [...existing, exportData]);
      return { dataExports: newExports };
    });
  },
  
  getDataExports: (childId) => {
    return get().dataExports.get(childId) ?? [];
  },
  
  // Deletion request actions
  createDeletionRequest: (request) => {
    set((state) => {
      const newRequests = new Map(state.deletionRequests);
      const existing = newRequests.get(request.childId) ?? [];
      newRequests.set(request.childId, [...existing, request]);
      return { deletionRequests: newRequests };
    });
  },
  
  getDeletionRequests: (childId) => {
    return get().deletionRequests.get(childId) ?? [];
  },
  
  confirmDeletion: (requestId) => {
    set((state) => {
      const newRequests = new Map(state.deletionRequests);
      
      for (const [childId, reqs] of newRequests) {
        const updated = reqs.map((r) =>
          r.id === requestId ? { ...r, confirmedAt: Date.now(), status: 'confirmed' as const } : r
        );
        newRequests.set(childId, updated);
      }
      
      return { deletionRequests: newRequests };
    });
  },
}));
