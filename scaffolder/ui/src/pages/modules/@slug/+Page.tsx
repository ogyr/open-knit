import {useState} from "react";
import GenericLinkButton from "@app/components/GenericLinkButton";
import MarkdownDocument from "@app/components/MarkdownDocument";
import {getBundlesForModule} from "@app/content/scaffolderCatalog";
import type {Data} from "@app/pages/modules/@slug/+data";
import {useData} from "vike-react/useData";

export default function ModuleDetailsPage() {
    const {moduleSummary, moduleDocs} = useData<Data>();
    const [imageIsOpen, setImageIsOpen] = useState(false);

    if (!moduleSummary || !moduleDocs) {
        return (
            <div className="flex-1 w-full px-4 pb-10 pt-6 md:px-0 md:pt-8">
                <div className="mx-auto flex max-w-[1333px] flex-col gap-6 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
                    <h1>Module not found</h1>
                    <p className="text-lg leading-8 text-[var(--text-body)]">
                        The module you requested doesn&apos;t exist in the current catalog.
                    </p>
                    <div>
                        <GenericLinkButton href="/modules">
                            Back to modules
                        </GenericLinkButton>
                    </div>
                </div>
            </div>
        );
    }

    const includedBundles = getBundlesForModule(moduleSummary.slug);
    const coreFlowItems = parseCoreFlows(moduleDocs.coreFlows);

    return (
        <div className="flex-1 w-full px-4 pb-10 pt-6 md:px-0 md:pt-8">
            <div className="mx-auto flex max-w-[1333px] flex-col gap-8">
                <header className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-start">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl font-semibold tracking-[-0.03em] text-[var(--text-strong)] md:text-6xl">
                            {moduleSummary.title}
                        </h1>
                        <p className="max-w-[860px] text-lg leading-8 text-[var(--text-body)]">
                            {moduleSummary.heroDescription}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <GenericLinkButton href="/">
                                Generate with OpenKnit
                            </GenericLinkButton>
                            <GenericLinkButton href="/modules" variant="secondary">
                                Browse other modules
                            </GenericLinkButton>
                        </div>
                    </div>

                    <div className="flex justify-start lg:justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setImageIsOpen(true);
                            }}
                            className="group flex max-w-full flex-col items-start gap-3"
                        >
                            <div className="overflow-hidden rounded-[22px] transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                                <img
                                    src={moduleSummary.imagePath}
                                    alt={moduleSummary.imageAlt}
                                    className="h-[180px] w-auto max-w-full rounded-[22px] object-cover object-top md:h-[210px]"
                                />
                            </div>
                            <span className="text-sm font-medium text-[var(--text-muted)]">
                                In-app view
                            </span>
                        </button>
                    </div>
                </header>

                <section className="grid gap-6">
                    <article className="flex flex-col gap-5 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
                                What this module does
                            </h2>
                            <p className="leading-8 text-[var(--text-body)]">
                                {moduleSummary.shortDescription}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                                Key capabilities
                            </h3>
                            <ul className="ml-5 flex list-disc flex-col gap-2 text-[var(--text-body)]">
                                {moduleSummary.capabilities.map((capability) => (
                                    <li key={capability}>{capability}</li>
                                ))}
                            </ul>
                        </div>
                    </article>
                </section>

                <section className="grid gap-6">
                    <article className="flex flex-col gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
                                Core flows
                            </h2>
                        </div>
                        {coreFlowItems.length > 0 ? (
                            <ol className="ml-5 flex list-decimal flex-col gap-5">
                                {coreFlowItems.map((coreFlowItem) => (
                                    <li key={coreFlowItem.title} className="pl-2 text-[var(--text-body)]">
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                                                {coreFlowItem.title}
                                            </h3>
                                            {coreFlowItem.details ? (
                                                <MarkdownDocument content={coreFlowItem.details}/>
                                            ) : null}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <MarkdownDocument content={moduleDocs.coreFlows}/>
                        )}
                    </article>

                    <article className="flex flex-col gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6">
                        <h2 className="text-xl font-semibold text-[var(--text-strong)]">
                            Module is included in
                        </h2>
                        <ul className="ml-5 flex list-disc flex-col gap-2 text-[var(--text-body)]">
                            {includedBundles.length > 0 ? (
                                includedBundles.map((bundleDefinition) => (
                                    <li key={bundleDefinition.id}>
                                        <strong>{bundleDefinition.title}:</strong> {bundleDefinition.description}
                                    </li>
                                ))
                            ) : (
                                <li>This module is currently available only as an individual module selection.</li>
                            )}
                            {moduleSummary.isLocked ? (
                                <li>Included by default in the custom modules generator flow.</li>
                            ) : null}
                        </ul>
                    </article>

                    <article className="flex flex-col gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6">
                        <h2 className="text-xl font-semibold text-[var(--text-strong)]">
                            Source paths
                        </h2>
                        <ul className="ml-5 flex list-disc flex-col gap-2 break-all text-[var(--text-body)]">
                            <li>{moduleSummary.backendModulePath}</li>
                            {moduleSummary.frontendModulePath ? (
                                <li>{moduleSummary.frontendModulePath}</li>
                            ) : (
                                <li>No frontend module directory is currently present for this module.</li>
                            )}
                        </ul>
                    </article>
                </section>
            </div>

            {imageIsOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] px-4 py-8"
                    onClick={() => {
                        setImageIsOpen(false);
                    }}
                >
                    <div
                        className="flex max-h-full max-w-[1200px] flex-col gap-3"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <button
                            type="button"
                            className="self-end rounded-full bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--text-strong)]"
                            onClick={() => {
                                setImageIsOpen(false);
                            }}
                        >
                            Close
                        </button>
                        <div className="overflow-auto rounded-[24px] shadow-[var(--shadow-card)]">
                            <img
                                src={moduleSummary.imagePath}
                                alt={moduleSummary.imageAlt}
                                className="h-auto max-h-[80vh] w-full rounded-[24px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

type CoreFlowItem = {
    title: string;
    details: string;
};

function parseCoreFlows(content: string): CoreFlowItem[] {
    const lines = content.replace(/\r\n/g, "\n").split("\n");
    const coreFlowItems: CoreFlowItem[] = [];
    let currentItem: CoreFlowItem | null = null;

    for (const line of lines) {
        const headingMatch = line.match(/^\d+\.\s+(.*)$/);

        if (headingMatch) {
            if (currentItem) {
                currentItem.details = currentItem.details.trim();
                coreFlowItems.push(currentItem);
            }

            currentItem = {
                title: headingMatch[1].trim(),
                details: ""
            };
            continue;
        }

        if (!currentItem) {
            continue;
        }

        currentItem.details += `${line}\n`;
    }

    if (currentItem) {
        currentItem.details = currentItem.details.trim();
        coreFlowItems.push(currentItem);
    }

    return coreFlowItems;
}
