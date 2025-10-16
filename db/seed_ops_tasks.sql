
insert into public.ops_tasks(type, payload) values
('va.ws.health','{"check":"initial"}'),
('asr.install_models','{"models":["whisper-base"],"language":"ar-SY"}'),
('ci.smoke','{"endpoints":["/health"],"timeout":30}');
