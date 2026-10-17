import { create } from "zustand";
export const useSecurityStore = create<any>((set) => ({
  items: [], scans: [], tests: [], deployments: [], apiKeys: [], messages: [], projects: [],
  activeProject: null, currentScan: null, currentTest: null, activeDeployment: null,
  isScanning: false, isRunningTest: false, isDeploying: false, isGenerating: false,
  setItems: (items: any) => set({ items }),
  setScans: (scans: any) => set({ scans: scans || [] }),
  setTests: (tests: any) => set({ tests: tests || [] }),
  setDeployments: (deployments: any) => set({ deployments: deployments || [] }),
  setProjects: (projects: any) => set({ projects: projects || [] }),
  addMessage: (msg: any) => set((st: any) => ({ messages: [...(st.messages || []), msg] })),
}));
