"use client";
import Editor from "@monaco-editor/react";
import { useBuilderStore } from "@/stores/builder-store";
export function CodeEditor() {
  const { activeFile = "src/index.ts", files = {}, updateFileContent } = useBuilderStore();
  const currentFile = (files && files[activeFile]) || { content: "// Code Editor\n", language: "typescript", path: "src/index.ts" };
  return (
    <div className="h-full w-full bg-[#0d0d1a]">
      <Editor height="100%" path={currentFile.path} language={currentFile.language || "typescript"} value={currentFile.content} theme="vs-dark" onChange={(val) => updateFileContent(currentFile.path, val || "")} options={{ fontSize: 13, minimap: { enabled: true } }} />
    </div>
  );
}