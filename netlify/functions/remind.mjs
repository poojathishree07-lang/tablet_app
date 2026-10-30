import {api,base,pid} from "../lib/g.mjs";
export const config={schedule:"* * * * *"};
export default async()=>{
  const r=await api(base()+"?pageSize=300");const j=await r.json();
  for(const d of j.documents||[]){
    let x;try{x=JSON.parse(d.fields.data.stringValue)}catch{continue}
    const l=new Date(Date.now()-x.tz*60000);
    const today=l.getUTCFullYear()+"-"+(l.getUTCMonth()+1)+"-"+l.getUTCDate();
    const nm=l.getUTCHours()*60+l.getUTCMinutes();
    for(const m of x.meds){
      const p=m.time.split(":"),due=+p[0]*60+ +p[1];
      const taken=x.today===today?m.taken:0;
      if(taken>=m.perDay)continue;
      if(![0,30,60].includes(nm-due))continue;
      const days=Math.floor(m.stock/m.perDay);
      let body="Did you take "+m.name+"?";
      if(m.stock<=0)body+=" It has run out. Please buy more.";
      else if(days<=m.warn)body+=" Only "+m.stock+" left. Time to buy more.";
      const s=await api(`https://fcm.googleapis.com/v1/projects/${pid()}/messages:send`,{method:"POST",body:JSON.stringify({message:{token:x.token,data:{title:"Time for your tablet",body}}})});
      if(s.status===404){await api(d.name.startsWith("http")?d.name:"https://firestore.googleapis.com/v1/"+d.name,{method:"DELETE"});break}
    }
  }
  return new Response("done");
};
