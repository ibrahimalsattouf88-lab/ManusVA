-- Initial Tasks for Manos Agent
-- هذه المهام الأولية لبدء تشغيل نظام الأتمتة

-- 1. VA Health Check
INSERT INTO public.ops_tasks (type, payload) VALUES
('va.ws.health', '{"check": "initial", "timestamp": "2025-10-15T00:00:00Z"}');

-- 2. Install ASR Models
INSERT INTO public.ops_tasks (type, payload) VALUES
('asr.install_models', '{"models": ["whisper-base", "vosk-ar"], "language": "ar-SY"}');

-- 3. Security Audit
INSERT INTO public.ops_tasks (type, payload) VALUES
('sec.rls_audit', '{"tables": ["all"], "report_format": "json"}');

-- 4. FX Refresh (Initial)
INSERT INTO public.ops_tasks (type, payload) VALUES
('fx.refresh', '{"sources": 5, "currency": "SYP", "target": "USD"}');

-- 5. Analytics Rollup
INSERT INTO public.ops_tasks (type, payload) VALUES
('analytics.rollup_daily', '{"date": "2025-10-15", "metrics": ["engagement", "performance"]}');

-- 6. Build APK Release
INSERT INTO public.ops_tasks (type, payload) VALUES
('build.apk.release', '{"apps": ["smart-assistant", "control-panel"], "platform": "android"}');

-- 7. Generate Handover Documentation
INSERT INTO public.ops_tasks (type, payload) VALUES
('handover.generate_brief', '{"format": "PDF", "include": ["setup", "env", "api", "uat"]}');

-- 8. CI Smoke Tests
INSERT INTO public.ops_tasks (type, payload) VALUES
('ci.smoke', '{"endpoints": ["all"], "timeout": 30}');

-- 9. Verify Backups
INSERT INTO public.ops_tasks (type, payload) VALUES
('backups.verify', '{"type": "full", "test_restore": true}');

-- 10. Behavioral Insights Sync
INSERT INTO public.ops_tasks (type, payload) VALUES
('analytics.behavioral_insights.sync', '{"source": "va_phrase_stats", "period": "last_7_days"}');

