import{s as a,b as s,j as r,aS as c,T as p,an as n,e as d}from"./index-18fc0e43.js";import{M as u,j as l}from"./index.esm-f623dcff.js";import{ay as t}from"./react-toastify.esm-179563aa.js";const x=async()=>{try{const o=await d.topup();if(!o)throw new Error("Topup failed");if(o.budget<5)throw new Error("You set a budget of less than 5 sats");t(r.jsx(e,{message:`You set a budget of ${o.budget} sats`}),{icon:!1,position:"bottom-center",type:"success"})}catch(o){o instanceof Error&&t(r.jsx(e,{message:o.message}),{icon:!1,position:"bottom-center",type:"error"})}},e=({message:o})=>o===c?r.jsxs("div",{children:[o,r.jsx(m,{onClick:x,type:"button",children:r.jsx(p,{color:"white",kind:"medium",children:"Topup"})})]}):r.jsx("div",{children:o}),h=(o,i)=>{t(r.jsx(e,{message:o}),{icon:o===n?r.jsx(u,{color:s.primaryGreen}):r.jsx(l,{color:s.primaryRed}),position:"bottom-center",type:i||o===n?"success":"error"})},m=a.button`
  background: ${s.gray200};
  border: 1px solid ${s.white};
  border-radius: 2px;
  margin: 10px;
  padding: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${s.gray300};
  }
`;export{e as T,h as n};