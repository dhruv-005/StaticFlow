"use client";

import { useState } from "react";
import { User, Mail, Github, Save, Check, ShieldCheck, Globe, Upload } from "lucide-react";

export function ProfileForm() {
  const [name, setName] = useState("Alex Vance");
  const [email, setEmail] = useState("alex@staticflow.dev");
  const [githubUser, setGithubUser] = useState("alexvance");
  const [timezone, setTimezone] = useState("UTC-05:00 (Eastern Time)");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <User className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Developer Identity</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Public details displayed across team code reviews and audit trails</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyber-cyan/10 border-2 border-cyber-cyan/30 text-xl font-bold font-mono text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          AV
        </div>
        <div className="space-y-1">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-3 py-1.5 text-xs font-semibold text-cyber-white hover:bg-cyber-white/10 transition-all"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload New Avatar</span>
          </button>
          <p className="text-[10px] text-cyber-white/30 font-mono">JPG, PNG or GIF up to 5MB.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-white/30" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 pl-9 pr-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-white/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 pl-9 pr-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">GitHub Account Connection</label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-white/30" />
            <input
              type="text"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 pl-9 pr-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-mono text-cyber-white/50">Preferred Timezone</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-white/30" />
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 pl-9 pr-3.5 py-2.5 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-cyber-white/10 pt-4">
        <span className="flex items-center gap-1.5 text-xs font-mono text-cyber-green">
          <ShieldCheck className="h-4 w-4" /> Account Verified with GitHub OAuth
        </span>

        <button
          type="submit"
          className="neon-button flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
        >
          {saved ? <Check className="h-3.5 w-3.5 text-cyber-green" /> : <Save className="h-3.5 w-3.5" />}
          <span>{saved ? "Changes Saved" : "Save Profile"}</span>
        </button>
      </div>
    </form>
  );
}
