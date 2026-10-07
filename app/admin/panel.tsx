"use client";
import { useEffect, useState } from "react";
import { browserDatabase } from "../cms/browser";
import { contentSchema, type PortfolioContent } from "../cms/content";
import "./style.css";
import { newItem, updateSection, type EditorValue as Value } from "../cms/editing";

const labels: Record<string, string> = { rsDesigns: "RS · التصميمات", nogaDesigns: "Noga · التصميمات", rsCampaigns: "RS · نتائج الحملات", rsContent: "RS · الكونتنت", images: "الصور / شرائح الكاروسيل", objective: "هدف الحملة", format: "نوع المحتوى (كابشن / سكريبت / خطة)", template: "قالب صفحة البراند", profile: "بياناتي", caseStudies: "بيانات البراند", projects: "مكتبة الأعمال", services: "الخدمات", experience: "الخبرات", stack: "الأدوات والمهارات", aleemDesigns: "تصميمات عليم", details: "قصة البراند", rsWorks: "RS · الفيديوهات", brandPlatforms: "روابط التواصل", name: "الاسم", title: "العنوان", description: "الوصف", image: "الصورة", video: "الفيديو", poster: "غلاف الفيديو", portrait: "الصورة الشخصية", url: "الرابط", link: "الرابط", role: "دوري", summary: "نبذة", slug: "اسم الرابط", headline: "العنوان الرئيسي", headlineSecond: "السطر الثاني", intro: "المقدمة", about: "عنّي", location: "الموقع", period: "الفترة", market: "السوق", tags: "التصنيفات", metrics: "النتائج", value: "القيمة", label: "الوصف", chapters: "أقسام القصة", text: "النص", evidence: "الأعمال الداعمة", views: "المشاهدات", likes: "الإعجابات", comments: "التعليقات", shares: "المشاركات", badge: "نوع الوصول", note: "ملاحظة", platform: "المنصة", items: "العناصر", accent: "لون البراند", assetHint: "وصف الهوية", monogram: "الحروف المختصرة", short: "عنوان مختصر", category: "التصنيف", status: "الحالة", tone: "لون البطاقة", company: "الشركة", number: "الرقم", id: "المعرّف", github: "GitHub" };
const choices: Record<string, string[]> = { template: ["standard", "noga", "rs", "aleem"], badge: ["", "Organic", "Organic + Paid", "Results provided"], platform: ["Facebook", "Instagram"], status: ["live", "placeholder"], tone: ["lime", "blue", "orange", "cyan", "violet", "rose", "navy", "gold"] };
const choiceLabels: Record<string, string> = { "": "غير محدد", standard: "قصة براند", noga: "قصة + رابط متجر Noga", rs: "RS · تصميمات وفيديوهات وحملات وكونتنت", aleem: "قصة + تصميمات عليم" };
const assetFields = new Set(["image", "video", "poster", "portrait"]);
const generalKeys: (keyof PortfolioContent)[] = ["profile", "services", "projects", "experience", "stack"];

function AssetEditor({ field, value, change, upload }: { field: string; value: string; change: (v: string) => void; upload: (file: File) => Promise<string> }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [showManual, setShowManual] = useState(false);
    const isVideo = field === "video";
    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const input = e.currentTarget;
        const file = input.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            change(await upload(file));
        } catch (err) {
            setError(err instanceof Error ? err.message : "تعذر الرفع");
        } finally {
            setUploading(false);
            input.value = "";
        }
    }
    return (
        <div className="cms-field cms-asset">
            <span>{labels[field] ?? field}</span>
            {value && (isVideo
                ? <video className="cms-video-preview" src={value} controls preload="metadata" />
                : <img className="cms-preview" src={value} alt="معاينة" />)}
            <div className="cms-asset-actions">
                <label className="cms-upload-btn">
                    {uploading ? "جاري الرفع…" : value ? "تغيير الملف" : "رفع من جهازك"}
                    <input aria-label={`رفع ${labels[field] ?? field}`} type="file" accept={isVideo ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/gif"} disabled={uploading} onChange={handleFile} hidden />
                </label>
                {value && <button type="button" onClick={() => change("")}>إزالة</button>}
                <button type="button" className="cms-link-toggle" onClick={() => setShowManual(s => !s)}>{showManual ? "إخفاء الرابط" : "أو الصق رابط جاهز"}</button>
            </div>
            {error && <small role="alert">{error}</small>}
            {showManual && <input type="text" dir="ltr" placeholder="https://..." value={value} onChange={e => change(e.target.value)} />}
        </div>
    );
}

function Editor({ value, change, field, upload }: {
    value: Value;
    change: (v: Value) => void;
    field: string;
    upload: (file: File) => Promise<string>;
}) {
    if (typeof value === "string") {
        if (assetFields.has(field)) return <AssetEditor field={field} value={value} change={change} upload={upload} />;
        return <label className="cms-field"><span>{labels[field] ?? field}</span>{choices[field] ? <select value={value} onChange={e => change(e.target.value)}>{choices[field].map(v => <option key={v} value={v}>{choiceLabels[v] ?? v}</option>)}</select> : <textarea rows={value.length > 100 ? 4 : 1} dir="auto" value={value} onChange={e => change(e.target.value)} />}</label>;
    }
    if (Array.isArray(value))
        return <div className="cms-array">{value.map((item, index) => <details key={index} open={typeof item === "string"}><summary>{typeof item === "string" ? `${labels[field] ?? field} ${index + 1}` : String((item as Record<string, Value>).title || (item as Record<string, Value>).name || (item as Record<string, Value>).label || `${labels[field] ?? field} ${index + 1}`)}</summary><div className="cms-row-actions"><button type="button" disabled={index === 0} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; change(next); }}>↑</button><button type="button" disabled={index === value.length - 1} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; change(next); }}>↓</button><button type="button" onClick={() => change(value.filter((_, i) => i !== index))}>إزالة من المسودة</button></div><Editor field={field} value={item} upload={upload} change={v => change(value.map((x, i) => i === index ? v : x))} /></details>)}<button type="button" onClick={() => { change([...value, newItem(field, value)]); }}>+ إضافة عنصر</button></div>;
    return <div className="cms-fields">{Object.entries(value).map(([key, item]) => <div key={key}>{typeof item !== "string" && <h3>{labels[key] ?? key}</h3>}<Editor value={item} change={v => change({ ...value, [key]: v })} field={key} upload={upload} /></div>)}</div>;
}

function DesignEditor({ value, change, upload, busy, field, brand }: {
    value: PortfolioContent["rsDesigns"];
    change: (v: PortfolioContent["rsDesigns"]) => void;
    field: "rsDesigns" | "nogaDesigns";
    brand: string;
    upload: (file: File) => Promise<string>;
    busy: boolean;
}) {
    const updateItem = (index: number, patch: Partial<PortfolioContent["rsDesigns"][number]>) => {
        change(value.map((item, i) => i === index ? { ...item, ...patch } : item));
    };
    const updatePrimaryImage = (index: number, image: string) => {
        const current = value[index];
        const nextImage = { ...((current?.images?.[0]) ?? { label: current?.title ?? "Design" }), image, label: current?.title || "Design" };
        updateItem(index, { images: [nextImage] });
    };
    return (
        <div className="cms-rs-design-list">
            {value.map((item, index) => (
                <div className="cms-rs-design-card" key={`${item.title || "design"}-${index}`}>
                    <div className="cms-rs-design-top">
                        <strong>{item.title || `تصميم ${index + 1}`}</strong>
                        <div className="cms-rs-design-actions">
                            <button type="button" disabled={busy || index === 0} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; change(next); }}>↑</button>
                            <button type="button" disabled={busy || index === value.length - 1} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; change(next); }}>↓</button>
                            <button type="button" disabled={busy} onClick={() => change(value.filter((_, i) => i !== index))}>حذف</button>
                        </div>
                    </div>
                    <div className="cms-rs-design-grid">
                        <label className="cms-field"><span>العنوان</span><input value={item.title} onChange={e => updateItem(index, { title: e.target.value })} /></label>
                        <label className="cms-field"><span>الدور</span><input value={item.role} onChange={e => updateItem(index, { role: e.target.value })} /></label>
                        <label className="cms-field"><span>أداة التصميم — تظهر تحت الصورة</span><select value={item.designTool ?? ""} onChange={e => updateItem(index, { designTool: e.target.value })}><option value="">غير محدد</option><option value="Photoshop">Photoshop</option><option value="AI">AI — ذكاء اصطناعي</option><option value="Photoshop + AI">Photoshop + AI</option><option value="Illustrator">Illustrator</option><option value="Canva">Canva</option></select></label>
                        <label className="cms-field"><span>نوع النشر — يظهر فوق الصورة</span><select value={item.reach ?? ""} onChange={e => updateItem(index, { reach: e.target.value as "" | "Ad" | "Organic" })}><option value="">غير محدد</option><option value="Ad">Ad</option><option value="Organic">Organic</option></select></label>
                        <label className="cms-field cms-rs-full"><span>الوصف</span><textarea rows={3} value={item.description} onChange={e => updateItem(index, { description: e.target.value })} /></label>
                        <label className="cms-field cms-rs-full"><span>رابط الصورة / الصفحة</span><input type="text" dir="ltr" value={item.url ?? ""} onChange={e => updateItem(index, { url: e.target.value })} /></label>
                        <div className="cms-rs-full">
                            <AssetEditor field="image" value={item.images?.[0]?.image ?? ""} change={newImage => updatePrimaryImage(index, newImage)} upload={upload} />
                        </div>
                    </div>
                </div>
            ))}
            <button type="button" className="cms-add-brand" disabled={busy} onClick={() => {
                const item = newItem("rsDesigns", value as unknown as Value[]) as unknown as PortfolioContent["rsDesigns"][number];
                change([...value, item]);
            }}>+ إضافة تصميم جديد</button>
        </div>
    );
}

function BrandPage({ slug, content, update, upload, busy, onRemove }: {
    slug: string;
    content: PortfolioContent;
    update: <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => void;
    upload: (file: File) => Promise<string>;
    busy: boolean;
    onRemove: (slug: string) => void;
}) {
    const index = content.caseStudies.findIndex(b => b.slug === slug);
    if (index === -1) return <p>البراند ده اتحذف أو اتغيّر اسم الرابط بتاعه. اختار براند تاني من القايمة.</p>;
    const card = content.caseStudies[index];
    const story = content.details[slug] ?? { headline: "", intro: "", chapters: [] };
    const platforms = content.brandPlatforms[slug] ?? [];
    return (
        <fieldset disabled={busy}>
            <h3>بيانات البراند</h3>
            <Editor field="caseStudies" value={card as unknown as Value} upload={upload} change={v => { const next = content.caseStudies.map((b, i) => i === index ? (v as unknown as typeof b) : b); update("caseStudies", next); }} />
            <h3>قصة البراند</h3>
            <Editor field="details" value={story as unknown as Value} upload={upload} change={v => update("details", { ...content.details, [slug]: v as unknown as typeof story })} />
            <h3>روابط التواصل</h3>
            <Editor field="brandPlatforms" value={platforms as unknown as Value} upload={upload} change={v => update("brandPlatforms", { ...content.brandPlatforms, [slug]: v as unknown as typeof platforms })} />
            {slug === "rs" && <>
                <h3>{labels.rsWorks}</h3>
                <Editor field="rsWorks" value={content.rsWorks as unknown as Value} upload={upload} change={v => update("rsWorks", v as unknown as typeof content.rsWorks)} />
                <h3>{labels.rsDesigns}</h3>
                <DesignEditor field="rsDesigns" brand="RS" value={content.rsDesigns} change={v => update("rsDesigns", v)} upload={upload} busy={busy} />
                <h3>{labels.rsCampaigns}</h3>
                <Editor field="rsCampaigns" value={content.rsCampaigns as unknown as Value} upload={upload} change={v => update("rsCampaigns", v as unknown as typeof content.rsCampaigns)} />
                <h3>{labels.rsContent}</h3>
                <Editor field="rsContent" value={content.rsContent as unknown as Value} upload={upload} change={v => update("rsContent", v as unknown as typeof content.rsContent)} />
            </>}
            {slug === "aleem" && <>
                <h3>{labels.aleemDesigns}</h3>
                <Editor field="aleemDesigns" value={content.aleemDesigns as unknown as Value} upload={upload} change={v => update("aleemDesigns", v as unknown as typeof content.aleemDesigns)} />
            </>}
            {slug === "noga" && <>
                <h3>{labels.nogaDesigns}</h3>
                <DesignEditor field="nogaDesigns" brand="Noga" value={content.nogaDesigns} change={v => update("nogaDesigns", v)} upload={upload} busy={busy} />
            </>}
            <div className="cms-danger">
                <button type="button" onClick={() => onRemove(slug)}>حذف البراند ده نهائيًا</button>
            </div>
        </fieldset>
    );
}

export default function Admin() {
    const [content, setContent] = useState<PortfolioContent | null>(null);
    const [savedContent, setSavedContent] = useState<PortfolioContent | null>(null);
    const [section, setSection] = useState<string>("profile");
    const [revision, setRevision] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signedIn, setSignedIn] = useState(false);
    const [busy, setBusy] = useState(true);
    const [dirty, setDirty] = useState(false);
    const [message, setMessage] = useState("");
    async function request(path: string, options: RequestInit = {}) { const { data: { session } } = await browserDatabase().auth.getSession(); if (!session)
        throw new Error("سجّل الدخول أولًا."); const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` } }); const data = await response.json(); if (!response.ok)
        throw new Error(data.error ?? "تعذر إتمام الطلب"); return data; }
    async function load() { const data = await request("/api/admin/content"); const document = contentSchema.parse(data.document); setContent(document); setSavedContent(document); setRevision(data.revision); setDirty(false); }
    async function retryLoad() {
        setBusy(true); setMessage("");
        try { await load(); }
        catch (error) { setMessage(error instanceof Error ? error.message : "تعذر التحميل"); }
        finally { setBusy(false); }
    }
    function discard() {
        if (savedContent && window.confirm("استرجاع آخر مسودة محفوظة؟ التغييرات غير المحفوظة هتتلغي.")) {
            setContent(structuredClone(savedContent)); setDirty(false); setMessage("تم استرجاع آخر مسودة محفوظة.");
        }
    }
    function update<K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) {
        setContent(previous => previous ? updateSection(previous, key, value as unknown as Value) : previous);
        setDirty(true);
    }
    function removeBrand(slug: string) {
        if (!content) return;
        if (!window.confirm("حذف البراند ده نهائيًا من المسودة؟ هتقدر تسترجعه بزرار «استرجاع المحفوظ» لحد ما تنشر.")) return;
        update("caseStudies", content.caseStudies.filter(b => b.slug !== slug));
        setSection("profile");
    }
    function addBrand() {
        if (!content) return;
        const item = newItem("caseStudies", content.caseStudies as unknown as Value[]) as unknown as typeof content.caseStudies[number];
        update("caseStudies", [...content.caseStudies, item]);
        setSection(`brand:${item.slug}`);
    }
    useEffect(() => { let active = true; async function init() { try {
        const { data: { session } } = await browserDatabase().auth.getSession();
        if (!active)
            return;
        if (session) {
            setSignedIn(true);
            await load();
        }
    }
    catch (error) {
        if (active)
            setMessage(error instanceof Error ? error.message : "تعذر التحميل");
    }
    finally {
        if (active)
            setBusy(false);
    } } void init(); return () => { active = false; }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => { const warn = (e: BeforeUnloadEvent) => { if (dirty) {
        e.preventDefault();
        e.returnValue = "";
    } }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
    async function save(action: "save" | "publish") { setBusy(true); setMessage(""); try {
        const data = await request("/api/admin/content", { method: "POST", body: JSON.stringify({ document: content, revision, action }) });
        setRevision(data.revision);
        setSavedContent(content);
        setDirty(false);
        setMessage(action === "publish" ? "تم النشر. المحتوى الجديد ظاهر على الموقع." : "تم حفظ المسودة. الموقع المنشور لم يتغير.");
    }
    catch (error) {
        setMessage(error instanceof Error ? error.message : "تعذر الحفظ");
    }
    finally {
        setBusy(false);
    } }
    async function upload(file: File) { setBusy(true); try {
        if (!["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"].includes(file.type))
            throw new Error("نوع الملف غير مدعوم.");
        if (file.size > (file.type.startsWith("video/") ? 100 : 10) * 1024 * 1024)
            throw new Error("الحد الأقصى: 10 ميجابايت للصورة و100 ميجابايت للفيديو.");
        const signed = await request("/api/admin/upload", { method: "POST" });
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", signed.apiKey);
        form.append("signature", signed.signature);
        for (const [k, v] of Object.entries(signed.params))
            form.append(k, String(v));
        const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/${file.type.startsWith("video/") ? "video" : "image"}/upload`, { method: "POST", body: form });
        const data = await response.json();
        if (!response.ok)
            throw new Error(data.error?.message ?? "تعذر رفع الملف");
        return data.secure_url as string;
    }
    finally {
        setBusy(false);
    } }
    const sectionLabel = section.startsWith("brand:") ? (content?.caseStudies.find(b => `brand:${b.slug}` === section)?.name ?? "براند") : (labels[section] ?? section);
    return <main className="cms" dir="rtl" lang="ar"><header><div><span className="cms-kicker">AMR / PORTFOLIO</span><h1>إدارة المحتوى</h1><p>كل أعمالك، من مكان واحد.</p></div><a href="/" target="_blank" rel="noreferrer">عرض الموقع ↗</a></header>{message && <p role="status" className="cms-message">{message}</p>}{!signedIn ? <form className="cms-login" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setMessage(""); try {
        const { error } = await browserDatabase().auth.signInWithPassword({ email, password });
        if (error)
            throw new Error("تعذر الدخول. راجع البريد وكلمة المرور.");
        setPassword("");
        setSignedIn(true);
        await load();
    }
    catch (error) {
        setMessage(error instanceof Error ? error.message : "تعذر الدخول");
    }
    finally {
        setBusy(false);
    } }}><h2>تسجيل دخول الأدمن</h2><label>البريد الإلكتروني<input type="email" required autoComplete="username" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} /></label><label>كلمة المرور<input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy}>{busy ? "جاري التحقق…" : "دخول"}</button></form> : <><div className="cms-toolbar"><span>{!content ? "لم يتم تحميل المحتوى" : dirty ? "تغييرات غير محفوظة" : "المسودة محفوظة"}</span><button disabled={busy || !content} onClick={() => save("save")}>حفظ المسودة</button><button className="cms-publish" disabled={busy || !content} onClick={() => save("publish")}>نشر على الموقع</button><button disabled={busy || !dirty} onClick={discard}>استرجاع المحفوظ</button><button disabled={busy || dirty} onClick={async () => { setBusy(true); try { const { error } = await browserDatabase().auth.signOut(); if (error) throw error; setSignedIn(false); setContent(null); setSavedContent(null); setMessage(""); } catch { setMessage("تعذر تسجيل الخروج. حاول مرة أخرى."); } finally { setBusy(false); } }}>خروج</button></div>{!content && <button disabled={busy} onClick={retryLoad}>إعادة تحميل المحتوى</button>}{content && <div className="cms-layout"><nav aria-label="أقسام المحتوى"><span className="cms-nav-heading">عام</span>{generalKeys.map(key => <button key={key} disabled={busy} aria-current={section === key ? "page" : undefined} onClick={() => setSection(key)}>{labels[key] ?? key}</button>)}<span className="cms-nav-heading">البراندات</span>{content.caseStudies.map(b => <button key={b.slug} disabled={busy} aria-current={section === `brand:${b.slug}` ? "page" : undefined} onClick={() => setSection(`brand:${b.slug}`)}>{b.name || b.slug}</button>)}<button disabled={busy} className="cms-add-brand" onClick={addBrand}>+ إضافة براند جديد</button></nav><section><h2>{sectionLabel}</h2><p className="cms-help">عدّل المحتوى واحفظه كمسودة. اضغط «نشر على الموقع» لما تكون جاهز لعرض التعديلات للزوار.</p>{section.startsWith("brand:") ? <BrandPage slug={section.slice(6)} content={content} update={update} upload={upload} busy={busy} onRemove={removeBrand} /> : <fieldset disabled={busy}><Editor key={section} field={section} value={content[section as keyof PortfolioContent] as unknown as Value} upload={upload} change={value => update(section as keyof PortfolioContent, value as unknown as PortfolioContent[keyof PortfolioContent])} /></fieldset>}</section></div>}</>}</main>;
}
