/* ============================================================
   estado y persistencia
   ============================================================ */
const KEY = 'j830:estado';
const INTERVALOS = [0, 1, 2, 4, 8, 16, 30];
let S = {examDate:'', srs:{}, syl:{}, mocks:[], inicio:''};
let tab = 'hoy', filtro = null;

function cargar(){
  const guardado = Store.get(KEY);
  if(guardado) S = Object.assign(S, guardado);
  if(!S.examDate) S.examDate = porDefectoExamen();
  if(!S.inicio) S.inicio = hoyISO();
  pintar();
}
let pend = null;
function guardar(){
  clearTimeout(pend);
  pend = setTimeout(async()=>{
    Store.set(KEY, S);
  }, 400);
}

const hoyISO = () => new Date().toISOString().slice(0,10);
function porDefectoExamen(){
  const d = new Date(); d.setDate(d.getDate() + 112);
  return d.toISOString().slice(0,10);
}
const dias = (a,b) => Math.round((new Date(b) - new Date(a)) / 86400000);
function masDias(n){
  const d = new Date(); d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}
const fmt = iso => {
  const [y,m,d] = iso.split('-');
  return d + ' ' + ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][+m-1];
};

/* dominio por área: cuánto han subido de caja las preguntas de esa área */
function dominioPct(area){
  const qs = Q.filter(q => q.a === area);
  if(!qs.length) return 0;
  const max = qs.length * (INTERVALOS.length - 1);
  const suma = qs.reduce((t,q) => t + Math.min((S.srs[q.id]||{}).box || 0, INTERVALOS.length-1), 0);
  return Math.round(suma / max * 100);
}
function temarioPct(area){
  const t = SYL[area] || [];
  if(!t.length) return 0;
  const hechos = t.filter((_,i) => S.syl[area+':'+i]).length;
  return Math.round(hechos / t.length * 100);
}
/* mezcla lo estudiado con lo acertado, que es lo que de verdad indica si estás listo */
const listo = area => Math.round(temarioPct(area)*0.35 + dominioPct(area)*0.65);

function pendientes(area){
  const h = hoyISO();
  return Q.filter(q => (!area || q.a === area) &&
    (!S.srs[q.id] || S.srs[q.id].due <= h));
}

/* ============================================================
   cabecera
   ============================================================ */
function pintarCabecera(){
  const d = dias(hoyISO(), S.examDate);
  document.getElementById('cdDays').textContent = d >= 0 ? d : '—';
  document.getElementById('examDate').value = S.examDate;

  const spec = document.getElementById('spec');
  const lab = document.getElementById('specLab');
  spec.innerHTML = ''; lab.innerHTML = '';
  AREAS.forEach(a => {
    const pct = listo(a.id);
    const b = document.createElement('button');
    b.className = filtro === a.id ? 'sel' : '';
    b.title = a.n + ' · ' + pct + '% listo';
    b.innerHTML = '<span class="pct">' + (pct||'') + '</span>' +
      '<span class="bar" style="height:' + Math.max(pct, 4) + '%"></span>';
    b.onclick = () => { filtro = filtro === a.id ? null : a.id; tab = 'practica'; pintar(); };
    spec.appendChild(b);
    const s = document.createElement('span');
    s.textContent = a.ab; lab.appendChild(s);
  });
}

/* ============================================================
   vistas
   ============================================================ */
const TABS = [['hoy','Hoy'],['teoria','Teoría'],['temario','Temario'],['practica','Práctica'],
              ['simulacro','Simulacro'],['plan','Plan']];

function pintarNav(){
  const n = document.getElementById('nav');
  n.innerHTML = '';
  TABS.forEach(([id,t]) => {
    const b = document.createElement('button');
    b.textContent = t; b.className = tab === id ? 'on' : '';
    b.onclick = () => { if(id === 'practica') libre = false; tab = id; pintar(); };
    n.appendChild(b);
  });
}

function pintar(){
  pintarCabecera(); pintarNav();
  const v = document.getElementById('view');
  v.innerHTML = '';
  ({hoy:vistaHoy, teoria:vistaTeoria, temario:vistaTemario, practica:vistaPractica,
    simulacro:vistaSimulacro, plan:vistaPlan})[tab](v);
}

/* ---------------- HOY ---------------- */
function bloqueActual(){
  const total = Math.max(dias(S.inicio, S.examDate), PLAN.length);
  const paso = total / PLAN.length;
  const t = Math.max(dias(S.inicio, hoyISO()), 0);
  return Math.min(Math.floor(t / paso), PLAN.length - 1);
}
function vistaHoy(v){
  const i = bloqueActual();
  const [titulo, areas] = PLAN[i];
  const cola = pendientes();
  const total = Q.length;
  const vistas = Object.keys(S.srs).length;
  const fallos = Q.filter(q => (S.srs[q.id]||{}).box === 0 && S.srs[q.id]).length;

  v.innerHTML =
    '<div class="card">' +
      '<div class="qmeta"><span>bloque ' + (i+1) + ' de ' + PLAN.length + '</span>' +
      '<span>' + fmt(hoyISO()) + '</span></div>' +
      '<h2>' + titulo + '</h2>' +
      '<p class="sub">' + areas.map(a => AREA[a].n).join(' · ') + '</p>' +
      '<div class="stat">' +
        '<div><b>' + cola.length + '</b><span>preguntas tocan hoy</span></div>' +
        '<div><b>' + vistas + '/' + total + '</b><span>del banco vistas</span></div>' +
        '<div><b>' + fallos + '</b><span>en la caja de fallos</span></div>' +
        '<div><b>' + listoGlobal() + '%</b><span>preparación global</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="card">' +
      '<h2>Rutina del día</h2>' +
      '<p class="sub">Cuarenta minutos bien puestos rinden más que tres horas de leer en diagonal.</p>' +
      '<div class="topic"><div class="t">1 · Estudia el tema del bloque</div>' +
      '<div class="d">Abre Teoría y lee de corrido ' + areas.map(a=>AREA[a].ab).join(' y ') +
      '. Escribe tú el código de cada concepto en un IDE y marca los puntos que domines.</div></div>' +
      '<div class="topic"><div class="t">2 · Vacía la cola de repaso</div>' +
      '<div class="d">' + cola.length + ' preguntas esperan. Lo que fallas sigue en la cola de hoy hasta que lo aciertes; lo que aciertas se aleja en el tiempo.</div></div>' +
      '<div class="topic"><div class="t">3 · Un simulacro por semana</div>' +
      '<div class="d">A partir del bloque 8. Cincuenta preguntas, ciento veinte minutos, sin pausas y sin consultar nada.</div></div>' +
      '<div class="row" style="margin-top:16px">' +
        '<button class="btn pri" id="goTeo">Leer la teoría</button>' +
        '<button class="btn" id="goPract">Practicar ahora</button>' +
        '<button class="btn" id="goTem">Ver temario</button>' +
      '</div>' +
    '</div>';
  document.getElementById('goTeo').onclick = () => abrirTeoria(areas[0]);
  document.getElementById('goPract').onclick = () => { filtro=null; tab='practica'; pintar(); };
  document.getElementById('goTem').onclick = () => { filtro=areas[0]; tab='temario'; pintar(); };
}
const listoGlobal = () => Math.round(AREAS.reduce((t,a)=>t+listo(a.id),0)/AREAS.length);

/* ---------------- TEMARIO ---------------- */
let abierto = null;   // clave 'area:indice' del punto desplegado

/* Convierte los bloques de TEORIA en HTML. */
function pintarTeoria(clave){
  const bloques = (typeof TEORIA !== 'undefined' && TEORIA[clave]) || null;
  if(!bloques) return '<div class="teoria"><p class="pendiente">' +
    'Teoría todavía sin escribir para este punto.</p></div>';
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return '<div class="teoria">' + bloques.map(([tipo, txt]) =>
      tipo === 'c' ? '<pre>' + esc(txt) + '</pre>'
    : tipo === 'x' ? '<div class="trampa">' + txt + '</div>'
    :                '<p>' + txt + '</p>'
  ).join('') + '</div>';
}

function vistaTemario(v){
  AREAS.forEach(a => {
    if(filtro && filtro !== a.id) return;
    const t = SYL[a.id] || [];
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = '<div class="qmeta"><span>' + a.ab + '</span><span>' +
      temarioPct(a.id) + '% marcado</span></div><h2>' + a.n + '</h2>' +
      '<div class="lista"></div>';
    const L = c.querySelector('.lista');

    t.forEach((x, i) => {
      const k = a.id + ':' + i;
      const marcado = !!S.syl[k];
      const hayTeoria = typeof TEORIA !== 'undefined' && !!TEORIA[k];
      const d = document.createElement('div');
      d.className = 'topic' + (marcado ? ' done' : '');

      const fila = document.createElement('div');
      fila.className = 'fila';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = marcado;
      cb.title = 'Marcar como dominado';
      cb.onclick = ev => ev.stopPropagation();
      cb.onchange = () => { S.syl[k] = cb.checked; guardar(); pintar(); };

      const txt = document.createElement('button');
      txt.className = 'abrir' + (abierto === k ? ' on' : '');
      txt.innerHTML = '<div class="t">' + x[0] +
        (hayTeoria ? '' : ' <span class="tg">sin teoría</span>') + '</div>' +
        '<div class="d">' + x[1] + '</div>';
      txt.onclick = () => { abierto = abierto === k ? null : k; pintar(); };

      fila.appendChild(cb);
      fila.appendChild(txt);
      d.appendChild(fila);

      if(abierto === k){
        const cuerpo = document.createElement('div');
        cuerpo.innerHTML = pintarTeoria(k);
        const acc = document.createElement('div');
        acc.className = 'row';
        acc.style.marginTop = '14px';
        const bp = document.createElement('button');
        bp.className = 'btn';
        bp.textContent = 'Practicar ' + AREA[a.id].ab;
        bp.onclick = () => { filtro = a.id; tab = 'practica'; siguientePregunta(); pintar(); };
        const bm = document.createElement('button');
        bm.className = 'btn pri';
        bm.textContent = marcado ? 'Desmarcar' : 'Lo domino';
        bm.onclick = () => { S.syl[k] = !marcado; guardar(); pintar(); };
        const bl = document.createElement('button');
        bl.className = 'btn';
        bl.textContent = 'Leer el área entera';
        bl.onclick = () => abrirTeoria(a.id, i);
        acc.appendChild(bm); acc.appendChild(bl); acc.appendChild(bp);
        cuerpo.appendChild(acc);
        d.appendChild(cuerpo);
      }
      L.appendChild(d);
    });
    v.appendChild(c);
  });

  if(filtro){
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = 'Ver las diez áreas';
    b.onclick = () => { filtro = null; pintar(); };
    v.appendChild(b);
  }
}

/* ---------------- TEORÍA ---------------- */
/* El Temario sirve para marcar lo que dominas, punto por punto.
   Este apartado es para lo otro: sentarse a leer un área entera de corrido. */
let areaTeoria = null;   // área que se está leyendo; null = índice de las diez
let irAPunto = null;     // clave a la que saltar en cuanto se pinte

const bloquesDe = area =>
  (SYL[area] || []).reduce((n, _, i) => n + hayTeoriaEn(area + ':' + i).length, 0);
const hayTeoriaEn = clave =>
  (typeof TEORIA !== 'undefined' && TEORIA[clave]) || [];

function abrirTeoria(area, punto){
  areaTeoria = area;
  irAPunto = (punto == null) ? null : area + ':' + punto;
  S.ultimaArea = area;
  tab = 'teoria';
  guardar();
  pintar();
}

function vistaTeoria(v){
  if(areaTeoria) leerArea(v); else indiceTeoria(v);
}

/* ---- índice: las diez áreas ---- */
function indiceTeoria(v){
  const puntos = AREAS.reduce((n,a) => n + (SYL[a.id]||[]).length, 0);
  const bloques = AREAS.reduce((n,a) => n + bloquesDe(a.id), 0);

  const cab = document.createElement('div');
  cab.className = 'card';
  cab.innerHTML =
    '<div class="qmeta"><span>teoría</span><span>' + puntos + ' puntos · ' +
    bloques + ' apartados</span></div>' +
    '<h2>Los diez grupos de objetivos</h2>' +
    '<p class="sub">Aquí está la materia entera, explicada y con el código comentado. ' +
    'Fallar preguntas afila lo que ya sabes, pero primero hay que haberlo leído. ' +
    'Elige un área y léela de corrido; el examen no pregunta por temas sueltos.</p>';

  if(S.ultimaArea && AREA[S.ultimaArea]){
    const fila = document.createElement('div');
    fila.className = 'row';
    fila.style.marginTop = '16px';
    const b = document.createElement('button');
    b.className = 'btn pri';
    b.textContent = 'Seguir con ' + AREA[S.ultimaArea].n.toLowerCase();
    b.onclick = () => abrirTeoria(S.ultimaArea);
    fila.appendChild(b);
    cab.appendChild(fila);
  }
  v.appendChild(cab);

  const lista = document.createElement('div');
  lista.className = 'card';
  lista.innerHTML = '<div class="lista"></div>';
  const L = lista.querySelector('.lista');

  AREAS.forEach((a, i) => {
    const n = (SYL[a.id] || []).length;
    const pct = temarioPct(a.id);
    const d = document.createElement('div');
    d.className = 'topic' + (pct === 100 ? ' done' : '');
    const b = document.createElement('button');
    b.className = 'abrir areab';
    b.innerHTML =
      '<div class="t"><span class="num">' + String(i+1).padStart(2,'0') + '</span>' +
      a.n + '</div>' +
      '<div class="d">' + n + ' puntos · ' + bloquesDe(a.id) + ' apartados · ' +
      pct + '% marcado</div>';
    b.onclick = () => abrirTeoria(a.id);
    d.appendChild(b);
    L.appendChild(d);
  });
  v.appendChild(lista);
}

/* ---- lectura de un área completa ---- */
function leerArea(v){
  const a = AREA[areaTeoria];
  const t = SYL[areaTeoria] || [];
  const hechos = t.filter((_,i) => S.syl[areaTeoria+':'+i]).length;

  const cab = document.createElement('div');
  cab.className = 'card';
  cab.innerHTML =
    '<div class="qmeta"><span>' + a.ab + '</span><span>' + hechos + ' de ' +
    t.length + ' marcados</span></div>' +
    '<h2>' + a.n + '</h2>' +
    '<p class="sub">' + t.length + ' puntos · ' + bloquesDe(areaTeoria) +
    ' apartados de teoría.</p>' +
    '<div class="salto"></div>';

  const salto = cab.querySelector('.salto');
  t.forEach((x, i) => {
    const b = document.createElement('button');
    b.className = 'idx' + (S.syl[areaTeoria+':'+i] ? ' ok' : '');
    b.textContent = (i+1) + ' · ' + x[0];
    b.onclick = () => {
      const el = document.getElementById('pt-' + areaTeoria + '-' + i);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    };
    salto.appendChild(b);
  });

  const fila = document.createElement('div');
  fila.className = 'row';
  fila.style.marginTop = '16px';
  const volver = document.createElement('button');
  volver.className = 'btn';
  volver.textContent = 'Todas las áreas';
  volver.onclick = () => { areaTeoria = null; pintar(); window.scrollTo(0,0); };
  const practicar = document.createElement('button');
  practicar.className = 'btn pri';
  practicar.textContent = 'Practicar ' + a.ab;
  practicar.onclick = () => { filtro = areaTeoria; tab = 'practica'; siguientePregunta(); pintar(); };
  fila.appendChild(volver); fila.appendChild(practicar);
  cab.appendChild(fila);
  v.appendChild(cab);

  t.forEach((x, i) => {
    const k = areaTeoria + ':' + i;
    const marcado = !!S.syl[k];
    const c = document.createElement('div');
    c.className = 'card punto' + (marcado ? ' done' : '');
    c.id = 'pt-' + areaTeoria + '-' + i;
    c.innerHTML =
      '<div class="qmeta"><span>punto ' + (i+1) + ' de ' + t.length + '</span>' +
      '<span>' + (marcado ? 'dominado' : '') + '</span></div>' +
      '<h2>' + x[0] + '</h2>' +
      '<p class="sub">' + x[1] + '</p>' +
      pintarTeoria(k);

    const acc = document.createElement('div');
    acc.className = 'row';
    acc.style.marginTop = '4px';
    const bm = document.createElement('button');
    bm.className = 'btn' + (marcado ? '' : ' pri');
    bm.textContent = marcado ? 'Desmarcar' : 'Lo domino';
    bm.onclick = () => {
      S.syl[k] = !marcado;
      guardar();
      irAPunto = k;      // al repintar, quedarse donde estabas
      pintar();
    };
    acc.appendChild(bm);
    c.appendChild(acc);
    v.appendChild(c);
  });

  /* ---- saltar al área anterior o siguiente ---- */
  const pos = AREAS.findIndex(x => x.id === areaTeoria);
  const pie = document.createElement('div');
  pie.className = 'card';
  pie.innerHTML = '<p class="sub">Has llegado al final de ' + a.n.toLowerCase() + '.</p>';
  const nav = document.createElement('div');
  nav.className = 'row';
  if(pos > 0){
    const ant = document.createElement('button');
    ant.className = 'btn';
    ant.textContent = '← ' + AREAS[pos-1].n;
    ant.onclick = () => { abrirTeoria(AREAS[pos-1].id); window.scrollTo(0,0); };
    nav.appendChild(ant);
  }
  if(pos < AREAS.length - 1){
    const sig = document.createElement('button');
    sig.className = 'btn pri';
    sig.textContent = AREAS[pos+1].n + ' →';
    sig.onclick = () => { abrirTeoria(AREAS[pos+1].id); window.scrollTo(0,0); };
    nav.appendChild(sig);
  }
  pie.appendChild(nav);
  v.appendChild(pie);

  if(irAPunto){
    const el = document.getElementById('pt-' + irAPunto.replace(':','-'));
    if(el) el.scrollIntoView({block:'start'});
    irAPunto = null;
  }
}

/* ---------------- PRÁCTICA ---------------- */
let actual = null, elegidas = [], resuelta = false;
let libre = false;        // repaso fuera de la cola del día
let recientes = [];       // últimas vistas, para que una fallada no salga acto seguido

/* Cómo se lee un intervalo de la caja, en cristiano. */
const cuando = n => n === 0 ? 'sigue en la cola de hoy'
                  : n === 1 ? 'vuelve mañana'
                  :           'vuelve en ' + n + ' días';

function siguientePregunta(){
  const cola = pendientes(filtro);
  const pool = cola.length ? cola : (filtro ? Q.filter(q=>q.a===filtro) : Q);
  /* Una que acabas de fallar vuelve hoy, pero no en la pregunta siguiente:
     responderla con el enunciado todavía fresco no enseña nada. */
  const frescas = pool.filter(q => !recientes.includes(q.id));
  const elegible = frescas.length ? frescas : pool;
  actual = elegible[Math.floor(Math.random()*elegible.length)];
  recientes.push(actual.id);
  if(recientes.length > 6) recientes.shift();
  elegidas = []; resuelta = false;
}

/* Cola del día vacía: se avisa en vez de seguir sirviendo preguntas
   que tocaban dentro de una semana. */
function vistaHecho(v){
  const q = filtro ? Q.filter(x=>x.a===filtro) : Q;
  const fallos = q.filter(x => (S.srs[x.id]||{}).box === 0 && S.srs[x.id]).length;
  const c = document.createElement('div');
  c.className = 'card';
  c.innerHTML =
    '<div class="qmeta"><span>' + (filtro ? AREA[filtro].n : 'todas las áreas') +
    '</span><span>0 en cola</span></div>' +
    '<h2>Hecho por hoy</h2>' +
    '<p class="sub">No queda nada pendiente' + (filtro ? ' en esta área' : '') +
    '. Lo que has acertado ha subido de caja y volverá a su debido tiempo; ' +
    'lo que fallaste vuelve mañana. Descansar entre repasos es parte del método.</p>' +
    '<div class="stat">' +
      '<div><b>' + q.filter(x=>S.srs[x.id]).length + '/' + q.length + '</b><span>vistas</span></div>' +
      '<div><b>' + fallos + '</b><span>en la caja de fallos</span></div>' +
      '<div><b>' + listoGlobal() + '%</b><span>preparación global</span></div>' +
    '</div>';
  const fila = document.createElement('div');
  fila.className = 'row'; fila.style.marginTop = '16px';
  const b1 = document.createElement('button');
  b1.className = 'btn pri'; b1.textContent = 'Repasar de todas formas';
  b1.onclick = () => { libre = true; siguientePregunta(); pintar(); };
  const b2 = document.createElement('button');
  b2.className = 'btn'; b2.textContent = 'Leer teoría';
  b2.onclick = () => abrirTeoria(filtro || AREAS[0].id);
  fila.appendChild(b1); fila.appendChild(b2);
  if(filtro){
    const b3 = document.createElement('button');
    b3.className = 'btn'; b3.textContent = 'Quitar filtro de área';
    b3.onclick = () => { filtro = null; pintar(); };
    fila.appendChild(b3);
  }
  c.appendChild(fila);
  v.appendChild(c);
}
function vistaPractica(v){
  const cola = pendientes(filtro).length;
  if(!cola && !libre){ vistaHecho(v); return; }
  if(!actual || (filtro && actual.a !== filtro)) siguientePregunta();
  const q = actual, multi = q.k.length > 1;

  const c = document.createElement('div');
  c.className='card';
  c.innerHTML = '<div class="qmeta"><span>' + AREA[q.a].n + '</span>' +
    '<span>' + (libre && !cola ? 'repaso libre' : cola + ' en cola') +
    (filtro ? ' · filtrado' : '') + '</span></div>' +
    '<h2>' + q.p + '</h2>' + (multi ? '<p class="sub">Elige ' + q.k.length + ' respuestas.</p>' : '');
  if(q.c){ const pre=document.createElement('pre'); pre.textContent=q.c; c.appendChild(pre); }

  const box = document.createElement('div');
  q.o.forEach((op,i) => {
    const b = document.createElement('button');
    b.className='opt'; b.textContent = op;
    b.onclick = () => {
      if(resuelta) return;
      if(multi){
        const j = elegidas.indexOf(i);
        j >= 0 ? elegidas.splice(j,1) : elegidas.push(i);
      } else { elegidas = [i]; }
      refrescar();
    };
    box.appendChild(b);
  });
  c.appendChild(box);

  const acciones = document.createElement('div');
  acciones.className='row'; acciones.style.marginTop='12px';
  const bComp = document.createElement('button');
  bComp.className='btn pri'; bComp.textContent='Comprobar';
  const bSig = document.createElement('button');
  bSig.className='btn'; bSig.textContent='Siguiente';
  bSig.onclick = () => { siguientePregunta(); pintar(); };
  acciones.appendChild(bComp); acciones.appendChild(bSig);
  c.appendChild(acciones);

  const expl = document.createElement('div');
  c.appendChild(expl);
  v.appendChild(c);

  function refrescar(){
    [...box.children].forEach((b,i) => {
      b.className = 'opt' + (elegidas.includes(i) ? ' pick' : '');
    });
    bComp.disabled = elegidas.length === 0;
  }
  bComp.onclick = () => {
    if(resuelta || !elegidas.length) return;
    resuelta = true;
    const bien = elegidas.length === q.k.length && elegidas.every(i => q.k.includes(i));
    [...box.children].forEach((b,i) => {
      b.className = 'opt' + (q.k.includes(i) ? ' right' : (elegidas.includes(i) ? ' wrong' : ''));
    });
    /* Si la pregunta no tocaba hoy es repaso libre: se corrige, pero no se
       toca su planificación, para no adelantar ni retrasar la caja por gusto. */
    const tocaba = !S.srs[q.id] || S.srs[q.id].due <= hoyISO();
    let nota;
    if(tocaba){
      const st = S.srs[q.id] || {box:0, ok:0, fail:0};
      if(bien){ st.box = Math.min(st.box+1, INTERVALOS.length-1); st.ok++; }
      else { st.box = 0; st.fail++; }
      st.due = masDias(INTERVALOS[st.box]);
      S.srs[q.id] = st; guardar();
      nota = (bien ? 'Correcto · ' : 'Fallo · ') + cuando(INTERVALOS[st.box]);
    } else {
      nota = (bien ? 'Correcto' : 'Fallo') + ' · repaso libre, no cambia la planificación';
    }
    expl.innerHTML = '<div class="verdict" style="color:' + (bien?'var(--ok)':'var(--no)') + '">' +
      nota + '</div>' +
      '<div class="exp">' + q.e + '</div>';
    pintarCabecera();
  };
  refrescar();

  if(filtro){
    const b = document.createElement('button');
    b.className='btn'; b.textContent='Quitar filtro de área';
    b.onclick = ()=>{ filtro=null; siguientePregunta(); pintar(); };
    v.appendChild(b);
  }
}

/* ---------------- SIMULACRO ---------------- */
let mock = null, tic = null;
function vistaSimulacro(v){
  if(!mock){
    const hist = S.mocks.slice(-6).reverse();
    v.innerHTML = '<div class="card"><h2>Simulacro cronometrado</h2>' +
      '<p class="sub">Oracle da 120 minutos para 50 preguntas en el examen real. ' +
      'Aquí se replican el reloj y el formato con lo que haya en el banco. ' +
      'Sin apuntes, sin IDE y sin parar el cronómetro.</p>' +
      '<button class="btn pri" id="start">Empezar simulacro</button></div>' +
      (hist.length ? '<div class="card"><h2>Intentos anteriores</h2>' +
        hist.map(m => '<div class="topic"><div class="t">' + m.pct + '% · ' +
          m.ok + ' de ' + m.n + ' correctas</div><div class="d">' + fmt(m.d) +
          ' · ' + m.min + ' minutos empleados</div></div>').join('') + '</div>' : '');
    const s = document.getElementById('start');
    if(s) s.onclick = () => {
      const pool = [...Q].sort(()=>Math.random()-0.5).slice(0, Math.min(50, Q.length));
      mock = {qs:pool, i:0, resp:{}, fin:Date.now()+120*60000, ini:Date.now()};
      pintar();
    };
    return;
  }
  if(mock.hecho) return resultadoSimulacro(v);

  const q = mock.qs[mock.i], multi = q.k.length > 1;
  const sel = mock.resp[q.id] || [];
  const c = document.createElement('div');
  c.className='card';
  c.innerHTML = '<div class="qmeta"><span>pregunta ' + (mock.i+1) + ' de ' + mock.qs.length +
    '</span><span class="timer" id="tm"></span></div><h2>' + q.p + '</h2>' +
    (multi ? '<p class="sub">Elige ' + q.k.length + ' respuestas.</p>' : '');
  if(q.c){ const pre=document.createElement('pre'); pre.textContent=q.c; c.appendChild(pre); }
  const box=document.createElement('div');
  q.o.forEach((op,i)=>{
    const b=document.createElement('button');
    b.className='opt' + (sel.includes(i)?' pick':''); b.textContent=op;
    b.onclick=()=>{
      const s = mock.resp[q.id] || [];
      if(multi){ const j=s.indexOf(i); j>=0?s.splice(j,1):s.push(i); }
      else { s.length=0; s.push(i); }
      mock.resp[q.id]=s; pintar();
    };
    box.appendChild(b);
  });
  c.appendChild(box);
  const r=document.createElement('div'); r.className='row'; r.style.marginTop='12px';
  const prev=document.createElement('button'); prev.className='btn'; prev.textContent='Anterior';
  prev.disabled = mock.i===0; prev.onclick=()=>{mock.i--;pintar();};
  const next=document.createElement('button'); next.className='btn'; next.textContent='Siguiente';
  next.disabled = mock.i===mock.qs.length-1; next.onclick=()=>{mock.i++;pintar();};
  const end=document.createElement('button'); end.className='btn pri'; end.textContent='Entregar';
  end.onclick=()=>terminarSimulacro();
  r.appendChild(prev); r.appendChild(next); r.appendChild(end);
  c.appendChild(r); v.appendChild(c);

  clearInterval(tic);
  const reloj = () => {
    const el = document.getElementById('tm'); if(!el) return clearInterval(tic);
    const ms = mock.fin - Date.now();
    if(ms <= 0){ clearInterval(tic); return terminarSimulacro(); }
    const m = Math.floor(ms/60000), s = Math.floor(ms%60000/1000);
    el.textContent = m + ':' + String(s).padStart(2,'0');
    el.className = 'timer' + (m < 10 ? ' low' : '');
  };
  reloj(); tic = setInterval(reloj, 1000);
}
function terminarSimulacro(){
  clearInterval(tic);
  let ok = 0;
  mock.qs.forEach(q => {
    const s = mock.resp[q.id] || [];
    const bien = s.length === q.k.length && s.every(i => q.k.includes(i));
    if(bien) ok++;
    const st = S.srs[q.id] || {box:0, ok:0, fail:0};
    if(bien){ st.box = Math.min(st.box+1, INTERVALOS.length-1); st.ok++; }
    else { st.box = 0; st.fail++; }
    st.due = masDias(INTERVALOS[st.box]);
    S.srs[q.id] = st;
  });
  mock.hecho = true; mock.ok = ok;
  S.mocks.push({d:hoyISO(), n:mock.qs.length, ok, pct:Math.round(ok/mock.qs.length*100),
                min:Math.round((Date.now()-mock.ini)/60000)});
  guardar(); pintar();
}
function resultadoSimulacro(v){
  const pct = Math.round(mock.ok/mock.qs.length*100);
  const apto = pct >= 68;
  const c = document.createElement('div'); c.className='card';
  c.innerHTML = '<h2>' + pct + '% · ' + mock.ok + ' de ' + mock.qs.length + '</h2>' +
    '<p class="sub">' + (apto
      ? 'Por encima del 68% que Oracle exige para aprobar. Repasa igualmente cada fallo antes de pasar página.'
      : 'Por debajo del 68% necesario. Los fallos ya están de vuelta en la cola de repaso para mañana.') + '</p>';
  mock.qs.forEach((q,n) => {
    const s = mock.resp[q.id] || [];
    const bien = s.length===q.k.length && s.every(i=>q.k.includes(i));
    if(bien) return;
    const d = document.createElement('div'); d.className='topic';
    d.innerHTML = '<div class="t">' + (n+1) + ' · ' + q.p + ' <span class="tg">(' + AREA[q.a].ab + ')</span></div>' +
      '<div class="d">Correcta: ' + q.k.map(i=>q.o[i]).join(' / ') + '</div>' +
      '<div class="exp">' + q.e + '</div>';
    c.appendChild(d);
  });
  const b=document.createElement('button'); b.className='btn pri'; b.textContent='Volver';
  b.style.marginTop='14px';
  b.onclick=()=>{mock=null;pintar();};
  c.appendChild(b); v.appendChild(c);
}

/* ---------------- PLAN ---------------- */
function vistaPlan(v){
  const total = Math.max(dias(S.inicio, S.examDate), PLAN.length);
  const paso = total / PLAN.length;
  const act = bloqueActual();
  const semanal = paso < 6.5;
  const c = document.createElement('div'); c.className='card';
  c.innerHTML = '<h2>De aquí al ' + fmt(S.examDate) + '</h2>' +
    '<p class="sub">Diecisiete bloques repartidos sobre los ' + total + ' días disponibles: ' +
    'te tocan ' + (paso).toFixed(1) + ' días por bloque' +
    (semanal ? '. Va justo. O adelantas la dedicación diaria, o mueves la fecha del examen unas semanas.'
             : '. Da margen para repasar sin agobio.') + '</p>';
  PLAN.forEach(([t, areas], i) => {
    const d = new Date(S.inicio); d.setDate(d.getDate() + Math.round(i*paso));
    const iso = d.toISOString().slice(0,10);
    const row = document.createElement('div');
    row.className = 'wk' + (i===act ? ' now' : (i<act ? ' past' : ''));
    row.innerHTML = '<div class="dt">' + fmt(iso) + '</div>' +
      '<div class="tt">' + t + '</div>' +
      '<div class="tg">' + areas.slice(0,3).map(a=>AREA[a].ab).join(' ') + '</div>';
    c.appendChild(row);
  });
  v.appendChild(c);
}
