"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, FileCode, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  maxSizeMb?: number;
  onFileSelect: (file: File) => void;
  className?: string;
}

export function FileUpload({
  accept = ".json,.yaml,.yml,.ts,.py",
  maxSizeMb = 10,
  onFileSelect,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setError(null);
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File exceeds max size limit of ${maxSizeMb}MB`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all",
          isDragging
            ? "border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            : "border-cyber-white/10 bg-cyber-white/[0.02] hover:border-cyber-cyan/40 hover:bg-cyber-white/[0.04]"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
          <Upload className="h-5 w-5" />
        </div>

        <p className="text-xs font-bold text-cyber-white">
          Click to upload or drag &amp; drop schema file
        </p>
        <p className="mt-1 text-[11px] font-mono text-cyber-white/40">
          OpenAPI, JSON, Swagger, YAML (Max {maxSizeMb}MB)
        </p>
      </div>

      {error && <p className="text-xs font-mono text-cyber-red">{error}</p>}

      {selectedFile && (
        <div className="flex items-center justify-between rounded-xl border border-cyber-green/30 bg-cyber-green/5 p-3 font-mono text-xs text-cyber-green">
          <div className="flex items-center gap-2 truncate">
            <FileCode className="h-4 w-4 shrink-0" />
            <span className="truncate">{selectedFile.name}</span>
            <span className="text-[10px] opacity-60">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            className="rounded p-1 hover:bg-cyber-green/20 text-cyber-green"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
