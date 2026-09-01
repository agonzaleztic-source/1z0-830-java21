/* ============================================================
   Los 10 grupos de objetivos que publica Oracle para el 1Z0-830.
   Oracle no publica pesos por área, así que aquí pesan todas igual.
   ============================================================ */
const AREAS = [
  {id:'tipos',  ab:'tipos',  n:'Fechas, texto, números y booleanos'},
  {id:'flujo',  ab:'flujo',  n:'Control del flujo del programa'},
  {id:'poo',    ab:'poo',    n:'Enfoque orientado a objetos'},
  {id:'exc',    ab:'exc',    n:'Gestión de excepciones'},
  {id:'col',    ab:'col',    n:'Arrays y colecciones'},
  {id:'str',    ab:'streams',n:'Streams y expresiones lambda'},
  {id:'mod',    ab:'módulos',n:'Empaquetado y despliegue (JPMS)'},
  {id:'conc',   ab:'conc',   n:'Ejecución concurrente'},
  {id:'io',     ab:'I/O',    n:'API de entrada/salida'},
  {id:'l10n',   ab:'l10n',   n:'Localización'}
];
const AREA = Object.fromEntries(AREAS.map(a=>[a.id,a]));

/* ---------------- temario detallado ---------------- */
const SYL = {
 tipos:[
  ['Primitivos, wrappers y autoboxing','Rangos, promoción numérica, caché de Integer de -128 a 127, NaN e infinitos.'],
  ['Operadores y precedencia','Asignación compuesta con cast implícito, incremento pre/post, cortocircuito, ternario.'],
  ['String y StringBuilder','Inmutabilidad, pool de literales, métodos de String, capacidad y mutación de StringBuilder.'],
  ['Bloques de texto','Delimitador """, sangría incidental, secuencias \\s y \\ al final de línea.'],
  ['var e inferencia de tipos','Dónde se puede usar y dónde no: campos, parámetros, retornos, lambdas.'],
  ['java.time: fechas y horas','LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Instant. Inmutabilidad de todos ellos.'],
  ['Period, Duration y aritmética','plusX/minusX, ajuste de fin de mes, ChronoUnit.between, horario de verano.']
 ],
 flujo:[
  ['if / else y ternarios anidados','Alcance de variables, llaves omitidas, expresiones de tipo compatible.'],
  ['switch clásico vs switch con flecha','Caída entre casos, break, yield y switch como expresión.'],
  ['Pattern matching en switch','case Tipo t, guardas con when, case null, exhaustividad obligatoria.'],
  ['Pattern matching de registros','Deconstrucción anidada, patrones de tipo con genéricos.'],
  ['Bucles for, for-each, while, do-while','Inicializadores múltiples, alcance del índice, bucles infinitos.'],
  ['break y continue con etiqueta','Salida de bucles anidados, dónde es legal una etiqueta.']
 ],
 poo:[
  ['Clases, constructores y this()','Encadenado de constructores, orden de inicialización, bloques estáticos e de instancia.'],
  ['Herencia, super y polimorfismo','Sobrescritura vs sobrecarga, ocultación de estáticos y campos, covarianza de retorno.'],
  ['Modificadores de acceso y final','Efecto en herencia, variables efectivamente finales.'],
  ['Interfaces','Métodos default, static y private; conflicto de defaults; constantes implícitas.'],
  ['Clases abstractas vs interfaces','Cuándo compila cada una, métodos abstractos sin cuerpo.'],
  ['Records','Constructor compacto, componentes finales, equals/hashCode/toString generados, no extienden.'],
  ['Clases selladas (sealed)','permits, obligación de final/sealed/non-sealed en subtipos, jerarquías cerradas.'],
  ['Enums','Constructores, cuerpos por constante, values(), uso en switch.'],
  ['Clases anidadas y anónimas','Estáticas, internas, locales; captura de variables efectivamente finales.'],
  ['instanceof con patrón','Alcance de la variable de patrón según el flujo.']
 ],
 exc:[
  ['Jerarquía Throwable','Error, Exception, RuntimeException; comprobadas vs no comprobadas.'],
  ['try / catch / finally','Orden de los catch, finally que sustituye al return, catch inalcanzable.'],
  ['Multi-catch','Variable implícitamente final, prohibición de tipos relacionados por herencia.'],
  ['try-with-resources','AutoCloseable, orden de cierre inverso, recursos efectivamente finales, excepciones suprimidas.'],
  ['throw vs throws','Reglas al sobrescribir: no ampliar excepciones comprobadas.'],
  ['Excepciones propias y assertions','Constructores con causa, habilitación de asserts con -ea.']
 ],
 col:[
  ['Arrays','Declaración, arrays multidimensionales irregulares, Arrays.sort/binarySearch/compare.'],
  ['List, Set, Queue, Deque','Implementaciones y su coste; ArrayList vs LinkedList vs ArrayDeque.'],
  ['Map','HashMap, LinkedHashMap, TreeMap; merge, compute, getOrDefault, putIfAbsent.'],
  ['Colecciones inmutables','List.of, Map.of, Collectors.toUnmodifiableList y sus excepciones.'],
  ['SequencedCollection (Java 21)','getFirst/getLast, addFirst/addLast, reversed(), SequencedMap y putFirst.'],
  ['Comparable y Comparator','compareTo, comparing, thenComparing, reversed, naturalOrder.'],
  ['Genéricos','Comodines extends/super, borrado de tipos, métodos genéricos, PECS.'],
  ['equals y hashCode','Contrato entre ambos y su efecto en HashSet y HashMap.']
 ],
 str:[
  ['Interfaces funcionales','Predicate, Function, Supplier, Consumer, UnaryOperator y sus variantes primitivas.'],
  ['Lambdas y referencias a métodos','Los cuatro tipos de referencia, captura de variables.'],
  ['Optional','of, ofNullable, map, flatMap, orElse vs orElseGet, ifPresentOrElse.'],
  ['Creación de streams','of, iterate con predicado, generate, Arrays.stream, Files.lines.'],
  ['Operaciones intermedias','filter, map, flatMap, distinct, sorted, peek, limit, skip, mapMulti.'],
  ['Operaciones terminales','forEach, reduce en sus tres formas, count, anyMatch, findFirst.'],
  ['Streams primitivos','IntStream, LongStream, boxed, average, summaryStatistics.'],
  ['Collectors','toList, joining, groupingBy con downstream, partitioningBy, teeing.'],
  ['Pereza y streams paralelos','Nada ocurre sin operación terminal; un stream no se reutiliza.']
 ],
 mod:[
  ['module-info.java','requires, requires transitive, requires static, exports, exports...to.'],
  ['opens y reflexión','Diferencia entre exports y opens, módulos abiertos.'],
  ['Servicios','uses y provides...with, ServiceLoader.'],
  ['Tipos de módulo','Nombrados, automáticos, sin nombre; ruta de clases frente a ruta de módulos.'],
  ['Herramientas de línea de comandos','javac, java, jar, jdeps, jlink, jmod y sus opciones más frecuentes.'],
  ['Migración','Estrategias ascendente y descendente, dependencias cíclicas prohibidas.']
 ],
 conc:[
  ['Hilos de plataforma','Thread, Runnable, estados, join, interrupt, daemon.'],
  ['Hilos virtuales (Java 21)','Thread.ofVirtual, newVirtualThreadPerTaskExecutor, cuándo aportan y cuándo no.'],
  ['ExecutorService','submit vs execute, Future, invokeAll, shutdown vs shutdownNow, ScheduledExecutorService.'],
  ['Sincronización','synchronized, volatile, Lock y ReentrantLock, interbloqueos y condiciones de carrera.'],
  ['Clases atómicas y concurrentes','AtomicInteger, ConcurrentHashMap, CopyOnWriteArrayList, colas bloqueantes.'],
  ['CompletableFuture','supplyAsync, thenApply, thenCompose, thenCombine, join.'],
  ['Streams paralelos','Cuándo merecen la pena, reducciones asociativas, efectos colaterales.']
 ],
 io:[
  ['Streams de bytes y de caracteres','InputStream, Reader, Writer, decoradores, Buffered*.'],
  ['Consola y estándar','System.in/out/err, la clase Console, PrintWriter.'],
  ['NIO.2: Path','Path.of, resolve, resolve con ruta absoluta, relativize, normalize, subpath.'],
  ['NIO.2: Files','exists, copy, move, delete, readAllLines, lines, walk, find, newBufferedWriter.'],
  ['Atributos de archivo','BasicFileAttributes, opciones StandardOpenOption y StandardCopyOption.'],
  ['Serialización','Serializable, transient, serialVersionUID, constructor del primer padre no serializable.']
 ],
 l10n:[
  ['Locale','Locale.of, Locale.getDefault, categorías DISPLAY y FORMAT, etiquetas de idioma.'],
  ['ResourceBundle','Convenio de nombres, orden de búsqueda, respaldo al bundle base.'],
  ['Property vs List ResourceBundle','Precedencia de .class sobre .properties.'],
  ['Formato de números y moneda','NumberFormat, getCurrencyInstance, getCompactNumberInstance.'],
  ['Formato de fechas','DateTimeFormatter.ofLocalizedDate, FormatStyle, withLocale.'],
  ['Mensajes parametrizados','MessageFormat y marcadores {0}, {1}.']
 ]
};

/* ---------------- plan de estudio ---------------- */
const PLAN = [
 ['Primitivos, wrappers y operadores',['tipos']],
 ['String, bloques de texto y StringBuilder',['tipos']],
 ['Fechas y horas: java.time al completo',['tipos']],
 ['Control de flujo y switch con patrones',['flujo']],
 ['Clases, herencia y polimorfismo',['poo']],
 ['Interfaces, clases abstractas y anidadas',['poo']],
 ['Records, sealed, enums y pattern matching',['poo']],
 ['Excepciones y try-with-resources',['exc']],
 ['Arrays, colecciones y SequencedCollection',['col']],
 ['Genéricos, Comparator y contrato equals/hashCode',['col']],
 ['Lambdas, interfaces funcionales y Optional',['str']],
 ['Streams: intermedias, terminales y Collectors',['str']],
 ['Concurrencia clásica: hilos, executors, locks',['conc']],
 ['Hilos virtuales y CompletableFuture',['conc']],
 ['I/O, NIO.2 y serialización',['io']],
 ['Módulos (JPMS) y localización',['mod','l10n']],
 ['Repaso general y simulacros cronometrados',['tipos','flujo','poo','exc','col','str','mod','conc','io','l10n']]
];
