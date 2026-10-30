import crypto from "node:crypto";
const SA=()=>JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
let cache;
export async function token(){
  if(cache&&cache.exp>Date.now()+60000)return cache.t;
  const sa=SA(),now=Math.floor(Date.now()/1000);
  const b=o=>Buffer.from(JSON.stringify(o)).toString("base64url");
  const u=b({alg:"RS256",typ:"JWT"})+"."+b({iss:sa.client_email,scope:"https://www.googleapis.com/auth/cloud-platform",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600});
  const sig=crypto.createSign("RSA-SHA256").update(u).sign(sa.private_key,"base64url");
  const r=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion="+u+"."+sig});
  const j=await r.json();cache={t:j.access_token,exp:Date.now()+3500000};return cache.t;
}
export const pid=()=>SA().project_id;
export const base=()=>`https://firestore.googleapis.com/v1/projects/${pid()}/databases/(default)/documents/devices`;
export async function api(url,opt={}){const t=await token();return fetch(url,{...opt,headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"}})}
