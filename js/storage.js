/* ============================================================
   Persistencia local.

   El progreso vive en localStorage, que es por navegador y por
   dispositivo: lo que estudies en el PC no aparece en el móvil.
   Por eso hay exportar e importar, que mueven todo el estado en
   un archivo JSON.
   ============================================================ */
const Store = {
  get(clave){
    try{
      const bruto = localStorage.getItem(clave);
      return bruto ? JSON.parse(bruto) : null;
    }catch(e){
      console.warn('No se pudo leer el progreso guardado:', e);
      return null;
    }
  },

  set(clave, valor){
    try{
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    }catch(e){
      // Suele significar cuota llena o modo privado con almacenamiento bloqueado.
      console.error('No se pudo guardar el progreso:', e);
      return false;
    }
  },

  borrar(clave){ localStorage.removeItem(clave); }
};

/* Descarga el estado actual como archivo. */
function exportarProgreso(estado){
  const blob = new Blob([JSON.stringify(estado, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '1z0-830-progreso-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

/* ============================================================
   Saneado del estado.

   Todo lo que entra de fuera (archivo importado o localStorage
   manipulado) pasa por aquí. No se confía en ningún campo: se
   reconstruye un objeto nuevo campo a campo, con el tipo y el
   rango esperados, y se descarta el resto.

   Dos motivos. Uno, esos valores acaban dibujándose en el HTML,
   así que una cadena con marcado dentro sería código ejecutable.
   Dos, una fecha inválida rompía la vista Plan y, como el estado
   se guarda, la app quedaba rota también al volver a abrirla.
   ============================================================ */
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const esISO = s => typeof s === 'string' && ISO.test(s) && !isNaN(new Date(s).getTime());
const entero = (v, min, max, pordefecto) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : pordefecto;
};

function sanearEstado(d){
  const limpio = {examDate:'', srs:{}, syl:{}, mocks:[], inicio:'', ultimaArea:''};
  if(!d || typeof d !== 'object' || Array.isArray(d)) return limpio;

  if(esISO(d.examDate)) limpio.examDate = d.examDate;
  if(esISO(d.inicio))   limpio.inicio   = d.inicio;
  if(typeof d.ultimaArea === 'string' && /^[a-z0-9]{1,10}$/.test(d.ultimaArea))
    limpio.ultimaArea = d.ultimaArea;

  if(d.srs && typeof d.srs === 'object' && !Array.isArray(d.srs)){
    for(const k of Object.keys(d.srs)){
      /* __proto__ como clave cambiaría el prototipo del objeto destino */
      if(k === '__proto__' || !/^[A-Za-z0-9_:-]{1,40}$/.test(k)) continue;
      const v = d.srs[k];
      if(!v || typeof v !== 'object') continue;
      limpio.srs[k] = {
        box:  entero(v.box, 0, INTERVALOS_MAX, 0),
        ok:   entero(v.ok,   0, 1e6, 0),
        fail: entero(v.fail, 0, 1e6, 0),
        due:  esISO(v.due) ? v.due : ''
      };
    }
  }

  if(d.syl && typeof d.syl === 'object' && !Array.isArray(d.syl)){
    for(const k of Object.keys(d.syl)){
      if(k === '__proto__' || !/^[a-z0-9]{1,10}:\d{1,3}$/.test(k)) continue;
      if(d.syl[k]) limpio.syl[k] = true;
    }
  }

  if(Array.isArray(d.mocks)){
    limpio.mocks = d.mocks.slice(-50)
      .filter(m => m && typeof m === 'object' && !Array.isArray(m))
      .map(m => ({
        d:   esISO(m.d) ? m.d : '',
        n:   entero(m.n,   0, 500,   0),
        ok:  entero(m.ok,  0, 500,   0),
        pct: entero(m.pct, 0, 100,   0),
        min: entero(m.min, 0, 10000, 0)
      }));
  }
  return limpio;
}
/* Tope de caja: app.js define INTERVALOS, pero storage.js se carga antes. */
const INTERVALOS_MAX = 20;

/* Lee un archivo elegido por el usuario y devuelve el estado ya saneado. */
function importarProgreso(archivo){
  return new Promise((ok, mal) => {
    const fr = new FileReader();
    fr.onload = () => {
      try{
        const d = JSON.parse(fr.result);
        if(!d || typeof d !== 'object' || Array.isArray(d) || !('srs' in d))
          throw new Error('El archivo no tiene el formato esperado.');
        ok(sanearEstado(d));
      }catch(e){ mal(e); }
    };
    fr.onerror = () => mal(new Error('No se pudo leer el archivo.'));
    fr.readAsText(archivo);
  });
}
