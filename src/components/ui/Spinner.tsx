const Spinner = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const PageLoader = ({ label = "Loading…" }: { label?: string }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
    <Spinner size={24} className="text-primary" />
    <p className="text-sm">{label}</p>
  </div>
);

export const FullScreenLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Spinner size={28} className="text-primary" />
  </div>
);

export default Spinner;
