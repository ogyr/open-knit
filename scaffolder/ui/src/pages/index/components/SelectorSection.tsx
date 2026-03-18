import type {ChoiceOption} from "@app/pages/index/types";
import RadioCard from "@app/pages/index/components/RadioCard";

type SystemsSectionProps = {
    isMultiSelect: boolean;
    title: string;
    subtitle: string;
    options: ChoiceOption[];
    selectedOptions: ChoiceOption[];
    unselectedOptions: ChoiceOption[];
    selectedIds: Set<string>;
    lockedIds: Set<string>;
    onSelectSystem: (value: string) => void;
};

export default function SelectorSection({
                                            isMultiSelect,
                                            title,
                                            subtitle,
                                            options,
                                            selectedOptions,
                                            unselectedOptions,
                                            selectedIds,
                                            lockedIds,
                                            onSelectSystem
                                        }: SystemsSectionProps) {
    return (
        <div className="flex flex-col gap-4 items-start w-full min-h-0">
            <div className="flex flex-col gap-1 items-start">
                <div className="flex gap-1 items-start">
                    <h3 className="text-xl font-semibold text-[var(--text-strong)]">
                        3.
                    </h3>
                    <h3 className="text-xl font-semibold text-[var(--text-strong)]">
                        {title}
                    </h3>
                </div>
                <p className="font-normal text-[var(--text-body)]">
                    {subtitle}
                </p>
            </div>

            <div
                className="flex flex-col gap-4 items-start w-full overflow-y-auto pr-2"
                style={{maxHeight: "min(500px, calc(100dvh - var(--footer-height) - 320px))"}}
            >
                {isMultiSelect ? (
                    <>
                        {selectedOptions.map((option) => (
                            <RadioCard
                                key={option.id}
                                title={option.title}
                                description={option.description}
                                selected
                                disabled={lockedIds.has(option.id)}
                                onClick={() => {
                                    if (lockedIds.has(option.id)) {
                                        return;
                                    }
                                    onSelectSystem(option.id);
                                }}
                            />
                        ))}
                        {selectedOptions.length > 0 && unselectedOptions.length > 0 ? (
                            <hr className="w-full border-t border-[var(--border)]"/>
                        ) : null}
                        {unselectedOptions.map((option) => (
                            <RadioCard
                                key={option.id}
                                title={option.title}
                                description={option.description}
                                selected={false}
                                disabled={lockedIds.has(option.id)}
                                onClick={() => {
                                    if (lockedIds.has(option.id)) {
                                        return;
                                    }
                                    onSelectSystem(option.id);
                                }}
                            />
                        ))}
                    </>
                ) : (
                    options.map((option) => (
                        <RadioCard
                            key={option.id}
                            title={option.title}
                            description={option.description}
                            selected={selectedIds.has(option.id)}
                            disabled={lockedIds.has(option.id)}
                            onClick={() => {
                                if (lockedIds.has(option.id)) {
                                    return;
                                }
                                onSelectSystem(option.id);
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
