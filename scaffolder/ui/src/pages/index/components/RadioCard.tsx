import type {RadioCardProps} from "@app/pages/index/types";

export default function RadioCard({title, description, selected, onClick, disabled}: RadioCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-left rounded-[var(--radius)] p-3 transition-all bg-[var(--card)] ${
                selected
                    ? "border-2 border-[var(--primary-strong)]"
                    : "border border-[var(--border)]"
            } ${
                disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:border-[var(--primary-strong)] hover:bg-[var(--surface-code-light)]"
            }`}
        >
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[var(--text-strong)]">
                        {title}
                    </p>
                    {disabled ? (
                        <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.06em]">
              (default)
            </span>
                    ) : null}
                </div>
                <p className="font-normal leading-[1.5] text-[var(--text-muted)]">
                    {description}
                </p>
            </div>
        </button>
    );
}
