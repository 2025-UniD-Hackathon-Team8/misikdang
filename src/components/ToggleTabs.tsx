import type { ReactNode } from "react";

interface ToggleTab {
  id: string;
  label: ReactNode;
}

interface ToggleTabsProps {
  tabs: ReadonlyArray<ToggleTab>;
  activeTabId: string;
  onTabSelect: (id: string) => void;
  className?: string;
}

export default function ToggleTabs({
  tabs,
  activeTabId,
  onTabSelect,
  className = "",
}: ToggleTabsProps) {
  return (
    <div
      className={`flex h-[50px] w-[330px] items-center gap-2 rounded-[10px] bg-[#F8F8FA] p-2 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`h-[40px] w-[155px] rounded-[8px] text-sm font-semibold transition ${
              isActive
                ? "bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
                : "text-[var(--color-primary)]/70"
            }`}
            onClick={() => onTabSelect(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
