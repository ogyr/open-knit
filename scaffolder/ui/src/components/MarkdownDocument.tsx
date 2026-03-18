import {Fragment} from "react";

type MarkdownDocumentProps = {
    content: string;
};

type MarkdownBlock =
    | { type: "heading"; level: number; content: string }
    | { type: "paragraph"; content: string }
    | { type: "unordered-list"; items: { content: string; indent: number }[] }
    | { type: "ordered-list"; items: { content: string; indent: number }[] }
    | { type: "code"; content: string };

export default function MarkdownDocument({content}: MarkdownDocumentProps) {
    const blocks = parseMarkdownDocument(content);

    return (
        <div className="flex flex-col gap-4 text-[var(--text-body)]">
            {blocks.map((block, blockIndex) => {
                if (block.type === "heading") {
                    const headingClassNameByLevel: Record<number, string> = {
                        1: "text-2xl font-semibold text-[var(--text-strong)]",
                        2: "text-xl font-semibold text-[var(--text-strong)]",
                        3: "text-lg font-semibold text-[var(--text-strong)]",
                        4: "text-base font-semibold text-[var(--text-strong)]",
                        5: "text-sm font-semibold text-[var(--text-strong)]",
                        6: "text-sm font-semibold text-[var(--text-strong)]"
                    };

                    return (
                        <div key={`${block.type}-${blockIndex}`} className={headingClassNameByLevel[block.level] ?? headingClassNameByLevel[4]}>
                            {renderInlineMarkdown(block.content)}
                        </div>
                    );
                }

                if (block.type === "paragraph") {
                    return (
                        <p key={`${block.type}-${blockIndex}`} className="whitespace-pre-wrap leading-7 text-[var(--text-body)]">
                            {renderInlineMarkdown(block.content)}
                        </p>
                    );
                }

                if (block.type === "code") {
                    return (
                        <pre
                            key={`${block.type}-${blockIndex}`}
                            className="overflow-x-auto rounded-2xl bg-[var(--surface-code-dark)] px-4 py-3 text-sm leading-6 text-[var(--text-code-inverse)]"
                        >
                            <code>{block.content}</code>
                        </pre>
                    );
                }

                const ListTag = block.type === "ordered-list" ? "ol" : "ul";
                const listClassName = block.type === "ordered-list" ? "list-decimal" : "list-disc";

                return (
                    <ListTag key={`${block.type}-${blockIndex}`} className={`ml-5 flex flex-col gap-2 ${listClassName}`}>
                        {block.items.map((item, itemIndex) => (
                            <li
                                key={`${block.type}-${blockIndex}-${itemIndex}`}
                                style={{marginLeft: `${item.indent * 14}px`}}
                                className="leading-7 text-[var(--text-body)]"
                            >
                                {renderInlineMarkdown(item.content)}
                            </li>
                        ))}
                    </ListTag>
                );
            })}
        </div>
    );
}

function parseMarkdownDocument(content: string): MarkdownBlock[] {
    const lines = content.replace(/\r\n/g, "\n").split("\n");
    const blocks: MarkdownBlock[] = [];
    let currentParagraph: string[] = [];
    let currentList:
        | { type: "unordered-list" | "ordered-list"; items: { content: string; indent: number }[] }
        | null = null;

    const flushParagraph = () => {
        if (currentParagraph.length === 0) {
            return;
        }
        blocks.push({
            type: "paragraph",
            content: currentParagraph.join(" ").trim()
        });
        currentParagraph = [];
    };

    const flushList = () => {
        if (!currentList || currentList.items.length === 0) {
            currentList = null;
            return;
        }
        blocks.push(currentList);
        currentList = null;
    };

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const line = lines[lineIndex] ?? "";

        if (line.trim().startsWith("```")) {
            flushParagraph();
            flushList();
            const codeLines: string[] = [];
            lineIndex += 1;
            while (lineIndex < lines.length && !(lines[lineIndex] ?? "").trim().startsWith("```")) {
                codeLines.push(lines[lineIndex] ?? "");
                lineIndex += 1;
            }
            blocks.push({
                type: "code",
                content: codeLines.join("\n")
            });
            continue;
        }

        if (line.trim() === "") {
            flushParagraph();
            flushList();
            continue;
        }

        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            flushParagraph();
            flushList();
            blocks.push({
                type: "heading",
                level: headingMatch[1].length,
                content: headingMatch[2]
            });
            continue;
        }

        const unorderedListMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
        if (unorderedListMatch) {
            flushParagraph();
            const nextItem = {
                content: unorderedListMatch[2],
                indent: Math.floor(unorderedListMatch[1].length / 4)
            };

            if (!currentList || currentList.type !== "unordered-list") {
                flushList();
                currentList = {
                    type: "unordered-list",
                    items: [nextItem]
                };
            } else {
                currentList.items.push(nextItem);
            }
            continue;
        }

        const orderedListMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
        if (orderedListMatch) {
            flushParagraph();
            const nextItem = {
                content: orderedListMatch[2],
                indent: Math.floor(orderedListMatch[1].length / 4)
            };

            if (!currentList || currentList.type !== "ordered-list") {
                flushList();
                currentList = {
                    type: "ordered-list",
                    items: [nextItem]
                };
            } else {
                currentList.items.push(nextItem);
            }
            continue;
        }

        flushList();
        currentParagraph.push(line.trim());
    }

    flushParagraph();
    flushList();

    return blocks;
}

export function renderInlineMarkdown(content: string) {
    const parts = content.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+]\([^)]+\))/g);

    return parts.filter(Boolean).map((part, partIndex) => {
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code
                    key={`${part}-${partIndex}`}
                    className="rounded-md bg-[var(--surface-code-light)] px-1.5 py-0.5 text-sm text-[var(--surface-code-dark)]"
                >
                    {part.slice(1, -1)}
                </code>
            );
        }

        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={`${part}-${partIndex}`} className="font-semibold text-[var(--text-strong)]">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        const linkMatch = part.match(/^\[([^\]]+)]\(([^)]+)\)$/);
        if (linkMatch) {
            return (
                <a
                    key={`${part}-${partIndex}`}
                    href={linkMatch[2]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--primary)] underline decoration-[var(--primary)] underline-offset-2"
                >
                    {linkMatch[1]}
                </a>
            );
        }

        return <Fragment key={`${part}-${partIndex}`}>{part}</Fragment>;
    });
}
