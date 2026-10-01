import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";

interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "default";
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(value: boolean) => void>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);

  const confirm = useCallback<ConfirmFn>((next) => {
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
  }, []);

  useEffect(() => {
    if (!options) return;
    confirmButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options, close]);

  const danger = options?.tone !== "default";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] animate-in fade-in"
            onClick={() => close(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95"
          >
            <div className="flex gap-4">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                  danger
                    ? "bg-destructive-soft text-destructive"
                    : "bg-primary-soft text-primary"
                }`}
              >
                <Icon name={danger ? "delete" : "help"} />
              </div>
              <div className="min-w-0">
                <h2 id="confirm-title" className="text-base font-semibold">
                  {options.title}
                </h2>
                {options.description && (
                  <div className="mt-1.5 text-sm text-muted-foreground">
                    {options.description}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => close(false)}>
                Cancel
              </Button>
              <Button
                ref={confirmButton}
                variant={danger ? "danger" : "primary"}
                onClick={() => close(true)}
              >
                {options.confirmLabel ?? "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return context;
};
