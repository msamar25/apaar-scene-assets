/* APAAR Document Desk — realistic three.js office scene (UNext).
   The approver reviews each certificate against Excel and approves or flags it;
   the review & resolve team fixes flagged ones and sends them on to the record shelf.
   Loaded on demand from jsDelivr together with ./models/*.glb; the page keeps its
   hand-written WebGL scene and the 2D SVG scene as fallbacks. */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {clone as cloneSkinned} from 'three/addons/utils/SkeletonUtils.js';

export const VERSION='1.0.0';
const HERE=new URL('./',import.meta.url).href;
const FONT='Inter,system-ui,-apple-system,Segoe UI,sans-serif';
const CAST=['approver','team1','team2'];
const LOGO_SVG='<svg width="321" height="85" viewBox="0 0 321 85" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6100_1739)"><path d="M24.9753 83.4466C17.9063 82.9723 12.1052 80.4101 7.57204 75.7597C2.52394 70.6634 8.91037e-06 63.5119 3.52692e-06 54.3054L0 14.2324H17.3788V51.9629C17.3788 57.3881 18.7442 61.5391 21.4751 64.4161C24.206 67.3752 27.9301 68.855 32.6472 68.855C37.4472 68.855 41.2539 67.3752 44.0676 64.4161C46.7985 61.5391 48.1642 57.3881 48.1642 51.9629V14.2324H65.5428V83.5278H24.9753V83.4466Z" fill="url(#paint0_linear_6100_1739)"/><path d="M65.5425 83.5281H24.9753V83.5052C37.8706 83.0513 48.184 72.5246 48.184 59.6051V14.2324H65.5425V83.5281ZM0.0305337 56.031C0.0102595 55.4642 5.13488e-08 54.889 0 54.3054V14.2324H0.0305337V56.031Z" fill="url(#paint1_linear_6100_1739)"/><path d="M304.432 61.7036V28.4263H319.947V14.147H304.432V0.320312H286.791V14.147H278.533V28.4263H286.791V61.5794C286.791 75.8174 294.173 82.9363 308.936 82.9363H319.947V68.2845H311.814C309.145 68.2845 307.226 67.7879 306.059 66.7944C304.974 65.7184 304.432 64.0212 304.432 61.7036Z" fill="#141414"/><path d="M252.24 83.4683L237.896 61.9729L225.189 83.4683H206.316L229.089 48.7255L206.064 14.2324H225.944L240.161 35.6032L252.995 14.2324H271.867L248.968 48.7255L272.119 83.4683H252.24Z" fill="#141414"/><path d="M212.687 47.4266C212.687 49.8497 212.524 52.0301 212.199 53.9686H162.803C163.21 58.8145 164.917 62.6106 167.926 65.3565C170.934 68.1025 174.634 69.4755 179.025 69.4755C185.367 69.4755 189.879 66.7699 192.563 61.3586H210.979C209.028 67.8197 205.287 73.1502 199.759 77.3501C194.23 81.469 187.44 83.5285 179.39 83.5285C172.886 83.5285 167.032 82.115 161.828 79.2882C156.705 76.3808 152.68 72.3023 149.753 67.0524C146.907 61.8028 145.484 55.7453 145.484 48.8804C145.484 41.9347 146.907 35.8368 149.753 30.5873C152.599 25.3375 156.583 21.2993 161.706 18.4726C166.828 15.6458 172.723 14.2324 179.39 14.2324C185.814 14.2324 191.546 15.6054 196.587 18.3514C201.71 21.0974 205.653 25.0145 208.418 30.1027C211.264 35.1102 212.687 40.8849 212.687 47.4266ZM195.002 42.5807C194.921 38.2195 193.335 34.7466 190.245 32.1622C187.155 29.4969 183.375 28.1643 178.903 28.1643C174.675 28.1643 171.097 29.4566 168.17 32.041C165.324 34.5447 163.576 38.058 162.925 42.5807H195.002Z" fill="#141414"/><path d="M110.992 14.2324C119.344 14.2381 126.094 16.8275 131.242 22.0005C136.396 27.097 138.973 34.2487 138.973 43.4552V83.5285H121.23V45.798C121.23 40.3728 119.836 36.2215 117.048 33.3445C114.259 30.3851 110.457 28.9055 105.641 28.9055C100.741 28.9055 96.8546 30.3851 93.982 33.3445C91.1937 36.2215 89.7994 40.3728 89.7994 45.798V83.5285H72.0566V14.2324H110.992Z" fill="#141414"/></g><defs><linearGradient id="paint0_linear_6100_1739" x1="32.767" y1="14.9311" x2="32.767" y2="82.7996" gradientUnits="userSpaceOnUse"><stop stop-color="#FF2A19"/><stop offset="1" stop-color="#FF8800"/></linearGradient><linearGradient id="paint1_linear_6100_1739" x1="32.7758" y1="82.8293" x2="32.7758" y2="14.9606" gradientUnits="userSpaceOnUse"><stop stop-color="#FF2A19"/><stop offset="1" stop-color="#FF8800"/></linearGradient><clipPath id="clip0_6100_1739"><rect width="320.156" height="83.4658" fill="white" transform="translate(0 0.320312)"/></clipPath></defs></svg>';

/* ---------------- models (shared by the login and dashboard scenes) ---------------- */
let modelsPromise=null;
export function preload(extraBases=[]){
  if(modelsPromise)return modelsPromise;
  const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const bases=[HERE,...extraBases.map(b=>new URL(b,location.href).href).filter(b=>b!==HERE)];
  const load=async name=>{let last;for(const base of bases){try{return await loader.loadAsync(new URL(`models/${name}.glb`,base).href)}catch(error){last=error}}throw last};
  modelsPromise=Promise.all(CAST.map(load)).then(list=>{const out={};list.forEach((gltf,i)=>{lockRoot(gltf.animations);out[CAST[i]]=gltf});return out});
  modelsPromise.catch(()=>{modelsPromise=null});
  return modelsPromise;
}
// Keep characters at their desks: drop the hips' horizontal drift (the clap clip walks forward 40 cm).
function lockRoot(clips){clips.forEach(clip=>clip.tracks.forEach(track=>{if(!/Hips\.position$/.test(track.name))return;const v=track.values;for(let i=0;i<v.length;i+=3){v[i]=0;v[i+2]=0}}))}

/* ---------------- small helpers ---------------- */
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),seg=(t,a,b)=>clamp((t-a)/(b-a)),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,back=t=>{const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const rr=(x,l,t,w,h,r)=>{x.beginPath();x.moveTo(l+r,t);x.arcTo(l+w,t,l+w,t+h,r);x.arcTo(l+w,t+h,l,t+h,r);x.arcTo(l,t+h,l,t,r);x.arcTo(l,t,l+w,t,r);x.closePath()};
function canvasTexture(w,h,draw,{srgb=true,repeat=null,aniso=4}={}){
  const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');const tex=new THREE.CanvasTexture(c);
  if(srgb)tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=aniso;if(repeat){tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(...repeat)}
  let key=null;tex.paint=(state={})=>{const k=JSON.stringify(state);if(k===key)return;key=k;ctx.clearRect(0,0,w,h);draw(ctx,state,w,h);tex.needsUpdate=true};tex.paint({});return tex;
}
const tick=(x,cx,cy,r,color,mark)=>{x.fillStyle=color;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=r*.28;x.lineCap='round';x.lineJoin='round';x.beginPath();if(mark==='!'){x.moveTo(cx,cy-r*.5);x.lineTo(cx,cy+r*.12);x.moveTo(cx,cy+r*.48);x.lineTo(cx,cy+r*.5)}else{x.moveTo(cx-r*.45,cy);x.lineTo(cx-r*.1,cy+r*.36);x.lineTo(cx+r*.5,cy-r*.32)}x.stroke()};

/* ---------------- textures ---------------- */
function makeTextures(){
  const T={};
  T.floor=canvasTexture(1024,1024,(x,s,w,h)=>{const plank=64;x.fillStyle='#d9bd94';x.fillRect(0,0,w,h);for(let r=0;r<h/plank;r++){let X=-((r*397)%300);for(let k=0;X<w;k++){const L=300+((r*131+k*71)%220);const tone=180+((r*37+k*53)%26);x.fillStyle=`rgb(${tone+28},${tone+6},${tone-30})`;x.fillRect(X,r*plank,L,plank);for(let g=0;g<7;g++){x.strokeStyle=`rgba(90,60,30,${.05+((g*13+r)%5)*.012})`;x.lineWidth=1+(g%2);x.beginPath();const gy=r*plank+6+g*8+((g*7+k)%5);x.moveTo(X,gy);x.bezierCurveTo(X+L*.3,gy+3,X+L*.6,gy-3,X+L,gy+1);x.stroke()}x.fillStyle='rgba(60,40,20,.25)';x.fillRect(X,r*plank,2,plank);X+=L}x.fillStyle='rgba(60,40,20,.22)';x.fillRect(0,r*plank,w,2)}},{repeat:[2.2,2.2],aniso:8});
  T.rug=canvasTexture(512,512,(x,s,w,h)=>{x.fillStyle='#3b4a5c';x.fillRect(0,0,w,h);x.strokeStyle='#c7cfd8';x.lineWidth=10;x.strokeRect(22,22,w-44,h-44);x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=2;for(let i=0;i<w;i+=8){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}x.fillStyle='rgba(249,115,22,.85)';x.fillRect(40,40,w-80,8);x.fillRect(40,h-48,w-80,8)});
  T.sky=canvasTexture(512,256,(x,s,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#9fd0f5');g.addColorStop(.62,'#e3f2fc');g.addColorStop(1,'#f7fbff');x.fillStyle=g;x.fillRect(0,0,w,h);const bld=[[0,120,60],[54,90,48],[100,140,70],[168,70,40],[206,110,64],[268,150,52],[318,96,72],[388,128,46],[432,80,80]];bld.forEach(([bx,bh,bw],i)=>{x.fillStyle=i%2?'rgba(120,150,180,.55)':'rgba(140,170,198,.5)';x.fillRect(bx,h-bh,bw,bh);x.fillStyle='rgba(255,255,255,.35)';for(let yy=h-bh+8;yy<h-6;yy+=12)for(let xx=bx+6;xx<bx+bw-6;xx+=10)x.fillRect(xx,yy,5,6)});x.fillStyle='rgba(255,255,255,.7)';[[90,40,60],[300,60,80]].forEach(([cx,cy,cw])=>{x.beginPath();x.ellipse(cx,cy,cw,14,0,0,7);x.fill()})});
  T.cert=canvasTexture(512,724,(x,s,w,h)=>{x.fillStyle='#fffdf8';x.fillRect(0,0,w,h);[['#ff9933',0],['#ffffff',10],['#138808',20]].forEach(([c,y])=>{x.fillStyle=c;x.fillRect(0,y,w,10)});x.strokeStyle='#e7d6b8';x.lineWidth=4;rr(x,14,44,w-28,h-60,14);x.stroke();x.fillStyle='#ea580c';x.beginPath();x.arc(70,100,34,0,7);x.fill();x.fillStyle='#fff';x.font=`900 15px ${FONT}`;x.textAlign='center';x.fillText('APAAR',70,105);x.textAlign='left';x.fillStyle='#1f2937';x.font=`900 22px ${FONT}`;x.fillText('APAAR ID CARD',118,96);x.fillStyle='#b45309';x.font=`700 15px ${FONT}`;x.fillText('One Nation · One Student ID',118,120);x.fillStyle='#dbeafe';rr(x,34,160,150,190,12);x.fill();x.fillStyle='#f2c9a5';x.beginPath();x.arc(109,235,38,0,7);x.fill();x.fillStyle='#1f2937';x.beginPath();x.ellipse(109,345,70,50,0,Math.PI,0);x.fill();[['NAME','Asha Rao'],['DATE OF BIRTH','01/02/2005'],['GENDER','Female']].forEach(([l,v],i)=>{const y=180+i*62;x.fillStyle='#9a8f84';x.font=`700 14px ${FONT}`;x.fillText(l,206,y);x.fillStyle='#141414';x.font=`800 24px ${FONT}`;x.fillText(v,206,y+28)});x.fillStyle='#9a8f84';x.font=`700 14px ${FONT}`;x.fillText('APAAR / ABC ID',34,400);x.fillStyle='#9a3412';x.font=`800 30px ui-monospace,Menlo,monospace`;x.fillText('1234 5678 9012',34,438);x.fillStyle='#e5e7eb';for(let i=0;i<5;i++){rr(x,34,480+i*30,i%2?280:w-68,12,6);x.fill()}x.strokeStyle='#ea580c';x.lineWidth=4;x.beginPath();x.arc(w-90,h-90,48,0,7);x.stroke();x.fillStyle='#ea580c';x.font=`900 14px ${FONT}`;x.textAlign='center';x.fillText('VERIFIED',w-90,h-86);x.textAlign='left'});
  T.paper=canvasTexture(256,362,(x,s,w,h)=>{x.fillStyle='#fbfaf6';x.fillRect(0,0,w,h);x.fillStyle='#d6d3cc';for(let i=0;i<12;i++){x.fillRect(22,30+i*26,i%3?w-44:w-110,7)}});
  const ROWS=[['NAME','Asha Rao'],['DATE OF BIRTH','01/02/2005'],['GENDER','Female'],['APAAR ID','1234 5678 9012']];
  T.tv=canvasTexture(1024,600,(x,s,w,h)=>{x.fillStyle='#ffffff';x.fillRect(0,0,w,h);x.fillStyle='#141414';x.fillRect(0,0,w,74);x.fillStyle='#f97316';rr(x,24,17,40,40,10);x.fill();x.strokeStyle='#fff';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(36,27);x.lineTo(36,38);x.arc(44,38,8,Math.PI,0,true);x.lineTo(52,27);x.stroke();x.fillStyle='#fff';x.font=`800 30px ${FONT}`;x.fillText('Approver review',80,48);x.fillStyle='#fdba74';x.font=`600 22px ${FONT}`;x.textAlign='right';x.fillText('Certificate vs Excel',w-28,46);x.textAlign='left';
    ROWS.forEach(([l,v],i)=>{const y=96+i*96,bad=s.issue&&i===1;if(bad){x.fillStyle='#fef2f2';x.strokeStyle='#fecaca';x.lineWidth=3;rr(x,20,y,w-40,84,16);x.fill();x.stroke()}else{x.fillStyle='#f6f5f3';rr(x,20,y,w-40,84,16);x.fill()}x.fillStyle=bad?'#dc2626':'#8a8a8a';x.font=`700 20px ${FONT}`;x.fillText(bad?'DATE OF BIRTH · DOES NOT MATCH EXCEL':l,44,y+32);if(s.rows>i){x.fillStyle=bad?'#991b1b':'#141414';x.font=`800 30px ${FONT}`;x.fillText(v,44,y+68);if(bad){x.fillStyle='#8a8a8a';x.font=`600 26px ${FONT}`;x.fillText('Excel: 01/03/2005',300,y+68)}tick(x,w-66,y+42,24,bad?'#ef4444':'#22c55e',bad?'!':'')}else{x.fillStyle='#e7e5e1';rr(x,44,y+46,[220,180,140,260][i],18,9);x.fill()}});
    if(s.stamp){const ok=s.stamp==='ok';x.save();x.translate(w-250,h-58);x.rotate(-.06);x.fillStyle=ok?'#16a34a':'#dc2626';rr(x,-220,-36,440,72,36);x.fill();x.fillStyle='#fff';x.font=`900 32px ${FONT}`;x.textAlign='center';x.fillText(ok?'✓  APPROVED':'⚑  FLAGGED → REVIEW',0,12);x.restore()}});
  T.screen=kind=>canvasTexture(320,200,(x,s,w,h)=>{x.fillStyle='#0f172a';x.fillRect(0,0,w,h);x.fillStyle=kind==='fix'?'#ef4444':'#f97316';x.fillRect(0,0,w,26);x.fillStyle='#fff';x.font=`800 14px ${FONT}`;x.fillText(kind==='fix'?'REVIEW & RESOLVE':'APPROVER QUEUE',10,18);for(let i=0;i<4;i++){const y=36+i*40,bad=s.issue&&i===1;x.fillStyle=bad?'rgba(239,68,68,.3)':'rgba(255,255,255,.07)';rr(x,8,y,w-16,32,6);x.fill();x.fillStyle=bad?'#fca5a5':'#94a3b8';rr(x,18,y+11,[130,96,74,150][i],10,5);x.fill();x.fillStyle=bad?(s.fixed?'#22c55e':'#ef4444'):'#22c55e';x.beginPath();x.arc(w-26,y+16,8,0,7);x.fill()}});
  let logoImg=null;
  T.logo=canvasTexture(1024,300,(x,s,w,h)=>{x.fillStyle='#ffffff';rr(x,0,0,w,h,36);x.fill();if(logoImg){const ih=150,iw=ih*321/85;x.drawImage(logoImg,(w-iw)/2,48,iw,ih)}x.fillStyle='#9a3412';x.font=`700 34px ${FONT}`;x.textAlign='center';x.fillText('APAAR DOCUMENT DESK',w/2,256)});
  const img=new Image();img.onload=()=>{logoImg=img;T.logo.paint({ok:1})};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(LOGO_SVG);
  T.badge=(text,bg)=>canvasTexture(256,96,(x,s,w,h)=>{x.fillStyle=bg;rr(x,4,4,w-8,h-8,(h-8)/2);x.fill();x.fillStyle='#fff';x.font=`800 36px ${FONT}`;x.textAlign='center';x.fillText(text,w/2,h/2+13)});
  T.icon=(mark,bg)=>canvasTexture(128,128,(x,s,w,h)=>{x.shadowColor='rgba(0,0,0,.25)';x.shadowBlur=10;x.shadowOffsetY=4;tick(x,64,60,48,bg,mark)});
  T.binder=(code,color)=>canvasTexture(64,256,(x,s,w,h)=>{x.fillStyle=color;x.fillRect(0,0,w,h);x.fillStyle='rgba(255,255,255,.92)';rr(x,10,30,44,90,6);x.fill();x.fillStyle=color;x.font=`900 15px ${FONT}`;x.save();x.translate(32,75);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText(code,0,6);x.restore();x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.arc(32,200,12,0,7);x.fill()});
  T.clock=canvasTexture(256,256,(x,s,w,h)=>{x.fillStyle='#fff';x.beginPath();x.arc(128,128,124,0,7);x.fill();x.strokeStyle='#141414';x.lineWidth=10;x.stroke();x.fillStyle='#141414';for(let i=0;i<12;i++){const a=i/12*Math.PI*2;x.save();x.translate(128+Math.sin(a)*100,128-Math.cos(a)*100);x.rotate(a);x.fillRect(-3,-10,6,i%3?14:22);x.restore()}x.fillStyle='#f97316';x.font=`800 20px ${FONT}`;x.textAlign='center';x.fillText('UNext',128,180)});
  return T;
}

/* ---------------- the scene ---------------- */
export function mount(host,models,{counts=false,onSlow=null}={}){
  if(!host)throw Error('no host');
  const canvas=document.createElement('canvas');canvas.className='scene-gl';
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'default'});
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NeutralToneMapping;renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  host.innerHTML='';host.appendChild(canvas);
  const scene=new THREE.Scene();
  const pmrem=new THREE.PMREMGenerator(renderer);const envRT=pmrem.fromScene(new RoomEnvironment(),.04);scene.environment=envRT.texture;scene.environmentIntensity=.55;pmrem.dispose();
  const TX=makeTextures(),own=[];
  const M=(color,o={})=>{const m=new THREE.MeshStandardMaterial({color,roughness:.6,metalness:0,...o});own.push(m);return m};
  const MAT={oak:M('#d8bf98',{roughness:.48}),walnut:M('#8a6646',{roughness:.5}),metal:M('#2b2e33',{roughness:.35,metalness:.7}),steel:M('#b9bec5',{roughness:.3,metalness:.8}),fabric:M('#3a4049',{roughness:.95}),mesh:M('#24282e',{roughness:.9}),wall:M('#f1ece4',{roughness:.92}),wall2:M('#e7e0d4',{roughness:.92}),base:M('#d9d2c6',{roughness:.8}),white:M('#f7f7f5',{roughness:.45}),black:M('#15171a',{roughness:.35,metalness:.2}),glass:M('#dff1ff',{roughness:.05,transparent:true,opacity:.22}),frame:M('#2d3138',{roughness:.4,metalness:.6}),pot:M('#e9e4dc',{roughness:.7}),soil:M('#4a3426',{roughness:1}),leaf:M('#2f6b34',{roughness:.55,side:THREE.DoubleSide}),leaf2:M('#4a8a3c',{roughness:.55,side:THREE.DoubleSide}),orange:M('#f97316',{roughness:.5}),slab:M('#cfc4b2',{roughness:.9})};
  const add=(geo,mat,x=0,y=0,z=0,parent=scene,{cast=true,receive=true,ry=0,rx=0,rz=0}={})=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=cast;m.receiveShadow=receive;parent.add(m);return m};
  const BOX=(w,h,d)=>new THREE.BoxGeometry(w,h,d),CYL=(rt,rb,h,n=24)=>new THREE.CylinderGeometry(rt,rb,h,n);
  const texMat=(map,o={})=>M('#ffffff',{map,roughness:.5,...o});

  /* --- room shell: a cut-away corner office (floor slab, back wall with windows, side wall with brand sign) --- */
  const X0=-3.6,X1=3.15,Z0=-2.9,Z1=2.15,WH=2.8,FX=-X0,FZ=-Z0,CX=(X0+X1)/2,CZ=(Z0+Z1)/2,SX=X1-X0,SZ=Z1-Z0;
  add(BOX(SX+.3,.3,SZ+.3),MAT.slab,CX,-.15,CZ,scene,{cast:false});
  const floorMat=M('#ffffff',{map:TX.floor,roughness:.55});TX.floor.repeat.set(SX/4,SZ/4);add(new THREE.PlaneGeometry(SX,SZ),floorMat,CX,.001,CZ,scene,{rx:-Math.PI/2,cast:false});
  add(new THREE.PlaneGeometry(2.6,2.0),M('#ffffff',{map:TX.rug,roughness:1}),-.95,.006,.65,scene,{rx:-Math.PI/2,rz:.78,cast:false});
  // back wall (z=Z0) with a window band behind the resolve team
  const WIN=[-.35,2.05];
  add(BOX(WIN[0]-X0,WH,.16),MAT.wall,(X0+WIN[0])/2,WH/2,Z0-.08);add(BOX(X1-WIN[1],WH,.16),MAT.wall,(WIN[1]+X1)/2,WH/2,Z0-.08);
  add(BOX(WIN[1]-WIN[0],.8,.16),MAT.wall,(WIN[0]+WIN[1])/2,.4,Z0-.08);add(BOX(WIN[1]-WIN[0],.35,.16),MAT.wall,(WIN[0]+WIN[1])/2,WH-.175,Z0-.08);
  add(new THREE.PlaneGeometry(WIN[1]-WIN[0],WH-1.15),new THREE.MeshBasicMaterial({map:TX.sky,toneMapped:false}),(WIN[0]+WIN[1])/2,.8+(WH-1.15)/2,Z0-.1,scene,{cast:false,receive:false});
  for(let i=0;i<=4;i++)add(BOX(.05,WH-1.15,.08),MAT.frame,WIN[0]+(WIN[1]-WIN[0])*i/4,.8+(WH-1.15)/2,Z0-.02);
  add(BOX(WIN[1]-WIN[0],.05,.1),MAT.frame,(WIN[0]+WIN[1])/2,.8,Z0);add(BOX(WIN[1]-WIN[0],.05,.08),MAT.frame,(WIN[0]+WIN[1])/2,WH-.35,Z0-.02);
  add(BOX(WIN[1]-WIN[0]+.1,.04,.22),MAT.white,(WIN[0]+WIN[1])/2,.82,Z0+.06);
  // side wall (x=X0)
  add(BOX(.16,WH,SZ+.16),MAT.wall2,X0-.08,WH/2,CZ-.08);
  // skirting
  add(BOX(SX,.08,.02),MAT.base,CX,.04,Z0+.01,scene,{cast:false});add(BOX(.02,.08,SZ),MAT.base,X0+.01,.04,CZ,scene,{cast:false});
  // UNext brand sign (backlit) on the side wall
  const signGlow=new THREE.Mesh(new THREE.PlaneGeometry(2.3,.85),new THREE.MeshBasicMaterial({color:'#ffb066',transparent:true,opacity:.28,toneMapped:false}));signGlow.position.set(X0+.02,1.95,-1.75);signGlow.rotation.y=Math.PI/2;scene.add(signGlow);
  add(BOX(.04,.62,2.08),MAT.white,X0+.04,1.95,-1.75);add(new THREE.PlaneGeometry(2.06,.6),texMat(TX.logo,{roughness:.35}),X0+.065,1.95,-1.75,scene,{ry:Math.PI/2,cast:false});
  // wall clock (real time)
  const clockG=new THREE.Group();clockG.position.set(X0+.05,2.1,1.05);clockG.rotation.y=Math.PI/2;scene.add(clockG);
  add(CYL(.24,.24,.04,40),MAT.black,0,0,0,clockG,{rx:Math.PI/2});add(new THREE.CircleGeometry(.215,40),texMat(TX.clock),0,0,.022,clockG,{cast:false});
  const hand=(len,wd,mat)=>{const g=new THREE.Group();g.position.z=.03;clockG.add(g);add(BOX(wd,len,.006),mat,0,len/2-.02,0,g,{cast:false});return g};
  const hH=hand(.11,.016,MAT.black),hM=hand(.17,.011,MAT.black),hS=hand(.18,.005,MAT.orange);

  /* --- furniture builders --- */
  const desk=(parent,w,{x=0,z=.6,divider=false}={})=>{const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);add(BOX(w,.035,.78),MAT.oak,0,.7,0,g);[-1,1].forEach(s=>{add(BOX(.05,.68,.06),MAT.metal,s*(w/2-.08),.34,-.32,g);add(BOX(.05,.68,.06),MAT.metal,s*(w/2-.08),.34,.32,g);add(BOX(.05,.04,.7),MAT.metal,s*(w/2-.08),.03,0,g)});add(BOX(w-.2,.3,.02),MAT.metal,0,.5,.36,g);if(divider)add(BOX(w,.36,.04),M('#cfd6dd',{roughness:.9}),0,.9,.41,g);return g};
  const chair=(parent,x=0,z=-.1)=>{const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);const top=new THREE.Group();g.add(top);add(BOX(.48,.07,.46),MAT.fabric,0,.43,0,top);add(BOX(.46,.56,.05),MAT.mesh,0,.8,-.26,top,{rx:-.08});add(BOX(.04,.2,.04),MAT.metal,0,.6,-.25,top);[-1,1].forEach(s=>{add(BOX(.04,.2,.04),MAT.metal,s*.25,.52,-.02,top);add(BOX(.06,.03,.26),MAT.black,s*.25,.63,0,top)});add(CYL(.025,.025,.3),MAT.steel,0,.25,0,g);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;add(BOX(.04,.03,.3),MAT.metal,Math.sin(a)*.14,.07,Math.cos(a)*.14,g,{ry:a});add(new THREE.SphereGeometry(.03,10,8),MAT.black,Math.sin(a)*.28,.03,Math.cos(a)*.28,g)}return g};
  const laptop=(parent,x,z,tex,ry=0)=>{const g=new THREE.Group();g.position.set(x,.718,z);g.rotation.y=ry;parent.add(g);add(BOX(.36,.016,.25),MAT.steel,0,.008,0,g);const lid=new THREE.Group();lid.position.set(0,.016,.125);lid.rotation.x=.32;g.add(lid);add(BOX(.36,.24,.01),MAT.steel,0,.12,0,lid);add(new THREE.PlaneGeometry(.33,.21),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}),0,.12,-.006,lid,{ry:Math.PI,cast:false});add(new THREE.CircleGeometry(.03,20),MAT.white,0,.12,.006,lid,{cast:false});return g};
  const monitor=(parent,x,z,tex,ry=0)=>{const g=new THREE.Group();g.position.set(x,.718,z);g.rotation.y=ry;parent.add(g);add(BOX(.2,.012,.16),MAT.metal,0,.006,0,g);add(BOX(.04,.3,.03),MAT.metal,0,.16,.04,g);add(BOX(.58,.35,.025),MAT.black,0,.36,.02,g);add(new THREE.PlaneGeometry(.55,.32),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}),0,.36,.006,g,{ry:Math.PI,cast:false});return g};
  const keyboard=(parent,x,z)=>{add(BOX(.42,.018,.14),MAT.white,x,.727,z,parent);add(BOX(.06,.02,.1),MAT.white,x+.3,.727,z,parent)};
  const mug=(parent,x,z,color='#f97316')=>{add(CYL(.04,.036,.1,18),M(color,{roughness:.4}),x,.768,z,parent)};
  const plant=(x,z,s=1)=>{const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);add(CYL(.2,.15,.42,28),MAT.pot,0,.21,0,g);add(CYL(.185,.185,.02,24),MAT.soil,0,.41,0,g);const leaves=[],leafGeo=new THREE.SphereGeometry(.5,14,8);leafGeo.translate(0,0,.5);
    for(let i=0;i<22;i++){const a=i*2.39996,tier=i/22,stem=new THREE.Group();stem.position.y=.42;stem.rotation.set(0,a,0);g.add(stem);const pitch=new THREE.Group();pitch.rotation.x=-(.95-tier*.7);stem.add(pitch);const len=.28+(1-tier)*.22;add(CYL(.007,.011,len,5),MAT.walnut,0,0,len/2,pitch,{rx:Math.PI/2,cast:false});const L=add(leafGeo,i%3?MAT.leaf:MAT.leaf2,0,0,len*.9,pitch,{rx:.25+tier*.3});L.scale.set(.3+(i%4)*.03,.035,.42+(1-tier)*.12);leaves.push(stem)}
    return {g,leaves}};
  /* --- stations (world positions chosen for the 45° camera: left → right reads intake → approver → team → record shelf) --- */
  // intake side table with the certificate stack
  const STACK=new THREE.Vector3(-3.1,.86,1.95);
  {const g=new THREE.Group();g.position.copy(STACK).setY(0);scene.add(g);add(BOX(.7,.04,.55),MAT.walnut,0,.82,0,g);[-1,1].forEach(a=>[-1,1].forEach(b=>add(BOX(.04,.8,.04),MAT.metal,a*.3,.4,b*.22,g)));add(BOX(.42,.03,.32),MAT.black,0,.855,0,g);for(let i=0;i<9;i++)add(BOX(.3,.008,.42),M('#fbfaf6',{roughness:.8}),(i%3-1)*.004,.875+i*.009,(i%2)*.004,g,{ry:Math.PI/2+(i%3-1)*.03});}
  const stackTop=STACK.clone().setY(.875+9*.009);
  // multifunction scanner (extraction & OCR)
  const SCAN=new THREE.Vector3(-3.05,1.06,.15);
  const scanBar=(()=>{const g=new THREE.Group();g.position.copy(SCAN).setY(0);scene.add(g);add(BOX(.7,.95,.62),MAT.white,0,.475,0,g);add(BOX(.72,.04,.64),MAT.black,0,.97,0,g);add(BOX(.6,.012,.5),M('#9ec5e8',{roughness:.1,metalness:.1}),0,.995,0,g);add(BOX(.62,.06,.08),MAT.black,0,1.02,.28,g);add(BOX(.5,.1,.34),M('#e9e8e4'),0,.72,.2,g);add(BOX(.2,.12,.02),M('#1e293b',{emissive:'#3b82f6',emissiveIntensity:.6}),.18,.88,.32,g,{rx:-.5});add(BOX(.04,.04,.5),MAT.black,0,.2,.31,g);const bar=new THREE.Mesh(BOX(.03,.02,.5),new THREE.MeshBasicMaterial({color:'#7dd3fc',toneMapped:false,transparent:true,opacity:.95}));bar.position.set(0,1.005,0);g.add(bar);const glow=new THREE.Mesh(new THREE.PlaneGeometry(.18,.5),new THREE.MeshBasicMaterial({color:'#38bdf8',transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));glow.rotation.x=-Math.PI/2;glow.position.y=1.01;bar.add(glow);glow.position.set(0,.005,0);return bar})();
  // approver workstation
  const AP=new THREE.Group();AP.position.set(-.95,0,.5);AP.rotation.y=.62;scene.add(AP);
  desk(AP,1.6);const apChair=chair(AP,0,-.08);keyboard(AP,0,.4);
  const apScreen=TX.screen('app');laptop(AP,-.45,.62,apScreen,.35);monitor(AP,.5,.78,TX.screen('app'),-.42);mug(AP,-.68,.35);
  const AP_DOC=new THREE.Vector3(.02,.725,.72); // where the certificate lands on her desk (local)
  // review display on a rolling stand, facing the camera
  const TVG=new THREE.Group();TVG.position.set(-1.45,0,-1.3);TVG.rotation.y=Math.PI/4;scene.add(TVG);
  add(BOX(.7,.04,.5),MAT.metal,0,.06,0,TVG);[[-.28,-.2],[.28,-.2],[-.28,.2],[.28,.2]].forEach(([a,b])=>add(new THREE.SphereGeometry(.035,10,8),MAT.black,a,.035,b,TVG));add(BOX(.08,1.5,.08),MAT.metal,0,.8,0,TVG);
  add(BOX(1.72,1.02,.06),MAT.black,0,1.62,.06,TVG);const tvFace=add(new THREE.PlaneGeometry(1.64,.96),new THREE.MeshBasicMaterial({map:TX.tv,toneMapped:false}),0,1.62,.092,TVG,{cast:false});
  // review & resolve bench (two people)
  const RS=new THREE.Group();RS.position.set(1.0,0,-1.25);RS.rotation.y=.42;scene.add(RS);
  desk(RS,2.4,{divider:true});const rsChairs=[chair(RS,-.6,-.08),chair(RS,.6,-.08)];keyboard(RS,-.6,.4);keyboard(RS,.6,.4);
  const fixTex=TX.screen('fix');laptop(RS,-.15,.62,fixTex,-.25);laptop(RS,.18,.62,fixTex,.25);monitor(RS,-1.05,.74,TX.screen('fix'),.45);monitor(RS,1.05,.74,TX.screen('fix'),-.45);mug(RS,.36,.22,'#2563eb');
  const RS_DOC=new THREE.Vector3(0,.73,.3);
  // red/amber/green status lamp on the bench
  const lamp=add(new THREE.SphereGeometry(.07,20,14),new THREE.MeshStandardMaterial({color:'#ef4444',emissive:'#ef4444',emissiveIntensity:0,roughness:.3}),1.1,.79,.25,RS);add(CYL(.05,.06,.04,16),MAT.black,1.1,.73,.25,RS);
  // records shelf (approved · on record) against the back wall
  const SH=new THREE.Group();SH.position.set(2.7,0,Z0+.22);scene.add(SH);
  add(BOX(1.5,2.0,.03),M('#6f5139',{roughness:.6}),0,1.0,-.19,SH);[-1,1].forEach(sd=>add(BOX(.04,2.0,.42),MAT.walnut,sd*.73,1.0,0,SH));[.03,.5,.95,1.4,1.98].forEach(y=>add(BOX(1.46,.04,.42),MAT.walnut,0,y,0,SH));
  const UNIS=[['MUJ','#ea580c'],['MAHE','#2563eb'],['SMU','#7c3aed']];const binders=[];
  [.5,.95,1.4].forEach((y,row)=>{for(let i=0;i<9;i++){const [code,color]=UNIS[(i+row)%3];const b=add(BOX(.07,.36,.28),[M(color,{roughness:.55}),M(color,{roughness:.55}),M(color),M(color),M(color,{map:TX.binder(code,color),roughness:.5}),M(color)],-.58+i*.085+(i>5?.06:0),y+.23,.05,SH);b.userData.uni=(i+row)%3;b.userData.base=b.position.clone();binders.push(b)}});
  SH.updateMatrixWorld(true);const SHELF_DOC=SH.localToWorld(new THREE.Vector3(.0,1.42,.3));
  // greenery and a water cooler
  const plants=[plant(-3.2,-2.5,1.05),plant(2.75,-1.2,.95),plant(-.05,-2.6,.75),plant(-3.2,1.2,.8)];
  {const g=new THREE.Group();g.position.set(-3.3,0,-.75);scene.add(g);add(BOX(.34,.95,.34),MAT.white,0,.475,0,g);add(CYL(.15,.15,.4,24),M('#bfe3ff',{transparent:true,opacity:.55,roughness:.05}),0,1.15,0,g);add(BOX(.1,.06,.04),MAT.black,0,.75,.18,g)}

  scene.updateMatrixWorld(true);
  /* --- lights --- */
  scene.add(new THREE.HemisphereLight('#fffaf2','#c9b89e',.9));
  const sun=new THREE.DirectionalLight('#fff4e6',2.2);sun.position.set(3.5,8,5.5);sun.target.position.set(-.5,0,-.5);scene.add(sun,sun.target);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-6.5,right:6.5,top:6.5,bottom:-6.5,near:1,far:22});sun.shadow.bias=-.0004;sun.shadow.normalBias=.02;sun.shadow.radius=3;
  const windowLight=new THREE.DirectionalLight('#dbeeff',.7);windowLight.position.set(1,3,-6);windowLight.target.position.set(1,0,0);scene.add(windowLight,windowLight.target);

  /* --- cast --- */
  const people={};
  const SEATS={approver:[AP,0,apChair],team1:[RS,-.6,rsChairs[0]],team2:[RS,.6,rsChairs[1]]};
  for(const name of CAST){const gltf=models[name],root=cloneSkinned(gltf.scene),[parent,x,ch]=SEATS[name];root.position.set(x,0,0);parent.add(root);
    let hips=null;root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;if(o.material?.map)o.material.map.anisotropy=4}if(o.isBone&&/Hips$/.test(o.name))hips=o});
    const mixer=new THREE.AnimationMixer(root),actions={};gltf.animations.forEach(c=>{const a=mixer.clipAction(c);a.play();a.setEffectiveWeight(0);actions[c.name]=a});
    people[name]={root,mixer,actions,hips,chair:ch,chairZ:ch.position.z,stand:0}}
  // a phone in the approver's hand during the call
  const phone=new THREE.Mesh(BOX(.075,.15,.01),MAT.black);phone.castShadow=true;{let rh=null;people.approver.root.traverse(o=>{if(o.isBone&&/RightHand$/.test(o.name))rh=o});if(rh){rh.add(phone);phone.position.set(0,.09,.03);phone.rotation.set(0,0,0);phone.scale.setScalar(1/(rh.getWorldScale(new THREE.Vector3()).x||1))}}

  /* --- the moving certificate + status markers --- */
  const docMat=M('#ffffff',{map:TX.cert,roughness:.7}),docBack=M('#f4f1ea',{roughness:.8});
  const doc=new THREE.Mesh(BOX(.42,.008,.59),[docBack,docBack,docMat,docBack,docBack,docBack]);doc.castShadow=true;scene.add(doc);
  const sprite=(tex,s)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,toneMapped:false}));sp.scale.set(s,s,1);sp.renderOrder=5;scene.add(sp);return sp};
  const okIcon=sprite(TX.icon('','#16a34a'),.42),flagIcon=sprite(TX.icon('!','#dc2626'),.42),fixIcon=sprite(TX.icon('!','#f59e0b'),.36),doneIcon=sprite(TX.icon('','#16a34a'),.36);
  const trail=[];for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.035,10,8),new THREE.MeshBasicMaterial({color:'#f97316',transparent:true,depthWrite:false,toneMapped:false}));scene.add(m);trail.push(m)}

  /* --- camera --- */
  const camera=new THREE.PerspectiveCamera(24,1,.5,80);const target=new THREE.Vector3(-.25,.75,-.5);let mouse=[0,0],mouseT=[0,0],W=1,H=1;
  function placeCamera(t){const az=Math.PI/4+Math.sin(t*.12)*.035+mouse[0]*.09,el=.56+mouse[1]*.04,aspect=W/H,tv=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),dist=Math.max(6.9/(2*tv),10.4/(2*tv*aspect));camera.aspect=aspect;camera.position.set(target.x+Math.sin(az)*Math.cos(el)*dist,target.y+Math.sin(el)*dist,target.z+Math.cos(az)*Math.cos(el)*dist);camera.lookAt(target);camera.updateProjectionMatrix()}

  /* --- labels (same HTML tags as the other scenes, projected each frame) --- */
  const icon=p=>`<span class="ti"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p}</svg></span>`;
  const W3=v=>new THREE.Vector3(...v);
  const LABELS=[
    {id:'intake',cls:'t-amber',label:'Certificates in',at:STACK.clone().add(new THREE.Vector3(.25,.45,.1)),ic:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'},
    {id:'ocr',cls:'t-blue',label:'Extraction & OCR',at:SCAN.clone().add(new THREE.Vector3(-.1,.92,.5)),ic:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>'},
    {id:'review',cls:'t-red',label:'Review & resolve',at:RS.localToWorld(new THREE.Vector3(0,1.75,-.2)),ic:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>'},
    {id:'sync',cls:'t-green',label:'Approved · on record',at:SH.localToWorld(new THREE.Vector3(-.45,2.4,.2)),ic:'<path d="M20 6 9 17l-5-5"/>'},
    {id:'verify',cls:'t-dark',label:'Approver verification',at:TVG.localToWorld(new THREE.Vector3(.55,2.3,0)),ic:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',dark:true}
  ];
  const labelHost=document.createElement('div');labelHost.className='gl-labels office';host.appendChild(labelHost);
  LABELS.forEach((L,i)=>{const el=document.createElement('div');el.className=`tag3d ${L.cls}`;el.style.setProperty('--d',`${(.2+i*.12).toFixed(2)}s`);el.innerHTML=L.dark?`${icon(L.ic).replace('class="ti"','class="ti" style="color:#fb923c"')}<span>${L.label}<small>${counts?'<b class="tc" data-count="verify" style="display:inline;font-size:1em"></b> ':''}Approve · or flag to review &amp; resolve</small></span>`:`${icon(L.ic)}<span>${L.label}<b class="tc" data-count="${L.id}"></b></span>`;labelHost.appendChild(el);L.el=el;L.last=''});
  const proj=new THREE.Vector3();

  /* --- choreography: 22 s loop — 0–9 s an approval, 9–22 s a flag that the team resolves --- */
  const T=22,FADE=.6;
  const SCHED={
    approver:[[0,13.8,'typing',0],[13.8,18,'disappointed',0],[18,22,'phone',.6]],
    team1:[[0,15,'typing',1],[15,17.6,'disappointed',0],[17.6,20,'typing',7],[20,22,'cheer',0]],
    team2:[[0,5,'typing',6],[5,9.75,'clap',0],[9.75,15,'typing',1],[15,19.8,'disappointed',0],[19.8,22,'typing',4]]
  };
  function animatePeople(t){
    for(const name of CAST){const P=people[name],S=SCHED[name];let i=S.findIndex(s=>t>=s[0]&&t<s[1]);if(i<0)i=S.length-1;const s=S[i],prev=S[(i-1+S.length)%S.length],since=t-s[0];
      for(const a of Object.values(P.actions))a.setEffectiveWeight(0);
      const clipT=(a,x)=>{const d=a.getClip().duration;return x<d?x:(x%d)};
      const cur=P.actions[s[2]];cur.time=clipT(cur,s[3]+since);
      const k=prev[2]===s[2]?1:ease(clamp(since/FADE));cur.setEffectiveWeight(k);
      if(k<1){const pa=P.actions[prev[2]];pa.time=clipT(pa,prev[3]+(prev[1]-prev[0])+since);pa.setEffectiveWeight(1-k)}
      P.mixer.update(0);
      // chairs roll back when someone stands
      const stand=P.hips?clamp((P.hips.position.y*(P.hips.parent?.getWorldScale(proj).y||1)-.62)/(.95-.62)):0;P.stand=stand;P.chair.position.z=P.chairZ-.5*stand;P.chair.rotation.y=stand*.25}
    phone.visible=t>SCHED.approver[2][0]+.35||t<FADE*.6;
  }
  const loopNo=time=>Math.floor(time/T);
  const arc=(a,b,k,h)=>new THREE.Vector3().lerpVectors(a,b,k).setY(THREE.MathUtils.lerp(a.y,b.y,k)+Math.sin(k*Math.PI)*h);
  const apDoc=()=>AP.localToWorld(AP_DOC.clone()),rsDoc=()=>RS.localToWorld(RS_DOC.clone());
  function frame(time){
    const t=((time%T)+T)%T,issue=t>=9,lt=issue?t-9:t;
    placeCamera(time);animatePeople(t);
    // document path: stack → scanner → approver desk → shelf (approved) | team bench → shelf (flagged, then resolved)
    const off=issue?9:0,A=off,TOP=stackTop,scanTop=SCAN,ap=apDoc().add(new THREE.Vector3(0,.004,0)),rs=rsDoc(),sh=SHELF_DOC;
    let p=TOP.clone(),rot=0,vis=true,trailOn=false,trailColor='#f97316';
    const tIn=[A,A+.9],tScan=[A+.9,A+2.3],tToAp=[A+2.3,A+3.2],tDecide=issue?A+4.8:A+4.8;
    const leaveAp=issue?[A+5,A+6]:[A+5.3,A+6.4],atRs=[A+6,A+11],toShelf=issue?[A+11,A+12.2]:leaveAp;
    if(t<tIn[1]){const k=ease(seg(t,...tIn));p=arc(TOP,scanTop,k,.5);rot=k*Math.PI}
    else if(t<tScan[1]){p=scanTop.clone();rot=Math.PI}
    else if(t<tToAp[1]){const k=ease(seg(t,...tToAp));p=arc(scanTop,ap,k,1.1);rot=Math.PI+k*(Math.PI*1.5+AP.rotation.y)}
    else if(t<leaveAp[0]){p=ap;rot=AP.rotation.y+Math.PI/2}
    else if(!issue){const k=ease(seg(t,...toShelf));if(k>=1){vis=false}else{p=arc(ap,sh,k,1.6);rot=AP.rotation.y+k*Math.PI*2;trailOn=true;trailColor='#22c55e'}}
    else if(t<leaveAp[1]){const k=ease(seg(t,...leaveAp));p=arc(ap,rs,k,1.2);rot=AP.rotation.y+k*(RS.rotation.y-AP.rotation.y+Math.PI*2);trailOn=true;trailColor='#ef4444'}
    else if(t<atRs[1]){p=rs;rot=RS.rotation.y}
    else{const k=ease(seg(t,...toShelf));if(k>=1){vis=false}else{p=arc(rs,sh,k,1.5);rot=RS.rotation.y+k*Math.PI*2;trailOn=true;trailColor='#22c55e'}}
    if(!issue&&t>=8.4)vis=false;
    doc.visible=vis;doc.position.copy(p);doc.rotation.set(0,rot,0);
    const scanK=seg(t,...tScan);scanBar.visible=scanK>0&&scanK<1;scanBar.position.x=-.27+scanK*.54;
    // trail of dots behind a flying certificate
    trail.forEach((d,i)=>{d.visible=trailOn;if(!trailOn)return;const span=issue&&t<leaveAp[1]?leaveAp:toShelf,from=issue&&t<leaveAp[1]?ap:issue?rs:ap,to=issue&&t<leaveAp[1]?rs:sh,k=ease(clamp(seg(t,...span)-i*.022));d.position.copy(arc(from,to,k,issue&&t<leaveAp[1]?1.2:1.6));d.material.color.set(trailColor);d.material.opacity=.75*(1-i/trail.length);d.scale.setScalar(1-i/14)});
    // review display: rows fill, then the decision stamp
    const rows=Math.max(0,Math.min(4,Math.floor((lt-3.25)/.35)));TX.tv.paint({rows:t>=tToAp[1]-.1?rows:0,issue:issue&&rows>=2,stamp:lt>=4.8&&lt<(issue?6.2:8.6)?(issue?'bad':'ok'):null});
    apScreen.paint({issue:issue&&lt>3.9&&lt<6});fixTex.paint({issue:issue&&t>15&&t<21.5,fixed:t>20});
    // decision markers
    const pop=(sp,on,k,at,base)=>{sp.visible=on;if(!on)return;const s=base*back(clamp(k));sp.scale.set(s,s,1);sp.position.copy(at)};
    const apHead=AP.localToWorld(new THREE.Vector3(0,1.75,.1));
    pop(okIcon,!issue&&lt>4.8&&lt<6.8,seg(lt,4.8,5.15),apHead,.42);
    pop(flagIcon,issue&&lt>4.8&&lt<6.6,seg(lt,4.8,5.15),apHead,.42);
    const rsHead=RS.localToWorld(new THREE.Vector3(0,1.55,.2));
    pop(fixIcon,t>15&&t<20,seg(t,15,15.35),rsHead,.36);pop(doneIcon,t>=20&&t<21.6,seg(t,20,20.35),rsHead,.36);
    lamp.material.emissiveIntensity=t>15&&t<21.6?1.6+Math.sin(time*9)*.6*(t<17.6?1:.2):0;lamp.material.color.set(t<17.6?'#ef4444':t<20?'#f59e0b':'#22c55e');lamp.material.emissive.copy(lamp.material.color);
    // shelf: the receiving binder slides out and back
    const uni=loopNo(time)%3,arrive=issue?seg(t,21,22):seg(t,6.2,7.6);binders.forEach(b=>{const on=b.userData.uni===uni&&b.position.y>1.3&&b.position.y<1.8;b.position.z=b.userData.base.z+(on?Math.sin(arrive*Math.PI)*.16:0)});
    // ambience
    plants.forEach((pl,i)=>pl.leaves.forEach((L,j)=>{L.rotation.z=Math.sin(time*1.1+i+j*.7)*.035}));
    signGlow.material.opacity=.22+Math.sin(time*1.6)*.05;
    const now=new Date(),sec=now.getSeconds()+now.getMilliseconds()/1000,mn=now.getMinutes()+sec/60,hr=(now.getHours()%12)+mn/60;hH.rotation.z=-hr/12*Math.PI*2;hM.rotation.z=-mn/60*Math.PI*2;hS.rotation.z=-sec/60*Math.PI*2;
  }
  function draw(){
    renderer.render(scene,camera);
    for(const L of LABELS){proj.copy(L.at).project(camera);const x=(proj.x*.5+.5)*100,y=(.5-proj.y*.5)*100,k=`${x.toFixed(1)},${y.toFixed(1)}`;if(k!==L.last){L.last=k;L.el.style.left=`${x.toFixed(2)}%`;L.el.style.top=`${y.toFixed(2)}%`}}
  }
  /* --- loop, sizing, performance guard --- */
  let dprCap=1.75,running=false,raf=0,clock=3.6,last=0,perfFrames=0,perfTime=0,downgraded=false,gaveUp=false,destroyed=false;
  function resize(){const r=host.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,dprCap));renderer.setSize(W,H,false)}
  const render=time=>{frame(time);draw()};
  const ro=window.ResizeObserver?new ResizeObserver(()=>{if(destroyed)return;resize();render(clock)}):null;ro?.observe(host);resize();
  const loop=now=>{if(!running)return;const raw=(now-last)/1000,dt=Math.min(.05,raw);last=now;clock+=dt;
    if(!gaveUp&&!document.hidden&&raw<1){perfFrames++;perfTime+=raw;if(perfTime>3){const fps=perfFrames/perfTime;perfFrames=0;perfTime=0;if(fps<24){if(!downgraded){downgraded=true;dprCap=1;sun.shadow.mapSize.set(1024,1024);sun.shadow.map?.dispose();sun.shadow.map=null;resize()}else{gaveUp=true;running=false;onSlow?.();return}}}}
    mouse=[mouse[0]+(mouseT[0]-mouse[0])*.06,mouse[1]+(mouseT[1]-mouse[1])*.06];render(clock);raf=requestAnimationFrame(loop)};
  const onMove=e=>{const r=host.getBoundingClientRect();mouseT=[(e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5]},onLeave=()=>{mouseT=[0,0]};
  host.addEventListener('pointermove',onMove);host.addEventListener('pointerleave',onLeave);
  render(clock);
  return {
    gl:true,three:true,
    setCounts(map){host.querySelectorAll('[data-count]').forEach(node=>{const v=map[node.dataset.count];node.textContent=v==null?'':node.dataset.count==='verify'?`${v} matched ·`:String(v)})},
    pause(){running=false;cancelAnimationFrame(raf)},
    resume(){if(running||gaveUp||destroyed)return;running=true;last=performance.now();perfFrames=0;perfTime=0;raf=requestAnimationFrame(loop)},
    destroy(){destroyed=true;running=false;cancelAnimationFrame(raf);ro?.disconnect();host.removeEventListener('pointermove',onMove);host.removeEventListener('pointerleave',onLeave);for(const P of Object.values(people))P.mixer.stopAllAction();own.forEach(m=>{m.map?.dispose();m.dispose()});envRT.dispose();renderer.dispose();renderer.forceContextLoss();host.innerHTML=''},
    seek(time){clock=time;render(clock)}
  };
}
