var u=Object.defineProperty;var g=(a,e,t)=>e in a?u(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var s=(a,e,t)=>(g(a,typeof e!="symbol"?e+"":e,t),t);import"./modulepreload-polyfill-3cfb730f.js";import{c as C}from"./Checkpoints-beff580d.js";class E{constructor(e="Unknown",t="/dialogue-box/unknown.webp"){s(this,"name");s(this,"image");s(this,"avatarContainer");this.name=e,this.image=t,this.avatarContainer=document.createElement("div"),this.avatarContainer.className="avatar-container",this.setupDOM()}setupDOM(){let e=document.createElement("div");e.className="avatar";let t=document.createElement("img");t.src=this.image,e.appendChild(t),this.avatarContainer.appendChild(e);let n=document.createElement("span");n.textContent=this.name,this.avatarContainer.appendChild(n)}render(){return this.avatarContainer}}const m={MORE_TEXT:"Next",NO_MORE_TEXT:"Close",NO_MORE_TEXT_BUT_CONTENT:"View content"},l=240;class f{constructor(e="No message has been defined.",t=!1){s(this,"message");s(this,"hasContent");s(this,"messageContainer");s(this,"messageElement");s(this,"paginationElement");s(this,"buttonElement");s(this,"currentPageIndex");s(this,"numberOfPages");s(this,"pages");this.message=e,this.hasContent=t,this.messageContainer=document.createElement("div"),this.messageContainer.className="message-container",this.messageElement=document.createElement("p"),this.paginationElement=document.createElement("span"),this.buttonElement=document.createElement("button"),this.currentPageIndex=0,this.numberOfPages=0,this.pages=this.paginateMessage(),this.setupDOM()}setupDOM(){let e=document.createElement("div");e.className="pagination-container",e.appendChild(this.paginationElement),e.appendChild(this.buttonElement),this.messageContainer.appendChild(this.messageElement),this.messageContainer.appendChild(e),this.buttonElement.addEventListener("click",()=>{this.updateUI()}),this.updateUI()}render(){return this.messageContainer}paginateMessage(){const e=this.message.match(/\b.*?[.!?](?=\s|$)/g)||[],t=[];let n=e.shift()||"",o=1;for(;e.length>0;){const r=e.shift()||"";if(n.length+r.length+1<=l)n=n+" "+r;else if(n.length>l){const c=n.split(" ");for(n=c.shift()||"";c.length>0;){const h=c.shift()||"";n.length+h.length+1<=l?n=n+" "+h:(o++,t.push(n),n=h)}}else o++,t.push(n),n=r}return t.push(n),this.numberOfPages=o,t}updateUI(){const e=this.currentPageIndex+1;this.messageElement.textContent=this.pages[this.currentPageIndex],this.numberOfPages>1&&(this.paginationElement.textContent=e+"/"+this.numberOfPages),e===this.numberOfPages?(this.buttonElement.className="close",this.buttonElement.textContent=this.hasContent?m.NO_MORE_TEXT_BUT_CONTENT:m.NO_MORE_TEXT,this.buttonElement.addEventListener("click",()=>{const t=new CustomEvent("destroy");document.dispatchEvent(t)})):(this.buttonElement.className="next",this.currentPageIndex++,this.buttonElement.textContent=m.MORE_TEXT)}}class v{constructor(e){s(this,"checkpoint");s(this,"dialogueContainer");s(this,"avatarComponent");s(this,"messageComponent");this.checkpoint=e,this.dialogueContainer=document.createElement("div"),this.dialogueContainer.className="dialogue-box",this.checkpoint.npcName&&(this.avatarComponent=new E(this.checkpoint.npcName,`NPC_${this.checkpoint.npcName}.png`)),this.messageComponent=new f(this.checkpoint.message,!!this.checkpoint.url),this.setupDOM(),document.addEventListener("destroy",async()=>{await WA.player.state.saveVariable("closeDialogueBoxEvent",{forceChange:new Date().getTime(),checkpoint:this.checkpoint},{public:!1,persist:!1,scope:"room"});const t=WA.iframeId;if(t){const n=await WA.ui.website.getById(t);n==null||n.close()}})}setupDOM(){if(this.checkpoint.npcName){const t=this.avatarComponent.render();this.dialogueContainer.appendChild(t)}const e=this.messageComponent.render();this.dialogueContainer.appendChild(e)}render(){return this.dialogueContainer}}console.info('"Dialogue Box" script started successfully');let i;async function d(){const e=new URL(window.location.toString()).searchParams.get("id");if(i=C.find(t=>t.id===e),i&&i.message){const t=new v(i);p?p.appendChild(t.render()):console.error("Element with ID 'app' not found.")}else console.error("Undefined NPC data")}const p=document.getElementById("app");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d();