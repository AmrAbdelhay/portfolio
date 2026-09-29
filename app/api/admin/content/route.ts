import { requireAdmin } from "../../../cms/server";
import { contentSchema, defaultContent } from "../../../cms/content";
export const dynamic = "force-dynamic";
function failure(error: unknown) {
    const message = error instanceof Error ? error.message : "Request failed";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return Response.json({ error: status === 500 ? "تعذر الاتصال بقاعدة البيانات. تحقق من الإعدادات والجداول." : "هذا الحساب غير مصرح له بإدارة الموقع." }, { status });
}
export async function GET(request: Request) {
    try {
        const db = await requireAdmin(request);
        const { data, error } = await db.from("portfolio_content").select("document,revision").eq("id", "draft").maybeSingle();
        if (error)
            throw error;
        return Response.json({ document: data?.document ?? defaultContent, revision: data?.revision ?? 0 }, { headers: { "Cache-Control": "no-store" } });
    }
    catch (error) {
        return failure(error);
    }
}
export async function POST(request: Request) {
    try {
        const db = await requireAdmin(request);
        const raw = await request.text();
        if (raw.length > 1000000)
            return Response.json({ error: "المحتوى أكبر من الحد المسموح." }, { status: 413 });
        let body;
        try {
            body = JSON.parse(raw);
        }
        catch {
            return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        if (!body || typeof body !== "object" || Array.isArray(body))
            return Response.json({ error: "صيغة الطلب غير صحيحة." }, { status: 400 });
        const parsed = contentSchema.safeParse(body.document);
        if (!parsed.success || !Number.isSafeInteger(body.revision) || body.revision < 0 || !["save", "publish"].includes(body.action))
            return Response.json({ error: parsed.success ? "Invalid request" : parsed.error.issues.map(x => `${x.path.join(".")}: ${x.message}`).join("\n") }, { status: 400 });
        const { data, error } = await db.rpc("save_portfolio", { content: parsed.data, expected_revision: body.revision, publish_now: body.action === "publish" });
        if (error?.message.includes("REVISION_CONFLICT"))
            return Response.json({ error: "المحتوى اتغير في جلسة أخرى. انسخ تعديلاتك ثم أعد تحميل الصفحة." }, { status: 409 });
        if (error)
            throw error;
        return Response.json({ revision: data });
    }
    catch (error) {
        return failure(error);
    }
}
