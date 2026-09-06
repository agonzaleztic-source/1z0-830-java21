/* ============================================================
   Arranque
   ============================================================ */
document.getElementById('examDate').onchange = e => {
  S.examDate = e.target.value;
  guardar();
  pintar();
};

/* ---- copia de seguridad entre dispositivos ---- */
document.getElementById('btnExport').onclick = () => exportarProgreso(S);

document.getElementById('btnImport').onclick = () =>
  document.getElementById('fileImport').click();

document.getElementById('fileImport').onchange = async e => {
  const f = e.target.files[0];
  if(!f) return;
  const aviso = document.getElementById('avisoDatos');
  try{
    const d = await importarProgreso(f);
    S = Object.assign(S, d);
    guardar();
    pintar();
    aviso.textContent = 'Progreso importado.';
    aviso.style.color = 'var(--ok)';
  }catch(err){
    aviso.textContent = err.message;
    aviso.style.color = 'var(--no)';
  }
  e.target.value = '';
};

cargar();

/* ---- modo sin conexión + aviso de versión nueva ---- */
if('serviceWorker' in navigator){
  /* Si ya había un controller al cargar la página, un controllerchange
     posterior es un cambio real de versión y toca recargar. Si no había
     ninguno (primera visita o primera instalación), el primer controller
     que aparece es el normal al arrancar, no una actualización: recargar
     ahí metería a un usuario nuevo en un bucle de recarga inútil. */
  const yaHabiaControlador = !!navigator.serviceWorker.controller;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      if(reg.waiting) avisarActualizacion(reg);
      reg.addEventListener('updatefound', () => {
        const nuevo = reg.installing;
        if(!nuevo) return;
        nuevo.addEventListener('statechange', () => {
          /* "installed" con un controller ya activo significa que hay una
             copia nueva instalada mientras otra sigue sirviendo esta
             pestaña: es una actualización, no la primera instalación. */
          if(nuevo.state === 'installed' && navigator.serviceWorker.controller){
            avisarActualizacion(reg);
          }
        });
      });
    }).catch(e => console.warn('Sin modo offline:', e.message));
  });

  let recargandoPorActualizacion = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if(!yaHabiaControlador || recargandoPorActualizacion) return;
    recargandoPorActualizacion = true;
    window.location.reload();
  });
}

function avisarActualizacion(reg){
  const ban = document.getElementById('banAct');
  if(!ban) return;
  ban.hidden = false;
  document.getElementById('btnActualizar').onclick = () => {
    if(reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
  };
}
