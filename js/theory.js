/* ============================================================
   Teoría del temario.

   Cada clave corresponde a un punto de SYL en data.js con el
   formato 'area:índice'. Cada entrada es una lista de bloques:

     ['p', texto]   párrafo
     ['c', código]  fragmento de código
     ['x', texto]   trampa típica del examen

   Para añadir teoría a un punto que aún no la tiene, basta con
   crear aquí su clave. La interfaz la recoge sola.
   ============================================================ */
const TEORIA = {

/* ══════════════ TIPOS ══════════════ */

'tipos:0':[
['p','Java tiene ocho tipos primitivos que no son objetos: byte, short, int, long, float, double, char y boolean. No tienen métodos, no pueden valer null y se guardan por valor. Cada uno tiene su clase envoltorio correspondiente (Byte, Short, Integer, Long, Float, Double, Character, Boolean) que sí es un objeto y sí admite null.'],
['p','Los rangos que conviene tener grabados: byte va de -128 a 127, short de -32768 a 32767, int hasta unos 2100 millones y long muchísimo más. char es especial porque no tiene signo: va de 0 a 65535 y representa una unidad de código UTF-16.'],
['c','// Literales y sus sufijos\nlong grande = 10_000_000_000L;   // sin la L no compila: no cabe en int\nfloat f = 3.14f;                 // sin la f es double y no compila\ndouble d = 1e-3;                 // notación científica\nint hex = 0xFF;                  // 255\nint bin = 0b1010;                // 10\nint oct = 017;                   // 15, ojo con el cero inicial'],
['p','La promoción numérica es la regla que decide el tipo de una operación. Si hay un double, todo se promociona a double. Si no, si hay un float, a float. Si no, si hay un long, a long. Y en cualquier otro caso, todos los operandos menores que int (byte, short, char) se promocionan a int.'],
['c','byte a = 1, b = 2;\n// byte c = a + b;   // NO compila: a + b es int\nbyte c = (byte)(a + b);  // sí\n\nchar x = \'A\';\nint y = x + 1;       // 66\n// char z = x + 1;   // NO compila por el mismo motivo\nchar z = (char)(x + 1);  // \'B\''],
['p','El autoboxing convierte automáticamente un primitivo en su envoltorio, y el unboxing hace lo contrario. Es cómodo pero esconde dos peligros: el coste de crear objetos, y sobre todo la posibilidad de un NullPointerException al desenvolver un null.'],
['c','Integer n = null;\nint m = n;   // compila, pero lanza NullPointerException al ejecutar\n\nMap<String,Integer> m2 = new HashMap<>();\nint v = m2.get("noExiste");  // NullPointerException: get devuelve null'],
['x','La caché de enteros. Integer.valueOf reutiliza instancias para valores entre -128 y 127, así que dos Integer con valor 100 son el mismo objeto y == da true, mientras que con valor 200 son objetos distintos y == da false. El examen usa esto constantemente. Con envoltorios, compara siempre con equals.'],
['x','Con double, 0.1 + 0.2 no es exactamente 0.3, y Double.NaN != Double.NaN devuelve true porque NaN no es igual ni a sí mismo. Para comparar usa Double.isNaN. La división entera 5 / 2 da 2, mientras que 5 % 2 da 1; con negativos, -5 % 2 da -1, porque el resto conserva el signo del dividendo.']
],

'tipos:1':[
['p','La precedencia que más cae: los operadores unarios (++, --, !, ~, cast) van primero; luego multiplicación, división y módulo; después suma y resta; luego los desplazamientos; después las comparaciones; luego == y !=; después los operadores lógicos bit a bit; luego && y ||; y al final el ternario y la asignación. La asignación es asociativa por la derecha.'],
['p','La diferencia entre incremento previo y posterior es una de las preguntas más repetidas. i++ devuelve el valor de antes y luego incrementa; ++i incrementa primero y devuelve el valor nuevo. Java evalúa los operandos de izquierda a derecha, y ese orden es lo que resuelve las expresiones enrevesadas.'],
['c','int i = 10;\nint r = i++ + ++i;\n// paso 1: i++ vale 10, i pasa a 11\n// paso 2: ++i pone i a 12 y vale 12\n// r = 10 + 12 = 22, e i vale 12'],
['p','Los operadores de asignación compuesta (+=, -=, *=, /=, %=) llevan un cast implícito al tipo de la izquierda. Por eso compilan cosas que su versión larga rechazaría, y por eso pueden perder información en silencio.'],
['c','byte b = 10;\nb += 300;        // compila: equivale a b = (byte)(b + 300)\nSystem.out.println(b);   // 54, se truncó\n\n// b = b + 300;  // NO compila: int no cabe en byte'],
['p','&& y || son de cortocircuito: si el resultado ya está decidido por el operando izquierdo, el derecho no se evalúa. Sus primos & y | sí evalúan siempre los dos lados. Esto importa cuando el lado derecho tiene efectos secundarios o podría lanzar excepción.'],
['c','int[] a = null;\nif (a != null && a.length > 0) { }   // seguro\nif (a != null & a.length > 0) { }    // NullPointerException'],
['x','El ternario tiene reglas de tipo propias que sorprenden. En una expresión como condición ? 1 : 2.0, ambas ramas se promocionan a double y el resultado es 1.0, no 1. Y si mezclas un primitivo con un envoltorio que pueda ser null, hay unboxing y por tanto riesgo de NullPointerException.']
],

'tipos:2':[
['p','String es inmutable. Ningún método suyo modifica la cadena: todos devuelven una nueva. Si no asignas el resultado, el trabajo se pierde. Esta es probablemente la trampa más repetida de todo el examen.'],
['c','String s = "Java";\ns.concat(" 21");\ns.toUpperCase();\ns.replace(\'J\', \'X\');\nSystem.out.println(s);   // "Java": nada cambió\n\ns = s.concat(" 21");     // ahora sí\nSystem.out.println(s);   // "Java 21"'],
['p','Los literales de cadena viven en un almacén común dentro del montón, el llamado pool. Dos literales iguales son el mismo objeto, así que == da true. Pero una cadena creada con new, o construida en tiempo de ejecución, es un objeto distinto aunque el contenido coincida. Para comparar contenido se usa equals, siempre.'],
['c','String a = "hola";\nString b = "hola";\nString c = new String("hola");\nString d = "ho" + "la";           // constante: se resuelve al compilar\nString e = "ho" + variableLa;     // se construye al ejecutar\n\na == b   // true  (mismo literal del pool)\na == c   // false (new fuerza objeto nuevo)\na == d   // true  (concatenación de constantes)\na == e   // false\na.equals(c)   // true, que es lo que importa'],
['p','Métodos que hay que conocer al dedillo: length(), charAt(), indexOf(), substring(), toUpperCase(), toLowerCase(), trim(), strip(), isEmpty(), isBlank(), replace(), contains(), startsWith(), endsWith(), equalsIgnoreCase(), repeat(), lines(), formatted(), chars(), split() y join().'],
['p','Cuidado con substring: el primer índice es inclusivo y el segundo exclusivo. substring(2) va del índice 2 al final. Si los índices están fuera de rango o el inicio es mayor que el fin, lanza StringIndexOutOfBoundsException. Un caso curioso que sí es legal es substring(len, len), que devuelve cadena vacía.'],
['p','StringBuilder sí es mutable, y sus métodos modifican el objeto y devuelven la propia referencia para poder encadenar. Es lo que hay que usar cuando concatenas dentro de un bucle.'],
['c','StringBuilder sb = new StringBuilder("Java");\nsb.append(" 21").insert(0, ">> ").reverse();\nSystem.out.println(sb);   // "12 avaJ >>"\n\n// no tiene equals propio: compara referencias\nnew StringBuilder("a").equals(new StringBuilder("a"));   // false'],
['x','Diferencia entre trim() y strip(): trim() elimina solo caracteres cuyo código sea menor o igual al del espacio, mientras que strip() entiende los espacios Unicode. Y ojo con isEmpty(), que solo es cierto con longitud cero, frente a isBlank(), que también lo es si la cadena solo tiene espacios.'],
['x','StringBuilder tiene tanto length() como capacity(), y no son lo mismo. Además su método delete(inicio, fin) usa fin exclusivo, pero deleteCharAt recibe un único índice. Y setLength puede tanto truncar como rellenar con caracteres nulos.']
],

'tipos:3':[
['p','Un bloque de texto es una cadena literal que abarca varias líneas. Empieza con tres comillas dobles seguidas obligatoriamente de un salto de línea, y termina con otras tres. Es un String normal y corriente: no hay ningún tipo nuevo.'],
['c','String json = """\n    {\n      "nombre": "Alejandro",\n      "certificacion": "1Z0-830"\n    }\n    """;'],
['p','La sangría incidental es el concepto clave. El compilador busca la línea con menos espacios a la izquierda, contando también la línea del delimitador de cierre, y elimina esa cantidad de todas. Por eso mover las comillas de cierre cambia el resultado: si las pones pegadas al margen izquierdo, se conserva toda la sangría del contenido.'],
['p','Si el delimitador de cierre está en su propia línea, la cadena termina con un salto de línea. Si lo pones al final de la última línea de contenido, no lo hay.'],
['c','// termina en salto de línea\nString a = """\n    hola\n    """;          // "hola\\n"\n\n// no termina en salto de línea\nString b = """\n    hola""";       // "hola"'],
['p','Hay dos secuencias de escape exclusivas de los bloques de texto. Una barra invertida al final de una línea une esa línea con la siguiente sin insertar salto. Y \\s representa un espacio que además impide que se recorten los espacios finales de esa línea.'],
['c','String largo = """\n    Esta frase continúa \\\n    en la misma línea.""";\n// "Esta frase continúa en la misma línea."'],
['x','Los errores de compilación clásicos: poner contenido en la misma línea que las comillas de apertura, y usar comillas simples o un número de comillas distinto de tres. Recuerda también que los espacios al final de cada línea se eliminan siempre, salvo que los protejas con \\s.']
],

'tipos:4':[
['p','var no es un tipo, es inferencia de tipo local. El compilador deduce el tipo a partir del inicializador y a partir de ahí la variable es de ese tipo para siempre. Java sigue siendo de tipado estático: no hay nada dinámico aquí.'],
['c','var lista = new ArrayList<String>();   // ArrayList<String>\nvar n = 10;                            // int\nvar d = 10.0;                          // double\nvar s = "texto";                       // String\n\nvar x = 5;\n// x = "hola";   // NO compila: x es int y lo seguirá siendo'],
['p','Solo se puede usar en variables locales, en el índice de un for mejorado, en el inicializador de un for clásico y en los parámetros de una lambda. No vale para campos de clase, ni parámetros de método, ni tipos de retorno, ni en constructores.'],
['c','// legales\nfor (var i = 0; i < 10; i++) { }\nfor (var s : lista) { }\ntry (var br = new BufferedReader(r)) { }\n\n// ilegales\n// var campo = 1;              como atributo de clase\n// void m(var p) { }           como parámetro\n// var m() { return 1; }       como retorno'],
['x','Casos que no compilan y salen en el examen: var sin inicializar, var inicializado a null, dos variables var en la misma declaración, var como tipo de un array sin inicializador de llaves, y var en una lambda mezclado con parámetros sin var. Detalle final: var no es palabra reservada, así que sigue siendo válido llamar var a una variable o a un método, por raro que quede.']
],

'tipos:5':[
['p','El paquete java.time sustituyó a Date y Calendar. Sus clases son inmutables y seguras entre hilos, y no tienen constructores públicos: se crean con métodos de fábrica como of, now o parse. Los meses van del 1 al 12, sin el desfase de la antigua Calendar.'],
['p','Las cinco clases principales: LocalDate es fecha sin hora ni zona; LocalTime es hora sin fecha; LocalDateTime junta las dos pero sigue sin zona; ZonedDateTime añade la zona horaria y por tanto el horario de verano; e Instant representa un punto en la línea temporal en UTC, pensado para marcas de tiempo de máquina.'],
['c','LocalDate f = LocalDate.of(2026, 11, 4);\nLocalDate f2 = LocalDate.of(2026, Month.NOVEMBER, 4);\nLocalTime h = LocalTime.of(21, 0);\nLocalDateTime fh = LocalDateTime.of(f, h);\nZonedDateTime z = fh.atZone(ZoneId.of("Europe/Madrid"));\nInstant i = z.toInstant();\n\nLocalDate p = LocalDate.parse("2026-11-04");   // formato ISO'],
['p','Todos los métodos que parecen modificar en realidad devuelven un objeto nuevo: plusDays, minusMonths, withYear, withDayOfMonth. Si no asignas el resultado, no pasa nada. Es la misma trampa que con String, y aquí también es de las más frecuentes.'],
['c','LocalDate d = LocalDate.of(2026, 1, 31);\nd.plusMonths(1);              // se pierde\nSystem.out.println(d);        // 2026-01-31\n\nd = d.plusMonths(1);\nSystem.out.println(d);        // 2026-02-28: se ajusta al último día válido'],
['x','El ajuste de fin de mes es una respuesta favorita: sumar un mes al 31 de enero da el 28 o el 29 de febrero, no el 3 de marzo. Y sumar un mes a esa fecha ajustada da el 28 o 29 de marzo, no el 31: la operación no es reversible.'],
['x','Los métodos que mezclan tipos incompatibles lanzan excepción o ni compilan. Sumar horas a un LocalDate no tiene sentido y falla. Comparar un LocalDate con un LocalDateTime tampoco vale. Y los formatos de parse mal escritos lanzan DateTimeParseException en tiempo de ejecución, no error de compilación.']
],

'tipos:6':[
['p','Period mide cantidades basadas en la fecha: años, meses y días. Duration mide cantidades basadas en el tiempo: horas, minutos, segundos y nanosegundos. No son intercambiables, y usar el equivocado es el error que persigue el examen.'],
['c','Period p = Period.of(1, 2, 3);        // 1 año, 2 meses, 3 días\nPeriod p2 = Period.ofMonths(18);       // P18M, no se normaliza a 1 año y medio\nDuration d = Duration.ofHours(2);\nDuration d2 = Duration.ofMinutes(90);  // PT1H30M, esta sí se normaliza'],
['p','El toString sigue el formato ISO 8601. Period empieza por P y omite los componentes que valen cero: P2M14D son dos meses y catorce días. Duration empieza por PT: PT1H30M es una hora y media.'],
['c','var d1 = LocalDate.of(2026, 1, 1);\nvar d2 = LocalDate.of(2026, 3, 15);\nSystem.out.println(Period.between(d1, d2));   // P2M14D\n\n// para contar días sueltos, mejor ChronoUnit\nSystem.out.println(ChronoUnit.DAYS.between(d1, d2));   // 73'],
['x','Period no se puede aplicar a un LocalTime, y Duration no se puede aplicar a un LocalDate: ambos casos lanzan UnsupportedTemporalTypeException. Sobre un LocalDateTime funcionan los dos.'],
['x','Con ZonedDateTime y cambio de horario de verano aparece la sutileza: sumar un Period de un día respeta el día natural aunque tenga 23 o 25 horas, mientras que sumar una Duration de 24 horas suma exactamente ese tiempo. En un día de cambio de hora los dos dan resultados distintos.']
],

/* ══════════════ FLUJO ══════════════ */

'flujo:0':[
['p','La condición de un if debe ser un boolean o un Boolean. A diferencia de C, un entero no vale como condición. Este detalle convierte en error de compilación cosas que en otros lenguajes funcionarían.'],
['c','int x = 5;\n// if (x) { }        NO compila: int no es boolean\nif (x == 5) { }      // sí\n\n// la trampa clásica del examen:\nif (x = 5) { }       // NO compila con int\n\nboolean b = false;\nif (b = true) { }    // SÍ compila: asigna true y evalúa true'],
['p','Sin llaves, un if controla solo la sentencia siguiente. El examen aprovecha la sangría engañosa para que parezca que controla más de una línea. Fíate del punto y coma, no de los espacios.'],
['c','if (x > 3)\n    System.out.println("a");\n    System.out.println("b");   // se imprime SIEMPRE\n\nif (x > 3);                    // punto y coma vacío: el if no hace nada\n    System.out.println("c");   // también se imprime siempre'],
['p','El ternario condición ? a : b es una expresión, así que produce un valor y tiene un tipo. Ese tipo sale de combinar las dos ramas, con promoción numérica si hace falta.'],
['c','int n = 5;\nSystem.out.println(n > 3 ? 1 : 2.0);   // 1.0, no 1\n\nObject o = n > 3 ? "texto" : 42;        // Object: no comparten tipo\n\nInteger nulo = null;\n// int r = true ? 1 : nulo;   compila, pero si la rama fuese la otra: NPE'],
['x','Un ternario cuyas dos ramas se limitan a llamar a métodos void no compila, porque una expresión tiene que producir un valor. Y anidar ternarios es legal pero se asocia por la derecha, cosa que el examen usa para confundir.']
],

'flujo:1':[
['p','Hay dos sintaxis de switch. La clásica con dos puntos, que cae de un caso al siguiente hasta encontrar un break. Y la de flecha, introducida en Java 14, que ejecuta solo la rama que coincide y nunca cae.'],
['c','// clásico: cuidado con la caída\nint x = 2;\nswitch (x) {\n    case 1: System.out.print("uno");\n    case 2: System.out.print("dos");     // entra aquí\n    case 3: System.out.print("tres");    // y cae aquí\n        break;\n    default: System.out.print("otro");\n}\n// imprime "dostres"'],
['c','// flecha: sin caída, y admite varias etiquetas por rama\nswitch (x) {\n    case 1, 2 -> System.out.print("uno o dos");\n    case 3    -> System.out.print("tres");\n    default   -> System.out.print("otro");\n}\n// imprime "uno o dos"'],
['p','El switch también puede ser una expresión que produce un valor. Con flecha, si el cuerpo es una sola expresión, esa es el valor; si es un bloque, se devuelve con yield. En la forma clásica dentro de una expresión, yield es obligatorio.'],
['c','String s = switch (x) {\n    case 1, 2 -> "bajo";\n    case 3 -> {\n        String tmp = "medio";\n        yield tmp;              // obligatorio en bloques\n    }\n    default -> "alto";\n};'],
['p','Los tipos válidos como selector: los enteros menores o iguales que int y sus envoltorios, char, String, enum y, desde Java 21, cualquier referencia si usas patrones. No valen long, float, double ni boolean.'],
['x','Cuando el switch es una expresión, tiene que ser exhaustivo: o cubres todos los casos posibles, o pones default. Con un enum al que cubres todas las constantes, o con un tipo sellado, el compilador ya lo considera exhaustivo sin default.'],
['x','Las etiquetas de case deben ser constantes de tiempo de compilación: un literal, una constante final inicializada, o una constante de enum. Una variable normal no vale. Y con enum se escribe solo el nombre de la constante, sin cualificar con el nombre del tipo.']
],

'flujo:2':[
['p','Desde Java 21, las etiquetas de case pueden ser patrones de tipo en lugar de constantes. La variable del patrón queda disponible dentro de esa rama, ya con el tipo correcto y sin necesidad de cast. Esto sustituye a las cadenas de if-else con instanceof.'],
['c','static String describir(Object o) {\n    return switch (o) {\n        case Integer i  -> "entero " + i;\n        case String s   -> "cadena de " + s.length();\n        case int[] a    -> "array de " + a.length;\n        case null       -> "nulo";\n        default         -> "otra cosa";\n    };\n}'],
['p','Una guarda añade una condición al patrón con la palabra when. Si el patrón encaja pero la guarda es falsa, se sigue probando con los casos siguientes.'],
['c','String t = switch (o) {\n    case Integer i when i < 0   -> "negativo";\n    case Integer i when i == 0  -> "cero";\n    case Integer i              -> "positivo";\n    default                     -> "no es entero";\n};'],
['p','El orden importa mucho. Los casos se prueban de arriba abajo, así que un patrón más general antes de otro más específico hace que el segundo sea inalcanzable, y eso es error de compilación, no un aviso.'],
['c','switch (o) {\n    case Object x -> "todo";\n    // case String s -> "cadena";   NO compila: inalcanzable\n}'],
['x','El tratamiento de null cambió. Un switch sin case null lanza NullPointerException si el selector es null, igual que siempre. Pero ahora puedes escribir case null explícitamente, o incluso combinarlo como case null, default. Un patrón de tipo por sí solo nunca captura null.'],
['x','Un switch con patrones sobre un tipo no sellado necesita default o un patrón total que cubra todo. Sobre un tipo sellado, cubrir todos los subtipos permitidos basta y el compilador lo verifica.']
],

'flujo:3':[
['p','Un patrón de registro descompone un record en sus componentes directamente en la etiqueta del case o en un instanceof. Evita tener que llamar a los accesores uno por uno.'],
['c','record Punto(int x, int y) {}\nrecord Linea(Punto ini, Punto fin) {}\n\nObject o = new Punto(3, 4);\n\nif (o instanceof Punto(int x, int y)) {\n    System.out.println(x + "," + y);   // x e y ya extraídos\n}'],
['p','Los patrones se anidan, y ahí está su gracia: puedes descomponer estructuras completas en una sola línea. También puedes usar var en los componentes para que el compilador infiera el tipo.'],
['c','switch (figura) {\n    case Linea(Punto(var x1, var y1), Punto(var x2, var y2))\n        -> Math.hypot(x2 - x1, y2 - y1);\n    case Punto(int x, int y) when x == y -> 0.0;\n    case Punto p -> 0.0;\n    default -> -1.0;\n}'],
['x','El patrón de registro tiene que declarar exactamente tantos componentes como tenga el record, y en el mismo orden. No puedes omitir ninguno ni reordenarlos.'],
['x','Con componentes de tipo genérico, el patrón debe ser compatible en tiempo de compilación. Un patrón de tipo dentro de un componente solo encaja si el valor no es null, así que un componente nulo hace que la rama no coincida y se pase a la siguiente.']
],

'flujo:4':[
['p','El for clásico tiene tres partes separadas por punto y coma, y las tres son opcionales. Las variables declaradas en el inicializador solo existen dentro del bucle. Puedes declarar varias, pero todas del mismo tipo, y separar por comas tanto en el inicializador como en la actualización.'],
['c','for (int i = 0, j = 10; i < j; i++, j--) { }\n\nfor (;;) { }        // bucle infinito perfectamente legal\n\nint k = 0;\nfor (; k < 5; ) { k++; }   // partes vacías, también legal'],
['p','El for mejorado recorre arrays y cualquier cosa que implemente Iterable. La variable del bucle es una copia: modificarla no altera la colección. Y no tienes acceso al índice.'],
['c','int[] nums = {1, 2, 3};\nfor (int n : nums) {\n    n = n * 2;      // no cambia nada del array\n}\n// nums sigue siendo {1, 2, 3}\n\n// no compila sobre algo que no sea array ni Iterable:\n// for (var e : new HashMap<String,String>()) { }   Map no es Iterable'],
['p','while comprueba la condición antes de entrar, así que puede no ejecutarse ni una vez. do-while la comprueba al final, así que ejecuta el cuerpo al menos una vez. Ese es todo el matiz, y el examen lo pregunta con condiciones que son falsas desde el principio.'],
['c','int i = 0;\nwhile (i < 0) { i++; }      // el cuerpo no se ejecuta nunca, i queda en 0\n\nint j = 0;\ndo { j++; } while (j < 0);  // se ejecuta una vez, j queda en 1'],
['x','Modificar una colección mientras la recorres con un for mejorado lanza ConcurrentModificationException al llegar a la siguiente iteración. Para borrar durante el recorrido hay que usar un Iterator y su método remove, o bien removeIf.'],
['x','Un while cuya condición es una constante false no compila, porque el cuerpo sería código inalcanzable. Curiosamente, if (false) { } sí compila: es la excepción que el lenguaje deja para poder desactivar código con constantes.']
],

'flujo:5':[
['p','break sale del bucle o del switch que lo contiene. continue salta a la siguiente iteración del bucle que lo contiene. Sin etiqueta, ambos afectan solo a la estructura más interna.'],
['p','Una etiqueta es un identificador seguido de dos puntos, colocado justo antes de un bucle. Con ella, break y continue pueden actuar sobre un bucle exterior, que es la forma limpia de salir de bucles anidados sin banderas.'],
['c','buscar:\nfor (int i = 0; i < filas; i++) {\n    for (int j = 0; j < columnas; j++) {\n        if (m[i][j] == objetivo) {\n            System.out.println("encontrado en " + i + "," + j);\n            break buscar;      // sale de los dos bucles\n        }\n    }\n}'],
['c','outer:\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        if (j == 1) continue outer;   // pasa a la siguiente i\n        System.out.print(i + "" + j + " ");\n    }\n}\n// imprime: 00 10 20'],
['x','La etiqueta tiene que estar delante de la sentencia a la que se refiere, y break con etiqueta solo puede salir de una estructura que lo contenga. Poner una etiqueta que no envuelve al break es error de compilación. Además, continue con etiqueta exige que la etiqueta marque un bucle, no un bloque cualquiera, mientras que break sí puede etiquetar un bloque normal.']
],

/* ══════════════ POO ══════════════ */

'poo:0':[
['p','Si no escribes ningún constructor, Java añade uno sin argumentos que llama a super(). En cuanto escribes uno cualquiera, ese constructor por defecto desaparece, y ahí empiezan los errores de compilación cuando una subclase intenta llamar implícitamente a un super() que ya no existe.'],
['c','class A {\n    A(int n) { }        // al declararlo, A ya no tiene constructor vacío\n}\nclass B extends A {\n    // B() { }          NO compila: super() implícito no encuentra A()\n    B() { super(5); }   // hay que llamar explícitamente\n}'],
['p','this(...) llama a otro constructor de la misma clase y super(...) al de la superclase. Cualquiera de los dos, si aparece, tiene que ser la primera sentencia del constructor, y no pueden aparecer los dos. Si no pones ninguno, el compilador inserta super() sin argumentos.'],
['p','El orden de inicialización es una pregunta casi segura. Primero, la primera vez que se carga la clase, los campos estáticos y los bloques estáticos, en el orden en que aparecen en el código y de la superclase hacia la subclase. Después, en cada creación de objeto: se ejecuta el constructor de la superclase completo, luego los campos de instancia y bloques de instancia de la clase en orden de aparición, y por último el cuerpo del constructor.'],
['c','class A {\n    static { System.out.print("SA "); }\n    { System.out.print("IA "); }\n    A() { System.out.print("CA "); }\n}\nclass B extends A {\n    static { System.out.print("SB "); }\n    { System.out.print("IB "); }\n    B() { System.out.print("CB "); }\n}\n\nnew B();   // SA SB IA CA IB CB\nnew B();   // IA CA IB CB   (los estáticos ya no se repiten)'],
['x','Los bloques estáticos se ejecutan una sola vez por clase, cuando se carga. Los de instancia, en cada objeto y antes del cuerpo del constructor, no después. Y un campo de instancia que se inicialice usando un método sobrescribible puede leer valores a medio construir: es un error de diseño clásico que el examen presenta como código sorprendente.']
],

'poo:1':[
['p','Sobrescribir es redefinir en la subclase un método de instancia con la misma firma. Las reglas: mismo nombre y mismos parámetros; tipo de retorno igual o covariante, es decir un subtipo; acceso igual o más permisivo, nunca más restrictivo; y no puede declarar excepciones comprobadas nuevas ni más amplias.'],
['c','class Animal {\n    protected Animal crear() throws IOException { return this; }\n}\nclass Perro extends Animal {\n    @Override\n    public Perro crear() throws FileNotFoundException { return this; }\n    // public:  más permisivo que protected, correcto\n    // Perro:   subtipo de Animal, retorno covariante, correcto\n    // FNFE:    subtipo de IOException, correcto\n}'],
['p','Sobrecargar es otra cosa: mismo nombre y distintos parámetros, dentro de la misma clase o heredado. La sobrecarga se resuelve en tiempo de compilación mirando el tipo declarado; la sobrescritura se resuelve en tiempo de ejecución mirando el objeto real. Esa diferencia es el corazón del polimorfismo.'],
['c','class Base {\n    void m(Object o) { System.out.print("Object"); }\n}\nclass Hija extends Base {\n    void m(String s) { System.out.print("String"); }   // sobrecarga, no sobrescritura\n}\n\nBase b = new Hija();\nb.m("hola");   // "Object": el tipo declarado es Base, que solo conoce m(Object)'],
['p','Los métodos estáticos no se sobrescriben, se ocultan. Y los campos tampoco se sobrescriben nunca: se ocultan siempre. En ambos casos la resolución depende del tipo declarado de la referencia, no del objeto.'],
['c','class P {\n    static String s() { return "P"; }\n    String campo = "campoP";\n}\nclass H extends P {\n    static String s() { return "H"; }\n    String campo = "campoH";\n}\n\nP p = new H();\np.s();       // "P"       estático: tipo declarado\np.campo;     // "campoP"  campo: tipo declarado\n// solo los métodos de instancia son polimórficos'],
['x','super.metodo() invoca la versión de la superclase saltándose la de la subclase. Es la única forma de llegar a ella desde dentro. Desde fuera del objeto no hay manera de acceder a la implementación oculta.'],
['x','No se puede sobrescribir un método final, ni uno privado (los privados no se heredan, así que redefinirlos crea un método nuevo sin relación). Un método estático no puede ocultar a uno de instancia ni al revés: eso es error de compilación.']
],

'poo:2':[
['p','Cuatro niveles de acceso, de más a menos abierto: public en todas partes; protected en el mismo paquete y en las subclases aunque estén en otro paquete; sin modificador, el llamado acceso de paquete, solo en el mismo paquete; y private solo dentro de la propia clase, incluidas sus clases anidadas.'],
['p','El matiz de protected que pregunta el examen: desde otro paquete, una subclase puede acceder al miembro protegido a través de una referencia de su propio tipo o de un subtipo suyo, pero no a través de una referencia del tipo de la superclase.'],
['c','// paquete b, distinto del de Padre\nclass Hijo extends Padre {\n    void m(Padre p, Hijo h) {\n        // p.campoProtegido;   NO compila\n        h.campoProtegido;      // sí\n        this.campoProtegido;   // sí\n    }\n}'],
['p','final tiene tres significados según dónde se ponga. En una clase, impide heredar de ella. En un método, impide sobrescribirlo. En una variable, impide reasignarla después de darle valor.'],
['p','final sobre una referencia congela la referencia, no el objeto. Puedes seguir modificando el contenido de la lista, solo no puedes apuntar la variable a otra lista.'],
['c','final List<String> l = new ArrayList<>();\nl.add("vale");        // permitido: se modifica el objeto\n// l = new ArrayList<>();   NO compila: se reasigna la referencia'],
['x','Efectivamente final es una variable que no se declara final pero a la que nunca se reasigna. El compilador lo detecta solo, y es requisito para capturarla en una lambda o en una clase anónima o local. Si le asignas un valor dos veces, deja de serlo y el código que la capturaba deja de compilar.'],
['x','Una variable final de instancia puede quedar sin valor en la declaración, pero entonces todos los constructores tienen que asignarla. Si algún camino no lo hace, error de compilación.']
],

'poo:3':[
['p','Una interfaz declara un contrato. Sus métodos son implícitamente public abstract salvo que lleven cuerpo, y sus campos son implícitamente public static final. Escribir esos modificadores es redundante pero legal, y el examen a veces los omite para ver si te das cuenta de que siguen ahí.'],
['c','interface Vehiculo {\n    int RUEDAS = 4;              // public static final\n    void arrancar();             // public abstract\n\n    default String tipo() { return "vehículo"; }\n    static Vehiculo crear() { return null; }\n    private void aux() { }       // desde Java 9\n    private static void aux2() { }\n}'],
['p','Los métodos default llevan cuerpo y se heredan por las clases que implementan la interfaz, que pueden sobrescribirlos. Su razón de ser fue poder añadir métodos a interfaces existentes sin romper el código que ya las implementaba.'],
['p','Los métodos static de una interfaz no se heredan: hay que llamarlos cualificando con el nombre de la interfaz. Los private sirven para compartir código entre los default de la propia interfaz.'],
['p','Cuando hay conflicto entre lo que aporta una clase y lo que aporta una interfaz, gana siempre la clase. Cuando el conflicto es entre dos interfaces con el mismo método default, no gana ninguna y la clase está obligada a sobrescribirlo.'],
['c','interface A { default String s() { return "A"; } }\ninterface B { default String s() { return "B"; } }\n\nclass C implements A, B {\n    @Override\n    public String s() {\n        return A.super.s();   // así se elige explícitamente\n    }\n}'],
['x','Una clase que implementa una interfaz debe declarar public los métodos que sobrescribe: como en la interfaz son public, bajarlos a acceso de paquete sería restringir y no compila. Es uno de los errores más habituales.'],
['x','Una interfaz no puede tener constructores, ni bloques de inicialización, ni campos de instancia. Puede extender varias interfaces a la vez, pero nunca una clase.']
],

'poo:4':[
['p','Una clase abstracta no se puede instanciar y puede mezclar métodos abstractos con métodos completos, campos de instancia, constructores y cualquier nivel de acceso. Una interfaz no tiene estado de instancia ni constructores. La regla práctica: clase abstracta cuando compartes implementación y estado, interfaz cuando defines capacidades.'],
['c','abstract class Figura {\n    protected String nombre;                 // estado: solo en clase abstracta\n    protected Figura(String n) { nombre = n; }   // constructor: se llama desde la subclase\n    abstract double area();                  // sin cuerpo ni llaves, con punto y coma\n    double perimetro() { return 0; }         // método concreto\n}'],
['p','Un método abstracto no puede ser al mismo tiempo private, final ni static, porque los tres impedirían sobrescribirlo, que es justo su propósito. Y una clase abstracta sí puede no tener ningún método abstracto.'],
['p','La primera subclase concreta está obligada a implementar todos los métodos abstractos pendientes. Si no quiere, tiene que declararse abstracta ella también y pasar la deuda a la siguiente.'],
['x','Una clase abstracta sí tiene constructor, y se ejecuta cuando se crea la subclase. Lo que no puedes es hacer new sobre ella directamente. La excepción aparente es new ClaseAbstracta() { ... }, que en realidad crea una clase anónima que la extiende.'],
['x','Desde Java 8 una interfaz con métodos default se acerca mucho a una clase abstracta, pero sigue sin poder guardar estado de instancia. Y una clase solo extiende una clase, mientras que implementa tantas interfaces como quiera.']
],

'poo:5':[
['p','Un record es una clase inmutable pensada para transportar datos. A partir de la lista de componentes, el compilador genera los campos private final, los accesores con el nombre del componente sin get, un constructor canónico, y equals, hashCode y toString basados en todos los componentes.'],
['c','record Punto(int x, int y) {}\n\nvar p = new Punto(3, 4);\np.x();                        // 3, el accesor se llama x() no getX()\np.equals(new Punto(3, 4));    // true\np.toString();                 // Punto[x=3, y=4]'],
['p','El constructor compacto se escribe sin paréntesis de parámetros y sirve para validar o normalizar. Los parámetros se pueden reasignar; la asignación a los campos la añade el compilador al final automáticamente.'],
['c','record Rango(int min, int max) {\n    Rango {\n        if (min > max) throw new IllegalArgumentException("rango inválido");\n        min = Math.max(min, 0);   // se puede normalizar\n        // no se escribe this.min = min: lo pone el compilador\n    }\n}'],
['p','Un record puede tener métodos de instancia, métodos estáticos, campos estáticos, constructores adicionales e implementar interfaces. Lo que no puede es tener campos de instancia propios aparte de los componentes, ni extender ninguna clase: ya extiende java.lang.Record implícitamente.'],
['x','Los records son implícitamente final, así que nadie puede heredar de ellos. Sus componentes son final, no hay setters, y aunque la referencia sea inmutable, un componente que apunte a una lista mutable sigue siendo mutable por dentro.'],
['x','Un constructor canónico escrito de forma completa, con sus paréntesis y parámetros, tiene que asignar explícitamente todos los campos. Si mezclas la forma compacta con la completa no compila: son alternativas, no complementos.']
],

'poo:6':[
['p','Una clase o interfaz sellada declara con permits exactamente qué tipos pueden extenderla. Sirve para modelar jerarquías cerradas donde el compilador conoce todas las opciones, y es lo que permite que un switch sea exhaustivo sin default.'],
['c','public sealed interface Figura permits Circulo, Cuadrado, Triangulo {}\n\npublic record Circulo(double r) implements Figura {}\npublic record Cuadrado(double l) implements Figura {}\npublic non-sealed class Triangulo implements Figura {}'],
['p','Todo subtipo directo tiene que elegir una de tres opciones: final para cerrar la rama, sealed para seguir restringiendo con su propio permits, o non-sealed para reabrirla y permitir que cualquiera herede de ahí en adelante. Un record cumple automáticamente porque ya es final.'],
['p','La cláusula permits se puede omitir si todos los subtipos están en el mismo archivo fuente que el tipo sellado. Si están en archivos distintos, tienen que estar al menos en el mismo paquete, o en el mismo módulo si el código está modularizado.'],
['x','Los tipos listados en permits tienen que existir y extender realmente el tipo sellado; si no, error de compilación. Y no puede haber subtipos fuera de esa lista, ni siquiera clases anónimas o locales, que están prohibidas sobre un tipo sellado.'],
['x','non-sealed es la única palabra clave de Java que lleva guion. Se escribe tal cual, y confundirla con nonsealed o non sealed es error de compilación.']
],

'poo:7':[
['p','Un enum es un conjunto fijo de instancias creadas por el propio compilador. Cada constante es un objeto único, así que compararlas con == es correcto y además seguro frente a null. Todo enum hereda de java.lang.Enum y por eso no puede extender ninguna otra clase.'],
['c','enum Palo { OROS, COPAS, ESPADAS, BASTOS }\n\nPalo p = Palo.COPAS;\np.name();          // "COPAS"\np.ordinal();       // 1, empezando en cero\nPalo.valueOf("OROS");   // la constante; si no existe, IllegalArgumentException\nPalo.values();     // array con todas, en orden de declaración'],
['p','Un enum puede tener constructor, campos y métodos. El constructor es implícitamente private y se ejecuta una vez por constante, la primera vez que se usa el enum. Los argumentos van entre paréntesis junto a cada constante, y esa lista debe terminar en punto y coma si hay más código detrás.'],
['c','enum Planeta {\n    TIERRA(5.97e24), MARTE(6.42e23);   // punto y coma obligatorio aquí\n\n    private final double masa;\n    Planeta(double m) { this.masa = m; }   // implícitamente private\n    public double masa() { return masa; }\n}'],
['p','Cada constante puede tener su propio cuerpo y sobrescribir un método, lo que convierte al enum en una forma compacta de aplicar el patrón estrategia. Si el enum declara un método abstracto, todas las constantes están obligadas a implementarlo.'],
['c','enum Operacion {\n    SUMA { int aplicar(int a, int b) { return a + b; } },\n    RESTA { int aplicar(int a, int b) { return a - b; } };\n\n    abstract int aplicar(int a, int b);\n}'],
['x','Dentro de un switch sobre un enum se escribe solo el nombre de la constante, sin cualificar. Poner Palo.COPAS como etiqueta de case es error de compilación en el switch clásico.'],
['x','No confíes en ordinal() para lógica de negocio: cambia si alguien reordena las constantes. Y para colecciones de enums existen EnumSet y EnumMap, mucho más eficientes que HashSet y HashMap.']
],

'poo:8':[
['p','Hay cuatro tipos de clase anidada. La estática, declarada static dentro de otra clase, que se comporta como una clase normal salvo por el nombre cualificado. La interna, sin static, que va ligada a una instancia de la clase que la contiene. La local, declarada dentro de un método. Y la anónima, declarada e instanciada de una vez.'],
['c','class Externa {\n    private int campo = 10;\n\n    static class Estatica { }               // no necesita instancia externa\n    class Interna { int leer() { return campo; } }   // sí la necesita\n}\n\nvar e = new Externa.Estatica();\nvar ex = new Externa();\nvar in = ex.new Interna();    // sintaxis peculiar, sale en el examen'],
['p','Una clase interna no estática guarda una referencia implícita al objeto que la contiene, por eso puede leer incluso sus campos privados. Como consecuencia, no puede declarar miembros estáticos salvo constantes, y no se puede instanciar sin un objeto externo.'],
['p','Las clases locales y las anónimas capturan variables del método donde viven, pero solo si son final o efectivamente final. Es la misma regla que se aplica a las lambdas.'],
['c','void m() {\n    int contador = 0;\n    Runnable r = new Runnable() {          // clase anónima\n        public void run() {\n            System.out.println(contador);  // captura: contador debe ser efect. final\n        }\n    };\n    // contador++;   si descomentas esto, la línea de arriba deja de compilar\n}'],
['x','Una clase anónima no tiene nombre, así que no puede declarar constructores. Puede extender una clase o implementar una interfaz, pero solo una de las dos cosas y nunca varias a la vez.'],
['x','Desde Java 16 las clases internas sí pueden declarar miembros estáticos, cosa que antes era error. Es un cambio reciente que el examen de Java 21 puede aprovechar para descartar respuestas basadas en la regla antigua.']
],

'poo:9':[
['p','El operador instanceof con patrón combina la comprobación de tipo y el cast en un solo paso, y declara una variable ya tipada. Sustituye al viejo trío de comprobar, castear y asignar.'],
['c','// antes\nif (o instanceof String) {\n    String s = (String) o;\n    System.out.println(s.length());\n}\n\n// desde Java 16\nif (o instanceof String s) {\n    System.out.println(s.length());\n}'],
['p','El alcance de la variable de patrón lo determina el flujo: existe allí donde el compilador puede demostrar que la comprobación resultó cierta. Eso permite usarla en la parte derecha de un && y también después de un return anticipado.'],
['c','// dentro del && el compilador sabe que la comprobación pasó\nif (o instanceof String s && s.length() > 3) { }\n\n// con || no: puede llegarse ahí sin que el patrón encajase\n// if (o instanceof String s || s.isEmpty()) { }   NO compila\n\n// negado con salida temprana: s vive en el resto del método\nif (!(o instanceof String s)) return;\nSystem.out.println(s.toUpperCase());   // aquí s existe'],
['x','instanceof siempre da false con null, sin lanzar excepción. Por eso el patrón nunca deja la variable a null y no hace falta comprobarlo aparte.'],
['x','Comparar con instanceof tipos que no tienen relación de herencia posible es error de compilación, no simplemente false. Y no puedes usar como patrón un tipo genérico con parámetros que se borran en tiempo de ejecución, salvo que el compilador pueda demostrar la compatibilidad.']
],

/* ══════════════ EXCEPCIONES ══════════════ */

'exc:0':[
['p','En la cima de todo está Throwable. Solo lo que hereda de Throwable se puede lanzar con throw y capturar con catch. De él cuelgan dos ramas muy distintas: Error, que representa fallos graves de los que no se espera que te recuperes, y Exception, que representa problemas que el programa sí puede tratar.'],
['c','Object\n └── Throwable\n      ├── Error                     no comprobadas\n      │    ├── StackOverflowError\n      │    ├── OutOfMemoryError\n      │    ├── NoClassDefFoundError\n      │    └── AssertionError\n      └── Exception                 COMPROBADAS\n           ├── IOException\n           │    └── FileNotFoundException\n           ├── ClassNotFoundException\n           ├── InterruptedException\n           └── RuntimeException      no comprobadas\n                ├── NullPointerException\n                ├── ArithmeticException\n                ├── ClassCastException\n                ├── IllegalArgumentException\n                │    └── NumberFormatException\n                ├── IllegalStateException\n                ├── IndexOutOfBoundsException\n                ├── UnsupportedOperationException\n                └── ConcurrentModificationException'],
['p','La división que de verdad importa en el examen es entre comprobadas y no comprobadas. Comprobada es toda la rama Exception excepto RuntimeException y sus descendientes. El compilador te obliga a hacer algo con ellas: o las capturas, o las declaras con throws. Es la regla de manejar o declarar.'],
['p','No comprobadas son RuntimeException y sus hijas, más toda la rama Error. El compilador no exige nada: puedes lanzarlas y propagarlas sin declararlas. Representan errores de programación (un índice mal calculado, un null que no debería estar ahí) que se arreglan corrigiendo el código, no capturándolos.'],
['c','// comprobada: el compilador exige tratarla\nvoid leer() throws IOException {\n    Files.readString(Path.of("a.txt"));\n}\n\n// no comprobada: compila sin declarar nada\nvoid dividir(int a, int b) {\n    System.out.println(a / b);   // ArithmeticException si b es 0\n}'],
['p','Conviene saber de memoria qué lanza cada cosa. Dividir un entero por cero lanza ArithmeticException, pero dividir un double por cero no lanza nada: da Infinity o NaN. Convertir una cadena no numérica con Integer.parseInt lanza NumberFormatException. Acceder fuera de un array lanza ArrayIndexOutOfBoundsException, y fuera de una cadena StringIndexOutOfBoundsException; ambas heredan de IndexOutOfBoundsException.'],
['x','Capturar Exception NO captura los Error, porque son ramas hermanas. Solo capturando Throwable atrapas las dos cosas. El examen enseña un catch (Exception e) y pregunta si atrapa un StackOverflowError: no lo hace.'],
['x','No puedes capturar una excepción comprobada que el bloque try no pueda lanzar: es error de compilación, no un catch inútil. La excepción a esta regla son Exception y Throwable, que siempre se permiten porque cualquier código puede lanzar una RuntimeException.'],
['c','try {\n    System.out.println("hola");        // no lanza nada comprobado\n} catch (IOException e) { }            // NO COMPILA\n\ntry {\n    System.out.println("hola");\n} catch (Exception e) { }              // sí compila: caso permitido']
],

'exc:1':[
['p','Un try necesita ir acompañado obligatoriamente de al menos un catch o de un finally. Un try suelto no compila. El orden sintáctico es rígido: primero el try, después todos los catch y por último, si lo hay, un único finally.'],
['c','try {\n    // código vigilado\n} catch (NumberFormatException e) {\n    // el más específico primero\n} catch (RuntimeException e) {\n    // luego el más general\n} finally {\n    // siempre se ejecuta\n}'],
['p','Los catch se evalúan de arriba abajo y gana el primero que encaje. Por eso el orden debe ir de lo específico a lo general. Si pones una superclase antes que una subclase, el catch de abajo queda inalcanzable y es error de compilación, no un simple aviso.'],
['c','try {\n    Integer.parseInt("x");\n} catch (RuntimeException e) {\n} catch (NumberFormatException e) {   // NO COMPILA: inalcanzable\n}'],
['p','El bloque finally se ejecuta siempre: cuando el try termina bien, cuando lanza una excepción capturada, cuando lanza una que nadie captura y también cuando el try hace return o break. Las dos únicas formas de saltárselo son llamar a System.exit o que la máquina virtual muera.'],
['p','La trampa clásica es un finally que hace return. Si el finally devuelve un valor, descarta por completo lo que iba a devolver el try, y peor aún: se traga en silencio la excepción que estuviera propagándose. Nunca se debe poner return, break ni continue dentro de un finally.'],
['c','static int a() {\n    try { return 1; }\n    finally { return 2; }        // devuelve 2, el 1 se pierde\n}\n\nstatic int b() {\n    try { throw new RuntimeException(); }\n    finally { return 3; }        // devuelve 3, la excepción desaparece\n}'],
['x','Distinto es modificar una variable en el finally después de un return. El valor devuelto ya se calculó y se guardó aparte, así que cambiar la variable ya no le afecta. Esto cae mucho.'],
['c','static int c() {\n    int x = 1;\n    try { return x; }            // el valor 1 ya está reservado\n    finally { x = 2; }           // no cambia lo que se devuelve\n}                                // devuelve 1'],
['x','Si el try lanza una excepción y el finally lanza otra distinta, la del finally es la que sale y la del try se pierde sin dejar rastro. Aquí no hay excepciones suprimidas: eso solo ocurre con try-with-resources.']
],

'exc:2':[
['p','El multi-catch permite tratar varios tipos de excepción con un mismo bloque, separándolos con barras verticales. Evita duplicar código cuando la reacción es idéntica.'],
['c','try {\n    metodoQuePuedeFallar();\n} catch (IOException | SQLException e) {\n    registrar(e.getMessage());\n}'],
['p','La variable del multi-catch es implícitamente final. No puedes reasignarla dentro del bloque, aunque no lleve escrita la palabra final. En un catch normal de un solo tipo sí se puede reasignar, aunque sea mala práctica.'],
['c','try {\n    // ...\n} catch (IOException | SQLException e) {\n    e = new IOException();     // NO COMPILA: es final implícita\n}'],
['x','No se pueden listar dos tipos relacionados por herencia. Poner IOException junto a FileNotFoundException es error de compilación porque el primero ya cubre al segundo y la lista sería redundante. El examen lo pregunta constantemente.'],
['c','// NO COMPILA: FileNotFoundException hereda de IOException\ncatch (IOException | FileNotFoundException e) { }\n\n// sí compila: son ramas independientes\ncatch (IOException | NumberFormatException e) { }'],
['p','El tipo estático de la variable es el ancestro común más cercano de los tipos listados. Por eso dentro del bloque solo puedes llamar a los métodos que ese ancestro declare: si combinas IOException y SQLException, la variable se comporta como Exception y no verás los métodos propios de ninguna de las dos.'],
['x','El multi-catch no cambia las reglas de orden: si además tienes un catch de una superclase, el multi-catch debe ir antes. Y sigue vigente la prohibición de capturar comprobadas que el try no pueda lanzar, aplicada a cada tipo de la lista por separado.']
],

'exc:3':[
['p','El try-with-resources declara entre paréntesis los recursos que hay que cerrar, y el compilador genera el cierre por ti. Sustituye al patrón antiguo de cerrar en el finally comprobando null, que casi nadie escribía bien.'],
['c','try (BufferedReader br = new BufferedReader(new FileReader("a.txt"))) {\n    System.out.println(br.readLine());\n}   // br.close() automático, aunque haya excepción\n// no hace falta ni catch ni finally'],
['p','Para poder ir entre paréntesis, el tipo debe implementar AutoCloseable, cuya única obligación es el método close(). Closeable es una interfaz más antigua que hereda de AutoCloseable y restringe la excepción declarada a IOException. Si tu clase no implementa ninguna de las dos, no compila ahí dentro.'],
['c','class Recurso implements AutoCloseable {\n    private final String n;\n    Recurso(String n) { this.n = n; System.out.println("abro " + n); }\n    public void close() { System.out.println("cierro " + n); }\n}\n\ntry (Recurso a = new Recurso("A"); Recurso b = new Recurso("B")) {\n    System.out.println("cuerpo");\n}\n// abro A / abro B / cuerpo / cierro B / cierro A'],
['p','Los recursos se cierran en orden inverso al de declaración, como una pila. Y se cierran antes de que se ejecute ningún catch o finally asociado a ese mismo try: cuando entras en el catch, los recursos ya están cerrados.'],
['p','Las variables declaradas entre paréntesis son implícitamente finales: no puedes reasignarlas dentro del try. Desde Java 9 también puedes poner ahí una variable ya existente, siempre que sea final o efectivamente final, en vez de declararla en el sitio.'],
['c','Recurso r = new Recurso("X");     // efectivamente final\ntry (r) {                          // legal desde Java 9\n    // ...\n}\n\n// try (Recurso r2 = new Recurso("Y")) { r2 = null; }   NO COMPILA'],
['p','Cuando el cuerpo del try lanza una excepción y además falla el cierre, la que sale es la del cuerpo, y la del close queda guardada como suprimida. Se recuperan con getSuppressed(), que devuelve un array. Si el cuerpo termina bien y solo falla el close, entonces la del close sale con normalidad.'],
['c','try (Recurso r = new Recurso("A")) {\n    throw new RuntimeException("del cuerpo");\n} catch (Exception e) {\n    System.out.println(e.getMessage());              // del cuerpo\n    for (Throwable s : e.getSuppressed())\n        System.out.println("suprimida: " + s);       // la del close\n}'],
['x','El orden de las cláusulas es fijo: recursos, cuerpo, catch, finally. Un finally propio sigue ejecutándose el último, después de haber cerrado todo. Y aunque los recursos se separan con punto y coma, el último admite un punto y coma final opcional.']
],

'exc:4':[
['p','No hay que confundir las dos palabras. throw es una instrucción: lanza aquí y ahora un objeto Throwable. throws es parte de la firma del método: avisa de que ese método puede propagar esas excepciones y que quien lo llame tendrá que tratarlas.'],
['c','void guardar(String s) throws IOException {          // declara\n    if (s == null)\n        throw new IllegalArgumentException("nulo");   // lanza\n    Files.writeString(Path.of("a.txt"), s);\n}'],
['p','Se puede declarar con throws cualquier excepción, incluso no comprobadas o excepciones que el método nunca llega a lanzar. Es legal aunque resulte informativamente inútil. Lo que no es legal es lanzar una comprobada sin capturarla ni declararla.'],
['p','Al sobrescribir un método, la regla es que no puedes ampliar el compromiso de excepciones comprobadas. El método hijo puede declarar las mismas, unas más específicas, menos, o ninguna. Lo que no puede es declarar una comprobada nueva o más general que la del padre.'],
['c','class Padre {\n    void m() throws IOException { }\n}\nclass Hijo extends Padre {\n    // void m() throws Exception { }          NO: más general\n    // void m() throws SQLException { }       NO: comprobada nueva\n    void m() throws FileNotFoundException { } // sí: más específica\n    // void m() { }                           sí: ninguna\n    // void m() throws RuntimeException { }   sí: no comprobadas, libres\n}'],
['x','La restricción solo afecta a las comprobadas. Un método que sobrescribe puede declarar cualquier cantidad de excepciones no comprobadas aunque el padre no declare ninguna, porque el compilador no las vigila.'],
['x','Los constructores funcionan al revés de lo que parece: el constructor de una subclase está obligado a declarar las excepciones comprobadas del constructor del padre al que llama, porque esa llamada a super() ocurre siempre y podría propagarlas.'],
['c','class A {\n    A() throws IOException { }\n}\nclass B extends A {\n    // B() { }                    NO COMPILA: super() puede lanzar IOException\n    B() throws IOException { }    // sí\n}'],
['x','Escribir código justo después de un throw dentro del mismo bloque es error de compilación por código inalcanzable. Lo mismo ocurre detrás de un return, un break o un continue.']
],

'exc:5':[
['p','Una excepción propia se crea heredando de Exception si quieres que sea comprobada, o de RuntimeException si prefieres que no lo sea. Por convenio se ofrecen cuatro constructores: vacío, con mensaje, con mensaje y causa, y solo con causa.'],
['c','public class SaldoInsuficienteException extends RuntimeException {\n    private final double faltan;\n\n    public SaldoInsuficienteException(String msg, double faltan) {\n        super(msg);\n        this.faltan = faltan;\n    }\n    public SaldoInsuficienteException(String msg, Throwable causa) {\n        super(msg, causa);       // encadena la original\n        this.faltan = 0;\n    }\n    public double getFaltan() { return faltan; }\n}'],
['p','Encadenar la causa importa: al envolver una excepción de bajo nivel dentro de otra de tu dominio, pasar la original como causa conserva su traza. Se recupera con getCause(). Si te la olvidas, pierdes justo la información que explica el fallo.'],
['c','try {\n    Files.readString(ruta);\n} catch (IOException e) {\n    throw new ConfiguracionException("no se pudo leer la config", e);\n}'],
['p','Las aserciones son una herramienta distinta: comprueban invariantes que el programador da por ciertos. La sintaxis tiene dos formas, con y sin mensaje. Si la condición resulta falsa se lanza un AssertionError, que es un Error y por tanto no se espera capturarlo.'],
['c','assert lista != null;\nassert edad >= 0 : "edad negativa: " + edad;\n\n// lo que va tras los dos puntos es una expresión cuyo valor\n// se usa como mensaje, no tiene que ser una cadena:\nassert saldo > 0 : saldo;'],
['p','Lo decisivo es que las aserciones están desactivadas por defecto. Sin activarlas, la máquina virtual ni siquiera evalúa la condición: la línea es como si no existiera. Se habilitan al ejecutar con -ea (o -enableassertions) y se desactivan selectivamente con -da.'],
['c','java -ea Programa                  # todas activadas\njava -ea:com.miapp... Programa     # solo ese paquete y sus subpaquetes\njava -ea -da:com.miapp.Ruido Programa'],
['x','Precisamente porque pueden estar desactivadas, una aserción nunca debe tener efectos secundarios. Si escribes assert lista.remove(0); el programa se comportará distinto según se ejecute con -ea o sin él, que es el peor error posible.'],
['x','Tampoco deben usarse para validar argumentos de métodos públicos: para eso están IllegalArgumentException y las comprobaciones normales, que sí se ejecutan siempre. Las aserciones son para invariantes internos y para ramas que crees imposibles, como el default de un switch que ya cubriste.']
],

/* ══════════════ COLECCIONES ══════════════ */

'col:0':[
['p','Un array es un objeto de tamaño fijo que se decide al crearlo y no cambia nunca. Su tamaño se consulta con length, que es un campo y no un método: escribir length() es error de compilación. Los elementos arrancan con el valor por defecto de su tipo: 0 para los numéricos, false para boolean, el carácter nulo para char y null para las referencias.'],
['c','int[] a = new int[3];              // {0, 0, 0}\nint[] b = {1, 2, 3};               // solo válido en la declaración\nint[] c = new int[]{1, 2, 3};      // forma larga, válida en cualquier sitio\n\n// int[] d;\n// d = {1, 2, 3};                  NO COMPILA\nString[] e = new String[2];        // {null, null}'],
['p','Los corchetes pueden ir antes o después del nombre, y ahí está una trampa habitual. En una declaración con varias variables, los corchetes pegados al tipo afectan a todas, mientras que los pegados al nombre afectan solo a esa.'],
['c','int[] a, b;      // a y b son arrays\nint c[], d;      // c es array, d es un int suelto\nint[] e[], f;    // e es array de arrays, f es array'],
['p','Los arrays multidimensionales en Java son en realidad arrays de arrays, y por eso pueden ser irregulares: cada fila puede tener una longitud distinta, o incluso ser null.'],
['c','int[][] m = new int[3][];     // tres filas sin crear\nm[0] = new int[]{1};\nm[1] = new int[]{1, 2, 3};\nm[2] = new int[]{1, 2};\nSystem.out.println(m[1].length);   // 3\n\nint[][] r = new int[2][4];    // rectangular, todo a 0'],
['p','Los métodos de la clase Arrays que hay que dominar: sort ordena en el sitio, binarySearch busca en un array YA ordenado, equals y compare y mismatch comparan, fill rellena, copyOf y copyOfRange copian, toString imprime una dimensión y deepToString imprime anidados, y asList crea una vista de tipo List.'],
['c','int[] n = {5, 1, 3};\nArrays.sort(n);                        // {1, 3, 5}\nSystem.out.println(Arrays.toString(n));  // [1, 3, 5]\nSystem.out.println(Arrays.binarySearch(n, 3));   // 1\n\nint[][] mm = {{1,2},{3}};\nSystem.out.println(Arrays.toString(mm));      // basura: [[I@1b6d...\nSystem.out.println(Arrays.deepToString(mm));  // [[1, 2], [3]]'],
['x','binarySearch sobre un array sin ordenar no da error: da un resultado indefinido. Y cuando el elemento no está, no devuelve -1, sino el negativo del punto de inserción menos uno. Si el valor debería ir en la posición 2, devuelve -3. El examen pide ese número exacto.'],
['x','Los arrays son covariantes: un String[] se puede asignar a un Object[]. El compilador lo acepta, pero al guardar un tipo incompatible salta ArrayStoreException en tiempo de ejecución. Las colecciones genéricas no tienen este agujero.'],
['c','Object[] o = new String[2];\no[0] = "vale";\no[1] = 42;        // compila, pero lanza ArrayStoreException'],
['x','Ordenar un String[] usa el orden lexicográfico de Unicode, donde todas las mayúsculas van antes que todas las minúsculas. Así que "Zapato" queda antes que "alfombra". Y los números en cadena se ordenan como texto: "10" va antes que "9".']
],

'col:1':[
['p','El armazón es este: Iterable está arriba del todo, de ella hereda Collection, y de Collection cuelgan List, Set y Queue. Map va por libre: no es una Collection, aunque forme parte del mismo marco de trabajo. Recordarlo evita varias preguntas trampa.'],
['c','Iterable\n └── Collection\n      ├── List    admite duplicados, tiene índice\n      │    ├── ArrayList      acceso por índice rápido\n      │    └── LinkedList     también es Deque\n      ├── Set     sin duplicados\n      │    ├── HashSet        sin orden\n      │    ├── LinkedHashSet  orden de inserción\n      │    └── TreeSet        ordenado (SortedSet/NavigableSet)\n      └── Queue\n           ├── ArrayDeque     pila o cola, la más eficiente\n           └── PriorityQueue  saca siempre el menor\n\nMap  (aparte, no es Collection)'],
['p','La elección práctica: ArrayList para casi todo, porque el acceso por índice es inmediato; LinkedList solo si insertas y borras mucho por los extremos, aunque para eso ArrayDeque suele ganarle; HashSet cuando solo importa la pertenencia; TreeSet cuando necesitas los elementos ordenados; ArrayDeque como pila o como cola.'],
['p','Queue tiene los métodos por parejas, y esa es la tabla que hay que memorizar: uno lanza excepción y el otro devuelve un valor especial. Insertar: add lanza, offer devuelve false. Sacar: remove lanza, poll devuelve null. Mirar sin sacar: element lanza, peek devuelve null.'],
['c','Queue<String> q = new ArrayDeque<>();\nq.offer("a"); q.offer("b");\nq.peek();     // "a", no lo saca\nq.poll();     // "a", lo saca\nq.poll();     // "b"\nq.poll();     // null, la cola está vacía\nq.remove();   // NoSuchElementException'],
['p','Deque permite trabajar por los dos extremos y además ofrece la interfaz de pila. Como pila, push inserta por el principio, pop saca del principio y peek mira el principio: una pila crece por delante, no por detrás.'],
['c','Deque<Integer> pila = new ArrayDeque<>();\npila.push(1); pila.push(2); pila.push(3);\nSystem.out.println(pila);        // [3, 2, 1]\nSystem.out.println(pila.pop());  // 3, el último en entrar'],
['x','La trampa más famosa de todas: en una List<Integer>, remove(int) borra por índice y remove(Object) borra por valor. Si pasas un int literal, gana la versión por índice. Para borrar el valor 2 hay que envolverlo o castear.'],
['c','List<Integer> l = new ArrayList<>(List.of(10, 20, 30));\nl.remove(1);                   // borra el ÍNDICE 1 -> [10, 30]\nl.remove(Integer.valueOf(30)); // borra el VALOR 30 -> [10]'],
['x','Modificar una colección mientras la recorres con for-each lanza ConcurrentModificationException, y no solo en hilos: ocurre en un único hilo. Para borrar durante el recorrido usa el propio Iterator con su remove, o mejor removeIf.'],
['c','List<String> l = new ArrayList<>(List.of("a", "bb", "c"));\n// for (String s : l) if (s.length() == 1) l.remove(s);   ConcurrentModificationException\n\nl.removeIf(s -> s.length() == 1);      // forma correcta\n\nIterator<String> it = l.iterator();    // la otra forma correcta\nwhile (it.hasNext()) if (it.next().isEmpty()) it.remove();'],
['x','Cuidado con los nulos: TreeSet no admite null porque tendría que compararlo, y ArrayDeque tampoco porque null es su valor especial de cola vacía. HashSet y LinkedHashSet sí admiten un null.']
],

'col:2':[
['p','Map guarda pares de clave y valor, con claves únicas. HashMap no garantiza ningún orden, LinkedHashMap conserva el de inserción y TreeMap mantiene las claves ordenadas. put devuelve el valor anterior de esa clave, o null si no había ninguno, detalle que el examen aprovecha.'],
['c','Map<String,Integer> m = new HashMap<>();\nSystem.out.println(m.put("a", 1));   // null: no había nada\nSystem.out.println(m.put("a", 2));   // 1: devuelve el anterior\nSystem.out.println(m.get("a"));      // 2\nSystem.out.println(m.get("z"));      // null, no lanza excepción'],
['p','Los métodos modernos ahorran mucho código y caen siempre. getOrDefault devuelve un sustituto si no hay clave, pero no modifica el mapa. putIfAbsent solo escribe si la clave falta o vale null, y devuelve el valor que se queda dentro. computeIfAbsent calcula el valor solo cuando hace falta, algo ideal para mapas de listas.'],
['c','Map<String,List<String>> agenda = new HashMap<>();\nagenda.computeIfAbsent("lunes", k -> new ArrayList<>()).add("gimnasio");\nagenda.computeIfAbsent("lunes", k -> new ArrayList<>()).add("compra");\n// {lunes=[gimnasio, compra]}, la lista se creó una sola vez'],
['p','merge es el más completo y el que más se pregunta. Si la clave no existe o su valor es null, guarda directamente el valor que le pasas y no llama a la función. Si ya existe, llama a la función con el valor viejo y el nuevo y guarda el resultado. Y si la función devuelve null, borra la entrada.'],
['c','Map<String,Integer> cuenta = new HashMap<>();\nfor (String p : List.of("sol", "mar", "sol"))\n    cuenta.merge(p, 1, Integer::sum);\n// {sol=2, mar=1}\n\ncuenta.merge("sol", 1, (v, n) -> null);   // devuelve null -> borra la clave\nSystem.out.println(cuenta);               // {mar=1}'],
['p','TreeMap añade navegación por el orden de las claves: firstKey y lastKey, floorKey (el mayor menor o igual), ceilingKey (el menor mayor o igual), lowerKey y higherKey estrictos, y las vistas headMap, tailMap y subMap. TreeSet tiene los equivalentes con elementos en vez de claves.'],
['c','TreeMap<Integer,String> t = new TreeMap<>(Map.of(10, "a", 20, "b", 30, "c"));\nt.firstKey();        // 10\nt.floorKey(25);      // 20\nt.ceilingKey(25);    // 30\nt.higherKey(30);     // null\nt.headMap(20);       // {10=a}, el 20 excluido por defecto'],
['x','HashMap admite una clave null y tantos valores null como quieras. TreeMap no admite clave null porque tendría que compararla, y lanza NullPointerException. Hashtable, que es la clase antigua, no admite ni clave ni valor nulos.'],
['x','keySet(), values() y entrySet() no son copias, son vistas conectadas al mapa. Si borras un elemento de la vista, desaparece del mapa original. Y por eso recorrer entrySet() y modificar el mapa a la vez lanza ConcurrentModificationException.'],
['x','Ojo a la diferencia entre getOrDefault y putIfAbsent: el primero solo consulta y deja el mapa intacto, el segundo escribe. Confundirlos es un fallo típico cuando la pregunta imprime el mapa al final.']
],

'col:3':[
['p','Los métodos de fábrica List.of, Set.of y Map.of crean colecciones inmutables. No es que estén protegidas a medias: cualquier intento de modificarlas lanza UnsupportedOperationException. Eso incluye add, remove, clear, set, sort, replaceAll y removeIf, incluso cuando la operación no cambiaría nada.'],
['c','List<String> l = List.of("a", "b");\n// l.add("c");        UnsupportedOperationException\n// l.set(0, "z");     UnsupportedOperationException\n// l.sort(null);      UnsupportedOperationException\nSystem.out.println(l.get(0));   // "a": leer sí se puede'],
['p','Map.of recibe los pares alternando clave y valor y admite hasta diez. Para más, o para mayor claridad, existe Map.ofEntries con Map.entry. Y copyOf construye una copia inmutable a partir de otra colección.'],
['c','Map<String,Integer> a = Map.of("uno", 1, "dos", 2);\n\nMap<String,Integer> b = Map.ofEntries(\n    Map.entry("uno", 1),\n    Map.entry("dos", 2));\n\nList<String> c = List.copyOf(new ArrayList<>(List.of("x")));'],
['x','Estas fábricas rechazan null: List.of(null) lanza NullPointerException, y lo mismo vale para claves y valores de Map.of. Además Set.of y Map.of lanzan IllegalArgumentException si les pasas elementos o claves duplicados, en vez de descartarlos en silencio.'],
['c','// List.of("a", null);          NullPointerException\n// Set.of("a", "a");             IllegalArgumentException: duplicado\n// Map.of("k", 1, "k", 2);       IllegalArgumentException: clave repetida'],
['p','Arrays.asList es un caso intermedio que conviene tener muy claro: devuelve una lista de tamaño fijo respaldada por el array original. No puedes añadir ni borrar, pero sí reemplazar con set, y ese cambio se refleja en el array de partida.'],
['c','String[] arr = {"a", "b"};\nList<String> vista = Arrays.asList(arr);\nvista.set(0, "z");           // permitido\nSystem.out.println(arr[0]);  // "z": el array cambió\n// vista.add("c");           UnsupportedOperationException'],
['p','Collections.unmodifiableList envuelve una lista existente en una vista de solo lectura. La diferencia con List.copyOf es importante: la vista sigue conectada al original, así que si alguien modifica la lista de debajo, la vista lo refleja. La copia, en cambio, queda congelada.'],
['x','En streams, Collectors.toList() no promete el tipo ni la inmutabilidad del resultado, mientras que Collectors.toUnmodifiableList() sí devuelve una lista inmutable y además rechaza los null. Desde Java 16 hay una tercera vía: stream.toList(), que devuelve una lista inmutable pero sí acepta null.']
],

'col:4':[
['p','Java 21 introdujo SequencedCollection para arreglar una carencia vieja: no existía una forma común de pedir el primero o el último elemento. Cada colección lo hacía a su manera, con get(0), con getFirst, con iterator().next() o con nada. Ahora hay una interfaz que unifica todo eso.'],
['c','interface SequencedCollection<E> extends Collection<E> {\n    void addFirst(E e);\n    void addLast(E e);\n    E getFirst();\n    E getLast();\n    E removeFirst();\n    E removeLast();\n    SequencedCollection<E> reversed();\n}'],
['p','Quién la implementa: List y todas sus clases, Deque y las suyas, LinkedHashSet y SortedSet (con lo que TreeSet entra). Quién NO la implementa, y esto es lo que preguntan: HashSet, porque no tiene ningún orden que respetar.'],
['c','List<String> l = new ArrayList<>(List.of("a", "b", "c"));\nl.getFirst();       // "a"   antes: l.get(0)\nl.getLast();        // "c"   antes: l.get(l.size() - 1)\nl.addFirst("z");    // [z, a, b, c]\nl.removeLast();     // devuelve "c"\nl.reversed();       // [c, b, a, z] como vista'],
['p','Para los mapas existe SequencedMap, con putFirst y putLast, firstEntry y lastEntry, pollFirstEntry y pollLastEntry, y las vistas sequencedKeySet, sequencedValues y sequencedEntrySet. La implementan LinkedHashMap y SortedMap, es decir también TreeMap.'],
['c','LinkedHashMap<String,Integer> m = new LinkedHashMap<>();\nm.put("b", 2); m.put("c", 3);\nm.putFirst("a", 1);\nSystem.out.println(m);              // {a=1, b=2, c=3}\nSystem.out.println(m.firstEntry()); // a=1\nSystem.out.println(m.reversed());   // {c=3, b=2, a=1}'],
['x','reversed() devuelve una VISTA, no una copia. Modificar la vista modifica la colección original y al revés. Si querías una copia de verdad, hay que construirla aparte.'],
['x','getFirst, getLast, removeFirst y removeLast lanzan NoSuchElementException sobre una colección vacía. No devuelven null: ese es el papel de peek y poll en las colas.'],
['x','Sobre un SortedSet o un SortedMap, addFirst, addLast, putFirst y putLast lanzan UnsupportedOperationException. Tiene sentido: la posición la decide el comparador, no tú. Y sobre las colecciones de List.of lanzan UnsupportedOperationException por ser inmutables.']
],

'col:5':[
['p','Comparable define el orden natural de una clase. Se implementa en la propia clase y su método compareTo recibe un solo argumento. Comparator es un orden externo y alternativo: se escribe aparte, recibe dos argumentos y permite tener tantos criterios como quieras sobre la misma clase.'],
['c','// orden natural, dentro de la clase\nclass Libro implements Comparable<Libro> {\n    String titulo; int paginas;\n    public int compareTo(Libro o) {\n        return Integer.compare(this.paginas, o.paginas);\n    }\n}\n\n// orden alternativo, fuera\nComparator<Libro> porTitulo = Comparator.comparing(l -> l.titulo);'],
['p','El contrato de ambos es el mismo: devolver negativo si el primero va antes, cero si son equivalentes y positivo si va después. El número concreto da igual, solo importa el signo. Para comparar números usa Integer.compare o Double.compare y no la resta, que puede desbordar.'],
['p','Los comparadores se construyen encadenando. comparing extrae la clave, thenComparing desempata, reversed le da la vuelta, y existen las variantes comparingInt, comparingLong y comparingDouble que evitan el envoltorio. naturalOrder y reverseOrder sirven para los tipos que ya son Comparable.'],
['c','Comparator<Libro> c = Comparator\n    .comparingInt((Libro l) -> l.paginas)\n    .thenComparing(l -> l.titulo)\n    .reversed();\n\nlista.sort(c);\nlista.sort(Comparator.naturalOrder());\nlista.sort(null);   // también usa el orden natural'],
['p','Para los nulos existen nullsFirst y nullsLast, que envuelven a otro comparador y deciden dónde colocar los ausentes en vez de estallar con NullPointerException.'],
['c','Comparator<String> c = Comparator.nullsFirst(Comparator.naturalOrder());\nList<String> l = new ArrayList<>(Arrays.asList("b", null, "a"));\nl.sort(c);   // [null, a, b]'],
['x','reversed() da la vuelta a TODA la cadena construida hasta ese momento, no solo al último criterio. Si quieres invertir un único paso, hay que hacerlo dentro de ese paso con Comparator.reverseOrder().'],
['c','// invierte páginas Y título\n.comparing(Libro::getPaginas).thenComparing(Libro::getTitulo).reversed()\n\n// invierte solo el título\n.comparing(Libro::getPaginas)\n.thenComparing(Libro::getTitulo, Comparator.reverseOrder())'],
['x','TreeSet y TreeMap necesitan un orden: o los elementos implementan Comparable, o les pasas un Comparator en el constructor. Si no, no falla al compilar, sino que lanza ClassCastException en ejecución. Y salta ya en el PRIMER add: la implementación compara el elemento consigo mismo para validar el tipo, así que no hace falta que haya dos.'],
['x','Si compareTo dice que dos objetos son equivalentes, un TreeSet los considera el mismo elemento aunque equals diga que no. Por eso se recomienda que el orden natural sea coherente con equals: si no lo es, un TreeSet y un HashSet con los mismos datos tendrán tamaños distintos.']
],

'col:6':[
['p','Los genéricos dan seguridad de tipos en tiempo de compilación. Sin ellos, meter un objeto equivocado en una lista se descubría al ejecutar, con un ClassCastException. Por convenio los parámetros se llaman E para elemento, K y V para clave y valor, T para tipo y R para resultado.'],
['c','class Caja<T> {\n    private T contenido;\n    public void meter(T t) { contenido = t; }\n    public T sacar() { return contenido; }\n}\n\n// método genérico: el parámetro va antes del tipo de retorno\npublic static <T> List<T> repetir(T valor, int n) { ... }'],
['p','Los límites acotan lo que puede ser el tipo. extends fija un techo, y sirve tanto para clases como para interfaces (incluso varias, separadas con &). No existe la palabra super en la declaración de un parámetro de tipo: solo aparece en los comodines.'],
['c','static <T extends Number> double sumar(List<T> l) {\n    double t = 0;\n    for (T x : l) t += x.doubleValue();   // ya sabe que es Number\n    return t;\n}\n\nstatic <T extends Comparable<T> & Serializable> void m(T t) { }'],
['p','El comodín interrogante representa un tipo desconocido. Con extends obtienes un productor del que puedes leer pero no escribir; con super obtienes un consumidor en el que puedes escribir pero del que solo lees Object. Es la regla PECS: productor extends, consumidor super.'],
['c','List<? extends Number> lectura = List.of(1, 2, 3);\nNumber n = lectura.get(0);     // leer, bien\n// lectura.add(4);             NO COMPILA: no sabe qué tipo exacto es\n// lo único que admite es add(null)\n\nList<? super Integer> escritura = new ArrayList<Number>();\nescritura.add(42);             // escribir, bien\nObject o = escritura.get(0);   // al leer, solo Object'],
['x','El punto clave que cuesta interiorizar: List<String> NO es un List<Object>, aunque String sea un Object. Si lo fuera, podrías meter un Integer en una lista de cadenas. Para eso están los comodines.'],
['p','En tiempo de ejecución los genéricos desaparecen: es el borrado de tipos. El compilador los comprueba y luego los sustituye por su límite (Object si no hay ninguno), insertando los casts necesarios. De ahí salen casi todas las restricciones raras.'],
['x','Consecuencias del borrado que caen en el examen: no puedes hacer new T() ni new T[10]; no puedes usar instanceof con un tipo parametrizado (solo con el comodín sin límite); un contexto estático no puede usar el parámetro de tipo de la clase; los tipos primitivos no valen como argumento de tipo (List<int> no compila, hay que usar List<Integer>); y no puedes sobrecargar dos métodos que tras el borrado tengan la misma firma.'],
['c','class C<T> {\n    // static T campo;                  NO: estático no ve T\n    // T[] a = new T[10];               NO: no se puede crear\n    void m(Object o) {\n        // if (o instanceof List<String>) NO COMPILA\n        if (o instanceof List<?>) { }    // sí\n    }\n    // void f(List<String> l) { }\n    // void f(List<Integer> l) { }       NO: misma firma tras el borrado\n}']
],

'col:7':[
['p','equals y hashCode son un par indivisible. equals decide si dos objetos representan lo mismo; hashCode devuelve un entero que las tablas hash usan para elegir el cubo donde buscar. Si los sobrescribes por separado, HashSet y HashMap dejan de funcionar.'],
['p','El contrato de equals tiene cinco puntos: reflexivo, un objeto es igual a sí mismo; simétrico, si a es igual a b entonces b es igual a a; transitivo, si a igual a b y b igual a c entonces a igual a c; consistente, repetir la llamada da lo mismo mientras no cambie nada; y comparar con null siempre devuelve false, sin lanzar excepción.'],
['p','El contrato de hashCode tiene tres: es consistente en la misma ejecución; si dos objetos son iguales según equals, su hashCode DEBE coincidir; y si son distintos no está obligado a diferir, aunque conviene que lo haga por rendimiento. La regla decisiva es la segunda.'],
['c','class Punto {\n    private final int x, y;\n    Punto(int x, int y) { this.x = x; this.y = y; }\n\n    @Override public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof Punto p)) return false;\n        return x == p.x && y == p.y;\n    }\n    @Override public int hashCode() {\n        return Objects.hash(x, y);\n    }\n}'],
['x','La trampa número uno: escribir equals(Punto o) en vez de equals(Object o). Eso no sobrescribe nada, es una sobrecarga nueva. La clase hereda el equals de Object, que compara referencias, y todo parece funcionar hasta que lo metes en una colección. Poner @Override lo destapa al compilar.'],
['c','class Mal {\n    // esto NO sobrescribe: es otro método distinto\n    public boolean equals(Mal o) { return true; }\n}\nSet<Mal> s = new HashSet<>();\ns.add(new Mal()); s.add(new Mal());\nSystem.out.println(s.size());   // 2, no 1'],
['x','Si solo defines equals y te olvidas de hashCode, dos objetos iguales pueden caer en cubos distintos. El contains de un HashSet devolverá false para un objeto que sí está según equals. Es el fallo silencioso más caro de todos.'],
['x','Nunca uses como clave de un mapa un objeto mutable y luego lo modifiques: su hashCode cambia, pero sigue guardado en el cubo antiguo. La entrada se vuelve inalcanzable, ni con get ni con remove, aunque siga ocupando espacio. Por eso las claves deben ser inmutables.'],
['c','List<Integer> k = new ArrayList<>(List.of(1));\nMap<List<Integer>,String> m = new HashMap<>();\nm.put(k, "valor");\nk.add(2);                       // la clave cambió de hash\nSystem.out.println(m.get(k));   // null: entrada perdida'],
['p','Los records generan equals, hashCode y toString automáticamente a partir de todos sus componentes, y lo hacen bien. Por eso son la opción natural para claves de mapas y objetos de valor: te ahorran justo el código que más se falla.']
],

/* ══════════════ STREAMS Y LAMBDAS ══════════════ */

'str:0':[
['p','Una interfaz funcional es la que tiene exactamente un método abstracto. Ese único método es lo que la lambda implementa. Puede tener además todos los métodos default, static y private que quiera: no cuentan. La anotación @FunctionalInterface no es obligatoria, pero hace que el compilador vigile que se cumple la regla.'],
['c','@FunctionalInterface\ninterface Validador {\n    boolean vale(String s);            // el único abstracto\n    default Validador negado() {       // los default no cuentan\n        return s -> !vale(s);\n    }\n}'],
['p','Las que hay que saberse de memoria son seis, con su método y su forma. Supplier<T> no recibe nada y devuelve T, con get. Consumer<T> recibe T y no devuelve nada, con accept. Predicate<T> recibe T y devuelve boolean, con test. Function<T,R> recibe T y devuelve R, con apply. UnaryOperator<T> es una Function de T a T. BinaryOperator<T> recibe dos T y devuelve un T.'],
['c','Supplier<String>        s = () -> "hola";              s.get();\nConsumer<String>        c = x -> System.out.println(x); c.accept("hola");\nPredicate<String>       p = x -> x.isEmpty();           p.test("");\nFunction<String,Integer> f = x -> x.length();           f.apply("hola");\nUnaryOperator<String>   u = x -> x.toUpperCase();       u.apply("hola");\nBinaryOperator<Integer> b = (x, y) -> x + y;            b.apply(2, 3);'],
['p','Cada una tiene su versión de dos argumentos: BiConsumer, BiPredicate y BiFunction. Lo que no existe es un BiSupplier, porque un proveedor por definición no recibe nada. Y BinaryOperator no es más que una BiFunction donde los tres tipos coinciden.'],
['p','Existen además variantes primitivas para evitar el coste del autoboxing, y su nomenclatura es sistemática. IntPredicate recibe un int. IntSupplier devuelve un int. ToIntFunction<T> recibe un T y devuelve un int. IntFunction<R> recibe un int y devuelve un R. IntUnaryOperator recibe y devuelve int. Lo mismo con Long y Double.'],
['p','Las interfaces funcionales traen métodos default para combinarlas. Predicate ofrece and, or y negate, más los estáticos isEqual y not. Function ofrece andThen y compose, más el estático identity. Consumer ofrece andThen.'],
['c','Predicate<String> largo = s -> s.length() > 5;\nPredicate<String> conA  = s -> s.contains("a");\nlargo.and(conA).test("alfombra");    // true\nlargo.negate().test("hola");         // true\nPredicate.not(largo).test("hola");   // true'],
['x','La diferencia entre andThen y compose se pregunta siempre. f.andThen(g) aplica primero f y luego g. f.compose(g) aplica primero g y luego f. Es decir, compose va hacia atrás.'],
['c','Function<Integer,Integer> doble = x -> x * 2;\nFunction<Integer,Integer> mas3  = x -> x + 3;\n\ndoble.andThen(mas3).apply(5);   // (5*2)+3 = 13\ndoble.compose(mas3).apply(5);   // (5+3)*2 = 16'],
['x','Los métodos públicos de Object no cuentan como abstractos. Una interfaz que declare toString(), equals(Object) o hashCode() junto a un método propio sigue siendo funcional, porque toda clase los hereda ya de Object.']
],

'str:1':[
['p','Una lambda es la implementación abreviada del único método de una interfaz funcional. La sintaxis admite varias formas y el examen juega con todas: paréntesis opcionales si hay un solo parámetro sin tipo, llaves y return opcionales si el cuerpo es una sola expresión.'],
['c','s -> s.length()                       // lo más corto\n(s) -> s.length()                     // paréntesis opcionales\n(String s) -> s.length()              // con tipo, paréntesis obligatorios\ns -> { return s.length(); }           // con llaves, return obligatorio\n() -> 42                              // sin parámetros: paréntesis sí o sí\n(a, b) -> a + b                       // varios: paréntesis obligatorios\n\n// s -> { s.length(); }               NO COMPILA donde se espera un valor'],
['p','Se puede usar var en los parámetros de una lambda, pero con una condición: o lo usan todos o no lo usa ninguno. No se puede mezclar var con tipos explícitos ni con parámetros sin tipo. La ventaja de var es que permite anotar el parámetro.'],
['c','(var a, var b) -> a + b        // vale\n// (var a, String b) -> ...    NO COMPILA: mezcla\n// (var a, b) -> ...           NO COMPILA: mezcla'],
['p','Una lambda solo puede usar variables locales que sean finales o efectivamente finales, es decir, que no se reasignen después de darles valor. Con los campos de instancia y los estáticos no hay esa restricción: esos sí se pueden modificar libremente.'],
['c','int contador = 0;\nRunnable r = () -> System.out.println(contador);   // vale mientras no cambie\n// contador++;    si añades esto, la línea de arriba deja de compilar\n\n// tampoco se puede redeclarar un nombre que ya existe fuera:\nString s = "x";\n// Function<String,String> f = s -> s;    NO COMPILA: s ya existe'],
['p','Una referencia a método es una lambda todavía más corta, para cuando lo único que haces es llamar a un método existente. Hay cuatro tipos y distinguirlos es materia de examen.'],
['c','// 1. estático: Clase::metodoEstatico\nFunction<String,Integer> a = Integer::parseInt;      // s -> Integer.parseInt(s)\n\n// 2. de una instancia concreta: objeto::metodo\nString saludo = "hola";\nSupplier<Integer> b = saludo::length;                // () -> saludo.length()\n\n// 3. de una instancia cualquiera: Clase::metodoDeInstancia\nFunction<String,Integer> c = String::length;         // s -> s.length()\nBiPredicate<String,String> d = String::startsWith;   // (s,t) -> s.startsWith(t)\n\n// 4. constructor: Clase::new\nSupplier<List<String>> e = ArrayList::new;           // () -> new ArrayList<>()\nFunction<Integer,int[]> f = int[]::new;              // n -> new int[n]'],
['x','El tipo 3 confunde: en String::length el objeto sobre el que se llama es el primer parámetro de la lambda. Por eso una referencia que parece de un argumento sirve para una Function de uno, y una de un argumento sirve para una BiFunction de dos.'],
['x','Dentro de una lambda, this apunta a la instancia que la rodea. Dentro de una clase anónima, this apunta a la propia clase anónima. Esta diferencia es una pregunta recurrente, y también explica por qué una lambda no puede tener estado propio.'],
['x','Una lambda no puede asignarse a una variable de tipo var sin más, porque no hay nada de dónde inferir el tipo. Tampoco se puede asignar a Object directamente: hay que castear a la interfaz funcional concreta.'],
['c','// var f = s -> s.length();          NO COMPILA: no hay tipo destino\n// Object o = s -> s.length();       NO COMPILA\nObject o = (Function<String,Integer>) s -> s.length();   // sí']
],

'str:2':[
['p','Optional es un contenedor que puede tener un valor o estar vacío, y existe para dejar de devolver null. Su sentido es obligar a quien llama a plantearse el caso de la ausencia, en vez de que le explote un NullPointerException a los tres saltos.'],
['c','Optional<String> a = Optional.of("hola");        // NPE si le pasas null\nOptional<String> b = Optional.ofNullable(quizaNull);  // vacío si es null\nOptional<String> c = Optional.empty();'],
['x','Optional.of(null) lanza NullPointerException en el acto. Cuando el valor puede ser null hay que usar ofNullable. Confundirlos es una de las preguntas más directas del tema.'],
['p','Para sacar el valor hay varias vías, y sus diferencias importan. get() lanza NoSuchElementException si está vacío. orElse devuelve un sustituto. orElseGet recibe un Supplier y solo lo llama si hace falta. orElseThrow sin argumentos se comporta como get, y con un Supplier lanza la excepción que le indiques.'],
['c','Optional<String> o = Optional.empty();\no.orElse("por defecto");                      // "por defecto"\no.orElseGet(() -> calcularCaro());            // solo ahora se calcula\no.orElseThrow(() -> new IllegalStateException("falta"));\n// o.get();                                   NoSuchElementException'],
['x','La diferencia entre orElse y orElseGet es la pregunta estrella. El argumento de orElse se evalúa SIEMPRE, aunque el Optional tenga valor y no se vaya a usar. El de orElseGet solo se ejecuta cuando está vacío. Con un cálculo caro o con efectos secundarios, la diferencia se nota.'],
['c','Optional<String> lleno = Optional.of("valor");\nlleno.orElse(registrar("A"));         // imprime A y devuelve "valor"\nlleno.orElseGet(() -> registrar("B")); // NO imprime B'],
['p','Para operar sin sacar el valor están isPresent e isEmpty, ifPresent con un Consumer, ifPresentOrElse con dos acciones, y sobre todo map, flatMap y filter, que encadenan sin sacar nada del contenedor.'],
['c','Optional.of("hola")\n        .filter(s -> s.length() > 3)\n        .map(String::toUpperCase)\n        .ifPresentOrElse(\n            s -> System.out.println(s),          // HOLA\n            () -> System.out.println("nada"));'],
['x','map envuelve el resultado en un Optional; si tu función ya devuelve un Optional, map te deja un Optional dentro de otro y hay que usar flatMap para aplanarlo. Y si la función de map devuelve null, el resultado es un Optional vacío, no un Optional de null.'],
['p','Optional.stream() convierte el contenedor en un stream de cero o un elemento, lo que permite encadenarlo con flatMap para quedarte solo con los presentes.'],
['x','Buenas prácticas que el examen también toca: Optional está pensado para tipos de retorno, no para campos ni para parámetros, y no es serializable. Para primitivos existen OptionalInt, OptionalLong y OptionalDouble, que devuelven varios métodos de los streams numéricos.']
],

'str:3':[
['p','Un stream no es una colección: no guarda datos, solo describe un recorrido sobre una fuente. Se compone de tres partes, siempre en el mismo orden: una fuente, cero o más operaciones intermedias y una operación terminal. Sin terminal no se ejecuta nada.'],
['c','List<String> l = List.of("uno", "dos", "tres");\n\nl.stream()                        // fuente\n .filter(s -> s.length() > 3)     // intermedia\n .map(String::toUpperCase)        // intermedia\n .forEach(System.out::println);   // terminal'],
['p','Las fuentes finitas más habituales: el método stream() de cualquier Collection, Stream.of con elementos sueltos o un array, Arrays.stream de un array (con la ventaja de que admite un rango), Stream.empty y Stream.ofNullable, que da cero o un elemento.'],
['c','Stream.of("a", "b", "c");\nStream.of(new String[]{"a", "b"});     // stream de 2 cadenas\nArrays.stream(new int[]{1, 2, 3});     // OJO: es un IntStream\nArrays.stream(arr, 1, 3);              // desde 1 hasta 3 excluido\nStream.ofNullable(quizaNull);          // vacío si es null\nStream.concat(s1, s2);'],
['p','Las fuentes infinitas son Stream.iterate y Stream.generate, y obligan a cortar con limit o con takeWhile. Desde Java 9 iterate admite una versión de tres argumentos con condición de parada, que sí es finita y funciona como un for de toda la vida.'],
['c','Stream.iterate(1, n -> n * 2).limit(5);          // 1 2 4 8 16\nStream.iterate(1, n -> n < 20, n -> n * 2);      // finito: 1 2 4 8 16\nStream.generate(() -> "eco").limit(3);           // eco eco eco\nStream.generate(Math::random).limit(5);'],
['p','Para los números existen los rangos de los streams primitivos: range excluye el extremo superior y rangeClosed lo incluye. Es la forma idiomática de sustituir un bucle for clásico.'],
['c','IntStream.range(1, 5);         // 1 2 3 4\nIntStream.rangeClosed(1, 5);   // 1 2 3 4 5\nnew Random().ints(5, 1, 7);    // 5 valores entre 1 y 6'],
['p','Desde archivos: Files.lines lee perezosamente línea a línea, y Files.walk recorre un árbol de directorios. Ambos devuelven streams que hay que cerrar, porque mantienen abierto un recurso del sistema. Por eso se usan siempre dentro de un try-with-resources.'],
['c','try (Stream<String> lineas = Files.lines(Path.of("a.txt"))) {\n    lineas.filter(s -> !s.isBlank()).forEach(System.out::println);\n}   // cerrar es obligatorio aquí'],
['x','Arrays.stream de un int[] devuelve un IntStream, no un Stream<Integer>. Pero Stream.of con un int[] devuelve un Stream<int[]> de UN solo elemento, porque el array entero cuenta como un objeto. Con un Integer[] sí obtienes un stream de sus elementos.'],
['x','Un String no es una colección: para recorrer sus caracteres se usa chars(), que devuelve un IntStream de códigos, no de caracteres. Para verlos como letras hay que hacer mapToObj y castear a char.']
],

'str:4':[
['p','Las operaciones intermedias devuelven otro stream y no ejecutan nada por sí solas: solo van montando la tubería. Se pueden encadenar tantas como quieras, y ninguna se pone en marcha hasta que llega la terminal.'],
['p','Las de filtrado son filter, que se queda con lo que cumple el predicado; distinct, que elimina repetidos usando equals y hashCode; limit, que corta a los primeros n; y skip, que descarta los primeros n. Las de transformación son map, que convierte uno en uno, y flatMap, que convierte uno en varios y los aplana.'],
['c','Stream.of("uno", "dos", "uno", "tres")\n      .distinct()          // uno dos tres\n      .skip(1)             // dos tres\n      .limit(1)            // dos\n      .forEach(System.out::println);'],
['p','flatMap es la que más cuesta. Cada elemento se transforma en un stream, y todos esos streams se funden en uno solo. Es lo que se usa para aplanar listas de listas o para quedarse con los valores presentes de varios Optional.'],
['c','List<List<String>> anidada = List.of(List.of("a","b"), List.of("c"));\n\nanidada.stream()\n       .flatMap(List::stream)\n       .forEach(System.out::print);      // abc\n\n// partir frases en palabras\nStream.of("hola que tal", "muy bien")\n      .flatMap(s -> Arrays.stream(s.split(" ")))\n      .count();                          // 5'],
['p','sorted ordena, con el orden natural o con el Comparator que le pases. peek está pensada solo para depurar: deja pasar los elementos y de paso ejecuta una acción. takeWhile toma elementos mientras se cumpla la condición y para en el primero que falla; dropWhile hace lo contrario, descarta hasta el primero que falla y deja pasar todo el resto.'],
['c','Stream.of(2, 4, 6, 3, 8)\n      .takeWhile(n -> n % 2 == 0)      // 2 4 6, para en el 3\n      .forEach(System.out::print);\n\nStream.of(2, 4, 6, 3, 8)\n      .dropWhile(n -> n % 2 == 0)      // 3 8, aunque el 8 sea par\n      .forEach(System.out::print);'],
['x','takeWhile y dropWhile no son filter. filter examina todos los elementos; ellas paran en el primer incumplimiento y ya no vuelven a mirar la condición. Con datos desordenados el resultado es muy distinto.'],
['x','sorted y distinct son operaciones con estado: necesitan ver todos los elementos antes de emitir. Sobre un stream infinito, sorted no termina jamás. limit debe ir ANTES de sorted, no después, si la fuente es infinita.'],
['p','El orden de las operaciones cambia el trabajo que se hace. Poner filter antes de map reduce el número de transformaciones. Es el patrón que conviene aplicar siempre: filtrar pronto, transformar después.'],
['x','peek no debe modificar los elementos ni tener efectos secundarios de los que dependa el resultado: no hay ninguna garantía de cuántas veces se llama, y con ciertas operaciones terminales puede no llegar a ejecutarse. Es una herramienta de diagnóstico, nada más.'],
['p','mapMulti, que llegó en Java 16, es una alternativa a flatMap donde en vez de devolver un stream vas empujando cero o más resultados a un consumidor. Rinde mejor cuando la mayoría de los elementos producen pocos valores.']
],

'str:5':[
['p','La operación terminal consume el stream, dispara toda la tubería y devuelve algo que ya no es un stream. Después de ella, ese stream queda gastado para siempre.'],
['p','Las de recorrido son forEach y forEachOrdered. Las de recuento y búsqueda son count, min, max, findFirst y findAny. Las de comprobación son anyMatch, allMatch y noneMatch. Las de recolección son collect, toList y toArray. Y luego está reduce.'],
['c','Stream.of(3, 1, 2).count();                       // 3\nStream.of(3, 1, 2).max(Integer::compare);         // Optional[3]\nStream.of(3, 1, 2).anyMatch(n -> n > 2);          // true\nStream.of(3, 1, 2).findFirst();                   // Optional[3]\nStream.of(3, 1, 2).toList();                      // lista inmutable\nStream.of(3, 1, 2).toArray(Integer[]::new);'],
['p','reduce combina todos los elementos en uno. Tiene tres formas. Con solo el acumulador devuelve un Optional, porque el stream puede estar vacío. Con identidad y acumulador devuelve el tipo directamente, sin Optional. La tercera forma añade un combinador y está pensada para streams paralelos con tipos distintos.'],
['c','// 1 argumento: devuelve Optional\nOptional<Integer> a = Stream.of(1, 2, 3).reduce((x, y) -> x + y);   // Optional[6]\n\n// 2 argumentos: la identidad es el valor de partida\nint b = Stream.of(1, 2, 3).reduce(0, Integer::sum);                 // 6\nint c = Stream.<Integer>of().reduce(0, Integer::sum);               // 0, no falla\n\n// 3 argumentos: acumulador y combinador\nint d = Stream.of("uno", "dos")\n              .reduce(0, (n, s) -> n + s.length(), Integer::sum);   // 6'],
['x','La identidad de reduce tiene que ser un elemento neutro de verdad. Para sumar es el 0 y para multiplicar es el 1. Poner un 1 en una suma no da error, simplemente devuelve un resultado mal por uno, y en paralelo puede sumarse varias veces.'],
['p','Los tres métodos de comprobación cortocircuitan: paran en cuanto saben la respuesta. Su comportamiento sobre un stream vacío es materia de examen: anyMatch devuelve false, mientras que allMatch y noneMatch devuelven las dos true, porque no hay ningún contraejemplo.'],
['c','Stream<String> vacio = Stream.empty();\nvacio.anyMatch(s -> true);    // false\n// allMatch sobre vacío  -> true\n// noneMatch sobre vacío -> true'],
['x','findFirst devuelve el primero según el orden del stream; findAny puede devolver cualquiera, y en un stream paralelo suele no ser el primero. En un stream secuencial, en la práctica coinciden, pero la garantía solo la da findFirst.'],
['x','count() puede saltarse la tubería entera. Si la fuente conoce su tamaño y no hay operaciones que lo alteren, Java calcula el número directamente, y entonces un peek intermedio NO se ejecuta. El examen usa este caso para preguntar qué se imprime: la respuesta es que nada.'],
['x','min y max necesitan un Comparator obligatoriamente y devuelven Optional. En los streams primitivos, en cambio, se llaman igual pero no reciben nada y devuelven OptionalInt, OptionalLong u OptionalDouble.']
],

'str:6':[
['p','IntStream, LongStream y DoubleStream existen para trabajar con primitivos sin el coste del autoboxing, y además ofrecen operaciones aritméticas que el Stream normal no tiene: sum, average, max, min y summaryStatistics.'],
['c','IntStream.rangeClosed(1, 5).sum();          // 15, devuelve int\nIntStream.rangeClosed(1, 5).average();      // OptionalDouble[3.0]\nIntStream.rangeClosed(1, 5).max();          // OptionalInt[5]\n\nIntSummaryStatistics e = IntStream.rangeClosed(1, 5).summaryStatistics();\ne.getCount(); e.getSum(); e.getMin(); e.getMax(); e.getAverage();'],
['p','Para pasar de un stream de objetos a uno primitivo se usan mapToInt, mapToLong y mapToDouble. Para volver, mapToObj o el atajo boxed. Y entre primitivos hay conversiones como asDoubleStream o asLongStream.'],
['c','List<String> l = List.of("uno", "cuatro", "dos");\n\nint total = l.stream().mapToInt(String::length).sum();   // 13\n\nList<Integer> nums = IntStream.range(0, 3)\n                              .boxed()\n                              .toList();                 // [0, 1, 2]\n\nIntStream.range(0, 3).mapToObj(i -> "n" + i).toList();   // [n0, n1, n2]'],
['x','sum() sobre un stream vacío devuelve 0, pero average() devuelve un OptionalDouble vacío, porque dividir entre cero no tiene sentido. Y max() y min() devuelven también un Optional primitivo vacío. Esa asimetría es justo lo que preguntan.'],
['x','El tipo de retorno de sum depende del stream: int en IntStream, long en LongStream y double en DoubleStream. Pero average() siempre devuelve OptionalDouble, en los tres casos, porque una media rara vez es entera.'],
['x','No se puede llamar a un método de Stream sobre un IntStream sin convertir primero. Y al revés, collect(Collectors.toList()) no está disponible en un IntStream con esa forma: hay que hacer boxed() antes, o usar toArray().'],
['c','// IntStream.range(0,3).collect(Collectors.toList());   NO COMPILA\nIntStream.range(0, 3).boxed().collect(Collectors.toList());   // sí\nint[] a = IntStream.range(0, 3).toArray();                    // sí'],
['p','Los métodos de utilidad de la clase Math y los propios de Integer y Double se combinan muy bien con estos streams a través de referencias a método, y aparecen mucho en el examen: Integer::parseInt, Math::abs, Integer::sum, String::valueOf.']
],

'str:7':[
['p','Collectors es la caja de herramientas de collect. Reúne los elementos en una estructura o en un resumen. Los básicos son toList, toSet, toMap, joining y counting.'],
['c','List<String> l = List.of("uno", "dos", "tres");\n\nl.stream().collect(Collectors.toList());\nl.stream().collect(Collectors.toSet());\nl.stream().collect(Collectors.joining(", ", "[", "]"));   // [uno, dos, tres]\nl.stream().collect(Collectors.counting());               // 3 (Long)'],
['p','toMap necesita dos funciones: una para la clave y otra para el valor. Si dos elementos generan la misma clave, lanza IllegalStateException, y ese es su fallo más típico. Para evitarlo se le pasa un tercer argumento que decide cómo fundir los valores en conflicto, y un cuarto opcional para elegir el tipo de mapa.'],
['c','// falla si hay dos palabras de la misma longitud\nl.stream().collect(Collectors.toMap(String::length, s -> s));\n\n// con función de fusión: ya no falla\nl.stream().collect(Collectors.toMap(\n        String::length, s -> s, (a, b) -> a + "|" + b));\n\n// eligiendo la implementación\nl.stream().collect(Collectors.toMap(\n        String::length, s -> s, (a, b) -> a, TreeMap::new));'],
['p','groupingBy es el más potente. Clasifica los elementos por una clave y, si no le dices otra cosa, mete en cada grupo una List. El segundo argumento, el llamado colector de segundo nivel, permite contar, sumar, mapear o volver a agrupar dentro de cada grupo.'],
['c','List<String> l = List.of("uno", "dos", "tres", "seis");\n\nl.stream().collect(Collectors.groupingBy(String::length));\n// {3=[uno, dos], 4=[tres, seis]}\n\nl.stream().collect(Collectors.groupingBy(\n        String::length, Collectors.counting()));\n// {3=2, 4=2}\n\nl.stream().collect(Collectors.groupingBy(\n        String::length, TreeMap::new, Collectors.toSet()));\n// {3=[uno, dos], 4=[tres, seis]} en un TreeMap'],
['p','partitioningBy es el hermano binario: divide en dos según un predicado y devuelve un Map<Boolean, List<T>>. También admite un colector de segundo nivel.'],
['c','l.stream().collect(Collectors.partitioningBy(s -> s.length() > 3));\n// {false=[uno, dos], true=[tres, seis]}'],
['x','La diferencia clave: partitioningBy SIEMPRE devuelve las dos claves, true y false, aunque uno de los lados quede vacío con una lista vacía dentro. groupingBy solo crea las claves que aparecen de verdad. Es una pregunta habitual sobre el tamaño del mapa resultante.'],
['p','Los de resumen numérico son summingInt, averagingInt, summarizingInt y sus variantes con Long y Double, más maxBy y minBy, que reciben un Comparator y devuelven Optional. Y los que envuelven a otro colector son mapping, filtering, flatMapping y collectingAndThen.'],
['c','// media de longitudes por primera letra\nl.stream().collect(Collectors.groupingBy(\n        s -> s.charAt(0),\n        Collectors.averagingInt(String::length)));\n\n// hacer inmutable el resultado\nl.stream().collect(Collectors.collectingAndThen(\n        Collectors.toList(), List::copyOf));'],
['x','teeing, de Java 12, alimenta el mismo stream a dos colectores a la vez y funde los resultados con una función. Sirve para calcular dos cosas en una sola pasada, como el mínimo y el máximo, o la suma y la cuenta.'],
['x','Cuidado con los tipos: counting devuelve Long y no Integer, averagingInt devuelve Double aunque sumes enteros, y summingInt devuelve Integer. El examen enseña una asignación a un tipo incorrecto y pregunta si compila.']
],

'str:8':[
['p','Los streams son perezosos: las operaciones intermedias no hacen nada hasta que llega la terminal. Si un fragmento monta una tubería con filter y map y no la termina, no se imprime absolutamente nada. Es una pregunta clásica en la que hay que responder que la salida está vacía.'],
['c','Stream.of("a", "b")\n      .peek(System.out::println)     // no imprime nada\n      .map(String::toUpperCase);     // falta la terminal'],
['p','Además, el procesamiento es vertical y no horizontal: cada elemento recorre la tubería entera antes de que empiece el siguiente. Por eso los mensajes de varios peek salen intercalados y no agrupados por operación, y por eso una operación que cortocircuita puede evitar que se procesen elementos posteriores.'],
['c','Stream.of("a", "b", "c")\n      .peek(s -> System.out.println("peek " + s))\n      .filter(s -> !s.equals("b"))\n      .findFirst();\n// imprime solo "peek a": encontró el primero y paró'],
['x','Un stream se consume una sola vez. Reutilizar una variable de stream después de una operación terminal lanza IllegalStateException con el mensaje de que ya fue operado o cerrado. Si necesitas recorrerlo dos veces, hay que crear dos streams desde la fuente.'],
['c','Stream<String> s = Stream.of("a", "b");\ns.count();\n// s.forEach(System.out::println);   IllegalStateException'],
['p','Un stream paralelo reparte el trabajo entre varios hilos del pool común. Se pide con parallelStream() sobre una colección o con parallel() sobre un stream ya creado, y se puede volver atrás con sequential().'],
['c','List<Integer> l = IntStream.rangeClosed(1, 1000).boxed().toList();\n\nlong suma = l.parallelStream()\n             .mapToLong(Integer::longValue)\n             .sum();'],
['p','Para que un stream paralelo dé el resultado correcto, la operación de reducción tiene que ser asociativa: el resultado no puede depender de cómo se agrupen las operaciones. La suma y el máximo lo son; la resta y la división no, y con ellas el resultado en paralelo es impredecible.'],
['x','Nunca se debe modificar una estructura compartida desde dentro de un stream paralelo. Añadir a un ArrayList desde un forEach paralelo corrompe la lista o pierde elementos, sin lanzar necesariamente ninguna excepción. Lo correcto es recolectar con collect, que ya está diseñado para eso.'],
['c','// MAL: estado compartido mutable\nList<Integer> destino = new ArrayList<>();\nl.parallelStream().forEach(destino::add);     // resultado impredecible\n\n// BIEN\nList<Integer> ok = l.parallelStream().toList();'],
['x','En paralelo, forEach no respeta el orden de la fuente; si lo necesitas hay que usar forEachOrdered, que lo garantiza a costa de perder parte de la ventaja. Del mismo modo findAny devuelve cualquiera y findFirst obliga a respetar el orden.'],
['p','El paralelismo no siempre compensa: con pocos elementos, con operaciones muy baratas o con fuentes difíciles de dividir (como una LinkedList o un stream de un archivo), el coste de repartir y volver a juntar es mayor que la ganancia. La regla honesta es medir antes de asumir que va a ir más rápido.']
],

/* ══════════════ MÓDULOS ══════════════ */

'mod:0':[
['p','Un módulo es un grupo de paquetes con un nombre y unas reglas explícitas sobre qué necesita y qué ofrece. Esas reglas van en un archivo llamado module-info.java, que se coloca en la raíz del código fuente, no dentro de ningún paquete.'],
['c','// src/com.tienda/module-info.java\nmodule com.tienda {\n    requires java.sql;                  // necesito este módulo\n    requires transitive com.tienda.api; // y quien me use, también lo tendrá\n    requires static com.tienda.test;    // solo al compilar\n\n    exports com.tienda.modelo;                    // público para todos\n    exports com.tienda.interno to com.tienda.web; // solo para ese módulo\n}'],
['p','La palabra module no es una palabra reservada del lenguaje: es una palabra restringida, que solo tiene significado especial dentro de este archivo. En cualquier otro sitio puedes seguir llamando module a una variable. Lo mismo ocurre con requires, exports, opens, uses, provides y to.'],
['p','requires declara una dependencia. El módulo java.base contiene java.lang, java.util y lo esencial, y está implícito siempre: no hace falta declararlo y de hecho es redundante hacerlo. Todos los demás módulos de la plataforma sí hay que pedirlos.'],
['p','requires transitive es una dependencia que se contagia: quien dependa de tu módulo obtiene también acceso a ese otro sin tener que declararlo. Es lo correcto cuando tu API pública expone tipos que vienen de ahí, porque si no, quien te use no podría ni nombrar los tipos que le devuelves.'],
['c','module a {\n    requires transitive b;   // quien requiera "a" ve también "b"\n}\nmodule c {\n    requires a;              // y por tanto ve "b" gratis\n}'],
['p','requires static es lo contrario en el tiempo: la dependencia es obligatoria al compilar pero opcional al ejecutar. Se usa para anotaciones o herramientas que no hacen falta en producción. Si en tiempo de ejecución el módulo no está, no pasa nada mientras no lo toques.'],
['p','exports abre un paquete concreto: los tipos públicos de ese paquete pasan a ser visibles desde fuera. Y solo ese paquete: los subpaquetes NO se exportan en cascada, hay que listarlos uno a uno. La variante exports...to restringe la apertura a los módulos que nombres, y se llama exportación cualificada.'],
['x','Exportar un paquete no significa exportar todo lo que hay dentro: siguen mandando los modificadores de acceso. Un tipo con acceso de paquete sigue siendo invisible fuera aunque el paquete esté exportado. Los módulos añaden una capa más de encapsulación, no sustituyen a la que ya había.'],
['x','Un módulo no puede exportar dos veces el mismo paquete, ni requerir dos veces el mismo módulo: es error de compilación. Y no puede haber dos módulos que exporten el mismo paquete al mismo consumidor, lo que se conoce como paquete dividido y está prohibido.'],
['x','El nombre del módulo se escribe con puntos, como los paquetes, pero no tiene relación obligatoria con ellos. Por convenio se usa el nombre del paquete principal en orden inverso de dominio. Y no puede llevar guiones.']
],

'mod:1':[
['p','exports y opens resuelven problemas distintos. exports da acceso en tiempo de compilación y de ejecución a los tipos públicos del paquete, con las reglas normales de visibilidad. opens da acceso reflexivo profundo en tiempo de ejecución, incluyendo los miembros privados, pero no permite compilar contra ese paquete.'],
['c','module com.tienda {\n    exports com.tienda.api;              // uso normal desde código\n    opens com.tienda.modelo;             // reflexión para todos\n    opens com.tienda.dto to com.fasterxml.jackson.databind;  // cualificado\n}'],
['p','La razón de existir de opens son las bibliotecas que trabajan por reflexión: los marcos de persistencia, los serializadores de JSON o los de inyección de dependencias necesitan leer y escribir campos privados de tus objetos. Sin opens, esas herramientas fallan al ejecutar con un InaccessibleObjectException.'],
['p','Si el módulo entero necesita estar abierto a la reflexión, se pone la palabra open delante de module. En ese caso no se puede escribir ninguna cláusula opens dentro, porque ya está todo abierto y sería redundante: hacerlo es error de compilación.'],
['c','open module com.tienda {\n    exports com.tienda.api;\n    // opens com.tienda.dto;   NO COMPILA: el módulo ya está abierto entero\n}'],
['x','Un paquete puede estar a la vez exportado y abierto: son cosas independientes y compatibles. Lo que no se puede es abrir dos veces el mismo paquete, ni abrirlo dentro de un módulo declarado como open.'],
['x','setAccessible(true) sobre un miembro privado de un paquete que no está abierto lanza InaccessibleObjectException en tiempo de ejecución. Compila perfectamente: el fallo aparece al ejecutar, y esa es justo la situación que plantean las preguntas.'],
['p','Como puerta de escape para migrar código viejo existen las opciones de línea de comandos --add-exports y --add-opens, que abren un paquete desde fuera sin tocar el module-info. Se usan al compilar y al ejecutar, y son un parche de transición, no una solución.']
],

'mod:2':[
['p','El sistema de módulos trae su propio mecanismo de servicios, que permite separar una interfaz de sus implementaciones sin que el consumidor sepa quién la implementa. Intervienen tres piezas: la interfaz del servicio, uno o más proveedores y el consumidor.'],
['c','// módulo de la interfaz\nmodule com.pagos.api {\n    exports com.pagos.api;      // aquí vive la interfaz Pasarela\n}\n\n// módulo proveedor\nmodule com.pagos.paypal {\n    requires com.pagos.api;\n    provides com.pagos.api.Pasarela with com.pagos.paypal.PaypalImpl;\n}\n\n// módulo consumidor\nmodule com.tienda {\n    requires com.pagos.api;\n    uses com.pagos.api.Pasarela;    // pediré implementaciones\n}'],
['p','El consumidor declara uses con el tipo del servicio y luego los busca en tiempo de ejecución con ServiceLoader. Lo que obtiene es un iterable de todas las implementaciones disponibles, que pueden ser ninguna, una o varias según qué módulos estén presentes.'],
['c','ServiceLoader<Pasarela> cargador = ServiceLoader.load(Pasarela.class);\n\nfor (Pasarela p : cargador)\n    System.out.println(p.getClass());\n\n// o quedarse con la primera que haya\nOptional<Pasarela> primera = cargador.findFirst();\n\n// stream de proveedores sin instanciarlos aún\ncargador.stream()\n        .map(ServiceLoader.Provider::get)\n        .forEach(Pasarela::cobrar);'],
['x','El consumidor NO declara requires del módulo proveedor: esa es toda la gracia. Solo requiere el módulo de la interfaz y declara uses. Si además pusiera requires del proveedor, habría vuelto a acoplarlos y el mecanismo no serviría de nada.'],
['x','La clase que aparece detrás de with debe ser pública, estar en el mismo módulo que la declara y tener un constructor público sin argumentos. Si no, es error de compilación. La alternativa es que ofrezca un método estático público llamado provider que devuelva la instancia.'],
['x','El módulo proveedor no necesita exportar el paquete de la implementación. De hecho lo suyo es no exportarlo: el sistema de servicios accede a él aunque esté encapsulado, y así nadie puede depender de la clase concreta.'],
['p','ServiceLoader no garantiza ningún orden entre proveedores, y por defecto va instanciándolos de forma perezosa según se recorren. El método reload() vuelve a buscar y descarta lo que tenía en caché.']
],

'mod:3':[
['p','Hay tres clases de módulo y la diferencia entre ellas explica casi todas las preguntas raras del tema. Los nombrados son los que tienen module-info.java. Los automáticos son archivos jar corrientes, sin module-info, colocados en la ruta de módulos. Y el sin nombre es el que agrupa todo lo que está en la ruta de clases de toda la vida.'],
['c','java --module-path libs -m com.tienda/com.tienda.Main   # ruta de módulos\njava -cp libs/* com.tienda.Main                          # ruta de clases'],
['p','Un módulo automático se comporta de forma muy generosa: exporta todos sus paquetes, abre todos sus paquetes a la reflexión y lee a todos los demás módulos, incluido el sin nombre. Es un puente pensado para migrar bibliotecas que aún no se han modularizado.'],
['p','Su nombre sale de dos sitios, por este orden. Si el jar declara en su manifiesto la entrada Automatic-Module-Name, se usa ese. Si no, se deduce del nombre del archivo: se quita la extensión y el número de versión, los guiones se convierten en puntos y se descarta lo que no sea válido.'],
['c','// commons-lang3-3.12.0.jar  ->  commons.lang3\n// mi-libreria-1.0.jar        ->  mi.libreria'],
['x','La regla que más cae: un módulo NOMBRADO no puede leer el módulo sin nombre. Es decir, si modularizas tu aplicación pero dejas una biblioteca en la ruta de clases, tu código no la verá y no compilará. Por eso la migración exige mover las dependencias a la ruta de módulos, aunque sea como automáticas.'],
['x','El módulo sin nombre, en cambio, lee a todo el mundo. Por eso una aplicación clásica en la ruta de clases sigue funcionando igual que siempre: si no hay module-info por ninguna parte, el sistema de módulos apenas se nota.'],
['x','Un jar situado en la ruta de clases nunca es un módulo automático: es parte del módulo sin nombre. Lo que convierte a un jar en automático es estar en la ruta de MÓDULOS sin llevar module-info dentro. La misma biblioteca cambia de naturaleza según dónde la pongas.']
],

'mod:4':[
['p','javac compila indicando la ruta de módulos y el directorio de salida. La opción larga --module-path tiene la forma corta -p, que es la que suele aparecer en el examen abreviada.'],
['c','javac -d salida/com.tienda \\\n      --module-path libs \\\n      $(find src/com.tienda -name "*.java")\n\n# equivalente abreviado\njavac -d salida/com.tienda -p libs src/com.tienda/module-info.java ...'],
['p','java ejecuta indicando módulo y clase principal separados por una barra. La opción --module tiene la forma corta -m. Hay dos opciones de diagnóstico que conviene reconocer: --describe-module resume lo que declara un módulo, y --list-modules enumera los disponibles.'],
['c','java --module-path salida --module com.tienda/com.tienda.Main\njava -p salida -m com.tienda/com.tienda.Main         # lo mismo\n\njava -p salida --describe-module com.tienda\njava --list-modules\njava --show-module-resolution -p salida -m com.tienda/com.tienda.Main'],
['p','jar empaqueta. Las opciones básicas son --create, --file con el nombre del jar, --main-class para fijar el punto de entrada y --module-version. Con --describe-module inspecciona un jar ya hecho.'],
['c','jar --create --file libs/tienda.jar \\\n    --main-class com.tienda.Main \\\n    -C salida/com.tienda .\n\njar --describe-module --file libs/tienda.jar'],
['p','jdeps analiza dependencias. Sirve para saber qué necesita un jar antes de modularizarlo, y con --jdk-internals delata el uso de clases internas del JDK que ya no deberían usarse. Con --generate-module-info te escribe un borrador del module-info.'],
['c','jdeps --module-path libs tienda.jar\njdeps --jdk-internals tienda.jar\njdeps -s tienda.jar                    # resumen\njdeps --generate-module-info . tienda.jar'],
['p','jlink construye una imagen de ejecución reducida: coge tu módulo y solo los módulos de la plataforma que hacen falta, y produce un runtime completo mucho más pequeño que un JDK entero. jmod, en cambio, crea archivos .jmod para contenido que un jar no puede llevar, como bibliotecas nativas, y solo sirve en tiempo de compilación y de enlace.'],
['c','jlink --module-path salida:$JAVA_HOME/jmods \\\n      --add-modules com.tienda \\\n      --output distribucion \\\n      --launcher tienda=com.tienda/com.tienda.Main\n\ndistribucion/bin/java --list-modules'],
['x','La confusión más común es entre jlink y jmod. jlink produce una imagen ejecutable a partir de módulos; jmod produce un archivo empaquetado que jlink puede consumir. Y un .jmod no se puede ejecutar directamente, a diferencia de un jar.']
],

'mod:5':[
['p','Modularizar una aplicación existente no se hace de golpe. Hay dos estrategias reconocidas, y el examen espera que sepas cuál conviene en cada caso y en qué se diferencian.'],
['p','La estrategia ascendente es la ideal cuando todas tus dependencias ya son módulos. Se empieza por las bibliotecas de más abajo, que no dependen de nadie, se les añade module-info y se sube nivel a nivel hasta la aplicación. Cada paso deja el sistema en un estado coherente.'],
['p','La estrategia descendente se usa cuando alguna dependencia todavía no está modularizada. Se empieza por la aplicación, se pasa todo a la ruta de módulos, y las bibliotecas sin module-info funcionan como módulos automáticos hasta que sus autores las conviertan.'],
['c','// paso intermedio típico de la migración descendente\nmodule com.tienda {\n    requires commons.lang3;   // nombre automático deducido del jar\n    exports com.tienda.api;\n}'],
['x','Los paquetes divididos están prohibidos: dos módulos no pueden aportar el mismo paquete al mismo consumidor. Es el problema que más aparece al migrar bibliotecas antiguas que repartían un mismo paquete entre varios jar, y se resuelve fusionándolos o renombrando.'],
['x','Las dependencias cíclicas entre módulos nombrados son error de compilación: si a requiere b, b no puede requerir a, ni directamente ni a través de una cadena. Dentro de un mismo módulo las clases sí pueden referirse entre sí en círculo; la prohibición es solo entre módulos.'],
['p','El orden de trabajo recomendado es: primero pasar jdeps para descubrir qué usa cada parte y detectar accesos a clases internas del JDK, después decidir la estrategia, y solo entonces empezar a escribir los module-info. Intentarlo a ciegas termina siempre en un ciclo o en un paquete dividido.']
],

/* ══════════════ CONCURRENCIA ══════════════ */

'conc:0':[
['p','Un hilo es una línea de ejecución dentro del proceso. La forma correcta de definir la tarea es implementar Runnable, cuyo método run no recibe nada ni devuelve nada, y pasárselo a un Thread. Heredar de Thread también funciona pero se considera mala práctica, porque gasta la única herencia disponible.'],
['c','Runnable tarea = () -> System.out.println("hola desde " + Thread.currentThread().getName());\n\nThread t = new Thread(tarea, "obrero-1");\nt.start();      // arranca un hilo nuevo\nt.join();       // espera a que termine'],
['x','La confusión fundamental del tema: start() crea un hilo nuevo y ejecuta run() en él; llamar a run() directamente NO crea ningún hilo, simplemente ejecuta el método en el hilo actual, de forma síncrona. El examen enseña t.run() y pregunta cuántos hilos hay: uno solo.'],
['x','Un hilo no se puede arrancar dos veces. Llamar a start() sobre un hilo ya arrancado, o ya terminado, lanza IllegalThreadStateException. No hay forma de reiniciar un Thread: hay que crear otro.'],
['p','Los estados por los que pasa un hilo son seis, y están en el enum Thread.State: NEW antes de arrancar, RUNNABLE cuando puede ejecutarse, BLOCKED esperando a entrar en un bloque synchronized, WAITING esperando indefinidamente (por join o wait sin plazo), TIMED_WAITING esperando con plazo (sleep o join con milisegundos) y TERMINATED al acabar.'],
['p','Thread.sleep detiene el hilo actual el tiempo indicado y lanza InterruptedException, que es comprobada y hay que tratar. join espera a que otro hilo termine, y admite un plazo máximo. Ambas son formas de coordinación básicas.'],
['c','Thread t = new Thread(() -> {\n    try {\n        Thread.sleep(1000);\n    } catch (InterruptedException e) {\n        Thread.currentThread().interrupt();   // restaurar la marca\n        return;\n    }\n});\nt.start();\nt.join(500);   // espero como mucho medio segundo'],
['p','interrupt() no mata el hilo: solo le pone una marca. Si el hilo está dentro de sleep, wait o join, esa espera se rompe con InterruptedException y la marca se borra. Si está calculando, la marca queda puesta y el hilo debe consultarla con isInterrupted() y decidir por su cuenta cuándo parar.'],
['x','Al capturar InterruptedException hay que volver a marcar el hilo con Thread.currentThread().interrupt(), o propagar la excepción. Tragársela en silencio hace que las capas superiores nunca se enteren de que alguien pidió la cancelación.'],
['p','Un hilo daemon no impide que la máquina virtual termine: cuando solo quedan daemons, el programa acaba y ellos mueren a media faena. Se marca con setDaemon(true) ANTES de arrancarlo; hacerlo después lanza IllegalThreadStateException.'],
['x','Los métodos stop, suspend y resume están obsoletos y en las versiones modernas lanzan excepción: dejaban los datos a medio escribir y los cerrojos cogidos. La cancelación se hace siempre por interrupción cooperativa.']
],

'conc:1':[
['p','Un hilo virtual, novedad definitiva en Java 21, es un hilo gestionado por la máquina virtual y no por el sistema operativo. Son tan baratos que se pueden crear millones, mientras que los de plataforma se cuentan por miles como mucho. Cada hilo virtual se monta sobre un hilo portador de plataforma, y cuando se bloquea se desmonta y libera al portador para otro.'],
['c','// forma directa\nThread t = Thread.startVirtualThread(() -> System.out.println("virtual"));\nt.join();\n\n// con constructor, para configurarlo antes\nThread v = Thread.ofVirtual().name("tarea-1").unstarted(tarea);\nv.start();\n\n// hilo de plataforma explícito\nThread p = Thread.ofPlatform().daemon().name("clasico").start(tarea);'],
['p','La forma habitual de usarlos no es crearlos a mano, sino con un ejecutor que fabrica uno por tarea. Como no hay que reutilizarlos, el concepto de pool desaparece: se crea un hilo por cada tarea y se tira al terminar.'],
['c','try (var ex = Executors.newVirtualThreadPerTaskExecutor()) {\n    for (int i = 0; i < 10_000; i++) {\n        int n = i;\n        ex.submit(() -> descargar(n));\n    }\n}   // close() espera a que terminen todas'],
['p','Dónde ganan de verdad: en tareas que pasan la mayor parte del tiempo bloqueadas esperando entrada y salida, como llamadas de red, consultas a bases de datos o lectura de archivos. Ahí permiten escribir código secuencial y sencillo con el rendimiento de uno asíncrono.'],
['x','Dónde NO ganan: en tareas que consumen procesador sin parar. Un cálculo intensivo no se bloquea nunca, así que no cede el portador y no hay nada que ganar; para eso siguen sirviendo los hilos de plataforma y los pools del tamaño del número de núcleos.'],
['x','Detalles que preguntan: los hilos virtuales SIEMPRE son daemon, y setDaemon(false) sobre uno lanza IllegalArgumentException. Su prioridad es siempre la normal y setPriority no tiene ningún efecto. Y no se deben meter en un pool: crearlos es tan barato que reutilizarlos no aporta nada.'],
['x','El anclaje o pinning es la trampa clásica: si un hilo virtual se bloquea dentro de un bloque synchronized, no puede desmontarse y retiene el hilo portador, con lo que se pierde la ventaja. La recomendación es usar ReentrantLock en lugar de synchronized en el código que vaya a bloquearse.'],
['p','La concurrencia estructurada, con StructuredTaskScope, acompaña a los hilos virtuales para tratar un grupo de tareas como una unidad. En Java 21 todavía es una característica en vista previa, así que hay que habilitarla explícitamente al compilar y ejecutar.']
],

'conc:2':[
['p','Un ExecutorService separa la tarea del hilo que la ejecuta: tú entregas trabajo y él decide cómo repartirlo. La clase Executors ofrece las fábricas habituales: un solo hilo, un pool fijo, un pool que crece según hace falta, y el de un hilo virtual por tarea.'],
['c','ExecutorService a = Executors.newSingleThreadExecutor();\nExecutorService b = Executors.newFixedThreadPool(4);\nExecutorService c = Executors.newCachedThreadPool();\nExecutorService d = Executors.newVirtualThreadPerTaskExecutor();\nScheduledExecutorService e = Executors.newScheduledThreadPool(2);'],
['p','Hay dos formas de entregar trabajo. execute recibe un Runnable y no devuelve nada. submit admite tanto Runnable como Callable y devuelve un Future con el que consultar el resultado. Callable sí devuelve valor y sí puede lanzar excepciones comprobadas, que es su diferencia con Runnable.'],
['c','Future<Integer> f = ex.submit(() -> {\n    Thread.sleep(100);\n    return 42;              // Callable: devuelve valor\n});\n\nf.isDone();\nInteger r = f.get();        // BLOQUEA hasta que haya resultado\nInteger s = f.get(1, TimeUnit.SECONDS);   // con plazo: TimeoutException\nf.cancel(true);             // true: interrumpe si ya está corriendo'],
['x','Si la tarea lanza una excepción, no la ves al momento: queda guardada y sale envuelta en una ExecutionException cuando llamas a get(). Con execute, en cambio, la excepción se pierde por el manejador de excepciones no capturadas. Por eso submit es casi siempre mejor.'],
['p','invokeAll entrega una colección de tareas, espera a que TODAS terminen y devuelve la lista de Future ya completados. invokeAny espera solo a que UNA acabe bien, devuelve su resultado directamente y cancela las demás.'],
['c','List<Callable<String>> tareas = List.of(() -> "a", () -> "b");\n\nList<Future<String>> todas = ex.invokeAll(tareas);   // bloquea hasta el final\nString primera = ex.invokeAny(tareas);               // la que antes acabe'],
['p','El apagado es obligatorio: mientras el ejecutor viva, sus hilos no son daemon y el programa no termina. shutdown deja acabar lo pendiente y no admite más tareas. shutdownNow intenta interrumpir lo que está en marcha y devuelve las tareas que ni siquiera empezaron. awaitTermination espera a que se vacíe, con plazo.'],
['c','ex.shutdown();\nif (!ex.awaitTermination(10, TimeUnit.SECONDS))\n    ex.shutdownNow();'],
['x','Desde Java 19, ExecutorService implementa AutoCloseable, así que se puede usar en un try-with-resources y el cierre llama a shutdown y espera. Es la forma recomendada en Java 21, y evita el olvido más habitual del tema.'],
['x','Enviar una tarea a un ejecutor ya apagado lanza RejectedExecutionException. Y ojo: shutdown() no bloquea, devuelve el control inmediatamente; quien espera es awaitTermination.'],
['p','Para tareas repetidas está ScheduledExecutorService. schedule ejecuta una vez tras un retraso. scheduleAtFixedRate arranca cada X sin importar lo que tarde la anterior, con riesgo de solapamiento. scheduleWithFixedDelay espera X entre el fin de una y el inicio de la siguiente, así que nunca se solapan.']
],

'conc:3':[
['p','Una condición de carrera aparece cuando dos hilos leen y escriben el mismo dato sin coordinarse y el resultado depende de quién llegue antes. El caso de libro es un contador: la operación n++ parece atómica pero son tres pasos (leer, sumar, escribir) y dos hilos pueden intercalarlos y perder incrementos.'],
['c','class Contador {\n    private int n = 0;\n    void subir() { n++; }                    // NO es atómico\n    synchronized void subirBien() { n++; }   // ahora sí\n}'],
['p','synchronized garantiza dos cosas a la vez: exclusión mutua, porque solo un hilo tiene el monitor a la vez, y visibilidad, porque al salir del bloque los cambios quedan publicados para los demás. Se puede aplicar a un método o a un bloque con un objeto de cerrojo explícito.'],
['c','// método de instancia: el cerrojo es this\nsynchronized void m() { }\n\n// método estático: el cerrojo es el objeto Class\nstatic synchronized void s() { }\n\n// bloque: el cerrojo es el que tú digas\nprivate final Object cerrojo = new Object();\nvoid m2() {\n    synchronized (cerrojo) { }\n}'],
['x','Un método synchronized de instancia y uno estático de la misma clase NO se excluyen entre sí: usan cerrojos distintos, la instancia uno y el objeto Class el otro. Es una pregunta muy repetida.'],
['p','volatile resuelve solo la visibilidad: garantiza que cada lectura ve la última escritura y prohíbe que el compilador cachee la variable en un registro. Lo que NO da es atomicidad, así que un contador volatile sigue perdiendo incrementos.'],
['c','private volatile boolean parar = false;   // uso correcto: bandera\n\nwhile (!parar) { trabajar(); }            // otro hilo pone parar = true\n\nprivate volatile int n;\nn++;                                       // SIGUE siendo una carrera'],
['p','ReentrantLock hace lo mismo que synchronized pero con más control: tryLock intenta coger el cerrojo y devuelve false en vez de esperar, admite plazo, se puede pedir en un método y soltar en otro, y acepta ser justo para atender por orden de llegada.'],
['c','Lock l = new ReentrantLock();\nl.lock();\ntry {\n    // sección crítica\n} finally {\n    l.unlock();      // SIEMPRE en el finally\n}\n\nif (l.tryLock(1, TimeUnit.SECONDS)) {\n    try { } finally { l.unlock(); }\n} else {\n    // no lo conseguí, hago otra cosa\n}'],
['x','Olvidar el unlock en un finally es el error que más se paga: si la sección crítica lanza una excepción, el cerrojo se queda cogido para siempre y todos los demás hilos se quedan esperando. synchronized no tiene ese problema porque suelta el monitor solo.'],
['p','Un interbloqueo ocurre cuando dos hilos tienen cada uno un cerrojo y esperan el del otro, y ninguno suelta. La prevención práctica es coger siempre los cerrojos en el mismo orden en toda la aplicación, o usar tryLock con plazo para poder rendirse. Java no los detecta ni los rompe por su cuenta.'],
['x','Conviene distinguir tres males parecidos: el interbloqueo, donde nadie avanza porque se esperan mutuamente; la inanición, donde un hilo nunca consigue el turno porque otros lo acaparan; y el bloqueo activo, donde los hilos reaccionan y ceden una y otra vez sin llegar a progresar.']
],

'conc:4':[
['p','Las clases atómicas ofrecen operaciones indivisibles sobre un valor sin usar cerrojos, apoyándose en instrucciones del procesador. Las principales son AtomicInteger, AtomicLong, AtomicBoolean y AtomicReference.'],
['c','AtomicInteger n = new AtomicInteger(0);\n\nn.incrementAndGet();     // ++n, devuelve el nuevo\nn.getAndIncrement();     // n++, devuelve el viejo\nn.addAndGet(5);\nn.compareAndSet(6, 10);  // cambia solo si vale 6\nn.updateAndGet(v -> v * 2);\nn.get();'],
['x','Los nombres siguen un patrón que hay que leer con calma: getAndAlgo devuelve el valor ANTERIOR, y algoAndGet devuelve el valor YA modificado. El examen aprovecha esta simetría para que te equivoques con un solo número de diferencia.'],
['p','Las colecciones concurrentes están pensadas para ser usadas por varios hilos sin sincronizar por fuera. ConcurrentHashMap es el sustituto de HashMap; CopyOnWriteArrayList y CopyOnWriteArraySet sirven cuando se lee mucho y se escribe poco; y ConcurrentLinkedQueue es una cola sin bloqueo.'],
['c','Map<String,Integer> m = new ConcurrentHashMap<>();\nm.merge("clave", 1, Integer::sum);     // atómico\nm.putIfAbsent("otra", 0);              // atómico\n\nList<String> l = new CopyOnWriteArrayList<>();'],
['x','Las colecciones de copia al escribir hacen una copia entera del array interno en cada modificación. Recorrerlas es seguro porque el iterador trabaja sobre una foto fija del momento en que se creó, y por eso no lanzan ConcurrentModificationException, pero tampoco ven los cambios posteriores.'],
['c','List<String> l = new CopyOnWriteArrayList<>(List.of("a", "b"));\nfor (String s : l) {\n    l.add("c");        // no lanza excepción...\n}                      // ...y el bucle no ve las adiciones: recorre la foto'],
['p','Las colas bloqueantes coordinan productores y consumidores. BlockingQueue añade put, que espera si está llena, y take, que espera si está vacía. ArrayBlockingQueue tiene capacidad fija y LinkedBlockingQueue puede ser prácticamente ilimitada.'],
['c','BlockingQueue<String> cola = new ArrayBlockingQueue<>(10);\n\n// productor\ncola.put("dato");       // espera si no cabe\n\n// consumidor\nString d = cola.take(); // espera si no hay nada\ncola.poll(1, TimeUnit.SECONDS);   // con plazo, devuelve null si expira'],
['x','Collections.synchronizedList envuelve una lista y sincroniza cada método por separado, pero eso no basta: una secuencia de dos llamadas sigue siendo una carrera, y para recorrerla hay que sincronizar tú a mano sobre la propia lista. Las colecciones concurrentes son mejores porque ofrecen operaciones compuestas atómicas.'],
['x','Aunque un ConcurrentHashMap es seguro, hacer get y luego put por separado NO es atómico: entre las dos llamadas puede colarse otro hilo. Para eso están merge, compute, putIfAbsent y computeIfAbsent, que sí lo son.']
],

'conc:5':[
['p','CompletableFuture representa un resultado que llegará más tarde y, a diferencia de Future, permite encadenar lo que hay que hacer con él sin bloquear. Se arranca con supplyAsync cuando la tarea devuelve valor, o con runAsync cuando no devuelve nada.'],
['c','CompletableFuture<String> f = CompletableFuture\n    .supplyAsync(() -> consultarApi())        // en otro hilo\n    .thenApply(String::toUpperCase)           // transformar\n    .thenApply(s -> s + "!");\n\nString r = f.join();    // espera y devuelve; sin excepción comprobada'],
['p','Los tres eslabones básicos se distinguen por lo que reciben y devuelven. thenApply recibe el valor y devuelve otro, como un map. thenAccept recibe el valor y no devuelve nada. thenRun no recibe nada y no devuelve nada: solo se ejecuta después.'],
['p','Para combinar dos etapas hay otros dos. thenCompose encadena una tarea que a su vez devuelve un CompletableFuture y aplana el resultado, igual que un flatMap. thenCombine espera a dos tareas independientes que van en paralelo y funde sus dos resultados con una función.'],
['c','// dependientes: la segunda necesita el resultado de la primera\ncf.thenCompose(id -> buscarUsuario(id));      // evita el anidamiento\n\n// independientes: van a la vez y luego se juntan\nprecio.thenCombine(impuesto, (p, i) -> p + i);\n\n// esperar a varias\nCompletableFuture.allOf(a, b, c).join();\nCompletableFuture.anyOf(a, b, c).join();'],
['x','Usar thenApply donde tocaba thenCompose deja un CompletableFuture dentro de otro, con el tipo anidado. Es exactamente el mismo error que usar map en vez de flatMap, y el examen lo plantea preguntando por el tipo del resultado.'],
['p','Cada método tiene su variante terminada en Async, que ejecuta ese paso en otro hilo del pool en vez de en el que completó la etapa anterior. Y todas admiten pasar un Executor propio como último argumento, cosa muy recomendable para no saturar el pool común.'],
['c','cf.thenApplyAsync(s -> caro(s), miExecutor);'],
['p','Para los errores hay tres herramientas. exceptionally solo actúa si hubo fallo y aporta un valor de repuesto. handle se ejecuta siempre y recibe el resultado y la excepción, uno de los dos en null. whenComplete también se ejecuta siempre pero no puede cambiar el resultado.'],
['c','CompletableFuture.supplyAsync(() -> { throw new RuntimeException("uy"); })\n    .exceptionally(e -> "valor por defecto")\n    .thenAccept(System.out::println);   // valor por defecto'],
['x','get() lanza las excepciones comprobadas InterruptedException y ExecutionException, mientras que join() lanza la no comprobada CompletionException. Por eso join encaja dentro de una lambda y get obliga a un try-catch. En ambos casos la excepción original va dentro, y se saca con getCause().']
],

'conc:6':[
['p','Un stream paralelo reparte los elementos entre los hilos del pool común de ForkJoin, cuyo tamaño por defecto es el número de núcleos menos uno, más el hilo que llama. Se activa con parallelStream() sobre una colección o con parallel() sobre un stream ya montado.'],
['c','List<Integer> l = IntStream.rangeClosed(1, 1_000_000).boxed().toList();\n\nlong s = l.parallelStream().mapToLong(Integer::longValue).sum();'],
['p','Para que el resultado sea correcto la reducción debe ser asociativa: agrupar los operandos de otra forma tiene que dar lo mismo. La suma, el producto, el máximo y la concatenación lo son. La resta y la división no, y en paralelo dan resultados distintos en cada ejecución.'],
['c','// asociativa: siempre 55\nStream.iterate(1, n -> n + 1).limit(10).parallel().reduce(0, Integer::sum);\n\n// NO asociativa: resultado impredecible en paralelo\n....parallel().reduce(0, (a, b) -> a - b);'],
['x','La identidad debe ser un neutro real. En paralelo el valor de identidad se usa una vez por cada trozo en que se parte el trabajo, así que si pones un 1 en una suma no te sobra uno: te sobran tantos como trozos, y el resultado cambia según el número de núcleos.'],
['x','Las lambdas deben ser sin estado y sin efectos secundarios. Escribir en una lista o en una variable de fuera desde un stream paralelo produce datos corruptos o pérdidas silenciosas. Lo correcto es terminar con collect o toList, que ya saben combinar resultados parciales.'],
['p','Cuándo compensa: con muchos elementos, con operaciones costosas por elemento y con fuentes que se parten bien, como un ArrayList o un array o un rango de IntStream. Cuándo no: con pocos datos, con operaciones triviales, o con fuentes que se parten mal como LinkedList, Files.lines o Stream.iterate.'],
['x','Las operaciones que respetan el orden cuestan caro en paralelo. findFirst, limit, skip y forEachOrdered obligan a coordinar; findAny y forEach son más baratas justo porque no prometen orden. Y sorted en paralelo tiene que juntarlo todo igualmente.'],
['p','Para agrupar en paralelo existe groupingByConcurrent, que escribe directamente sobre un mapa concurrente compartido en vez de crear mapas parciales y fundirlos. Solo merece la pena en paralelo y cuando no importa el orden de encuentro.']
],

/* ══════════════ ENTRADA / SALIDA ══════════════ */

'io:0':[
['p','La API clásica se divide en dos familias según la unidad de trabajo. Para bytes están InputStream y OutputStream, y sus clases terminan en Stream. Para caracteres están Reader y Writer, y sus clases terminan en Reader o Writer. Reconocer la familia por el nombre resuelve muchas preguntas de un vistazo.'],
['c','// bytes: imágenes, archivos binarios\nInputStream  in  = new FileInputStream("foto.png");\nOutputStream out = new FileOutputStream("copia.png");\n\n// caracteres: texto, respeta la codificación\nReader r = new FileReader("texto.txt");\nWriter w = new FileWriter("salida.txt");'],
['p','El diseño se basa en decorar: una clase de bajo nivel habla con la fuente real y se envuelve en otras que le añaden capacidades. BufferedReader añade un búfer y el método readLine. PrintWriter añade println y printf. ObjectOutputStream añade la escritura de objetos.'],
['c','try (BufferedReader br = new BufferedReader(new FileReader("a.txt"))) {\n    String linea;\n    while ((linea = br.readLine()) != null)\n        System.out.println(linea);\n}'],
['x','readLine() devuelve null al llegar al final, mientras que read() devuelve -1. Confundirlos hace que el bucle no termine nunca o que termine antes de tiempo, y es una pregunta habitual. Además readLine() no incluye el salto de línea en lo que devuelve.'],
['p','Las clases puente convierten entre las dos familias. InputStreamReader envuelve un flujo de bytes y lo presenta como caracteres, y OutputStreamWriter hace lo contrario. Ahí es donde se indica la codificación: si no la pones, se usa la del sistema, que puede cambiar de una máquina a otra.'],
['c','try (BufferedReader br = new BufferedReader(\n         new InputStreamReader(new FileInputStream("a.txt"), StandardCharsets.UTF_8))) {\n    // ...\n}'],
['p','Sin búfer, cada lectura o escritura viaja al disco: envolver en Buffered mejora el rendimiento en órdenes de magnitud. El precio es que lo escrito se queda en memoria hasta que se llena el búfer, se llama a flush o se cierra el flujo.'],
['x','Si no cierras un flujo de escritura, los últimos datos pueden no llegar nunca al archivo. close() hace flush por dentro, así que un try-with-resources basta. El fallo típico es escribir, no cerrar y luego no entender por qué el archivo aparece vacío o truncado.'],
['x','Al encadenar decoradores, cerrar el de fuera cierra toda la cadena: no hay que cerrar cada uno por separado, y hacerlo puede provocar errores. En un try-with-resources basta con declarar el envoltorio más externo.'],
['p','Las clases File y FileReader son la API antigua. Siguen en el examen, pero para trabajo nuevo la recomendación es NIO.2 con Path y Files, que da mejores mensajes de error, más operaciones y trabajo con atributos.']
],

'io:1':[
['p','La clase System expone tres flujos estándar: System.in es un InputStream para la entrada, System.out un PrintStream para la salida normal y System.err otro PrintStream para los errores. Los tres se pueden redirigir con setIn, setOut y setErr.'],
['c','// leer de teclado con la API clásica\ntry (BufferedReader br = new BufferedReader(new InputStreamReader(System.in))) {\n    String linea = br.readLine();\n}\n\n// o con Scanner, más cómodo\nScanner sc = new Scanner(System.in);\nString s = sc.nextLine();\nint n = sc.nextInt();'],
['x','System.out y System.err van a destinos distintos y se vacían de forma distinta: err no tiene búfer y out sí. Por eso, al mezclarlos, los mensajes pueden aparecer desordenados en la consola aunque el código los emita en orden. El examen enseña una salida entremezclada y pregunta por qué.'],
['p','La clase Console ofrece una interfaz más específica, con readLine y sobre todo readPassword, que no muestra lo que se teclea y devuelve un array de caracteres en vez de un String, para poder borrarlo de memoria después.'],
['c','Console c = System.console();\nif (c != null) {\n    String usuario = c.readLine("Usuario: ");\n    char[] clave  = c.readPassword("Clave: ");\n    c.printf("Hola %s%n", usuario);\n    java.util.Arrays.fill(clave, \' \');   // borrar de memoria\n}'],
['x','System.console() devuelve null cuando no hay consola de verdad, lo que ocurre al ejecutar desde muchos entornos de desarrollo o con la entrada redirigida. Usarlo sin comprobar el null provoca NullPointerException, y esa comprobación es justo lo que preguntan.'],
['p','PrintWriter y PrintStream comparten los métodos print, println, printf y format. Su rasgo más particular es que no lanzan IOException: se tragan los errores y los dejan consultables con checkError(). Eso los hace cómodos pero poco fiables para detectar fallos.'],
['c','PrintWriter pw = new PrintWriter(System.out, true);   // true: autoflush\npw.printf("%s tiene %d años%n", "Ana", 30);\npw.printf("%.2f%n", 3.14159);        // 3,14 con locale español\npw.printf("%-10s|%n", "izq");        // alineado a la izquierda\npw.printf("%05d%n", 42);             // 00042'],
['x','En printf, %n produce el salto de línea propio del sistema y es lo recomendable, mientras que \\n produce siempre el carácter de avance. Y el conversor debe casar con el tipo: pasar un entero a %f o un decimal a %d lanza IllegalFormatConversionException en tiempo de ejecución.']
],

'io:2':[
['p','Path sustituye a File y representa una ruta, que puede existir o no en el disco. Se crea con Path.of, o con Paths.get, que es la forma antigua y ahora simplemente llama a la primera. Admite pasar los segmentos por separado.'],
['c','Path a = Path.of("/datos/informes/marzo.txt");\nPath b = Path.of("/datos", "informes", "marzo.txt");   // igual que a\nPath c = Path.of("informes/marzo.txt");                // relativa'],
['x','Lo más importante de todo el tema: los métodos de Path son puramente sintácticos. Trabajan con el texto de la ruta y NO tocan el disco. Ni comprueban si el archivo existe, ni siguen enlaces, ni fallan por rutas imposibles. Quien accede de verdad al sistema de archivos es la clase Files.'],
['p','Los métodos de consulta descomponen la ruta. getFileName da el último segmento, getParent la ruta sin él (o null si no hay), getRoot la raíz (o null en una ruta relativa), getNameCount cuenta los segmentos y getName(i) devuelve uno concreto.'],
['c','Path p = Path.of("/datos/informes/marzo.txt");\np.getFileName();     // marzo.txt\np.getParent();       // /datos/informes\np.getRoot();         // /\np.getNameCount();    // 3\np.getName(0);        // datos\np.subpath(0, 2);     // datos/informes'],
['x','La raíz no cuenta como segmento: en /datos/informes/marzo.txt hay tres nombres, no cuatro, y getName(0) es datos, no la barra. Además subpath y getName devuelven siempre rutas RELATIVAS, sin la raíz, por más que la ruta original fuese absoluta. Y en subpath el índice final es exclusivo.'],
['p','resolve concatena: pega el argumento al final de la ruta. La regla que hay que memorizar es qué pasa cuando el argumento es absoluto: entonces resolve descarta por completo la ruta de partida y devuelve el argumento tal cual.'],
['c','Path base = Path.of("/datos/informes");\nbase.resolve("marzo.txt");        // /datos/informes/marzo.txt\nbase.resolve("/otro/sitio.txt");  // /otro/sitio.txt  <- se descarta la base\n\n// resolveSibling reemplaza el último segmento\nPath f = Path.of("/datos/a.txt");\nf.resolveSibling("b.txt");        // /datos/b.txt'],
['p','relativize hace lo contrario: calcula cómo llegar de una ruta a otra, usando dos puntos para subir. Su restricción es estricta: las dos rutas deben ser del mismo tipo, ambas absolutas o ambas relativas. Mezclarlas lanza IllegalArgumentException.'],
['c','Path a = Path.of("/datos/informes");\nPath b = Path.of("/datos/copias/marzo.txt");\na.relativize(b);       // ../copias/marzo.txt\n\n// a.relativize(Path.of("relativa/x"));   IllegalArgumentException'],
['p','normalize limpia la ruta eliminando los puntos redundantes y resolviendo los dobles puntos en el propio texto. Es la operación que conviene aplicar después de un resolve para dejar la ruta presentable, y sigue sin tocar el disco.'],
['c','Path.of("/datos/./informes/../copias").normalize();   // /datos/copias'],
['x','toRealPath() sí accede al disco: resuelve enlaces simbólicos, normaliza y exige que el archivo exista, lanzando IOException si no. No confundirlo con toAbsolutePath(), que solo antepone el directorio actual y nunca falla ni comprueba nada.']
],

'io:3':[
['p','Files es la clase de utilidad que sí actúa sobre el disco. Casi todos sus métodos son estáticos, reciben un Path y lanzan IOException, que es comprobada. Las comprobaciones básicas son exists, notExists, isDirectory, isRegularFile y isReadable.'],
['c','Path p = Path.of("datos.txt");\nFiles.exists(p);\nFiles.isDirectory(p);\nFiles.size(p);              // bytes, IOException si no existe\nFiles.isSameFile(p, otro);  // compara archivos reales, no texto'],
['x','exists y notExists no son estrictamente opuestos: las dos pueden devolver false a la vez si no hay permisos para averiguarlo. Es un detalle que aparece en preguntas de opción múltiple.'],
['p','Para crear: createFile crea un archivo vacío, createDirectory crea un directorio cuyo padre ya debe existir, y createDirectories crea toda la cadena de padres que falte y no protesta si ya existen.'],
['c','Files.createDirectories(Path.of("a/b/c"));   // crea a, b y c\nFiles.createDirectory(Path.of("a/b/c"));     // falla si a/b no existe\nFiles.createFile(Path.of("a/b/c/x.txt"));    // FileAlreadyExistsException si ya está'],
['p','Para leer y escribir texto, lo más directo son readString y writeString, y para líneas, readAllLines, que lo carga todo en una lista, frente a lines, que devuelve un stream perezoso y no carga el archivo entero en memoria.'],
['c','String todo = Files.readString(p);\nList<String> ls = Files.readAllLines(p);\nFiles.writeString(p, "hola", StandardOpenOption.APPEND);\n\ntry (Stream<String> s = Files.lines(p)) {      // hay que cerrarlo\n    s.filter(l -> l.contains("error")).forEach(System.out::println);\n}'],
['x','Los métodos de Files que devuelven un Stream (lines, walk, list, find) mantienen abierto un recurso del sistema y DEBEN cerrarse con try-with-resources. readAllLines no, porque lee todo y cierra sola. Esta diferencia es materia segura de examen.'],
['p','Para copiar, mover y borrar: copy admite REPLACE_EXISTING y COPY_ATTRIBUTES; move añade ATOMIC_MOVE; delete lanza NoSuchFileException si no existe, mientras que deleteIfExists devuelve un boolean y no protesta.'],
['c','Files.copy(a, b, StandardCopyOption.REPLACE_EXISTING);\nFiles.move(a, b, StandardCopyOption.ATOMIC_MOVE);\nFiles.delete(p);            // NoSuchFileException si no está\nFiles.deleteIfExists(p);    // false si no estaba'],
['x','Borrar un directorio con delete exige que esté vacío: si no, lanza DirectoryNotEmptyException. No existe un borrado recursivo en Files, hay que recorrerlo con walk en orden inverso y borrar de dentro afuera.'],
['p','Para recorrer árboles: list da solo el contenido directo de un directorio, walk baja recursivamente con una profundidad máxima opcional, y find es como walk pero filtrando con un predicado que recibe la ruta y sus atributos.'],
['c','try (Stream<Path> s = Files.walk(Path.of("proyecto"), 2)) {\n    s.filter(Files::isRegularFile)\n     .filter(x -> x.toString().endsWith(".java"))\n     .forEach(System.out::println);\n}\n\ntry (Stream<Path> s = Files.find(raiz, 5,\n        (ruta, attr) -> attr.size() > 1_000_000)) {\n    s.forEach(System.out::println);\n}'],
['x','walk no sigue enlaces simbólicos salvo que se lo pidas con FileVisitOption.FOLLOW_LINKS, y si lo haces puede entrar en un ciclo y lanzar FileSystemLoopException. Además el primer elemento que devuelve walk es el propio directorio de partida, no su contenido.']
],

'io:4':[
['p','Consultar los atributos uno a uno con Files.isDirectory, Files.size o Files.getLastModifiedTime supone un viaje al disco por cada llamada. Cuando necesitas varios, sale mucho más a cuenta leerlos todos de golpe en un objeto de atributos.'],
['c','BasicFileAttributes a = Files.readAttributes(p, BasicFileAttributes.class);\n\na.isDirectory();\na.isRegularFile();\na.isSymbolicLink();\na.isOther();\na.size();\na.creationTime();\na.lastModifiedTime();\na.lastAccessTime();'],
['p','BasicFileAttributes es la vista común a cualquier sistema. Hay vistas especializadas: DosFileAttributes añade los indicadores de solo lectura, oculto, sistema y archivo; PosixFileAttributes añade propietario, grupo y permisos. Usar una vista que el sistema no soporta lanza UnsupportedOperationException.'],
['p','Para modificar atributos existe Files.getFileAttributeView, que devuelve una vista con métodos de escritura, mientras que readAttributes devuelve solo lectura. Es la diferencia que hay que tener clara entre las dos familias.'],
['c','BasicFileAttributeView v = Files.getFileAttributeView(p, BasicFileAttributeView.class);\nv.setTimes(FileTime.fromMillis(System.currentTimeMillis()), null, null);\n// los null dejan ese tiempo sin cambiar'],
['p','Las opciones de apertura son StandardOpenOption y deciden cómo se abre un archivo para escribir. CREATE lo crea si no existe; CREATE_NEW lo crea y falla si ya existe; APPEND añade al final; TRUNCATE_EXISTING lo vacía; READ y WRITE fijan el modo; DELETE_ON_CLOSE lo borra al cerrar.'],
['c','Files.writeString(p, "linea\\n",\n    StandardOpenOption.CREATE,\n    StandardOpenOption.APPEND);\n\ntry (BufferedWriter w = Files.newBufferedWriter(p,\n        StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {\n    w.write("nuevo contenido");\n}'],
['x','Por defecto, escribir sin indicar opciones equivale a CREATE, TRUNCATE_EXISTING y WRITE: es decir, machaca el contenido anterior. Si querías añadir y no pusiste APPEND, te has cargado el archivo. Y combinar APPEND con TRUNCATE_EXISTING lanza IllegalArgumentException porque se contradicen.'],
['p','Las opciones de copia son StandardCopyOption: REPLACE_EXISTING para sobrescribir el destino, COPY_ATTRIBUTES para llevarse las marcas de tiempo, y ATOMIC_MOVE, que solo vale para move y garantiza que la operación ocurre entera o no ocurre.'],
['x','Sin REPLACE_EXISTING, copiar sobre un archivo que ya existe lanza FileAlreadyExistsException. Y ATOMIC_MOVE puede lanzar AtomicMoveNotSupportedException si origen y destino están en sistemas de archivos distintos.'],
['x','LinkOption.NOFOLLOW_LINKS aparece como argumento final en muchos métodos y cambia el resultado: sin él, las consultas siguen el enlace y describen el destino; con él, describen el propio enlace. Por eso Files.isDirectory de un enlace a una carpeta puede devolver true o false según se lo pases.']
],

'io:5':[
['p','Serializar es convertir un objeto en una secuencia de bytes para guardarlo o enviarlo. Para que una clase pueda serializarse debe implementar Serializable, que es una interfaz marcadora: no tiene ningún método, solo señala la intención.'],
['c','public class Cliente implements Serializable {\n    private static final long serialVersionUID = 1L;\n    private String nombre;\n    private transient String claveTemporal;   // NO se guarda\n    private static int contador;              // tampoco: es estático\n}'],
['c','// escribir\ntry (ObjectOutputStream o = new ObjectOutputStream(\n         Files.newOutputStream(Path.of("c.dat")))) {\n    o.writeObject(cliente);\n}\n\n// leer\ntry (ObjectInputStream i = new ObjectInputStream(\n         Files.newInputStream(Path.of("c.dat")))) {\n    Cliente c = (Cliente) i.readObject();   // lanza ClassNotFoundException\n}'],
['p','Todo lo que cuelgue del objeto debe ser serializable también. Si un campo apunta a una clase que no lo es, la escritura falla con NotSerializableException en tiempo de ejecución, no al compilar. Se arregla marcando ese campo como transient o haciendo serializable la otra clase.'],
['x','Los campos transient y los static no se guardan. Al recuperar el objeto, los transient quedan con el valor por defecto de su tipo: null para referencias, 0 para números y false para boolean. NO conservan el valor que tenían, y esa es la pregunta más repetida del tema.'],
['p','serialVersionUID identifica la versión de la clase. Si no lo declaras, el compilador genera uno a partir de la estructura, y cualquier cambio en los campos o métodos lo cambia, con lo que los archivos antiguos dejan de poder leerse y salta InvalidClassException. Declararlo a mano evita ese problema.'],
['x','Al deserializar NO se llama al constructor de la clase serializable: los campos se rellenan directamente desde los bytes. Lo que sí se ejecuta es el constructor sin argumentos del primer ancestro NO serializable de la jerarquía. Si ese ancestro no tiene constructor sin argumentos accesible, la deserialización falla.'],
['c','class Base {                 // NO serializable\n    int x = 5;\n    Base() { x = 5; System.out.println("constructor de Base"); }\n}\nclass Hija extends Base implements Serializable {\n    int y = 10;\n    Hija() { y = 10; System.out.println("constructor de Hija"); }\n}\n// al deserializar una Hija:\n//   se imprime "constructor de Base" y x vale 5\n//   NO se imprime lo de Hija; y toma el valor guardado en el archivo'],
['x','Los inicializadores de campo tampoco se ejecutan al deserializar. Si un campo se declara con un valor por defecto y estaba marcado como transient, no recupera ese valor: se queda en null o en cero. Para arreglarlo se implementa readObject o readResolve.'],
['p','La serialización nativa de Java se considera hoy problemática por seguridad, porque deserializar datos que no controlas puede ejecutar código. Existen filtros con ObjectInputFilter para limitar qué clases se aceptan, y en aplicaciones nuevas se prefieren formatos como JSON.']
],

/* ══════════════ LOCALIZACIÓN ══════════════ */

'l10n:0':[
['p','Un Locale identifica una combinación de idioma y región, y es lo que determina cómo se escriben números, fechas y monedas. El formato es idioma en minúsculas y, opcionalmente, país en mayúsculas: es en español a secas, es_ES para España y es_MX para México.'],
['c','Locale.getDefault();            // el del sistema\nLocale.of("es");                // solo idioma\nLocale.of("es", "ES");          // idioma y país\nLocale.forLanguageTag("es-MX"); // con guión, formato de etiqueta\n\nLocale.US; Locale.FRANCE; Locale.GERMANY;   // constantes ya hechas\n\nnew Locale.Builder().setLanguage("es").setRegion("AR").build();'],
['x','Los constructores new Locale(...) están obsoletos desde Java 19: lo correcto en Java 21 es el método de fábrica Locale.of. Y ojo al formato de forLanguageTag, que usa guión (es-MX) mientras que la representación interna usa guión bajo (es_MX).'],
['p','El orden de idioma y país no es negociable: primero el idioma, siempre presente y en minúsculas; después el país, opcional y en mayúsculas. Un Locale con solo país no tiene sentido. getLanguage, getCountry y getDisplayLanguage permiten consultarlos.'],
['p','La particularidad que más cae es que el locale por defecto está dividido en dos categorías independientes. DISPLAY afecta a los textos que se muestran al usuario, como los nombres de los meses. FORMAT afecta a cómo se formatean números y fechas. Se pueden fijar por separado.'],
['c','Locale.setDefault(Locale.US);                          // cambia las dos\nLocale.setDefault(Locale.Category.FORMAT, Locale.FRANCE);\nLocale.getDefault(Locale.Category.DISPLAY);            // sigue siendo US'],
['x','Casi todos los métodos de formato tienen una versión sin locale que usa el que haya por defecto. Eso hace que el mismo código dé resultados distintos en máquinas distintas: en España 1.234,56 y en Estados Unidos 1,234.56. El examen enseña una salida y pregunta con qué locale se obtuvo.'],
['p','Cuando pides un locale que no existe, Java no falla: busca el más parecido y termina cayendo en el por defecto. Ese comportamiento de respaldo es la base de todo el sistema de traducciones.']
],

'l10n:1':[
['p','Un ResourceBundle es un diccionario de textos separado por idioma, para que traducir la aplicación no obligue a tocar el código. Lo más habitual es tenerlo en archivos .properties con pares de clave y valor.'],
['c','// Mensajes.properties          (base, sin idioma)\nsaludo=Hello\ndespedida=Goodbye\n\n// Mensajes_es.properties\nsaludo=Hola\ndespedida=Adiós\n\n// Mensajes_es_MX.properties\nsaludo=Qué onda'],
['c','ResourceBundle b = ResourceBundle.getBundle("Mensajes", Locale.of("es", "MX"));\nSystem.out.println(b.getString("saludo"));     // Qué onda\nSystem.out.println(b.getString("despedida"));  // Adiós, heredado del padre\n\nb.keySet().forEach(System.out::println);'],
['p','El convenio de nombres es rígido: nombre base, guión bajo, idioma, guión bajo, país. Y la búsqueda va de lo más específico a lo más general, quitando una pieza cada vez. Para Mensajes con es_MX el orden es: Mensajes_es_MX, luego Mensajes_es, luego el locale por DEFECTO con sus dos pasos, y por último Mensajes a secas.'],
['c','// pedido: es_MX, con locale por defecto en_US\n1. Mensajes_es_MX\n2. Mensajes_es\n3. Mensajes_en_US      <- entra el locale por defecto\n4. Mensajes_en\n5. Mensajes            <- el bundle base\n   si tampoco está: MissingResourceException'],
['x','Una vez encontrado el bundle, las claves que le falten se buscan subiendo por SU cadena de padres, que va de Mensajes_es_MX a Mensajes_es y de ahí a Mensajes. Esa cadena ya no vuelve a pasar por el locale por defecto. Es la distinción fina entre elegir bundle y resolver una clave, y el examen la explota.'],
['x','Por eso una práctica sana es que el archivo base tenga TODAS las claves: así ninguna búsqueda termina en MissingResourceException, que es una excepción no comprobada y por tanto no avisa al compilar.'],
['p','En los archivos .properties el separador puede ser el igual, los dos puntos o un espacio, y todos valen. Las líneas que empiezan por almohadilla o por admiración son comentarios. Una barra invertida al final continúa el valor en la línea siguiente.'],
['x','getString devuelve String y lanza ClassCastException si el valor no lo es; para otros tipos está getObject. Y getBundle acepta también un Control o un ClassLoader, pero lo que se pregunta es siempre el orden de búsqueda.']
],

'l10n:2':[
['p','Hay dos formas de escribir un bundle. La de archivo .properties, que es texto plano y solo admite cadenas, y la de clase Java heredando de ListResourceBundle, que permite guardar objetos de cualquier tipo y calcularlos en código.'],
['c','public class Mensajes_fr extends ListResourceBundle {\n    @Override\n    protected Object[][] getContents() {\n        return new Object[][] {\n            { "saludo", "Bonjour" },\n            { "maximo", 100 },                    // un entero, no una cadena\n            { "colores", new String[]{"bleu", "rouge"} }\n        };\n    }\n}'],
['x','La regla de precedencia es la que preguntan: para un mismo nombre candidato, la CLASE gana al archivo .properties. Si existen a la vez Mensajes_fr.class y Mensajes_fr.properties, se usa la clase y el archivo se ignora por completo.'],
['x','Pero la precedencia se aplica candidato a candidato, no globalmente. Java recorre la lista de candidatos de más específico a más general y, en cada escalón, mira primero la clase y después el .properties. Así que un Mensajes_fr.properties SÍ gana a un Mensajes.class, porque va antes en la lista.'],
['c','// existen: Mensajes_fr.properties  y  Mensajes.class\n// se pide: Locale.FRANCE\n// 1. Mensajes_fr.class       no existe\n// 2. Mensajes_fr.properties  ENCONTRADO -> se usa este'],
['p','Cuándo usar cada uno: los .properties son lo normal, porque los puede editar un traductor sin tocar código ni recompilar. La clase se reserva para cuando necesitas valores que no son texto, o construirlos en tiempo de ejecución.'],
['x','La clase debe ser pública y tener constructor público sin argumentos para que ResourceBundle pueda instanciarla. Si es de paquete o no tiene ese constructor, no se encuentra y se sigue buscando como si no existiera.'],
['p','Existe también PropertyResourceBundle, que es la clase que Java usa por dentro para leer los .properties, y que puedes instanciar tú directamente pasándole un Reader si necesitas cargar traducciones desde un sitio que no sea el classpath.']
],

'l10n:3':[
['p','NumberFormat da formato a números según el locale, y es una fábrica: no se instancia con new, sino con sus métodos estáticos. Cada uno tiene una versión sin argumentos, que usa el locale por defecto, y otra que recibe el locale.'],
['c','double n = 1234567.891;\n\nNumberFormat.getInstance(Locale.of("es","ES")).format(n);   // 1.234.567,891\nNumberFormat.getInstance(Locale.US).format(n);             // 1,234,567.891\nNumberFormat.getCurrencyInstance(Locale.of("es","ES")).format(n);\nNumberFormat.getPercentInstance(Locale.US).format(0.25);   // 25%\nNumberFormat.getIntegerInstance().format(n);'],
['x','Fíjate en el intercambio de separadores: donde el español pone el punto de millares, el inglés pone la coma, y al revés con los decimales. Es la trampa visual más socorrida del tema, porque 1.234 significa mil doscientos treinta y cuatro en un sitio y uno coma doscientos treinta y cuatro en el otro.'],
['x','getPercentInstance MULTIPLICA por cien: al formatear 0.25 sale 25%, y al formatear 25 sale 2.500%. Olvidarlo es un fallo garantizado.'],
['p','getCompactNumberInstance, de Java 12, escribe los números de forma abreviada. Recibe el locale y un estilo, SHORT o LONG, y produce cosas como 1K o 1 thousand.'],
['c','NumberFormat c = NumberFormat.getCompactNumberInstance(\n        Locale.US, NumberFormat.Style.SHORT);\nc.format(1000);        // 1K\nc.format(1_000_000);   // 1M\n\nNumberFormat l = NumberFormat.getCompactNumberInstance(\n        Locale.US, NumberFormat.Style.LONG);\nl.format(1000);        // 1 thousand'],
['p','El camino inverso es parse, que lee una cadena y devuelve un Number. Lanza ParseException, que es comprobada, así que obliga a un try-catch o a declararla. Y para el redondeo y los decimales están setMaximumFractionDigits y setMinimumFractionDigits.'],
['c','NumberFormat f = NumberFormat.getInstance(Locale.of("es","ES"));\nNumber x = f.parse("1.234,5");    // ParseException\nf.setMaximumFractionDigits(2);\nf.format(3.14159);                // 3,14'],
['x','parse se detiene en el primer carácter que no encaja y devuelve lo leído hasta ahí, sin quejarse. Al analizar "12abc" devuelve 12 en vez de fallar. Solo lanza ParseException cuando no consigue leer ni siquiera el principio.'],
['p','DecimalFormat permite definir el patrón a mano: el cero obliga a mostrar un dígito, rellenando con ceros, y la almohadilla lo muestra solo si existe. Con la coma se marca la agrupación y con el punto los decimales, siempre en el patrón, que luego se traduce al locale.'],
['c','new DecimalFormat("###,###.0#").format(3456.789);   // 3.456,79 en es_ES\nnew DecimalFormat("000.000").format(3.1);            // 003,100\nnew DecimalFormat("$#,##0.00").format(1234.5);       // $1.234,50']
],

'l10n:4':[
['p','Para fechas la clase es DateTimeFormatter, del paquete java.time. Tiene dos familias: los formatos predefinidos y localizados, que se adaptan al locale, y los patrones a medida con ofPattern, que producen siempre lo mismo.'],
['c','LocalDate d = LocalDate.of(2026, 3, 15);\n\nDateTimeFormatter f = DateTimeFormatter\n        .ofLocalizedDate(FormatStyle.FULL)\n        .withLocale(Locale.of("es","ES"));\nSystem.out.println(d.format(f));   // domingo, 15 de marzo de 2026'],
['p','Los cuatro estilos de FormatStyle van de más a menos: FULL escribe el día de la semana y el mes completos, LONG el mes con nombre, MEDIUM lo abrevia y SHORT usa solo números. Hay tres fábricas: ofLocalizedDate, ofLocalizedTime y ofLocalizedDateTime, esta última con la opción de estilos distintos para fecha y hora.'],
['x','Aquí está la trampa más segura del tema: hay que casar el formateador con el tipo. Aplicar ofLocalizedTime a un LocalDate, que no tiene hora, lanza UnsupportedTemporalTypeException en tiempo de ejecución. Compila perfectamente. Un LocalDateTime, en cambio, sirve para las tres.'],
['c','LocalDate d = LocalDate.now();\nd.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT));   // bien\n// d.format(DateTimeFormatter.ofLocalizedTime(FormatStyle.SHORT));\n//    UnsupportedTemporalTypeException: Unsupported field: HourOfDay'],
['p','Con ofPattern se controla el resultado letra a letra. Las que hay que reconocer: y para el año, M para el mes, d para el día del mes, E para el día de la semana, H para la hora de 0 a 23, h para la de 1 a 12, m para los minutos, s para los segundos y a para la marca de mañana o tarde.'],
['c','DateTimeFormatter p = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");\nLocalDateTime.now().format(p);          // 15/03/2026 09:30\n\nDateTimeFormatter q = DateTimeFormatter\n        .ofPattern("EEEE, d \'de\' MMMM", Locale.of("es","ES"));\nLocalDate.of(2026,3,15).format(q);      // domingo, 15 de marzo'],
['x','Cuidado con las mayúsculas: M mayúscula es el mes y m minúscula son los minutos; H mayúscula va de 0 a 23 y h minúscula de 1 a 12. Y el número de letras repetidas cambia la forma: MM da 03, MMM da mar y MMMM da marzo. El texto literal se encierra entre comillas simples.'],
['p','El formateo se puede pedir desde los dos lados y el resultado es idéntico: fecha.format(formateador) o formateador.format(fecha). Para el camino inverso está parse, que es estático en cada clase de fecha y lanza DateTimeParseException.'],
['c','LocalDate.parse("2026-03-15");                    // formato ISO, sin formateador\nLocalDate.parse("15/03/2026",\n        DateTimeFormatter.ofPattern("dd/MM/yyyy"));\n// LocalDate.parse("15/03/2026");   DateTimeParseException'],
['x','withLocale devuelve un formateador NUEVO y no modifica el original, porque los formateadores son inmutables. Escribir f.withLocale(...) sin recoger el resultado no hace absolutamente nada, que es la misma trampa de los métodos de String.']
],

'l10n:5':[
['p','MessageFormat compone mensajes con huecos numerados, y existe porque concatenar cadenas no se puede traducir: el orden de las palabras cambia de un idioma a otro y una frase montada a trozos queda mal en cuanto sales del original.'],
['c','String plantilla = "El usuario {0} tiene {1} mensajes nuevos";\nString s = MessageFormat.format(plantilla, "Ana", 5);\n// El usuario Ana tiene 5 mensajes nuevos'],
['p','Los marcadores se numeran desde cero y se pueden repetir y reordenar libremente. Eso es justo lo que permite que cada idioma coloque los datos donde le convenga sin tocar el código.'],
['c','// es.properties\naviso=Hola {0}, te quedan {1} días\n// en.properties  (orden distinto, mismos datos)\naviso={1} days left, {0}\n\nMessageFormat.format(bundle.getString("aviso"), "Ana", 3);'],
['p','El marcador admite un segundo elemento con el tipo de formato y un tercero con el estilo: number con integer, currency o percent; date y time con short, medium, long o full; y choice para elegir según el valor.'],
['c','MessageFormat.format("Total: {0,number,currency}", 1234.5);\nMessageFormat.format("Fecha: {0,date,long}", new java.util.Date());\nMessageFormat.format("Va el {0,number,percent}", 0.75);'],
['x','La comilla simple es un carácter de escape dentro de MessageFormat, y ahí se cae mucho. Una comilla suelta desactiva el marcador siguiente, y para escribir una comilla literal hay que duplicarla. En español, con palabras como el apóstrofo, esto muerde de verdad.'],
['c','MessageFormat.format("no cambia {0}", "X");     // no cambia X\nMessageFormat.format("\'{0}\' literal", "X");     // {0} literal  <- no sustituye\nMessageFormat.format("dos \'\' comillas {0}", "X"); // dos \' comillas X'],
['x','MessageFormat aplica el formato numérico del locale por defecto salvo que le pases otro al constructor. Así que un {0} con el número 1234 sale como 1.234 en España y 1,234 en Estados Unidos, aunque tú no hayas pedido ningún formato.'],
['p','Para una instancia reutilizable se usa el constructor con new MessageFormat(patron, locale) y luego el método format, en vez del estático. Es lo indicado cuando el mismo mensaje se compone muchas veces o cuando hay que fijar el locale explícitamente.']
]

};
