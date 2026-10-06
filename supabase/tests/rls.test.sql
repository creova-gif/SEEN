-- RLS / limits / deletion tests. Run by supabase/tests/run.sh against local Postgres.
\set ON_ERROR_STOP on
create schema t;
create function t.expect_fail(sql text, label text) returns void language plpgsql as $$
begin
  begin execute sql; exception when others then return; end;
  raise exception 'FAIL (expected error): %', label;
end $$;
create function t.eq(a anyelement, b anyelement, label text) returns void language plpgsql as $$
begin if a is distinct from b then raise exception 'FAIL: % (got %, want %)', label, a, b; end if; end $$;
grant usage on schema t to anon, authenticated;
grant execute on all functions in schema t to anon, authenticated;

insert into auth.users (id) values
 ('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000b'),
 ('00000000-0000-0000-0000-00000000000c'),('00000000-0000-0000-0000-00000000000d');
-- profiles are created as each user (a=creator author, b=reader, c=moderator (set by service), d=blocked reader)
create function t.as_user(u text) returns void language plpgsql as $$
begin perform set_config('request.jwt.claim.sub', u, false); end $$;

set role authenticated;
select t.as_user('00000000-0000-0000-0000-00000000000a'); insert into profiles(id, display_name) values ('00000000-0000-0000-0000-00000000000a','Author');
select t.as_user('00000000-0000-0000-0000-00000000000b'); insert into profiles(id, display_name) values ('00000000-0000-0000-0000-00000000000b','Reader');
select t.as_user('00000000-0000-0000-0000-00000000000c'); insert into profiles(id, display_name) values ('00000000-0000-0000-0000-00000000000c','Mod');
select t.as_user('00000000-0000-0000-0000-00000000000d'); insert into profiles(id, display_name) values ('00000000-0000-0000-0000-00000000000d','Blocked');
-- forged identity and role writes
select t.expect_fail($$insert into profiles(id) values ('00000000-0000-0000-0000-00000000000a')$$, 'forged profile id');
select t.expect_fail($$update profiles set role='admin' where id='00000000-0000-0000-0000-00000000000d'$$, 'client role write');
select t.expect_fail($$insert into profiles(id, role) values (gen_random_uuid(),'admin')$$, 'insert with role');
reset role;
update profiles set role = 'moderator' where id = '00000000-0000-0000-0000-00000000000c'; -- service path

-- stories: client cannot supply ids; drafts are private; removed are hidden
set role authenticated; select t.as_user('00000000-0000-0000-0000-00000000000a');
select t.expect_fail($$insert into stories(id,author_id,title) values ('curated-1','00000000-0000-0000-0000-00000000000a','x')$$, 'client story id');
select t.expect_fail($$insert into stories(author_id,title) values ('00000000-0000-0000-0000-00000000000b','x')$$, 'forged author');
insert into stories(author_id,title,status,published_at,languages) values ('00000000-0000-0000-0000-00000000000a','Pub','published',now(),'{en}');
insert into stories(author_id,title) values ('00000000-0000-0000-0000-00000000000a','Draft');
select t.eq((select count(*) from stories)::int, 2, 'author sees own');
select t.eq((select id like 'db\_%' from stories where title='Pub'), true, 'db_ prefix');
select t.as_user('00000000-0000-0000-0000-00000000000b');
select t.eq((select count(*) from stories)::int, 1, 'reader sees published only');
reset role; set role anon; select t.eq((select count(*) from public_stories)::int, 1, 'anon preview view');
select t.expect_fail($$insert into stories(author_id,title) values ('00000000-0000-0000-0000-00000000000a','x')$$, 'anon write');
reset role;

-- notes
create temp table ctx as select id as sid from stories where title='Pub';
grant select on ctx to authenticated;
set role authenticated; select t.as_user('00000000-0000-0000-0000-00000000000b');
insert into notes(story_id, sender_id, body) select sid, '00000000-0000-0000-0000-00000000000b', 'Thank you' from ctx;
select t.expect_fail($$insert into notes(story_id, sender_id, body) select sid, '00000000-0000-0000-0000-00000000000b', 'again' from ctx$$, 'one note per hour');
select t.expect_fail($$insert into notes(story_id, sender_id, body) select sid, '00000000-0000-0000-0000-00000000000a', 'forged' from ctx$$, 'forged sender');
select t.expect_fail($$insert into notes(story_id, sender_id, body, creator_id) select sid, '00000000-0000-0000-0000-00000000000b', 'x', '00000000-0000-0000-0000-00000000000b' from ctx$$, 'client creator_id');
select t.as_user('00000000-0000-0000-0000-00000000000c'); select t.eq((select count(*) from notes)::int, 0, 'third party sees no notes');
select t.as_user('00000000-0000-0000-0000-00000000000a'); select t.eq((select count(*) from notes)::int, 1, 'creator sees note');
-- block then note
insert into blocks values ('00000000-0000-0000-0000-00000000000a','00000000-0000-0000-0000-00000000000d');
select t.as_user('00000000-0000-0000-0000-00000000000d');
select t.expect_fail($$insert into notes(story_id, sender_id, body) select sid, '00000000-0000-0000-0000-00000000000d', 'hi' from ctx$$, 'blocked sender');
select t.expect_fail($$insert into notes(story_id, sender_id, body) select sid, '00000000-0000-0000-0000-00000000000d', repeat('x',501) from ctx$$, 'over 500 chars');
select t.as_user('00000000-0000-0000-0000-00000000000a'); delete from notes; select t.eq((select count(*) from notes)::int, 0, 'creator deletes note');
reset role;

-- reports: one open per target, hidden from reported creator, moderator resolves with audit
set role authenticated; select t.as_user('00000000-0000-0000-0000-00000000000b');
insert into reports(reporter_id,target_type,target_id,reason) values ('00000000-0000-0000-0000-00000000000b','creator','kira','spam');
select t.expect_fail($$insert into reports(reporter_id,target_type,target_id,reason) values ('00000000-0000-0000-0000-00000000000b','creator','kira','spam')$$, 'duplicate open report');
select t.expect_fail($$insert into reports(reporter_id,target_type,target_id,reason,status) values ('00000000-0000-0000-0000-00000000000b','creator','x','spam','dismissed')$$, 'preset status');
select t.as_user('00000000-0000-0000-0000-00000000000a'); select t.eq((select count(*) from reports)::int, 0, 'reported creator cannot read reports');
select t.as_user('00000000-0000-0000-0000-00000000000b'); select t.expect_fail($$select resolve_report((select id from reports limit 1),'dismissed')$$, 'non-staff resolve');
select t.as_user('00000000-0000-0000-0000-00000000000c');
select resolve_report((select id from reports limit 1),'action_taken');
select t.eq((select status from reports limit 1), 'action_taken', 'moderator resolved');
select t.eq((select count(*) from audit_log)::int, 1, 'audit row written');
select t.expect_fail($$update reports set status='open'$$, 'direct report update');
select t.as_user('00000000-0000-0000-0000-00000000000b'); select t.eq((select count(*) from audit_log)::int, 0, 'audit hidden from non-staff');
reset role;

-- deletion: author deletes account; stories, notes gone; report retained and anonymised
set role authenticated; select t.as_user('00000000-0000-0000-0000-00000000000b'); select delete_my_account();
reset role;
select t.eq((select count(*) from profiles where id='00000000-0000-0000-0000-00000000000b')::int, 0, 'profile deleted');
select t.eq((select reporter_id is null from reports limit 1), true, 'report anonymised, retained');
set role authenticated; select t.as_user('00000000-0000-0000-0000-00000000000a'); select delete_my_account(); select delete_my_account();
reset role;
select t.eq((select count(*) from stories)::int, 0, 'stories cascade');
select 'ALL RLS TESTS PASSED';
