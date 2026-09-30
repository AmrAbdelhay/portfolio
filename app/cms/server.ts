import { createClient } from "@supabase/supabase-js";
import { contentSchema, defaultContent } from "./content";
export function database(token?: string) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key)
        throw new Error("Supabase connection is not configured");
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: token ? { Authorization: `Bearer ${token}` } : {}, fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) } });
}
export async function publishedContent() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
        return defaultContent;
    try {
        const { data, error } = await database().from("portfolio_content").select("document").eq("id", "published").maybeSingle();
        if (error)
            throw error;
        if (!data)
            return defaultContent;
        const live = data.document ?? {};
        const merged = {
            ...defaultContent,
            ...live,
            nogaDesigns: Array.isArray(live.nogaDesigns) ? live.nogaDesigns : defaultContent.nogaDesigns,
            rsDesigns: Array.isArray(live.rsDesigns) && live.rsDesigns.length > 0 ? live.rsDesigns : defaultContent.rsDesigns,
            rsCampaigns: Array.isArray(live.rsCampaigns) && live.rsCampaigns.length > 0 ? live.rsCampaigns : defaultContent.rsCampaigns,
            rsContent: Array.isArray(live.rsContent) && live.rsContent.length > 0 ? live.rsContent : defaultContent.rsContent,
        };
        return contentSchema.parse(merged);
    }
    catch {
        console.error("Published portfolio content unavailable; using bundled content.");
        return defaultContent;
    }
}
export async function requireAdmin(request: Request) {
    const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
    if (!token)
        throw new Error("UNAUTHORIZED");
    const db = database(token);
    const { data: { user }, error } = await db.auth.getUser(token);
    if (error && (error.name === "AuthRetryableFetchError" || !error.status || error.status >= 500))
        throw new Error("DATABASE_UNAVAILABLE");
    if (error || !user)
        throw new Error("UNAUTHORIZED");
    const { data: member, error: denied } = await db.from("portfolio_admins").select("user_id").eq("user_id", user.id).maybeSingle();
    if (denied)
        throw new Error("DATABASE_UNAVAILABLE");
    if (!member)
        throw new Error("FORBIDDEN");
    return db;
}
