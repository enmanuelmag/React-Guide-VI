import { gsap } from 'gsap';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/sora/600.css';
import '@fontsource/jetbrains-mono/400.css';
import './style.css';
import { codeLines, chapters, makeSteps } from './scenes.js';
const $=id=>document.getElementById(id);
const escape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),initialRatio=devicePixelRatio;
let steps=makeSteps(),index=0,playing=false,timer,movement,sweepMotion,extraClicks=0,liveLog='';
$('code').innerHTML=codeLines.map((text,i)=>{
  const html=text.trimStart().startsWith('//')?'<span class="comment">'+escape(text)+'</span>':text.split(/('.*?'|".*?"|\b(?:const|function|async|await|return|if|try|catch|finally|export|import|from|throw|new|false|true)\b)/g).map(t=>/^['"]/.test(t)?'<span class="string">'+escape(t)+'</span>':/^(const|function|async|await|return|if|try|catch|finally|export|import|from|throw|new|false|true)$/.test(t)?'<span class="keyword">'+t+'</span>':escape(t)).join('');
  return '<span class="code-line" data-line="'+(i+1)+'"><span class="line-number">'+(i+1)+'</span><code>'+html+'</code></span>';
}).join('');
$('chapters').innerHTML=chapters.map((c,i)=>'<button data-chapter="'+i+'">'+c.title+'</button>').join('');
// Semantic snapshots are independent of the seekable movement timeline.
const timeline=gsap.timeline({paused:true});
for(let i=0;i<20;i++){timeline.addLabel('step-'+i,i).set('#sweep',{opacity:0,yPercent:0},i);if(i===17){timeline.fromTo('#sweep',{opacity:0,yPercent:0},{opacity:1,duration:.1,immediateRender:false},i+.01).to('#sweep',{yPercent:900,duration:.65,ease:'none'},i+.12).to('#sweep',{opacity:0,duration:.1},i+.8);}}
timeline.set('#sweep',{opacity:0},20);window.__timelines={'peticiones-https':timeline};
function halo(id,origin){const n=$(id);n.classList.remove('user-halo','react-halo');delete n.dataset.changeOrigin;if(origin){n.classList.add(origin==='usuario'?'user-halo':'react-halo');n.dataset.changeOrigin=origin;}}
function consoleDraw(){const logs=[...steps[index].logs];if(liveLog)logs.push('FLUJO|'+liveLog);$('console').innerHTML=logs.map(entry=>{const [kind,...t]=entry.split('|');return '<div class="console-line"><span class="log-kind '+kind.toLowerCase()+'">'+kind+'</span><code>'+escape(t.join('|'))+'</code></div>';}).join('');}
function draw(){
  const s=steps[index];$('stage').dataset.step=String(index);
  $('step-index').textContent=String(index+1).padStart(2,'0');$('phase').textContent=chapters[s.chapter].title+' / '+s.phase;$('title').textContent=s.title;$('explanation').textContent=s.explanation;
  for(const row of $('code').children){const n=Number(row.dataset.line);row.classList.toggle('active',s.lines.includes(n));row.classList.toggle('waiting',s.waitLine===n&&!s.lines.includes(n));}
  for(const [id,t]of [['js-status',s.js],['network-status',s.network],['server-status',s.server]])$(id).textContent=t;
  $('route-state').textContent=s.phase==='ESPERA'?'Promise pendiente':s.phase;
  $('response-label').textContent=index<12?'Sin Response':$('scenario').value==='network'?'Sin Response':$('scenario').value==='http'?'HTTP 500':'HTTP 200';
  $('packet').hidden=!s.packet;$('packet').classList.toggle('response',s.direction==='response');
  $('loading').hidden=!s.loading;$('request').disabled=s.loading;$('app-badge').textContent=s.loading?'Petición pendiente · UI disponible':'UI disponible';
  $('clicks').textContent=String(s.clicks+extraClicks);$('message').textContent=s.message;$('ui-note').textContent=s.allowCount?'Prueba el contador: este hito mantiene la red pendiente.':'Spinner CSS: no requiere un render de React en cada vuelta.';
  for(const id of ['request','count','counter','message','loading'])halo(id,s.user===id?'usuario':s.react?.includes(id)?'react':null);
  consoleDraw();
  const names=['Inicio','Clic','Setters','fetch','await','Carga','Servidor','Otro evento','Handler','Contador','Concurrencia','Espera','Regreso','Response','Body / error','Mensaje','finally','Render','Commit','Cierre'];
  $('milestones').innerHTML=steps.filter(t=>t.chapter===s.chapter).map(t=>'<button data-step="'+t.index+'" class="milestone '+(t.index===index?'current':t.index<index?'visited':'')+'" '+(t.index===index?'aria-current="step"':'')+'><span>'+String(t.index+1).padStart(2,'0')+'</span><small>'+names[t.index]+'</small></button>').join('');
  for(const b of $('chapters').children)b.setAttribute('aria-pressed',String(Number(b.dataset.chapter)===s.chapter));
  $('previous').disabled=index===0;$('next').disabled=index===19;$('play').textContent=playing?'Ⅱ Pausar':'▶ Reproducir';
}
function stop(){playing=false;clearTimeout(timer);$('play').textContent='▶ Reproducir';}
function go(target,automatic=false){
  if(!automatic)stop();movement?.kill();sweepMotion?.kill();index=Math.max(0,Math.min(19,target));extraClicks=0;liveLog='';draw();
  const s=steps[index],prev=steps[Math.max(0,index-1)];gsap.set('#packet',{xPercent:s.position*1100});
  if(s.packet&&!reduced.matches&&s.position!==prev.position)movement=gsap.fromTo('#packet',{xPercent:prev.position*1100},{xPercent:s.position*1100,duration:1.1,ease:'power1.inOut'});
  timeline.seek(index+.001);if(s.sweep&&!reduced.matches)sweepMotion=timeline.tweenTo(index+.95,{duration:1.3});else timeline.seek(index+.95);
}
function schedule(){clearTimeout(timer);if(playing)timer=setTimeout(()=>{go(index+1,true);if(index===19)stop();else schedule();},Number($('speed').value)*1000);}
function togglePlay(){if(playing)return stop();if(index===19)go(0);playing=true;$('play').textContent='Ⅱ Pausar';schedule();}
$('previous').onclick=()=>go(index-1);$('next').onclick=()=>go(index+1);$('restart').onclick=()=>go(0);$('play').onclick=togglePlay;
$('chapters').onclick=e=>{const b=e.target.closest('[data-chapter]');if(b)go(chapters[Number(b.dataset.chapter)].start);};
$('milestones').onclick=e=>{const b=e.target.closest('[data-step]');if(b){go(Number(b.dataset.step));$('milestones').querySelector('[aria-current]').focus({preventScroll:true});}};
$('scenario').onchange=()=>{steps=makeSteps($('scenario').value);go(0);};$('speed').onchange=schedule;$('request').onclick=()=>go(1);
$('count').onclick=()=>{stop();extraClicks++;liveLog='Clic real en el simulador → contador '+(steps[index].clicks+extraClicks);draw();halo('count','usuario');halo('counter','react');};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen').textContent='Usa fullscreen del navegador';}};
document.addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.target.matches('input,select,textarea')||(e.key===' '&&e.target.closest('button')))return;if(!['ArrowRight','ArrowLeft','Home','End',' '].includes(e.key))return;e.preventDefault();const focus=e.target.closest('.milestone');if(e.key==='ArrowRight')go(index+1);if(e.key==='ArrowLeft')go(index-1);if(e.key==='Home')go(0);if(e.key==='End')go(19);if(e.key===' ')togglePlay();if(focus)$('milestones').querySelector('[aria-current]').focus({preventScroll:true});});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
function fit(){const z=devicePixelRatio/initialRatio,s=Math.min(innerWidth*z/1920,innerHeight*z/1180);$('stage').style.transform='scale('+s+')';$('stage').style.left=Math.max(0,(innerWidth-1920*s)/2)+'px';$('stage').style.top=Math.max(0,(innerHeight-1180*s)/2)+'px';document.body.style.width=Math.max(innerWidth,1920*s)+'px';document.body.style.height=Math.max(innerHeight,1180*s)+'px';}
addEventListener('resize',fit);fit();go(0);
