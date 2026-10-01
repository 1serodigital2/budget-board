import { useEffect, useState } from "react";
import type { Category } from "../../types/category";
import type { ExpenseFilters as Filters } from "../../types/expense";
import {
  currentMonthKey,
  lastDayOfMonth,
  shiftMonth,
  todayKey,
} from "../../utils/helpers";
import { Input, Select } from "../form/Fields";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type Preset = "all" | "this-month" | "last-month" | "last-3-months" | "custom";

const presetRange = (preset: Preset): Pick<Filters, "from" | "to"> => {
  const month = currentMonthKey();
  switch (preset) {
    case "this-month":
      return { from: `${month}-01`, to: lastDayOfMonth(month) };
    case "last-month": {
      const last = shiftMonth(month, -1);
      return { from: `${last}-01`, to: lastDayOfMonth(last) };
    }
    case "last-3-months":
      return { from: `${shiftMonth(month, -2)}-01`, to: lastDayOfMonth(month) };
    default:
      return {};
  }
};

const detectPreset = (from?: string, to?: string): Preset => {
  if (!from && !to) return "all";
  for (const preset of ["this-month", "last-month", "last-3-months"] as const) {
    const range = presetRange(preset);
    if (range.from === from && range.to === to) return preset;
  }
  return "custom";
};

interface ExpenseFiltersProps {
  filters: Filters;
  categories: Category[];
  onChange: (filters: Filters) => void;
}

const ExpenseFilters = ({ filters, categories, onChange }: ExpenseFiltersProps) => {
  const searchProp = filters.search ?? "";
  const rangeProp = `${filters.from ?? ""}|${filters.to ?? ""}`;

  const [search, setSearch] = useState(searchProp);
  const [customRange, setCustomRange] = useState(
    () => detectPreset(filters.from, filters.to) === "custom",
  );

  // Follow changes made outside this component (URL, "Clear filters" buttons).
  const [synced, setSynced] = useState({ search: searchProp, range: rangeProp });
  if (synced.search !== searchProp || synced.range !== rangeProp) {
    setSynced({ search: searchProp, range: rangeProp });
    if (synced.search !== searchProp) setSearch(searchProp);
    if (synced.range !== rangeProp) {
      setCustomRange(detectPreset(filters.from, filters.to) === "custom");
    }
  }

  const preset = customRange ? "custom" : detectPreset(filters.from, filters.to);

  // Debounce the note search so we don't query on every keystroke.
  useEffect(() => {
    if (search === searchProp) return;
    const timer = window.setTimeout(
      // Not trimmed here: that would eat the space while the user is typing.
      () => onChange({ ...filters, search: search || undefined }),
      350,
    );
    return () => window.clearTimeout(timer);
  }, [search, searchProp, filters, onChange]);

  const hasFilters = !!(filters.categoryId || filters.from || filters.to || filters.search);

  const handlePreset = (value: Preset) => {
    if (value === "custom") {
      setCustomRange(true);
      return;
    }
    setCustomRange(false);
    onChange({ ...filters, from: undefined, to: undefined, ...presetRange(value) });
  };

  const clearAll = () => {
    setSearch("");
    setCustomRange(false);
    onChange({});
  };

  return (
    <div className="flex flex-col gap-3 border-b p-4 sm:px-6 lg:flex-row lg:items-center">
      <div className="relative flex-1 lg:max-w-xs">
        <Icon
          name="search"
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search notes"
          aria-label="Search notes"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
        <Select
          aria-label="Category"
          className="sm:w-48"
          value={filters.categoryId ?? ""}
          onChange={(e) =>
            onChange({ ...filters, categoryId: Number(e.target.value) || undefined })
          }
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Date range"
          className="sm:w-44"
          value={preset}
          onChange={(e) => handlePreset(e.target.value as Preset)}
        >
          <option value="all">All time</option>
          <option value="this-month">This month</option>
          <option value="last-month">Last month</option>
          <option value="last-3-months">Last 3 months</option>
          <option value="custom">Custom range…</option>
        </Select>
        {preset === "custom" && (
          <div className="col-span-2 flex items-center gap-2">
            <Input
              type="date"
              aria-label="From date"
              className="sm:w-40"
              max={filters.to || todayKey()}
              value={filters.from ?? ""}
              onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="date"
              aria-label="To date"
              className="sm:w-40"
              min={filters.from}
              value={filters.to ?? ""}
              onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
            />
          </div>
        )}
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" icon="filter_alt_off" onClick={clearAll} className="self-start lg:ml-auto lg:self-center">
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default ExpenseFilters;
