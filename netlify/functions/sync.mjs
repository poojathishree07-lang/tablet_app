import crypto from "node:crypto";
import {api,base} from "../lib/g.mjs";
export default async (req)=>{
  if(req.method!=="POST")return new Response("no",{status:405});
  let b;try{b=await req.json()}catch{return new Response("bad",{status:400})}
  if(!b.token||typeof b.token!=="string"||b.token.length>400||!Array.isArray(b.meds)||b.meds.length>30)return new Response("bad",{status:400});
  const id=crypto.createHash("sha256").update(b.token).digest("hex");
  const data=JSON.stringify({token:b.token,tz:+b.tz||0,today:String(b.today),meds:b.meds.map(m=>({name:String(m.name).slice(0,60),time:String(m.time).slice(0,5),perDay:+m.perDay||1,stock:+m.stock||0,warn:+m.warn||5,taken:+m.taken||0}))});
  const r=await api(`${base()}/${id}`,{method:"PATCH",body:JSON.stringify({fields:{data:{stringValue:data}}})});
  return new Response(r.ok?"ok":"err",{status:r.ok?200:500});
};
