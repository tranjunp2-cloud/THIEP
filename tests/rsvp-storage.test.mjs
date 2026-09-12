import test from 'node:test';
import assert from 'node:assert/strict';
import { saveRSVP, isRSVPConfigured } from '../lib/rsvp-storage.ts';

const record={id:'e3a96c93-7777-4bfd-a35d-69e9f6f348ec',name:'Test Guest',attendance:'yes',shuttle:'no',diet:'',message:'',created_at:'2026-09-12T00:00:00.000Z'};
function configure(t){
 const saved={url:process.env.SUPABASE_URL,key:process.env.SUPABASE_SERVICE_ROLE_KEY};
 process.env.SUPABASE_URL='https://test-project.supabase.co';
 process.env.SUPABASE_SERVICE_ROLE_KEY='test-only-server-key';
 t.after(()=>{
  if(saved.url===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=saved.url;
  if(saved.key===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=saved.key;
 });
}
test('missing configuration never reports a successful save',async t=>{
 configure(t);delete process.env.SUPABASE_SERVICE_ROLE_KEY;
 const fetchMock=t.mock.method(globalThis,'fetch',()=>{throw Error('Must not call network')});
 assert.equal(isRSVPConfigured(),false);
 await assert.rejects(saveRSVP(record),/not configured/);
 assert.equal(fetchMock.mock.callCount(),0);
});
test('saves through server-only REST with idempotent duplicate handling',async t=>{
 configure(t);
 t.mock.method(globalThis,'fetch',async(url,options)=>{
  assert.equal(url.toString(),'https://test-project.supabase.co/rest/v1/rsvps?on_conflict=id');
  assert.equal(options.headers.Prefer,'resolution=ignore-duplicates,return=minimal');
  assert.equal(options.headers.Authorization,'Bearer test-only-server-key');
  assert.equal(options.cache,'no-store');
  assert.deepEqual(JSON.parse(options.body),record);
  return new Response(null,{status:201});
 });
 assert.equal(isRSVPConfigured(),true);
 await saveRSVP(record);
});
test('database failure cannot be mistaken for success',async t=>{
 configure(t);t.mock.method(globalThis,'fetch',async()=>new Response(null,{status:403}));
 await assert.rejects(saveRSVP(record),/403/);
});
test('service credentials are never sent to an insecure endpoint',async t=>{
 configure(t);process.env.SUPABASE_URL='http://example.com';
 const fetchMock=t.mock.method(globalThis,'fetch',()=>{throw Error('Must not call network')});
 await assert.rejects(saveRSVP(record),/requires HTTPS/);
 assert.equal(fetchMock.mock.callCount(),0);
});
