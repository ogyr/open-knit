import {moduleSummaries, type ModuleSummary} from "@app/content/scaffolderCatalog";
import {usePageContext} from "vike-react/usePageContext";

const websiteUrl = "https://open-knit.com";

export default function Head() {
    const pageContext = usePageContext();
    const currentPathname = pageContext.urlPathname;
    const moduleSummary = resolveModuleSummary(pageContext.data);
    const meta = resolveMeta(currentPathname, moduleSummary);
    const structuredData = resolveStructuredData(currentPathname, moduleSummary, meta.canonicalUrl);

    return (
        <>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description}/>
            <meta property="og:title" content={meta.title}/>
            <meta property="og:description" content={meta.description}/>
            <meta property="og:type" content={meta.ogType}/>
            <meta property="og:url" content={meta.canonicalUrl}/>
            <meta name="robots" content="index,follow"/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={meta.title}/>
            <meta name="twitter:description" content={meta.description}/>
            <link rel="canonical" href={meta.canonicalUrl}/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
        </>
    );
}

function resolveMeta(currentPathname: string, moduleSummary: ModuleSummary | null) {
    if (moduleSummary && currentPathname.startsWith("/modules/")) {
        return {
            title: `${moduleSummary.title} for OpenKnit | ${moduleSummary.shortDescription}`,
            description: `${moduleSummary.title} in OpenKnit: ${moduleSummary.shortDescription} Learn the core flows, bundle coverage, and source paths for this fullstack module.`,
            canonicalUrl: `${websiteUrl}/modules/${moduleSummary.slug}`,
            ogType: "article"
        };
    }

    if (currentPathname === "/modules") {
        return {
            title: "OpenKnit Modules Catalog | Explore available modules",
            description: "Browse the OpenKnit modules catalog, compare module capabilities, and inspect implementation details before generating your fullstack app.",
            canonicalUrl: `${websiteUrl}/modules`,
            ogType: "website"
        };
    }

    if (currentPathname === "/about") {
        return {
            title: "About OpenKnit | Modular fullstack app builder",
            description: "Learn what OpenKnit is, why it exists, how its modular architecture works, and why teams can extend and own the code without vendor lock-in.",
            canonicalUrl: `${websiteUrl}/about`,
            ogType: "website"
        };
    }

    return {
        title: "OpenKnit - start with 70% of your app",
        description: "OpenKnit - foundation for your system, get 70% of your app out-of-the-box.",
        canonicalUrl: websiteUrl,
        ogType: "website"
    };
}

function resolveStructuredData(currentPathname: string, moduleSummary: ModuleSummary | null, canonicalUrl: string) {
    const defaultGraph = [
        {
            "@type": "WebSite",
            name: "OpenKnit",
            url: websiteUrl,
            description: "OpenKnit - foundation for your system, get 70% of your app out-of-the-box.",
            inLanguage: "en"
        },
        {
            "@type": "SoftwareApplication",
            name: "OpenKnit",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            url: websiteUrl,
            description: "OpenKnit - foundation for your system, get 70% of your app out-of-the-box.",
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD"
            }
        }
    ];

    if (moduleSummary && currentPathname.startsWith("/modules/")) {
        return {
            "@context": "https://schema.org",
            "@graph": [
                ...defaultGraph,
                {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "Generator",
                            item: websiteUrl
                        },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: "Modules Catalog",
                            item: `${websiteUrl}/modules`
                        },
                        {
                            "@type": "ListItem",
                            position: 3,
                            name: moduleSummary.title,
                            item: canonicalUrl
                        }
                    ]
                },
                {
                    "@type": "TechArticle",
                    headline: `${moduleSummary.title} for OpenKnit`,
                    description: moduleSummary.shortDescription,
                    url: canonicalUrl,
                    about: moduleSummary.capabilities,
                    isPartOf: {
                        "@type": "WebSite",
                        name: "OpenKnit",
                        url: websiteUrl
                    }
                }
            ]
        };
    }

    if (currentPathname === "/modules") {
        return {
            "@context": "https://schema.org",
            "@graph": [
                ...defaultGraph,
                {
                    "@type": "CollectionPage",
                    name: "OpenKnit Modules Catalog",
                    description: "Browse and compare OpenKnit modules before generating your app.",
                    url: canonicalUrl
                },
                {
                    "@type": "ItemList",
                    itemListElement: moduleSummaries.map((moduleSummary, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        name: moduleSummary.title,
                        url: `${websiteUrl}/modules/${moduleSummary.slug}`
                    }))
                }
            ]
        };
    }

    if (currentPathname === "/about") {
        return {
            "@context": "https://schema.org",
            "@graph": [
                ...defaultGraph,
                {
                    "@type": "AboutPage",
                    name: "About OpenKnit",
                    description: "Explanation of OpenKnit as a modular fullstack app builder with extendible code ownership and AI-friendly structure.",
                    url: canonicalUrl
                }
            ]
        };
    }

    return {
        "@context": "https://schema.org",
        "@graph": defaultGraph
    };
}

function resolveModuleSummary(data: unknown): ModuleSummary | null {
    if (!data || typeof data !== "object" || !("moduleSummary" in data)) {
        return null;
    }

    const moduleSummary = data.moduleSummary;
    if (!moduleSummary || typeof moduleSummary !== "object") {
        return null;
    }

    return moduleSummary as ModuleSummary;
}
