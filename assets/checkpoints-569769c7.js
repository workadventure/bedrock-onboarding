function F(e){e.type==="NPC"?$(e):e.type==="content"?Y(e):e.type==="direction"?U(e):console.error("Invalid area type while placing tile")}function $(e){if(console.log(`Placing checkpoint ${e.id} (NPC tile)`),e.npcName&&e.npcSprite){const t=e.npcName.toLowerCase();WA.room.setTiles([{x:e.coordinates.x,y:e.coordinates.y,tile:`npc-${t}-${e.npcSprite}`,layer:"furniture/furniture3"}])}}function Y(e){console.log(`Placing checkpoint ${e.id} (content tile)`),WA.room.setTiles([{x:e.coordinates.x,y:e.coordinates.y,tile:"content",layer:"furniture/furniture1"}])}function V(e,t){WA.room.setTiles([{x:e,y:t,tile:null,layer:"furniture/furniture1"}])}function U(e){console.log(`Placing checkpoint ${e.id} (direction tile)`),WA.room.setTiles([{x:e.coordinates.x,y:e.coordinates.y,tile:"direction",layer:"furniture/furniture1"}])}function z(e,t){WA.room.setTiles([{x:e,y:t,tile:null,layer:"furniture/furniture1"}])}function be(e,t){G(e,t),M(e,t)}function G(e,t){WA.room.setTiles([{x:e,y:t,tile:"npc-jonas-tp",layer:"furniture/furniture3"}]),setTimeout(()=>{WA.room.setTiles([{x:e,y:t,tile:null,layer:"furniture/furniture3"}])},1e3)}function M(e,t){const s=[{dx:-1,dy:-1,id:1},{dx:0,dy:-1,id:2},{dx:1,dy:-1,id:3},{dx:-1,dy:0,id:4},{dx:0,dy:0,id:5},{dx:1,dy:0,id:6},{dx:-1,dy:1,id:7},{dx:0,dy:1,id:8},{dx:1,dy:1,id:9}],l=s.map(({dx:c,dy:d,id:v})=>({x:e+c,y:t+d,tile:`teleport-${v}`,layer:"above/above1"}));WA.room.setTiles(l),setTimeout(()=>{const c=s.map(({dx:d,dy:v})=>({x:e+d,y:t+v,tile:null,layer:"above/above1"}));WA.room.setTiles(c)},1800)}let y,g,w;const b="The door is locked. You are not qualified to enter here.";WA.onInit().then(()=>{const e=WA.room.mapURL;w=e.substring(0,e.lastIndexOf("/"))});async function A(e){y=await WA.ui.website.open({url:w+`/dialogue-box/index.html?id=${e}`,visible:!0,allowApi:!0,allowPolicy:"",position:{vertical:"bottom",horizontal:"middle"},size:{height:"120px",width:"650px"},margin:{bottom:"70px"}})}function I(){y==null||y.close()}async function q(e){g=await WA.nav.openCoWebSite(e)}function K(){g==null||g.close()}function L(e){console.log("Display description of checkpoint",e);const t=J.find(r=>r.id===e),o=30*1e3;t?setTimeout(()=>{WA.ui.banner.openBanner({id:"onboarding-banner",text:`${t.title}: ${t.description}`,bgColor:"#3402F0",textColor:"#FFFFFF",closable:!1,timeToClose:12e4})},o):WA.ui.banner.openBanner({id:"onboarding-banner",text:"CONGRATULATIONS! YOU HAVE SUCCESSFULLY FINISHED THE ONBOARDING AND COMPLETED ALL CHECKPOINTS!",bgColor:"#3402F0",textColor:"#FFFFFF",closable:!1,timeToClose:12e4})}function k(e){WA.ui.banner.openBanner({id:"onboarding-banner",text:e,bgColor:"#FD4D26",textColor:"#FFFFFF",closable:!0,timeToClose:3e3})}function x(){WA.ui.banner.closeBanner()}function ke(){WA.ui.actionBar.addButton({id:"checklist-btn",type:"action",imageSrc:`${w}/checklist-icon.svg`,toolTip:"Onboarding Checklist",callback:()=>{WA.ui.modal.openModal({title:"Plan",src:`${w}/checklist/index.html`,allowApi:!0,allow:"microphone; camera",position:"center"},()=>WA.ui.modal.closeModal())}})}let W=!1;function S(e){let t=[];const o=E(),r=te();console.log("Processing areas..."),J.forEach(n=>{if(Q(n,o)){const s=e.includes(n.id);t.push({id:n.id,title:n.title,done:s}),_(n,r)&&Z(n,e)&&ee(n,e)&&(X(n),F(n))}}),B(t)}function X(e){console.log(`Placing checkpoint ${e.id} (area)`);const t=32,o=128,r=e.coordinates.x*t,n=e.coordinates.y*t,s=r-(o-t)/2,l=n-(o-t)/2;WA.room.area.create({name:e.id,x:s,y:l,width:o,height:o}),WA.room.area.onEnter(e.id).subscribe(()=>{console.log("Entered checkpoint area",e.id),e.type==="NPC"&&e.message?A(e.id):e.type==="content"&&e.url?q(e.url):e.type==="direction"&&e.message&&A(e.id)}),WA.room.area.onLeave(e.id).subscribe(()=>{console.log("Leaved checkpoint area",e.id),e.type==="NPC"?I():e.type==="content"?(K(),V(e.coordinates.x,e.coordinates.y),D(e.id)):e.type==="direction"&&(e.message?I():(WA.room.area.delete(e.id),z(e.coordinates.x,e.coordinates.y),D(e.id)))})}function _(e,t){const o=e.id;return t!==e.map?(console.log(`Ignoring checkpoint ${o} (not the right map)`),!1):!0}function Q(e,t){const o=e.id;return e.tags&&e.tags.every(r=>!t.includes(r))?(console.log(`Ignoring checkpoint ${o} (not the right tags)`),!1):!0}function Z(e,t){const o=e.id;return ye(o)&&!ue(t)?(console.log(`Ignoring checkpoint ${o} (not the right milestone)`),!1):ge(o)&&!j(t)?(console.log(`Ignoring checkpoint ${o} (not the right milestone)`),!1):!0}function ee(e,t){const o=e.id;if(t.includes(e.id)){if(e.type==="NPC"&&e.npcName==="Jonas")return console.log(`Ignoring checkpoint ${o} (already met this Jonas)`),!1;if(e.type==="direction")return console.log(`Ignoring checkpoint ${o} (already passed this direction)`),!1}else if(e.type==="NPC"&&e.npcName==="Jonas"){if(W)return console.log(`Ignoring checkpoint ${o} (next Jonas is already placed)`),!1;W=!0}return!0}async function xe(){const e=await ce();S(e)}function E(){return WA.player.tags}function te(){return WA.state.map}let h=!0,a={hr:{access:!0,blockingTiles:[[80,74],[81,74],[82,74],[83,74]]},arcade:{access:!1,blockingTiles:[[16,116],[17,116],[18,116],[19,116]]},stadium:{access:!1,blockingTiles:[[18,77],[19,77],[20,77]]},wikitek:{access:!1,blockingTiles:[[77,110],[78,110],[79,110],[80,110],[81,110],[82,110]]},streaming:{access:!1,blockingTiles:[[69,40],[70,40],[71,40],[72,40]]},cave:{access:!1,blockingTiles:[[49,11],[50,11]]},backstage:{access:!1,blockingTiles:[[29,49],[30,49],[29,51],[30,51]]}},p={alt:{access:!1,leftWall:[[41,4],[41,5]],rightWall:[[44,4],[44,5]],pillar:[[42,5],[43,5],[42,6],[43,6]]},fr:{access:!1,leftWall:[[45,2],[45,3]],rightWall:[[48,2],[48,3]],pillar:[[46,3],[47,3],[46,4],[47,4]]},ext:{access:!1,leftWall:[[50,2],[50,3]],rightWall:[[53,2],[53,3]],pillar:[[51,3],[52,3],[51,4],[52,4]]},pt:{access:!1,leftWall:[[54,4],[54,5]],rightWall:[[57,4],[57,5]],pillar:[[55,5],[56,5],[55,6],[56,6]]}};function Ce(e,t,o){e==="town"?oe(t,o):e==="world"&&ae(o)}function Be(){Object.keys(a).forEach(e=>{a[e].access=!1,H(e)})}function oe(e,t){if(e.includes("guest"))Object.keys(a).forEach(o=>{a[o].access=o==="hr"||o==="arcade"});else if(e.some(o=>i.includes(o))){const o=j(t);a.stadium.access=!0,a.cave.access=!0,a.hr.access=!0,a.arcade.access=o,a.streaming.access=o,a.wikitek.access=o,a.backstage.access=o,e.some(r=>C.includes(r))&&(Object.keys(a).forEach(r=>{a[r].access=!0}),a.backstage.access=o),pe(t)&&(p.alt.access=e.includes("alt"),p.fr.access=e.some(r=>f.includes(r)),p.ext.access=e.includes("ext"),p.pt.access=e.includes("pt"))}u("hr"),u("arcade"),u("stadium"),u("wikitek"),u("streaming"),u("cave"),u("backstage"),re()}function u(e){a[e].access?WA.room.area.onEnter(`${e}Door`).subscribe(()=>{ie(e),h===!0?(h=!1,WA.room.hideLayer(`roofs/${e}1`),WA.room.hideLayer(`roofs/${e}2`)):(h=!0,WA.room.showLayer(`roofs/${e}1`),WA.room.showLayer(`roofs/${e}2`))}):(H(e),WA.room.area.onEnter(`${e}Door`).subscribe(()=>{k(b)}),WA.room.area.onLeave(`${e}Door`).subscribe(()=>{x()}))}function H(e){const o=a[e].blockingTiles.map(([r,n])=>({x:r,y:n,tile:"collision",layer:"collisions"}));WA.room.setTiles(o)}function ie(e){const o=a[e].blockingTiles.map(([r,n])=>({x:r,y:n,tile:null,layer:"collisions"}));WA.room.setTiles(o)}function re(){Object.keys(p).forEach(e=>{p[e].access===!0&&O(e)})}function O(e){const t=p[e],o=t.pillar.map(([l,c],d)=>({x:l,y:c,tile:`no-pillar-${d+1}`,layer:"walls/walls1"})),r=t.leftWall.map(([l,c],d)=>({x:l,y:c,tile:`cave-door-wall-open-${d+1}`,layer:"walls/walls1"})),n=t.rightWall.map(([l,c],d)=>({x:l,y:c,tile:`cave-door-wall-open-${d+1}`,layer:"walls/walls1"})),s=[...o,...r,...n];WA.room.setTiles(s)}function ne(e){let t=null;return e.some(o=>C.includes(o))?t="fr":e.includes("alt")?t="alt":e.includes("ext")?t="ext":e.includes("pt")&&(t="pt"),t}let m={cave:{access:!1,blockingTiles:[[29,182]]},airport:{access:!1,blockingTiles:[[51,22],[52,22],[53,22]]}};function ae(e){h=!1,m.cave.access=he(e),m.airport.access=me(e),P("cave"),P("airport")}function P(e){m[e].access?WA.room.area.onEnter(`${e}Door`).subscribe(()=>{le(e),h===!0?(h=!1,WA.room.hideLayer(`roofs/${e}1`),WA.room.hideLayer(`roofs/${e}2`)):(h=!0,WA.room.showLayer(`roofs/${e}1`),WA.room.showLayer(`roofs/${e}2`))}):(se(e),WA.room.area.onEnter(`${e}Door`).subscribe(()=>{k(b)}),WA.room.area.onLeave(`${e}Door`).subscribe(()=>{x()}))}function se(e){const o=m[e].blockingTiles.map(([r,n])=>({x:r,y:n,tile:"collision",layer:"collisions"}));WA.room.setTiles(o)}function le(e){const o=m[e].blockingTiles.map(([r,n])=>({x:r,y:n,tile:null,layer:"collisions"}));WA.room.setTiles(o)}const Te=["admin","br","hr","ext","fr","pt","alt","guest"],i=["admin","br","hr","ext","fr","pt","alt"],C=["admin","br","hr"],f=[...C,"fr"],J=[{id:"1",map:"town",title:"Arrival in Town",description:"Welcome to Bedrock town! You've arrived in our bustling town, ready to embark on your journey.",type:"direction",coordinates:{x:50,y:110},tags:i},{id:"2",map:"town",title:"Talk with Jonas",description:"Meet Jonas, our CEO, near the central plaza. He'll greet you and explain the goals of our onboarding experience.",coordinates:{x:50,y:106},type:"NPC",npcName:"Jonas",npcSprite:"front",message:`Ah, welcome! You must be the newest member of our Bedrock family. I'm Jonas, the CEO. It's a real pleasure to meet you. You’re about to embark on an exciting journey that’s designed to introduce you to our culture, our achievements, and the innovative work we do here. But before we dive into all that, let me share a bit of advice with you.
        Firstly, keep an open mind. You're going to meet a lot of interesting characters today, each with their own stories and insights about our company. They represent the diversity and the spirit of Bedrock. Engage with them, ask questions, and, most importantly, enjoy the process.
        Secondly, don’t rush. While it might be tempting to breeze through all the checkpoints, the real value comes from understanding the essence of what makes Bedrock unique. The content you’ll discover has been carefully chosen to give you a well-rounded view of our company.
        Lastly, don’t hesitate to revisit any part of the onboarding experience if you feel like you missed something. Our goal is for you to feel confident and informed about your new role here at Bedrock.
        Now, if you’re ready, let’s get started. Your first checkpoint is just ahead. Oh, and one more thing - keep an eye out for me! I’ll be popping up from time to time to check in on your progress. Safe travels through Bedrock, and remember, this journey is as much about discovery as it is about finding your place in our community. Off you go!`,tags:i},{id:"3",map:"town",title:"Enter the Cave",description:"Explore the mysterious cave at the edge of town.",type:"direction",coordinates:{x:50,y:15},tags:i},{id:"4",map:"town",title:"Unlock the Cave Door",description:"Find a way to unlock the door within the cave to access the World map.",coordinates:{x:49,y:7},type:"direction",message:"While checking this antique PC, you discover that Jonas registered your profile, granting you access to the other side. It seems your journey is about to take a significant step forward.",tags:i},{id:"5",map:"world",title:"Hello World!",description:"Entered the expansive World map, still within the depths of the cave.",type:"direction",coordinates:{x:42,y:198},tags:i},{id:"6",map:"world",title:"Talk with Jonas Again",description:"Speak with Jonas to receive further guidance as you prepare to leave the cave.",coordinates:{x:27,y:180},type:"NPC",npcName:"Jonas",npcSprite:"left",message:"Ah, there you are! Ready to venture further into the world of Bedrock? Let me provide you with some additional guidance as you prepare to explore beyond the cave.",url:"https://drive.google.com/file/d/14xQEkRCnBRTkwCh1b4JpDmo_ejJX9Lz5/view?usp=sharing",tags:i},{id:"7",map:"world",title:"Retrieve Jonas's Phone",description:"Pick up Jonas's phone and watch a video showcasing the innovative products and services offered by Bedrock.",coordinates:{x:28,y:180},type:"content",url:"https://drive.google.com/file/d/17kxTBaUItYcfJbKSAa1CAHDU3v6UlxUE/view?usp=sharing",tags:i},{id:"8",map:"world",title:"Exit the Cave",description:"Leave the cave behind and begin your exploration of the vast World map.",type:"direction",coordinates:{x:29,y:183},tags:i},{id:"9",map:"world",title:"Learn about Bedrock's History",description:"Interact with Aria to learn about the rich history of Bedrock, detailing its journey from inception to present.",coordinates:{x:78,y:183},type:"NPC",npcName:"Aria",npcSprite:"front",message:"Greetings, traveler! I'm Aria, here to share with you the rich history of Bedrock. From our humble beginnings to our current endeavors, there's much to learn about our journey. Let me regale you with tales of our past. Check out this document to learn more!",url:"https://drive.google.com/file/d/1j3LgdBTNldFPWhBUPOGwBLY--xO7cId0/view?usp=sharing",tags:i},{id:"10",map:"world",title:"Explore Bedrock's Achievements",description:"Engage with Murielle to discover the impressive achievements of Bedrock, highlighting its successes and milestones.",coordinates:{x:78,y:155},type:"NPC",npcName:"Murielle",npcSprite:"front",message:"Hello there! I'm Murielle, and I'm excited to tell you about the incredible achievements of Bedrock. Our journey has been filled with milestones and successes that have shaped who we are today. Let's celebrate our accomplishments together! Check out this video of the BR Day!",url:"https://drive.google.com/open?id=1PKex-OnTEKfJbzPTqEeCxZOK1DysrMV9&usp=drive_fs",tags:i},{id:"11",map:"world",title:"Discover Bedrock's Values",description:"Chat with NPC Charlie to uncover the core values that drive Bedrock's operations and culture, shaping its identity and direction.",coordinates:{x:62,y:136},type:"NPC",npcName:"Charlie",npcSprite:"left",message:"Hey, nice to meet you! I'm Charlie, and I'm here to talk to you about the core values that drive Bedrock. Our values are at the heart of everything we do, guiding us as we work towards our goals. Let's dive into what makes us tick. Check out this document to learn more!",url:"https://drive.google.com/file/d/1ipdSh7YJ99YCjYrbnbUUyoTrv5ppT9oL/view?usp=sharing",tags:i},{id:"12",map:"world",title:"Understand Bedrock's Legal Structure",description:"Speak with Diana to access detailed information about Bedrock's legal structure and organizational setup, ensuring transparency and compliance.",coordinates:{x:21,y:98},type:"NPC",npcName:"Diana",npcSprite:"front",message:"Greetings, adventurer! I'm Diana, and I'm here to shed some light on the legal side of Bedrock. Understanding our legal structure and organizational setup is crucial for transparency and compliance. Let's explore this together. Check out this document to learn more!",url:"https://workadventu.re/?cell=J60",tags:i},{id:"13",map:"world",title:"Talk with Jonas about Customer Success",description:"Jonas shares insights into Bedrock's commitment to customer success as you continue your journey.",coordinates:{x:20,y:69},type:"NPC",npcName:"Jonas",npcSprite:"front",message:`Ah, I see you've made it this far! Excellent. I've been meaning to thank you for bringing me my phone. Seems I dropped it during my last teleportation. Thank you for returning it. Now, back to business—there's much to discuss about our journey ahead.
        Before you cross that bridge, I want to share something crucial about Bedrock. You see, our customers are not just clients; they're partners, and they play a significant role in defining who we are. Our collaborations across the globe not only reflect our reach but also our commitment to delivering exceptional service and innovation.
        Pride in our work and our partners is a core part of our identity. It's something that you'll find deeply ingrained in every project, every team, and every success story at Bedrock. This is why, just beyond this bridge, you'll embark on a unique journey through four countries: France, Hungary, Belgium, and the Netherlands. Each of these represents a cornerstone of our customer base, showcasing the diverse and impactful work we've achieved together.
        Off you go, and enjoy the journey through our global footprint!`,tags:i},{id:"14",map:"world",title:"Explore France Customer: 6play (Part 1)",description:"In the city of Paris, interact with Pierre to learn about Bedrock's partnership with France's 6play streaming service.",coordinates:{x:57,y:56},type:"NPC",npcName:"Pierre",npcSprite:"front",message:"Hello! My name is Pierre. Welcome to Paris, and welcome to the world of Bedrock. Allow me to introduce you to our partnership with 6play, France's premier streaming service. Let's explore together, shall we? Check out this video to learn more!",url:"https://drive.google.com/file/d/14sL8VNlrI-sX4sOvf963G3WsgvIVKMN5/view?usp=sharing",tags:i},{id:"15",map:"world",title:"Discover France Customer: 6play (Part 2)",description:"Continue your exploration of Bedrock's partnership with France's 6play streaming service by engaging with Emilie.",coordinates:{x:73,y:70},type:"NPC",npcName:"Emilie",npcSprite:"front",message:"Hi there! I'm Emilie, and I'm thrilled to share more about our collaboration with 6play. We've got some exciting things in store for you, so let's dive right in and discover what makes 6play unique. Check out this video to learn more!",url:"https://drive.google.com/file/d/1g6WcLd04VLuxitxvBOlBrd0xx1LIBI9u/view?usp=sharing",tags:i},{id:"16",map:"world",title:"Explore Hungary Customer: RTL+ (Part 1)",description:"Chat with Eva to uncover Bedrock's collaboration with Hungary's RTL+ streaming service.",coordinates:{x:88,y:47},type:"NPC",npcName:"Eva",npcSprite:"front",message:"Hi! I'm Eva, and I'm here to talk to you about our partnership with RTL+. Get ready for an adventure as we explore the world of Hungarian streaming together. Check out this video to learn more!",url:"https://drive.google.com/file/d/14uROluBfmphPszUB0-4MtcjCJxn1tH9_/view?usp=sharing",tags:i},{id:"17",map:"world",title:"Uncover Hungary Customer: RTL+ (Part 2)",description:"Speak with Gabor to delve deeper into Bedrock's partnership with Hungary's RTL+ streaming service.",coordinates:{x:102,y:47},type:"NPC",npcName:"Gabor",npcSprite:"front",message:"Hello! I'm Gabor, and I'm excited to tell you more about RTL+. Hungary's streaming scene is buzzing with excitement, and we're proud to be a part of it. Let's uncover the magic of RTL+. Check out this video to learn more!",url:"https://drive.google.com/open?id=1BZgxdihlRBZ289dc4EiJNPbnBjdZxhtv&usp=drive_fs",tags:i},{id:"18",map:"world",title:"Learn about Belgium Customer: RTL Play (Part 1)",description:"In the city of Brussels, interact with Luc to explore Bedrock's collaboration with Belgium's RTL Play streaming service.",coordinates:{x:97,y:10},type:"NPC",npcName:"Luc",npcSprite:"front",message:"Hello there! I'm Luc, and I'm here to showcase Bedrock's collaboration with RTL Play. From Belgium to the world, let's explore the wonders of streaming together. Check out this video to learn more!",url:"https://drive.google.com/file/d/1j5_133tmosFpBHL2CXj3CqPGX9YwPp-h/view?usp=sharing",tags:i},{id:"19",map:"world",title:"Discover Belgium Customer: RTL Play (Part 2)",description:"Continue your exploration of Bedrock's partnership with Belgium's RTL Play streaming service by engaging with Emma.",coordinates:{x:83,y:10},type:"NPC",npcName:"Emma",npcSprite:"front",message:"Hey! I'm Emma, and I'm thrilled to share more about RTL Play with you. Belgium's streaming landscape is diverse and vibrant, and we're at the heart of it. Let's dive in and discover what makes RTL Play special. Check out this video to learn more!",url:"https://drive.google.com/file/d/14uqHR0Ri8W4tuXzswBjRVA8HztOOMvpO/view?usp=sharing",tags:i},{id:"20",map:"world",title:"Explore Netherlands Customer: Videoland (Part 1)",description:"Chat with Hans to uncover Bedrock's collaboration with Netherlands' Videoland streaming service.",coordinates:{x:22,y:34},type:"NPC",npcName:"Hans",npcSprite:"front",message:"Hi! I'm Hans, and I'm here to talk to you about Videoland. Get ready for an immersive experience as we explore the world of Dutch streaming together. Check out this video to learn more!",url:"https://drive.google.com/file/d/14uUahKs0pwveQ5UrzL4QdoS2ee8rJv_H/view?usp=sharing",tags:i},{id:"21",map:"world",title:"Uncover Netherlands Customer: Videoland (Part 2)",description:"Speak with Ingrid to delve deeper into Bedrock's partnership with Netherlands' Videoland streaming service.",coordinates:{x:8,y:34},type:"NPC",npcName:"Ingrid",npcSprite:"front",message:"Hi there! I'm Ingrid, and I'm excited to tell you more about Videoland. The Netherlands is home to a wealth of streaming content, and we're here to bring it to you. Let's embark on this journey together. Check out this document to learn more!",url:"https://drive.google.com/open?id=1BflS6L3E6OnPTfED_5igHaEiwyFDhjTR&usp=drive_fs",tags:i},{id:"22",map:"world",title:"Complete Airport Check-in",description:"Prepare for departure by completing the airport check-in process. Access to the gates requires viewing all content checkpoints.",coordinates:{x:55,y:13},type:"NPC",npcName:"Vianey",npcSprite:"left",message:"Welcome to the airport! I'm Vianey, and I'll be guiding you through the check-in process. Before we proceed, let me congratulate you on completing your journey through Bedrock's onboarding experience. It seems you've traveled far and checked all contents on all previous locations. Well done! As a reward, here's your ticket that allows you to pass through the gates. Safe travel!",tags:i},{id:"23",map:"world",title:"Board the Helicopter with Jonas",description:"Jonas awaits you near the helicopter for a scenic journey from the airport to the rooftop of the BR Tour.",coordinates:{x:30,y:7},type:"NPC",npcName:"Jonas",npcSprite:"right",message:`Well, well, well! Look who's ready for a unique experience. It's you, and you've earned it. I've been looking forward to this moment. Come, join me. I've got something special planned.
        You see that helicopter over there? It's not just any helicopter. It's Bedrock's very own flying machine, reserved exclusively for our incredible employees. I figured I wouldn't need it much myself—I can teleport, after all—but I thought it'd be a fun perk for you all.
        So, let's hop in and take to the skies. Sit back, relax, and enjoy the view as we soar above the city. From up here, you'll get a whole new perspective on Bedrock and our place in the world.
        Next stop: the Bedrock Tour. Off we go!`,tags:i},{id:"24",map:"world",title:"The Bedrock Tour",description:"You've landed on the rooftop of the Bedrock Tour, the heart of the company. Jonas wants to speak to you before you enter the building.",coordinates:{x:23,y:114},type:"NPC",npcName:"Jonas",npcSprite:"back",message:`Before we venture inside, take a moment to appreciate the view from up here. It's quite spectacular, isn't it? From this vantage point, you can see the sprawling landscape of our company and the vibrant city beyond.
        But enough introspection for now. The real adventure lies ahead, within the walls of the Bedrock Tour. Inside, you'll discover the inner workings of our company and meet some of the people who make it all possible.
        So, when you're ready, let's step inside and begin our exploration. The CHRO floor is our first destination—a place where the heartbeat of our company, our people, comes to life.`,tags:i},{id:"25",map:"world",title:"Explore CHRO Office",description:"Delve into the role of Christine, the Chief Human Resources Officer (CHRO) and its contributions to Bedrock's success.",coordinates:{x:31,y:124},type:"NPC",npcName:"Christine",npcSprite:"left",message:"Greetings! I'm Christine, the CHRO of Bedrock. Join me as we explore the vital role of Human Resources in our company's success. Let's dive into the world of HR together. Check out this document to learn more!",tags:i},{id:"26",map:"world",title:"Discover Departments Presentation",description:"Engage with the presentation on this floor to learn about the various departments within Bedrock and their functions.",coordinates:{x:29,y:129},type:"content",url:"https://drive.google.com/file/d/1jWuojTxm6FkXxdvm3KU0wCvLu9PGGOwY/view?usp=sharing",tags:i},{id:"27",map:"world",title:"Explore HR KPIs",description:"Analyze the key performance indicators (KPIs) related to human resources management, showcasing Bedrock's strategic HR approach.",coordinates:{x:29,y:137},type:"content",url:"https://workadventu.re/?cell=J72",tags:i},{id:"28",map:"world",title:"View Organizational Chart",description:"Study the organizational chart of Bedrock with Nicolas, illustrating the hierarchical structure and reporting relationships within the company.",coordinates:{x:27,y:143},type:"NPC",npcName:"Nicolas",npcSprite:"front",message:"Hello! I'm Nicolas, and I'll be your guide to Bedrock's organizational chart. Understanding our structure is key to navigating our company effectively. Let's map it out together. Check out this document to learn more!",url:"https://airtable.com/appKpJQwbYs2xn4IS/paghiLXWHi7tWPE4O",tags:i},{id:"29",map:"world",title:"Explore Office Presentation",description:"Take a virtual tour of Bedrock's office spaces with Julie, showcasing the work environment and facilities available to employees.",coordinates:{x:28,y:150},type:"NPC",npcName:"Julie",npcSprite:"front",message:"Hey there! I'm Julie, and I'm excited to give you a virtual tour of Bedrock's office spaces. From cozy meeting rooms to vibrant break areas, we've got everything you need for a productive work environment. Let me show you around! Check out this document to learn more!",url:"https://workadventu.re/?cell=J74",tags:i},{id:"30",map:"world",title:"Exit the BR Tour",description:"Step outside the BR Tour and prepare for your next adventure with Bedrock.",type:"direction",coordinates:{x:24,y:159},tags:i},{id:"31",map:"world",title:"Talk with Jonas at its Pickup",description:"Jonas awaits you near its pickup, ready to provide additional guidance and support.",coordinates:{x:23,y:165},type:"NPC",npcName:"Jonas",npcSprite:"back",message:"Ah, there you are! Ready to head back to town? Before we go, let's make sure you've absorbed everything from the BR Tour. Do you feel confident with all the information about Bedrock now? So let's continue our trip!",tags:i},{id:"32",map:"world",title:"Return to Town with Jonas",description:"Head back to the town with Jonas, continuing your onboarding journey.",coordinates:{x:23,y:167},type:"NPC",npcName:"Jonas",npcSprite:"left",message:"Hop in, let's head back to town. I'll drive you there myself. It's been quite the journey, hasn't it? But we're not done yet. There's still much to explore and learn about Bedrock. Let's continue your onboarding journey together.",tags:i},{id:"33",map:"town",title:"Talk with Jonas in the Stadium's backstage",description:"Jonas provides further insights into Bedrock's offerings as he prepares for a conference in the stadium.",coordinates:{x:16,y:45},type:"NPC",npcName:"Jonas",npcSprite:"left",message:"Welcome to the stadium private backstage area. Feel free to explore and make yourself comfortable. As for me, I've got a conference to prepare for. I'm afraid I must leave you here for now. Time is of the essence, and I'm running a bit behind schedule. But don't worry, you're in good hands. Enjoy your time backstage, you might find some useful information here!",tags:i},{id:"34",map:"town",title:"Explore Backstage Content",description:"Take a look at the backstage content now that it's accessible.",coordinates:{x:26,y:43},type:"content",url:"https://workadventu.re/?cell=J75",tags:i},{id:"35",map:"town",title:"Leave Backstage Area",description:"Exit the backstage area and begin your exploration of Bedrock's facilities.",coordinates:{x:29,y:52},type:"direction",tags:i},{id:"36",map:"town",title:"Farewell to Jonas",description:"It's time to bid farewell to Jonas, the guiding presence throughout your Bedrock journey.",coordinates:{x:19,y:54},type:"NPC",npcName:"Jonas",npcSprite:"front",message:"Well, it seems our journey together is coming to an end. I hope this onboarding experience has been illuminating for you. Remember, every step you take here contributes to the tapestry of Bedrock's success. Now, I must attend to some final preparations for a keynote presentation. Thank you for your time, and best of luck on your endeavors ahead. Farewell!",tags:i},{id:"37",map:"town",title:"Visit the Stadium",description:"Explore the stadium and its features, including a visioconference tool on the stage and front-row seats.",coordinates:{x:20,y:60},type:"direction",tags:i},{id:"38",map:"town",title:"Enjoy Arcade Games",description:"Visit the Arcade building and enjoy classic games like Pong and Super Mario!",coordinates:{x:17,y:104},type:"direction"},{id:"39",map:"town",title:"Explore the Wikitek",description:"Discover valuable resources in the Wikitek, a modern glass library filled with information.",coordinates:{x:79,y:103},type:"direction",tags:i},{id:"40",map:"town",title:"Your Contacts",description:"Access essential information about your contacts within the company.",coordinates:{x:79,y:101},type:"content",url:"https://workadventu.re/?cell=B29",tags:f},{id:"41",map:"town",title:"Your Daily Tools",description:"Access a curated collection of productivity tools to streamline your workflow.",coordinates:{x:88,y:100},type:"content",url:"https://workadventu.re/?cell=B30",tags:f},{id:"42",map:"town",title:"HR System",description:"Access detailed information about HR processes, policies, and procedures.",coordinates:{x:71,y:100},type:"content",url:"https://workadventu.re/?cell=B31",tags:f},{id:"40",map:"town",title:"Your Contacts",description:"Access essential information about your contacts within the company.",coordinates:{x:79,y:101},type:"content",url:"https://workadventu.re/?cell=C29",tags:["pt"]},{id:"41",map:"town",title:"Your Daily Tools",description:"Access a curated collection of productivity tools to streamline your workflow.",coordinates:{x:88,y:100},type:"content",url:"https://workadventu.re/?cell=C30",tags:["pt"]},{id:"42",map:"town",title:"HR System",description:"Access detailed information about HR processes, policies, and procedures.",coordinates:{x:71,y:100},type:"content",url:"https://workadventu.re/?cell=C31",tags:["pt"]},{id:"40",map:"town",title:"Your Contacts",description:"Access essential information about your contacts within the company.",coordinates:{x:79,y:101},type:"content",url:"https://workadventu.re/?cell=D29",tags:["alt"]},{id:"41",map:"town",title:"Your Daily Tools",description:"Access a curated collection of productivity tools to streamline your workflow.",coordinates:{x:88,y:100},type:"content",url:"https://workadventu.re/?cell=D30",tags:["alt"]},{id:"42",map:"town",title:"HR System",description:"Access detailed information about HR processes, policies, and procedures.",coordinates:{x:71,y:100},type:"content",url:"https://workadventu.re/?cell=D31",tags:["alt"]},{id:"40",map:"town",title:"Your Contacts",description:"Access essential information about your contacts within the company.",coordinates:{x:79,y:101},type:"content",url:"https://workadventu.re/?cell=E29",tags:["ext"]},{id:"41",map:"town",title:"Your Daily Tools",description:"Access a curated collection of productivity tools to streamline your workflow.",coordinates:{x:88,y:100},type:"content",url:"https://workadventu.re/?cell=E30",tags:["ext"]},{id:"43",map:"town",title:"Check out the Streaming Wall",description:"Visit the Streaming Wall building and watch videos showcasing Bedrock's customers and their experiences.",coordinates:{x:70,y:35},type:"direction",tags:i},{id:"44",map:"town",title:"Visit HR",description:"Visiting the HR building!",coordinates:{x:81,y:67},type:"direction"},{id:"45",map:"town",title:"Bedrock News Billboard",description:"Complete your journey by discoving the latest news and updates about Bedrock!",coordinates:{x:35,y:93},type:"content",url:"https://workadventu.re/?cell=X"}];async function ce(){const e=await T();if(e.length>1)console.log("Existing player. Checkpoint IDs: ",e),L(R(e));else return console.log("New player."),N(["0"]),["0"];return e}function R(e){if(e.length===1&&e[0]==="0")return"1";const t=e.map(Number);t.sort((n,s)=>n-s);let o=t.indexOf(1);if(o===-1)return"-1";let r=o;for(;r+1<t.length&&t[r+1]===t[r]+1;)r++;return(t[r]+1).toString()}function de(e,t){return e.includes(t)}function ue(e){return e.includes("2")}function pe(e){return e.includes("4")}function he(e){return e.includes("7")}function me(e){return e.includes("21")}function j(e){return e.includes("34")}function ye(e){return parseInt(e,10)>2}function ge(e){return parseInt(e,10)>34}async function fe(){let e=[];const t=await WA.player.state.checklist;return t?e=t:B(e),e}function B(e){WA.player.state.checklist=e}async function T(){let e=[];const t=await WA.player.state.checkpointIds;return t?e=t:N(e),e}function N(e){WA.player.state.checkpointIds=e}async function D(e){x();let t=await T();de(t,e)?console.log("(State: unchanged) Old checkpoint passed",e):(console.log("(State: update) New checkpoint passed",e),t.push(e),N(t),await we(e),await ve(e),L(R(t)))}async function we(e){let t=await fe();const o=t.findIndex(r=>r.id===e);t[o].done=o!==-1,B(t)}async function ve(e){switch(e){case"2":const t=await T();S(t);break;case"4":const o=E(),r=ne(o);r?O(r):k(b);break}}export{xe as a,Be as b,J as c,ke as d,Te as e,T as g,Ce as i,q as o,D as p,be as t};