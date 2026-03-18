import type {ToggleSwitchProps} from "@app/pages/index/types";

export default function ToggleSwitch({checked, onChange, label, helper}: ToggleSwitchProps) {
    return (
        <div className="flex gap-2 items-start w-full">
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`h-6 w-12 shrink-0 relative rounded-[40px] transition-colors cursor-pointer ${
                    checked ? "bg-[var(--primary)]" : "bg-[var(--surface-switch-off)]"
                }`}
                aria-label={label}
                aria-pressed={checked}
            >
                <span
                    className="absolute bg-[var(--white)] rounded-[40px] w-5 h-5 top-0.5 transition-all"
                    style={{
                        left: checked ? "calc(100% - 23px)" : "3px"
                    }}
                />
            </button>
            <div className="flex flex-col gap-0.5">
                <p className="font-medium text-[var(--text-strong)]">
                    {label}
                </p>
                <p className="font-normal text-[var(--text-muted)]">
                    {helper}
                </p>
            </div>
        </div>
    );
}
