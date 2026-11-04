# Amr Portfolio

البورتفوليو الشخصي لعمرو: أعمال Noga Home وRS وعليم، مع التصميم والمحتوى والفيديو ونتائج الحملات وشغل المواقع والتطبيقات.

- [التكملة من جهاز أو موديل تاني](docs/CONTINUE-AR.md)
- [حالة المشروع وآخر القرارات](docs/HANDOFF.md)
- [تعليمات الموديلات](AGENTS.md)
- [إضافة الأعمال والميديا](CONTENT-GUIDE.md)
- [إعداد الأدمن والمحتوى والرفع](ADMIN-SETUP.md)

المستودع: https://github.com/AmrAbdelhay/portfolio — الفرع `main`.

عنوان مشروع Vercel القائم: https://portfolio-amr-215c.vercel.app

## تشغيل محلي

استخدم Node.js 24، ثم:

```sh
git clone https://github.com/AmrAbdelhay/portfolio.git
cd portfolio
npm ci
npm run dev:local
```

افتح http://127.0.0.1:3000. **المسار الحالي Next.js على Vercel**؛ ملفات Vinext/Sites القديمة ما زالت محفوظة في المستودع ولا تعني نقل الاستضافة إليها. راجع [مرجع القالب القديم](docs/LEGACY-SITES.md) فقط عند العمل على تلك البنية.

## التحقق

```sh
node --test tests/cms.test.mjs
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.next.json
node node_modules/next/dist/bin/next build
```

هذه أوامر مسار Next/Vercel. `npm run build` و`npm test` في package.json الحالي يستهدفان البناء القديم Vinext، فلا تختارهما كإعداد Vercel بدل `npx next build`.

## السورس والمحتوى

المحتوى المضمّن في `app/portfolio-data.ts` والميديا تحت `public/work/`. صفحات الموقع تقرأ المحتوى المنشور من Supabase عند توفره، وترجع للمحتوى المضمّن عند تعذره. تغيير ملف الـfallback وحده لا يضمن استبدال مستند CMS منشور بالفعل.

السورس متاح للتحميل والتكملة بأي أداة تقرأ المستودع. جلسات Vercel وأسرار Cloudinary وملف `.env.local` وبيانات Supabase الحية لا تنتقل في Git. لا تعِد إنشاء قاعدة البيانات أو حساب الأدمن عند تغيير الجهاز.

احفظ التعديلات في commit وpush قبل الانتقال لجهاز آخر، وحدّث ملف الحالة. تحقق من نشر Vercel بشكل منفصل؛ آخر الملاحظات المسجلة تشير لاحتمال طلب تسجيل دخول بسبب حماية النشر.
