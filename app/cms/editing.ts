import { defaultContent, type PortfolioContent } from "./content";
export type EditorValue = string | EditorValue[] | {
    [key: string]: EditorValue;
};
export function newItem(field: string, current: EditorValue[]): EditorValue {
    const rsDefaults: Record<string, EditorValue> = {
        images: { image: "", label: "" },
        rsDesigns: { title: "", description: "", role: "", images: [] },
        nogaDesigns: { title: "", description: "", role: "", url: "", images: [] },
        rsCampaigns: { title: "", description: "", role: "", objective: "", period: "", metrics: [], images: [], note: "" },
        rsContent: { title: "", description: "", role: "", format: "", text: "", url: "", images: [] },
        rsWorks: { id: crypto.randomUUID(), title: "", description: "", role: "", badge: "", views: "", likes: "", comments: "", shares: "", url: "", note: "", video: "", poster: "" },
    };
    if (rsDefaults[field]) return structuredClone(rsDefaults[field]);
    const nested: Record<string, EditorValue> = {
        metrics: { value: "", label: "" },
        chapters: { number: "", title: "", text: "", evidence: "" },
        tags: "", items: "",
        noga: { platform: "Facebook", url: "" }, rs: { platform: "Facebook", url: "" }, aleem: { platform: "Facebook", url: "" },
    };
    const defaults = (defaultContent as unknown as Record<string, EditorValue>)[field];
    const result = structuredClone(current[0] ?? (Array.isArray(defaults) ? defaults[0] : nested[field] ?? { platform: "Facebook", url: "" }));
    if (typeof result === "object" && !Array.isArray(result)) {
        if (field === "caseStudies") {
            result.slug = `brand-${crypto.randomUUID().slice(0, 8)}`;
            result.name = "New brand";
            result.metrics = [];
            result.template = "standard";
        }
        if (field === "rsWorks")
            result.id = crypto.randomUUID();
    }
    return result;
}
export function updateSection(content: PortfolioContent, section: keyof PortfolioContent, value: EditorValue): PortfolioContent {
    const next = { ...content, [section]: value } as PortfolioContent;
    if (section === "caseStudies") {
        next.details = {};
        next.brandPlatforms = {};
        next.caseStudies.forEach((brand, index) => {
            // Existing slugs survive reorder/removal. Only a same-length edit can rename one.
            const previous = content.caseStudies.find(item => item.slug === brand.slug)
                ?? (next.caseStudies.length === content.caseStudies.length ? content.caseStudies[index] : undefined);
            next.details[brand.slug] = structuredClone((previous && content.details[previous.slug]) ?? { headline: "", intro: "", chapters: [] });
            next.brandPlatforms[brand.slug] = structuredClone((previous && content.brandPlatforms[previous.slug]) ?? []);
            if (previous && previous.slug !== brand.slug && !next.caseStudies.some(item => item.slug === previous.slug)) {
                const oldPath = `/work/${previous.slug}`;
                next.projects = next.projects.map(project => ({ ...project, link: project.link === oldPath || project.link.startsWith(`${oldPath}#`) ? project.link.replace(oldPath, `/work/${brand.slug}`) : project.link }));
            }
        });
    }
    return next;
}
