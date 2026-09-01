/* ---------------- banco de preguntas ---------------- */
const Q = [
/* ---- tipos ---- */
{id:'t1',a:'tipos',p:'¿Qué imprime?',c:`String s = "Java";
s.concat(" 21");
System.out.println(s);`,
 o:['Java','Java 21','Cadena vacía','No compila'],k:[0],
 e:'String es inmutable. concat() devuelve una cadena nueva que aquí se descarta porque no se asigna a nada. La referencia s sigue apuntando al literal original.'},

{id:'t2',a:'tipos',p:'¿Cuál es el valor final de i?',c:`int i = 10;
i = i++ + ++i;
System.out.println(i);`,
 o:['20','21','22','23'],k:[2],
 e:'i++ se evalúa como 10 y deja i en 11. Después ++i incrementa a 12 y se evalúa como 12. La suma es 10 + 12 = 22, y esa asignación pisa el valor 12.'},

{id:'t3',a:'tipos',p:'¿Qué imprime?',c:`byte b = 10;
b += 300;
System.out.println(b);`,
 o:['310','54','No compila: pérdida de precisión','Lanza ArithmeticException'],k:[1],
 e:'Los operadores de asignación compuesta llevan un cast implícito, así que compila. 310 truncado a 8 bits deja 0x36, es decir 54. Con b = b + 300 sí habría error de compilación.'},

{id:'t4',a:'tipos',p:'¿Qué imprime?',c:`Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println((a == b) + " " + (c == d));`,
 o:['true true','true false','false false','false true'],k:[1],
 e:'La caché de Integer reutiliza las instancias entre -128 y 127, de modo que a y b son el mismo objeto. 128 queda fuera de la caché y se crean dos objetos distintos. Con equals() ambas comparaciones darían true.'},

{id:'t5',a:'tipos',p:'¿Cuántas líneas cuenta?',c:`String t = """
    hola
      mundo
    """;
System.out.print(t.lines().count());`,
 o:['1','2','3','4'],k:[1],
 e:'El delimitador de cierre marca la sangría incidental, que se elimina de todas las líneas. Quedan "hola" y "  mundo": dos líneas. El salto final antes del cierre no genera una tercera.'},

{id:'t6',a:'tipos',p:'¿Qué imprime?',c:`LocalDate d = LocalDate.of(2026, 1, 31);
d.plusMonths(1);
System.out.println(d.plusMonths(1));`,
 o:['2026-01-31','2026-02-28','2026-03-03','2026-02-31'],k:[1],
 e:'Las clases de java.time son inmutables, así que la primera llamada no cambia nada. Al sumar un mes al 31 de enero, el día se ajusta al último válido de febrero, que en 2026 es el 28.'},

{id:'t7',a:'tipos',p:'¿Qué imprime?',c:`var d1 = LocalDate.of(2026, 1, 1);
var d2 = LocalDate.of(2026, 3, 15);
System.out.println(Period.between(d1, d2));`,
 o:['P73D','P2M14D','PT1776H','P0Y2M14D'],k:[1],
 e:'Period descompone la diferencia en años, meses y días, y su toString() omite los componentes que valen cero. Duration, en cambio, trabaja con tiempo y no acepta LocalDate.'},

/* ---- flujo ---- */
{id:'f1',a:'flujo',p:'¿Qué imprime?',c:`int x = 2;
switch (x) {
    case 1: System.out.print("uno");
    case 2: System.out.print("dos");
    case 3: System.out.print("tres"); break;
    default: System.out.print("otro");
}`,
 o:['dos','dostres','dostresotro','otro'],k:[1],
 e:'El switch con dos puntos cae de un caso al siguiente hasta encontrar un break. Entra por case 2, imprime "dos", cae en case 3 e imprime "tres", y ahí sí rompe. Con flechas no habría caída.'},

{id:'f2',a:'flujo',p:'¿Qué imprime?',c:`Object o = 42;
String s = switch (o) {
    case Integer i when i > 100 -> "grande";
    case Integer i -> "int " + i;
    case String str -> "cadena";
    default -> "otro";
};
System.out.println(s);`,
 o:['grande','int 42','otro','No compila'],k:[1],
 e:'La guarda when filtra el primer caso y 42 no la cumple. El segundo patrón Integer sí encaja. El orden importa: si el patrón sin guarda fuera primero, el compilador marcaría el otro como inalcanzable.'},

{id:'f3',a:'flujo',p:'¿Qué ocurre al ejecutar?',c:`String s = null;
switch (s) {
    case "a" -> System.out.println("a");
    default -> System.out.println("def");
}`,
 o:['Imprime def','Imprime a','Lanza NullPointerException','No compila'],k:[2],
 e:'Un switch sobre String desreferencia el selector y lanza NullPointerException con null. Solo evitas eso añadiendo un case null explícito, algo que Java 21 permite en los switch con patrones.'},

{id:'f4',a:'flujo',p:'¿Qué imprime?',c:`outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) continue outer;
        System.out.print(i + "" + j + " ");
    }
}`,
 o:['00 10 20','00 01 02','00','00 10 20 21 22'],k:[0],
 e:'continue con etiqueta salta a la siguiente iteración del bucle etiquetado, no del interior. Cada vuelta imprime solo j igual a 0 antes de abandonar el bucle interno.'},

{id:'f5',a:'flujo',p:'Con esta jerarquía sellada, ¿es obligatorio el default?',c:`sealed interface Forma permits Circulo, Cuadrado {}
record Circulo(double r) implements Forma {}
record Cuadrado(double l) implements Forma {}

double area(Forma f) {
    return switch (f) {
        case Circulo c -> Math.PI * c.r() * c.r();
        case Cuadrado q -> q.l() * q.l();
    };
}`,
 o:['Sí, sin default no compila','No: el switch ya es exhaustivo','Solo si Forma fuese una interfaz normal','No compila porque los records no valen en switch'],k:[1],
 e:'Al ser sellada, el compilador conoce todos los subtipos posibles y comprueba la exhaustividad. Añadir default aquí es legal pero innecesario, y además te ocultaría el error si algún día añadieras un tercer permits.'},

{id:'f6',a:'flujo',p:'¿Qué imprime?',c:`int i = 0;
do {
    i++;
} while (i < 0);
System.out.println(i);`,
 o:['0','1','Bucle infinito','No compila'],k:[1],
 e:'do-while evalúa la condición después del cuerpo, así que siempre ejecuta al menos una vuelta. i pasa a 1 y la condición falla de inmediato.'},

/* ---- poo ---- */
{id:'p1',a:'poo',p:'¿En qué orden se imprime al ejecutar new B()?',c:`class A {
    static { System.out.print("SA "); }
    { System.out.print("IA "); }
    A() { System.out.print("CA "); }
}
class B extends A {
    static { System.out.print("SB "); }
    { System.out.print("IB "); }
    B() { System.out.print("CB "); }
}`,
 o:['SA SB IA CA IB CB','SA IA CA SB IB CB','SB SA IA CA IB CB','IA IB CA CB SA SB'],k:[0],
 e:'Primero los bloques estáticos, una sola vez y de la superclase hacia abajo. Luego, por cada instancia, el bloque de instancia y el constructor de A, y después los de B.'},

{id:'p2',a:'poo',p:'¿Qué imprime?',c:`class P { static String id() { return "P"; } }
class H extends P { static String id() { return "H"; } }

P p = new H();
System.out.println(p.id());`,
 o:['P','H','No compila','Depende de la JVM'],k:[0],
 e:'Los métodos estáticos se ocultan, no se sobrescriben. La resolución es estática y depende del tipo declarado de la referencia, que aquí es P. Llamar a un estático desde una referencia es legal pero desaconsejable.'},

{id:'p3',a:'poo',p:'Un subtipo de una interfaz sellada, ¿qué debe declarar? (elige 3)',c:`public sealed interface Forma permits Circulo, Cuadrado, Triangulo {}`,
 o:['final','sealed','non-sealed','abstract'],k:[0,1,2],
 e:'Todo subtipo directo de un tipo sellado debe cerrar la jerarquía siendo final, continuarla siendo sealed con su propio permits, o reabrirla con non-sealed. abstract por sí solo no basta.'},

{id:'p4',a:'poo',p:'¿Qué es cierto sobre este record? (elige 2)',c:`record Punto(int x, int y) {
    Punto {
        if (x < 0) throw new IllegalArgumentException();
    }
}`,
 o:['El constructor compacto puede reasignar el parámetro x','Punto es implícitamente final y no puede extender otra clase','Puede implementar interfaces','equals() hay que escribirlo a mano'],k:[1,2],
 e:'Los records son finales, extienden implícitamente de Record y pueden implementar interfaces. equals, hashCode y toString se generan a partir de los componentes. El constructor compacto sí puede reasignar los parámetros antes de la asignación final, por eso esa opción también sería correcta en otro contexto, pero aquí lo pedido son las dos afirmaciones estructurales.'},

{id:'p5',a:'poo',p:'¿Qué imprime?',c:`interface Saluda {
    default String hola() { return "interfaz"; }
}
class Base {
    public String hola() { return "clase"; }
}
class C extends Base implements Saluda {}

System.out.println(new C().hola());`,
 o:['interfaz','clase','No compila por conflicto','Lanza excepción en tiempo de ejecución'],k:[1],
 e:'Cuando una clase y una interfaz aportan el mismo método, la clase gana siempre. Es la regla de que la clase tiene prioridad sobre el default de la interfaz, y por eso no hay ambigüedad que resolver.'},

{id:'p6',a:'poo',p:'¿Qué imprime?',c:`Object o = "texto";
if (o instanceof String s && s.length() > 3) {
    System.out.println(s.toUpperCase());
} else {
    System.out.println("no");
}`,
 o:['TEXTO','texto','no','No compila: s fuera de alcance'],k:[0],
 e:'La variable de patrón s está en alcance en la parte derecha del && y dentro del bloque then, porque ahí el compilador sabe que la comprobación pasó. Con || en lugar de && no compilaría.'},

/* ---- exc ---- */
{id:'e1',a:'exc',p:'¿Qué devuelve m()?',c:`static int m() {
    try {
        return 1;
    } finally {
        return 2;
    }
}`,
 o:['1','2','No compila','Lanza excepción'],k:[1],
 e:'Un return dentro de finally sustituye al del try y además descartaría cualquier excepción pendiente. Compila, pero es una práctica que conviene evitar en código real.'},

{id:'e2',a:'exc',p:'¿En qué orden se cierran los recursos?',c:`try (var a = new Rec("A");
     var b = new Rec("B");
     var c = new Rec("C")) {
    System.out.print("cuerpo ");
}`,
 o:['A B C','C B A','Orden indeterminado','Solo se cierra C'],k:[1],
 e:'try-with-resources cierra en orden inverso al de declaración, igual que se desapila. El cierre ocurre antes de cualquier catch o finally asociado al mismo try.'},

{id:'e3',a:'exc',p:'¿Por qué no compila?',c:`try {
    hacerAlgo();
} catch (Exception e) {
    System.out.println("general");
} catch (java.io.IOException e) {
    System.out.println("io");
}`,
 o:['IOException es comprobada y falta throws','El segundo catch es inalcanzable','No se puede tener dos catch','Falta el bloque finally'],k:[1],
 e:'Los catch se evalúan en orden y el primero que encaja gana. Como Exception ya cubre IOException, el segundo bloque nunca podría ejecutarse y el compilador lo rechaza. Hay que poner siempre el más específico primero.'},

{id:'e4',a:'exc',p:'¿Cuál de estos multi-catch compila?',c:`// A
catch (java.io.IOException | RuntimeException e) { }
// B
catch (java.io.FileNotFoundException | java.io.IOException e) { }
// C
catch (java.io.IOException | RuntimeException e) { e = null; }`,
 o:['Solo A','A y B','Solo B','A y C'],k:[0],
 e:'B falla porque FileNotFoundException hereda de IOException y el multi-catch no admite tipos relacionados por herencia. C falla porque la variable de un multi-catch es implícitamente final y no se puede reasignar.'},

{id:'e5',a:'exc',p:'Al sobrescribir, ¿qué firma es legal?',c:`class Padre {
    void m() throws java.io.IOException { }
}`,
 o:['void m() throws Exception','void m() throws java.io.FileNotFoundException','void m() throws java.sql.SQLException','void m() throws Throwable'],k:[1],
 e:'El método que sobrescribe no puede ampliar el conjunto de excepciones comprobadas: solo puede declarar las mismas, subtipos suyos, o ninguna. FileNotFoundException es subtipo de IOException, así que vale.'},

{id:'e6',a:'exc',p:'¿Cuál es el requisito de un recurso ya existente en try-with-resources?',c:`var br = new java.io.BufferedReader(r);
try (br) {
    // ...
}`,
 o:['Debe ser final o efectivamente final','Debe declararse siempre dentro del try','Debe implementar Closeable, no basta AutoCloseable','No se permite reutilizar una variable existente'],k:[0],
 e:'Desde Java 9 se puede usar una variable ya declarada siempre que sea final o efectivamente final. El tipo solo necesita implementar AutoCloseable; Closeable es un subinterfaz suyo más restrictivo.'},

/* ---- col ---- */
{id:'c1',a:'col',p:'¿Qué imprime?',c:`var l = new ArrayList<>(List.of(10, 20, 30));
l.remove(1);
System.out.println(l);`,
 o:['[10, 30]','[20, 30]','[10, 20]','Lanza excepción'],k:[0],
 e:'Con un int se llama a remove(int index), que borra por posición. Para borrar el valor 1 habría que escribir remove(Integer.valueOf(1)) y forzar la sobrecarga remove(Object).'},

{id:'c2',a:'col',p:'¿Qué imprime? (Java 21)',c:`var l = new ArrayList<>(List.of(1, 2, 3));
System.out.println(l.reversed() + " " + l.getFirst());`,
 o:['[3, 2, 1] 1','[3, 2, 1] 3','[1, 2, 3] 1','No compila'],k:[0],
 e:'SequencedCollection, nueva en Java 21, añade getFirst, getLast, addFirst, addLast y reversed a List y a otras colecciones ordenadas. reversed() devuelve una vista invertida, no una copia, y no altera la lista original.'},

{id:'c3',a:'col',p:'¿Qué ocurre?',c:`var l = Arrays.asList(1, 2, 3);
l.set(0, 99);
l.add(4);
System.out.println(l);`,
 o:['[99, 2, 3, 4]','UnsupportedOperationException en set','UnsupportedOperationException en add','[1, 2, 3, 4]'],k:[2],
 e:'Arrays.asList devuelve una lista de tamaño fijo respaldada por el array: permite sustituir elementos pero no añadir ni quitar. List.of, en cambio, es totalmente inmutable y también fallaría en set.'},

{id:'c4',a:'col',p:'¿Qué imprime?',c:`var m = new HashMap<String, Integer>();
m.put("a", 1);
m.merge("a", 10, Integer::sum);
m.merge("b", 10, Integer::sum);
System.out.println(m.get("a") + " " + m.get("b"));`,
 o:['1 10','11 10','11 null','10 10'],k:[1],
 e:'merge aplica la función solo si ya existe un valor asociado: 1 + 10 da 11. Si la clave no está, guarda directamente el valor pasado sin llamar a la función, de ahí el 10 para "b".'},

{id:'c5',a:'col',p:'¿Por qué no compila la línea marcada?',c:`List<? extends Number> nums = new ArrayList<Integer>();
nums.add(42);   // <-- aquí`,
 o:['Integer no es Number','Con ? extends no se puede añadir nada salvo null','Falta un cast a Number','ArrayList no admite comodines'],k:[1],
 e:'Con ? extends el compilador solo sabe que el tipo es algún subtipo de Number, pero no cuál, así que no puede garantizar que Integer encaje. Sirve para leer. Para escribir se usa ? super, la regla mnemotécnica PECS.'},

{id:'c6',a:'col',p:'¿Cuántos elementos quedan en el conjunto?',c:`class P {
    String n;
    P(String n) { this.n = n; }
    public boolean equals(Object o) {
        return o instanceof P p && p.n.equals(n);
    }
}
var s = new HashSet<P>();
s.add(new P("a"));
s.add(new P("a"));
System.out.println(s.size());`,
 o:['1','2','0','Lanza excepción'],k:[1],
 e:'Se sobrescribió equals pero no hashCode, así que los dos objetos caen casi con seguridad en cubos distintos y HashSet ni llega a compararlos. Es la razón por la que ambos métodos se sobrescriben siempre juntos.'},

/* ---- streams ---- */
{id:'s1',a:'str',p:'¿Qué imprime?',c:`Stream.of("a", "b", "c").peek(System.out::print);
System.out.println("fin");`,
 o:['abcfin','fin','abc','No compila'],k:[1],
 e:'Los streams son perezosos: sin operación terminal no se procesa ningún elemento y peek nunca llega a ejecutarse. Solo se imprime "fin".'},

{id:'s2',a:'str',p:'¿Qué imprime?',c:`System.out.println(
    IntStream.range(1, 5).sum() + " " +
    IntStream.rangeClosed(1, 5).sum());`,
 o:['10 15','15 15','10 10','15 21'],k:[0],
 e:'range excluye el límite superior y suma 1+2+3+4 = 10. rangeClosed lo incluye y llega a 15. Es una distinción que aparece con frecuencia en el examen.'},

{id:'s3',a:'str',p:'¿Qué imprime?',c:`Optional<String> o = Optional.empty();
System.out.println(o.map(String::toUpperCase).orElse("vacío"));`,
 o:['vacío','null','Lanza NoSuchElementException','No compila'],k:[0],
 e:'map sobre un Optional vacío devuelve otro vacío sin invocar la función, y orElse aporta el respaldo. Ojo con la diferencia entre orElse, que evalúa siempre su argumento, y orElseGet, que solo lo hace si hace falta.'},

{id:'s4',a:'str',p:'¿Cuál es el tipo de r?',c:`var r = Stream.of("ana", "luis", "eva")
              .collect(Collectors.groupingBy(String::length));`,
 o:['Map<Integer, List<String>>','Map<String, Integer>','List<Map<Integer, String>>','Map<Integer, String>'],k:[0],
 e:'groupingBy con un solo argumento agrupa en un Map cuya clave es el resultado del clasificador y cuyo valor es la lista de elementos de cada grupo. El downstream por defecto es Collectors.toList().'},

{id:'s5',a:'str',p:'¿Qué ocurre?',c:`var st = Stream.of(1, 2, 3);
System.out.println(st.count());
System.out.println(st.count());`,
 o:['Imprime 3 y 3','Imprime 3 y 0','Lanza IllegalStateException','No compila'],k:[2],
 e:'Un stream se consume una sola vez. Al invocar una segunda operación terminal lanza IllegalStateException indicando que ya fue operado o cerrado. Si necesitas recorrerlo dos veces, guarda los datos en una colección.'},

{id:'s6',a:'str',p:'¿Qué imprime?',c:`System.out.println(
    Stream.of("a", "b", "c")
          .reduce("", (x, y) -> x + y));`,
 o:['abc','cba','Optional[abc]','No compila'],k:[0],
 e:'La forma de reduce con identidad devuelve directamente el tipo del acumulador, no un Optional. La versión de un solo argumento sí devolvería Optional[abc], porque el stream podría estar vacío.'},

/* ---- mod ---- */
{id:'m1',a:'mod',p:'¿Qué significa requires transitive?',c:`module app {
    requires transitive datos;
}`,
 o:['Los módulos que lean app leen también datos','datos se resuelve solo en tiempo de ejecución','datos es opcional en compilación','app puede usar reflexión sobre datos'],k:[0],
 e:'transitive propaga la legibilidad: cualquier módulo que requiera app obtiene acceso a datos sin declararlo. requires static es la que hace la dependencia opcional en tiempo de ejecución.'},

{id:'m2',a:'mod',p:'Un framework necesita acceso reflexivo profundo a tus clases. ¿Qué declaras?',c:`module app {
    ??? com.miapp.modelo;
}`,
 o:['exports','opens','uses','provides'],k:[1],
 e:'exports concede acceso en tiempo de compilación a los tipos públicos, pero no permite que la reflexión rompa la encapsulación. opens sí lo permite, y es lo que necesitan frameworks de inyección o de mapeo objeto-relacional.'},

{id:'m3',a:'mod',p:'Un JAR sin module-info se coloca en la ruta de módulos. ¿Qué ocurre?',
 o:['Falla el arranque','Se convierte en módulo automático','Va al módulo sin nombre','Se ignora en silencio'],k:[1],
 e:'Pasa a ser un módulo automático: su nombre sale de Automatic-Module-Name del manifiesto o, en su defecto, del nombre del archivo. Exporta todos sus paquetes y lee todos los demás módulos. En la ruta de clases, en cambio, iría al módulo sin nombre.'},

{id:'m4',a:'mod',p:'¿Qué herramienta genera una imagen de ejecución reducida con solo los módulos necesarios?',
 o:['jdeps','jmod','jlink','jar'],k:[2],
 e:'jlink ensambla un entorno de ejecución a medida. jdeps analiza dependencias y ayuda en la migración, jmod crea archivos .jmod para el propio JDK y jar empaqueta.'},

{id:'m5',a:'mod',p:'¿Es válido este par de módulos?',c:`module a { requires b; }
module b { requires a; }`,
 o:['Sí, si no hay exports cruzados','No: los ciclos entre módulos están prohibidos','Sí, con requires static en uno de los dos','Solo en la ruta de clases'],k:[1],
 e:'El sistema de módulos prohíbe las dependencias cíclicas en tiempo de compilación, a diferencia de lo que ocurre entre paquetes. Es una de las razones por las que migrar código heredado a JPMS obliga a reordenar dependencias.'},

/* ---- conc ---- */
{id:'k1',a:'conc',p:'¿Cuál crea un ejecutor de hilos virtuales? (Java 21)',
 o:['Executors.newFixedThreadPool(0)','Executors.newVirtualThreadPerTaskExecutor()','Executors.newCachedThreadPool()','new ForkJoinPool()'],k:[1],
 e:'newVirtualThreadPerTaskExecutor crea un hilo virtual por tarea. La idea es no agrupar hilos virtuales: son tan baratos de crear que agruparlos pierde el sentido. También sirve Thread.ofVirtual().start(runnable).'},

{id:'k2',a:'conc',p:'¿Para qué tipo de carga aportan poco los hilos virtuales?',
 o:['Muchas llamadas de red bloqueantes','Cálculo intensivo de CPU','Miles de conexiones simultáneas','Acceso bloqueante a base de datos'],k:[1],
 e:'Los hilos virtuales ganan cuando el hilo pasa la mayor parte del tiempo bloqueado esperando entrada o salida, porque al bloquearse liberan el hilo portador. En trabajo puro de CPU no hay bloqueo que aprovechar y el límite lo pone el número de núcleos.'},

{id:'k3',a:'conc',p:'¿Qué imprime, con alta probabilidad?',c:`var c = new int[1];
var ex = Executors.newFixedThreadPool(8);
for (int i = 0; i < 10000; i++) ex.submit(() -> c[0]++);
ex.shutdown();
ex.awaitTermination(5, TimeUnit.SECONDS);
System.out.println(c[0] == 10000);`,
 o:['Siempre true','Con frecuencia false','Siempre false','Lanza excepción'],k:[1],
 e:'El incremento no es atómico: se compone de leer, sumar y escribir, y dos hilos pueden pisarse entre esos pasos. Es una condición de carrera clásica que se resuelve con AtomicInteger o sincronizando el acceso.'},

{id:'k4',a:'conc',p:'¿Qué diferencia hay entre submit y execute?',
 o:['submit devuelve Future, execute no','execute es asíncrono y submit síncrono','submit solo acepta Callable','No hay diferencia'],k:[0],
 e:'submit acepta Runnable o Callable y devuelve un Future con el que consultar el resultado o la excepción. execute solo toma Runnable, no devuelve nada y las excepciones acaban en el manejador de excepciones no capturadas del hilo.'},

{id:'k5',a:'conc',p:'¿Qué colección evita ConcurrentModificationException al iterar mientras se modifica?',
 o:['ArrayList sincronizada con Collections.synchronizedList','CopyOnWriteArrayList','LinkedList','Vector'],k:[1],
 e:'CopyOnWriteArrayList itera sobre una instantánea del array, así que las modificaciones concurrentes no afectan al recorrido en curso. Es adecuada cuando hay muchas más lecturas que escrituras, porque cada escritura copia el array entero.'},

{id:'k6',a:'conc',p:'¿Qué imprime?',c:`var f = CompletableFuture.supplyAsync(() -> 2)
        .thenApply(n -> n * 3)
        .thenApply(n -> n + 1);
System.out.println(f.join());`,
 o:['7','2','9','6'],k:[0],
 e:'Cada thenApply transforma el resultado anterior de forma encadenada: 2, luego 6, luego 7. thenCompose se usaría si la función devolviese a su vez un CompletableFuture, para evitar el anidamiento.'},

/* ---- io ---- */
{id:'i1',a:'io',p:'¿Qué imprime?',c:`Path p = Path.of("/a/b").resolve("/c/d");
System.out.println(p);`,
 o:['/a/b/c/d','/c/d','/a/b','Lanza excepción'],k:[1],
 e:'Si el argumento de resolve es una ruta absoluta, se devuelve tal cual y se descarta la base. Solo cuando es relativa se concatena. Path no toca el disco: es manipulación puramente sintáctica.'},

{id:'i2',a:'io',p:'¿Qué imprime?',c:`Path a = Path.of("/datos/2026/informe.txt");
Path b = Path.of("/datos/2025");
System.out.println(b.relativize(a));`,
 o:['../2026/informe.txt','/datos/2026/informe.txt','2026/informe.txt','Lanza IllegalArgumentException'],k:[0],
 e:'relativize construye la ruta que lleva de b hasta a, subiendo un nivel con "..". Lanzaría IllegalArgumentException si una ruta fuese absoluta y la otra relativa, porque no habría forma de relacionarlas.'},

{id:'i3',a:'io',p:'¿Cuál es el problema de este código?',c:`Files.lines(Path.of("datos.txt"))
     .filter(l -> !l.isBlank())
     .forEach(System.out::println);`,
 o:['No compila','Deja el archivo abierto: falta try-with-resources','forEach no existe en Stream','Habría que usar readAllLines'],k:[1],
 e:'Files.lines devuelve un stream que mantiene abierto el descriptor del archivo y hay que cerrarlo. Como Stream implementa AutoCloseable, lo correcto es envolverlo en un try-with-resources. readAllLines no tiene ese problema, pero carga todo en memoria.'},

{id:'i4',a:'io',p:'Al deserializar, ¿qué ocurre con un campo transient?',
 o:['Conserva su valor original','Recibe el valor por defecto de su tipo','Provoca NotSerializableException','Se invoca su constructor'],k:[1],
 e:'transient excluye el campo del proceso de serialización, así que al recuperar el objeto queda a null, 0 o false según el tipo. Los constructores de la clase serializable no se ejecutan; sí lo hace el del primer padre no serializable.'},

{id:'i5',a:'io',p:'¿Qué opción abre un archivo para añadir al final, creándolo si no existe? (elige 2)',c:`Files.newBufferedWriter(p, ???);`,
 o:['StandardOpenOption.APPEND','StandardOpenOption.CREATE','StandardOpenOption.TRUNCATE_EXISTING','StandardOpenOption.READ'],k:[0,1],
 e:'APPEND escribe al final en lugar de truncar, y CREATE lo crea si falta sin fallar cuando ya existe. CREATE_NEW, en cambio, lanzaría excepción si el archivo ya estuviera ahí.'},

/* ---- l10n ---- */
{id:'l1',a:'l10n',p:'Con Locale es-ES y bundle base Msg, ¿cuál se busca primero?',
 o:['Msg.properties','Msg_es.properties','Msg_es_ES.properties','Msg_ES.properties'],k:[2],
 e:'La búsqueda va de lo más específico a lo más general: idioma y país, luego solo idioma, luego el locale por defecto y finalmente el bundle base. Cada clave que no aparezca se hereda del nivel superior.'},

{id:'l2',a:'l10n',p:'¿Cuál es la forma recomendada de crear un Locale desde Java 19?',
 o:['new Locale("es", "ES")','Locale.of("es", "ES")','Locale.forCountry("ES")','Locale.parse("es_ES")'],k:[1],
 e:'Los constructores de Locale quedaron obsoletos en Java 19 en favor de las fábricas Locale.of. También sirve Locale.forLanguageTag("es-ES"), que espera el formato con guion de la norma BCP 47.'},

{id:'l3',a:'l10n',p:'Existen Msg_es.properties y Msg_es.class, ambos ResourceBundle. ¿Cuál gana?',
 o:['El .properties','El .class','El último modificado','Lanza MissingResourceException'],k:[1],
 e:'Para un mismo locale, ResourceBundle busca primero una clase compilada y solo si no la encuentra recurre al archivo de propiedades. Una ListResourceBundle permite valores que no sean cadenas, cosa que un .properties no puede.'},

{id:'l4',a:'l10n',p:'¿Qué formatea importes con el símbolo de moneda del locale?',
 o:['NumberFormat.getInstance(loc)','NumberFormat.getCurrencyInstance(loc)','DecimalFormat.getMoney(loc)','NumberFormat.getPercentInstance(loc)'],k:[1],
 e:'getCurrencyInstance añade el símbolo y aplica las convenciones de separadores y decimales del locale. getCompactNumberInstance, añadido en Java 12, produce formas abreviadas del estilo de "1,2 mil".'},

{id:'l5',a:'l10n',p:'¿Qué imprime aproximadamente?',c:`var f = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.SHORT)
        .withLocale(Locale.of("es", "ES"));
System.out.println(LocalDate.of(2026, 11, 4).format(f));`,
 o:['4/11/26','11/4/26','2026-11-04','04 nov 2026'],k:[0],
 e:'FormatStyle.SHORT con locale español produce día, mes y año abreviado en ese orden. Con Locale.US saldría el mes primero. ofLocalizedDate solo acepta objetos que lleven fecha: aplicarlo a un LocalTime lanzaría excepción.'}
];
