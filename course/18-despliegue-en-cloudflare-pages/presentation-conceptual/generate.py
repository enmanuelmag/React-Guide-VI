"""Fuente editable del deck conceptual. Ejecutar con python3 generate.py."""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).parent
BLUE, INK, MUTED, GREEN, RED = '#223b8f', '#111b34', '#58657e', '#2f6f5e', '#a43d4a'

def text(x, y, value, size=32, color=INK, anchor='middle', weight=400):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{color}" font-size="{size}" font-weight="{weight}">{escape(value)}</text>'

def icon(name, x, y, size=104, color=BLUE):
    source = (ROOT / 'assets' / f'{name}.svg').read_text()
    body = re.search(r'<svg[^>]*>(.*)</svg>', source, re.S).group(1)
    return f'<g transform="translate({x},{y}) scale({size/24})" fill="none" stroke="{color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{body}</g>'

def line(x1, y1, x2, y2, label='', color=BLUE, dashed=False):
    return f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="3" marker-end="url(#arrow)" {"stroke-dasharray='9 8'" if dashed else ""}/>' + (text((x1+x2)/2,(y1+y2)/2-20,label,25,color) if label else '')

def node(name, x, y, title, sub='', color=BLUE, size=104):
    return icon(name,x-size/2,y,size,color)+text(x,y+size+47,title,36,color,weight=600)+(text(x,y+size+90,sub,28,MUTED) if sub else '')

def zone(x,y,w,h,label,color=BLUE):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#f0f3f9" stroke="#cbd4e4" stroke-width="2"/>'+text(x+28,y+45,label,25,color,'start',600)

def pill(x,y,label,color=BLUE,w=300):
    return f'<rect x="{x-w/2}" y="{y-34}" width="{w}" height="55" rx="5" fill="#e7ecf8"/>'+text(x,y,label,28,color,weight=600)

slides=[]
def slide(title, phase, svg, foot, notes, geometry='G17', semantic='S28'):
    slides.append(dict(title=title,phase=phase,svg=svg,foot=foot,notes=notes,geometry=geometry,semantic=semantic))

slide('De mi computadora al navegador de otra persona.',-1,
    node('laptop',270,170,'Mi proyecto','React + Vite')+line(420,225,700,225,'publicar')+node('globe',840,170,'Internet','Archivos disponibles')+line(990,225,1270,225,'visitar')+node('monitor',1420,170,'Su navegador','MediaLog funciona aquí'),
    'Despliegue web: SPA, build y CDN. Una explicación visual con MediaLog.',
    'Presentación complementaria conceptual, no sustituto del procedimiento de la sesión 18. Presentar de forma continua. Duración orientativa 15–20 minutos, pendiente de ensayo. No hay un despliegue real detrás de estos diagramas.', 'G02','S02')

slide('Publicar y visitar son dos recorridos distintos.',0,
    zone(0,15,1680,260,'PUBLICAR UNA VERSIÓN')+node('laptop',180,100,'Programador',size=64)+line(290,137,460,137,'sube código')+node('git-branch',560,100,'Repositorio',size=64)+line(680,137,900,137,'activa el proceso')+node('workflow',1010,100,'Pipeline',size=64)+line(1140,137,1370,137,'publica')+node('server',1480,100,'Hosting',size=64)+
    zone(0,310,1680,260,'VISITAR LA WEB')+node('user-round',180,390,'Persona',size=64)+line(290,425,460,425,'abre la URL')+node('monitor',560,390,'Navegador',size=64)+line(680,425,900,425,'pide archivos')+node('globe',1010,390,'CDN',size=64)+line(1140,425,1370,425,'los entrega')+node('monitor',1480,390,'React dibuja',size=64),
    'Hosting guarda la web. CDN distribuye archivos. Pipeline automatiza los pasos de publicación.',
    'Leer primero la fila superior y después la inferior. El hosting y la CDN cooperan; no son dos productos que el alumno tenga que contratar por separado. Cloudflare Pages integra ambas responsabilidades. La API se añade al mapa después de entender la entrega del frontend. Pregunta: ¿cada visitante ejecuta nuestro pipeline? No.', 'G12','S31')

slide('La “cloud” usa computadoras del proveedor.',1,
    zone(0,50,710,470,'TU COMPUTADORA')+node('laptop',355,170,'localhost','La dirección de este equipo')+
    zone(870,50,810,470,'INFRAESTRUCTURA DEL PROVEEDOR')+icon('cloud',1160,110,210)+icon('server',1000,340,105)+icon('server',1220,340,105)+icon('server',1440,340,105)+text(1275,490,'Servidores conectados a Internet',32)+line(740,285,840,285,'publicar'),
    'Hosting: servicio que conserva y entrega los archivos de tu web mediante una URL pública.',
    'La nube no es un lugar mágico: es infraestructura física administrada por un proveedor. localhost siempre se refiere al equipo que hace la petición. Compartir localhost no comparte tu computadora. Después del despliegue, apagar tu portátil no apaga los archivos alojados. No afirmar que todo hosting es una sola máquina ni que la nube solo sirve archivos.', 'G06','S20')

slide('El pipeline ejecuta una receta automática.',1,
    pill(230,70,'Cambio en Git')+line(405,55,600,55,'dispara')+pill(980,70,'Máquina temporal del proveedor',BLUE,660)+
    node('git-branch',150,210,'1. Obtener','La revisión del código',size=86)+line(260,250,345,250)+node('download',480,210,'2. Instalar','Dependencias',size=86)+line(590,250,675,250)+node('shield-check',810,210,'3. Comprobar','Si lo configuramos',size=86)+line(920,250,1005,250)+node('settings',1140,210,'4. Construir','pnpm build',size=86)+line(1250,250,1335,250)+node('package',1470,210,'5. Publicar','Salida: dist',size=86)+
    text(840,525,'Si un paso requerido falla, esta versión no se publica.',34,RED),
    'Pipeline = pasos automáticos en un orden definido. Pages puede ejecutarlos al recibir cambios de Git.',
    'La integración Git de Pages es el ejemplo, no asumimos GitHub Actions ni un YAML obligatorio. Instala, ejecuta el comando de build y publica la salida configurada. Los tests solo corren si el comando o pipeline los incluye; no aparecen por arte de magia. Si falla el nuevo despliegue, un despliegue anterior exitoso puede seguir disponible. Fuente: https://developers.cloudflare.com/pages/configuration/git-integration/', 'G13','S34')

slide('El build prepara archivos para el navegador.',1,
    zone(0,65,500,440,'ENTRADA: EL PROYECTO')+icon('folder',195,140,100)+text(250,310,'Componentes .tsx',34)+text(250,370,'Estilos + imágenes',34)+text(250,430,'Dependencias',34)+
    line(530,270,680,270)+node('settings',840,180,'Build','Transforma y empaqueta',size=125)+line(1000,270,1150,270)+
    zone(1180,65,500,440,'SALIDA: dist/')+icon('package',1380,140,100)+text(1430,310,'index.html',34)+text(1430,370,'assets/app-a1.js',34)+text(1430,430,'CSS + imágenes',34),
    'Artefactos = archivos producidos por el build. Publicamos el contenido de dist/.',
    'Vite transforma y empaqueta el código para producción. El nombre app-a1.js es ilustrativo: los nombres reales dependen del build. TypeScript y JSX se transforman, no los compila el visitante. pnpm build ejecuta el script del proyecto; los chequeos de tipos dependen de ese script. pnpm preview solo permite inspeccionar localmente dist, no es hosting de producción. Fuente: https://vite.dev/guide/static-deploy.html', 'G10','S27')

slide('Una CDN acerca copias de los archivos.',2,
    zone(430,25,820,545,'CDN: RED DE DISTRIBUCIÓN DE CONTENIDO')+
    node('server',180,210,'Hosting','Archivos publicados',size=95)+line(300,250,510,250,'entrega archivos')+
    icon('globe',730,180,210)+node('server',610,100,'Nodo A',size=66)+node('server',1080,100,'Nodo B',size=66)+node('server',1080,365,'Nodo C',size=66)+
    line(770,235,660,175,'',MUTED,True)+line(930,235,1045,175,'',MUTED,True)+line(930,290,1045,385,'',MUTED,True)+
    node('monitor',1495,205,'Visitante','Recibe los archivos',size=95)+line(1170,250,1380,250,'desde un nodo'),
    'La red dirige la petición a un nodo adecuado. Hosting + CDN vienen integrados en Cloudflare Pages.',
    'CDN significa Content Delivery Network. Un nodo es un punto de esa red. Dibujo conceptual, no geografía ni topología real de Cloudflare. Suele reducir distancia y carga del origen, sin garantizar que siempre use el nodo físicamente más cercano. Hosting conserva contenido; la CDN puede guardar copias reutilizables. No significa que cada despliegue copie de inmediato todos los archivos a todos los nodos. Fuentes: https://www.cloudflare.com/learning/cdn/what-is-a-cdn/ y https://www.cloudflare.com/learning/cdn/glossary/edge-server/', 'G17','S32')

slide('La CDN reutiliza una copia cuando puede.',2,
    zone(0,25,1680,255,'SIN COPIA UTILIZABLE EN ESTE NODO')+
    node('monitor',170,100,'Navegador',size=62)+line(290,135,650,135,'1. pide app-a1.js')+node('server',840,100,'Nodo CDN',size=62)+line(1000,125,1380,125,'2. pide al origen')+node('package',1510,100,'Origen',size=62)+line(1380,210,1000,210,'3. archivo',GREEN)+
    line(650,210,290,210,'4. entrega y conserva',GREEN)+
    zone(0,320,1680,255,'CON COPIA REUTILIZABLE')+node('monitor',170,395,'Navegador',size=62)+line(290,420,650,420,'1. pide app-a1.js')+node('server',840,395,'Nodo CDN',size=62)+line(650,510,290,510,'2. entrega la copia',GREEN)+icon('package',1465,390,80,MUTED)+text(1510,530,'Sin consultar el origen',26,MUTED),
    'Caché = copia temporal para reutilizar. Si falta o necesita validarse, puede consultarse al origen.',
    'En la fila superior el nodo obtiene el archivo, lo devuelve al navegador y puede conservarlo según las reglas de caché. Esta es una explicación general, no el detalle interno exacto de Pages. Caducar no significa borrar inmediatamente: puede requerirse revalidación. Distinguir esta caché de archivos de TanStack Query, que conserva respuestas para la app, y de la caché HTTP del propio navegador. Fuente: https://www.cloudflare.com/learning/cdn/performance/', 'G06','S33')

slide('La URL permite encontrar y pedir la web.',3,
    pill(840,75,'https://mi-medialog.pages.dev',BLUE,850)+
    node('user-round',180,220,'Persona','Abre la dirección',size=100)+line(290,270,450,270)+node('monitor',560,220,'Navegador','Inicia la visita',size=100)+line(680,270,900,270,'DNS: encontrar')+node('search',1010,220,'Dirección de red','Para ese dominio',size=100)+line(1140,270,1350,270,'HTTPS: pedir')+node('globe',1480,220,'CDN','Devuelve archivos',size=100),
    'DNS relaciona el nombre con una dirección de red. HTTPS protege la comunicación.',
    'URL ilustrativa, no un despliegue creado. Primero el navegador resuelve el dominio, posiblemente usando una caché; después establece la conexión segura y envía la petición HTTP. No presentar DNS como algo que entrega HTML ni como el sistema que elige componentes React. Simplificamos los intermediarios y la negociación TLS. El hosting/CDN atiende la petición, no el repositorio Git.', 'G10','S33')

slide('En CSR, React dibuja dentro del navegador.',3,
    node('globe',170,220,'CDN','Entrega archivos',size=110)+line(300,270,550,270,'HTML + CSS + JS')+
    zone(590,55,1090,470,'NAVEGADOR DE LA PERSONA')+
    node('file-code',770,190,'1. Lee HTML','Encuentra los recursos',size=85)+line(880,230,970,230)+node('settings',1090,190,'2. Ejecuta JS','React calcula la UI',size=85)+line(1210,230,1300,230)+node('monitor',1460,190,'3. Muestra','MediaLog',size=85),
    'CSR = renderizado del lado del cliente: el JavaScript de la app construye la interfaz en el navegador.',
    'En nuestra SPA sin SSR, index.html aporta la entrada y referencias a recursos; no contiene toda la interfaz React ya renderizada. El navegador pide recursos, procesa CSS y ejecuta JavaScript; React monta los componentes. No afirmar que HTML está completamente vacío ni que todo JavaScript necesariamente llega en una única descarga. El build ocurre antes; el render ocurre en cada navegador.', 'G12','S32')

slide('Cambiar el código requiere publicar otra versión.',4,
    zone(0,40,1680,260,'NUEVA PUBLICACIÓN')+node('git-branch',180,115,'Código B',size=65)+line(290,150,460,150)+node('settings',570,115,'Build B',size=65)+line(690,150,910,150)+node('package',1020,115,'app-b2.js',size=65)+line(1140,150,1370,150)+node('globe',1490,115,'Versión B',size=65)+
    node('monitor',430,370,'Pestaña ya abierta','Puede seguir ejecutando A',size=90,color=MUTED)+line(670,420,1000,420,'recarga / nueva carga')+node('monitor',1260,370,'Nueva carga','Obtiene la versión vigente',size=90),
    'Los nombres versionados ayudan a distinguir archivos nuevos de copias anteriores.',
    'app-a1.js y app-b2.js ilustran hashes de contenido. Un despliegue no reescribe el JavaScript que ya está ejecutándose en pestañas abiertas. La obtención de la versión vigente depende de reglas de caché correctas y revalidación del HTML; no prometer propagación instantánea ni un temporizador universal. Esta app no introduce un service worker. Pages gestiona publicación y caché de sus assets; no pedir purgas manuales como paso obligatorio.', 'G13','S34')

phases=['Mapa','Construir','Distribuir','Abrir','Actualizar']
parts=[]
for i,s in enumerate(slides):
    nav='' if s['phase']<0 else '<nav class="journey" aria-label="Recorrido">'+''.join(f'<span class="{"active" if j==s["phase"] else "done" if j<s["phase"] else ""}">{name}</span>'+('<b aria-hidden="true">→</b>' if j<4 else '') for j,name in enumerate(phases))+'</nav>'
    svg='<svg class="diagram" viewBox="0 0 1680 610" role="img" aria-label="'+escape(s['title'])+'"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs>'+s['svg']+'</svg>'
    # Unique marker IDs avoid cross-slide references in browsers and printed pages.
    svg=svg.replace('id="arrow"',f'id="arrow-{i}"').replace('url(#arrow)',f'url(#arrow-{i})')
    tag='h1' if i==0 else 'h2'
    parts.append(f'''<section data-slide-id="deploy-{i+1:02}" data-geometry="{s['geometry']}" data-semantic="{s['semantic']}">
<div class="slide-frame concept-frame">
{nav}
<header class="slide-heading"><p class="slide-label">MediaLog / Despliegue web</p><{tag} class="slide-title">{s['title']}</{tag}></header>
<div class="visual-stage">{svg}</div>
<p class="takeaway">{s['foot']}</p>
<aside class="notes">{escape(s['notes'])}</aside>
</div></section>''')

(ROOT/'index.html').write_text('''<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>De mi computadora a la web | MediaLog</title><meta name="description" content="Presentación visual de despliegue SPA: pipeline, build, artefactos, hosting, CDN y navegador."><link rel="stylesheet" href="./session.css"></head>
<body class="deploy-concepts"><div class="reveal"><div class="slides">'''+ '\n'.join(parts)+'''</div></div><script type="module" src="/src/framework/deck.js"></script></body></html>''')
print(f'{len(slides)} diapositivas generadas')
