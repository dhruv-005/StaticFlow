import { create } from "zustand";

export const useBuilderStore = create<any>((set) => ({
  activeFile: "src/index.ts",
  files: {
    "src/index.ts": {
      name: "index.ts",
      path: "src/index.ts",
      language: "typescript",
      content: "// ⚡ StaticFlow API Workspace\nimport express from 'express';\nconst app = express();\napp.use(express.json());\napp.get('/health', (req, res) => res.json({ status: 'live' }));\napp.listen(3000, () => console.log('Live on 3000'));"
    }
  },
  isGenerating: false,
  selectedLanguage: "node-express",
  selectedDatabase: "postgresql",
  setActiveFile: (activeFile: string) => set({ activeFile }),
  setFiles: (files: any) => set({ files: files || {} }),
  updateFileContent: (path: string, content: string) =>
    set((state: any) => ({
      files: { ...state.files, [path]: { ...(state.files[path] || { name: path, path, language: 'typescript' }), content } },
    })),
  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
  setLanguage: (selectedLanguage: string) => set({ selectedLanguage }),
  setDatabase: (selectedDatabase: string) => set({ selectedDatabase }),
  resetBuilder: () => set({ activeFile: "src/index.ts", files: {}, isGenerating: false }),
}));
