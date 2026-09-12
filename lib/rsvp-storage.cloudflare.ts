import { env } from 'cloudflare:workers';
import type { RSVPRecord } from './rsvp-record';

export function isRSVPConfigured(){return Boolean(env.DB)}
export async function saveRSVP(p: RSVPRecord){
 if(!env.DB) throw new Error('RSVP storage not configured');
 await env.DB.prepare('INSERT INTO rsvps (id,name,attendance,shuttle,diet,message,created_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING')
  .bind(p.id,p.name,p.attendance,p.shuttle,p.diet,p.message,p.created_at).run();
}
