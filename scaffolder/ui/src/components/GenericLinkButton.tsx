import type {ReactNode} from "react";

type GenericLinkButtonProps = {
    href: string;
    children: ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
    target?: "_blank" | "_self";
    rel?: string;
};

export default function GenericLinkButton({
    href,
    children,
    variant = "primary",
    className = "",
    target,
    rel
}: GenericLinkButtonProps) {
    const variantClassName = variant === "primary"
        ? "bg-[var(--primary)] !text-[var(--white)] hover:bg-[var(--primary-hover)]"
        : "bg-[var(--surface-nav-active)] text-[var(--primary-strong)] hover:bg-[var(--surface-subtle)]";

    return (
        <a
            href={href}
            target={target}
            rel={rel}
            className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors ${variantClassName} ${className}`.trim()}
        >
            {children}
        </a>
    );
}
