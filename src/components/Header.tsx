interface HeaderTypes {
  handleSidebarToggle: () => void;
}

const Header = ({ handleSidebarToggle }: HeaderTypes) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-20 bg-background border-b border-border/40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleSidebarToggle()}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors text-foreground flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        <button className="flex items-center gap-2 bg-card hover:bg-muted border border-border px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
          <span className="text-[13px] font-semibold text-foreground">Sep 2026</span>
          <span className="material-symbols-outlined text-muted-foreground text-[16px] ml-1">expand_more</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </button>
        
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">notifications</span>
        </button>
        
        <button className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-full font-semibold text-[13px] transition-colors cursor-pointer shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Transaction
        </button>
        
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[13px] shrink-0 ml-1 border border-primary/30 cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;
