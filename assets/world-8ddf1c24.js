console.log("World script started successfully");let s=!1;async function l(){const o=await WA.room.area.get("roof");WA.room.area.onEnter("to-tour-rooftop").subscribe(()=>{window.parent.postMessage({type:"cameraSet",data:{x:o.x,y:o.y,width:1e3,height:1e3,lock:!0,smooth:!0,duration:2e4}},"*"),setTimeout(()=>{WA.nav.goToRoom("#roof")},1e4)}),i(["ext","0","1","2","3","4","roof"]),a("cave")}function i(o){for(let e=0;e<o.length-1;e++){const r=o[e],t=o[e+1];n(r,t)}for(let e=o.length-1;e>0;e--){const r=o[e],t=o[e-1];n(r,t)}}function n(o,e){WA.room.area.onEnter(`${o}-${e}`).subscribe(()=>{WA.nav.goToRoom(`#from-${o}-${e}`),WA.room.hideLayer(`tour/${o}`),WA.room.showLayer(`tour/${e}`)})}function a(o){WA.room.area.onEnter(`${o}Door`).subscribe(()=>{s===!0?(s=!1,WA.room.hideLayer(`roofs/${o}1`),WA.room.hideLayer(`roofs/${o}2`)):(s=!0,WA.room.showLayer(`roofs/${o}1`),WA.room.showLayer(`roofs/${o}2`))})}export{l as i};
