import type {PageContext} from "vike/types";
import {getModuleSummaryBySlug, type ModuleSummary} from "@app/content/scaffolderCatalog";
import {moduleDocsBySlug, type ModuleDocs} from "@app/content/moduleDocs";

export type Data = {
    moduleSummary: ModuleSummary | null;
    moduleDocs: ModuleDocs | null;
};

export default async function data(pageContext: PageContext): Promise<Data> {
    const slug = pageContext.routeParams.slug;
    const moduleSummary = getModuleSummaryBySlug(slug);

    if (!moduleSummary) {
        return {
            moduleSummary: null,
            moduleDocs: null
        };
    }

    return {
        moduleSummary,
        moduleDocs: moduleDocsBySlug[moduleSummary.slug]
    };
}
