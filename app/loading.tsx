export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    </div>
  );
}
