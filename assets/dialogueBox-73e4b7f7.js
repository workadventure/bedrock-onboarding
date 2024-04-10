var u=Object.defineProperty;var g=(a,e,t)=>e in a?u(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var s=(a,e,t)=>(g(a,typeof e!="symbol"?e+"":e,t),t);import"./modulepreload-polyfill-3cfb730f.js";import{o as C,t as E,r as f,p as v,c as k}from"./checkpoints-961b16ad.js";class N{constructor(e="Unknown",t="/dialogue-box/unknown.webp"){s(this,"name");s(this,"image");s(this,"avatarContainer");this.name=e,this.image=t,this.avatarContainer=document.createElement("div"),this.avatarContainer.className="avatar-container",this.setupDOM()}setupDOM(){let e=document.createElement("div");e.className="avatar";let t=document.createElement("img");t.src=this.image,e.appendChild(t),this.avatarContainer.appendChild(e);let n=document.createElement("span");n.textContent=this.name,this.avatarContainer.appendChild(n)}render(){return this.avatarContainer}}const l={MORE_TEXT:"Next",NO_MORE_TEXT:"Close",NO_MORE_TEXT_BUT_CONTENT:"View content"},m=240;class O{constructor(e="No message has been defined.",t=!1){s(this,"message");s(this,"hasContent");s(this,"messageContainer");s(this,"messageElement");s(this,"paginationElement");s(this,"buttonElement");s(this,"currentPageIndex");s(this,"numberOfPages");s(this,"pages");this.message=e,this.hasContent=t,this.messageContainer=document.createElement("div"),this.messageContainer.className="message-container",this.messageElement=document.createElement("p"),this.paginationElement=document.createElement("span"),this.buttonElement=document.createElement("button"),this.currentPageIndex=0,this.numberOfPages=0,this.pages=this.paginateMessage(),this.setupDOM()}setupDOM(){let e=document.createElement("div");e.className="pagination-container",e.appendChild(this.paginationElement),e.appendChild(this.buttonElement),this.messageContainer.appendChild(this.messageElement),this.messageContainer.appendChild(e),this.buttonElement.addEventListener("click",()=>{this.updateUI()}),this.updateUI()}render(){return this.messageContainer}paginateMessage(){const e=this.message.match(/\b.*?[.!?](?=\s|$)/g)||[],t=[];let n=e.shift()||"",o=1;for(;e.length>0;){const c=e.shift()||"";if(n.length+c.length+1<=m)n=n+" "+c;else if(n.length>m){const r=n.split(" ");for(n=r.shift()||"";r.length>0;){const h=r.shift()||"";n.length+h.length+1<=m?n=n+" "+h:(o++,t.push(n),n=h)}}else o++,t.push(n),n=c}return t.push(n),this.numberOfPages=o,t}updateUI(){const e=this.currentPageIndex+1;this.messageElement.textContent=this.pages[this.currentPageIndex],this.numberOfPages>1&&(this.paginationElement.textContent=e+"/"+this.numberOfPages),e===this.numberOfPages?(this.buttonElement.className="close",this.buttonElement.textContent=this.hasContent?l.NO_MORE_TEXT_BUT_CONTENT:l.NO_MORE_TEXT,this.buttonElement.addEventListener("click",()=>{const t=new CustomEvent("destroy");document.dispatchEvent(t)})):(this.buttonElement.className="next",this.currentPageIndex++,this.buttonElement.textContent=l.MORE_TEXT)}}class b{constructor(e){s(this,"checkpoint");s(this,"dialogueContainer");s(this,"avatarComponent");s(this,"messageComponent");this.checkpoint=e,this.dialogueContainer=document.createElement("div"),this.dialogueContainer.className="dialogue-box",this.checkpoint.npcName&&(this.avatarComponent=new N(this.checkpoint.npcName,`NPC_${this.checkpoint.npcName}.png`)),this.messageComponent=new O(this.checkpoint.message,!!this.checkpoint.url),this.setupDOM(),document.addEventListener("destroy",()=>{this.dialogueContainer.remove(),this.checkpoint.url&&(console.log("Open URL",this.checkpoint.url),C(this.checkpoint.url)),this.checkpoint.npcName==="Jonas"?(console.log("Teleport Jonas"),WA.room.area.delete(this.checkpoint.id),E(this.checkpoint.coordinates.x,this.checkpoint.coordinates.y)):this.checkpoint.type==="direction"&&(console.log("Remove direction area and tile"),WA.room.area.delete(this.checkpoint.id),f(this.checkpoint)),console.log("this.checkpoint.id",this.checkpoint.id),v(this.checkpoint.id)})}setupDOM(){if(this.checkpoint.npcName){const t=this.avatarComponent.render();this.dialogueContainer.appendChild(t)}const e=this.messageComponent.render();this.dialogueContainer.appendChild(e)}render(){return this.dialogueContainer}}console.info('"Dialogue Box" script started successfully');let i;async function p(){const e=new URL(window.location.toString()).searchParams.get("id");if(i=k.find(t=>t.id===e),i&&i.message){const t=new b(i);d?d.appendChild(t.render()):console.error("Element with ID 'app' not found.")}else console.error("Undefined NPC data")}const d=document.getElementById("app");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p();
