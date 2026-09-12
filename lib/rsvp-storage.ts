import type { RSVPRecord } from './rsvp-record';

export function isRSVPConfigured(){
 return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function saveRSVP(record: RSVPRecord){
 const url=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url || !key) throw new Error('RSVP storage not configured');
 const endpoint=new URL('/rest/v1/rsvps?on_conflict=id',url);
 if(endpoint.protocol!=='https:') throw new Error('RSVP storage requires HTTPS');
 const response=await fetch(endpoint,{
  method:'POST',
  headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},
  body:JSON.stringify(record),
  cache:'no-store',
  signal:AbortSignal.timeout(10000),
 });
 if(!response.ok) throw new Error(`RSVP storage returned ${response.status}`);
}
