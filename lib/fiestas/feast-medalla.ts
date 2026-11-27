// La noche del 27: contenido de la experiencia del día de la fiesta de la Medalla Milagrosa.
// El relato de las tres apariciones es el del sitio oficial de la Capilla de la Rue du Bac
// (medaillemiraculeuse.org/es/saber/las-apariciones-de-la-virgen-maria, consultado el
// 27-11-2026): se copió tal cual, solo uniendo frases seguidas. Antes se usaba el resumen
// del Manual de JMV, que tenía tres imprecisiones (la Virgen no fue una «imagen»: Catalina
// la vio y habló con ella; la segunda aparición fue a las 17:30, durante la oración de la
// tarde, no «por la noche»; y la inscripción va en el anverso, la M y la cruz en el reverso).
// Del Manual de JMV y de la novena «Milagrosa, abres caminos» (2026) quedan el deseo de la
// Asociación, las primeras medallas y el nombre. La fuente de cada texto se anota aquí
// (no se muestra en pantalla).

export type FeastArt = "anio" | "capilla" | "estrellas" | "virgen" | "medalla" | "rayos" | "luz" | "servicio" | "nombre";

export interface FeastSlide {
  kicker: string;
  art: FeastArt;
  text: string;
}

export const FEAST_STORY: FeastSlide[] = [
  {
    // Capilla de la Rue du Bac, «Las manifestaciones de 1830»
    kicker: "París, 1830",
    art: "anio",
    text: "En 1830, en la capilla de la Rue du Bac de París, la Virgen María se le apareció tres veces a una joven Hija de la Caridad: santa Catalina Labouré. Catalina tiene 24 años. Es hermana del Seminario (novicia) y tiene un profundo deseo de ver a la Virgen María.",
  },
  {
    // Capilla de la Rue du Bac, «La noche del 18 al 19 de julio de 1830»
    kicker: "Primera aparición · noche del 18 al 19 de julio",
    art: "capilla",
    text: "Hacia las 23:30, Catalina oye que la llaman por su nombre. Hay un niño ahí, al pie de su cama. Le dice: «La Virgen te está esperando». Se levanta, se viste y lo sigue hasta la capilla. Todo el camino está iluminado.",
  },
  {
    // Capilla de la Rue du Bac, «La noche del 18 al 19 de julio de 1830»
    kicker: "A los pies de María",
    art: "luz",
    text: "Al llegar a la capilla, oye algo que suena como el roce de un vestido de seda. El niño le dice: «Aquí está la Santísima Virgen». Catalina se acerca, se arrodilla y pone las manos sobre las rodillas de María, que está sentada en un sillón. La Virgen le habla largo y tendido: «Venid al pie de este altar. Allí se derramarán las gracias sobre todos los que las pidan con confianza y fervor».",
  },
  {
    // Manual de JMV, «¿Cuándo y cómo nació JMV?»
    kicker: "El deseo de la Virgen",
    art: "estrellas",
    text: "En su primera aparición la Virgen revela a Catalina su deseo de que se forme una Asociación de jóvenes que imiten a su hijo Jesús, y a la que concedería abundantes gracias, pues ella misma sería su protectora.",
  },
  {
    // Capilla de la Rue du Bac, «El 27 de noviembre de 1830»
    kicker: "Segunda aparición · 27 de noviembre",
    art: "virgen",
    text: "La segunda aparición tuvo lugar el 27 de noviembre de 1830, sobre las 17:30, durante la oración de la tarde. Catalina ve primero a la Virgen de pie sobre medio globo terráqueo, aplastando a una serpiente. Sostiene en sus manos un globo coronado por una cruz.",
  },
  {
    // Capilla de la Rue du Bac, «El 27 de noviembre de 1830»
    kicker: "Los rayos de sus manos",
    art: "rayos",
    text: "Las manos de María se abren y unos rayos de luz descienden hacia la tierra. Catalina oye: «Estos rayos son las gracias que derramo sobre quienes me las piden».",
  },
  {
    // Capilla de la Rue du Bac, «El 27 de noviembre de 1830». La oración va con las palabras
    // con que la rezamos en la novena («recurrimos»; el sitio de la Capilla traduce «acudimos»).
    kicker: "La Medalla",
    art: "medalla",
    text: "Alrededor de la Virgen aparece entonces esta oración: «Oh María, sin pecado concebida, ruega por nosotros que recurrimos a ti». A continuación, la imagen da un giro: una cruz encima de la letra M, dos corazones, doce estrellas. La Virgen le dijo: «Haced que se acuñe una medalla según este diseño. Los que la lleven con confianza recibirán grandes gracias».",
  },
  {
    // Capilla de la Rue du Bac, «Diciembre de 1830»
    kicker: "Tercera aparición · diciembre de 1830",
    art: "luz",
    text: "La tercera aparición tuvo lugar en diciembre de 1830 (no se sabe la fecha exacta). Esta vez, la Virgen se aparece cerca del altar, junto al sagrario. Le confirma su misión a Catalina y le dice: «Ya no me volveréis a ver».",
  },
  {
    // Novena, Anexo V
    kicker: "1832 · Las primeras medallas",
    art: "servicio",
    text: "En 1832, durante la epidemia de cólera parisina, comenzaron a distribuirse las primeras medallas acuñadas. En este origen encontramos una relación elocuente entre confianza en María y servicio concreto a los enfermos y a los pobres.",
  },
  {
    // Manual de JMV, «El nombre de la Medalla»
    kicker: "El nombre",
    art: "nombre",
    text: "La Medalla se llamaba originalmente «de la Inmaculada Concepción», pero al expandirse la devoción y haber tantos milagros concedidos a través de ella, se le llamó popularmente «La Medalla Milagrosa».",
  },
];

export interface FeastRoot {
  year: string;
  place: string;
  text: string;
}

// Manual de JMV, «¿Cuándo y cómo nació JMV?»
export const FEAST_ROOTS: FeastRoot[] = [
  { year: "1830", place: "París", text: "JMV tiene su origen el 18 de julio de 1830, en París, a partir de las apariciones de la Santísima Virgen María a Santa Catalina Labouré." },
  { year: "1847", place: "Roma", text: "La Asociación de Hijas de María fue aprobada por el Romano Pontífice Pío IX el 20 de junio de 1847." },
  { year: "1995", place: "Ecuador", text: "Juventudes Marianas Vicencianas fue fundada en el Ecuador el 18 de julio de 1995." },
];

/** Manual de JMV, presentación */
export const FEAST_CHAIN =
  "En JMV no eres uno más, tú eres una pieza clave de esa cadena de esperanza y amor que empezó en París en 1830, llegando esa semilla al Ecuador en 1995.";

/**
 * El momento final: recibir la Medalla (no es la consagración mariana).
 * Textos de la novena: «Oración para todos los días» y «Al concluir la novena».
 */
export const FEAST_ACCEPT = {
  kicker: "El momento de todos",
  title: "Recibo la Medalla",
  button: "La llevo en mi corazón",
  done: "Ya la llevas en tu corazón. Tu estrella está en el cielo.",
  hint: "Reza despacio. Al terminar, toca el botón y se encenderá tu estrella junto a las de tu comunidad.",
  shareHeadline: "Llevo la Medalla en mi corazón",
  /** Va en la imagen que se comparte: el camino recorrido (redactado a pedido del equipo) */
  shareMessage: "Caminé los nueve días de la novena y hoy celebro a María. ¡Milagrosa, abres caminos!",
  text: [
    "Que no busquemos en la medalla un amuleto, sino un recuerdo vivo de tu amor y una llamada a seguirte. Que al llevarla sobre nuestro pecho llevemos también tu Palabra a nuestras decisiones y tu caridad a nuestras obras.",
    "Que la medalla que portamos nos recuerde cada día que pertenecemos a Cristo y que estamos llamados a reconocerlo en nuestros hermanos.",
    "Oh María, sin pecado concebida, ruega por nosotros que recurrimos a ti.",
  ],
};

/** Orden en que se arma la Medalla en la celebración: primero el anverso, luego el reverso */
export const FEAST_PIECES: { id: string; face: "front" | "back" }[] = [
  { id: "rayos", face: "front" },
  { id: "globo", face: "front" },
  { id: "serpiente", face: "front" },
  { id: "inscripcion", face: "front" },
  { id: "maria", face: "front" },
  { id: "m", face: "back" },
  { id: "cruz", face: "back" },
  { id: "corazones", face: "back" },
  { id: "estrellas", face: "back" },
];
