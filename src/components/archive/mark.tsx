export function CodexMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M17.2 6.5 12 16h4.6L14.2 25.5 22 14.2h-4.8z" fill="currentColor" />
    </svg>
  );
}
