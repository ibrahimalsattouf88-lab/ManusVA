
-- Initial Tasks for Manos Agent
INSERT INTO public.ops_tasks (type, payload) VALUES
('va.ws.health', '{"check": "initial"}'),
('asr.install_models', '{"models": ["whisper-base", "vosk-ar"], "language": "ar-SY"}'),
('sec.rls_audit', '{"tables": ["all"], "report_format": "json"}'),
('fx.refresh', '{"sources": 5, "currency": "SYP", "target": "USD"}'),
('analytics.rollup_daily', '{"metrics": ["engagement", "performance"]}'),
('build.apk.release', '{"apps": ["smart-assistant", "control-panel"], "platform": "android"}'),
('handover.generate_brief', '{"format": "PDF", "include": ["setup", "env", "api", "uat"]}'),
('ci.smoke', '{"endpoints": ["all"], "timeout": 30}'),
('backups.verify', '{"type": "full", "test_restore": true}'),
('analytics.behavioral_insights.sync', '{"source": "va_phrase_stats", "period": "last_7_days"}');
