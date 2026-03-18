import {useDeferredValue, useState} from "react";
import GenericLinkButton from "@app/components/GenericLinkButton";
import {moduleSummaries} from "@app/content/scaffolderCatalog";

export default function ModulesPage() {
    const [searchValue, setSearchValue] = useState("");
    const deferredSearchValue = useDeferredValue(searchValue);
    const normalizedQuery = deferredSearchValue.trim().toLowerCase();

    const filteredModules = moduleSummaries.filter((moduleSummary) => {
        if (!normalizedQuery) {
            return true;
        }

        const searchableText = [
            moduleSummary.title,
            moduleSummary.shortDescription,
            moduleSummary.heroDescription,
            ...moduleSummary.capabilities,
            ...moduleSummary.configurationHighlights
        ].join(" ").toLowerCase();

        return searchableText.includes(normalizedQuery);
    });

    return (
        <div className="flex-1 flex flex-col items-center w-full min-h-0 px-4 pb-10 pt-6 md:px-0 md:pt-4">
            <div className="flex flex-col items-start w-full max-w-[1333px] gap-8">
                <header className="flex max-w-[760px] flex-col gap-3">
                    <h1>OpenKnit modules catalog</h1>
                    <p className="max-w-[760px] text-lg leading-8 text-[var(--text-body)]">
                        Browse the available OpenKnit modules. Each module page explains what the module does.
                    </p>
                    <div className="flex flex-col gap-2 text-[var(--text-body)]">
                        <p><strong>Backend:</strong> Java + Spring Boot</p>
                        <p><strong>Frontend:</strong> React + TypeScript + Tailwind + Vite</p>
                        <p><strong>Vector stack:</strong> pgVector</p>
                        <p><strong>Infrastructure:</strong> One main docker compose, plus each module contains its own docker-compose.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <GenericLinkButton href="/">
                            Go to generator
                        </GenericLinkButton>
                    </div>
                </header>

                <section className="flex flex-col gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-semibold text-[var(--text-strong)]">
                                Available modules
                            </h2>
                            <p className="text-sm text-[var(--text-muted)]">
                                {filteredModules.length} of {moduleSummaries.length} modules visible
                            </p>
                        </div>
                        <label className="flex w-full max-w-[360px] flex-col gap-2 text-sm font-medium text-[var(--text-strong)]">
                            Search modules
                            <input
                                type="search"
                                value={searchValue}
                                onChange={(event) => {
                                    setSearchValue(event.target.value);
                                }}
                                placeholder="Search by module, feature, or config"
                                className="h-11 rounded-[14px] border border-[var(--border-strong)] bg-[var(--white)] px-4 outline-none transition-colors focus:border-[var(--primary-hover)]"
                            />
                        </label>
                    </div>

                    {filteredModules.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredModules.map((moduleSummary) => (
                                <a
                                    key={moduleSummary.slug}
                                    href={`/modules/${moduleSummary.slug}`}
                                    className="group flex h-full flex-col gap-5 rounded-[22px] border border-[var(--border)] bg-[var(--white)] p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--primary-strong)] hover:shadow-[var(--shadow-card)]"
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-xl font-semibold text-[var(--text-strong)]">
                                                {moduleSummary.title}
                                            </h3>
                                            {moduleSummary.isLocked ? (
                                                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--primary-strong)]">
                                                    Core
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="leading-7 text-[var(--text-body)]">
                                            {moduleSummary.shortDescription}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                                            Key capabilities
                                        </p>
                                        <ul className="ml-5 flex list-disc flex-col gap-2 text-[var(--text-body)]">
                                            {moduleSummary.capabilities.slice(0, 3).map((capability) => (
                                                <li key={capability}>{capability}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                                        <span className="text-sm font-semibold text-[var(--primary)]">
                                            View module
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[20px] border border-dashed border-[var(--border)] bg-[var(--surface-code-light)] px-6 py-10 text-center">
                            <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                                No modules match your search
                            </h3>
                            <p className="mt-2 text-[var(--text-body)]">
                                Try a different keyword such as auth, billing, vector, transactions, or wallet.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
