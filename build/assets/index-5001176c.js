import{R as l,f as d,Y as u,y as E}from"./index-84e0b589.js";import{n as S}from"./react-toastify.esm-1ef9dd2a.js";const m={[l]:"RSS link",[d]:"Twitter Handle",[u]:"Youtube channel"},w="Sources table",C="Queued sources",L="Topics",N="View Content",_="date",h="edge_count",y="alphabetically",D="https://twitter.com",f="IS_ALIAS",R="https://www.twitter.com/anyuser/status/",i={data:null,ids:[],total:0,filters:{muted:!1,sortBy:_,page:0,pageSize:50}},O=E((t,c)=>({...i,setTopics:async()=>{const{data:e,ids:p,filters:a}=c(),T=I(a);a.page===0&&t({data:null,ids:[],total:0});try{const s=await S(T),n=a.page===0?{}:{...e||{}},r=a.page===0?[]:[...p];s.data.forEach(o=>{n[o.ref_id]=o,r.push(o.ref_id)}),t({data:n,ids:r,total:s.topicCount})}catch(s){console.log(s)}},setFilters:e=>t({filters:{...c().filters,page:0,...e}}),terminate:()=>t(i)})),I=t=>({muted:t.muted?"True":"False",skip:String(t.page*t.pageSize),limit:String(t.pageSize),sort_by:t.sortBy,search:t.search||""});export{y as A,_ as D,h as E,f as I,C as Q,w as S,D as T,N as V,R as a,L as b,m as s,O as u};
