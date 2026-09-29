import { createHash, randomUUID } from "node:crypto";
import { requireAdmin } from "../../../cms/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
    try {
        await requireAdmin(request);
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const secret = process.env.CLOUDINARY_API_SECRET;
        if (!cloudName || !apiKey || !secret)
            return Response.json({ error: "ربط Cloudinary لم يكتمل بعد." }, { status: 503 });
        const params = { overwrite: "false", public_id: `amr-portfolio/${randomUUID()}`, timestamp: Math.floor(Date.now() / 1000).toString() };
        const signature = createHash("sha256").update(Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("&") + secret).digest("hex");
        return Response.json({ cloudName, apiKey, params, signature }, { headers: { "Cache-Control": "no-store" } });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "";
        const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 503;
        return Response.json({ error: status === 503 ? "تعذر الاتصال بخدمة الرفع. حاول مرة أخرى." : "غير مصرح برفع الملفات." }, { status });
    }
}
