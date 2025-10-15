# تقرير التحقق من المهام - Manos Agent

## المهام المطلوبة حسب الملفات المرسلة

### 1. VA E2E Tasks
- ✅ `va.ws.health` - فحص صحة WebSocket
- ✅ `va.cmd.replay` - إعادة تشغيل الأوامر الفاشلة

### 2. ASR Tasks
- ✅ `asr.install_models` - تثبيت نماذج ASR (whisper.cpp/Vosk)
- ✅ `asr.switch_offline_on_fail` - التبديل إلى وضع Offline عند فشل الشبكة

### 3. Analytics Tasks
- ✅ `analytics.rollup_daily` - تجميع التحليلات اليومية
- ✅ `analytics.behavioral_insights.sync` - مزامنة رؤى السلوك

### 4. FX (Foreign Exchange) Tasks
- ✅ `fx.refresh` - تحديث أسعار السوق السوداء للدولار
- ✅ `fx.validate_anomalies` - التحقق من الشذوذات في البيانات

### 5. Security Tasks
- ✅ `sec.rls_audit` - تدقيق سياسات RLS
- ✅ `sec.service_paths.lint` - فحص مسارات الخدمة للأمان

### 6. CI/CD Tasks
- ✅ `ci.smoke` - اختبارات Smoke بعد النشر
- ✅ `ci.uat_report` - تقرير UAT
- ✅ `ci.rollback_on_fail` - التراجع عند الفشل

### 7. Build Tasks
- ✅ `build.apk.release` - بناء APK للإصدار

### 8. Handover Tasks
- ✅ `handover.generate_brief` - توليد وثائق التسليم

### 9. Accounting Tasks
- ✅ `accounting.add_purchase` - إضافة مشتريات إلى النظام المحاسبي

## الحالة النهائية

**جميع المهام المطلوبة موجودة ومسجلة في Manos Agent ✅**

### المهام الإضافية المطلوبة (من الملفات)

بناءً على مراجعة الملفات المرسلة، هناك بعض المهام الإضافية التي لم تُذكر صراحةً لكن يمكن إضافتها:

- `backups.verify` - التحقق من النسخ الاحتياطية (مذكور في الملف لكن غير مضاف)

## التوصيات

1. **إضافة مهمة `backups.verify`** لاكتمال النظام
2. **إنشاء مهام دورية (Cron Jobs)** لتشغيل المهام التلقائية مثل:
   - `fx.refresh` كل ساعة
   - `analytics.rollup_daily` يوميًا
   - `backups.verify` أسبوعيًا

## الملفات الرئيسية

1. **manos-agent.mjs** - الوكيل الذي ينفذ المهام
2. **apps/va-server/src/routes/ops.ts** - نقاط النهاية للمهام
3. **apps/va-server/src/server.ts** - الخادم الرئيسي
4. **supabase_fixes.sql** - جدول ops_tasks

## الخطوات التالية

1. ✅ رفع الكود إلى GitHub (تم)
2. ⏳ إنشاء مهام أولية في قاعدة البيانات
3. ⏳ تشغيل النظام واختباره
4. ⏳ كتابة التقرير النهائي

