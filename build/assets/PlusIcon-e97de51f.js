import{Y as g,a0 as o,X as r,j as i}from"./index-7b1e84d7.js";function c(e){return e?String(e).replace(/[[]{2}/g,"").replace(/[\]]{2}/g,""):""}const s={podcast:{img:"audio_badge.svg",label:"podcast"},clip:{img:"audio_badge.svg",label:"clip"},show:{img:"show_badge.svg",label:"show"},tweet:{img:"twitter_badge.svg",label:"tweet"},twitter_space:{img:"audio_badge.svg",label:"clip"},youtube:{img:"video_badge.svg",label:"clip"},episode:{img:"video_badge.svg",label:"episode"},document:{img:"notes_badge.svg",label:"text"},image:{img:"image_badge.png",label:"image"}},p=({type:e})=>{var a,t,l;return i.jsxs(d,{children:[i.jsx("img",{alt:((a=s[e])==null?void 0:a.label)||e,src:((t=s[e])==null?void 0:t.img)||"image_badge.png"}),i.jsx("div",{className:"label",children:((l=s[e])==null?void 0:l.label)||e})]})},d=g(r).attrs({direction:"row"})`
  cursor: pointer;
  background: ${o.white};
  border-radius: 3px;
  overflow: hidden;

  img {
    width: 14px;
    height: 14px;
    object-fit: cover;
  }

  .label {
    color: ${o.BG1};
    font-family: Barlow;
    font-size: 8px;
    font-style: normal;
    font-weight: 800;
    line-height: 14px;
    text-transform: uppercase;
    line-height: 14px;
    letter-spacing: 0.48px;
    padding: 0 4px;
  }
`,m=e=>i.jsxs("svg",{width:"1em",height:"1em",viewBox:"0 0 21 20",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("mask",{id:"mask0_3553_6463",maskUnits:"userSpaceOnUse",x:"0",y:"0",width:"21",height:"20",children:i.jsx("rect",{x:"0.5",width:"1em",height:"1em",fill:"currentColor"})}),i.jsx("g",{children:i.jsx("path",{d:"M9.87516 10.625H5.7085C5.53141 10.625 5.38298 10.5651 5.26318 10.4453C5.14339 10.3254 5.0835 10.1769 5.0835 9.99975C5.0835 9.82258 5.14339 9.67417 5.26318 9.55452C5.38298 9.43487 5.53141 9.37504 5.7085 9.37504H9.87516V5.20837C9.87516 5.03129 9.93508 4.88285 10.0549 4.76306C10.1748 4.64327 10.3233 4.58337 10.5004 4.58337C10.6776 4.58337 10.826 4.64327 10.9456 4.76306C11.0653 4.88285 11.1251 5.03129 11.1251 5.20837V9.37504H15.2918C15.4689 9.37504 15.6173 9.43496 15.7371 9.55479C15.8569 9.67464 15.9168 9.82314 15.9168 10.0003C15.9168 10.1775 15.8569 10.3259 15.7371 10.4455C15.6173 10.5652 15.4689 10.625 15.2918 10.625H11.1251V14.7917C11.1251 14.9688 11.0652 15.1172 10.9454 15.237C10.8255 15.3568 10.677 15.4167 10.4999 15.4167C10.3227 15.4167 10.1743 15.3568 10.0546 15.237C9.93499 15.1172 9.87516 14.9688 9.87516 14.7917V10.625Z",fill:"currentColor"})})]});export{m as P,p as T,c as f};
