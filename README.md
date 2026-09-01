# 1Z0-830 · Preparación Java SE 21

App de estudio para la certificación **Oracle Certified Professional: Java SE 21 Developer**.
Sin dependencias, sin build, sin servidor: HTML, CSS y JavaScript a pelo. Se instala en el
móvil como aplicación y funciona sin conexión.

**App publicada:** https://agonzaleztic-source.github.io/1z0-830-java21/

## Qué hace

- **Teoría** completa: los 71 puntos del temario explicados en 664 apartados entre párrafos,
  fragmentos de código comentado y trampas del examen. Se lee un área entera de corrido, con
  índice de saltos arriba y navegación al área siguiente al final.
- **Temario** con los diez grupos de objetivos que publica Oracle, desglosados en esos 71 puntos.
  Sirve como lista de control: cada punto se marca cuando lo dominas y despliega su teoría.
- **Práctica** con repetición espaciada: lo que aciertas vuelve más tarde, lo que fallas vuelve mañana.
- **Simulacro** cronometrado a 50 preguntas y 120 minutos, con el 68 % como línea de aprobado.
- **Plan** de 17 bloques que se reparten automáticamente entre hoy y la fecha del examen.
- **Espectro de objetivos** en la cabecera: diez barras que muestran de un vistazo por dónde flojeas.

El progreso se guarda en `localStorage`, así que es por navegador y por dispositivo.
Para pasarlo del PC al móvil usa los botones de exportar e importar del pie de página.

## Estructura

```
├── index.html              maquetación y orden de carga de los scripts
├── manifest.webmanifest    metadatos de la PWA
├── sw.js                   service worker (modo sin conexión)
├── css/
│   └── styles.css
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── js/
    ├── storage.js          localStorage + exportar/importar
    ├── data.js             áreas, temario y plan de estudio
    ├── questions.js        banco de preguntas
    ├── theory.js           teoría de cada punto del temario
    ├── app.js              lógica de vistas y repetición espaciada
    └── main.js             arranque y registro del service worker
```

Los scripts se cargan como scripts clásicos, sin módulos ES, y comparten ámbito global.
El orden de `index.html` importa: `app.js` usa lo que definen los tres anteriores.

## Ejecutar en local

Necesitas servirlo por HTTP. Abrir `index.html` con doble clic (`file://`) hace que el
service worker no se registre.

En VS Code, instala la extensión **Live Server** (ya está en las recomendaciones del
proyecto), pulsa *Go Live* abajo a la derecha y abre `http://127.0.0.1:5500`.

Alternativa desde terminal, si tienes Python:

```bash
python3 -m http.server 5500
```

## Añadir preguntas

Todo el banco está en `js/questions.js` como un array de objetos:

```js
{
  id: 't8',                 // único en todo el archivo
  a: 'tipos',               // área: tipos flujo poo exc col str mod conc io l10n
  p: '¿Qué imprime?',       // enunciado
  c: `int x = 1;\n...`,     // fragmento de código (opcional)
  o: ['1', '2', '3', '4'],  // opciones
  k: [1],                   // índices correctos; varios = pregunta de selección múltiple
  e: 'Explicación de por qué la correcta lo es y por qué las otras no.'
}
```

Consejos si vas a escribirlas tú:

- El examen mide sobre todo tu capacidad de **leer** código, no de escribirlo.
  Prioriza preguntas de «qué imprime esto» y «por qué no compila».
- Los distractores tienen que ser plausibles. Una opción absurda no enseña nada.
- La explicación es la parte que más rinde: escribe también por qué fallan las otras.
- Verifica siempre el resultado ejecutándolo de verdad en un JDK 21 antes de darlo por bueno.

Para añadir puntos al temario o cambiar el plan, edita `SYL` y `PLAN` en `js/data.js`.

## Añadir teoría

`js/theory.js` guarda el contenido de cada punto. La clave es `'area:índice'` y debe
coincidir con la posición del punto dentro de su array en `SYL`:

```js
'tipos:0': [
  ['p', 'Un párrafo de explicación.'],
  ['c', 'int x = 1;\nSystem.out.println(x);'],   // código
  ['x', 'Lo que el examen intenta colarte aquí.'] // trampa, se pinta en naranja
]
```

Los puntos sin entrada aparecen marcados como «sin teoría» y siguen siendo utilizables:
la app no se rompe por tener huecos. El código se escapa antes de insertarlo, así que
puedes usar `<` y `>` sin problema.

Cobertura actual: las diez áreas están completas, los 71 puntos del temario. Ninguno
aparece ya como «sin teoría». El reparto por área anda entre los 42 apartados de *flujo* y
los 105 de *streams*.

## Publicar en GitHub Pages

1. Sube el repositorio a GitHub.
2. *Settings* → *Pages* → *Source*: **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. En un par de minutos estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.
   En este repositorio ya está activado: https://agonzaleztic-source.github.io/1z0-830-java21/

Las rutas del proyecto son relativas, así que funciona igual en la raíz del dominio que
en un subdirectorio.

Cada vez que cambies un archivo, **sube el número de `VERSION` en `sw.js`**. Si no lo haces,
el navegador seguirá sirviendo la copia cacheada y jurarás que tus cambios no se aplican.

## Instalar en el móvil

Abre la URL de GitHub Pages en el móvil.

- **Android / Chrome**: menú de tres puntos → *Añadir a pantalla de inicio*.
- **iOS / Safari**: botón compartir → *Añadir a pantalla de inicio*.

Queda como una app más, a pantalla completa y sin barra de navegador.

## Aviso

Ni Oracle ni ninguna entidad certificadora respalda este proyecto. Las preguntas son
originales y están pensadas para estudiar, no para reproducir el examen real.
Vuelca los objetivos oficiales desde la página de Oracle del examen 1Z0-830 antes de
presentarte, por si han cambiado.
