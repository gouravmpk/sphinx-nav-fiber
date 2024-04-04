import{s as h,b as f,g as I,r as p,j as e,F as o,T as u,h as v,ai as G,C as V,v as q,q as J,e as U,a5 as K}from"./index-22bb82b0.js";import{aI as Y,B as y,aJ as H,t as Q,F as W,aK as X}from"./react-toastify.esm-d7a5a863.js";import{B as Z}from"./index-5b70e3ee.js";import{a as k}from"./index-d809959b.js";import{u as ee}from"./index-b9edae37.js";import{C as te}from"./CheckIcon-7910acd9.js";import{T as N}from"./index-35bc9e01.js";import{A as oe}from"./index-9e2579be.js";import"./index-7d6079dc.js";import"./index.esm-72cd64c8.js";import"./InfoIcon-e7d8de4d.js";import"./Popover-2be10f69.js";import"./useSlotProps-20bf7be8.js";import"./Select-8e9df3b6.js";import"./Stack-bc82b61f.js";import"./Popper-da103d7e.js";const ne=({onClick:n,loading:a})=>{const i=I(l=>l.budget),[c,d]=p.useState(10),r="node";return p.useEffect(()=>{(async()=>{try{const t=await H(r);d(t.data.price)}catch(t){console.error("cannot fetch",t)}})()},[r]),e.jsxs(o,{children:[e.jsx(o,{align:"center",direction:"row",justify:"space-between",mb:20,children:e.jsx(o,{align:"center",direction:"row",children:e.jsx(ae,{children:"Approve Cost"})})}),e.jsxs(o,{align:"center",direction:"row",justify:"space-between",mb:20,children:[e.jsxs(se,{children:[e.jsx("div",{className:"title",children:"COST"}),e.jsxs("div",{className:"value","data-testid":"check-price",children:[c," sats"]})]}),e.jsxs(re,{children:[e.jsx("div",{className:"title",children:"BUDGET"}),e.jsxs("div",{className:"value",children:[Y(i)," sats"]})]})]}),e.jsx(o,{children:e.jsx(y,{color:"secondary","data-testid":"check-icon",disabled:a,onClick:n,size:"large",startIcon:e.jsx(te,{}),type:"submit",variant:"contained",children:"Approve"})})]})},se=h(o).attrs({direction:"column",align:"space-between",justify:"flex-start"})`
  width: 141px;
  height: 61px;
  border: 1px solid ${f.GRAY7};
  border-radius: 6px;
  padding: 16px;
  .title {
    font-family: Barlow;
    color: ${f.secondaryText4};
    font-size: 11px;
    font-style: normal;
    font-weight: 600;
  }

  .value {
    font-family: Barlow;
    color: ${f.white};
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
  }
`,re=h(o).attrs({direction:"column",align:"space-between",justify:"flex-start"})`
  color: ${f.secondaryText4};
  .title {
    font-family: Barlow;
    font-size: 11px;
    font-style: normal;
    font-weight: 600;
  }

  .value {
    font-family: Barlow;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
`,ae=h(u)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`,ie=({type:n,onNextStep:a,onPrevStep:i,name:c,sourceLink:d})=>{const r=n==="Image"?c&&d:c;return e.jsxs(o,{children:[e.jsx(o,{align:"center",direction:"row",justify:"space-between",mb:18,children:e.jsx(o,{align:"center",direction:"row",children:e.jsx(ce,{children:"Enter details"})})}),e.jsx(o,{mb:4,children:e.jsxs(u,{children:[n," name"]})}),e.jsx(o,{mb:12,children:e.jsx(N,{id:"cy-item-name",maxLength:250,name:"name",placeholder:"Paste name here...",rules:{...v}})}),n==="Image"?e.jsxs(e.Fragment,{children:[e.jsx(o,{mb:4,children:e.jsx(u,{children:"Link"})}),e.jsx(o,{mb:12,children:e.jsx(N,{id:"cy-item-link",maxLength:250,name:"sourceLink",placeholder:"Paste link here...",rules:{...v}})})]}):null,e.jsxs(o,{direction:"row",children:[e.jsx(o,{grow:1,children:e.jsx(y,{color:"secondary",onClick:i,size:"large",variant:"contained",children:"Prev"})}),e.jsx(o,{grow:1,ml:20,children:e.jsx(y,{color:"secondary",disabled:!r,onClick:a,size:"large",variant:"contained",children:"Next"})})]})]})},ce=h(u)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`,b={label:"Not selected",value:""},C=[{label:"Corporation",value:"Corporation",type:"Topic"},{label:"Event",value:"Event",type:"Topic"},{label:"Image",value:"Image",type:"Topic"},{label:"Organization",value:"Organization",type:"Topic"},{label:"Person",value:"Person",type:"Topic"},{label:"Place",value:"Place",type:"Topic"},{label:"Project",value:"Project",type:"blue"},{label:"Software",value:"Software",type:"blue"},{label:"Topic",value:"Topic",type:"blue"},b],le=({onNextStep:n,allowNextStep:a,onSelectType:i,selectedType:c})=>{const[d,r]=p.useState(b);p.useEffect(()=>{r(t=>t.value===c?t:C.find(m=>m.value===c)||b)},[c]);const l=t=>{i((t==null?void 0:t.label)||"")};return e.jsxs(o,{children:[e.jsx(o,{align:"center",direction:"row",justify:"space-between",mb:20,children:e.jsx(o,{align:"center",direction:"row",children:e.jsx(de,{children:"Select Type"})})}),e.jsx(o,{direction:"row",mb:20,children:e.jsx(oe,{onSelect:l,options:C,selectedValue:d})}),e.jsx(o,{children:e.jsx(y,{color:"secondary",disabled:!a,onClick:n,size:"large",type:"button",variant:"contained",children:"Next"})})]})},de=h(u)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`,P=async(n,a,i,c)=>{const d="node",r={};r.node_type=n.nodeType,r.name=n.name,n.nodeType==="Image"&&(r.node_data={source_link:n.sourceLink});let l="";await V(async()=>{const t=await U.enable();r.pubkey=t==null?void 0:t.pubkey,l=await K()});try{const t=await q.post(`/${d}`,JSON.stringify(r),{Authorization:l});if(t.error){const{message:m}=t.error;throw new Error(m)}c(n),a()}catch(t){t.status===402&&(await X(i),await J(i),await P(n,a,i,c)),t.status===400&&(await t.json(),a()),t instanceof Error&&a()}},Ce=()=>{const[n,a]=p.useState(0),{close:i,visible:c}=ee("addItem"),[d]=I(s=>[s.setBudget]),r=Q({mode:"onChange"}),{watch:l,setValue:t,reset:m}=r,[z,S]=p.useState(!1),[B,_]=k(s=>[s.addNewNode,s.setSelectedNode]),[L]=k(s=>[s.addNewNode]);p.useEffect(()=>()=>{a(0),m()},[c,m]);const w=l("nodeType"),E=l("name"),M=l("sourceLink"),O=()=>{i()},T=()=>{a(n+1)},F=()=>{a(n-1)},$=s=>{const j=`new-id-${Math.random()}`,g=s.nodeType.toLocaleLowerCase(),x={name:s.name,node_type:g,ref_id:j,x:Math.random(),y:Math.random(),z:Math.random(),date_added_to_graph:parseInt((new Date().getTime()/1e3).toFixed(0),10)};B(x),_(x),i()},A=s=>{const j=`new-id-${Math.random()}`,g=s.nodeType,x={ref_id:j,node_type:g,properties:{topic:s.name||"",date_added_to_graph:parseInt((new Date().getTime()/1e3).toFixed(0),10),...s.sourceLink?{source_link:s.sourceLink}:{}},x:Math.random()*1e3,y:Math.random()*1e3,z:Math.random()*1e3};L(x),i()},D=r.handleSubmit(async s=>{A(s);return;try{await P(s,O,d,$)}catch{console.log(G)}finally{S(!1)}}),R=s=>t("nodeType",s);return e.jsx(Z,{id:"addItem",kind:"small",onClose:i,preventOutsideClose:!0,children:e.jsx(W,{...r,children:e.jsxs("form",{id:"add-node-form",onSubmit:D,children:[n===0&&e.jsx(le,{allowNextStep:!!w,onNextStep:T,onSelectType:R,selectedType:w}),n===1&&e.jsx(ie,{name:E,onNextStep:T,onPrevStep:F,sourceLink:M||"",type:w}),n===2&&e.jsx(ne,{loading:z,onClick:()=>null})]})})})};export{Ce as AddItemModal};
