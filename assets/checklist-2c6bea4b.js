import"./modulepreload-polyfill-3cfb730f.js";import{b as h,g as f}from"./actions-17e0e468.js";console.info('"Checklist" script started successfully');const L=document.querySelector(".checklist"),p=document.querySelector("#items-left"),c=document.querySelector("#all"),i=document.querySelector("#active"),a=document.querySelector("#completed"),o=document.querySelector("#m-all"),l=document.querySelector("#m-active"),n=document.querySelector("#m-completed");let m=[];const k=()=>{f("todos","all").then(t=>{console.log("To-dos:",t)}).catch(console.error)};WA.onInit().then(()=>{async function t(){p&&(c.addEventListener("click",()=>{c.classList.add("active"),o.classList.add("active"),i.classList.remove("active"),l.classList.remove("active"),a.classList.remove("active"),n.classList.remove("active"),v("all")}),o.addEventListener("click",()=>{c.classList.add("active"),o.classList.add("active"),i.classList.remove("active"),l.classList.remove("active"),a.classList.remove("active"),n.classList.remove("active"),v("all")}),i.addEventListener("click",()=>{c.classList.remove("active"),o.classList.remove("active"),i.classList.add("active"),l.classList.add("active"),a.classList.remove("active"),n.classList.remove("active"),v("active")}),l.addEventListener("click",()=>{c.classList.remove("active"),o.classList.remove("active"),i.classList.add("active"),l.classList.add("active"),a.classList.remove("active"),n.classList.remove("active"),v("active")}),a.addEventListener("click",()=>{c.classList.remove("active"),o.classList.remove("active"),i.classList.remove("active"),l.classList.remove("active"),a.classList.add("active"),n.classList.add("active"),v("completed")}),n.addEventListener("click",()=>{c.classList.remove("active"),o.classList.remove("active"),i.classList.remove("active"),l.classList.remove("active"),a.classList.add("active"),n.classList.add("active"),v("completed")})),h().then(async()=>{C()}).catch(e=>console.error(e))}document.readyState==="loading"?(console.log("DEBUG: Loading hasn't finished yet..."),document.addEventListener("DOMContentLoaded",t)):(console.log("DEBUG: `DOMContentLoaded` has already fired"),t())}).catch(t=>console.error(t));const y=()=>{const t=m.filter(e=>!e.isComplete);p.textContent=t.length.toString()};function v(t){let e=[];switch(t){case"all":e=m;break;case"active":e=m.filter(function(s){return!s.isComplete});break;case"completed":e=m.filter(function(s){return s.isComplete});break}b(e)}function b(t){L.innerHTML="",t.forEach((e,s)=>{const d=document.createElement("li");d.className="card todo-item",d.setAttribute("data-index",s);const r=`
        <div class="todo">
          <input type="checkbox" id="checkbox-${e.id}" ${e.isComplete?"checked":""}>
          <label for="checkbox-${e.id}"></label>
          <p>${e.text}</p>
        </div>
        <div class="icons"> 
          <i class="fa fa-pencil" aria-hidden="true"></i>
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
      `;d.innerHTML=r,L.appendChild(d)})}async function C(){console.log("**************************");const t=await WA.player.state.loadVariable("checkpoints");console.log("playerCheckpointIds",t);const e=k();console.log("todos",e),console.log("todos",m),L.innerHTML="",m.forEach((s,d)=>{const r=document.createElement("li");r.className="card todo-item ",r.setAttribute("data-index",d.toString());const u=`
      <div class="todo">
        <input type="checkbox" id="checkbox-${s.id}" ${s.isComplete?"checked":""}>
        <label for="checkbox-${s.id}"></label>
        <p>${s.text}</p>
      </div>
      <div class="icons"> 
        <i class="fa fa-pencil" aria-hidden="true"></i>
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
    `;r.innerHTML=u,L.appendChild(r)}),y()}
