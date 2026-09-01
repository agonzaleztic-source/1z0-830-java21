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
]

};
