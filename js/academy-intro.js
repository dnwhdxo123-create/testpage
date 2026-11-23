/* Five-second procedural point-cloud film. No external renderer or media downloads. */
(()=>{'use strict';
const root=document.querySelector('#academy-intro');if(!root)return;
const canvas=root.querySelector('canvas'),label=root.querySelector('[data-intro-name]'),caption=root.querySelector('[data-intro-caption]'),skip=root.querySelector('button'),progress=root.querySelector('[data-intro-progress]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,closed=false,timer=0,resizeObserver;const originalInert=new Map();
function finish(){if(closed)return;closed=true;cancelAnimationFrame(raf);clearTimeout(timer);clearTimeout(window.__academyIntroFallback);resizeObserver?.disconnect();document.removeEventListener('keydown',onKey);document.removeEventListener('visibilitychange',onVisibility);reduced.removeEventListener('change',onReduced);root.classList.add('intro-finished');document.documentElement.classList.remove('academy-intro-active');for(const [el,inert] of originalInert){el.inert=inert;delete el.dataset.introLocked;}if(root.contains(document.activeElement))document.activeElement.blur();setTimeout(()=>root.remove(),450);}
function onKey(e){if(e.key==='Escape'){e.preventDefault();finish();}}
function onReduced(e){if(e.matches)finish();}
let started=performance.now();function onVisibility(){if(!document.hidden&&performance.now()-started>=5000)finish();}
skip.addEventListener('click',finish);document.addEventListener('keydown',onKey);document.addEventListener('visibilitychange',onVisibility);reduced.addEventListener('change',onReduced);
if(reduced.matches){finish();return;}
root.hidden=false;
try{
const ctx=canvas.getContext('2d',{alpha:false});if(!ctx){finish();return;}
for(const el of document.querySelectorAll('#app,.academy-footer,.mobile-consult-bar,.quick-contact')){originalInert.set(el,el.inert);if(!el.inert)el.dataset.introLocked='true';el.inert=true;}
skip.focus({preventScroll:true});
let width=innerWidth,height=innerHeight,dpr=1;function resize(){width=root.clientWidth;height=root.clientHeight;dpr=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(root);
let seed=23719;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const models=[[],[],[]];
function point(model,x,y,z,color=0){model.push({x,y,z,color});}
function box(model,cx,cy,cz,sx,sy,sz,color=0,step=.13){for(let a=-sx/2;a<=sx/2+.001;a+=step)for(let b=-sy/2;b<=sy/2+.001;b+=step){point(model,cx+a,cy+b,cz-sz/2,color);point(model,cx+a,cy+b,cz+sz/2,color);}for(let a=-sx/2;a<=sx/2+.001;a+=step)for(let c=-sz/2;c<=sz/2+.001;c+=step){point(model,cx+a,cy-sy/2,cz+c,color);point(model,cx+a,cy+sy/2,cz+c,color);}for(let b=-sy/2;b<=sy/2+.001;b+=step)for(let c=-sz/2;c<=sz/2+.001;c+=step){point(model,cx-sx/2,cy+b,cz+c,color);point(model,cx+sx/2,cy+b,cz+c,color);}}
function sphere(model,cx,cy,cz,rx,ry,rz,color=0){for(let v=.08;v<Math.PI;v+=.14)for(let u=0;u<Math.PI*2;u+=.13)point(model,cx+rx*Math.sin(v)*Math.cos(u),cy+ry*Math.cos(v),cz+rz*Math.sin(v)*Math.sin(u),color);}
function line(model,a,b,color=1,step=.08){const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])/step);for(let i=0;i<=n;i++){const t=i/n;point(model,...a.map((v,k)=>v+(b[k]-v)*t),color);}}
// Desktop workstation: illuminated monitor, keyboard, tower and mouse.
const pc=models[0];box(pc,-.45,.65,0,3.5,2.15,.24,0,.10);box(pc,-.45,.65,.14,3.22,1.88,.025,1,.15);box(pc,-.45,-.64,0,.21,.65,.24);box(pc,-.45,-.97,.12,1.25,.12,.65);box(pc,-.35,-1.16,1.05,3.3,.12,1.03,0,.12);box(pc,2,-.18,-.12,.85,2.4,1.15,0,.12);sphere(pc,1.85,-1.13,1.22,.29,.11,.43,1);for(let i=0;i<6;i++)line(pc,[-1.7,.2+i*.22,.17],[-.5+(i%3)*.4,.2+i*.22,.17],2);line(pc,[.4,.18,.17],[.75,.5,.17],1);line(pc,[.75,.5,.17],[.4,.85,.17],1);sphere(pc,2,.5,.47,.16,.16,.03,2);
// Friendly AI robot with a dark visor, cyan eyes, antenna and articulated arms.
const bot=models[1];sphere(bot,0,.97,0,1.05,.77,.66,0);box(bot,0,.97,.59,1.55,.58,.13,1,.09);sphere(bot,-.4,1.03,.72,.12,.16,.05,2);sphere(bot,.4,1.03,.72,.12,.16,.05,2);box(bot,0,-.35,0,1.45,1.65,.86,0,.11);box(bot,0,-.22,.47,.7,.55,.05,1,.10);sphere(bot,0,-.22,.53,.18,.18,.03,2);box(bot,-1.18,-.35,0,.42,1.36,.46);box(bot,1.18,-.35,0,.42,1.36,.46);sphere(bot,-1.18,-1.04,.05,.27,.26,.26,1);sphere(bot,1.18,-1.04,.05,.27,.26,.26,1);box(bot,-.43,-1.48,0,.48,.65,.52);box(bot,.43,-1.48,0,.48,.65,.52);line(bot,[0,1.67,0],[0,2.03,0],1);sphere(bot,0,2.08,0,.13,.13,.13,2);
// Autonomous car, modeled as a long chassis with a cabin, four tires and lidar.
const car=models[2];box(car,0,-.55,0,4.5,.63,1.85,0,.12);box(car,-.12,.1,-.02,2.45,.8,1.65,0,.12);box(car,-.12,.16,.84,2.15,.48,.025,1,.11);box(car,-.12,.16,-.86,2.15,.48,.025,1,.11);for(const x of [-1.48,1.48])for(const z of [-.98,.98]){for(let r=.25;r<=.51;r+=.12)for(let a=0;a<Math.PI*2;a+=.12){point(car,x+r*Math.cos(a),-.83+r*Math.sin(a),z,1);point(car,x+r*Math.cos(a),-.83+r*Math.sin(a),z+Math.sign(z)*.12,0);}}for(const z of [-.58,.58])box(car,2.27,-.42,z,.04,.18,.36,2,.07);box(car,-.15,.62,0,.4,.16,.4,2,.09);line(car,[-2.26,-.44,-.7],[-2.26,-.44,.7],2);
const count=width<650?1600:3000;const targets=models.map(model=>{const out=[];for(let i=0;i<count;i++){const p=model[Math.floor(rand()*model.length)];out.push({...p});}return out;});
const dust=Array.from({length:count},()=>({x:(rand()-.5)*15,y:(rand()-.5)*10,z:(rand()-.5)*12,phase:rand()*6.28,size:.6+rand()*.9}));
const stars=Array.from({length:80},()=>({x:rand(),y:rand(),size:rand()*1.2+.25,phase:rand()*6.28}));
const palettes=[['#b5d7f1','#4aafff','#ffe39a'],['#c7e8f3','#51e4ee','#fff1b8'],['#b4d9f0','#3dabee','#ffe6a2']];
const sprites=palettes.map(p=>p.map(color=>{const s=document.createElement('canvas');s.width=s.height=24;const c=s.getContext('2d'),g=c.createRadialGradient(12,12,0,12,12,12);g.addColorStop(0,'#fff');g.addColorStop(.12,color);g.addColorStop(.3,color+'aa');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(0,0,24,24);return s;}));
const names=['COMPUTER','AI ROBOT','MOBILITY'];const captions=['아이디어를 구현하는 기술','가능성을 넓히는 인공지능','미래를 움직이는 새로운 경험'];let lastStage=-1;
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function project(x,y,z,angle){const c=Math.cos(angle),s=Math.sin(angle);let xx=x*c+z*s,zz=-x*s+z*c;const tilt=-.14;const yy=y*Math.cos(tilt)-zz*Math.sin(tilt);zz=y*Math.sin(tilt)+zz*Math.cos(tilt);const depth=8+zz;const scale=Math.min(width/7.3,height/6.9);const k=8/Math.max(2,depth);return{x:width*.5+xx*scale*k,y:height*.47-yy*scale*k,k,depth};}
function frame(now){if(closed)return;const elapsed=now-started,t=elapsed/1000;if(elapsed>=5000){finish();return;}
ctx.globalAlpha=1;ctx.fillStyle='#030914';ctx.fillRect(0,0,width,height);let aura=ctx.createRadialGradient(width*.5,height*.47,0,width*.5,height*.47,width*.55);aura.addColorStop(0,'#12345188');aura.addColorStop(.48,'#0a1c3233');aura.addColorStop(1,'#03091400');ctx.fillStyle=aura;ctx.fillRect(0,0,width,height);
for(const star of stars){ctx.globalAlpha=.15+.2*(.5+.5*Math.sin(t+star.phase));ctx.fillStyle='#b4d8ef';ctx.fillRect(star.x*width,star.y*height,star.size,star.size);}ctx.globalAlpha=1;
const angle=-.38+Math.sin(t*.7)*.18;ctx.strokeStyle='#325b7738';ctx.lineWidth=.7;for(let i=-9;i<=9;i++){const a=project(i,-1.95,-6,angle),b=project(i,-1.95,7,angle);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();const c=project(-9,-1.95,i,angle),d=project(9,-1.95,i,angle);ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.stroke();}
let stage=t<1.6?0:t<3.12?1:2;let from=targets[0],to=targets[0],mix=ease(t/.67),forming=t<.67;if(t>=1.12&&t<1.75){from=targets[0];to=targets[1];mix=ease((t-1.12)/.63);}else if(t>=1.75&&t<2.69){from=to=targets[1];mix=1;}else if(t>=2.69&&t<3.35){from=targets[1];to=targets[2];mix=ease((t-2.69)/.66);}else if(t>=3.35){from=to=targets[2];mix=1;}
const burst=ease((t-4.23)/.66);root.style.setProperty('--intro-progress',Math.min(1,t/5));root.classList.toggle('intro-reveal-brand',t>4.12);if(stage!==lastStage){lastStage=stage;label.textContent=names[stage];caption.textContent=captions[stage];root.querySelectorAll('[data-intro-stage]').forEach((el,i)=>el.classList.toggle('active',i===stage));}
ctx.globalCompositeOperation='lighter';const rendered=[];for(let i=0;i<count;i++){const a=forming?dust[i]:from[i],b=to[i],p=dust[i];const displace=(from!==to?Math.sin(mix*Math.PI)*.35:0);let x=a.x+(b.x-a.x)*mix+Math.sin(p.phase+t)*displace,y=a.y+(b.y-a.y)*mix+Math.cos(p.phase+t)*displace,z=a.z+(b.z-a.z)*mix;const jitter=.012*Math.sin(p.phase+t*2);x+=jitter;y+=jitter;const fly=burst*burst;x+=p.x*fly*1.8;y+=p.y*fly*1.8;z+=p.z*fly*2;const pos=project(x,y,z,angle);if(pos.x<0||pos.x>width||pos.y<0||pos.y>height)continue;rendered.push({pos,color:b.color,size:p.size,phase:p.phase});}
rendered.sort((a,b)=>b.pos.depth-a.pos.depth);for(const p of rendered){const size=Math.max(1.5,p.size*p.pos.k*(width<650?3.1:3.7));ctx.globalAlpha=(.58+.25*Math.sin(t*1.6+p.phase))*(1-burst*.9);ctx.drawImage(sprites[stage][p.color],p.pos.x-size,p.pos.y-size,size*2,size*2);}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
raf=requestAnimationFrame(frame);}
timer=setTimeout(finish,5000);raf=requestAnimationFrame(frame);
}catch(error){finish();}
})();