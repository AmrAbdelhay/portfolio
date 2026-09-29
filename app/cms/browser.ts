import { createClient } from "@supabase/supabase-js";
let client: ReturnType<typeof createClient> | undefined;
export function browserDatabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key)
        throw new Error("إعدادات الاتصال بقاعدة البيانات لم تكتمل بعد.");
    return client ??= createClient(url, key);
}
