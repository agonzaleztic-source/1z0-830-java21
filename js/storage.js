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

/* Lee un archivo elegido por el usuario y devuelve el estado. */
function importarProgreso(archivo){
  return new Promise((ok, mal) => {
    const fr = new FileReader();
    fr.onload = () => {
      try{
        const d = JSON.parse(fr.result);
        if(!d || typeof d !== 'object' || !('srs' in d))
          throw new Error('El archivo no tiene el formato esperado.');
        ok(d);
      }catch(e){ mal(e); }
    };
    fr.onerror = () => mal(new Error('No se pudo leer el archivo.'));
    fr.readAsText(archivo);
  });
}
