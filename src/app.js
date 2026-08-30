import * as T from 'three';
import { chapters } from './data/chapters.js';
import { SceneDirector } from './core/scene-director.js';
import { buildCity } from './scenes/city.js';
import { buildOrigin } from './scenes/origin.js';
import { buildEcho } from './scenes/echo.js';
import { buildLibrary } from './scenes/library.js';
import { buildTrain } from './scenes/train.js';
import { buildAshes } from './scenes/ashes.js';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

const $=s=>document.querySelector(s),els={boot:$('#boot'),enter:$('#enter'),exp:$('#experience'),copy:$('#copy'),no:$('#chapterNo'),en:$('#chapterEn'),loc:$('#location'),kicker:$('#kicker'),title:$('#title'),sub:$('#subtitle'),quote:$('#quote'),body:$('#body'),action:$('#action'),rail:$('#rail'),trans:$('#transition'),flash:$('#flash'),coord:$('#coord'),atmos:$('#atmos'),clock:$('#clock')};
const renderer=new T.WebGLRenderer({canvas:$('#world'),antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.88;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene();scene.background=new T.Color(0x030506);scene.fog=new T.FogExp2(0x030506,.018);const camera=new T.PerspectiveCamera(47,innerWidth/innerHeight,.1,500);camera.position.set(0,4,20);const clock=new T.Clock();
scene.add(new T.HemisphereLight(0xb4d7df,0x090607,.62));const moon=new T.DirectionalLight(0xd8f2ff,2.6);moon.position.set(-16,24,12);moon.castShadow=true;scene.add(moon);const warm=new T.PointLight(0xff9e54,40,70,2);warm.position.set(9,1,-8);scene.add(warm);
const root=new T.Group();scene.add(root);let current=0,targetCam=new T.Vector3(),targetLook=new T.Vector3(),look=new T.Vector3(),pointer=new T.Vector2(),started=false,busy=false,eventTime=-99;
const sceneModules = {
  origin: buildOrigin(),
  megacity: buildCity('megacity'),
  frozen: buildCity('frozen'),
  echo: buildEcho(),
  library: buildLibrary(),
  train: buildTrain(),
  ashes: buildAshes()
};
for (const [name, module] of Object.entries(sceneModules)) {
  module.group.name = name;
  module.group.visible = false;
  root.add(module.group);
  worlds[name] = module.group;
}
const presets={origin:{position:[0,5,24],look:[3,0,-8],color:0x030909,fog:.014},megacity:{position:[13,8,24],look:[0,2,-22],color:0x07090c,fog:.012},frozen:{position:[-12,5,23],look:[3,0,-25],color:0x07131b,fog:.021},echo:{position:[0,2,21],look:[0,0,-13],color:0x031110,fog:.024},library:{position:[0,4,23],look:[0,2,-18],color:0x130d08,fog:.016},train:{position:[0,1,18],look:[0,-1,-25],color:0xb8c1c8,fog:.009},ashes:{position:[0,2,21],look:[5,1,-14],color:0x000000,fog:.028}};
const director=new SceneDirector(T,scene,camera,worlds,presets);
function setWorld(name){director.activate(name);els.atmos.textContent=name==='frozen'?'−103.7°C':name==='ashes'?'NULL':name==='train'?'624 KM/S':'STABLE'}
function renderCopy(c){els.no.textContent=c.no;els.en.textContent=c.en;els.loc.textContent=c.loc;els.kicker.textContent=c.kicker;els.title.textContent=c.title;els.sub.textContent=c.sub;els.quote.innerHTML=c.quote;els.body.textContent=c.body;els.action.classList.toggle('hidden',!c.action);els.action.querySelector('span').textContent=c.action;[...els.rail.children].forEach((x,i)=>x.classList.toggle('active',i===current))}
function go(i,instant=false){if(busy&&!instant)return;i=(i+chapters.length)%chapters.length;busy=true;els.copy.classList.add('out');if(!instant){els.trans.classList.remove('play');void els.trans.offsetWidth;els.trans.classList.add('play')}setTimeout(()=>{current=i;const c=chapters[i];setWorld(c.scene);renderCopy(c);els.copy.classList.remove('out')},instant?0:510);setTimeout(()=>busy=false,instant?0:1120)}
chapters.forEach((c,i)=>{const b=document.createElement('button');b.innerHTML=`<span>${c.no}</span>`;b.ariaLabel=`前往${c.title}`;b.onclick=()=>go(i);els.rail.append(b)});
$('#prev').onclick=()=>go(current-1);$('#next').onclick=()=>go(current+1);$('#brand').onclick=()=>go(0);addEventListener('keydown',e=>{if(!started)return;if(e.key==='ArrowRight'||e.key==='ArrowDown')go(current+1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(current-1)});addEventListener('wheel',e=>{if(started&&Math.abs(e.deltaY)>35)go(current+(e.deltaY>0?1:-1))},{passive:true});
els.action.onclick=()=>{eventTime=clock.elapsedTime;const c=chapters[current];if(c.scene==='megacity'){els.flash.classList.remove('fire');void els.flash.offsetWidth;els.flash.classList.add('fire');document.body.classList.add('shake');setTimeout(()=>document.body.classList.remove('shake'),500)}else if(c.scene==='ashes')go(0);else{renderer.toneMappingExposure=1.5;setTimeout(()=>renderer.toneMappingExposure=.88,700)}};
let audio=false,audioCtx=null;function tone(){if(!audio)return;if(!audioCtx)audioCtx=new AudioContext();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=55+current*13;o.type='sine';g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.08);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+1.4);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+1.5)}$('#sound').onclick=e=>{audio=!audio;e.currentTarget.classList.toggle('off',!audio);tone()};
els.enter.onclick=()=>{started=true;els.boot.classList.add('gone');els.exp.classList.add('ready');tone();go(0,true)};
addEventListener('pointermove',e=>{if(!reduce)director.pointerMove(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight*2-1))},{passive:true});addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
  if(started){
    director.update(dt,reduce);
    const activeScene=chapters[current].scene;
    sceneModules[activeScene]?.update(dt,t,reduce);
    if(activeScene==='megacity'&&t-eventTime<3.4){
      const age=t-eventTime;
      const shake=Math.sin(t*70)*Math.max(0,1-age/3)*.12;
      camera.position.x+=shake;
      worlds.megacity.rotation.z=Math.sin(t*40)*Math.max(0,1-age/3)*.006;
    } else {
      worlds.megacity.rotation.z=0;
    }
    els.coord.textContent=`X ${camera.position.x.toFixed(1)} / Z ${camera.position.z.toFixed(1)}`;
    els.clock.textContent=new Date().toISOString().slice(11,19);
  }
  renderer.render(scene,camera);
}
animate();setWorld('origin');renderCopy(chapters[0]);
