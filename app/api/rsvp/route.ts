import { saveRSVP, isRSVPConfigured } from '@/lib/rsvp-storage';
import { z } from 'zod';
const schema=z.object({id:z.string().uuid(),name:z.string().trim().min(2).max(150),attendance:z.enum(['yes','no']),shuttle:z.enum(['yes','no']),diet:z.string().max(1000).default(''),message:z.string().max(2000).default(''),website:z.string().max(0).optional()});
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 if(Number(request.headers.get('content-length')||0)>20000)return Response.json({error:'Request too large'},{status:413});
 let payload;try{const raw=await request.text();if(raw.length>10000)return Response.json({error:'Request too large'},{status:413});payload=schema.safeParse(JSON.parse(raw))}catch{return Response.json({error:'Invalid request'},{status:400})}
 if(!payload.success)return Response.json({error:'Please check your reply.'},{status:400});
 const p=payload.data;try{await saveRSVP({id:p.id,name:p.name,attendance:p.attendance,shuttle:p.attendance==='yes'?p.shuttle:'no',diet:p.attendance==='yes'?p.diet:'',message:p.message,created_at:new Date().toISOString()});return Response.json({saved:true},{status:201})}catch(e){console.error('RSVP storage unavailable',e);return Response.json({error:'Your reply could not be saved. Please try again.'},{status:503})}
}

export async function GET(){return Response.json({available:isRSVPConfigured()},{headers:{'Cache-Control':'no-store'}})}
