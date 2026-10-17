"use client";
export function ChatMessage({ message }: { message: any }) {
  return <div className="text-xs text-white">{message?.content}</div>;
}
