import { z } from "zod";
import { caseStudies, projects, services, experience, stack, aleemDesigns } from "../portfolio-data";
import { details } from "./case-details";
import { rsWorks } from "./rs-data";
import { rsDesigns as newRSDesigns, rsDesignPosts } from "./rs-designs";
import { brandPlatforms } from "./social-data";
const text = z.string().max(12000);
const url = text.refine(v => v === "" || (/^\/(?!\/)/.test(v) && !v.includes("\\")) || /^https:\/\//.test(v), "Use an HTTPS link or a local /path");
const metric = z.object({ value: text, label: text });
const chapter = z.object({ number: text, title: text, text, evidence: text });
const images = z.array(z.object({ image: url, label: text })).max(100);
const work = { title: text, description: text, role: text };
const designWork = z.object({ ...work, url: url.default(""), images });
export const contentSchema = z.object({
    profile: z.object({ name: text.min(1), location: text, title: text, headline: text, headlineSecond: text, intro: text, portrait: url, about: text, github: url }),
    services: z.array(text).max(50),
    caseStudies: z.array(z.object({ name: text.min(1), slug: z.string().regex(/^[a-z0-9-]+$/), monogram: text, image: url, market: text, period: text, role: text, summary: text, tags: z.array(text), accent: z.string().regex(/^#[0-9a-fA-F]{6}$/), assetHint: text, metrics: z.array(metric).default([]), template: z.enum(["standard", "noga", "rs", "aleem"]).optional() }).transform(brand => ({ ...brand, template: brand.template ?? (brand.slug === "noga" || brand.slug === "rs" || brand.slug === "aleem" ? brand.slug : "standard") }))).max(50),
    projects: z.array(z.object({ title: text, short: text, image: url, category: text, description: text, tone: z.enum(["lime", "blue", "orange", "cyan", "violet", "rose", "navy", "gold"]), status: z.enum(["live", "placeholder"]), link: url.default("") })).max(200),
    experience: z.array(z.object({ period: text, role: text, company: text, description: text })).max(50),
    stack: z.array(z.object({ name: text, items: z.array(text) })).max(50),
    aleemDesigns: z.array(z.object({ image: url, label: text })).max(200),
    nogaDesigns: z.array(designWork).max(200).default([]),
    rsDesignsVersion: z.number().int().min(0).default(1),
    rsWorksVersion: z.number().int().min(0).default(2),
    details: z.record(z.string(), z.object({ headline: text, intro: text, chapters: z.array(chapter) })),
    rsWorks: z.array(z.object({ id: text, title: text, description: text, role: text, badge: z.enum(["Organic", "Organic + Paid", "Results provided", ""]), views: text, likes: text, comments: text, shares: text, url, note: text, video: url, poster: url })).max(200),
    rsDesigns: z.array(designWork).max(200).default([]),
    rsCampaigns: z.array(z.object({ ...work, objective: text, period: text, metrics: z.array(metric), images, note: text })).max(200).default([]),
    rsContent: z.array(z.object({ ...work, format: text, text, url, images })).max(200).default([]),
    brandPlatforms: z.record(z.string(), z.array(z.object({ platform: z.enum(["Facebook", "Instagram"]), url }))),
}).transform(value => {
    const financialAccountant = value.rsWorks.find(work => work.id === "financial-accountant");
    if (financialAccountant) {
        financialAccountant.likes ||= "148";
        financialAccountant.comments ||= "17";
        financialAccountant.shares ||= "14";
        if (financialAccountant.url === "https://www.facebook.com/share/v/1DwPdQJNCW/")
            financialAccountant.url = "https://www.facebook.com/reel/1382245969975501";
    }
    for (const design of value.rsDesigns) {
        const post = design.images.map(image => rsDesignPosts[image.image]).find(Boolean);
        if (post) { design.url = post; design.role = "Content writing & graphic design"; }
    }
    for (const brand of value.caseStudies) {
        if (brand.template === "noga") {
            if (brand.summary.startsWith("Built and ran the brand end to end:")) brand.summary = caseStudies.find(study => study.slug === "noga")!.summary;
            const story = value.details[brand.slug];
            if (story?.intro.startsWith("Noga Home is the full story of a brand I built and operated myself.")) value.details[brand.slug] = structuredClone(details.noga);
        }
        if (brand.template !== "rs") continue;
        if (brand.role === "Sales → Operations → Marketing") brand.role = "Digital Marketing · Content · Design · Paid Media";
        if (brand.summary.startsWith("Started in sales, generating approximately EGP 200K")) brand.summary = "Created content, social designs and video for RS, managed social media, and worked on paid campaigns and performance reporting.";
        if (brand.tags.join("|") === "Sales|Operations|Marketing|Design|Video") brand.tags = ["Content", "Design", "Video", "Paid Media"];
        const story = value.details[brand.slug];
        if (story?.headline === "Sales first. Then operations. Then marketing.") {
            story.headline = "Content, creative & paid media.";
            story.intro = "My digital marketing work at RS brings together content writing, social design, photography, video production, campaign execution and performance reporting.";
            story.chapters = [...story.chapters.filter(c => c.title.startsWith("Digital marketing")), ...story.chapters.filter(c => !c.title.startsWith("Digital marketing"))].map((c, i) => ({ ...c, number: String(i + 1).padStart(2, "0") }));
        }
    }
    for (const project of value.projects) {
        if (project.title === "Noga Home Store") {
            project.link = "https://noga-home-store.amr743366.workers.dev/";
            project.description = "E-commerce storefront and admin workflow designed and developed by me. Work in progress.";
        }
        if (project.title === "RS: Sales to Marketing") {
        project.title = "RS: Content, Creative & Campaigns";
        project.description = "Social designs, video production, written content and paid campaign results.";
        }
    }
    for (const item of value.experience) if (item.company === "RS" && item.description.startsWith("Approximately EGP 200K in sales across three months")) item.description = "Early experience in customer sales and operations, including Odoo ERP data entry and reporting, before moving into digital marketing.";
    return value;
}).superRefine((value, ctx) => {
    const slugs = value.caseStudies.map(x => x.slug);
    if (new Set(slugs).size !== slugs.length)
        ctx.addIssue({ code: "custom", path: ["caseStudies"], message: "Brand slugs must be unique" });
    for (const slug of slugs)
        if (!value.details[slug])
            ctx.addIssue({ code: "custom", path: ["details"], message: `Add story details for ${slug}` });
});
export type PortfolioContent = z.infer<typeof contentSchema>;
export const defaultContent: PortfolioContent = contentSchema.parse({
    profile: { name: "Amr Ahmed Abdelhay", location: "Cairo, Egypt · Open to opportunities", title: "Digital Marketing & Brand Growth Specialist", headline: "I build brands", headlineSecond: "from the ground up.", intro: "connecting strategy, content, paid media, design, sales, and digital execution.", portrait: "/amr-ahmed-abdelhay.jpeg", github: "https://github.com/AmrAbdelhay", about: "With a 2020 degree in Management Information Systems, I bring a business-first lens to creative work. I moved from sales and Odoo-based operations into end-to-end marketing—then expanded into brand design, short-form video, AI-assisted production, Flutter, and e-commerce development." },
    caseStudies, projects, services, experience, stack, aleemDesigns, details, rsWorks, rsDesigns: [
        {
            title: "RS DE1",
            description: "Social media design concept for RS brand storytelling.",
            role: "Graphic design / social creative",
            url: "/work/rs/designs/rs-de-01.jpeg",
            images: [{ image: "/work/rs/designs/rs-de-01.jpeg", label: "RS DE1" }],
        },
        {
            title: "RS DE2",
            description: "Visual creative supporting RS campaign messaging.",
            role: "Graphic design / social creative",
            url: "/work/rs/designs/rs-de-02.jpeg",
            images: [{ image: "/work/rs/designs/rs-de-02.jpeg", label: "RS DE2" }],
        },
        {
            title: "RS DE 3",
            description: "RS design asset for educational social content.",
            role: "Graphic design / social creative",
            url: "/work/rs/designs/rs-de-03.jpeg",
            images: [{ image: "/work/rs/designs/rs-de-03.jpeg", label: "RS DE 3" }],
        },

        {
            title: "DE 4",
            description: "Brand visual developed for the RS content pipeline.",
            role: "Graphic design / social creative",
            url: "/work/rs/designs/rs-de-04.jpeg",
            images: [{ image: "/work/rs/designs/rs-de-04.jpeg", label: "DE 4" }],
        },
        ...newRSDesigns,
    ], brandPlatforms,
});

export function mergePortfolioContent(document: unknown): PortfolioContent {
    const live = document && typeof document === "object" && !Array.isArray(document)
        ? document as Partial<PortfolioContent>
        : {};
    const liveWorks = Array.isArray(live.rsWorks) ? live.rsWorks : [];
    const liveVersion = typeof live.rsWorksVersion === "number" ? live.rsWorksVersion : 0;
    const rsWorks = liveVersion < defaultContent.rsWorksVersion
        ? [...liveWorks, ...defaultContent.rsWorks.filter(item => !liveWorks.some(work => work.id === item.id))]
        : liveWorks;
    const designVersion = typeof live.rsDesignsVersion === "number" ? live.rsDesignsVersion : 0;
    const liveDesigns = Array.isArray(live.rsDesigns) ? live.rsDesigns : defaultContent.rsDesigns;
    const cleanDesigns = liveDesigns.map(work => ({ ...work, images: work.images.filter(picture => !/\/(?:rs-sc-03|SC%203|SC 3|rs-de-05|RS%20DE%205|RS DE 5)\.jpeg(?:[?#]|$)/i.test(picture.image)) })).filter(work => work.images.length > 0);
    const rsDesigns = designVersion < 1 ? [...cleanDesigns, ...defaultContent.rsDesigns.filter(work => !cleanDesigns.some(existing => existing.images.some(picture => work.images.some(candidate => candidate.image === picture.image))))] : cleanDesigns;
    return contentSchema.parse({
        ...defaultContent,
        ...live,
        rsDesignsVersion: Math.max(designVersion, 1),
        rsWorksVersion: Math.max(liveVersion, defaultContent.rsWorksVersion),
        rsWorks,
        nogaDesigns: Array.isArray(live.nogaDesigns) ? live.nogaDesigns : defaultContent.nogaDesigns,
        rsDesigns,
        rsCampaigns: Array.isArray(live.rsCampaigns) && live.rsCampaigns.length > 0 ? live.rsCampaigns : defaultContent.rsCampaigns,
        rsContent: Array.isArray(live.rsContent) && live.rsContent.length > 0 ? live.rsContent : defaultContent.rsContent,
    });
}
