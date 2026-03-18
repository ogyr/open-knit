import type {ModuleSlug} from "@app/content/scaffolderCatalog";

import aiBackendGuide from "../../../../backend/modules/ai/AGENTS.md?raw";
import identityBackendGuide from "../../../../backend/modules/identity/AGENTS.md?raw";
import paymentBackendGuide from "../../../../backend/modules/payment/AGENTS.md?raw";
import transactionBackendGuide from "../../../../backend/modules/transaction/AGENTS.md?raw";
import walletBackendGuide from "../../../../backend/modules/wallet/AGENTS.md?raw";

export type ModuleDocs = {
    coreFlows: string;
    coreFlowsPath: string;
};

export const moduleDocsBySlug: Record<ModuleSlug, ModuleDocs> = {
    identity: {
        coreFlows: extractMarkdownSection(identityBackendGuide, "Core flows"),
        coreFlowsPath: "backend/modules/identity/AGENTS.md"
    },
    payment: {
        coreFlows: extractMarkdownSection(paymentBackendGuide, "Core flows"),
        coreFlowsPath: "backend/modules/payment/AGENTS.md"
    },
    wallet: {
        coreFlows: extractMarkdownSection(walletBackendGuide, "Core flows"),
        coreFlowsPath: "backend/modules/wallet/AGENTS.md"
    },
    transaction: {
        coreFlows: extractMarkdownSection(transactionBackendGuide, "Core flows"),
        coreFlowsPath: "backend/modules/transaction/AGENTS.md"
    },
    ai: {
        coreFlows: extractMarkdownSection(aiBackendGuide, "Core flows"),
        coreFlowsPath: "backend/modules/ai/AGENTS.md"
    }
};

function extractMarkdownSection(content: string, heading: string): string {
    const sectionMatch = content.match(new RegExp(`### ${escapeRegExp(heading)}\\n([\\s\\S]*?)(?=\\n### |$)`));

    if (!sectionMatch) {
        return content;
    }

    return sectionMatch[1].trim();
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
