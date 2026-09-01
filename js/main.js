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

/* ---- modo sin conexión ---- */
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(e =>
      console.warn('Sin modo offline:', e.message));
  });
}
