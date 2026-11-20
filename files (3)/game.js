const cv=document.getElementById('c'),ctx=cv.getContext('2d'),W=360,BH=28,$=id=>document.getElementById(id);let H=600,BASE=H-60;
const PL=[{n:'القمر',a:'#f3f3f0',b:'#9a9aa0',crat:1,sp:'#26305a'},{n:'عطارد',a:'#c9b6a0',b:'#6f5b49',crat:1,sp:'#3a2d25'},{n:'الزهرة',a:'#ffd89a',b:'#c78a3a',sp:'#5a3a15'},{n:'المريخ',a:'#ff9a6b',b:'#a83a1f',crat:1,sp:'#4a1810'},{n:'سيريس',a:'#d8d4cc',b:'#7a746a',crat:1,sp:'#2a2a34'},{n:'المشتري',a:'#f0d2a6',b:'#a8723a',bands:1,sp:'#4a3015'},{n:'يوروبا',a:'#f2eadb',b:'#b39a78',sp:'#1d2a4a'},{n:'زحل',a:'#f5e2b0',b:'#b89a5a',ring:1,bands:1,sp:'#4a3d1f'},{n:'تيتان',a:'#ffcf7a',b:'#b5772a',sp:'#4a3410'},{n:'أورانوس',a:'#b5f0f5',b:'#4aa7b5',ring:1,sp:'#133a45'},{n:'نبتون',a:'#7aa0ff',b:'#2a3fa8',bands:1,sp:'#141c55'},{n:'بلوتو',a:'#e6d2c4',b:'#8a6e62',crat:1,sp:'#2e2038'},{n:'السديم',neb:1,a:'#ff6ad5',sp:'#3a1160'},{n:'الثقب الأسود',bh:1,a:'#ff9a3a',sp:'#120a1c'},{n:'المجرة',gal:1,a:'#ffd6f8',sp:'#4a1670'}];
const HUE=[200,25,40,10,50,30,190,45,330,185,225,320,270,20,300];
const GOALS=[50,50,55,55,60,60,65,70,70,75,80,85,90,95,100],N=PL.length;
const GN=['المدينة','الصحراء','الغابة','الثلج','البحر','الجبال','البركان','الريف'];
const GC=['#17103a','#c9a35a','#1f4d2b','#e8f0ff','#1b5a8a','#3b3b4a','#2a1210','#3d7a35'];
const RAD=[6,0,12];
let S={coins:0,unlocked:0,stars:Array(N).fill(0)};
try{const j=JSON.parse(localStorage.getItem('stack-save3'));if(j&&j.stars&&j.stars.length===N)S=Object.assign(S,j)}catch(e){}
function save(){try{localStorage.setItem('stack-save3',JSON.stringify(S))}catch(e){}}
let climbS=0,blocks=[],cur,deb=[],pops=[],parts=[],floors=0,perfects=0,combo=0,runCont=0,cam=0,st='menu',AC,last=0,lvl=0,ban=0,btxt='',flash=0,alt=0,t=0;
const city=[];for(let x=0;x<W;x+=34)city.push({x:x+Math.random()*6,w:22+Math.random()*16,h:40+Math.random()*90});
const clouds=[[40,110,1],[210,190,.7],[120,300,.85],[300,380,.6]];
const hx=c=>[1,3,5].map(i=>parseInt(c.substr(i,2),16));
const mix=(a,b,k)=>{const A=hx(a),B=hx(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*k))+')'};
function beep(f,d,ty,v){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const o=AC.createOscillator(),g=AC.createGain();o.type=ty||'square';o.frequency.value=f;g.gain.value=v||.05;g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function jingle(a){a.forEach((f,i)=>setTimeout(()=>beep(f,.15,'triangle',.06),i*90))}
function hud(){$('sc').textContent=floors+'/'+GOALS[lvl];$('lvt').textContent='المستوى '+(lvl+1)+' · '+GN[lvl%8]+' ← '+PL[lvl].n+' · 🪙 '+S.coins;$('pgi').style.width=Math.min(100,floors/GOALS[lvl]*100)+'%'}
function showOv(h){$('ov').innerHTML=h;$('ov').classList.remove('hide')}
function showMenu(){st='menu';let g='';PL.forEach((l,i)=>{const lock=i>S.unlocked;g+='<button class="lv" data-a="lv" data-i="'+i+'"'+(lock?' disabled':'')+'>'+(i+1)+'<br>'+l.n+'<br>'+(lock?'🔒':'★'.repeat(S.stars[i])+'☆'.repeat(3-S.stars[i]))+'</button>'});
 showOv('<h1>برج الأحلام 🏗️</h1><p>ابنِ من الأرض لحد الكوكب! 15 مستوى، كل واحد بمكان وكوكب مختلف 🪐<br>بعد كل 15 طابق بتزيد السرعة ⚡<br>اجمع نقاط 🪙 عشان تكمّل من مكان ما خسرت. رصيدك: <b>🪙 '+S.coins+'</b></p><div class="grid">'+g+'</div>')}
function w0(){return Math.max(120,200-lvl*6)}
function newCur(){const tp=blocks[blocks.length-1];cur={x:Math.random()<.5?0:W-tp.w,w:tp.w,dir:Math.random()<.5?1:-1,h:(HUE[lvl]+blocks.length*7)%360}}
function startLevel(i){lvl=i;const w=w0();blocks=[{x:(W-w)/2,w:w,h:HUE[i]}];deb=[];pops=[];parts=[];floors=0;perfects=0;combo=0;runCont=0;cam=0;alt=0;climbS=BH;ban=2.4;btxt='المستوى '+(i+1)+' · من '+GN[i%8]+' إلى '+PL[i].n;flash=.25;newCur();st='play';$('ov').classList.add('hide');hud()}
function lose(){st='over';beep(120,.5,'sawtooth');setTimeout(()=>{const cost=15*(runCont+1),ok=S.coins>=cost;
 showOv('<h1>وقع البرج!</h1><p class="msg">وصلت لـ '+floors+' من '+GOALS[lvl]+' طابق</p><p>نقاطك: 🪙 '+S.coins+'</p><button data-a="cont"'+(ok?'':' disabled')+'>كمّل من مكانك (🪙 '+cost+')</button>'+(ok?'':'<p>ناقصك '+(cost-S.coins)+' نقطة، العب أكتر لتجمع!</p>')+'<button class="sec" data-a="retry">ابدأ المستوى من جديد</button><button class="sec" data-a="menu">القائمة</button>')},500)}
function cont(){const cost=15*(runCont+1);if(S.coins<cost)return;S.coins-=cost;save();runCont++;combo=0;st='play';$('ov').classList.add('hide');newCur();hud()}
function win(){st='won';const r=perfects/GOALS[lvl],stars=r>=.4?3:r>=.2?2:1,reward=20+perfects*2+stars*10,chest=stars===3?40+Math.floor(Math.random()*61):0,fin=lvl>=N-1;
 S.coins+=reward+chest;S.stars[lvl]=Math.max(S.stars[lvl],stars);S.unlocked=Math.max(S.unlocked,Math.min(N-1,lvl+1));save();flash=.4;jingle([523,659,784,1046]);hud();
 setTimeout(()=>showOv('<h1>'+(fin?'وصلت لآخر مجرة! 🏆':'وصلت إلى '+PL[lvl].n+'! 🎉')+'</h1><div class="stars">'+'★'.repeat(stars)+'☆'.repeat(3-stars)+'</div><p>🪙 جائزة المستوى: +'+reward+'</p>'+(chest?'<p class="msg">🎁 صندوق مفاجأة: +'+chest+' نقطة!</p>':'<p>اعمل 3 نجوم لتفتح صندوق مفاجأة 🎁</p>')+(fin?'':'<button data-a="next">المستوى التالي ▶</button>')+'<button class="sec" data-a="retry">إعادة المستوى</button><button class="sec" data-a="share">تحدّى صاحبك 🔥</button><button class="sec" data-a="menu">القائمة</button>'),800)}
function drop(){if(st!=='play')return;const tp=blocks[blocks.length-1],ov=Math.min(cur.x+cur.w,tp.x+tp.w)-Math.max(cur.x,tp.x);
 if(ov<=2){deb.push({x:cur.x,w:cur.w,y:blocks.length,vy:0,h:cur.h});return lose()}
 let nb,good=Math.abs(cur.x-tp.x)<Math.max(4,10-Math.floor(lvl/2));
 if(good){combo++;perfects++;nb={x:tp.x,w:cur.w,h:cur.h};if(combo>=3)nb.w=Math.min(w0(),nb.w+6);pops.push({t:combo>1?'ممتاز x'+combo:'ممتاز!',l:1,y:blocks.length});beep(700+Math.min(combo,8)*60,.12,'triangle');
  for(let i=0;i<14;i++)parts.push({x:nb.x+nb.w/2,y:yOf(blocks.length),vx:(Math.random()-.5)*280,vy:-Math.random()*240,l:.7})}
 else{combo=0;const nx=Math.max(cur.x,tp.x);nb={x:nx,w:ov,h:cur.h};
  const cx=cur.x<tp.x?cur.x:tp.x+tp.w,cw=cur.x<tp.x?tp.x-cur.x:cur.x+cur.w-(tp.x+tp.w);deb.push({x:cx,w:cw,y:blocks.length,vy:0,h:cur.h});beep(420,.08)}
 blocks.push(nb);floors++;S.coins+=good?3:1;
 if(floors%15===0&&floors<GOALS[lvl]){ban=1.8;btxt='⚡ زادت السرعة!';jingle([440,660,880])}
 else if(floors%10===0&&floors<GOALS[lvl]){S.coins+=10;pops.push({t:'+10 نقاط 🪙',l:1.4,y:blocks.length+1})}
 save();hud();if(floors>=GOALS[lvl])return win();newCur()}
async function share(b){const txt='وصلت إلى '+PL[lvl].n+' ببرج الأحلام 🏗️🪐 بتغلبني؟';
 try{if(navigator.share){await navigator.share({text:txt,url:location.href});return}}catch(_){}
 try{await navigator.clipboard.writeText(txt+' '+location.href);b.textContent='انسخ ✓'}catch(_){b.textContent='صوّر النتيجة وابعتها 😉'}}
$('ov').onclick=e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;e.stopPropagation();const a=b.dataset.a;
 if(a==='lv')startLevel(+b.dataset.i);else if(a==='retry')startLevel(lvl);else if(a==='next')startLevel(lvl+1);else if(a==='menu')showMenu();else if(a==='cont')cont();else if(a==='share')share(b)};
const wrap=document.querySelector('.wrap');
wrap.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;e.preventDefault();drop()});
wrap.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();drop()}});
function yOf(i){return BASE-i*BH+cam}
function update(dt){
 t+=dt;flash=Math.max(0,flash-dt);ban=Math.max(0,ban-dt);
 const target=st==='menu'?0:Math.min(1,floors/GOALS[lvl]);alt+=(target-alt)*Math.min(1,dt*2);
 if(st==='play'){const step=Math.floor(floors/15),sp=Math.min(340,78+lvl*7+step*24+(floors%15)*.8);cur.x+=cur.dir*sp*dt;if(cur.x<0){cur.x=0;cur.dir=1}if(cur.x>W-cur.w){cur.x=W-cur.w;cur.dir=-1}}
 const tgt=Math.max(0,(blocks.length-6)*BH);cam+=(tgt-cam)*Math.min(1,dt*6);climbS+=(blocks.length*BH-climbS)*Math.min(1,dt*5);
 for(const d of deb){d.vy+=1400*dt;d.y-=d.vy*dt/BH}deb=deb.filter(d=>yOf(d.y)<H+60);
 for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.l-=dt}parts=parts.filter(p=>p.l>0);
 for(const p of pops)p.l-=dt;pops=pops.filter(p=>p.l>0)}
function rr(x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
const SD=[];for(let i=0;i<70;i++)SD.push({x:Math.random()*W,y:Math.random()*H,f:[.06,.14,.28][i%3],s:[1,1.6,2.4][i%3]});
const CL=[];for(let i=0;i<9;i++)CL.push({x:Math.random()*W,y:Math.random()*(H+160),f:.25+Math.random()*.65,v:4+Math.random()*10});
const OB=[];for(let i=0;i<16;i++)OB.push({x:Math.random()*W,y:Math.random()*(H+160),f:.25+Math.random()*.6,k:i%4,r:Math.random()*6,v:(Math.random()-.5)*14});
const zn=(c,w)=>Math.max(0,1-Math.abs(alt-c)/w);
function stars3d(sa){const v=Math.min(24,Math.abs(blocks.length*BH-climbS)*.35);ctx.strokeStyle='#fff';
 for(const s of SD){const y=((s.y+climbS*s.f)%H+H)%H;ctx.globalAlpha=sa*(.5+.5*Math.sin(t*2+s.x));ctx.lineWidth=s.s;ctx.beginPath();ctx.moveTo(s.x,y);ctx.lineTo(s.x,y-v*s.f*3-.1);ctx.stroke()}ctx.globalAlpha=1}
function objs3d(){const za=Math.max(0,1-alt*2.6);
 if(za>0){ctx.fillStyle='#fff';for(const c of CL){const s=.5+c.f*1.1,y=((c.y+climbS*c.f)%(H+160)+H+160)%(H+160)-80,x=((c.x+t*c.v)%(W+160)+W+160)%(W+160)-80;ctx.globalAlpha=za*(.3+.5*c.f);ctx.beginPath();ctx.arc(x,y,16*s,0,7);ctx.arc(x+18*s,y+3*s,12*s,0,7);ctx.arc(x-17*s,y+4*s,11*s,0,7);ctx.fill()}ctx.globalAlpha=1}
 for(const o of OB){const a=zn([.06,.2,.55,.82][o.k],[.22,.2,.22,.3][o.k]);if(a<=0)continue;const s=.6+o.f,y=((o.y+climbS*o.f)%(H+160)+H+160)%(H+160)-80,x=((o.x+t*o.v*(o.k===1?4:1))%(W+80)+W+80)%(W+80)-40;ctx.globalAlpha=a;
  if(o.k===0){const fl=Math.sin(t*8+o.r)*2;ctx.strokeStyle='#223';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-7*s,y-3*s+fl);ctx.lineTo(x,y);ctx.lineTo(x+7*s,y-3*s+fl);ctx.stroke()}
  else if(o.k===1){ctx.fillStyle='#fff';ctx.fillRect(x-16*s,y-2*s,32*s,4*s);ctx.fillRect(x-4*s,y-7*s,8*s,14*s);ctx.fillStyle='#e44';ctx.fillRect(x+12*s,y-2*s,4*s,4*s)}
  else if(o.k===2){ctx.fillStyle='#9aa7b8';ctx.fillRect(x-5*s,y-5*s,10*s,10*s);ctx.fillStyle='#3a6bff';ctx.fillRect(x-20*s,y-3*s,13*s,6*s);ctx.fillRect(x+7*s,y-3*s,13*s,6*s)}
  else{const r=7+12*o.f,g=ctx.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);g.addColorStop(0,'#cdbfae');g.addColorStop(1,'#4a3f36');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
 }ctx.globalAlpha=1}
function blk3(x,y,w,h,a,glow){ctx.globalAlpha=a==null?1:a;const d=9,hh=BH-2;
 if(glow){ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=14}
 ctx.fillStyle='hsl('+h+',80%,58%)';ctx.fillRect(x,y,w,hh);ctx.shadowBlur=0;
 ctx.fillStyle='hsl('+h+',88%,76%)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+d,y-d);ctx.lineTo(x+w+d,y-d);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
 ctx.fillStyle='hsl('+h+',65%,38%)';ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+d,y-d);ctx.lineTo(x+w+d,y+hh-d);ctx.lineTo(x+w,y+hh);ctx.closePath();ctx.fill();
 const k=lvl%3;ctx.fillStyle='rgba(255,255,255,.28)';
 if(k===0)ctx.fillRect(x+4,y+4,w-8,4);else if(k===1)ctx.fillRect(x,y+hh*.4,w,3);else for(let q=x+8;q<x+w-6;q+=16)ctx.fillRect(q,y+8,6,9);
 ctx.globalAlpha=1}
function blk(x,y,w,h,a,glow){if(y<-BH||y>H)return;return blk3(x,y,w,h,a,glow);ctx.globalAlpha=a==null?1:a;if(glow){ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=12}
 const g=ctx.createLinearGradient(0,y,0,y+BH);g.addColorStop(0,'hsl('+h+',85%,70%)');g.addColorStop(1,'hsl('+h+',70%,50%)');ctx.fillStyle=g;rr(x,y,w,BH-2,RAD[lvl%3]);ctx.fill();
 if(lvl%3===1){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,w-2,BH-4)}ctx.shadowBlur=0;ctx.globalAlpha=1}
function planet(P,x,y,r){ctx.save();
 if(P.neb){[['#ff6ad5',0,0,1],['#6a7bff',.5,.3,.8],['#4affd8',-.5,.2,.7]].forEach(c=>{const g=ctx.createRadialGradient(x+c[1]*r,y+c[2]*r,0,x+c[1]*r,y+c[2]*r,r*c[3]*1.6);g.addColorStop(0,c[0]+'cc');g.addColorStop(1,c[0]+'00');ctx.fillStyle=g;ctx.fillRect(x-r*2.5,y-r*2.5,r*5,r*5)});ctx.restore();return}
 if(P.bh){ctx.strokeStyle='#ff9a3a';ctx.shadowColor='#ff9a3a';ctx.shadowBlur=r*.8;ctx.lineWidth=r*.2;ctx.beginPath();ctx.ellipse(x,y,r*1.6,r*.5,-.3,0,7);ctx.stroke();ctx.fillStyle='#000';ctx.shadowBlur=0;ctx.beginPath();ctx.arc(x,y,r*.85,0,7);ctx.fill();ctx.restore();return}
 if(P.gal){ctx.translate(x,y);ctx.rotate(t*.1);for(let i=0;i<3;i++){ctx.rotate(1.05);const g=ctx.createRadialGradient(0,0,0,0,0,r*1.8);g.addColorStop(0,'#ffd6f8dd');g.addColorStop(1,'#7a3fff00');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,r*1.8,r*.5,0,0,7);ctx.fill()}ctx.restore();return}
 ctx.shadowColor=P.a;ctx.shadowBlur=r*.6;ctx.lineWidth=r*.16;ctx.strokeStyle='rgba(235,215,170,.85)';
 if(P.ring){ctx.beginPath();ctx.ellipse(x,y,r*1.7,r*.45,-.3,Math.PI,2*Math.PI);ctx.stroke()}
 const g=ctx.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,P.a);g.addColorStop(1,P.b);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.shadowBlur=0;
 ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.clip();ctx.fillStyle='rgba(0,0,0,.13)';
 if(P.bands)for(let i=-3;i<=3;i+=2)ctx.fillRect(x-r,y+i*r*.28,r*2,r*.16);
 if(P.crat)[[-.3,-.2,.18],[.25,.1,.22],[-.1,.4,.12]].forEach(c=>{ctx.beginPath();ctx.arc(x+c[0]*r,y+c[1]*r,c[2]*r,0,7);ctx.fill()});
 ctx.restore();if(P.ring){ctx.beginPath();ctx.ellipse(x,y,r*1.7,r*.45,-.3,0,Math.PI);ctx.stroke()}ctx.restore()}
function ground(gy){const k=lvl%8;
 if(k===0){ctx.fillStyle='rgba(15,10,45,.6)';for(const b of city)ctx.fillRect(b.x,gy-b.h,b.w,b.h);ctx.fillStyle='rgba(255,230,140,.7)';for(const b of city)for(let j=8;j<b.h-6;j+=14)ctx.fillRect(b.x+4,gy-b.h+j,3,5)}
 else if(k===1){ctx.fillStyle='#b88a3c';for(let x=-20;x<W+20;x+=90){ctx.beginPath();ctx.moveTo(x,gy);ctx.quadraticCurveTo(x+45,gy-60,x+90,gy);ctx.fill()}ctx.fillStyle='#8a6428';ctx.beginPath();ctx.moveTo(250,gy);ctx.lineTo(290,gy-80);ctx.lineTo(330,gy);ctx.fill()}
 else if(k===2){ctx.fillStyle='#14361d';for(const b of city){ctx.beginPath();ctx.moveTo(b.x-b.w/2,gy);ctx.lineTo(b.x+b.w/2,gy-b.h*1.1);ctx.lineTo(b.x+b.w*1.5,gy);ctx.fill()}}
 else if(k===3){ctx.fillStyle='#cfdcf0';for(let x=-30;x<W+30;x+=110){ctx.beginPath();ctx.moveTo(x,gy);ctx.quadraticCurveTo(x+55,gy-70,x+110,gy);ctx.fill()}ctx.fillStyle='#9fb6d8';for(const b of city){ctx.beginPath();ctx.moveTo(b.x,gy);ctx.lineTo(b.x+b.w/2,gy-b.h*.5);ctx.lineTo(b.x+b.w,gy);ctx.fill()}}
 else if(k===4){ctx.fillStyle='#2a7ab5';ctx.fillRect(0,gy-18,W,18);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;for(let x=-(t*20)%40;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,gy-9);ctx.quadraticCurveTo(x+10,gy-16,x+20,gy-9);ctx.stroke()}}
 else if(k===5){for(let x=-40;x<W+40;x+=120){ctx.fillStyle='#55556a';ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x+60,gy-110);ctx.lineTo(x+120,gy);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(x+48,gy-88);ctx.lineTo(x+60,gy-110);ctx.lineTo(x+72,gy-88);ctx.fill()}}
 else if(k===6){ctx.fillStyle='#4a2a20';ctx.beginPath();ctx.moveTo(60,gy);ctx.lineTo(180,gy-130);ctx.lineTo(300,gy);ctx.fill();ctx.fillStyle='#ff6a2a';ctx.shadowColor='#ff6a2a';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(180,gy-130,12,0,7);ctx.fill();ctx.shadowBlur=0}
 else{ctx.fillStyle='#4f9a45';for(let x=-30;x<W+30;x+=100){ctx.beginPath();ctx.moveTo(x,gy);ctx.quadraticCurveTo(x+50,gy-50,x+100,gy);ctx.fill()}for(let x=30;x<W;x+=110){ctx.fillStyle='#c45a3a';ctx.fillRect(x,gy-20,22,20);ctx.fillStyle='#7a2f1f';ctx.beginPath();ctx.moveTo(x-3,gy-20);ctx.lineTo(x+11,gy-34);ctx.lineTo(x+25,gy-20);ctx.fill()}}
 ctx.fillStyle=GC[k];ctx.fillRect(0,gy,W,H)}
function draw(){
 const e=alt*alt*(3-2*alt),P=PL[lvl],sa=Math.max(0,Math.min(1,(alt-.3)/.4));
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,mix('#4aa8ff','#04030d',e));g.addColorStop(1,mix('#d6f1ff',P.sp,e));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 stars3d(sa);
 const so=Math.max(0,1-alt*1.6);if(so>0){ctx.globalAlpha=so;ctx.fillStyle='#fff3b0';ctx.shadowColor='#ffd166';ctx.shadowBlur=30;ctx.beginPath();ctx.arc(60,110,30,0,7);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1}
 planet(P,275,110-e*10,10+e*52);
 objs3d();
 const gy=yOf(0)+BH-2;if(gy<H+140)ground(gy);
 blocks.forEach((b,i)=>blk(b.x,yOf(i),b.w,b.h));
 if(st==='play'){const tp=blocks[blocks.length-1],y=yOf(blocks.length);
  if(lvl<3){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(tp.x,y-70);ctx.lineTo(tp.x,y+BH);ctx.moveTo(tp.x+tp.w,y-70);ctx.lineTo(tp.x+tp.w,y+BH);ctx.stroke();ctx.setLineDash([])}
  blk(cur.x,y,cur.w,cur.h,1,true)}
 for(const d of deb)blk(d.x,yOf(d.y),d.w,d.h,.8);
 ctx.fillStyle='#fff';for(const p of parts){ctx.globalAlpha=Math.max(0,p.l*1.4);ctx.fillRect(p.x,p.y,4,4)}ctx.globalAlpha=1;
 ctx.textAlign='center';ctx.font='800 24px Cairo,sans-serif';ctx.fillStyle='#ffd166';for(const p of pops){ctx.globalAlpha=Math.min(1,p.l*2);ctx.fillText(p.t,W/2,yOf(p.y)-10-(1-Math.min(1,p.l))*40)}ctx.globalAlpha=1;
 if(ban>0){ctx.globalAlpha=Math.min(1,ban);ctx.font='800 26px Cairo,sans-serif';ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=14;ctx.fillText(btxt,W/2,250);ctx.shadowBlur=0;ctx.globalAlpha=1}
 if(flash>0){ctx.fillStyle='#fff';ctx.globalAlpha=flash;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}}
function fit(){const w=wrap.clientWidth||360,h=wrap.clientHeight||600;H=Math.max(560,Math.min(820,Math.round(W*h/w)));BASE=H-60;cv.width=W;cv.height=H}
addEventListener('resize',fit);
function loop(ts){const dt=Math.min(.033,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(loop)}
fit();blocks=[{x:80,w:200,h:HUE[0]}];showMenu();hud();requestAnimationFrame(loop);
