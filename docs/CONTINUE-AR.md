# تكمل البورتفوليو من أي جهاز أو موديل

بعد تثبيت Git وNode.js 24:

```sh
git clone https://github.com/AmrAbdelhay/portfolio.git
cd portfolio
npm ci
npm run dev:local
```

افتح http://127.0.0.1:3000 وافتح مجلد المشروع كله في أداة البرمجة. لو الأداة سحابية اختر مستودع `AmrAbdelhay/portfolio` وفرع `main`. قول للموديل يقرأ `AGENTS.md` و`docs/HANDOFF.md` قبل ما يبدأ، وبعدين اكتب التعديل الجديد.

## البيانات والإعدادات

الأعمال العامة والميديا ضمن السورس، لكن محتوى CMS المنشور في Supabase ممكن يكون أحدث من بيانات الـfallback في `app/portfolio-data.ts`. بيانات الدخول والمفاتيح مش بتنتقل مع clone. المعاينة العامة تقدر تستخدم المحتوى المضمّن؛ تجربة الأدمن والرفع تحتاج إعداداتك المصرح بها في `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=<existing project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<existing publishable key>
CLOUDINARY_CLOUD_NAME=<existing cloud name>
CLOUDINARY_API_KEY=<existing API key>
CLOUDINARY_API_SECRET=<existing server-only secret>
```

دي أسماء ومكان إعدادات فقط؛ لا تنسخ علامات `<...>` باعتبارها قيمًا صالحة ولا ترفع ملف البيئة إلى GitHub. راجع `ADMIN-SETUP.md` للإعداد القائم. لا تنشئ مستخدمًا جديدًا أو تعيد ترحيلات Supabase أو تغيّر كلمة المرور لمجرد الانتقال لجهاز تاني.

## التحقق وحفظ الشغل

قبل التعديل اعمل `git status` و`git pull --ff-only` لو مفيش تغييرات معلقة. بعد تعديل فعلي شغّل:

```sh
node --test tests/cms.test.mjs
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.next.json
node node_modules/next/dist/bin/next build
```

بعدها اعمل commit وpush للتغييرات وحدّث ملف الحالة، عشان الجهاز أو الموديل التالي يستلم الشغل كاملًا.

## النشر

الموقع الحالي على Vercel. إعداد البناء المطلوب `npx next build`؛ أوامر `npm run build` و`npm test` الحالية تخص مسار Sites/Vinext القديم. حافظ على ربط Vercel بالمستودع وإعدادات البيئة الحالية، وتحقق من حالة النشر بعد push. لو الرابط يطلب دخول Vercel، راجع حماية النشر مع المالك؛ ده مش مبرر لتغيير الحماية تلقائيًا أو إنشاء استضافة جديدة.
