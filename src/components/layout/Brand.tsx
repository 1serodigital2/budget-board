const Brand = ({ compact = false }: { compact?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <rect x="8" y="16" width="4" height="8" rx="1.5" fill="#fff" />
      <rect x="14" y="11" width="4" height="13" rx="1.5" fill="#fff" />
      <rect x="20" y="7" width="4" height="17" rx="1.5" fill="#fff" fillOpacity=".7" />
    </svg>
    {!compact && (
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Budget Board
      </span>
    )}
  </div>
);

export default Brand;
