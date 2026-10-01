import type { ReactNode } from "react";
import Brand from "../components/layout/Brand";
import Icon from "../components/ui/Icon";

const highlights = [
  { icon: "receipt_long", text: "Log expenses in seconds and find them again with filters." },
  { icon: "savings", text: "Set monthly budgets per category and see progress as you spend." },
  { icon: "monitoring", text: "Spot trends with a clear month-by-month view of budget vs spend." },
];

interface AuthLayoutProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthLayout = ({ title, description, children, footer }: AuthLayoutProps) => (
  <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
    {/* Brand panel */}
    <aside className="relative hidden overflow-hidden bg-[#06281e] p-12 text-white lg:flex lg:flex-col">
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 size-[520px] rounded-full bg-emerald-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -left-24 size-[420px] rounded-full bg-teal-400/10 blur-3xl"
      />
      <div className="relative [&_span]:text-white">
        <Brand />
      </div>
      <div className="relative mt-auto max-w-md">
        <h2 className="text-3xl leading-tight font-semibold tracking-tight">
          Know where every rupee goes.
        </h2>
        <p className="mt-3 text-[15px] text-emerald-100/75">
          Budget Board keeps your spending and monthly budgets in one calm, focused place.
        </p>
        <ul className="mt-10 space-y-5">
          {highlights.map((item) => (
            <li key={item.icon} className="flex gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                <Icon name={item.icon} />
              </span>
              <span className="pt-1.5 text-sm text-emerald-50/85">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="relative mt-16 text-xs text-emerald-100/50">
        © {new Date().getFullYear()} Budget Board
      </p>
    </aside>

    {/* Form panel */}
    <main className="flex flex-col items-center justify-center px-4 py-12 sm:px-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 lg:hidden">
          <Brand />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  </div>
);

export default AuthLayout;
