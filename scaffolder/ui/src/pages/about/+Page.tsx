import GenericLinkButton from "@app/components/GenericLinkButton";

export default function AboutPage() {
    return (
        <div className="flex-1 flex flex-col items-center w-full min-h-0 px-4 pb-10 pt-6 md:px-0 md:pt-4">
            <div className="flex flex-col items-start w-full max-w-[1333px] gap-8">
                <header className="flex max-w-[860px] flex-col gap-4">
                    <h1>What OpenKnit is about</h1>
                    <p className="text-lg leading-8 text-[var(--text-body)]">
                        OpenKnit is an app builder for teams that want a serious starting point instead of another locked platform or fragile boilerplate. It gives you a working fullstack foundation with core business domains already implemented, and then leaves the code in your hands so you can keep shaping it yourself.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <GenericLinkButton href="/">
                            Open generator
                        </GenericLinkButton>
                        <GenericLinkButton href="/modules" variant="secondary">
                            Explore modules
                        </GenericLinkButton>
                    </div>
                </header>

                <section className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-200 ease-out hover:bg-[var(--surface-card-hover)]">
                        <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
                            Why it exists?
                        </h2>
                        <ul className="mt-4 ml-5 flex list-disc flex-col gap-3 text-[var(--text-body)]">
                            <li>To launch faster <b>instead of starting every system from zero</b>.</li>
                            <li>To keep the product easily extensible.</li>
                            <li>To reduce dependence on external providers.</li>
                        </ul>
                    </article>

                    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-200 ease-out hover:bg-[var(--surface-card-hover)]">
                        <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
                            What you get?
                        </h2>
                        <ul className="mt-4 ml-5 flex list-disc flex-col gap-3 text-[var(--text-body)]">
                            <li>A modular backend and frontend with predictable structure and clear boundaries.</li>
                            <li>Ready-made implementations for common domains such as identity, payments, transactions, wallets, and AI-related flows.</li>
                            <li>Consistent code that stays <b>understandable for modern code generators</b>.</li>
                        </ul>
                    </article>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-200 ease-out hover:bg-[var(--surface-card-hover)]">
                        <h2 className="text-xl font-semibold text-[var(--text-strong)]">
                            Better than a black box
                        </h2>
                        <p className="mt-3 leading-7 text-[var(--text-body)]">
                            You do not have to wait for OpenKnit to fix every issue or add every feature. The code is <b>already yours</b>, so your team can extend it directly when needed.
                        </p>
                    </article>

                    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-200 ease-out hover:bg-[var(--surface-card-hover)]">
                        <h2 className="text-xl font-semibold text-[var(--text-strong)]">
                            Built to stay organized
                        </h2>
                        <p className="mt-3 leading-7 text-[var(--text-body)]">
                            Everything is scoped into modules with a unified implementation style. That keeps the <b>system predictable as it grows</b>, instead of turning into tangled AI-generated code after a few screens and features.
                        </p>
                    </article>

                    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-200 ease-out hover:bg-[var(--surface-card-hover)]">
                        <h2 className="text-xl font-semibold text-[var(--text-strong)]">
                            Friendly to AI coding tools
                        </h2>
                        <p className="mt-3 leading-7 text-[var(--text-body)]">
                            The consistent structure gives tools like Codex or Claude a better map of the system. That means changes are easier to scope, less likely to overengineer, and easier to maintain later.
                        </p>
                    </article>
                </section>

                <section className="mx-auto w-full max-w-[1100px] rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-200 ease-out hover:bg-[var(--surface-card-hover)]">
                    <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
                        Ecosystem in simple terms
                    </h2>
                    <ul className="mt-4 ml-5 flex max-w-none list-disc flex-col gap-3 text-[var(--text-body)]">
                        <li>Backend: Java + Spring Boot</li>
                        <li>Frontend: React + TypeScript + Tailwind + Vite</li>
                        <li>Database capabilities include PostgreSQL with vector support through pgVector.</li>
                        <li>There is one main Docker Compose for the whole environment, and modules can also carry their own docker-compose setup when needed.</li>
                    </ul>
                </section>

                <section className="mx-auto w-full max-w-[1100px] rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-200 ease-out hover:bg-[var(--surface-card-hover)]">
                    <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
                        Want the deeper technical explanation?
                    </h2>
                    <p className="mt-3 max-w-none leading-7 text-[var(--text-body)]">
                        The GitHub repository contains a more technical README with architecture notes, stack details, use cases, screenshots, and setup guidance.
                    </p>
                    <div className="mt-5">
                        <GenericLinkButton
                            href="https://github.com/bitecode-tech/open-knit"
                            className="w-auto"
                        >
                            Read the GitHub README
                        </GenericLinkButton>
                    </div>
                </section>
            </div>
        </div>
    );
}
