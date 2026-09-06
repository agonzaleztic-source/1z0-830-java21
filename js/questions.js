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
 e:'FormatStyle.SHORT con locale español produce día, mes y año abreviado en ese orden. Con Locale.US saldría el mes primero. ofLocalizedDate solo acepta objetos que lleven fecha: aplicarlo a un LocalTime lanzaría excepción.'},

/* ---- ampliación: tipos ---- */
{id:'t8',a:'tipos',p:'¿Qué imprime?',c:`char c = 'A';
c += 2;
System.out.println(c);`,
 o:['A','C','67','No compila: int no cabe en char'],k:[1],
 e:'La asignación compuesta lleva un cast implícito, así que c += 2 equivale a c = (char)(c + 2) y sí compila. La letra A es 65, más 2 son 67, que como char es C. Con c = c + 2 no compilaría, porque c + 2 es int.'},

{id:'t9',a:'tipos',p:'¿Qué imprime?',c:`System.out.println(-7 / 2);
System.out.println(-7 % 2);`,
 o:['-4 y -1','-3 y -1','-3 y 1','-4 y 1'],k:[1],
 e:'La división entera trunca hacia cero, no hacia abajo: -7 / 2 da -3, no -4. Y el resto conserva el signo del dividendo, así que -7 % 2 da -1. Si el dividendo fuese positivo, 7 % -2 daría 1.'},

{id:'t10',a:'tipos',p:'¿Qué imprime?',c:`System.out.println(0.1 + 0.2 == 0.3);
System.out.println(0.1 + 0.2);`,
 o:['true y 0.3','false y 0.30000000000000004','true y 0.30000000000000004','No compila'],k:[1],
 e:'double usa coma flotante binaria y 0.1 y 0.2 no son representables de forma exacta, así que la suma se desvía. Nunca compares decimales con ==: usa una tolerancia o BigDecimal. Para dinero, BigDecimal con su constructor de String.'},

{id:'t11',a:'tipos',p:'¿Qué imprime?',c:`double d = 0.0 / 0.0;
System.out.println(d);
System.out.println(d == d);`,
 o:['Lanza ArithmeticException','NaN y true','NaN y false','Infinity y false'],k:[2],
 e:'Dividir un double por cero no lanza excepción: da NaN cuando ambos son cero, e Infinity si el dividendo no lo es. NaN no es igual ni a sí mismo, así que d == d es false. Para comprobarlo se usa Double.isNaN(d). Con enteros, 0 / 0 sí lanzaría ArithmeticException.'},

{id:'t12',a:'tipos',p:'¿Qué imprime?',c:`System.out.println(5 / 2 * 2.0);`,
 o:['5.0','4.0','4','2.5'],k:[1],
 e:'Multiplicación y división tienen la misma precedencia y se evalúan de izquierda a derecha. Primero 5 / 2, que al ser entre enteros da 2, y luego 2 * 2.0 da 4.0. Si fuese 5 / (2 * 2.0) el resultado sería 1.25.'},

{id:'t13',a:'tipos',p:'¿Cuál de estas declaraciones NO compila?',c:`long a = 10000000000L;
long b = 10000000000;
float f = 3.14f;
double d = 3.14;`,
 o:['La de a','La de b','La de f','La de d'],k:[1],
 e:'Un literal numérico sin sufijo es int, y 10000000000 no cabe en int, así que el error se produce antes de convertirlo a long. Hace falta la L. Lo mismo pasa con float: 3.14 sin la f es double y no compila al asignarlo a float.'},

{id:'t14',a:'tipos',p:'¿Qué imprime?',c:`Integer n = null;
int m = n;
System.out.println(m);`,
 o:['0','null','Lanza NullPointerException','No compila'],k:[2],
 e:'Compila sin problema: el compilador inserta n.intValue() para el unboxing. En ejecución, invocar un método sobre null lanza NullPointerException. Es el mismo motivo por el que int v = mapa.get("noExiste") revienta cuando la clave no está.'},

{id:'t15',a:'tipos',p:'¿Qué imprime?',c:`StringBuilder a = new StringBuilder("hola");
StringBuilder b = new StringBuilder("hola");
System.out.println(a.equals(b));
System.out.println(a.toString().equals(b.toString()));`,
 o:['true y true','false y true','true y false','false y false'],k:[1],
 e:'StringBuilder no sobrescribe equals, así que hereda el de Object y compara referencias: son dos objetos distintos y da false. Convertirlos a String sí compara contenido. Por lo mismo, un StringBuilder es mala clave de un HashMap.'},

{id:'t16',a:'tipos',p:'¿Qué imprime?',c:`String s = "Java21";
System.out.println(s.substring(2, 4));
System.out.println(s.substring(6));`,
 o:['va y cadena vacía','va2 y lanza excepción','av y cadena vacía','va y lanza excepción'],k:[0],
 e:'En substring el primer índice es inclusivo y el segundo exclusivo, así que 2 y 4 devuelven los caracteres 2 y 3: "va". Y substring(6) sobre una cadena de longitud 6 es legal y devuelve cadena vacía; con 7 sí lanzaría StringIndexOutOfBoundsException.'},

{id:'t17',a:'tipos',p:'¿Cuál es el contenido exacto de la variable?',c:`String t = """
    hola
    """;`,
 o:['"    hola"','"hola"','"hola\\n"','"    hola\\n"'],k:[2],
 e:'La sangría incidental se calcula con la línea menos sangrada, contando la del delimitador de cierre: aquí las dos tienen cuatro espacios, así que se eliminan los cuatro. Y como el cierre está en su propia línea, la cadena termina con un salto de línea.'},

{id:'t18',a:'tipos',p:'¿Cuál de estos usos de var NO compila?',c:`var a = 10;
var b = new ArrayList<String>();
var c = null;
var d = "texto";`,
 o:['La de a','La de b','La de c','La de d'],k:[2],
 e:'var necesita inferir el tipo del inicializador, y null no aporta ninguno. Tampoco se puede usar var en campos de clase, parámetros de método, tipos de retorno ni sin inicializar. Sí vale para variables locales y para el índice de un for.'},

{id:'t19',a:'tipos',p:'¿Qué imprime?',c:`LocalDate d = LocalDate.of(2026, 3, 15);
d.plusDays(10);
System.out.println(d.getDayOfMonth());`,
 o:['25','15','Lanza excepción','No compila'],k:[1],
 e:'Todas las clases de java.time son inmutables. plusDays devuelve una fecha nueva que aquí se tira, igual que pasa con los métodos de String. Habría que escribir d = d.plusDays(10). Es de las trampas más repetidas del examen.'},

{id:'t20',a:'tipos',p:'¿Qué imprime?',c:`LocalDate d = LocalDate.of(2026, 1, 31);
System.out.println(d.plusMonths(1));`,
 o:['2026-02-31','2026-03-03','2026-02-28','Lanza DateTimeException'],k:[2],
 e:'Al sumar meses, java.time ajusta al último día válido del mes destino en lugar de desbordar. El 31 de enero más un mes es el 28 de febrero en 2026, que no es bisiesto. No lanza excepción ni se va a marzo.'},

{id:'t21',a:'tipos',p:'¿Qué ocurre?',c:`LocalDate d = LocalDate.of(2026, 13, 1);
System.out.println(d);`,
 o:['Imprime 2027-01-01','Imprime 2026-13-01','Lanza DateTimeException','No compila'],k:[2],
 e:'LocalDate.of valida los rangos y el mes 13 no existe, así que lanza DateTimeException en ejecución. Compila sin problema porque son enteros. java.time nunca hace la corrección silenciosa que sí hacía el viejo Calendar.'},

{id:'t22',a:'tipos',p:'¿Qué imprime?',c:`LocalDate a = LocalDate.of(2026, 1, 1);
LocalDate b = LocalDate.of(2026, 3, 1);
System.out.println(ChronoUnit.DAYS.between(a, b));
System.out.println(Period.between(a, b).getDays());`,
 o:['59 y 59','59 y 0','2 y 0','59 y 2'],k:[1],
 e:'ChronoUnit.DAYS.between cuenta los días totales: 31 de enero más 28 de febrero son 59. Period, en cambio, descompone en años, meses y días, así que aquí son 2 meses y 0 días; getDays() devuelve solo el resto de días, no el total. Confundirlos es un clásico.'},

{id:'t23',a:'tipos',p:'¿Qué imprime?',c:`System.out.println(true ? 1 : 2.0);`,
 o:['1','1.0','2.0','No compila: tipos incompatibles'],k:[1],
 e:'El ternario tiene un único tipo de resultado, y como una rama es int y la otra double, ambas se promocionan a double. Aunque se elija la rama del 1, se imprime 1.0. Este ajuste de tipo ocurre aunque la otra rama no llegue a evaluarse.'},

{id:'t24',a:'tipos',p:'¿Qué imprime?',c:`String s = "  Java  ";
System.out.println("[" + s.strip() + "]");
System.out.println("[" + s + "]");`,
 o:['[Java] y [Java]','[Java] y [  Java  ]','[  Java  ] y [  Java  ]','[Java] y []'],k:[1],
 e:'strip() devuelve una cadena nueva sin tocar la original, porque String es inmutable. La diferencia con trim() es que strip() entiende los espacios Unicode y trim() solo elimina caracteres con código menor o igual al del espacio.'},

{id:'t25',a:'tipos',p:'¿Qué imprime?',c:`System.out.println('a' + 1);
System.out.println((char)('a' + 1));
System.out.println("a" + 1);`,
 o:['b, b y a1','98, b y a1','98, 98 y a1','a1, b y a1'],k:[1],
 e:'En la primera, char se promociona a int y la suma es 98, que se imprime como número. En la segunda, el cast lo devuelve a char y sale la letra b. En la tercera hay un String a la izquierda, así que el + concatena en vez de sumar.'},

/* ---- ampliación: flujo ---- */
{id:'f7',a:'flujo',p:'¿Qué imprime?',c:`int x = 2;
switch (x) {
    case 1: System.out.print("uno");
    case 2: System.out.print("dos");
    case 3: System.out.print("tres");
    default: System.out.print("otro");
}`,
 o:['dos','dostres','dostresotro','otro'],k:[2],
 e:'El switch clásico con dos puntos cae en cascada: entra por case 2 y sigue ejecutando todo lo que hay debajo, incluido el default, porque no hay ningún break. El default no tiene por qué ir al final ni se salta por estar el último.'},

{id:'f8',a:'flujo',p:'¿Qué imprime?',c:`int x = 2;
switch (x) {
    case 1 -> System.out.print("uno");
    case 2 -> System.out.print("dos");
    case 3 -> System.out.print("tres");
    default -> System.out.print("otro");
}`,
 o:['dos','dostres','dostresotro','No compila: falta break'],k:[0],
 e:'La forma con flecha no cae en cascada: ejecuta solo la rama que encaja y sale. Por eso no hace falta break, y de hecho no se puede usar para salir de un switch con flecha. Es la forma recomendada desde Java 14.'},

{id:'f9',a:'flujo',p:'¿Qué imprime?',c:`int mes = 4;
int dias = switch (mes) {
    case 2 -> 28;
    case 4, 6, 9, 11 -> 30;
    default -> { yield 31; }
};
System.out.println(dias);`,
 o:['28','30','31','No compila: yield mal usado'],k:[1],
 e:'Un case puede agrupar varias etiquetas separadas por comas. Cuando la rama es un bloque con llaves, el valor se devuelve con yield, no con return. Con flecha y una sola expresión, el valor es esa expresión y yield sobra.'},

{id:'f10',a:'flujo',p:'¿Qué ocurre?',c:`Object o = null;
switch (o) {
    case String s -> System.out.println("cadena");
    case Integer i -> System.out.println("entero");
    default -> System.out.println("otro");
}`,
 o:['Imprime otro','Lanza NullPointerException','Imprime cadena','No compila'],k:[1],
 e:'Un switch con patrones lanza NullPointerException si el selector es null y no existe una rama case null. El default NO captura el null. Para tratarlo hay que escribirlo explícitamente: case null -> ..., que además puede combinarse como case null, default.'},

{id:'f11',a:'flujo',p:'¿Por qué no compila?',c:`int x = 5;
int y = switch (x) {
    case 1 -> 10;
    case 2 -> 20;
};`,
 o:['Falta break en cada rama','Un switch como expresión debe ser exhaustivo','No se puede usar switch con int','Falta yield'],k:[1],
 e:'Cuando el switch se usa como expresión debe cubrir todos los valores posibles, porque siempre tiene que producir uno. Con int eso obliga a poner default. Sobre un enum basta con listar todas las constantes, y sobre una jerarquía sellada, todos los subtipos permitidos.'},

{id:'f12',a:'flujo',p:'¿Qué imprime?',c:`fuera:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) continue fuera;
        System.out.print(i + "" + j + " ");
    }
}`,
 o:['00 01 10 11 20 21','00 10 20','00 01 02','No compila'],k:[1],
 e:'continue con etiqueta salta a la siguiente iteración del bucle etiquetado, no del interno. Así que en cuanto j vale 1 se abandona el bucle interior y se incrementa i. Con un break fuera se saldría de los dos bucles y solo se imprimiría 00.'},

{id:'f13',a:'flujo',p:'¿Qué imprime?',c:`int i = 10;
do {
    System.out.print(i + " ");
    i++;
} while (i < 5);`,
 o:['No imprime nada','10','10 11 12 13 14','Bucle infinito'],k:[1],
 e:'do-while comprueba la condición al final, así que el cuerpo se ejecuta siempre al menos una vez aunque la condición sea falsa desde el principio. Con un while normal no se habría impreso nada. Ojo también al punto y coma obligatorio tras el while.'},

{id:'f14',a:'flujo',p:'¿Por qué no compila?',c:`for (int i = 0; i < 3; i++) {
    System.out.println(i);
}
System.out.println(i);`,
 o:['Falta inicializar i','i solo existe dentro del bucle','El for necesita llaves','i debería ser final'],k:[1],
 e:'Una variable declarada en la sección de inicialización del for tiene como alcance el propio bucle. Fuera ya no existe. Si necesitas su valor después, hay que declararla antes del for. Es un error frecuente en preguntas de compilación.'},

{id:'f15',a:'flujo',p:'¿Qué imprime?',c:`int x = 5;
if (x > 3)
    System.out.println("a");
    System.out.println("b");`,
 o:['a','a y b','b','No compila'],k:[1],
 e:'Sin llaves, el if solo gobierna la instrucción inmediatamente siguiente. La segunda línea está fuera del if por más que la sangría sugiera lo contrario, así que se ejecuta siempre. Este es justo el motivo por el que conviene poner llaves siempre.'},

{id:'f16',a:'flujo',p:'¿Qué imprime?',c:`record Punto(int x, int y) {}

Object o = new Punto(3, 4);
if (o instanceof Punto(int x, int y)) {
    System.out.println(x + y);
}`,
 o:['7','34','Punto[x=3, y=4]','No compila'],k:[0],
 e:'Es un patrón de registro: deconstruye el Punto y liga directamente sus componentes a las variables x e y, sin necesidad de llamar a los accesores. Se pueden anidar, como Linea(Punto(var x1, var y1), Punto p2), y usar var en cada componente.'},

{id:'f17',a:'flujo',p:'¿Qué imprime?',c:`Object o = 42;
String r = switch (o) {
    case Integer i when i > 100 -> "grande";
    case Integer i -> "entero " + i;
    case String s -> "cadena";
    default -> "otro";
};
System.out.println(r);`,
 o:['grande','entero 42','otro','No compila: dos case Integer'],k:[1],
 e:'La guarda when filtra dentro del patrón: la primera rama solo encaja si además el valor supera 100. Como 42 no lo hace, se prueba la siguiente. El orden importa: si el case Integer sin guarda fuese primero, el guardado quedaría inalcanzable y sería error de compilación.'},

{id:'f18',a:'flujo',p:'¿Qué imprime?',c:`String dia = "sabado";
switch (dia) {
    case "sabado":
    case "domingo":
        System.out.println("finde");
        break;
    default:
        System.out.println("laborable");
}`,
 o:['finde','finde y laborable','laborable','No compila: switch no admite String'],k:[0],
 e:'El switch admite String desde Java 7 y compara con equals, distinguiendo mayúsculas. Agrupar dos case sin código entre ellos es la forma clásica de tratar varios valores igual. Si dia fuese null, el switch clásico lanzaría NullPointerException.'},

{id:'f19',a:'flujo',p:'¿Qué imprime?',c:`int[] n = {1, 2, 3, 4};
int suma = 0;
for (int x : n) {
    if (x == 2) continue;
    if (x == 4) break;
    suma += x;
}
System.out.println(suma);`,
 o:['10','8','4','1'],k:[2],
 e:'continue salta el resto de esa iteración, así que el 2 no se suma. break abandona el bucle al llegar al 4, que tampoco se suma. Quedan 1 y 3, es decir 4. En un for-each no se puede modificar el array recorrido a través de la variable del bucle.'},

{id:'f20',a:'flujo',p:'¿Qué imprime?',c:`int a = 0;
int b = (a != 0) && (10 / a > 1) ? 1 : 2;
System.out.println(b);`,
 o:['1','2','Lanza ArithmeticException','No compila'],k:[1],
 e:'&& es de cortocircuito: como el primer operando es false, el segundo ni se evalúa y no se llega a dividir por cero. Con & en lugar de && se evaluarían los dos lados y saltaría ArithmeticException. Ese patrón de comprobar antes es la forma habitual de protegerse.'},

{id:'f21',a:'flujo',p:'¿Qué imprime?',c:`sealed interface Figura permits Circulo, Cuadrado {}
record Circulo(double r) implements Figura {}
record Cuadrado(double l) implements Figura {}

Figura f = new Cuadrado(3);
double area = switch (f) {
    case Circulo c -> Math.PI * c.r() * c.r();
    case Cuadrado q -> q.l() * q.l();
};
System.out.println(area);`,
 o:['9.0','No compila: falta default','3.0','Lanza excepción'],k:[0],
 e:'Sobre una interfaz sellada el compilador conoce todos los subtipos permitidos, así que si los cubres todos el switch ya es exhaustivo y no hace falta default. De hecho añadirlo estorba: impediría que el compilador te avise si mañana añades un tercer subtipo.'},

{id:'f22',a:'flujo',p:'¿Qué imprime?',c:`int i = 0;
while (i++ < 3) {
    System.out.print(i + " ");
}`,
 o:['0 1 2','1 2 3','0 1 2 3','1 2 3 4'],k:[1],
 e:'i++ devuelve el valor de antes de incrementar, que es lo que se compara, pero i ya vale uno más cuando se imprime dentro del cuerpo. Se compara 0, 1 y 2 con el 3, y se imprimen 1, 2 y 3. Al comparar 3 la condición falla y el bucle termina con i valiendo 4.'},

/* ---- ampliación: poo ---- */
{id:'p7',a:'poo',p:'¿En qué orden se imprime?',c:`class A {
    static { System.out.print("SA "); }
    { System.out.print("IA "); }
    A() { System.out.print("CA "); }
}
class B extends A {
    static { System.out.print("SB "); }
    { System.out.print("IB "); }
    B() { System.out.print("CB "); }
}
new B();`,
 o:['SA SB IA CA IB CB','SA IA CA SB IB CB','SB SA IB CB IA CA','IA IB CA CB SA SB'],k:[0],
 e:'Primero los bloques estáticos, una sola vez al cargar la clase y de padre a hijo. Luego, por cada objeto, el bloque de instancia y el constructor de la superclase, y después los del hijo. Los bloques de instancia se ejecutan siempre antes del cuerpo del constructor de su propia clase.'},

{id:'p8',a:'poo',p:'¿Qué imprime?',c:`class Padre {
    String n = "padre";
    String quien() { return "padre"; }
}
class Hijo extends Padre {
    String n = "hijo";
    String quien() { return "hijo"; }
}
Padre p = new Hijo();
System.out.println(p.n + " " + p.quien());`,
 o:['hijo hijo','padre padre','padre hijo','hijo padre'],k:[2],
 e:'Los campos NO son polimórficos: se resuelven por el tipo declarado de la referencia, así que p.n da "padre". Los métodos sí lo son y se resuelven por el tipo real del objeto, así que quien() da "hijo". A esto se le llama ocultación de campos, y por eso los campos se declaran privados.'},

{id:'p9',a:'poo',p:'¿Qué imprime?',c:`class Padre {
    static String saluda() { return "padre"; }
}
class Hijo extends Padre {
    static String saluda() { return "hijo"; }
}
Padre p = new Hijo();
System.out.println(p.saluda());`,
 o:['hijo','padre','No compila','Lanza excepción'],k:[1],
 e:'Los métodos estáticos no se sobrescriben, se ocultan. La llamada se resuelve en tiempo de compilación por el tipo declarado, que es Padre. Llamar a un método estático a través de una referencia compila pero induce a error: lo correcto es Padre.saluda().'},

{id:'p10',a:'poo',p:'¿Qué imprime?',c:`class Padre {
    Padre() { imprime(); }
    void imprime() { System.out.println("padre"); }
}
class Hijo extends Padre {
    int x = 5;
    void imprime() { System.out.println("hijo " + x); }
}
new Hijo();`,
 o:['padre','hijo 5','hijo 0','No compila'],k:[2],
 e:'El constructor del padre se ejecuta antes de inicializar los campos del hijo, pero la llamada ya es polimórfica y va al método del hijo. En ese instante x aún vale 0. Por eso nunca se debe llamar a un método sobrescribible desde un constructor.'},

{id:'p11',a:'poo',p:'¿Cuál es el resultado?',c:`class Animal {
    Animal crear() { return new Animal(); }
}
class Perro extends Animal {
    @Override
    Perro crear() { return new Perro(); }
}`,
 o:['No compila: el tipo de retorno cambia','Compila: retorno covariante','No compila: falta super','Compila pero no sobrescribe'],k:[1],
 e:'Desde Java 5 el método que sobrescribe puede devolver un subtipo del retorno original, lo que se llama covarianza de retorno. Lo que no puede es cambiar los parámetros: eso sería una sobrecarga distinta, no una sobrescritura, y @Override lo delataría.'},

{id:'p12',a:'poo',p:'¿Qué imprime?',c:`static void m(int x)      { System.out.println("int"); }
static void m(Integer x)  { System.out.println("Integer"); }
static void m(int... x)   { System.out.println("varargs"); }

m(5);`,
 o:['int','Integer','varargs','No compila: ambiguo'],k:[0],
 e:'La resolución de sobrecargas va por fases: primero busca una coincidencia exacta o por ampliación, luego prueba con autoboxing y solo al final con varargs. El literal 5 es int, así que gana la primera. Los varargs son siempre el último recurso.'},

{id:'p13',a:'poo',p:'¿Cuál es el orden de los modificadores, de más a menos restrictivo?',
 o:['private, sin modificador, protected, public','private, protected, sin modificador, public','sin modificador, private, protected, public','private, public, protected, sin modificador'],k:[0],
 e:'private solo dentro de la clase. Sin modificador (acceso de paquete) añade el resto del paquete. protected añade además las subclases de otros paquetes. public no restringe. El error típico es creer que protected es más restrictivo que el acceso de paquete: es al revés.'},

{id:'p14',a:'poo',p:'¿Qué ocurre?',c:`interface Saluda {
    default String hola() { return "A"; }
}
interface Despide {
    default String hola() { return "B"; }
}
class Persona implements Saluda, Despide { }`,
 o:['Compila y usa el de Saluda','Compila y usa el de Despide','No compila: conflicto de defaults','Compila pero lanza excepción'],k:[2],
 e:'Cuando dos interfaces aportan un método default con la misma firma, la clase está obligada a resolver el conflicto sobrescribiéndolo. Dentro puede delegar en uno concreto con la sintaxis Saluda.super.hola(). Si solo una lo tuviera como default, no habría conflicto.'},

{id:'p15',a:'poo',p:'¿Por qué no compila la última línea?',c:`interface Util {
    static String version() { return "1.0"; }
}
class Herramienta implements Util { }

System.out.println(Herramienta.version());`,
 o:['version debería ser default','Los métodos static de una interfaz no se heredan','Falta implementar version','Una interfaz no admite static'],k:[1],
 e:'Los métodos estáticos de una interfaz pertenecen solo a esa interfaz y no pasan a las clases que la implementan. Hay que invocarlos por su nombre: Util.version(). Con las clases sí se heredan, y ahí está la asimetría que preguntan.'},

{id:'p16',a:'poo',p:'¿Qué imprime?',c:`interface Config {
    int MAX = 10;
}
class App implements Config {
    void subir() { MAX = 20; }
}`,
 o:['Imprime 20','No compila: MAX es final','No compila: MAX es private','Compila sin problema'],k:[1],
 e:'Todo campo declarado en una interfaz es implícitamente public, static y final, aunque no se escriba. Por eso no se puede reasignar. Del mismo modo, los métodos de una interfaz son public por defecto y no pueden declararse protected.'},

{id:'p17',a:'poo',p:'¿Cuál de estas afirmaciones sobre las clases abstractas es CIERTA?',
 o:['No pueden tener constructor','No pueden tener métodos con cuerpo','Pueden tener constructor y campos de instancia','Todos sus métodos deben ser abstractos'],k:[2],
 e:'Una clase abstracta puede tener constructores (los llama la subclase con super), campos de instancia con estado, métodos concretos y métodos abstractos. Lo único que no se puede es instanciarla directamente con new. Puede incluso no tener ningún método abstracto.'},

{id:'p18',a:'poo',p:'¿Qué ocurre?',c:`record Rango(int min, int max) {
    Rango {
        if (min > max) throw new IllegalArgumentException("mal");
    }
}
new Rango(5, 1);`,
 o:['Lanza IllegalArgumentException','No compila: falta asignar los campos','Crea el objeto igualmente','No compila: el constructor necesita paréntesis'],k:[0],
 e:'Es un constructor compacto: no lleva lista de parámetros ni asigna los campos, de eso se encarga el compilador después de ejecutar tu código. Sirve justo para validar o normalizar. Dentro se pueden reasignar los parámetros y ese valor ajustado es el que se guarda.'},

{id:'p19',a:'poo',p:'¿Cuál de estas afirmaciones sobre los records es FALSA?',
 o:['Generan equals, hashCode y toString','Pueden implementar interfaces','Pueden heredar de otra clase','Sus componentes son final'],k:[2],
 e:'Un record es implícitamente final y ya hereda de java.lang.Record, así que no puede extender ninguna otra clase. Sí puede implementar todas las interfaces que quiera, declarar métodos y constructores adicionales y tener miembros estáticos, pero no campos de instancia extra.'},

{id:'p20',a:'poo',p:'¿Qué imprime?',c:`record Punto(int x, int y) {}

Punto a = new Punto(1, 2);
Punto b = new Punto(1, 2);
System.out.println((a == b) + " " + a.equals(b));
System.out.println(a);`,
 o:['true true y Punto[x=1, y=2]','false true y Punto[x=1, y=2]','false false y la referencia','true true y la referencia'],k:[1],
 e:'Son dos objetos distintos, así que == da false. Pero el record genera un equals que compara componente a componente y da true, y un toString con ese formato de corchetes. Esa pareja equals/hashCode bien hecha es lo que hace de los records buenas claves de mapa.'},

{id:'p21',a:'poo',p:'¿Qué le falta a Cuadrado para que compile?',c:`sealed interface Figura permits Circulo, Cuadrado {}
record Circulo(double r) implements Figura {}
class Cuadrado implements Figura { }`,
 o:['Nada, ya compila','Ser final, sealed o non-sealed','Estar en otro archivo','Implementar un método abstracto'],k:[1],
 e:'Todo subtipo directo de una clase o interfaz sellada debe declarar qué hace con la herencia: final para cerrarla, sealed para seguir restringiéndola o non-sealed para volver a abrirla. Un record ya es final implícitamente, por eso Circulo no necesita nada.'},

{id:'p22',a:'poo',p:'¿Qué imprime?',c:`enum Palo {
    OROS("bastos"), COPAS("espadas");
    private final String pareja;
    Palo(String p) { this.pareja = p; }
    String pareja() { return pareja; }
}
System.out.println(Palo.values().length + " " + Palo.OROS.pareja());
System.out.println(Palo.OROS.ordinal() + " " + Palo.valueOf("COPAS"));`,
 o:['2 bastos y 0 COPAS','2 bastos y 1 COPAS','2 oros y 0 COPAS','No compila: el constructor debe ser public'],k:[0],
 e:'El constructor de un enum es implícitamente privado y no puede ser público. values() devuelve un array con las constantes en orden de declaración, ordinal() da la posición empezando en cero y valueOf busca por nombre exacto. Si el nombre no existe, valueOf lanza IllegalArgumentException, no devuelve null.'},

{id:'p23',a:'poo',p:'¿Qué imprime?',c:`enum Op {
    SUMA { int aplica(int a, int b) { return a + b; } },
    RESTA { int aplica(int a, int b) { return a - b; } };
    abstract int aplica(int a, int b);
}
System.out.println(Op.RESTA.aplica(7, 2));`,
 o:['9','5','No compila: un enum no admite métodos abstractos','Lanza excepción'],k:[1],
 e:'Un enum puede declarar un método abstracto siempre que TODAS sus constantes lo implementen en su propio cuerpo. Cada constante se convierte así en una subclase anónima. Es una forma limpia de sustituir un switch por polimorfismo.'},

{id:'p24',a:'poo',p:'¿Por qué no compila?',c:`void metodo() {
    int contador = 0;
    Runnable r = () -> System.out.println(contador);
    contador++;
}`,
 o:['Una lambda no puede leer variables locales','contador debe ser final o efectivamente final','Falta declarar r como final','Runnable no es una interfaz funcional'],k:[1],
 e:'Una lambda o una clase anónima solo capturan variables locales que no cambien después de asignarse. El contador++ rompe esa condición y el error aparece en la línea de la lambda. Con los campos de instancia no hay tal restricción: esos sí se pueden modificar.'},

{id:'p25',a:'poo',p:'¿Cuál es la forma correcta de crear cada una?',c:`class Fuera {
    static class Anidada { }
    class Interna { }
}`,
 o:['new Fuera.Anidada() y new Fuera().new Interna()','new Fuera().Anidada() y new Fuera.Interna()','Las dos con new Fuera.X()','Las dos con new Fuera().new X()'],k:[0],
 e:'Una clase anidada estática no necesita instancia de la externa, así que basta con new Fuera.Anidada(). Una clase interna sí está ligada a un objeto de la externa y se crea con la sintaxis new Fuera().new Interna(). Solo la interna puede acceder a los campos de instancia de la externa.'},

{id:'p26',a:'poo',p:'¿Cuál de las dos líneas NO compila?',c:`Object o = "texto";
if (o instanceof String s && s.length() > 2) { }
if (o instanceof String t || t.isEmpty()) { }`,
 o:['La primera','La segunda','Ninguna','Las dos'],k:[1],
 e:'La variable del patrón solo existe donde el compilador puede demostrar que la comprobación salió bien. Con && eso se cumple en el lado derecho. Con || se llegaría al lado derecho justo cuando el patrón NO encajó, así que la variable no está definida y es error de compilación.'},

{id:'p27',a:'poo',p:'¿Qué imprime?',c:`class A {
    A(String s) { System.out.println("A:" + s); }
}
class B extends A {
    B() { super("hola"); System.out.println("B"); }
    B(int x) { this(); System.out.println("B:" + x); }
}
new B(7);`,
 o:['A:hola B B:7','B B:7 A:hola','A:hola B:7','No compila'],k:[0],
 e:'B(int) delega en B() con this(), que a su vez llama a super("hola"). Se ejecuta primero el constructor del padre, luego el resto de B() y por último el resto de B(int). this() y super() deben ser la primera instrucción del constructor y son excluyentes entre sí.'},

{id:'p28',a:'poo',p:'¿Por qué no compila?',c:`class A {
    A(int x) { }
}
class B extends A {
    B() { }
}`,
 o:['B necesita un campo','A no tiene constructor sin argumentos','B debe ser abstracta','Falta @Override'],k:[1],
 e:'Si un constructor no llama explícitamente a this() ni a super(), el compilador inserta un super() sin argumentos. Como A solo tiene constructor con int, esa llamada no existe y falla. Se arregla con super(0) o dándole a A un constructor sin argumentos.'},

{id:'p29',a:'poo',p:'¿Qué imprime?',c:`abstract class Forma {
    abstract double area();
    public String toString() { return getClass().getSimpleName() + "=" + area(); }
}
class Cuadrado extends Forma {
    double l = 2;
    double area() { return l * l; }
}
System.out.println(new Cuadrado());`,
 o:['Cuadrado=4.0','Forma=4.0','Cuadrado=0.0','No compila'],k:[0],
 e:'Una clase abstracta puede llamar en sus métodos concretos a métodos abstractos que implementará la subclase: es el patrón del método plantilla. getClass() devuelve siempre la clase real del objeto, no la declarada, así que da Cuadrado.'},

{id:'p30',a:'poo',p:'¿Cuál de estos métodos de interfaz NO puede existir?',
 o:['default String a() { return "x"; }','static String b() { return "x"; }','private String c() { return "x"; }','protected String d() { return "x"; }'],k:[3],
 e:'Una interfaz admite métodos abstractos, default, static y, desde Java 9, private y private static para compartir código entre los default. Lo que no admite es protected: sus miembros solo pueden ser public o private.'},

{id:'p31',a:'poo',p:'¿Qué imprime?',c:`class Contador {
    static int total = 0;
    int propio = 0;
    Contador() { total++; propio++; }
}
new Contador(); new Contador(); Contador c = new Contador();
System.out.println(Contador.total + " " + c.propio);`,
 o:['3 y 3','3 y 1','1 y 1','1 y 3'],k:[1],
 e:'El campo estático es único y compartido por toda la clase, así que cuenta las tres instancias. El campo de instancia pertenece a cada objeto y en el tercero solo se incrementó una vez. Un método estático, por lo mismo, no puede acceder a campos de instancia ni usar this.'},

{id:'p32',a:'poo',p:'¿Qué imprime?',c:`interface Saluda { String di(); }

String nombre = "Ana";
Saluda s = new Saluda() {
    public String di() { return "Hola " + nombre; }
};
System.out.println(s.di());`,
 o:['Hola Ana','Hola null','No compila: nombre no es final','No compila: Saluda es una interfaz'],k:[0],
 e:'Una clase anónima puede implementar una interfaz y capturar variables locales efectivamente finales, como aquí nombre, que no se reasigna. La diferencia con una lambda es que la clase anónima puede tener estado y campos propios, y que dentro de ella this apunta a sí misma y no a la clase que la rodea.'},

/* ---- ampliación: exc ---- */
{id:'e7',a:'exc',p:'¿Qué devuelve?',c:`static int m() {
    try {
        return 1;
    } finally {
        return 2;
    }
}`,
 o:['1','2','No compila','Lanza excepción'],k:[1],
 e:'Un return en el finally descarta el del try y devuelve 2. Peor todavía: si el try estuviera lanzando una excepción, el return del finally se la tragaría en silencio. Por eso nunca debe ponerse return, break ni continue dentro de un finally.'},

{id:'e8',a:'exc',p:'¿Qué devuelve?',c:`static int m() {
    int x = 1;
    try {
        return x;
    } finally {
        x = 99;
    }
}`,
 o:['99','1','0','No compila'],k:[1],
 e:'El valor de retorno se calcula y se reserva antes de ejecutar el finally, así que modificar la variable después ya no lo cambia. Es distinto de poner un return en el finally, que sí sustituye el resultado. Esta pareja de casos cae constantemente.'},

{id:'e9',a:'exc',p:'¿Por qué no compila?',c:`try {
    Integer.parseInt("x");
} catch (RuntimeException e) {
    System.out.println("runtime");
} catch (NumberFormatException e) {
    System.out.println("formato");
}`,
 o:['Falta finally','El segundo catch es inalcanzable','No se puede capturar RuntimeException','Falta declarar throws'],k:[1],
 e:'Los catch se prueban de arriba abajo y el primero que encaje gana. Como NumberFormatException hereda de RuntimeException, el catch de abajo no podría ejecutarse nunca y eso es error de compilación, no un aviso. Hay que ordenar de lo más específico a lo más general.'},

{id:'e10',a:'exc',p:'¿Cuál de estos catch NO compila?',c:`catch (IOException | SQLException e) { }
catch (IOException | FileNotFoundException e) { }
catch (RuntimeException | IOException e) { }`,
 o:['El primero','El segundo','El tercero','Ninguno'],k:[1],
 e:'En un multi-catch no se pueden listar dos tipos emparentados por herencia: FileNotFoundException ya está cubierta por IOException y la lista sería redundante. Los otros dos combinan ramas independientes y son válidos.'},

{id:'e11',a:'exc',p:'¿Qué ocurre?',c:`try {
    puedeFallar();
} catch (IOException | SQLException e) {
    e = new IOException("otra");
}`,
 o:['Compila sin problema','No compila: la variable del multi-catch es final','No compila: falta throws','Compila pero pierde la excepción'],k:[1],
 e:'La variable de un multi-catch es implícitamente final y no se puede reasignar, aunque no lleve escrita la palabra. En un catch de un solo tipo sí se podría, aunque sea mala práctica. Además su tipo estático es el ancestro común, así que solo verías los métodos de Exception.'},

{id:'e12',a:'exc',p:'¿Qué imprime?',c:`class R implements AutoCloseable {
    private final String n;
    R(String n) { this.n = n; }
    public void close() { System.out.print("cierro" + n + " "); }
}

try (R a = new R("A"); R b = new R("B")) {
    System.out.print("cuerpo ");
}`,
 o:['cuerpo cierroA cierroB','cuerpo cierroB cierroA','cierroA cierroB cuerpo','cierroB cierroA cuerpo'],k:[1],
 e:'Los recursos se cierran en orden inverso al de declaración, como una pila, y siempre después del cuerpo. También se cierran antes de que se ejecute cualquier catch o finally del mismo try: cuando entras en el catch, ya están cerrados.'},

{id:'e13',a:'exc',p:'¿Qué imprime?',c:`class R implements AutoCloseable {
    public void close() { throw new IllegalStateException("del close"); }
}

try (R r = new R()) {
    throw new RuntimeException("del cuerpo");
} catch (Exception e) {
    System.out.println(e.getMessage() + " " + e.getSuppressed().length);
}`,
 o:['del close 1','del cuerpo 1','del cuerpo 0','del close 0'],k:[1],
 e:'Cuando fallan el cuerpo y el cierre, la que se propaga es la del cuerpo y la del close queda guardada como suprimida, recuperable con getSuppressed(). Si el cuerpo terminase bien y solo fallara el close, entonces sería la del close la que saldría.'},

{id:'e14',a:'exc',p:'¿Cuál de estas dos formas compila en Java 21?',c:`R r1 = new R();
try (r1) { }                       // forma A

try (R r2 = new R()) { r2 = null; } // forma B`,
 o:['Solo la A','Solo la B','Las dos','Ninguna'],k:[0],
 e:'Desde Java 9 se puede poner entre paréntesis una variable ya existente siempre que sea final o efectivamente final, que es la forma A. La B no compila porque las variables declaradas en el try-with-resources son implícitamente finales y no se pueden reasignar dentro.'},

{id:'e15',a:'exc',p:'¿Cuál de estas sobrescrituras NO compila?',c:`class Padre { void m() throws IOException { } }

class H1 extends Padre { void m() throws FileNotFoundException { } }
class H2 extends Padre { void m() { } }
class H3 extends Padre { void m() throws Exception { } }
class H4 extends Padre { void m() throws RuntimeException { } }`,
 o:['H1','H2','H3','H4'],k:[2],
 e:'El método que sobrescribe no puede ampliar el compromiso de excepciones comprobadas: Exception es más general que IOException. Sí puede declarar una más específica (H1), ninguna (H2) o cualquier no comprobada (H4), porque esas el compilador no las vigila.'},

{id:'e16',a:'exc',p:'¿Por qué no compila?',c:`class A {
    A() throws IOException { }
}
class B extends A {
    B() { }
}`,
 o:['B debe llamar a super() explícitamente','El constructor de B debe declarar IOException','A no puede lanzar en el constructor','B necesita un bloque try'],k:[1],
 e:'El constructor de B llama implícitamente a super(), que puede lanzar IOException, así que B está obligado a declararla o a capturarla. Con los constructores la regla va al revés que con los métodos: aquí hay que declarar lo que lanza el padre, no menos.'},

{id:'e17',a:'exc',p:'¿Cuál de estos dos bloques NO compila?',c:`// bloque A
try { System.out.println("hola"); }
catch (IOException e) { }

// bloque B
try { System.out.println("hola"); }
catch (Exception e) { }`,
 o:['El A','El B','Los dos','Ninguno'],k:[0],
 e:'No se puede capturar una excepción comprobada que el try no pueda lanzar: es error de compilación. La excepción a la regla son Exception y Throwable, que siempre se permiten porque cualquier código puede lanzar una no comprobada. Por eso el bloque B sí compila.'},

{id:'e18',a:'exc',p:'¿Qué ocurre?',c:`try {
    recursiva(0);            // provoca StackOverflowError
} catch (Exception e) {
    System.out.println("capturada");
}`,
 o:['Imprime capturada','El error se propaga y el programa termina','No compila','Imprime la traza y continúa'],k:[1],
 e:'StackOverflowError hereda de Error, que es rama hermana de Exception, así que un catch de Exception no lo atrapa. Solo lo capturaría un catch de Throwable, aunque no debe hacerse: los Error señalan fallos de los que no se espera recuperación.'},

{id:'e19',a:'exc',p:'¿Qué imprime al ejecutar con "java Programa", sin más opciones?',c:`int edad = -5;
assert edad >= 0 : "edad negativa";
System.out.println("sigo aquí");`,
 o:['Lanza AssertionError','sigo aquí','No compila','edad negativa'],k:[1],
 e:'Las aserciones están desactivadas por defecto: la condición ni siquiera se evalúa. Hay que arrancar con -ea para activarlas. Justo por eso una aserción nunca debe tener efectos secundarios, y no debe usarse para validar argumentos de métodos públicos.'},

{id:'e20',a:'exc',p:'¿Por qué no compila?',c:`void m() {
    throw new IllegalStateException("ya");
    System.out.println("después");
}`,
 o:['Falta declarar throws','Código inalcanzable','IllegalStateException es comprobada','Falta try-catch'],k:[1],
 e:'Todo lo que va detrás de un throw en el mismo bloque es inalcanzable y eso es error de compilación, igual que ocurre tras un return, un break o un continue. IllegalStateException es no comprobada, así que no hace falta declararla con throws.'},

{id:'e21',a:'exc',p:'¿Cuáles de estas son excepciones COMPROBADAS? (elige dos)',
 o:['IOException','NumberFormatException','InterruptedException','IllegalStateException'],k:[0,2],
 e:'Comprobada es toda la rama Exception salvo RuntimeException y sus descendientes. IOException e InterruptedException lo son y obligan a capturarlas o declararlas. NumberFormatException e IllegalStateException cuelgan de RuntimeException, así que el compilador no las exige.'},

{id:'e22',a:'exc',p:'¿Cuál de estos bloques NO compila?',c:`// A
try { m(); } catch (Exception e) { }
// B
try { m(); } finally { }
// C
try { m(); }
// D
try (Scanner s = new Scanner(System.in)) { }`,
 o:['El A','El B','El C','El D'],k:[2],
 e:'Un try suelto no compila: necesita al menos un catch o un finally. La única excepción es el try-with-resources, que puede ir sin ninguno de los dos porque el cierre ya está garantizado, como en el bloque D.'},

/* ---- ampliación: col ---- */
{id:'c7',a:'col',p:'¿Qué imprime?',c:`List<Integer> l = new ArrayList<>(List.of(10, 20, 30));
l.remove(1);
System.out.println(l);`,
 o:['[10, 20, 30]','[10, 30]','[20, 30]','[10, 20]'],k:[1],
 e:'Con un int literal gana la sobrecarga remove(int), que borra por ÍNDICE, no por valor. Se elimina el elemento de la posición 1, o sea el 20. Para borrar el valor 20 habría que escribir remove(Integer.valueOf(20)). Es la trampa más repetida de las colecciones.'},

{id:'c8',a:'col',p:'¿Qué ocurre?',c:`List<String> l = new ArrayList<>(List.of("a", "bb", "c"));
for (String s : l) {
    if (s.length() == 1) l.remove(s);
}
System.out.println(l);`,
 o:['[bb]','Lanza ConcurrentModificationException','[a, bb, c]','Lanza UnsupportedOperationException'],k:[1],
 e:'Modificar la colección mientras la recorres con for-each lanza ConcurrentModificationException, y ocurre en un solo hilo pese al nombre. Las formas correctas son l.removeIf(s -> s.length() == 1) o recorrer con un Iterator y usar su método remove.'},

{id:'c9',a:'col',p:'¿Qué imprime?',c:`int[] a = {10, 20, 30};
System.out.println(Arrays.binarySearch(a, 25));`,
 o:['-1','-3','2','-2'],k:[1],
 e:'Cuando no encuentra el valor, binarySearch no devuelve -1: devuelve el negativo del punto de inserción menos uno. El 25 iría en la posición 2, así que el resultado es -(2)-1 = -3. Y si el array no está ordenado, el resultado es simplemente indefinido, sin aviso.'},

{id:'c10',a:'col',p:'¿Qué ocurre?',c:`Object[] o = new String[2];
o[0] = "vale";
o[1] = 42;`,
 o:['Compila y funciona','No compila la última línea','Lanza ArrayStoreException','Lanza ClassCastException'],k:[2],
 e:'Los arrays son covariantes: un String[] se puede asignar a un Object[] y el compilador lo acepta. El fallo aparece en ejecución al guardar un tipo incompatible. Las colecciones genéricas no tienen ese agujero, porque List<String> no es un List<Object>.'},

{id:'c11',a:'col',p:'¿Qué ocurre?',c:`List<String> l = List.of("a", "b");
l.set(0, "z");`,
 o:['Compila y cambia el elemento','Lanza UnsupportedOperationException','No compila','Lanza IllegalArgumentException'],k:[1],
 e:'Las colecciones de List.of son inmutables y cualquier método que las modifique lanza UnsupportedOperationException: add, remove, set, sort, clear o replaceAll. Compila porque set forma parte de la interfaz List; el fallo es en ejecución.'},

{id:'c12',a:'col',p:'¿Qué ocurre?',c:`Set<String> s = Set.of("a", "b", "a");`,
 o:['Crea un conjunto de 2 elementos','Lanza IllegalArgumentException','Lanza NullPointerException','No compila'],k:[1],
 e:'Las fábricas Set.of y Map.of rechazan duplicados con IllegalArgumentException en vez de descartarlos en silencio, para delatar el error. Y todas ellas rechazan null con NullPointerException, a diferencia de HashSet o HashMap, que sí lo admiten.'},

{id:'c13',a:'col',p:'¿Qué imprime?',c:`String[] arr = {"a", "b"};
List<String> l = Arrays.asList(arr);
l.set(0, "z");
System.out.println(arr[0]);`,
 o:['a','z','null','Lanza UnsupportedOperationException'],k:[1],
 e:'Arrays.asList devuelve una vista de tamaño fijo respaldada por el array original: set sí funciona y el cambio se refleja en el array. Lo que no se puede es añadir ni borrar, que sí lanzaría UnsupportedOperationException. No confundirla con List.of, que es totalmente inmutable.'},

{id:'c14',a:'col',p:'¿Qué imprime?',c:`Map<String,Integer> m = new HashMap<>();
for (String p : List.of("sol", "mar", "sol")) {
    m.merge(p, 1, Integer::sum);
}
System.out.println(m.get("sol") + " " + m.get("mar"));`,
 o:['1 y 1','2 y 1','3 y 1','null y null'],k:[1],
 e:'merge guarda el valor directamente si la clave falta o vale null, y en caso contrario aplica la función al valor viejo y al nuevo. Es la forma idiomática de contar. Si la función devolviera null, la entrada se borraría del mapa.'},

{id:'c15',a:'col',p:'¿Qué imprime?',c:`Map<String,List<String>> m = new HashMap<>();
m.computeIfAbsent("lunes", k -> new ArrayList<>()).add("gimnasio");
m.computeIfAbsent("lunes", k -> new ArrayList<>()).add("compra");
System.out.println(m);`,
 o:['{lunes=[compra]}','{lunes=[gimnasio, compra]}','{lunes=[gimnasio]}','Lanza NullPointerException'],k:[1],
 e:'computeIfAbsent solo llama a la función si la clave falta o su valor es null, y devuelve el valor que queda asociado. La segunda llamada encuentra la lista ya creada y le añade el segundo elemento. Es el patrón estándar para mapas de listas.'},

{id:'c16',a:'col',p:'¿Qué imprime?',c:`Map<String,Integer> m = new HashMap<>();
System.out.println(m.getOrDefault("x", 0));
System.out.println(m.size());`,
 o:['0 y 1','0 y 0','null y 0','0 y luego lanza excepción'],k:[1],
 e:'getOrDefault solo consulta: devuelve el sustituto pero NO escribe nada en el mapa, que sigue vacío. El que sí escribe es putIfAbsent. Confundirlos es un fallo típico en las preguntas que imprimen el tamaño del mapa al final.'},

{id:'c17',a:'col',p:'¿Qué ocurre?',c:`Map<String,Integer> a = new HashMap<>();
a.put(null, 1);
Map<String,Integer> b = new TreeMap<>();
b.put(null, 1);`,
 o:['Las dos funcionan','La primera funciona, la segunda lanza NullPointerException','Las dos lanzan NullPointerException','La primera lanza NullPointerException'],k:[1],
 e:'HashMap admite una clave null y tantos valores null como quieras. TreeMap no, porque tendría que comparar esa clave para colocarla en el orden. Por el mismo motivo TreeSet tampoco acepta null, y ArrayDeque tampoco, pero ahí es porque null es su valor especial de cola vacía.'},

{id:'c18',a:'col',p:'¿Qué imprime?',c:`List<String> l = new ArrayList<>(List.of("a", "b", "c"));
l.addFirst("z");
System.out.println(l.getFirst() + " " + l.getLast() + " " + l.reversed());`,
 o:['z c [c, b, a, z]','a c [c, b, a]','z c [z, a, b, c]','No compila en Java 21'],k:[0],
 e:'SequencedCollection, novedad de Java 21, añade a List los métodos addFirst, addLast, getFirst, getLast, removeFirst, removeLast y reversed. Este último devuelve una VISTA invertida conectada al original, no una copia: modificarla modifica la lista de partida.'},

{id:'c19',a:'col',p:'¿Qué ocurre?',c:`SortedSet<Integer> s = new TreeSet<>(Set.of(5, 10));
s.addFirst(1);`,
 o:['El conjunto queda [1, 5, 10]','Lanza UnsupportedOperationException','No compila','El conjunto queda [1, 5, 10] pero desordenado'],k:[1],
 e:'SortedSet implementa SequencedCollection, pero addFirst y addLast lanzan UnsupportedOperationException: la posición la decide el comparador, no tú. Sí funcionan getFirst, getLast y reversed. Y HashSet directamente no es una SequencedCollection, porque no tiene ningún orden.'},

{id:'c20',a:'col',p:'¿Qué ordena realmente este comparador?',c:`Comparator.comparing(Libro::getAutor)
          .thenComparing(Libro::getTitulo)
          .reversed()`,
 o:['Autor ascendente, título descendente','Autor y título, los dos descendentes','Autor descendente, título ascendente','Solo por autor descendente'],k:[1],
 e:'reversed() invierte TODA la cadena construida hasta ese punto, no solo el último criterio. Para invertir un único paso hay que hacerlo dentro de ese paso: thenComparing(Libro::getTitulo, Comparator.reverseOrder()).'},

{id:'c21',a:'col',p:'¿Qué ocurre?',c:`class Punto { int x; }

Set<Punto> s = new TreeSet<>();
s.add(new Punto());`,
 o:['Compila y funciona','No compila','Lanza ClassCastException al añadir','Lanza NullPointerException'],k:[2],
 e:'TreeSet necesita ordenar, así que sus elementos deben implementar Comparable o hay que darle un Comparator en el constructor. Punto no lo hace. Compila porque el problema solo se ve en ejecución, y el fallo salta ya en el primer add, cuando intenta comparar el elemento consigo mismo para validar el tipo.'},

{id:'c22',a:'col',p:'¿Qué imprime?',c:`class P {
    final int x;
    P(int x) { this.x = x; }
    @Override public boolean equals(Object o) {
        return o instanceof P p && p.x == x;
    }
}
Set<P> s = new HashSet<>();
s.add(new P(1));
s.add(new P(1));
System.out.println(s.size());`,
 o:['1','2','0','Lanza excepción'],k:[1],
 e:'Se sobrescribió equals pero no hashCode, así que los dos objetos, siendo iguales, obtienen códigos distintos y caen en cubos distintos: el HashSet nunca llega a compararlos. Hay que sobrescribir los dos siempre, o usar un record, que los genera bien.'},

{id:'c23',a:'col',p:'¿Qué imprime?',c:`List<Integer> clave = new ArrayList<>(List.of(1));
Map<List<Integer>,String> m = new HashMap<>();
m.put(clave, "valor");
clave.add(2);
System.out.println(m.get(clave));`,
 o:['valor','null','Lanza ConcurrentModificationException','[1, 2]'],k:[1],
 e:'Al mutar la clave cambia su hashCode, pero la entrada sigue guardada en el cubo antiguo: queda inalcanzable con get y con remove, aunque siga ocupando sitio. Por eso las claves de un mapa deben ser inmutables, y los records encajan tan bien en ese papel.'},

{id:'c24',a:'col',p:'¿Cuál de estas dos líneas NO compila?',c:`List<? extends Number> a = new ArrayList<Integer>();
a.add(1);                       // línea 1

List<? super Integer> b = new ArrayList<Number>();
b.add(1);                       // línea 2`,
 o:['La 1','La 2','Las dos','Ninguna'],k:[0],
 e:'Con ? extends no se puede añadir nada salvo null, porque el compilador no sabe cuál es el tipo exacto: la lista podría ser de Double. Con ? super sí se puede añadir un Integer, aunque al leer solo obtengas Object. Es la regla PECS: productor extends, consumidor super.'},

{id:'c25',a:'col',p:'¿Cuál de estas comprobaciones compila?',c:`Object o = new ArrayList<String>();

if (o instanceof List<String>) { }   // A
if (o instanceof List<?>) { }        // B
if (o instanceof List) { }           // C`,
 o:['Solo la A','La B y la C','Las tres','Solo la C'],k:[1],
 e:'Por el borrado de tipos, en ejecución no queda rastro del parámetro genérico, así que no se puede comprobar con instanceof un tipo parametrizado concreto. Sí valen el comodín sin límite y el tipo crudo. Del borrado salen también las prohibiciones de new T() y new T[10].'},

{id:'c26',a:'col',p:'¿Qué imprime?',c:`Deque<Integer> pila = new ArrayDeque<>();
pila.push(1);
pila.push(2);
pila.push(3);
System.out.println(pila.pop() + " " + pila);`,
 o:['1 y [2, 3]','3 y [2, 1]','1 y [3, 2]','3 y [1, 2]'],k:[1],
 e:'Como pila, push inserta por el PRINCIPIO y pop saca del principio, así que sale el último que entró. Usada como cola serían offer y poll, con salida por el otro extremo. ArrayDeque es la implementación recomendada tanto para pila como para cola, por delante de Stack y LinkedList.'},

/* ---- ampliación: str ---- */
{id:'s7',a:'str',p:'¿Qué imprime?',c:`Stream.of("a", "b")
      .peek(System.out::println)
      .map(String::toUpperCase);`,
 o:['a y b','A y B','No imprime nada','No compila'],k:[2],
 e:'Los streams son perezosos: las operaciones intermedias solo montan la tubería y no ejecutan nada hasta que llega una operación terminal. Aquí no hay ninguna, así que no se procesa ni un elemento. Es una pregunta habitual y la respuesta es que la salida está vacía.'},

{id:'s8',a:'str',p:'¿Qué ocurre?',c:`Stream<String> s = Stream.of("a", "b");
System.out.println(s.count());
System.out.println(s.findFirst());`,
 o:['2 y Optional[a]','2 y Optional.empty','2 y lanza IllegalStateException','No compila'],k:[2],
 e:'Un stream se consume una sola vez. Tras una operación terminal queda cerrado, y volver a usarlo lanza IllegalStateException con el mensaje de que ya fue operado o cerrado. Si necesitas recorrerlo dos veces hay que crear dos streams desde la fuente.'},

{id:'s9',a:'str',p:'¿Qué imprime?',c:`Stream.of("a", "b", "c")
      .peek(s -> System.out.print("peek" + s + " "))
      .filter(s -> !s.equals("a"))
      .findFirst();`,
 o:['peeka peekb peekc','peeka peekb','peekb','No imprime nada'],k:[1],
 e:'El procesamiento es vertical: cada elemento recorre la tubería entera antes de que empiece el siguiente. La "a" pasa por peek y la descarta el filtro; la "b" pasa por peek, supera el filtro y findFirst corta ahí. La "c" no llega a mirarse.'},

{id:'s10',a:'str',p:'¿Qué imprime?',c:`long n = Stream.of("a", "b", "c")
                .peek(System.out::print)
                .count();
System.out.println(n);`,
 o:['abc3','3','abc y luego 3 en otra línea','0'],k:[1],
 e:'Desde Java 9, count() puede saltarse la tubería entera si conoce el tamaño de la fuente y ninguna operación lo altera. peek no añade ni quita elementos, así que no llega a ejecutarse y no se imprime nada antes del 3. Con un filter intermedio sí se recorrería.'},

{id:'s11',a:'str',p:'¿Qué imprime?',c:`Stream<String> v = Stream.empty();
System.out.println(Stream.<String>empty().anyMatch(s -> true));
System.out.println(Stream.<String>empty().allMatch(s -> false));
System.out.println(Stream.<String>empty().noneMatch(s -> true));`,
 o:['false true true','false false false','true true true','false true false'],k:[0],
 e:'Sobre un stream vacío, anyMatch es false porque no hay ningún elemento que cumpla, mientras que allMatch y noneMatch son las dos true porque no existe ningún contraejemplo. Es la llamada verdad vacua y la preguntan con frecuencia.'},

{id:'s12',a:'str',p:'¿Qué imprime?',c:`System.out.println(Stream.of(1, 2, 3).reduce(0, Integer::sum));
System.out.println(Stream.of(1, 2, 3).reduce(Integer::sum));`,
 o:['6 y 6','6 y Optional[6]','Optional[6] y 6','6 y Optional.empty'],k:[1],
 e:'Con identidad, reduce devuelve directamente el tipo y sobre un stream vacío devolvería la identidad. Sin identidad no puede garantizar resultado, así que devuelve un Optional. La identidad debe ser un neutro real: 0 para sumar y 1 para multiplicar.'},

{id:'s13',a:'str',p:'¿Qué imprime?',c:`List<List<String>> l = List.of(List.of("a", "b"), List.of("c"));
System.out.println(l.stream().flatMap(List::stream).count());
System.out.println(l.stream().map(List::stream).count());`,
 o:['3 y 2','3 y 3','2 y 2','2 y 3'],k:[0],
 e:'flatMap convierte cada elemento en un stream y funde todos en uno solo, así que cuenta los tres elementos internos. map deja un stream de streams, con solo dos elementos, que es justo el error que flatMap resuelve. Es el mismo par que map y flatMap en Optional.'},

{id:'s14',a:'str',p:'¿Qué imprime?',c:`Stream.of(2, 4, 6, 3, 8)
      .takeWhile(n -> n % 2 == 0)
      .forEach(System.out::print);`,
 o:['2468','246','24683','No imprime nada'],k:[1],
 e:'takeWhile toma elementos mientras se cumpla la condición y PARA en el primero que falla, sin volver a mirar el resto: el 8 no llega a considerarse. Un filter con el mismo predicado sí lo incluiría y daría 2468. Con datos desordenados la diferencia es grande.'},

{id:'s15',a:'str',p:'¿Qué imprime?',c:`Stream.of(2, 4, 6, 3, 8)
      .dropWhile(n -> n % 2 == 0)
      .forEach(System.out::print);`,
 o:['38','3','2468','8'],k:[0],
 e:'dropWhile descarta elementos mientras se cumple la condición y, en cuanto uno falla, deja pasar TODO el resto sin volver a evaluar. Por eso el 8, aunque sea par, se emite. takeWhile y dropWhile son complementarios y juntos reconstruyen el stream original.'},

{id:'s16',a:'str',p:'¿Qué ocurre?',c:`Optional<String> a = Optional.of(null);`,
 o:['Crea un Optional vacío','Lanza NullPointerException','Compila y vale Optional[null]','No compila'],k:[1],
 e:'Optional.of exige un valor no nulo y lanza NullPointerException en el acto. Cuando el valor puede ser null hay que usar Optional.ofNullable, que devuelve un Optional vacío. Confundir los dos es de las preguntas más directas del tema.'},

{id:'s17',a:'str',p:'¿Qué imprime?',c:`static String log(String s) { System.out.print(s + " "); return s; }

Optional<String> o = Optional.of("valor");
o.orElse(log("A"));
o.orElseGet(() -> log("B"));`,
 o:['A B','A','B','No imprime nada'],k:[1],
 e:'El argumento de orElse se evalúa SIEMPRE, aunque el Optional tenga valor y el resultado se descarte. El de orElseGet es un Supplier que solo se ejecuta si está vacío. Con un cálculo caro o con efectos secundarios la diferencia importa, y es la pregunta estrella de Optional.'},

{id:'s18',a:'str',p:'¿Qué imprime?',c:`Optional<String> o = Optional.of("x").map(s -> null);
System.out.println(o);`,
 o:['Optional[null]','Optional.empty','Lanza NullPointerException','null'],k:[1],
 e:'Si la función de map devuelve null, el resultado es un Optional vacío, no un Optional que contenga null: por diseño nunca puede haber un null dentro. Si la función ya devuelve un Optional, hay que usar flatMap para no acabar con uno dentro de otro.'},

{id:'s19',a:'str',p:'¿Qué imprime?',c:`System.out.println(IntStream.of().sum());
System.out.println(IntStream.of().average());`,
 o:['0 y 0.0','0 y OptionalDouble.empty','OptionalInt.empty y OptionalDouble.empty','Lanza excepción'],k:[1],
 e:'Sobre un stream vacío la suma es 0, que es el neutro, pero la media no existe y por eso devuelve un OptionalDouble vacío. max y min devuelven también un Optional primitivo vacío. Y average() siempre devuelve OptionalDouble, incluso sobre un IntStream.'},

{id:'s20',a:'str',p:'¿Cuál de estas dos líneas NO compila?',c:`IntStream.range(0, 3).collect(Collectors.toList());        // A
IntStream.range(0, 3).boxed().collect(Collectors.toList()); // B`,
 o:['La A','La B','Las dos','Ninguna'],k:[0],
 e:'Un IntStream no tiene la versión de collect que recibe un Collector: trabaja con primitivos. Hay que convertirlo antes con boxed(), que lo pasa a Stream<Integer>, o quedarse con toArray(). Al revés, se pasa de objetos a primitivos con mapToInt.'},

{id:'s21',a:'str',p:'¿Qué ocurre?',c:`List<String> l = List.of("uno", "dos", "seis");
Map<Integer,String> m = l.stream()
    .collect(Collectors.toMap(String::length, s -> s));`,
 o:['{3=uno, 4=seis} descartando dos','Lanza IllegalStateException por clave duplicada','{3=dos, 4=seis}','No compila'],k:[1],
 e:'"uno" y "dos" tienen la misma longitud, así que generan la misma clave y toMap lanza IllegalStateException en vez de descartar en silencio. Se resuelve con el tercer argumento, la función de fusión: toMap(String::length, s -> s, (a, b) -> a + "|" + b).'},

{id:'s22',a:'str',p:'¿Qué imprime?',c:`List<String> l = List.of("uno", "dos", "tres", "seis");
System.out.println(l.stream().collect(
    Collectors.groupingBy(String::length, Collectors.counting())));`,
 o:['{3=[uno, dos], 4=[tres, seis]}','{3=2, 4=2}','{3=2.0, 4=2.0}','{uno=3, dos=3, tres=4, seis=4}'],k:[1],
 e:'groupingBy clasifica por la clave y, sin segundo argumento, mete una List en cada grupo. El colector de segundo nivel sustituye esa lista: counting() devuelve cuántos hay en cada grupo, y su tipo es Long, no Integer.'},

{id:'s23',a:'str',p:'¿Cuántas claves tiene el mapa resultante?',c:`List<Integer> l = List.of(1, 3, 5);
Map<Boolean,List<Integer>> m = l.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
System.out.println(m.size() + " " + m.get(true));`,
 o:['1 y null','2 y []','1 y []','2 y null'],k:[1],
 e:'partitioningBy devuelve SIEMPRE las dos claves, true y false, aunque un lado quede vacío, y en ese caso el valor es una lista vacía, no null. groupingBy, en cambio, solo crea las claves que aparecen de verdad. Preguntan justo por ese tamaño.'},

{id:'s24',a:'str',p:'¿Qué imprime?',c:`System.out.println(Stream.of("a", "b", "c")
    .collect(Collectors.joining(", ", "[", "]")));`,
 o:['[a, b, c]','a, b, c','[a][b][c]','[abc]'],k:[0],
 e:'joining admite tres argumentos: el separador, el prefijo y el sufijo. Con uno solo pone solo el separador y sin argumentos concatena sin nada. Solo funciona sobre streams de CharSequence, así que con números hay que mapear a String antes.'},

{id:'s25',a:'str',p:'¿Qué imprime?',c:`Function<Integer,Integer> doble = x -> x * 2;
Function<Integer,Integer> mas3 = x -> x + 3;
System.out.println(doble.andThen(mas3).apply(5));
System.out.println(doble.compose(mas3).apply(5));`,
 o:['13 y 16','16 y 13','13 y 13','16 y 16'],k:[0],
 e:'andThen aplica primero la función sobre la que llamas y luego la del argumento: (5*2)+3 = 13. compose va al revés, primero la del argumento: (5+3)*2 = 16. Recordar que compose se lee hacia atrás resuelve la pregunta.'},

{id:'s26',a:'str',p:'¿Qué imprime?',c:`Predicate<String> largo = s -> s.length() > 4;
Predicate<String> conA = s -> s.contains("a");
System.out.println(largo.and(conA).test("alfombra"));
System.out.println(largo.negate().test("hola"));
System.out.println(Predicate.not(largo).test("hola"));`,
 o:['true true true','true false false','false true true','true true false'],k:[0],
 e:'"alfombra" mide más de 4 y contiene una a, así que and da true. "hola" mide exactamente 4, así que largo es false y negate lo convierte en true. Predicate.not es el equivalente estático, útil con referencias a método como Predicate.not(String::isBlank).'},

{id:'s27',a:'str',p:'¿Cuál de estas referencias a método es INCORRECTA?',c:`Function<String,Integer> a = String::length;
BiPredicate<String,String> b = String::startsWith;
Supplier<List<String>> c = ArrayList::new;
Function<String,Integer> d = Integer::parseInt;
Consumer<String> e = System.out::println;`,
 o:['Ninguna, todas son correctas','La b','La c','La d'],k:[0],
 e:'Las cinco son válidas y cubren los cuatro tipos. String::length y String::startsWith son de instancia sobre un objeto cualquiera: el primer parámetro de la lambda hace de receptor, por eso una sirve para Function y la otra para BiPredicate. ArrayList::new es de constructor, Integer::parseInt estática y System.out::println de una instancia concreta.'},

{id:'s28',a:'str',p:'¿Cuántos elementos produce?',c:`Stream.iterate(1, n -> n < 20, n -> n * 2)
      .forEach(System.out::print);`,
 o:['Bucle infinito','5 elementos: 1 2 4 8 16','4 elementos: 1 2 4 8','1 solo elemento'],k:[1],
 e:'La versión de tres argumentos de iterate, añadida en Java 9, incluye la condición de parada y por tanto es finita: funciona como un for clásico. La de dos argumentos es infinita y obliga a cortar con limit o takeWhile.'},

{id:'s29',a:'str',p:'¿Qué problema tiene este código?',c:`Stream.iterate(1, n -> n + 1)
      .sorted()
      .limit(5)
      .forEach(System.out::println);`,
 o:['Ninguno, imprime 1 2 3 4 5','No termina nunca','No compila','Imprime en orden aleatorio'],k:[1],
 e:'sorted necesita ver todos los elementos antes de emitir el primero, y la fuente es infinita, así que nunca termina. Sobre streams infinitos, limit debe ir ANTES de las operaciones con estado como sorted o distinct.'},

{id:'s30',a:'str',p:'¿Por qué este código paralelo es incorrecto?',c:`List<Integer> destino = new ArrayList<>();
IntStream.range(0, 1000).parallel()
         .forEach(destino::add);`,
 o:['ArrayList no es seguro entre hilos y puede perder o corromper datos','No compila','Siempre lanza ConcurrentModificationException','Es correcto pero lento'],k:[0],
 e:'Escribir en una estructura compartida desde un stream paralelo produce resultados impredecibles, a veces sin lanzar ninguna excepción, que es lo peor. Lo correcto es recolectar con collect o toList, que ya saben combinar resultados parciales. Además la reducción debe ser asociativa y sin estado.'},

/* ---- ampliación: mod y conc ---- */
{id:'m6',a:'mod',p:'¿Qué consigue requires transitive?',c:`module a {
    requires transitive b;
}
module c {
    requires a;
}`,
 o:['Que c pueda usar b sin declararlo','Que a pueda usar b dos veces','Que b se cargue antes que a','Nada, es equivalente a requires'],k:[0],
 e:'La dependencia se contagia a quien te use: c obtiene acceso a b sin declararlo. Es lo correcto cuando tu API pública devuelve o recibe tipos que vienen de ese otro módulo, porque si no, quien te use no podría ni nombrarlos.'},

{id:'m7',a:'mod',p:'Si un módulo exporta com.tienda.api, ¿qué ocurre con com.tienda.api.dto?',
 o:['Se exporta también, es un subpaquete','No se exporta: hay que listarlo aparte','No compila','Se exporta solo si es público'],k:[1],
 e:'exports abre un paquete concreto y los subpaquetes NO se exportan en cascada: hay que listarlos uno a uno. En Java los paquetes no forman una jerarquía real a efectos de acceso, aunque el nombre lo parezca.'},

{id:'m8',a:'mod',p:'¿Cuál de estas cláusulas es redundante en cualquier module-info?',
 o:['requires java.sql','requires java.base','requires java.logging','requires transitive java.xml'],k:[1],
 e:'java.base contiene java.lang, java.util y lo esencial, y todos los módulos lo requieren implícitamente: escribirlo no aporta nada. Los demás módulos de la plataforma sí hay que pedirlos, y ese es un cambio incómodo al migrar desde la ruta de clases.'},

{id:'m9',a:'mod',p:'¿Cuál es la diferencia entre exports y opens?',
 o:['exports da acceso en compilación y ejecución; opens da acceso reflexivo profundo solo en ejecución','Son sinónimos','opens es para clases y exports para interfaces','exports solo funciona con requires transitive'],k:[0],
 e:'exports permite usar los tipos públicos del paquete con las reglas normales de visibilidad. opens permite además llegar por reflexión a los miembros privados, que es lo que necesitan los marcos de persistencia o los serializadores de JSON, pero no permite compilar contra ese paquete.'},

{id:'m10',a:'mod',p:'¿Por qué no compila?',c:`open module com.tienda {
    exports com.tienda.api;
    opens com.tienda.dto;
}`,
 o:['No se puede exportar y abrir a la vez','Un módulo open no admite cláusulas opens','Falta requires','open no es una palabra válida'],k:[1],
 e:'Declarar el módulo como open ya abre todos sus paquetes a la reflexión, así que una cláusula opens sería redundante y es error de compilación. Lo que sí es legal, en un módulo normal, es exportar y abrir el mismo paquete: son cosas independientes.'},

{id:'m11',a:'mod',p:'En el mecanismo de servicios, ¿qué declara el módulo CONSUMIDOR?',
 o:['provides ... with ...','requires del módulo proveedor','uses con el tipo del servicio','opens del paquete de la implementación'],k:[2],
 e:'El consumidor declara uses con la interfaz y luego busca implementaciones con ServiceLoader.load. Justamente NO declara requires del proveedor: esa es toda la gracia, evitar el acoplamiento. Quien declara provides ... with ... es el módulo que aporta la implementación.'},

{id:'m12',a:'mod',p:'Un jar sin module-info llamado commons-lang3-3.12.0.jar se coloca en la ruta de módulos. ¿Qué nombre recibe?',
 o:['commons-lang3-3.12.0','commons.lang3','commons_lang3','No recibe nombre: da error'],k:[1],
 e:'Se convierte en módulo automático. Si el manifiesto no declara Automatic-Module-Name, el nombre se deduce del archivo: se quita la extensión y la versión, y los guiones pasan a puntos. Un módulo automático exporta y abre todos sus paquetes y lee a todos los demás.'},

{id:'m13',a:'mod',p:'¿Qué ocurre si tu módulo nombrado necesita una biblioteca que está en la ruta de CLASES?',
 o:['Funciona con normalidad','No la ve: un módulo nombrado no puede leer el módulo sin nombre','La lee pero solo en ejecución','Se convierte en módulo automático'],k:[1],
 e:'Todo lo que está en la ruta de clases forma el módulo sin nombre, y un módulo nombrado no puede leerlo. Por eso al migrar hay que mover las dependencias a la ruta de módulos, aunque sea como automáticas. Al revés sí: el módulo sin nombre lee a todo el mundo.'},

{id:'m14',a:'mod',p:'¿Cuál es la forma abreviada de --module-path y --module?',
 o:['-mp y -m','-p y -m','-m y -p','-cp y -m'],k:[1],
 e:'--module-path se abrevia -p y --module se abrevia -m. La clase principal se indica como módulo/clase, por ejemplo java -p salida -m com.tienda/com.tienda.Main. No confundir -p con -cp, que es la ruta de clases de toda la vida.'},

{id:'m15',a:'mod',p:'¿Qué herramienta usarías para saber qué declara un jar ya construido?',
 o:['jar --describe-module','jlink --describe','jmod --list','javac --module-info'],k:[0],
 e:'jar --describe-module resume los requires, exports y provides de un jar modular. La opción equivalente en el lanzador es java --describe-module, y para ver los módulos disponibles, java --list-modules.'},

{id:'m16',a:'mod',p:'¿Para qué sirve jdeps --jdk-internals?',
 o:['Genera un module-info','Delata el uso de clases internas del JDK','Crea una imagen reducida','Empaqueta módulos nativos'],k:[1],
 e:'Señala las dependencias sobre API internas del JDK, que ya no son accesibles y hay que sustituir antes de migrar. jdeps también tiene --generate-module-info, que escribe un borrador del descriptor, y -s para un resumen.'},

{id:'m17',a:'mod',p:'¿Cuál es la diferencia entre jlink y jmod?',
 o:['jlink crea una imagen de ejecución reducida; jmod empaqueta contenido que un jar no admite','Son la misma herramienta con distinto nombre','jmod ejecuta y jlink compila','jlink solo funciona con módulos automáticos'],k:[0],
 e:'jlink toma tus módulos y solo los de la plataforma necesarios y produce un runtime completo mucho más pequeño que un JDK entero. jmod crea archivos .jmod para cosas que un jar no puede llevar, como bibliotecas nativas, y sirve en compilación y enlace, pero un .jmod no se ejecuta.'},

{id:'m18',a:'mod',p:'¿Qué es un paquete dividido y por qué importa?',
 o:['Un paquete con clases públicas y privadas','El mismo paquete aportado por dos módulos al mismo consumidor, y está prohibido','Un paquete exportado y abierto a la vez','Un paquete sin module-info'],k:[1],
 e:'Dos módulos no pueden aportar el mismo paquete al mismo consumidor. Es el problema que más aparece al migrar bibliotecas antiguas que repartían un paquete entre varios jar, y se resuelve fusionándolos o renombrando.'},

{id:'m19',a:'mod',p:'¿Se permiten dependencias cíclicas entre módulos nombrados?',
 o:['Sí, si son transitivas','No: es error de compilación','Sí, pero avisa','Solo entre módulos automáticos'],k:[1],
 e:'Si a requiere b, b no puede requerir a ni directamente ni por una cadena: el sistema de módulos lo rechaza al compilar. Dentro de un mismo módulo las clases sí pueden referirse entre sí en círculo; la prohibición es solo entre módulos.'},

{id:'m20',a:'mod',p:'¿Es legal usar module como nombre de variable en una clase normal?',c:`int module = 5;
int requires = 10;`,
 o:['No: son palabras reservadas','Sí: son palabras restringidas, solo especiales dentro de module-info','Solo module es legal','Solo compila con una opción del compilador'],k:[1],
 e:'module, requires, exports, opens, uses, provides y to son palabras restringidas: solo tienen significado especial dentro de module-info.java. En cualquier otro sitio siguen siendo identificadores válidos, y así el código antiguo no se rompió al llegar los módulos.'},

/* ---- concurrencia ---- */
{id:'k7',a:'conc',p:'¿Cuántos hilos se crean?',c:`Runnable r = () -> System.out.println(Thread.currentThread().getName());
Thread t = new Thread(r);
t.run();`,
 o:['Uno nuevo','Ninguno nuevo: run() se ejecuta en el hilo actual','Dos','Lanza IllegalThreadStateException'],k:[1],
 e:'Llamar a run() directamente es una llamada de método corriente: se ejecuta de forma síncrona en el hilo actual, que imprimirá main. Quien crea un hilo nuevo es start(). Es la confusión fundamental del tema y la preguntan casi siempre.'},

{id:'k8',a:'conc',p:'¿Qué ocurre?',c:`Thread t = new Thread(() -> {});
t.start();
t.join();
t.start();`,
 o:['Se ejecuta dos veces','Lanza IllegalThreadStateException','No compila','No hace nada la segunda vez'],k:[1],
 e:'Un hilo no se puede reiniciar: una vez terminado queda en estado TERMINATED y volver a arrancarlo lanza IllegalThreadStateException. Hay que crear un Thread nuevo. Lo mismo pasa al llamar a setDaemon después de start.'},

{id:'k9',a:'conc',p:'¿En qué estado está un hilo que espera dentro de Thread.sleep(1000)?',
 o:['BLOCKED','WAITING','TIMED_WAITING','RUNNABLE'],k:[2],
 e:'Con plazo definido el estado es TIMED_WAITING, que cubre sleep, join con milisegundos y wait con plazo. WAITING es la espera indefinida y BLOCKED es específicamente esperar a entrar en un bloque synchronized. Los seis estados están en el enum Thread.State.'},

{id:'k10',a:'conc',p:'¿Qué ocurre?',c:`Thread v = Thread.ofVirtual().unstarted(() -> {});
v.setDaemon(false);`,
 o:['Funciona: el hilo deja de ser daemon','Lanza IllegalArgumentException','No compila','Funciona pero se ignora'],k:[1],
 e:'Los hilos virtuales son SIEMPRE daemon y no se puede cambiar: setDaemon(false) lanza IllegalArgumentException. Tampoco tienen prioridad ajustable, setPriority no hace nada. Por eso conviene esperarlos con join o con el cierre de un ejecutor.'},

{id:'k11',a:'conc',p:'¿Qué problema tiene bloquearse dentro de un bloque synchronized en un hilo virtual?',
 o:['Ninguno, es lo recomendado','Ancla el hilo portador y se pierde la ventaja','Lanza una excepción','Convierte el hilo en plataforma'],k:[1],
 e:'Es el anclaje o pinning: el hilo virtual no puede desmontarse del portador mientras está dentro del monitor, así que retiene un hilo del sistema y desaparece el beneficio. La recomendación es usar ReentrantLock en el código que vaya a bloquearse.'},

{id:'k12',a:'conc',p:'¿Qué hace el cierre de este try-with-resources?',c:`try (var ex = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 5; i++) ex.submit(tarea);
}`,
 o:['Cancela las tareas pendientes','Llama a shutdown y espera a que terminen todas','No hace nada','Lanza excepción si hay tareas vivas'],k:[1],
 e:'Desde Java 19 ExecutorService implementa AutoCloseable, y close() hace shutdown y espera a la terminación. Es la forma recomendada en Java 21 y evita el olvido más habitual: dejar el ejecutor vivo, con lo que el programa nunca termina.'},

{id:'k13',a:'conc',p:'Si la tarea lanza una excepción, ¿dónde se ve?',c:`Future<Integer> f = ex.submit(() -> { throw new RuntimeException("uy"); });`,
 o:['Se imprime al momento en la consola','Al llamar a f.get(), envuelta en ExecutionException','Se pierde siempre','Al llamar a f.isDone()'],k:[1],
 e:'Con submit la excepción se guarda en el Future y sale envuelta en ExecutionException al llamar a get(), recuperable con getCause(). Con execute, en cambio, se va al manejador de excepciones no capturadas y es fácil que pase inadvertida. Por eso submit suele ser mejor.'},

{id:'k14',a:'conc',p:'¿Cuál es la diferencia entre invokeAll e invokeAny?',
 o:['invokeAll espera a todas; invokeAny devuelve el resultado de la primera que acabe bien y cancela el resto','invokeAll es paralelo e invokeAny secuencial','invokeAny espera a todas','No hay diferencia'],k:[0],
 e:'invokeAll bloquea hasta que terminan todas y devuelve la lista de Future ya completados. invokeAny devuelve directamente el resultado de la primera que termine correctamente y cancela las demás, lo que sirve para consultar varias fuentes y quedarse con la más rápida.'},

{id:'k15',a:'conc',p:'¿Cuál es la diferencia entre shutdown y shutdownNow?',
 o:['shutdown deja acabar lo pendiente; shutdownNow interrumpe lo que corre y devuelve lo que no empezó','shutdown bloquea y shutdownNow no','Son equivalentes','shutdownNow es más lento'],k:[0],
 e:'shutdown deja de admitir tareas nuevas pero termina las encoladas. shutdownNow intenta interrumpir las que están en marcha y devuelve la lista de las que nunca llegaron a empezar. Ninguno de los dos bloquea: para esperar está awaitTermination.'},

{id:'k16',a:'conc',p:'¿Qué ocurre al enviar una tarea a un ejecutor ya apagado?',
 o:['Se encola para más tarde','Lanza RejectedExecutionException','Se ignora en silencio','Reactiva el ejecutor'],k:[1],
 e:'Tras shutdown, cualquier submit o execute lanza RejectedExecutionException. Un ejecutor no se puede reabrir: hay que crear otro. Ese comportamiento lo decide la política de rechazo del pool, configurable si lo construyes con ThreadPoolExecutor.'},

{id:'k17',a:'conc',p:'¿Es seguro este contador con varios hilos?',c:`private volatile int n = 0;
public void subir() { n++; }`,
 o:['Sí: volatile lo hace atómico','No: volatile garantiza visibilidad, no atomicidad','Sí, si los hilos son virtuales','No compila'],k:[1],
 e:'volatile asegura que cada lectura ve la última escritura, pero n++ son tres operaciones (leer, sumar, escribir) y dos hilos pueden intercalarlas y perder incrementos. Para esto se usa AtomicInteger o un bloque synchronized. volatile encaja bien en una bandera booleana de parada.'},

{id:'k18',a:'conc',p:'¿Se excluyen entre sí estos dos métodos?',c:`class C {
    synchronized void a() { }
    static synchronized void b() { }
}`,
 o:['Sí, comparten el mismo cerrojo','No: uno usa this y el otro el objeto Class','Sí, si se llaman desde el mismo hilo','No compila'],k:[1],
 e:'Un método de instancia sincroniza sobre this y uno estático sobre el objeto Class, que son cerrojos distintos, así que pueden ejecutarse a la vez. Es una pregunta muy repetida, y la razón por la que conviene usar objetos de cerrojo privados y explícitos.'},

{id:'k19',a:'conc',p:'¿Qué le falta a este código?',c:`Lock l = new ReentrantLock();
l.lock();
hacerAlgo();
l.unlock();`,
 o:['Nada, está bien','El unlock debe ir en un finally','Falta declarar el Lock como volatile','Falta tryLock'],k:[1],
 e:'Si hacerAlgo lanza una excepción, el unlock nunca se ejecuta y el cerrojo queda cogido para siempre: todos los demás hilos se quedan esperando. Siempre lock() fuera del try y unlock() en el finally. synchronized no tiene ese problema porque suelta el monitor solo.'},

{id:'k20',a:'conc',p:'¿Qué imprime?',c:`AtomicInteger n = new AtomicInteger(5);
System.out.println(n.getAndIncrement());
System.out.println(n.incrementAndGet());
System.out.println(n.get());`,
 o:['5, 7 y 7','6, 7 y 7','5, 6 y 7','6, 6 y 7'],k:[0],
 e:'getAndIncrement devuelve el valor ANTERIOR, 5, y deja 6. incrementAndGet incrementa primero y devuelve el nuevo, 7. El patrón de nombres es sistemático: getAndAlgo devuelve lo viejo y algoAndGet lo ya modificado.'},

{id:'k21',a:'conc',p:'¿Qué imprime?',c:`List<String> l = new CopyOnWriteArrayList<>(List.of("a", "b"));
for (String s : l) {
    l.add("nuevo");
}
System.out.println(l.size());`,
 o:['Lanza ConcurrentModificationException','4','Bucle infinito','2'],k:[1],
 e:'El iterador de una colección de copia al escribir trabaja sobre una foto fija del momento en que se creó, así que no lanza excepción ni ve las adiciones: el bucle da exactamente dos vueltas y añade dos elementos. Con un ArrayList esto lanzaría ConcurrentModificationException.'},

{id:'k22',a:'conc',p:'¿Es atómica esta secuencia sobre un ConcurrentHashMap?',c:`if (!m.containsKey(k)) {
    m.put(k, valor);
}`,
 o:['Sí, el mapa es concurrente','No: entre las dos llamadas puede colarse otro hilo','Sí, si el valor es inmutable','No compila'],k:[1],
 e:'Cada método por separado es seguro, pero la secuencia de dos no lo es: otro hilo puede insertar entre el containsKey y el put. Para eso existen las operaciones compuestas atómicas: putIfAbsent, computeIfAbsent, compute y merge.'},

{id:'k23',a:'conc',p:'¿Cuál es el tipo del resultado?',c:`CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> "id");
var r = cf.thenApply(id -> buscarUsuario(id));
// buscarUsuario devuelve CompletableFuture<Usuario>`,
 o:['CompletableFuture<Usuario>','CompletableFuture<CompletableFuture<Usuario>>','Usuario','No compila'],k:[1],
 e:'thenApply envuelve el resultado, así que si la función ya devuelve un CompletableFuture acabas con uno dentro de otro. Lo que aplana es thenCompose, el equivalente de flatMap. Para combinar dos etapas independientes que van en paralelo se usa thenCombine.'},

{id:'k24',a:'conc',p:'¿Cuál es la diferencia entre get() y join() en CompletableFuture?',
 o:['get lanza excepciones comprobadas; join lanza CompletionException, que no lo es','join no bloquea','get es más rápido','No hay diferencia'],k:[0],
 e:'get() declara InterruptedException y ExecutionException, así que obliga a un try-catch. join() lanza CompletionException, no comprobada, y por eso encaja dentro de una lambda sin ensuciar el código. En ambos casos la excepción original va dentro y se saca con getCause().'},

/* ---- ampliación: io ---- */
{id:'i6',a:'io',p:'¿Qué devuelven al llegar al final del archivo?',c:`BufferedReader br = ...;
br.readLine();
InputStream in = ...;
in.read();`,
 o:['Los dos devuelven -1','Los dos devuelven null','readLine devuelve null y read devuelve -1','readLine devuelve "" y read devuelve 0'],k:[2],
 e:'readLine devuelve null al agotar el archivo y read devuelve -1. Confundirlos hace que el bucle no termine o termine antes de tiempo. Además readLine no incluye el salto de línea en lo que devuelve, y una línea vacía devuelve cadena vacía, no null.'},

{id:'i7',a:'io',p:'¿Qué ocurre?',c:`Path p = Path.of("/no/existe/nada.txt");
System.out.println(p.getFileName());
System.out.println(p.getParent());`,
 o:['Lanza NoSuchFileException','Imprime nada.txt y /no/existe','Imprime null y null','No compila'],k:[1],
 e:'Los métodos de Path son puramente sintácticos: trabajan con el texto de la ruta y NO tocan el disco, así que no importa que el archivo no exista. Quien accede de verdad al sistema de archivos es la clase Files. Es el concepto central de NIO.2.'},

{id:'i8',a:'io',p:'¿Qué imprime?',c:`Path base = Path.of("/datos/informes");
System.out.println(base.resolve("marzo.txt"));
System.out.println(base.resolve("/otro/sitio.txt"));`,
 o:['/datos/informes/marzo.txt y /datos/informes/otro/sitio.txt','/datos/informes/marzo.txt y /otro/sitio.txt','Los dos concatenados','Lanza IllegalArgumentException'],k:[1],
 e:'resolve concatena, pero si el argumento es una ruta ABSOLUTA descarta por completo la base y devuelve el argumento tal cual. Es la regla que más preguntan de resolve. Para reemplazar el último segmento en vez de añadir existe resolveSibling.'},

{id:'i9',a:'io',p:'¿Qué ocurre?',c:`Path a = Path.of("/datos/informes");
Path b = Path.of("relativa/x.txt");
System.out.println(a.relativize(b));`,
 o:['../relativa/x.txt','Lanza IllegalArgumentException','/datos/informes/relativa/x.txt','relativa/x.txt'],k:[1],
 e:'relativize exige que las dos rutas sean del mismo tipo: ambas absolutas o ambas relativas. Mezclarlas lanza IllegalArgumentException, porque no hay forma de calcular el camino entre ellas. Entre dos absolutas sí funciona y usa dos puntos para subir.'},

{id:'i10',a:'io',p:'¿Qué imprime?',c:`System.out.println(Path.of("/datos/./informes/../copias").normalize());`,
 o:['/datos/copias','/datos/informes/copias','/datos/./informes/../copias','Lanza excepción si no existe'],k:[0],
 e:'normalize limpia el texto de la ruta: elimina los puntos redundantes y resuelve los dobles puntos. Sigue sin tocar el disco. No confundirlo con toRealPath(), que sí accede, resuelve enlaces simbólicos y exige que el archivo exista.'},

{id:'i11',a:'io',p:'¿Qué imprime?',c:`Path p = Path.of("/datos/informes/marzo.txt");
System.out.println(p.getNameCount());
System.out.println(p.getName(0));
System.out.println(p.subpath(0, 2));`,
 o:['4, / y /datos/informes','3, datos y datos/informes','3, /datos y /datos/informes','4, datos y datos/informes'],k:[1],
 e:'La raíz NO cuenta como segmento: hay tres nombres y getName(0) es datos, no la barra. Además getName y subpath devuelven siempre rutas RELATIVAS, sin la raíz, aunque la original fuese absoluta. En subpath el índice final es exclusivo.'},

{id:'i12',a:'io',p:'¿Qué le falta a este código?',c:`Stream<String> lineas = Files.lines(Path.of("a.txt"));
lineas.forEach(System.out::println);`,
 o:['Nada, está bien','Cerrar el stream: mantiene abierto un recurso del sistema','Un catch de FileNotFoundException','Convertirlo a lista antes'],k:[1],
 e:'Los métodos de Files que devuelven Stream (lines, walk, list, find) mantienen abierto un descriptor y deben usarse dentro de un try-with-resources. readAllLines no lo necesita porque lee todo y cierra sola, a costa de cargar el archivo entero en memoria.'},

{id:'i13',a:'io',p:'¿Cuál es la diferencia entre Files.delete y Files.deleteIfExists?',
 o:['delete lanza NoSuchFileException si no existe; deleteIfExists devuelve false','delete borra recursivamente','deleteIfExists lanza si no existe','No hay diferencia'],k:[0],
 e:'delete falla con NoSuchFileException cuando el archivo no está, mientras que deleteIfExists devuelve un boolean y no protesta. Ninguno de los dos borra recursivamente: sobre un directorio con contenido lanzan DirectoryNotEmptyException.'},

{id:'i14',a:'io',p:'¿Qué ocurre al borrar un directorio que contiene archivos?',c:`Files.delete(Path.of("carpeta"));`,
 o:['Lo borra con todo su contenido','Lanza DirectoryNotEmptyException','Lanza IOException genérica','Borra solo los archivos'],k:[1],
 e:'Files.delete exige que el directorio esté vacío. No existe un borrado recursivo en la API: hay que recorrer con Files.walk y borrar de dentro hacia fuera, normalmente ordenando las rutas en orden inverso.'},

{id:'i15',a:'io',p:'¿Cuál es la diferencia entre createDirectory y createDirectories?',
 o:['createDirectories crea los padres que falten y no falla si ya existe','createDirectory es recursivo','Son equivalentes','createDirectories solo funciona en Linux'],k:[0],
 e:'createDirectory exige que el padre exista y lanza si el directorio ya está. createDirectories crea toda la cadena que falte y no protesta si ya existía, así que es la que se usa casi siempre. createFile, en cambio, sí lanza FileAlreadyExistsException.'},

{id:'i16',a:'io',p:'¿Qué le pasa al contenido anterior del archivo?',c:`Files.writeString(Path.of("a.txt"), "nuevo");`,
 o:['Se conserva y añade al final','Se borra: por defecto trunca el archivo','Lanza FileAlreadyExistsException','Depende del sistema operativo'],k:[1],
 e:'Sin opciones explícitas, escribir equivale a CREATE, TRUNCATE_EXISTING y WRITE: machaca lo que hubiera. Para añadir hay que pasar StandardOpenOption.APPEND. Es un error caro, porque destruye datos en silencio.'},

{id:'i17',a:'io',p:'¿Qué ocurre?',c:`Files.writeString(p, "x",
    StandardOpenOption.APPEND,
    StandardOpenOption.TRUNCATE_EXISTING);`,
 o:['Añade al final','Vacía y escribe','Lanza IllegalArgumentException','No compila'],k:[2],
 e:'Las dos opciones se contradicen: una dice añadir al final y la otra vaciar el archivo. La combinación lanza IllegalArgumentException en ejecución. Compila porque son constantes de un enum y el compilador no valida su coherencia.'},

{id:'i18',a:'io',p:'¿Qué ocurre si el destino ya existe?',c:`Files.copy(origen, destino);`,
 o:['Lo sobrescribe','Lanza FileAlreadyExistsException','Lo renombra','No hace nada'],k:[1],
 e:'Sin StandardCopyOption.REPLACE_EXISTING la copia falla si el destino existe. Otras opciones útiles son COPY_ATTRIBUTES, que conserva las marcas de tiempo, y ATOMIC_MOVE, exclusiva de move, que puede fallar si origen y destino están en sistemas de archivos distintos.'},

{id:'i19',a:'io',p:'¿Qué valor tiene clave tras deserializar el objeto?',c:`class Cliente implements Serializable {
    String nombre = "Ana";
    transient String clave = "secreto";
    static int contador = 7;
}`,
 o:['secreto','null','cadena vacía','Lanza NotSerializableException'],k:[1],
 e:'Los campos transient no se guardan y al recuperar el objeto quedan con el valor por defecto de su tipo: null para referencias, 0 para números y false para boolean. No recuperan el valor del inicializador, porque al deserializar no se ejecutan ni los inicializadores ni el constructor. Los static tampoco se serializan: pertenecen a la clase.'},

{id:'i20',a:'io',p:'¿Qué se ejecuta al deserializar un objeto de tipo Hija?',c:`class Base { }                                 // NO serializable
class Hija extends Base implements Serializable { }`,
 o:['Los constructores de Base y de Hija','Solo el constructor sin argumentos de Base','Solo el constructor de Hija','Ninguno'],k:[1],
 e:'La deserialización NO llama al constructor de la clase serializable: los campos se rellenan desde los bytes. Lo que sí se ejecuta es el constructor sin argumentos del primer ancestro no serializable. Si Base no lo tuviera accesible, la deserialización fallaría.'},

{id:'i21',a:'io',p:'¿Qué ocurre al serializar un objeto con un campo de una clase que no implementa Serializable?',
 o:['No compila','Lanza NotSerializableException en ejecución','Ese campo se guarda como null','Se serializa igualmente'],k:[1],
 e:'Todo lo que cuelga del objeto debe ser serializable. El fallo aparece en ejecución, no al compilar, con NotSerializableException indicando la clase culpable. Se arregla marcando ese campo como transient o haciendo serializable la otra clase.'},

{id:'i22',a:'io',p:'¿Para qué sirve declarar serialVersionUID?',
 o:['Para acelerar la serialización','Para fijar la versión y que los archivos antiguos sigan leyéndose','Para cifrar los datos','Es obligatorio desde Java 17'],k:[1],
 e:'Si no lo declaras, el compilador genera uno a partir de la estructura de la clase, y cualquier cambio lo altera: los archivos guardados dejan de poder leerse y salta InvalidClassException. Declararlo a mano te da control sobre cuándo se rompe la compatibilidad.'},

/* ---- ampliación: l10n ---- */
{id:'l6',a:'l10n',p:'¿Cuál es la forma recomendada en Java 21 de crear un Locale?',
 o:['new Locale("es", "ES")','Locale.of("es", "ES")','Locale.create("es_ES")','new Locale.Builder("es")'],k:[1],
 e:'Los constructores new Locale(...) están obsoletos desde Java 19: lo correcto es el método de fábrica Locale.of. También sirven las constantes ya hechas como Locale.US, Locale.forLanguageTag("es-MX") con guión, o Locale.Builder para casos complejos.'},

{id:'l7',a:'l10n',p:'¿Cuál de estas etiquetas de Locale está mal formada?',
 o:['es','es_ES','ES_es','fr_CA'],k:[2],
 e:'El idioma va primero y en minúsculas; el país es opcional y va en mayúsculas. ES_es invierte el convenio. Un Locale puede llevar solo idioma, pero nunca solo país: sin idioma no tiene sentido. En las etiquetas de forLanguageTag el separador es el guión, no el guión bajo.'},

{id:'l8',a:'l10n',p:'¿Qué hace esta línea?',c:`Locale.setDefault(Locale.Category.FORMAT, Locale.FRANCE);`,
 o:['Cambia todo el locale por defecto','Cambia solo el formato de números y fechas, no los textos mostrados','No compila','Solo afecta a ResourceBundle'],k:[1],
 e:'El locale por defecto está dividido en dos categorías independientes: DISPLAY, que afecta a los textos que ve el usuario como los nombres de los meses, y FORMAT, que afecta a cómo se formatean números y fechas. setDefault sin categoría cambia las dos.'},

{id:'l9',a:'l10n',p:'Se pide el bundle Mensajes para es_MX y el locale por defecto es en_US. ¿Cuál es el orden de búsqueda?',
 o:['Mensajes_es_MX, Mensajes_es, Mensajes_en_US, Mensajes_en, Mensajes','Mensajes_es_MX, Mensajes, error','Mensajes, Mensajes_es, Mensajes_es_MX','Mensajes_es_MX, Mensajes_en_US, Mensajes'],k:[0],
 e:'Se va de lo más específico a lo más general quitando una pieza cada vez, y cuando se agota el locale pedido se repite el proceso con el locale POR DEFECTO, antes de acabar en el bundle base. Si tampoco está, lanza MissingResourceException.'},

{id:'l10',a:'l10n',p:'Se encontró Mensajes_es_MX pero le falta la clave "despedida". ¿Dónde se busca?',
 o:['En Mensajes_en_US, el locale por defecto','Subiendo por su cadena de padres: Mensajes_es y luego Mensajes','En ningún sitio: lanza excepción','En todos los bundles disponibles'],k:[1],
 e:'Elegir bundle y resolver una clave son dos cosas distintas. Una vez elegido, las claves que falten se buscan subiendo por SU cadena de padres, que ya no vuelve a pasar por el locale por defecto. Por eso conviene que el archivo base tenga todas las claves.'},

{id:'l11',a:'l10n',p:'Existen Mensajes_fr.class y Mensajes_fr.properties. ¿Cuál se usa?',
 o:['El .properties','El .class','El que se encuentre antes en el classpath','Lanza excepción por ambigüedad'],k:[1],
 e:'Para un mismo nombre candidato, la clase gana al archivo de propiedades. Pero la precedencia se aplica candidato a candidato: Java recorre la lista de más específico a más general y en cada escalón mira primero la clase. Por eso un Mensajes_fr.properties SÍ gana a un Mensajes.class.'},

{id:'l12',a:'l10n',p:'¿Qué tipo de excepción es MissingResourceException?',
 o:['Comprobada: hay que capturarla o declararla','No comprobada: el compilador no la exige','Un Error','No existe, devuelve null'],k:[1],
 e:'Hereda de RuntimeException, así que el compilador no avisa y el fallo aparece en ejecución, normalmente en producción y con un idioma que nadie probó. Es el argumento práctico para que el bundle base esté siempre completo.'},

{id:'l13',a:'l10n',p:'¿Qué imprime?',c:`double n = 1234.5;
System.out.println(NumberFormat.getInstance(Locale.of("es","ES")).format(n));
System.out.println(NumberFormat.getInstance(Locale.US).format(n));`,
 o:['1.234,5 y 1,234.5','1,234.5 y 1.234,5','Los dos 1234.5','1.234,5 y 1.234,5'],k:[0],
 e:'El español usa el punto para los millares y la coma para los decimales; el inglés al revés. Por eso "1.234" significa mil doscientos treinta y cuatro en un sitio y uno con doscientos treinta y cuatro en el otro. Es la trampa visual más socorrida del tema.'},

{id:'l14',a:'l10n',p:'¿Qué imprime?',c:`NumberFormat p = NumberFormat.getPercentInstance(Locale.US);
System.out.println(p.format(0.25));
System.out.println(p.format(25));`,
 o:['0.25% y 25%','25% y 2,500%','25% y 25%','0.25% y 2,500%'],k:[1],
 e:'getPercentInstance MULTIPLICA por cien antes de formatear, así que 0.25 se convierte en 25% y el 25 en 2.500%. Olvidarlo produce resultados cien veces mayores y es un fallo garantizado si no se tiene presente.'},

{id:'l15',a:'l10n',p:'¿Qué imprime?',c:`NumberFormat c = NumberFormat.getCompactNumberInstance(
        Locale.US, NumberFormat.Style.SHORT);
System.out.println(c.format(1_000_000));`,
 o:['1,000,000','1M','1 million','1000K'],k:[1],
 e:'getCompactNumberInstance, de Java 12, abrevia según el estilo: SHORT da 1M y LONG daría "1 million". Recibe siempre locale y estilo. Es distinto de getCurrencyInstance y getPercentInstance, que no llevan segundo argumento.'},

{id:'l16',a:'l10n',p:'¿Qué devuelve?',c:`NumberFormat f = NumberFormat.getInstance(Locale.US);
Number n = f.parse("12abc");`,
 o:['Lanza ParseException','Devuelve 12','Devuelve null','Devuelve 0'],k:[1],
 e:'parse lee mientras puede y se detiene en el primer carácter que no encaja, devolviendo lo leído hasta ahí sin quejarse. Solo lanza ParseException si no consigue interpretar ni el principio. Esa excepción es comprobada, así que obliga a try-catch o a declararla.'},

{id:'l17',a:'l10n',p:'¿Qué ocurre?',c:`LocalDate d = LocalDate.now();
d.format(DateTimeFormatter.ofLocalizedTime(FormatStyle.SHORT));`,
 o:['Imprime la hora actual','Imprime 00:00','Lanza UnsupportedTemporalTypeException','No compila'],k:[2],
 e:'Hay que casar el formateador con el tipo: un LocalDate no tiene hora, así que pedirle un formato de hora falla en ejecución con UnsupportedTemporalTypeException. Compila perfectamente. Un LocalDateTime sirve para los tres formatos: fecha, hora y ambos.'},

{id:'l18',a:'l10n',p:'¿Qué formatea este patrón?',c:`DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm")`,
 o:['Día, mes, año y hora de 0 a 23','Día, minutos, año y hora de 1 a 12','Día, mes, año y hora de 1 a 12','No compila'],k:[2],
 e:'M mayúscula es el mes y m minúscula son los minutos; H mayúscula va de 0 a 23 y h minúscula de 1 a 12, que normalmente exige añadir la marca a de mañana o tarde. El número de letras cambia la forma: MM da 03, MMM da mar y MMMM da marzo.'},

{id:'l19',a:'l10n',p:'¿Qué imprime?',c:`DateTimeFormatter f = DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL);
f.withLocale(Locale.of("es","ES"));
System.out.println(LocalDate.of(2026,3,15).format(f));`,
 o:['La fecha en español','La fecha en el locale por defecto, no en español','Lanza excepción','No compila'],k:[1],
 e:'Los formateadores son inmutables: withLocale devuelve uno NUEVO y no modifica el original. Al no recoger el resultado, el cambio se pierde. Es exactamente la misma trampa que los métodos de String o los de java.time.'},

{id:'l20',a:'l10n',p:'¿Qué imprime?',c:`System.out.println(MessageFormat.format("no cambia {0}", "X"));
System.out.println(MessageFormat.format("'{0}' literal", "X"));`,
 o:['no cambia X y X literal','no cambia X y {0} literal','no cambia {0} y X literal','Lanza excepción'],k:[1],
 e:'La comilla simple es el carácter de escape de MessageFormat: encerrar un marcador entre comillas lo desactiva y se imprime tal cual. Para una comilla literal hay que duplicarla. En español, con textos que llevan apóstrofos, esto muerde de verdad.'},

/* ---- ampliación 2: mod ---- */
{id:'m21',a:'mod',p:'¿Qué diferencia hay entre requires y requires static?',c:`module app {
    requires static informes;
}`,
 o:['requires static hace la dependencia obligatoria solo en compilación, opcional en tiempo de ejecución','requires static carga el módulo de forma perezosa','requires static es sinónimo de requires transitive','requires static prohíbe usar el módulo en tiempo de ejecución'],k:[0],
 e:'requires static declara una dependencia obligatoria para compilar pero opcional al ejecutar: si el módulo no está presente en tiempo de ejecución y el código que lo usa no llega a ejecutarse, el programa funciona igual. Es útil para anotaciones o utilidades que solo hacen falta en algunos entornos.'},

{id:'m22',a:'mod',p:'¿Qué efecto tiene una exportación calificada como esta?',c:`module app {
    exports com.tienda.interno to com.tienda.tests;
}`,
 o:['El paquete queda visible para cualquier módulo que lo requiera','Solo el módulo com.tienda.tests puede acceder a los tipos públicos de ese paquete','Se exporta a todos los módulos del mismo JAR','Equivale a exports sin más, to es solo documentación'],k:[1],
 e:'exports ... to restringe la visibilidad a la lista de módulos indicada, normalmente para exponer utilidades de prueba sin abrir el paquete al mundo. Los módulos no listados no pueden compilar ni ejecutar código que use esos tipos, aunque los requieran.'},

{id:'m23',a:'mod',p:'Un módulo declara uses com.api.Traductor pero ningún módulo del sistema aporta provides para ese servicio. ¿Qué ocurre al llamar a ServiceLoader.load(Traductor.class).iterator()?',
 o:['Lanza ServiceConfigurationError','Devuelve un iterador sin elementos, sin lanzar nada','No compila','Lanza NoSuchElementException al crear el ServiceLoader'],k:[1],
 e:'ServiceLoader.load no exige que exista al menos un proveedor: si no encuentra ninguno, el iterador simplemente no tiene elementos. El código consumidor debe estar preparado para esa ausencia, por ejemplo con un valor por defecto.'},

{id:'m24',a:'mod',p:'¿Qué ocurre con este module-info?',c:`module app {
    requires datos;
    requires datos;
}`,
 o:['Compila, la segunda línea se ignora','No compila: no se puede requerir el mismo módulo dos veces','Compila y datos se carga dos veces','Solo compila si la segunda lleva transitive'],k:[1],
 e:'Declarar requires del mismo módulo más de una vez es error de compilación, igual que ocurre con exports repetidos del mismo paquete. Cada directiva debe aparecer una sola vez por módulo destino.'},

{id:'m25',a:'mod',p:'¿Es válido declarar dos implementaciones del mismo servicio en un módulo proveedor?',c:`module app {
    provides com.api.Traductor with com.impl.TraductorEs, com.impl.TraductorFr;
}`,
 o:['No, provides admite solo una implementación','Sí, se listan separadas por comas y ServiceLoader las devuelve todas','Solo si están en módulos distintos','No compila: falta un with por cada una'],k:[1],
 e:'Una misma cláusula provides puede listar varias implementaciones separadas por comas, o pueden repetirse en cláusulas provides distintas. ServiceLoader las va devolviendo todas al iterar, y el consumidor decide con cuál quedarse.'},

{id:'m26',a:'mod',p:'Quieres generar con jlink una imagen que incluya una biblioteca de terceros sin module-info. ¿Qué hace falta?',
 o:['jlink la ignora automáticamente','Colocarla en la ruta de módulos para que se trate como módulo automático','No es posible: jlink solo acepta módulos explícitos','Convertirla a .jmod manualmente es obligatorio'],k:[1],
 e:'jlink solo ensambla módulos, así que un JAR de la ruta de clases no participa en el enlace. Basta con ponerlo en la ruta de módulos para que se convierta en módulo automático y jlink pueda incluirlo, siempre que también lo estén todas sus dependencias.'},

{id:'m27',a:'mod',p:'Un framework de terceros necesita reflexión profunda sobre un paquete de la plataforma que no está abierto. ¿Qué opción de línea de comandos lo permite sin tocar el código?',
 o:['--add-modules','--add-opens','--patch-module','--upgrade-module-path'],k:[1],
 e:'--add-opens origen/paquete=destino concede acceso reflexivo profundo en tiempo de ejecución sin modificar el module-info. --add-exports hace lo mismo pero solo para acceso normal, no reflexivo. --add-modules añade módulos al grafo de lectura, no abre paquetes.'},

{id:'m28',a:'mod',p:'¿Para qué sirve la opción --module-source-path de javac?',
 o:['Para compilar varios módulos de un árbol de fuentes en una sola invocación','Para indicar dónde están los .class ya compilados','Para generar automáticamente el module-info','Para firmar los módulos resultantes'],k:[0],
 e:'--module-source-path le dice al compilador la organización del árbol de fuentes multi-módulo, de modo que una sola invocación de javac compile todos los módulos relacionados a la vez, resolviendo sus dependencias entre sí.'},

{id:'m29',a:'mod',p:'El módulo A hace "exports p to B". El módulo C hace "requires transitive A". ¿Puede C acceder a los tipos del paquete p?',
 o:['Sí, porque transitive propaga cualquier acceso de A','No: la exportación calificada solo alcanza a B, transitive no la amplía','Solo si C también aparece en la lista to','Sí, pero solo en tiempo de ejecución'],k:[1],
 e:'requires transitive propaga la LECTURA de un módulo a quien te requiera, pero no cambia a quién exporta sus paquetes ese módulo. La lista to de una exportación calificada es fija: si C no está en ella, no ve el paquete aunque llegue a leer A por la cadena transitiva.'},

{id:'m30',a:'mod',p:'¿Qué es java.se?',
 o:['El módulo que contiene todo el código de la aplicación','Un módulo agregador que requires transitive la mayoría de las API estándar','El módulo sin nombre','Una herramienta de línea de comandos'],k:[1],
 e:'java.se es un módulo agregador de la plataforma: no aporta paquetes propios, solo declara requires transitive de módulos como java.sql, java.xml o java.desktop, así que requerir java.se da acceso a casi toda la API estándar de un golpe.'},

{id:'m31',a:'mod',p:'En una migración ascendente (bottom-up) a módulos, ¿por dónde se empieza?',
 o:['Por la aplicación principal, dejando las bibliotecas en la ruta de clases','Por las bibliotecas sin dependencias propias, subiendo hacia la aplicación','Da igual el orden','Por el módulo java.base'],k:[1],
 e:'La estrategia ascendente modulariza primero las hojas del grafo de dependencias, las bibliotecas que no dependen de nada más, y va subiendo. La descendente hace lo contrario: modulariza antes la aplicación y deja el resto como módulos automáticos hasta poder ocuparse de ellos.'},

{id:'m32',a:'mod',p:'¿Dónde debe colocarse el archivo module-info.java?',
 o:['En cualquier paquete del módulo','En la raíz del árbol de fuentes del módulo','Dentro de META-INF','Puede haber varios, uno por paquete exportado'],k:[1],
 e:'Cada módulo tiene exactamente un module-info.java y vive en la raíz de su árbol de fuentes, al mismo nivel que los paquetes de primer nivel. No pertenece a ningún paquete con nombre.'},

{id:'m33',a:'mod',p:'¿Qué requisito debe cumplir una clase indicada en un provides ... with ... para que ServiceLoader pueda instanciarla?',
 o:['Debe ser abstracta','Necesita un constructor público sin argumentos, o un método estático público provider()','Debe implementar Serializable','Debe estar en el módulo consumidor, no en el proveedor'],k:[1],
 e:'ServiceLoader instancia la implementación con un constructor público sin argumentos, salvo que la clase ofrezca un método estático público llamado provider() que devuelva la instancia, pensado para casos donde la construcción es más compleja o quieres reutilizar una única instancia.'},

{id:'m34',a:'mod',p:'Un JAR sin module-info tiene en su manifiesto Automatic-Module-Name: com.terceros.util. ¿Qué nombre de módulo automático recibe?',
 o:['El derivado del nombre del archivo','com.terceros.util, el declarado en el manifiesto','Un nombre generado al azar','No se le asigna nombre, va al módulo sin nombre'],k:[1],
 e:'Si el manifiesto declara Automatic-Module-Name, ese nombre tiene prioridad sobre el que se derivaría del nombre del archivo JAR. Es la forma en que una biblioteca fija su futuro nombre de módulo antes de escribir su propio module-info.'},

{id:'m35',a:'mod',p:'¿Qué muestra jdeps con la opción -s (resumen)?',
 o:['El listado completo de clases usadas paquete a paquete','Solo las dependencias a nivel de módulo o de JAR, sin detalle de clases','Los métodos deprecados','El árbol de herencia de las clases'],k:[1],
 e:'jdeps -s (o --summary) condensa el análisis a qué módulos o JAR depende cada uno de qué otros, sin bajar al detalle de paquetes o clases. Para ese detalle hace falta ejecutarlo sin esa opción.'},

{id:'m36',a:'mod',p:'¿Qué lista java --list-modules?',
 o:['Solo los módulos de tu aplicación','Los módulos observables en la imagen de ejecución actual, incluidos los de la plataforma','Los módulos automáticos detectados en el classpath','Los módulos pendientes de descargar'],k:[1],
 e:'java --list-modules enumera los módulos que forman la imagen de ejecución en uso, típicamente los de la plataforma más los tuyos si se pasan con --module-path. Es útil para comprobar qué contiene una imagen generada con jlink.'},

{id:'m37',a:'mod',p:'Un módulo B usa una clase pública de un paquete que el módulo A NO exporta. ¿Qué ocurre?',
 o:['Compila y funciona porque la clase es public','No compila: el paquete no es visible fuera de A','Compila pero lanza IllegalAccessError en ejecución','Funciona solo con reflexión'],k:[1],
 e:'La visibilidad public de una clase ya no basta por sí sola: si su paquete no está exportado, ningún otro módulo puede ni siquiera compilar contra ella. Es la encapsulación fuerte que introduce el sistema de módulos, más estricta que la del classpath.'},

{id:'m38',a:'mod',p:'Al lanzar una aplicación modular, falta en la ruta de módulos un módulo declarado con requires. ¿Cuándo se detecta el problema?',
 o:['En tiempo de ejecución, al primer uso de ese módulo','Antes de arrancar el programa, al resolver el grafo de módulos','Nunca, se ignora en silencio','Solo si se usa reflexión sobre él'],k:[1],
 e:'La resolución de módulos ocurre antes de que arranque el main: si falta un módulo requerido, el lanzador falla de inmediato con un error de resolución, sin llegar a ejecutar una sola línea. Es una de las ventajas de JPMS frente al fallo tardío típico de un NoClassDefFoundError en la ruta de clases.'},

{id:'m39',a:'mod',p:'¿Qué hace ServiceLoader.reload()?',
 o:['Recarga las clases del módulo','Vuelve a rastrear los proveedores disponibles, descartando la caché de instancias ya creadas','Reinicia la JVM','Elimina los servicios registrados'],k:[1],
 e:'Un ServiceLoader guarda en caché los proveedores que ya localizó e instanció, así que iterar varias veces sobre el mismo ServiceLoader no los vuelve a crear. reload() limpia esa caché y fuerza un nuevo rastreo, útil si el entorno de proveedores disponibles pudo haber cambiado.'},

{id:'m40',a:'mod',p:'¿Cuál de estas exportaciones es válida?',
 o:['exports com.tienda.api to com.tienda.web, com.tienda.tests;','exports com.tienda.api to com.tienda.web; exports com.tienda.api to com.tienda.tests;','Las dos son inválidas','exports com.tienda.api, com.tienda.web to com.tienda.tests;'],k:[0],
 e:'La lista de módulos destino de una exportación calificada se separa por comas dentro de una única cláusula to. Repetir exports del mismo paquete en dos cláusulas distintas no compila, igual que pasa con requires duplicado.'},

/* ---- ampliación 2: l10n ---- */
{id:'l21',a:'l10n',p:'¿Qué diferencia hay entre Locale.setDefault(Locale.FRANCE) y Locale.setDefault(Locale.Category.FORMAT, Locale.FRANCE)?',
 o:['Son equivalentes','La primera cambia DISPLAY y FORMAT a la vez; la segunda solo FORMAT','La primera solo cambia DISPLAY','La segunda cambia también el idioma del sistema operativo'],k:[1],
 e:'setDefault(Locale) sin categoría fija de un golpe el valor por defecto de las dos categorías, DISPLAY y FORMAT. La versión con categoría permite cambiar solo una, por ejemplo para formatear en francés manteniendo los textos de la interfaz en el idioma original.'},

{id:'l22',a:'l10n',p:'¿Qué hace ResourceBundle.getBundle en llamadas sucesivas con el mismo nombre base y locale?',
 o:['Vuelve a leer el archivo cada vez','Devuelve el bundle cacheado tras la primera carga, sin releer el archivo','Lanza excepción la segunda vez','Combina el contenido con el de la primera llamada'],k:[1],
 e:'ResourceBundle mantiene una caché interna por nombre base, locale y cargador de clases. Llamadas repetidas devuelven el mismo bundle ya cargado. Para forzar una relectura, por ejemplo tras cambiar el archivo en disco, hay que llamar a ResourceBundle.clearCache().'},

{id:'l23',a:'l10n',p:'Desde Java 9, ¿con qué codificación se leen por defecto los archivos .properties de un ResourceBundle?',
 o:['ISO-8859-1, como siempre','UTF-8','Depende del locale del sistema','ASCII puro, sin acentos'],k:[1],
 e:'Antes de Java 9 los .properties se leían como ISO-8859-1 y los caracteres fuera de ese juego había que escaparlos con \\uXXXX mediante la herramienta native2ascii. Desde Java 9 la lectura por defecto es UTF-8, así que los acentos y otros caracteres se pueden escribir directamente en el archivo.'},

{id:'l24',a:'l10n',p:'¿Qué ventaja tiene un ListResourceBundle frente a un archivo .properties?',
 o:['Es más rápido de leer siempre','Sus valores pueden ser objetos de cualquier tipo, no solo cadenas','No necesita compilarse','Soporta más de un idioma en el mismo archivo'],k:[1],
 e:'Un ListResourceBundle se implementa en Java sobrescribiendo getContents(), que devuelve pares clave-valor como Object[][]. Al ser código, el valor puede ser cualquier objeto: una lista, un icono o un formato ya construido, algo que un .properties no puede ofrecer porque solo admite texto.'},

{id:'l25',a:'l10n',p:'¿Le afecta el locale a esta línea?',c:`System.out.println(
    LocalDate.of(2026, 3, 5).format(DateTimeFormatter.ISO_LOCAL_DATE));`,
 o:['Sí, cambia el orden según el locale por defecto','No: los formateadores ISO predefinidos son independientes del locale','Solo si se le aplica withLocale antes','Lanza excepción sin un locale explícito'],k:[1],
 e:'Los formateadores ISO como ISO_LOCAL_DATE producen siempre el mismo patrón fijo, aquí 2026-03-05, sin importar el locale por defecto ni uno aplicado con withLocale. Son pensados para intercambio de datos, no para mostrar al usuario.'},

{id:'l26',a:'l10n',p:'¿Qué ocurre?',c:`LocalTime hora = LocalTime.of(14, 30);
var f = DateTimeFormatter.ofLocalizedTime(FormatStyle.FULL);
System.out.println(hora.format(f));`,
 o:['Imprime la hora en formato completo','Lanza excepción: FULL y LONG para hora exigen información de zona que LocalTime no tiene','Imprime solo horas y minutos, ignorando el estilo','No compila'],k:[1],
 e:'Los estilos FULL y LONG para la parte de hora incluyen el nombre o el desplazamiento de la zona horaria, algo que LocalTime no lleva consigo. Formatearlo con esos estilos falla en tiempo de ejecución. Con SHORT o MEDIUM sí funciona, porque no requieren zona.'},

{id:'l27',a:'l10n',p:'¿Qué imprime?',c:`System.out.println(
    MessageFormat.format("Hola {0}, tienes {1} mensajes", "Ana"));`,
 o:['Hola Ana, tienes null mensajes','Hola Ana, tienes {1} mensajes','Lanza IllegalArgumentException por falta de argumentos','Hola Ana, tienes  mensajes'],k:[1],
 e:'Cuando un patrón referencia un índice para el que no se pasó argumento, MessageFormat no lanza excepción: deja el propio marcador {1} sin sustituir, tal cual aparece en el patrón. Hay que pasar tantos argumentos como el índice más alto usado en el patrón.'},

{id:'l28',a:'l10n',p:'¿Qué ocurre?',c:`Currency c = Currency.getInstance(Locale.of("es"));`,
 o:['Devuelve el euro por defecto','Lanza IllegalArgumentException: el locale no tiene país','Devuelve null','Devuelve la moneda del sistema operativo'],k:[1],
 e:'Currency.getInstance(Locale) necesita el componente de país para saber a qué moneda asociarlo, ya que un mismo idioma se habla en países con monedas distintas. Un locale de solo idioma, sin país, hace que el método falle con IllegalArgumentException.'},

{id:'l29',a:'l10n',p:'¿Qué locale usa ResourceBundle.getBundle("Mensajes") cuando no se le pasa un Locale explícito?',
 o:['Locale.ROOT','El locale por defecto de la JVM, Locale.getDefault()','Locale.US siempre','Lanza excepción: es obligatorio pasar un Locale'],k:[1],
 e:'La sobrecarga de un solo argumento es equivalente a llamar a getBundle con Locale.getDefault() y el cargador de clases de quien llama. Si se necesita un locale distinto al de la JVM hay que usar la sobrecarga que lo acepta explícitamente.'},

{id:'l30',a:'l10n',p:'¿Qué tiene de particular NumberFormat.getIntegerInstance()?',
 o:['Formatea igual que getInstance() pero sin separadores de millares','Redondea la parte decimal usando HALF_EVEN antes de formatear como entero','Solo admite parsear, no formatear','Lanza excepción con números decimales'],k:[1],
 e:'getIntegerInstance() está pensado para valores enteros: si se le pasa un double con decimales, los redondea con el modo HALF_EVEN antes de mostrarlo, y al parsear solo devuelve la parte entera. Es distinto de getInstance(), que sí muestra decimales según la configuración del locale.'},

{id:'l31',a:'l10n',p:'¿Para qué sirve DecimalFormatSymbols?',
 o:['Para traducir los textos de una interfaz','Para personalizar símbolos como el separador decimal o de millares, independientemente del locale','Para elegir el idioma de un ResourceBundle','Es una clase interna que no se usa directamente'],k:[1],
 e:'DecimalFormatSymbols permite construir un DecimalFormat con separadores, símbolo de moneda o de porcentaje distintos de los que traería el locale por defecto, por ejemplo para imponer siempre el punto como separador decimal aunque el locale sea español.'},

{id:'l32',a:'l10n',p:'¿Qué imprime?',c:`System.out.println(Locale.of("en", "US").equals(Locale.US));`,
 o:['false, porque se construyeron de forma distinta','true: equals compara idioma, país, variante y demás campos, no cómo se creó el objeto','Lanza excepción','No compila'],k:[1],
 e:'Locale sobrescribe equals comparando sus componentes (idioma, país, variante, script y extensiones), así que da igual si el objeto se construyó con Locale.of, con una constante como Locale.US o con Locale.Builder: si los componentes coinciden, son iguales.'},

{id:'l33',a:'l10n',p:'Con Locale.of("es", "ES") más una variante "PREEURO", ¿en qué orden se buscan los candidatos del bundle Precios?',
 o:['Precios_es_ES_PREEURO, Precios_es_ES, Precios_es, cadena del locale por defecto, Precios','Precios, Precios_es, Precios_es_ES, Precios_es_ES_PREEURO','Precios_es_ES_PREEURO, Precios, cadena del locale por defecto','Precios_PREEURO, Precios_es_ES, Precios_es, Precios'],k:[0],
 e:'La búsqueda añade primero la variante al candidato más específico y va quitando componentes de derecha a izquierda: idioma-país-variante, idioma-país, idioma, y solo si nada de eso aparece se repite la búsqueda con el locale por defecto antes de caer en el bundle base.'},

{id:'l34',a:'l10n',p:'En una aplicación modular, ¿cómo puede un módulo aportar ResourceBundles para que los use otro módulo, sin exportar el paquete que los contiene?',
 o:['No es posible en JPMS','Implementando java.util.spi.ResourceBundleProvider y declarándolo como servicio con provides ... with ... en module-info','Con opens es suficiente','Copiando los .properties al módulo consumidor'],k:[1],
 e:'ResourceBundle.Control, el mecanismo clásico de personalizar la carga, no funciona bien entre módulos. El reemplazo pensado para JPMS es implementar la interfaz de servicio ResourceBundleProvider y registrarla con provides en el module-info del módulo que aporta los bundles, sin necesidad de exportar el paquete donde viven los archivos.'},

{id:'l35',a:'l10n',p:'¿Es seguro compartir una misma instancia de NumberFormat entre varios hilos sin sincronizar?',
 o:['Sí, es inmutable','No: mantiene estado interno mutable y no es seguro para uso concurrente','Sí, solo si es getInstance() y no getCurrencyInstance()','Solo es un problema con DateFormat, no con NumberFormat'],k:[1],
 e:'Tanto NumberFormat como DateFormat guardan estado mutable durante el formateo y no están sincronizados internamente. Compartir una instancia entre hilos sin coordinación puede producir resultados corruptos. La práctica recomendada es crear una instancia por hilo o sincronizar el acceso.'},

{id:'l36',a:'l10n',p:'¿Qué imprime?',c:`System.out.println(MessageFormat.format("El precio es de 5''", new Object[0]));`,
 o:['El precio es de 5\'','El precio es de 5','Lanza excepción de formato','El precio es de 5\'\''],k:[0],
 e:'Dentro de un patrón de MessageFormat, dos comillas simples seguidas representan una comilla simple literal en el resultado. Es distinto de encerrar un marcador entre una sola comilla a cada lado, que lo que hace es desactivarlo para que se imprima tal cual.'},

{id:'l37',a:'l10n',p:'¿Qué representa el subtag de script en una etiqueta BCP 47 como "sr-Latn-RS"?',
 o:['Una región dentro del país','El sistema de escritura, aquí alfabeto latino para el serbio de Serbia','La variante dialectal','No es una etiqueta válida'],k:[1],
 e:'Una etiqueta de idioma puede llevar, además del idioma y el país, un subtag opcional de escritura (script) de cuatro letras, útil para idiomas que se escriben con más de un alfabeto, como el serbio en latino o en cirílico. Locale.forLanguageTag lo interpreta y queda disponible con getScript().'},

{id:'l38',a:'l10n',p:'¿Qué produce DateTimeFormatter.BASIC_ISO_DATE al formatear el 5 de marzo de 2026, frente a ISO_LOCAL_DATE?',
 o:['Los dos dan 2026-03-05','BASIC_ISO_DATE da 20260305, sin separadores; ISO_LOCAL_DATE da 2026-03-05','BASIC_ISO_DATE incluye la zona horaria','No existe BASIC_ISO_DATE'],k:[1],
 e:'BASIC_ISO_DATE es la variante compacta del formato ISO, sin guiones. Ambos son independientes del locale, igual que el resto de formateadores ISO predefinidos: representan un formato de intercambio fijo, no una presentación localizada.'},

{id:'l39',a:'l10n',p:'¿Qué aporta Locale.Builder frente a Locale.of?',
 o:['Nada, son intercambiables en todos los casos','Valida los subtags y lanza IllformedLocaleException si alguno no cumple el formato BCP 47','Permite crear locales sin idioma','Solo sirve para el idioma inglés'],k:[1],
 e:'Locale.Builder permite construir el locale pieza a pieza con setLanguage, setRegion, setScript o setVariant y comprueba el formato de cada subtag, lanzando IllformedLocaleException ante uno inválido. Locale.of es más directo pero no ofrece esa validación tan estricta.'},

{id:'l40',a:'l10n',p:'Con un patrón fijo como "dd/MM/yyyy", ¿qué cambia al aplicar withLocale con distintos locales?',
 o:['El orden de día, mes y año','Nada relevante: un patrón puramente numérico no depende del locale, solo los campos de texto como MMMM o EEEE','El separador entre campos','Se lanza excepción si el locale no es compatible'],k:[1],
 e:'El locale de un DateTimeFormatter afecta a los campos que producen texto, como el nombre del mes con MMMM o el del día de la semana con EEEE, y a detalles como el sistema de numeración. Un patrón enteramente numérico como dd/MM/yyyy imprime los mismos dígitos y el mismo orden sea cual sea el locale.'},

/* ---- ampliación 2: flujo ---- */
{id:'f23',a:'flujo',p:'¿Qué imprime?',c:`record Punto(int x, int y) {}
record Linea(Punto a, Punto b) {}

Object o = new Linea(new Punto(1, 2), new Punto(4, 6));
if (o instanceof Linea(Punto(var x1, var y1), Punto(var x2, var y2))) {
    System.out.println((x2 - x1) + " " + (y2 - y1));
}`,
 o:['3 4','1 2','4 6','No compila'],k:[0],
 e:'Los patrones de registro se pueden anidar: Linea se deconstruye en sus dos Punto, y cada Punto a su vez en sus componentes x e y, todo en una sola comprobación instanceof. var infiere aquí int para cada componente. El resultado es 4-1=3 y 6-2=4.'},

{id:'f24',a:'flujo',p:'¿Por qué no compila?',c:`enum Estado { NUEVO, EN_CURSO, CERRADO }

Estado est = Estado.EN_CURSO;
String texto = switch (est) {
    case NUEVO -> "nuevo";
    case EN_CURSO -> "en curso";
};`,
 o:['Falta break en cada rama','El switch expresión no cubre CERRADO y no tiene default','Los enums no se pueden usar en switch','Falta yield en cada rama'],k:[1],
 e:'Un switch usado como expresión debe ser exhaustivo. Con un enum eso se cumple listando TODAS sus constantes, y aquí falta CERRADO. Se arregla añadiendo ese case o un default, aunque cubrir todas las constantes explícitamente es preferible porque el compilador avisará si el enum crece.'},

{id:'f25',a:'flujo',p:'¿Compila este método?',c:`static int longitud(Object o) {
    if (!(o instanceof String s)) {
        return -1;
    }
    return s.length();
}`,
 o:['No: s no existe fuera del if','Sí: como el if niega el patrón y termina con return, s queda definida a partir de ahí','No: instanceof no admite negación con patrón','Sí, pero s vale null en la última línea'],k:[1],
 e:'El análisis de flujo del compilador razona que si la condición negada es verdadera el método termina en el return, así que si se llega a la línea final es porque instanceof SÍ encajó y s está definitivamente asignada. Es el mismo mecanismo que permite usar la variable de patrón tras un && o un continue/break condicionado.'},

{id:'f26',a:'flujo',p:'¿Qué imprime?',c:`int[] datos = {1, 2, 3};
for (int x : datos) {
    x = x * 10;
}
System.out.println(datos[0] + " " + datos[1] + " " + datos[2]);`,
 o:['10 20 30','1 2 3','0 0 0','No compila'],k:[1],
 e:'En un for-each sobre un array de primitivos, la variable del bucle es una copia del valor de cada posición. Reasignarla dentro del cuerpo no toca el array original. Para modificar los elementos hace falta un for clásico con índice.'},

{id:'f27',a:'flujo',p:'¿Por qué no compila este case?',c:`Object o = 5;
String r = switch (o) {
    case Integer i, String s -> "número o texto";
    default -> "otro";
};`,
 o:['Falta un when en cada patrón','Un case con patrones de tipo no admite combinar varios en la misma etiqueta','Integer y String no son compatibles en un switch','Falta break'],k:[1],
 e:'Las etiquetas de case pueden agrupar varias constantes separadas por coma, pero un patrón de tipo no se puede combinar con otro patrón ni con nada más en la misma etiqueta, salvo la combinación especial case null, default. Aquí hay que escribir dos case por separado.'},

{id:'f28',a:'flujo',p:'¿Qué imprime?',c:`for (int i = 0; i < 3; i++) {
    switch (i) {
        case 1:
            break;
        default:
            System.out.print(i);
    }
}`,
 o:['0','012','02','01'],k:[2],
 e:'Dentro de un bucle, un break sin etiqueta dentro de un switch solo sale del switch, no del bucle que lo contiene. Así que i vale 0 y 2 caen en default y se imprimen, e i vale 1 entra en su propio case y no imprime nada. Para salir del bucle desde dentro del switch haría falta una etiqueta en el for y un break con esa etiqueta.'},

{id:'f29',a:'flujo',p:'¿Qué ocurre si más adelante se añade Triangulo a la lista de permits?',c:`sealed interface Figura permits Circulo, Cuadrado {}
record Circulo(double r) implements Figura {}
record Cuadrado(double l) implements Figura {}

double area(Figura f) {
    return switch (f) {
        case Circulo c -> Math.PI * c.r() * c.r();
        case Cuadrado q -> q.l() * q.l();
    };
}`,
 o:['Compila igual, Triangulo usaría el área de Cuadrado','Deja de compilar: el switch ya no es exhaustivo y hay que tratar el nuevo caso','Solo falla en tiempo de ejecución','Se ignoran las instancias de Triangulo'],k:[1],
 e:'Al añadir un nuevo subtipo permitido, cualquier switch exhaustivo sobre esa jerarquía que no lo contemple deja de compilar hasta que se añada su case o un default. Es justo la ventaja de las jerarquías selladas: el compilador señala todos los puntos del código que hay que revisar.'},

{id:'f30',a:'flujo',p:'¿Qué imprime?',c:`int x = 5;
resultado: {
    if (x > 3) {
        System.out.print("grande ");
        break resultado;
    }
    System.out.print("pequeño ");
}
System.out.println("fin");`,
 o:['grande fin','pequeño fin','grande pequeño fin','No compila: break solo vale en bucles y switch'],k:[0],
 e:'Una etiqueta puede preceder a cualquier sentencia, incluido un bloque simple entre llaves, y break con esa etiqueta sale de él inmediatamente. No hace falta que sea un bucle ni un switch. Aquí se imprime "grande" y se salta el resto del bloque, sin afectar a la línea siguiente.'},

/* ---- ampliación 2: exc ---- */
{id:'e23',a:'exc',p:'¿Qué ocurre?',c:`class R implements AutoCloseable {
    public void close() { throw new IllegalStateException("del close"); }
}

try (R r = new R()) {
    System.out.println("cuerpo ok");
}`,
 o:['La excepción del close se propaga normalmente, sin marcarse como suprimida','Se pierde en silencio porque el cuerpo no falló','Se imprime "cuerpo ok" y el programa sigue como si nada','Lanza NullPointerException'],k:[0],
 e:'La supresión solo entra en juego cuando el cuerpo Y el cierre fallan a la vez: la del cuerpo se propaga y la del cierre queda guardada como suprimida. Si el cuerpo termina bien y solo falla el close, esa excepción se propaga tal cual, como cualquier otra.'},

{id:'e24',a:'exc',p:'¿Compila este método?',c:`static void procesa() throws java.io.IOException, java.sql.SQLException {
    try {
        operacion();
    } catch (Exception e) {
        throw e;
    }
}
// operacion() solo declara throws IOException, SQLException`,
 o:['No: el catch es de Exception, así que debería declarar throws Exception','Sí: el compilador infiere que solo puede relanzarse IOException o SQLException, porque e es efectivamente final','No compila porque Exception no se puede volver a lanzar','Solo compila si el catch usa multi-catch'],k:[1],
 e:'Desde Java 7, el "rethrow más preciso" analiza qué tipos puede realmente contener la variable capturada, siempre que no se reasigne dentro del catch. Aunque el catch declare Exception, el compilador sabe que solo IOException o SQLException pudieron originarse ahí y no exige declarar el genérico Exception.'},

{id:'e25',a:'exc',p:'¿Qué ocurre al ejecutar?',c:`class Config {
    static int valor = 10 / 0;
}
class Main {
    public static void main(String[] a) {
        System.out.println(Config.valor);
    }
}`,
 o:['Imprime 0','Lanza ArithmeticException directamente','Lanza ExceptionInInitializerError, con la ArithmeticException como causa','No compila'],k:[2],
 e:'Una excepción producida durante la inicialización estática de una clase se envuelve en ExceptionInInitializerError, un Error, no la excepción original. La causa original se recupera con getCause(). Además, tras un fallo así, la clase queda marcada como no inicializable y futuros usos lanzan NoClassDefFoundError.'},

{id:'e26',a:'exc',p:'¿Qué imprime?',c:`class StockException extends Exception {
    StockException(String msg, Throwable causa) { super(msg, causa); }
}

try {
    try {
        throw new IllegalStateException("sin conexión");
    } catch (IllegalStateException e) {
        throw new StockException("no se pudo actualizar el stock", e);
    }
} catch (StockException e) {
    System.out.println(e.getMessage() + " / " + e.getCause().getMessage());
}`,
 o:['no se pudo actualizar el stock / sin conexión','sin conexión / no se pudo actualizar el stock','no se pudo actualizar el stock / null','No compila'],k:[0],
 e:'El constructor Throwable(String, Throwable) está disponible incluso en excepciones propias que lo declaren así, y permite encadenar la causa original. getMessage() devuelve el mensaje de la excepción envolvente y getCause() la excepción original que la provocó, preservando el contexto completo del fallo.'},

{id:'e27',a:'exc',p:'¿Qué imprime?',c:`for (int i = 0; i < 3; i++) {
    try {
        if (i == 1) continue;
        System.out.print(i);
    } finally {
        System.out.print("f");
    }
}`,
 o:['0f1f2f','0ff2f','012f','0f f2f'],k:[1],
 e:'finally se ejecuta siempre al abandonar el try, sea por continue, por break, por una excepción o por terminación normal. En i=0 se imprime "0" y luego "f". En i=1, continue salta la impresión del cuerpo pero no evita el finally, que igualmente imprime "f". En i=2 se repite el patrón de i=0. El resultado es "0f" + "f" + "2f".'},

{id:'e28',a:'exc',p:'Desde Java 15, ¿qué aportan por defecto los mensajes de una NullPointerException?',c:`String s = null;
s.length();`,
 o:['Nada nuevo, siguen siendo genéricos','Un mensaje que detalla qué variable o expresión era null, como Cannot invoke String.length() because s is null','El número de línea únicamente','El valor esperado si no hubiera sido null'],k:[1],
 e:'Los mensajes útiles de NullPointerException, estabilizados en Java 15, describen exactamente qué referencia era null y qué operación se intentaba, en vez de un genérico "NullPointerException" sin más contexto. Ahorra mucho tiempo de depuración en cadenas de llamadas encadenadas.'},

{id:'e29',a:'exc',p:'¿Qué captura este bloque?',c:`try {
    riesgoso();
} catch (Throwable t) {
    System.out.println("capturado: " + t.getClass().getSimpleName());
}`,
 o:['Solo las excepciones comprobadas','Cualquier Exception, pero ningún Error','Tanto excepciones como Error, incluidos StackOverflowError u OutOfMemoryError','No compila: Throwable no se puede capturar'],k:[2],
 e:'Throwable es la raíz de toda la jerarquía, así que un catch de Throwable atrapa también los Error, algo que ni Exception ni RuntimeException hacen. Suele desaconsejarse porque un Error normalmente señala un fallo del que no tiene sentido intentar recuperarse, como quedarse sin memoria.'},

{id:'e30',a:'exc',p:'¿Qué se propaga?',c:`static void m() {
    try {
        throw new RuntimeException("original");
    } finally {
        throw new IllegalStateException("del finally");
    }
}`,
 o:['Las dos, la del finally como suprimida de la original','Solo la del finally: la original se descarta sin dejar rastro','Solo la original: el finally no puede lanzar','No compila'],k:[1],
 e:'Cuando un finally lanza su propia excepción, sustituye a la que venía propagándose del try, exactamente igual que haría un return dentro del finally. A diferencia de try-with-resources, aquí no hay ningún mecanismo de supresión: la excepción original simplemente se pierde, sin quedar accesible en ningún sitio.'},

/* ---- ampliación 2: io ---- */
{id:'i23',a:'io',p:'¿Qué diferencia hay entre Files.list(dir) y Files.walk(dir)?',c:`Stream<Path> hijos = Files.list(dir);
Stream<Path> todos = Files.walk(dir);`,
 o:['Son idénticos','Files.list solo devuelve los hijos directos; Files.walk recorre también los subdirectorios','Files.walk no incluye archivos, solo directorios','Files.list no necesita cerrarse y Files.walk sí'],k:[1],
 e:'Files.list produce un Stream<Path> con el contenido inmediato de un directorio, sin bajar a subcarpetas. Files.walk recorre el árbol completo hasta la profundidad indicada, por defecto sin límite. Los dos devuelven streams perezosos que hay que cerrar con try-with-resources.'},

{id:'i24',a:'io',p:'¿Qué hace Files.mismatch(a, b)?',c:`long pos = Files.mismatch(a, b);
System.out.println(pos);`,
 o:['Compara los nombres de los dos archivos','Devuelve -1 si el contenido es idéntico, o la posición del primer byte distinto','Lanza excepción si los archivos difieren','Compara solo las fechas de modificación'],k:[1],
 e:'Files.mismatch, de Java 12, compara el contenido byte a byte de dos archivos de forma eficiente y devuelve -1 si son idénticos, o el índice del primer byte que difiere. Es más directo que leer y comparar manualmente los bytes con Files.readAllBytes.'},

{id:'i25',a:'io',p:'Desde Java 18, ¿qué codificación usa por defecto un new FileReader(archivo) sin especificar Charset?',c:`var r = new FileReader("datos.txt");`,
 o:['La del locale del sistema operativo, como antes','UTF-8, salvo que se indique otra explícitamente','ISO-8859-1 siempre','Depende de la extensión del archivo'],k:[1],
 e:'JEP 400 fija UTF-8 como la codificación por defecto de la plataforma desde Java 18, en vez del comportamiento anterior, que dependía del locale y la configuración del sistema operativo. Aun así, la práctica recomendada sigue siendo pasar el Charset de forma explícita para no depender de defaults.'},

{id:'i26',a:'io',p:'¿Qué ocurre?',c:`Scanner sc = new Scanner("abc 42");
System.out.println(sc.nextInt());`,
 o:['Imprime 0','Lanza InputMismatchException y el puntero no avanza sobre ese token','Imprime 42, saltándose "abc"','Lanza NoSuchElementException'],k:[1],
 e:'nextInt() exige que el siguiente token completo sea un entero válido; como "abc" no lo es, lanza InputMismatchException sin consumirlo. Para saltar el token inválido hay que leerlo con next() antes de reintentar, o usar hasNextInt() para comprobarlo primero.'},

{id:'i27',a:'io',p:'¿Cuándo devuelve null System.console()?',c:`Console con = System.console();
if (con != null) {
    con.readPassword("clave: ");
}`,
 o:['Nunca, siempre hay una consola disponible','Cuando la JVM no está asociada a una consola real, por ejemplo al redirigir la entrada desde un archivo o ejecutar desde un IDE','Solo en sistemas sin teclado','Cuando no hay permisos de administrador'],k:[1],
 e:'System.console() devuelve null si el proceso no tiene una consola interactiva asociada, algo habitual al redirigir System.in desde un archivo o al lanzar el programa desde muchos IDE. Por eso hay que comprobar el resultado antes de llamar a métodos como readPassword().'},

{id:'i28',a:'io',p:'¿Qué problema tiene este código?',c:`try (var out = System.out) {
    out.println("hola");
}
System.out.println("adiós");`,
 o:['No compila: System.out no es AutoCloseable','Cierra la salida estándar; la segunda línea puede no imprimirse o fallar','Imprime "hola" dos veces','Ninguno, es la forma recomendada'],k:[1],
 e:'PrintStream implementa AutoCloseable, así que compila, pero cerrar System.out cierra el flujo de salida estándar del proceso para el resto del programa. Los flujos estándar no deben cerrarse desde la aplicación: solo hay que cerrar los recursos que uno mismo abre.'},

/* ---- ampliación 2: conc ---- */
{id:'k25',a:'conc',p:'¿Qué garantiza Thread.setPriority(Thread.MAX_PRIORITY)?',c:`Thread t = new Thread(tarea);
t.setPriority(Thread.MAX_PRIORITY);
t.start();`,
 o:['Que ese hilo se ejecute siempre antes que los demás','Nada garantizado: es solo una sugerencia al planificador, que el sistema operativo puede ignorar','Que el hilo se vuelva daemon','Que el hilo no pueda ser interrumpido'],k:[1],
 e:'La prioridad de un hilo es una pista para el planificador, no una garantía. El sistema operativo subyacente decide cómo repartir la CPU y puede ignorarla por completo. No hay que diseñar la corrección de un programa contando con un orden de ejecución basado en prioridades.'},

{id:'k26',a:'conc',p:'¿Qué diferencia hay entre Thread.interrupted() y t.isInterrupted()?',c:`if (Thread.interrupted()) {
    // consulta el hilo actual y BORRA su bandera
}
if (t.isInterrupted()) {
    // consulta t sin borrar nada
}`,
 o:['Son sinónimos','interrupted() es estático, consulta el hilo actual y BORRA la bandera; isInterrupted() solo consulta, sin borrarla','isInterrupted() borra la bandera y interrupted() no','interrupted() lanza InterruptedException directamente'],k:[1],
 e:'El método estático Thread.interrupted() siempre actúa sobre el hilo que lo invoca y, además de devolver el estado, lo resetea a false. El método de instancia isInterrupted() se puede llamar sobre cualquier hilo y deja la bandera intacta. Confundirlos hace que una segunda comprobación no vea la interrupción real.'},

{id:'k27',a:'conc',p:'¿Qué ocurre?',c:`Object candado = new Object();
candado.wait();`,
 o:['El hilo espera indefinidamente','Lanza IllegalMonitorStateException: hay que poseer el monitor del objeto','Lanza InterruptedException siempre','No compila'],k:[1],
 e:'wait(), notify() y notifyAll() solo se pueden invocar desde dentro de un bloque o método synchronized sobre ese mismo objeto, porque necesitan que el hilo posea su monitor. Llamarlos sin tenerlo lanza IllegalMonitorStateException en tiempo de ejecución.'},

{id:'k28',a:'conc',p:'Sin configuración adicional, ¿en qué pool de hilos se ejecuta un stream paralelo?',c:`lista.parallelStream()
     .map(this::procesar)
     .collect(Collectors.toList());`,
 o:['Crea un ExecutorService nuevo cada vez','En el ForkJoinPool común de la aplicación, compartido con otros streams paralelos','En el hilo que llama, sin paralelismo real','En un hilo virtual por cada elemento'],k:[1],
 e:'Un stream paralelo usa por defecto ForkJoinPool.commonPool(), el mismo que comparten otras tareas paralelas de la aplicación, incluidas otras llamadas a parallel(). Eso puede generar contención si varias partes del programa lo usan a la vez sin coordinación; existe la posibilidad de ejecutar la operación dentro de un pool propio.'},

{id:'k29',a:'conc',p:'¿Qué devuelve CompletableFuture.allOf(f1, f2, f3)?',c:`CompletableFuture<Void> todos =
    CompletableFuture.allOf(f1, f2, f3);`,
 o:['Una lista con los tres resultados','Un CompletableFuture<Void> que se completa cuando terminan las tres, sin combinar sus resultados','El resultado del primero en terminar','Un array de resultados'],k:[1],
 e:'allOf sirve para esperar a que todas terminen, pero su tipo es CompletableFuture<Void>: no agrega los valores. Para obtenerlos hay que llamar a join() o get() sobre cada CompletableFuture original una vez que allOf se completó. anyOf, en cambio, sí devuelve como resultado el valor del primero que termine, tipado como Object.'},

{id:'k30',a:'conc',p:'¿Qué riesgo tiene usar ThreadLocal dentro de las tareas de un ExecutorService de tamaño fijo?',c:`ThreadLocal<String> contexto = new ThreadLocal<>();
// dentro de una tarea del pool
contexto.set(usuarioActual);
// ...
contexto.remove(); // imprescindible antes de terminar`,
 o:['Ninguno, cada tarea tiene su propio hilo','Los hilos del pool se reutilizan entre tareas, así que un valor no limpiado puede filtrarse a una tarea posterior','ThreadLocal no funciona con executors','Provoca ConcurrentModificationException'],k:[1],
 e:'Un pool de tamaño fijo reutiliza los mismos hilos para tareas sucesivas, y un ThreadLocal vive asociado al hilo, no a la tarea. Si no se llama a remove() al terminar, el valor queda disponible para la siguiente tarea que caiga en ese mismo hilo, una fuga de datos y de memoria clásica en servidores de aplicaciones.'},

/* ---- ampliación 2: tipos ---- */
{id:'t26',a:'tipos',p:'¿Qué efecto tiene una barra invertida al final de una línea dentro de un bloque de texto?',c:`String s = """
    Hola \\
    Mundo""";`,
 o:['Es un error de sintaxis','Suprime el salto de línea, uniendo esa línea con la siguiente','Escapa las comillas triples de cierre','Inserta una tabulación'],k:[1],
 e:'Dentro de un bloque de texto, una barra invertida al final de una línea suprime el carácter de nueva línea que normalmente se insertaría ahí, uniendo el contenido con el de la línea siguiente sin salto entre medias. Es útil para dividir una línea larga en el código fuente sin que eso afecte al contenido final de la cadena.'},

{id:'t27',a:'tipos',p:'¿Para qué sirve la secuencia \\s dentro de un bloque de texto?',c:`String s = """
    uno\\s
    dos""";`,
 o:['Inserta un salto de línea','Representa un único espacio y evita que se elimine por ser un espacio final de línea','Marca el inicio de la sangría incidental','Es sinónimo de \\t'],k:[1],
 e:'Los espacios al final de cada línea de un bloque de texto se eliminan automáticamente al compilar. \\s se traduce en un único espacio que el compilador NO recorta, así que sirve para conservar espacios finales que sean significativos, por ejemplo antes de un salto de línea.'},

{id:'t28',a:'tipos',p:'¿Qué relación hay entre "Total: %d".formatted(5) y String.format(...)?',c:`String a = "Total: %d".formatted(5);
String b = String.format("Total: %d", 5);`,
 o:['formatted() es más lento pero produce lo mismo','a y b son iguales: formatted() es un método de instancia equivalente a pasar el propio texto como patrón a String.format','No compila la línea de a','formatted() no admite especificadores como %d'],k:[1],
 e:'formatted(), añadido en Java 15, es azúcar sintáctico: "patrón".formatted(args) hace exactamente lo mismo que String.format(patrón, args), pero permite encadenarlo de forma más legible al final de una cadena, sobre todo con bloques de texto largos.'},

{id:'t29',a:'tipos',p:'¿Qué imprime?',c:`System.out.println(-7 / 2);
System.out.println(Math.floorDiv(-7, 2));
System.out.println(-7 % 2);
System.out.println(Math.floorMod(-7, 2));`,
 o:['-3, -3, -1 y -1','-3, -4, -1 y 1','-4, -3, 1 y -1','-3, -4, 1 y 1'],k:[1],
 e:'La división entera trunca hacia cero: -7 / 2 da -3. Math.floorDiv redondea hacia menos infinito, así que da -4. El resto % conserva el signo del dividendo y da -1. Math.floorMod siempre da un resultado del mismo signo que el divisor, aquí positivo: 1. floorDiv y floorMod son la pareja consistente que conviene usar al trabajar con negativos, por ejemplo en aritmética de índices circulares.'},

{id:'t30',a:'tipos',p:'¿Qué imprime?',c:`String a = new String("hola");
String b = "hola";
System.out.println(a == b);
System.out.println(a.intern() == b);`,
 o:['true y true','false y true','false y false','true y false'],k:[1],
 e:'new String(...) crea siempre un objeto nuevo en el montón, distinto del literal que vive en el pool de cadenas, así que a == b da false. intern() busca o inserta esa cadena en el pool y devuelve la referencia compartida, que sí coincide con la del literal b.'},

/* ---- ampliación 2: col ---- */
{id:'c27',a:'col',p:'¿Qué imprime?',c:`List<String> base = new ArrayList<>(List.of("a", "b"));
List<String> vista = Collections.unmodifiableList(base);
base.add("c");
System.out.println(vista);`,
 o:['[a, b]','[a, b, c]','Lanza ConcurrentModificationException','UnsupportedOperationException al leer vista'],k:[1],
 e:'Collections.unmodifiableList devuelve una VISTA de solo lectura sobre la lista original, no una copia independiente: los cambios hechos directamente sobre base se reflejan en vista. Lo que impide es modificar a través de la propia vista, con add o set sobre ella. Para una copia realmente inmune a cambios posteriores hace falta List.copyOf(base).'},

{id:'c28',a:'col',p:'¿Qué garantiza el orden de iteración de un PriorityQueue?',
 o:['El orden natural de sus elementos','Ninguno: solo peek() y poll() garantizan devolver el menor según el orden establecido','El orden de inserción','El orden inverso al de inserción'],k:[1],
 e:'PriorityQueue se implementa como un montón binario, y su iterador NO recorre los elementos en ningún orden particular. Lo único garantizado es que peek() y poll() siempre entregan el elemento más pequeño según el comparador u orden natural configurado. Confundir esto con un recorrido ordenado es un error frecuente.'},

{id:'c29',a:'col',p:'¿Qué imprime?',c:`List<String> l = new ArrayList<>(List.of("a", "bb", "c"));
Iterator<String> it = l.iterator();
while (it.hasNext()) {
    if (it.next().length() == 1) it.remove();
}
System.out.println(l);`,
 o:['Lanza ConcurrentModificationException','[bb]','[a, c]','[a, bb, c]'],k:[1],
 e:'A diferencia de llamar a list.remove() dentro de un for-each, usar el propio método remove() del Iterator sí está permitido mientras se recorre: mantiene sincronizado el contador interno del iterador con la modificación. Es la forma correcta de filtrar una colección mientras se itera, junto con removeIf.'}

];
