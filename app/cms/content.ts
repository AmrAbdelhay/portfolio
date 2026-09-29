import { z } from "zod";
import { caseStudies, projects, services, experience, stack, aleemDesigns } from "../portfolio-data";
import { details } from "./case-details";
import { rsWorks } from "./rs-data";
import { brandPlatforms } from "./social-data";
const text = z.string().max(12000);
const url = text.refine(v => v === "" || (/^\/(?!\/)/.test(v) && !v.includes("\\")) || /^https:\/\//.test(v), "Use an HTTPS link or a local /path");
const metric = z.object({ value: text, label: text });
const chapter = z.object({ number: text, title: text, text, evidence: text });
export const contentSchema = z.object({
    profile: z.object({ name: text.min(1), location: text, title: text, headline: text, headlineSecond: text, intro: text, portrait: url, about: text, github: url }),
    services: z.array(text).max(50),
    caseStudies: z.array(z.object({ name: text.min(1), slug: z.string().regex(/^[a-z0-9-]+$/), monogram: text, image: url, market: text, period: text, role: text, summary: text, tags: z.array(text), accent: z.string().regex(/^#[0-9a-fA-F]{6}$/), assetHint: text, metrics: z.array(metric).default([]), template: z.enum(["standard", "noga", "rs", "aleem"]).optional() }).transform(brand => ({ ...brand, template: brand.template ?? (brand.slug === "noga" || brand.slug === "rs" || brand.slug === "aleem" ? brand.slug : "standard") }))).max(50),
    projects: z.array(z.object({ title: text, short: text, image: url, category: text, description: text, tone: z.enum(["lime", "blue", "orange", "cyan", "violet", "rose", "navy", "gold"]), status: z.enum(["live", "placeholder"]), link: url.default("") })).max(200),
    experience: z.array(z.object({ period: text, role: text, company: text, description: text })).max(50),
    stack: z.array(z.object({ name: text, items: z.array(text) })).max(50),
    aleemDesigns: z.array(z.object({ image: url, label: text })).max(200),
    details: z.record(z.string(), z.object({ headline: text, intro: text, chapters: z.array(chapter) })),
    rsWorks: z.array(z.object({ id: text, title: text, description: text, role: text, badge: z.enum(["Organic", "Organic + Paid"]), views: text, likes: text, comments: text, shares: text, url, note: text, video: url, poster: url })).max(200),
    brandPlatforms: z.record(z.string(), z.array(z.object({ platform: z.enum(["Facebook", "Instagram"]), url }))),
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
    caseStudies, projects, services, experience, stack, aleemDesigns, details, rsWorks, brandPlatforms,
});
