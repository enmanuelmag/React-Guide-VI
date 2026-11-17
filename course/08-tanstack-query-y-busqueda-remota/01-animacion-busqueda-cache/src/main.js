import { gsap } from 'gsap';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/sora/600.css';
import '@fontsource/jetbrains-mono/400.css';
import './style.css';
import {codeLines,chapters,makeSteps} from './scenes.js';
import {highlightLines} from './highlight.js';

const $=id=>document.getElementById(id);
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),initialRatio=devicePixelRatio;
let steps=makeSteps(),index=0,playing=false,timer,sweepMotion;
$('code').innerHTML=highlightLines(codeLines.join('\n')).map((html,i)=>{
  return '<span class="code-line" data-line="'+(i+1)+'"><span class="line-number">'+(i+1)+'</span><code>'+html+'</code></span>';
}).join('');
$('chapters').innerHTML=chapters.map((c,i)=>'<button data-chapter="'+i+'">'+c.title.replace(/^\d+ · /,'')+'</button>').join('');
const timeline=gsap.timeline({paused:true});
for(let i=0;i<20;i++){
  timeline.addLabel('step-'+i,i).set('#sweep',{opacity:0,yPercent:0},i);
  if(i===12)timeline.fromTo('#sweep',{opacity:0,yPercent:0},{opacity:1,duration:.1,immediateRender:false},i+.01).to('#sweep',{yPercent:900,duration:.65,ease:'none'},i+.12).to('#sweep',{opacity:0,duration:.1},i+.8);
}
timeline.set('#sweep',{opacity:0},20);window.__timelines={'busqueda-cache':timeline};
function halo(id,origin){
  const n=$(id);n.classList.remove('user-halo','react-halo');delete n.dataset.changeOrigin;
  if(origin){n.classList.add(origin==='usuario'?'user-halo':'react-halo');n.dataset.changeOrigin=origin;}
}
function resultHtml(view){
  if(view==='initial')return '<div class="empty-message">Envía una búsqueda</div>';
  if(view==='loading')return '<div class="empty-message"><span class="spinner"></span>Cargando</div>';
  if(view==='error')return '<div class="empty-message">No pudimos buscar</div>';
  if(view==='empty')return '<div class="empty-message">Sin resultados</div>';
  const movies=[['Dune','2021 · Película'],['Dune: Parte dos','2024 · Película']];
  const series=[['Dune · miniserie','2000 · Serie']];
  return '<div class="result-heading">Resultados</div><div class="result-cards">'+(view==='movie'?movies:series).map(([title,detail])=>'<article class="result-card">'+title+'<small>'+detail+'</small></article>').join('')+'</div>';
}
function draw(){
  const s=steps[index];$('stage').dataset.step=String(index);
  $('step-index').textContent=String(index+1).padStart(2,'0');$('phase').textContent=chapters[s.chapter].title+' / '+s.phase;
  $('title').textContent=s.title;$('explanation').textContent=s.explanation;
  for(const row of $('code').children)row.classList.toggle('active',s.lines.includes(Number(row.dataset.line)));
  const input=s.submitted??{query:'',mediaType:'movie'};
  $('query-key').textContent="['media', 'search', { query: '"+input.query+"', mediaType: '"+input.mediaType+"' }]";
  $('movie-cache').textContent=s.movie;$('series-cache').textContent=s.series;
  $('cache-note').textContent=index===11&&s.status==='success'&&$('scenario').value!=='empty'
    ? "Adapter: releaseYear: 2021 → releaseLabel: '2021'; coverUrl → posterUrl."
    : index===10&&s.status==='success'&&$('scenario').value!=='empty'
    ? "DTO guardado: title: 'Dune', releaseYear: 2021, coverUrl: URL del póster."
    : index===18?'Fresco ≠ permanente.':'';
  for(const type of ['movie','series']){
    const n=$(type+'-drawer');n.classList.toggle('selected',s.active===type);n.classList.toggle('fresh',s[type].startsWith('fresco'));
    n.classList.toggle('cache-pulse',!!s.focusCache&&s.active===type);
    n.classList.toggle('unopened',type==='movie'?index<5:index<15);
  }
  $('query-status').textContent=s.status;$('fetch-status').textContent=s.fetchStatus;$('enabled').textContent=String(s.enabled);
  $('draft-input').value=s.draft;$('type-input').value=s.draftType;
  $('draft-value').textContent=(s.draft||'vacío')+' / '+s.draftType;
  $('submitted-value').textContent=s.submitted?s.submitted.query+' / '+s.submitted.mediaType:'ninguno';
  $('results').innerHTML=resultHtml(s.view);$('network-count').textContent='Network: '+s.requests+' POST';
  $('app-badge').textContent=s.fetchStatus==='fetching'?'Petición en curso':'Sin petición en curso';
  for(const id of ['draft-input','type-input','search-button','draft-value','submitted-value','results'])halo(id,s.user===id?'usuario':s.react?.includes(id)?'react':null);
  $('console').innerHTML=s.logs.map(log=>'<div class="console-line"><span class="log-kind flujo">FLUJO</span><code>'+escape(log.split('|').slice(1).join('|'))+'</code></div>').join('');
  const names=['Inicio','D','Dune','Tipo','Submit','Pedido','Key','Cajón','Request','Carga','DTO','Adapter','Render','Commit','Editar','Otra key','Request 2','Series','Volver','Cierre'];
  $('milestones').innerHTML=steps.filter(t=>t.chapter===s.chapter).map(t=>'<button data-step="'+t.index+'" class="milestone '+(t.index===index?'current':t.index<index?'visited':'')+'" '+(t.index===index?'aria-current="step"':'')+'><span>'+String(t.index+1).padStart(2,'0')+'</span><small>'+names[t.index]+'</small></button>').join('');
  for(const b of $('chapters').children)b.setAttribute('aria-pressed',String(Number(b.dataset.chapter)===s.chapter));
  $('previous').disabled=index===0;$('next').disabled=index===19;$('play').textContent=playing?'Ⅱ Pausar':'▶ Reproducir';
}
function stop(){playing=false;clearTimeout(timer);$('play').textContent='▶ Reproducir';}
function go(target,automatic=false){
  if(!automatic)stop();sweepMotion?.kill();index=Math.max(0,Math.min(19,target));draw();
  const body=document.querySelector('.code-body');
  const row=$('code').querySelector('.active');
  if(index===0)body.scrollTop=0;
  else if(row&&(row.offsetTop<body.scrollTop+20||row.offsetTop+row.offsetHeight>body.scrollTop+body.clientHeight-20)){
    body.scrollTo({top:Math.max(0,row.offsetTop-body.clientHeight*.35),behavior:'instant'});
  }
  timeline.seek(index+.001);if(steps[index].sweep&&!reduced.matches)sweepMotion=timeline.tweenTo(index+.95,{duration:1.3});else timeline.seek(index+.95);
}
function schedule(){clearTimeout(timer);if(playing)timer=setTimeout(()=>{go(index+1,true);if(index===19)stop();else schedule();},Number($('speed').value)*1000);}
function togglePlay(){if(playing)return stop();if(index===19)go(0);playing=true;$('play').textContent='Ⅱ Pausar';schedule();}
$('previous').onclick=()=>go(index-1);$('next').onclick=()=>go(index+1);$('restart').onclick=()=>go(0);$('play').onclick=togglePlay;
$('chapters').onclick=e=>{const b=e.target.closest('[data-chapter]');if(b)go(chapters[Number(b.dataset.chapter)].start);};
$('milestones').onclick=e=>{const b=e.target.closest('[data-step]');if(b){go(Number(b.dataset.step));$('milestones').querySelector('[aria-current]').focus({preventScroll:true});}};
$('scenario').onchange=()=>{steps=makeSteps($('scenario').value);go(0);};$('speed').onchange=schedule;
$('search-button').onclick=()=>go(index<4?4:index===4?5:index<14?index+1:index===14?15:index===17?18:index+1);
$('type-input').onchange=()=>{if($('type-input').value==='series'&&index===13)go(14);else draw();};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen').textContent='Usa fullscreen del navegador';}};
document.addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey||e.target.matches('input,select,textarea')||(e.key===' '&&e.target.closest('button')))return;
  if(!['ArrowRight','ArrowLeft','Home','End',' '].includes(e.key))return;e.preventDefault();
  const focus=e.target.closest('.milestone');
  if(e.key==='ArrowRight')go(index+1);if(e.key==='ArrowLeft')go(index-1);if(e.key==='Home')go(0);if(e.key==='End')go(19);if(e.key===' ')togglePlay();
  if(focus)$('milestones').querySelector('[aria-current]').focus({preventScroll:true});
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
function fit(){const z=devicePixelRatio/initialRatio,s=Math.min(innerWidth*z/1920,innerHeight*z/1180);$('stage').style.transform='scale('+s+')';$('stage').style.left=Math.max(0,(innerWidth-1920*s)/2)+'px';$('stage').style.top=Math.max(0,(innerHeight-1180*s)/2)+'px';document.body.style.width=Math.max(innerWidth,1920*s)+'px';document.body.style.height=Math.max(innerHeight,1180*s)+'px';}
addEventListener('resize',fit);fit();go(0);
